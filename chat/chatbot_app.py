# chatbot_app.py
from flask import Flask, request, jsonify
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import os

app = Flask(__name__)

# Set Google API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyCQm0KhDrntN2VaiTi7aHCoVpZYFMQo_jg"  

# Initialize embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Dictionary to hold vector stores for each event
vector_stores = {}

def process_pdf(pdf_path, event_id):
    """Process a PDF and store its embeddings in FAISS."""
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=150)
    chunks = text_splitter.split_documents(documents)
    
    if event_id in vector_stores:
        # Merge with existing vector store for the event
        vector_stores[event_id].add_documents(chunks)
    else:
        # Create new vector store
        vector_stores[event_id] = FAISS.from_documents(chunks, embeddings)

def get_conversation_chain(vector_store):
    """Create a conversational chain for querying."""
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.5, convert_system_message_to_human=True)
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True, output_key="answer")
    return ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
        memory=memory,
        return_source_documents=True
    )

@app.route('/process_event_pdfs', methods=['POST'])
def process_event_pdfs():
    """Process multiple PDFs for an event."""
    event_id = request.form['event_id']
    pdf_files = request.files.getlist('pdfs')  # Handle multiple PDFs
    
    if not os.path.exists('pdfs'):
        os.makedirs('pdfs')
    
    for pdf_file in pdf_files:
        pdf_path = f"pdfs/{event_id}_{pdf_file.filename}"
        pdf_file.save(pdf_path)
        process_pdf(pdf_path, event_id)
    
    return jsonify({"message": "PDFs processed and vector store updated", "event_id": event_id})

@app.route('/chat', methods=['POST'])
def chat():
    """Handle student queries about events."""
    data = request.json
    question = data['question']
    event_id = data.get('event_id')  # Optional: query specific event
    registered_events = data.get('registered_events', [])  # List of event IDs or names
    
    if event_id:
        # Query specific event
        vector_store = vector_stores.get(event_id)
        if not vector_store:
            return jsonify({"error": "Event not found"}), 404
        conversation_chain = get_conversation_chain(vector_store)
        response = conversation_chain({"question": question})
        return jsonify({"answer": response["answer"]})
    else:
        # Query across all events with personalization
        if not vector_stores:
            return jsonify({"error": "No events processed yet"}), 404
        
        # Combine all vector stores for a general query
        combined_vector_store = list(vector_stores.values())[0]
        for vs in list(vector_stores.values())[1:]:
            combined_vector_store.merge_from(vs)
        
        conversation_chain = get_conversation_chain(combined_vector_store)
        
        # Personalize response if registered events are provided
        if registered_events and "next event" in question.lower():
            context = f"Student's registered events: {', '.join(registered_events)}. "
            question = context + question
        response = conversation_chain({"question": question})
        return jsonify({"answer": response["answer"]})

if __name__ == '__main__':
    app.run(debug=True, port=5001)