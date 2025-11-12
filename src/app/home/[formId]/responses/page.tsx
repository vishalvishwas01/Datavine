"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import LoadingBar from "@/styles/LoadingBar";

type NormalizedItem = { question: string; answer: any };

interface ResponseDataRaw {
  _id?: string;
  formId?: string;
  responses?: any;
  submittedAt?: string | Date;
}

const FormResponsesPage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState<ResponseDataRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/forms/${formId}/responses`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load responses");
        }

        console.log("RAW responses payload:", data);
        let docs: ResponseDataRaw[] = [];
        if (Array.isArray(data.responses)) {
          docs = data.responses;
        } else if (Array.isArray(data)) {
          docs = data as any;
        } else if (data && typeof data === "object" && data.responses) {
          docs = Array.isArray(data.responses)
            ? data.responses
            : [data.responses];
        } else if (data && typeof data === "object") {
          docs = [data];
        } else {
          docs = [];
        }

        setResponses(docs);
      } catch (err: any) {
        console.error("Error fetching responses:", err);
        setError(err.message || "Failed to load responses");
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchResponses();
  }, [formId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        <div className=" w-[90%]">
          <LoadingBar />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-45 flex justify-center items-center text-2xl font-semibold text-center text-red-600">
        {error || "Error loading responses"}
      </div>
    );

  if (!responses.length)
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-45 flex justify-center items-center text-2xl font-bold">
        No responses, Select your form
      </div>
    );

  const normalize = (raw: any): NormalizedItem[] => {
    if (Array.isArray(raw)) {
      const looksLikePairs = raw.every(
        (it) =>
          it &&
          (typeof it.question === "string" ||
            typeof it.question === "number") &&
          "answer" in it
      );
      if (looksLikePairs) {
        return raw as NormalizedItem[];
      }

      return raw.map((val: any, idx: number) => ({
        question: `Answer ${idx + 1}`,
        answer: val,
      }));
    }

    if (raw && typeof raw === "object") {
      return Object.entries(raw).map(([k, v]) => ({
        question: String(k),
        answer: v,
      }));
    }

    return [{ question: "Answer", answer: raw }];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-45">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        Responses for Form: {formId}
      </motion.h1>

      {responses.map((resDoc, index) => {
        const candidate = resDoc.responses ?? (resDoc as any).data ?? resDoc;
        const items = normalize(candidate);

        return (
          <div
            key={resDoc._id ?? index}
            className="bg-white shadow-md rounded-xl p-4 mb-6 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Response #{index + 1} —{" "}
              <span className="text-sm text-gray-500">
                {resDoc.submittedAt
                  ? new Date(resDoc.submittedAt).toLocaleString()
                  : ""}
              </span>
            </h2>

            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="border-b pb-2">
                  <p className="font-medium text-gray-800">{it.question}</p>
                  <p className="text-gray-600">
                    {Array.isArray(it.answer)
                      ? it.answer.join(", ")
                      : typeof it.answer === "object" && it.answer !== null
                      ? JSON.stringify(it.answer)
                      : String(it.answer ?? "—")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormResponsesPage;
