"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingBar from "@/styles/LoadingBar";


const Form1 = () => {
  const { formId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms?formId=${formId}`);
        if (!res.ok) throw new Error("Form not found");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Error loading form:", err);
      } finally {
        setLoading(false);
      }
    };
    if (formId) fetchForm();
  }, [formId]);

  const handleChange = (fieldId: number, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (
    fieldId: number,
    option: string,
    isMultiple: boolean
  ) => {
    setResponses((prev) => {
      if (isMultiple) {
        const current = prev[fieldId] || [];
        return {
          ...prev,
          [fieldId]: current.includes(option)
            ? current.filter((o: string) => o !== option)
            : [...current, option],
        };
      } else {
        return { ...prev, [fieldId]: option };
      }
    });
  };

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingBar />
      </div>
    );

  if (!form)
    return (
      <div className="text-center mt-10 text-white font-bold text-2xl">
        Form not found or deleted.
      </div>
    );

  if (submitted)
    return (
      <div className="flex flex-col justify-center items-center mt-10">
          <h2 className="text-2xl font-semibold text-green-600 bg-white px-2 py-1 rounded-lg">
          Form Submitted!
        </h2>
        <p className=" mt-2 text-white">Thank you for your response.</p>
      </div>
    );

  return (
    <div className="mt-15 text-black w-full flex flex-col justify-center items-center">
      <div className="w-full sm:w-[600px] flex justify-between px-6 py-2 bg-white rounded-lg text-black items-center text-xl font-bold mb-2">
        <div>Preview</div>
        <button onClick={() => router.back()} className="bg-gray-400 px-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
         Back
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-xl w-full sm:w-[600px] p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {form.formData?.[0]?.headLine || "Untitled Form"}
          </h1>
          <p className="text-gray-600">
            {form.formData?.[0]?.description || ""}
          </p>
        </div>

        {/* Render fields */}
        {form.fields.map((field: any) => (
          <div key={field.id} className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              {field.heading}
              {field.mandatory && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* ✅ Text, Number, Email, Date fields */}
            {!field.type.includes("checkbox") &&
              field.type !== "file upload" && (
                <input
                  type={field.type}
                  className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder={`Enter ${field.heading}`}
                  value={responses[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

            {/* ✅ Checkbox / Multiple Choice */}
            {field.type === "checkbox (single choice)" && (
              <div className="flex flex-col gap-1">
                {field.options?.map((opt: string, i: number) => (
                  <label key={i} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={`field-${field.id}`}
                      checked={responses[field.id] === opt}
                      onChange={() =>
                        handleCheckboxChange(field.id, opt, false)
                      }
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "checkbox (multiple choice)" && (
              <div className="flex flex-col gap-1">
                {field.options?.map((opt: string, i: number) => (
                  <label key={i} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={responses[field.id]?.includes(opt) || false}
                      onChange={() => handleCheckboxChange(field.id, opt, true)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* ✅ File Upload */}
            {field.type === "file upload" && (
              <input
                type="file"
                className="border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) =>
                  handleChange(field.id, e.target.files?.[0] || null)
                }
              />
            )}
          </div>
        ))}

        <button
         className="px-6 py-3 rounded-md mt-4 transition-all bg-gray-400 text-white cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form1;
