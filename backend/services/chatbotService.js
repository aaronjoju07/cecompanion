// services/chatbotService.js
const path = require('path');
const fs = require('fs');
const { PyPDFLoader } = require('langchain/document_loaders');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitters');
const { FAISS } = require('langchain/vectorstores');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('langchain-google-genai');
const { ConversationalRetrievalChain } = require('langchain/chains');
const { ConversationBufferMemory } = require('langchain/memory');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

class ChatbotService {
  constructor() {
    this.vectorStores = new Map();
    this.conversationChains = new Map();
    this.embeddings = new GoogleGenerativeAIEmbeddings({ 
      model: "models/embedding-001",
      apiKey: process.env.GOOGLE_API_KEY 
    });
    this.pdfDir = path.join(__dirname, '../pdfs');
    this.initializeVectorStores();
  }

  async initializeVectorStores() {
    if (!fs.existsSync(this.pdfDir)) {
      fs.mkdirSync(this.pdfDir);
    }

    const pdfFiles = fs.readdirSync(this.pdfDir).filter(file => file.endsWith('.pdf'));
    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(this.pdfDir, pdfFile);
      await this.processPDF(pdfPath);
    }
  }

  async processPDF(pdfPath) {
    try {
      const loader = new PyPDFLoader(pdfPath);
      const documents = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1500,
        chunkOverlap: 150
      });
      const chunks = await textSplitter.splitDocuments(documents);

      const vectorStore = await FAISS.fromDocuments(chunks, this.embeddings);
      const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0.2,
        apiKey: process.env.GOOGLE_API_KEY,
        convertSystemMessageToHuman: true
      });

      const memory = new ConversationBufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        outputKey: 'answer'
      });

      const conversationChain = ConversationalRetrievalChain.fromLLM({
        llm,
        retriever: vectorStore.asRetriever({ searchKwargs: { k: 5 } }),
        memory,
        returnSourceDocuments: true
      });

      const pdfName = path.basename(pdfPath);
      this.vectorStores.set(pdfName, vectorStore);
      this.conversationChains.set(pdfName, conversationChain);
    } catch (error) {
      console.error(`Error processing PDF ${pdfPath}:`, error);
    }
  }

  async addNewPDF(pdfPath) {
    await this.processPDF(pdfPath);
  }

  async getDBContext(userId, question) {
    const registrations = await Registration.find({ user: userId })
      .populate('event')
      .lean();

    const upcomingEvents = registrations.filter(reg => 
      new Date(reg.event.conductedDates.start) > new Date()
    );
    const pastEvents = registrations.filter(reg => 
      new Date(reg.event.conductedDates.start) <= new Date()
    );

    let context = '';
    if (question.toLowerCase().includes('upcoming events')) {
      context += 'Upcoming events you\'re registered for:\n' + 
        upcomingEvents.map(e => `- ${e.event.name} (Start: ${new Date(e.event.conductedDates.start).toLocaleString()})`).join('\n');
    }
    if (question.toLowerCase().includes('current event') || question.toLowerCase().includes('registered')) {
      context += 'Your registered events:\n' + 
        registrations.map(e => `- ${e.event.name} (Start: ${new Date(e.event.conductedDates.start).toLocaleString()})`).join('\n');
    }
    if (question.toLowerCase().includes('location')) {
      context += 'Event locations:\n' + 
        registrations.map(e => `- ${e.event.name}: ${e.event.venue || 'Not specified'}`).join('\n');
    }

    return context;
  }

  async processQuestion(userId, question) {
    const dbContext = await this.getDBContext(userId, question);
    let fullResponse = dbContext ? `${dbContext}\n\n` : '';

    for (const [pdfName, conversationChain] of this.conversationChains) {
      try {
        const response = await conversationChain({
          question: `${question}\nAdditional context: ${dbContext}`
        });
        
        fullResponse += `From ${pdfName}:\n${response.answer}\n\n`;
      } catch (error) {
        console.error(`Error querying ${pdfName}:`, error);
      }
    }

    return {
      answer: fullResponse || 'I couldn\'t find relevant information to answer your question.'
    };
  }
}

module.exports = ChatbotService;