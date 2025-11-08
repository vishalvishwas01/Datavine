"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";
import LoadingBar from "@/styles/LoadingBar";

type NormalizedItem = { question: string; answer: any };

interface ResponseDataRaw {
  _id?: string;
  formId?: string;
  responses?: any;
  submittedAt?: string | Date;
}

export default function ReportPage() {
  const { formId } = useParams();
  const [responses, setResponses] = useState<ResponseDataRaw[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<ResponseDataRaw[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchResponses = async () => {
      const res = await fetch(`/api/forms/${formId}/responses`);
      const data = await res.json();
      const docs = Array.isArray(data.responses) ? data.responses : [];
      setResponses(docs);
      setFilteredResponses(docs);
      setLoading(false);
    };

    fetchResponses();
  }, [formId]);

  const normalize = (raw: any): NormalizedItem[] => {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object")
      return Object.entries(raw).map(([k, v]) => ({ question: k, answer: v }));
    return [{ question: "Answer", answer: raw }];
  };

  useEffect(() => {
    let data = [...responses];

    if (search.trim()) {
      data = data.filter((r) => {
        const items = normalize(r.responses);
        return items.some((it) =>
          String(it.answer).toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (startDate) {
      data = data.filter((r) =>
        r.submittedAt ? new Date(r.submittedAt) >= new Date(startDate) : true
      );
    }

    if (endDate) {
      data = data.filter((r) =>
        r.submittedAt ? new Date(r.submittedAt) <= new Date(endDate) : true
      );
    }

    setFilteredResponses(data);
  }, [search, startDate, endDate, responses]);

  const buildRows = () => {
    const questionSet = new Set<string>();

    filteredResponses.forEach((r) => {
      const items = normalize(r.responses);
      items.forEach((it) => questionSet.add(it.question));
    });

    const questions = Array.from(questionSet);
    const rows: any[] = [];

    filteredResponses.forEach((r) => {
      const row: any = {};
      const items = normalize(r.responses);

      items.forEach((it) => {
        row[it.question] = Array.isArray(it.answer)
          ? it.answer.join(", ")
          : typeof it.answer === "object" && it.answer !== null
          ? JSON.stringify(it.answer)
          : it.answer;
      });

      row["Submitted At"] = r.submittedAt
        ? new Date(r.submittedAt).toLocaleString()
        : "";

      rows.push(row);
    });

    return { rows, questions };
  };

  const downloadExcel = () => {
    const { rows, questions } = buildRows();
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [...questions, "Submitted At"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    XLSX.writeFile(workbook, `form_${formId}_responses.xlsx`);
  };

  const downloadCSV = () => {
    const { rows } = buildRows();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `form_${formId}_responses.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        <div className=" w-[90%]">
          <LoadingBar />
        </div>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-45 flex justify-center items-center text-2xl font-bold">
        Nothing to download
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 pt-55">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Reports for Form {formId}
      </h1>

      <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="w-full flex flex-col">
          <h1 className="flex justify-center items-center text-xl">Search</h1>
          <input
            type="text"
            placeholder="Search by email or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="w-full flex flex-col">
          <h1 className="flex justify-center items-center text-xl">
            Start date
          </h1>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="w-full flex flex-col">
          <h1 className="flex justify-center items-center text-xl">End date</h1>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={downloadExcel}
          className="px-6 py-3 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700"
        >
          Download Excel
        </button>

        <button
          onClick={downloadCSV}
          className="px-6 py-3 bg-blue-600 text-white cursor-pointer rounded-lg hover:bg-blue-700"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
