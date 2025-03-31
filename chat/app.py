import streamlit as st
from pymongo import MongoClient
import urllib, io, json
import google.generativeai as genai

# Configure Gemini API key
genai.configure(api_key="AIzaSyCQm0KhDrntN2VaiTi7aHCoVpZYFMQo_jg")

# MongoDB client
username = "ronidas"
pwd = "YFR85HiZLgqFtbPW"
client = MongoClient(
    "mongodb+srv://"
    + urllib.parse.quote(username)
    + ":"
    + urllib.parse.quote(pwd)
    + "@cluster0.lymvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
db = client["sample_airbnb"]
collection = db["listingsAndReviews"]

st.title("Talk to MongoDB with Gemini")
st.write("Ask anything and get an answer")

user_query = st.text_area("Enter your question here")

# Load sample examples for query generation
with io.open("sample.txt", "r", encoding="utf-8") as f1:
    sample_examples = f1.read()

# Prompt for generating MongoDB query
prompt_template = f"""
You are an expert AI assistant specialized in generating MongoDB aggregation pipeline queries. 
Strictly return only the query in valid JSON format without any additional text.

Schema:
{sample_examples}

User Question: {{question}}

MongoDB Aggregation Query (JSON format):
"""

if user_query:
    if st.button("Submit"):
        # Generate query using Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt_template.format(question=user_query))

        # Parse query from response
        try:
            query = json.loads(response.text)
            results = collection.aggregate(query)
            st.json(query)  # Display the query

            # Display results
            for result in results:
                st.write(result)
        except json.JSONDecodeError:
            st.error("Failed to parse the query. Please try again.")
