const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Event } = require('../models/Event');
const Registration = require('../models/Registration');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const functionImplementations = {
  get_upcoming_events: async (args, userId) => {
    const currentDate = new Date();
    const events = await Event.find({
      'conductedDates.start': { $gte: currentDate },
      status: 'upcoming',
    }).select('name description conductedDates');
    return JSON.stringify(events);
  },
  get_event_details: async (args, userId) => {
    const { eventName } = args;
    const event = await Event.findOne({ name: eventName });
    if (!event) return JSON.stringify({ error: 'Event not found' });
    return JSON.stringify(event);
  },
  get_my_registrations: async (args, userId) => {
    const registrations = await Registration.find({ user: userId })
      .populate('event')
      .lean();
    const events = registrations.map(r => r.event);
    return JSON.stringify(events);
  },
};

const tools = [
  {
    functionDeclarations: [
      { name: 'get_upcoming_events', description: 'Get a list of upcoming events' },
      {
        name: 'get_event_details',
        description: 'Get details of a specific event by name',
        parameters: {
          type: 'object',
          properties: {
            eventName: { type: 'string', description: 'The name of the event' },
          },
          required: ['eventName'],
        },
      },
      { name: 'get_my_registrations', description: 'Get the events the user is registered for' },
    ],
  },
];

class ChatbotService {
  async processQuestion(userId, question) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({ tools });

      // Send the user's question
      const result = await chat.sendMessage(question);
      const response = result.response;

      // Log the full response to understand its structure
      console.log('Raw API Response:', JSON.stringify(response, null, 2));

      // Extract text and function calls safely
      const text = response.text && typeof response.text === 'function' ? response.text() : response.text || '';
      const functionCalls = response.functionCalls || (response.candidates && response.candidates[0]?.content?.parts?.filter(part => part.functionCall)?.map(part => part.functionCall)) || [];

      console.log('Extracted Text:', text);
      console.log('Extracted Function Calls:', functionCalls);

      // Handle function calls if present
      if (functionCalls.length > 0) {
        const functionCall = functionCalls[0];
        if (functionCall && functionCall.name && functionImplementations[functionCall.name]) {
          const { name, args } = functionCall;
          const functionResult = await functionImplementations[name](args || {}, userId);
          const functionResponse = await chat.sendMessage([
            {
              role: 'function',
              parts: [{ functionResponse: { name, response: { content: functionResult } } }],
            },
          ]);
          return { answer: functionResponse.response.text() || 'Function executed, but no response text available.' };
        } else {
          return { answer: 'Invalid function call received from the API.' };
        }
      }

      // Return text response if no function calls
      return { answer: text || 'No response available.' };
    } catch (error) {
      console.error('Chatbot Processing Error:', error);
      throw error; // Let the route handler catch and respond
    }
  }
}

module.exports = new ChatbotService();