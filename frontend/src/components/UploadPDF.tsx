"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";

interface Props {
  setSummary: (s: string) => void;
  setParsedText: (t: string) => void;
  setLoading: (b: boolean) => void;
  loading: boolean;
}

export default function UploadPDF({ setSummary, setParsedText, setLoading, loading }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setSummary("");
      setParsedText("");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSummary(res.data.summary || "No summary generated.");
      setParsedText(res.data.parsedText || "");
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="flex-1 border border-dashed border-gray-400 rounded-lg p-3 cursor-pointer text-sm bg-gray-50 dark:bg-neutral-800 dark:text-gray-200"
          disabled={loading}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <span className="loader-border w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></span>}
          {loading ? "Processing..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
