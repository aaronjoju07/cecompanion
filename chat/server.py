from flask_cors import CORS
from flask import Flask, request, jsonify
import os
import tempfile
from IPython.display import display, Markdown
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

app = Flask(__name__)
os.environ["GOOGLE_API_KEY"] = "AIzaSyCQm0KhDrntN2VaiTi7aHCoVpZYFMQo_jg"
CORS(app)  

UPLOAD_FOLDER = 'test_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload', methods=['POST'])
def extract_details():
    print("Request headers:", request.headers)  # Debug headers
    print("Request files:", request.files)      # Debug files
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']
    if pdf_file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_file.filename)
    pdf_file.save(pdf_path)

    try:
        vector_store = process_pdf(pdf_path)
        # conversation_chain = get_conversation_chain(vector_store)
        vector_store.save_local("faiss_index")
        return jsonify("Vector store saved to 'faiss_index' directory."), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)  # Clean up the uploaded file

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    question = data.get("question")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    # Add allow_dangerous_deserialization=True to the load_local call
    loaded_vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    loaded_conversation_chain = get_conversation_chain(loaded_vector_store)
    response = loaded_conversation_chain({"question": question})

    answer = response["answer"]
    return jsonify({"response": answer}), 200

def process_pdf(pdf_path):
    print(f"Loading PDF from {pdf_path}...")

    # Load the PDF
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    print(f"Loaded {len(documents)} pages from the PDF.")

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=150
    )
    chunks = text_splitter.split_documents(documents)

    print(f"Split into {len(chunks)} chunks.")

    # Create embeddings and vector store
    print("Creating embeddings and vector store...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_documents(chunks, embeddings)

    print("Vector store created successfully!")
    return vector_store

def get_conversation_chain(vector_store):
    # Initialize the Gemini model
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.2,
        convert_system_message_to_human=True
    )

    # Initialize memory for conversation history
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        # Explicitly set the output key to 'answer'
        output_key='answer'
    )

    # Create a conversational retrieval chain
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
        memory=memory,
        return_source_documents=True
    )

    return conversation_chain

if __name__ == '__main__':
    app.run(debug=True, port=5002)