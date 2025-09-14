# PDF Summarizer (Fullstack)

A fullstack PDF summarizer built with **Next.js** (frontend) and **Node.js + Express** (backend).  
It allows users to upload PDF files, extract text, and generate summaries using **OpenAI API** (if available) or a **local summarizer fallback**. MongoDB can be used to save documents for later retrieval.

---

## I am adding the OpenAI key to test the development and am explicitly sending the .env file via WhatsApp.

## Project Structure


```
project/
├─ backend/
│ ├─ uploads/ # Temporary storage for uploaded PDFs
│ ├─ server.js # Backend entry point
│ ├─ package.json
│ ├─ README.md
│ ├─ routes/
│ │ └─ upload.js # API endpoints for upload & retrieval
│ ├─ services/
│ │ ├─ pdfService.js # PDF text extraction
│ │ └─ summarizer.js # Summarization (OpenAI + fallback)
│ └─ models/
│ └─ Document.js # MongoDB schema
├─ frontend/
│ ├─ app/
│ │ └─ page.tsx # Main page for uploading PDFs and viewing summaries
  ├─src/
│ │ └─ components/FetchByID and UploadPDF.
│ ├─ package.json
│ ├─ README.md
│ └─ ...other frontend files
└─ README.md # This combined project README
```

---

## Requirements

- Node.js 18+ / npm
- MongoDB (optional, for saving documents)
- OpenAI API key (optional, for improved summarization)

---

## Setup & Run

### Backend

1. Install dependencies:

```bash
cd backend
npm install
```

Configure environment variables (optional for MongoDB/OpenAI):

MONGO_URI — MongoDB connection string

OPENAI_API_KEY — OpenAI API key for summarization

Run the server:
```
npm run dev   # Development with nodemon
# or
npm start     # Production
```

Backend runs at http://localhost:8000

Uploaded PDFs are stored temporarily in backend/uploads/

## Frontend

Install dependencies:
```
cd frontend
npm install
```

Run development server:
```
npm run dev
```

Frontend runs at http://localhost:3000

Main page for uploading PDFs: app/page.tsx

## Features

Upload PDF — Select and upload a PDF to the backend.

Parsed Text — Display extracted text from the PDF.

Document Summary — Generated via OpenAI API (if key is available) or local summarizer fallback.

MongoDB Storage — Save parsed text and summary; retrieve via GET /api/documents/:id.

Fetch by ID — Retrieve previously saved documents using their MongoDB ID.

Clear Sections — Reset parsed text and summary for a fresh start.

## API Endpoints
### POST /api/upload

Form-data key: file (PDF)

Response:
```
{
  "parsedText": "...",
  "summary": "...",
  "id": "<optional MongoDB id>"
}
```

### GET /api/documents/:id

Fetch a saved document by ID (requires MongoDB)

Response:
```
{
  "parsedText": "...",
  "summary": "...",
  "id": "<MongoDB id>"
}
```
## Notes & Error Handling

Validates that uploaded files are PDFs (application/pdf).

Returns 400 if no file is uploaded or no text can be extracted.

PDFs are stored temporarily in uploads/; optional auto-delete available in upload.js.

**Summarization uses OpenAI first (if API key exists), with a fallback to the local summarizer.**

## Frontend Enhancements

Tabbed UI — Switch between uploading PDFs and fetching by ID.

Loader — Shows a spinner during upload/fetch operations.

Clear Button — Clears summary and parsed text.
