"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";

interface Props {
    setSummary: (s: string) => void;
    setParsedText: (t: string) => void;
    setLoading: (b: boolean) => void;
    loading: boolean;
}

export default function FetchByID({ setSummary, setParsedText, setLoading, loading }: Props) {
    const [docId, setDocId] = useState("");

    const handleFetch = async () => {
        if (!docId) {
            alert("Please enter a document ID.");
            return;
        }
        try {
            setLoading(true);
            setSummary("");
            setParsedText("");

            const res = await axios.get(`http://127.0.0.1:8000/api/documents/${docId}`);
            setSummary(res.data.summary || "No summary available.");
            setParsedText(res.data.parsedText || "");
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            alert("Failed to fetch document: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <input
                type="text"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                placeholder="Enter Document ID"
                className="flex-1 border border-dashed border-gray-400 rounded-lg p-3 text-sm bg-gray-50 dark:bg-neutral-800 dark:text-gray-200"
                disabled={loading}
            />
            <button
                onClick={handleFetch}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
                {loading && <span className="loader-border w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></span>}
                {loading ? "Fetching..." : "Fetch"}
            </button>
        </div>
    );
}
