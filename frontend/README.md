PDF Summarizer (Next.js Frontend)

This is a Next.js project for uploading PDF files, extracting text, and generating summaries. It connects to a Node.js backend API to handle PDF processing.

Getting Started

First, install dependencies and run the development server:

# Install dependencies
npm install
## or
yarn
## or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev


Open http://localhost:3000
 in your browser to see the app.

The frontend automatically reloads when you edit files in the app/ folder.

Project Structure

app/page.tsx – Main page for uploading PDFs and displaying parsed text and summaries.

Features

Upload PDF – Users can select a PDF file and upload it to the backend.

Parsed Text – Extracted text from the PDF is displayed in a read-only textarea.

Document Summary – Generates a concise summary using OpenAI API (if available) or local summarizer fallback.
