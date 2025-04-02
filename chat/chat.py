from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import pdfplumber
import re

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from Next.js

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def extract_event_details(pdf_path):
    """Extract structured event details from the PDF."""
    event_data = {
        "name": "",
        "description": "",
        "conductedDates": {"start": "", "end": ""},
        "targetedAudience": {"departments": [], "courses": []},
        "organizingInstitution": "",
        "organizingCollege": "",
        "maximumStudents": "",
        "maxEventsPerStudent": "",
        "generalRules": [],
        "contactInfo": {"email": "", "phone": ""},
        "subEvents": []
    }

    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""

    # Extract event name
    event_name_match = re.search(r"Computer Science Fest \d{4}", text)
    if event_name_match:
        event_data["name"] = event_name_match.group(0)

    # Extract description (assuming it's the overview section)
    overview_match = re.search(r"Event Overview\n(.+?)(?=Event Details)", text, re.DOTALL)
    if overview_match:
        event_data["description"] = overview_match.group(1).strip()

    # Extract dates
    date_match = re.search(r"Date: ([\w\s\d-]+) to ([\w\s\d-]+)", text)
    if date_match:
        start_date = date_match.group(1).strip() + ", 2025 09:00:00"  # Assuming 9 AM start
        end_date = date_match.group(2).strip() + ", 2025 18:00:00"    # Assuming 6 PM end
        event_data["conductedDates"]["start"] = start_date
        event_data["conductedDates"]["end"] = end_date
    else:
        date_simple = re.search(r"Date: (April \d{2}-\d{2}, \d{4})", text)
        if date_simple:
            event_data["conductedDates"]["start"] = date_simple.group(1) + " 09:00:00"
            event_data["conductedDates"]["end"] = date_simple.group(1) + " 18:00:00"

    # Extract organizing institution
    org_match = re.search(r"Organized By: (.+?)(?=Date:)", text, re.DOTALL)
    if org_match:
        event_data["organizingInstitution"] = org_match.group(1).strip()

    # Extract targeted audience
    audience_match = re.search(r"Target Audience: (.+?)(?=Key Highlights)", text, re.DOTALL)
    if audience_match:
        audience_text = audience_match.group(1).strip()
        if "Computer Science" in audience_text:
            event_data["targetedAudience"]["departments"] = ["Computer Science"]
        if "Students" in audience_text:
            event_data["targetedAudience"]["courses"] = ["B.Tech", "M.Tech"]  # Assuming common CS courses

    # Extract contact info
    email_match = re.search(r"Email: ([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})", text)
    if email_match:
        event_data["contactInfo"]["email"] = email_match.group(1)
    phone_match = re.search(r"Phone: ([+\d\s()-]+)", text)
    if phone_match:
        event_data["contactInfo"]["phone"] = phone_match.group(1)

    # Extract sub-events
    sub_event_sections = re.split(r"(Hackathon|Coding Competitions|Paper Presentations|Workshops)", text)[1:]
    for i in range(0, len(sub_event_sections), 2):
        name = sub_event_sections[i].strip()
        details = sub_event_sections[i + 1].strip()
        sub_event = {"name": name, "overview": "", "venue": "", "prizePools": []}

        # Extract overview (first few lines of details)
        overview_lines = details.split('\n')[:2]
        sub_event["overview"] = " ".join(overview_lines)

        # Extract venue (assuming it's mentioned with "Venue:")
        venue_match = re.search(r"Venue: (.+?)(?=\n|$)", text)
        if venue_match:
            sub_event["venue"] = venue_match.group(1).strip()

        # Extract prize pools for Hackathon and Coding Competition
        if name == "Hackathon":
            prize_match = re.search(r"Winner - \$(\d+).*Runner-up - \$(\d+)", details, re.DOTALL)
            if prize_match:
                sub_event["prizePools"] = [
                    {"rank": 1, "amount": float(prize_match.group(1))},
                    {"rank": 2, "amount": float(prize_match.group(2))}
                ]
        elif name == "Coding Competition":
            prize_match = re.search(r"Winner - \$(\d+).*Runner-up - \$(\d+)", details, re.DOTALL)
            if prize_match:
                sub_event["prizePools"] = [
                    {"rank": 1, "amount": float(prize_match.group(1))},
                    {"rank": 2, "amount": float(prize_match.group(2))}
                ]
        elif name == "Paper Presentations":
            prize_match = re.search(r"Winner - \$(\d+).*Runner-up - \$(\d+)", details, re.DOTALL)
            if prize_match:
                sub_event["prizePools"] = [
                    {"rank": 1, "amount": float(prize_match.group(1))},
                    {"rank": 2, "amount": float(prize_match.group(2))}
                ]

        event_data["subEvents"].append(sub_event)

    return event_data

@app.route('/extract-event-details', methods=['POST'])
def extract_details():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']
    if pdf_file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_file.filename)
    pdf_file.save(pdf_path)

    try:
        extracted_data = extract_event_details(pdf_path)
        return jsonify(extracted_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)  # Clean up the uploaded file

if __name__ == '__main__':
    app.run(debug=True, port=5001)