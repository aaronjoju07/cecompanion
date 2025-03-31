const { Document } = require('langchain/document');
const { FAISS } = require('langchain/vectorstores');
const { GoogleGenerativeAIEmbeddings } = require('langchain-google-genai');
const { ChatGoogleGenerativeAI } = require('langchain-google-genai');
const { ConversationalRetrievalChain } = require('langchain/chains');
const { ConversationBufferMemory } = require('langchain/memory');
const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

// Helper functions to create text documents from database data
function createEventDocument(event) {
  return `Event ID: ${event._id}, Name: ${event.name}, Description: ${event.description}, Start Date: ${event.conductedDates.start}, End Date: ${event.conductedDates.end}, Venue: ${event.venue || 'Not specified'}, Status: ${event.status}, Organizer: ${event.organizer}, Targeted Departments: ${event.targetedAudience.departments.join(', ')}, Targeted Courses: ${event.targetedAudience.courses.join(', ')}`;
}

function createUserDocument(user) {
  return `User ID: ${user._id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Course: ${user.course}, Department: ${user.department}`;
}

function createRegistrationDocument(registration) {
  return `Registration ID: ${registration._id}, User ID: ${registration.user._id}, Username: ${registration.user.username}, Event ID: ${registration.event._id}, Event Name: ${registration.event.name}, Status: ${registration.status}`;
}

class ChatbotService {
  constructor() {
    // Initialize embeddings for vector store
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
      apiKey: process.env.GOOGLE_API_KEY
    });

    // Initial setup of vector store
    this.initializeVectorStore();

    // Schedule vector store refresh every hour
    cron.schedule('0 * * * *', async () => {
      console.log('Refreshing vector store...');
      await this.initializeVectorStore();
    });
  }

  async initializeVectorStore() {
    try {
      // Fetch all data from MongoDB
      const events = await Event.find().lean();
      const users = await User.find().lean();
      const registrations = await Registration.find().populate('user').populate('event').lean();

      // Create LangChain Document objects
      const allDocs = [
        ...events.map(event => new Document({
          pageContent: createEventDocument(event),
          metadata: { type: 'event', id: event._id }
        })),
        ...users.map(user => new Document({
          pageContent: createUserDocument(user),
          metadata: { type: 'user', id: user._id }
        })),
        ...registrations.map(reg => new Document({
          pageContent: createRegistrationDocument(reg),
          metadata: { type: 'registration', id: reg._id }
        }))
      ];

      // Create FAISS vector store
      this.vectorStore = await FAISS.fromDocuments(allDocs, this.embeddings);

      // Set up the language model
      const llm = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0.2,
        apiKey: process.env.GOOGLE_API_KEY,
        convertSystemMessageToHuman: true
      });

      // Set up conversation memory
      const memory = new ConversationBufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        outputKey: 'answer'
      });

      // Custom QA prompt to enforce "I don't know" when information is missing
      const qaTemplate = `
You are an AI assistant that helps users with questions about their event registrations. You have access to the following context from the database:

{context}

Your task is to read the user's query and the provided context, and then generate a helpful and accurate response.

If the context does not provide enough information to answer the query, say "I'm sorry, I don't have enough information to answer that question."

Otherwise, use the context to formulate your response.

Human: {question}
Assistant:
      `;

      // Create the conversational retrieval chain
      this.conversationChain = ConversationalRetrievalChain.fromLLM({
        llm,
        retriever: this.vectorStore.asRetriever({ searchKwargs: { k: 5 } }),
        memory,
        returnSourceDocuments: true,
咕咕咕qaTemplate: qaTemplate
      });

      console.log('Vector store initialized successfully.');
    } catch (error) {
      console.error('Error initializing vector store:', error);
    }
  }

  async processQuestion(userId, question) {
    try {
      // Modify the question to include user context
      const modifiedQuestion = `For user ${userId}: ${question}`;

      // Get response from the conversational chain
      const response = await this.conversationChain({
        question: modifiedQuestion
      });

      return {
        answer: response.answer || "I'm sorry, I don't have enough information to answer that question."
      };
    } catch (error) {
      console.error('Error processing question:', error);
      return { answer: "I'm sorry, there was an error processing your question." };
    }
  }
}

module.exports = ChatbotService;