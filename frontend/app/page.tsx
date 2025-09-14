"use client";

import FetchByID from "@/src/components/FetchByID";
import UploadPDF from "@/src/components/UploadPDF";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "fetch">("upload");
  const [summary, setSummary] = useState("");
  const [parsedText, setParsedText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-black">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          📄 PDF Summarizer
        </h1>

        
        <div className="flex flex-col w-full mb-6 gap-4">
          {/* Tabs + Clear Button Row */}
          <div className="flex justify-between items-center w-full">
            {/* Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "upload"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-600"
                  }`}
              >
                Upload PDF
              </button>
              <button
                onClick={() => setActiveTab("fetch")}
                className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "fetch"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-600"
                  }`}
              >
                Fetch by ID
              </button>
            </div>

            {/* Clear Button */}
            <button
              onClick={() => {
                setSummary("");
                setParsedText("");
              }}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full bg-gray-50 dark:bg-neutral-900 rounded-xl shadow-inner p-4 border border-gray-200 dark:border-neutral-700">
            {activeTab === "upload" ? (
              <UploadPDF
                setSummary={setSummary}
                setParsedText={setParsedText}
                setLoading={setLoading}
                loading={loading}
              />
            ) : (
              <FetchByID
                setSummary={setSummary}
                setParsedText={setParsedText}
                setLoading={setLoading}
                loading={loading}
              />
            )}
          </div>
        </div>


        {/* Summary Card */}
        <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 mb-4 mt-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Summary</h3>
          <p className="text-sm whitespace-pre-wrap">{summary || "No summary yet."}</p>
        </div>

        {/* Parsed Text */}
        <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Parsed Text</h3>
          <textarea
            value={parsedText}
            readOnly
            placeholder="Extracted text will appear here..."
            className="w-full h-48 p-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono resize-y"
          />
        </div>
      </div>
    </main>
  );
}
