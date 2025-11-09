"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PreviewButton from "@/styles/PreviewButton";
import FormSwitchButton from "@/styles/FormSwitchButton";
import LoadingBar from "@/styles/LoadingBar";
import EditIcon from "@/styles/EditIcon";
import { Check } from "@/styles/Check";
import { Delete } from "@/styles/Delete";
import { PuffLoader } from "react-spinners";
import { useParams } from "next/navigation";

const Form4 = () => {
    const { formId } = useParams();
  interface Field {
    id: number;
    heading: string;
    headLine: string;
    description: string;
    type: string;
    mandatory: boolean;
    value: string;
    options?: string[];
    checkedOptions?: boolean[];
  }

  const ref = useRef<HTMLButtonElement | null>(null);

  const [newAdd, setNewAdd] = useState(false);
    const [shareId, setShareId] = useState("");
  const [publicLink, setPublicLink] = useState("");
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldsForm1, setFieldsForm1] = useState<Field[]>([]);
  const [fieldsForm2, setFieldsForm2] = useState<Field[]>([]);
  const [fieldsForm3, setFieldsForm3] = useState<Field[]>([]);
  const [heading, setHeading] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("text");
  const [newMandatory, setNewMandatory] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [previewOptions, setPreviewOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const [headLine, setHeadLine] = useState("");
  const [description, setDescription] = useState("");
  const [savedHeadLine, setSavedHeadLine] = useState("");
  const [savedDescription, setSavedDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newFieldsDisable, setNewFieldsDisable] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  const typeOptions = [
    "text",
    "number",
    "date",
    "email",
    "checkbox (single choice)",
    "checkbox (multiple choice)",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPublicLink(`${window.location.origin}/forms/share/form4`);
    }
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);

    // clear any previous validation error when switching types
    setError("");

    if (option.includes("checkbox")) {
      setPreviewOptions((prev) => (prev.length ? prev : [""]));
    } else {
      setPreviewOptions([]);
    }
  };

  // main form
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch("/api/forms?formId=form4");
        if (!res.ok) throw new Error("Form not found");
        const data = await res.json();
        setFields(data.fields || []);
      } catch (err) {
        console.log("No existing form found — starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, []);

  // form 1
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch("/api/forms?formId=form1");
        if (!res.ok) throw new Error("Form not found");
        const data = await res.json();
        setFieldsForm1(data.fields || []);
      } catch (err) {
        console.log("No existing form found — starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, []);

  //   form2
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch("/api/forms?formId=form2");
        if (!res.ok) throw new Error("Form not found");
        const data = await res.json();
        setFieldsForm2(data.fields || []);
      } catch (err) {
        console.log("No existing form found — starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, []);

  //   form3
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch("/api/forms?formId=form3");
        if (!res.ok) throw new Error("Form not found");
        const data = await res.json();
        setFieldsForm3(data.fields || []);
      } catch (err) {
        console.log("No existing form found — starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, []);

  const saveFormToDB = async (updatedFields: Field[]) => {
    try {
      // remove value before sending to backend
      const cleanedFields = updatedFields.map(({ value, ...rest }) => rest);
      console.log("Sending to DB1:", cleanedFields);
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: "form4", // or dynamic id
          fields: cleanedFields,
        }),
      });

      const data = await res.json();
      console.log("Sending to DB2:", cleanedFields);

      console.log("✅ Form saved (without values):", data);
    } catch (err) {
      console.error(" Error saving form:", err);
    }
  };

  // ✅ Fetch existing form data from DB
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const res = await fetch(`/api/forms?formId=form4`);
        const data = await res.json();

        if (data?.formData?.length > 0) {
          const form = data.formData[0];
          setHeadLine(form.headLine || "");
          setDescription(form.description || "");
          setSavedHeadLine(form.headLine || "");
          setSavedDescription(form.description || "");
        }
      } catch (error) {
        console.error("❌ Error fetching formData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const saveHeadingtoDB = async () => {
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: "form4",
          formData: [{ headLine, description }],
        }),
      });

      const data = await res.json();
      console.log("✅ Saved to DB:", data);

      setSavedHeadLine(headLine);
      setSavedDescription(description);
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error saving heading:", error);
    }
  };

  const handleCancel = () => {
    setHeadLine(savedHeadLine);
    setDescription(savedDescription);
    setIsEditing(false);
  };

  const handleAddOrUpdate = async () => {
    // reset previous errors
    setError("");

    // heading must exist
    if (!heading.trim()) {
      setError("Please enter a heading.");
      return;
    }
    if (heading.trim().length < 3) {
      setError("Heading must be at least 3 characters.");
      return;
    }

    // If type is checkbox (single/multiple) we must have at least one non-empty option
    if (selected.includes("checkbox")) {
      const hasValidOption = previewOptions.some((opt) => opt.trim() !== "");
      if (!hasValidOption) {
        setError("Please add at least one character in options before saving.");
        return;
      }
    }

    // Clean options: remove empty strings and trim
    const cleanedOptions =
      selected.includes("checkbox") || selected.includes("radio")
        ? previewOptions.map((o) => o.trim()).filter((o) => o !== "")
        : [];

    const newField: Field = {
      id: editIndex !== null ? fields[editIndex].id : Date.now(),
      heading,
      headLine: "",
      description: "",
      type: selected,
      mandatory: newMandatory,
      value: "",
      options: cleanedOptions,
      checkedOptions: cleanedOptions.length
        ? new Array(cleanedOptions.length).fill(false)
        : [],
    };

    try {
      setNewAdd(false);
      if (editIndex !== null) {
        const updated = [...fields];
        updated[editIndex] = newField;
        setFields(updated);
        setEditIndex(null);
        await saveFormToDB(updated);
        setSavingData(true);
        setNewFieldsDisable(false);
      } else {
        const updated = [...fields, newField];
        setFields(updated);
        await saveFormToDB(updated);
        setSavingData(true);
        setNewFieldsDisable(false);
      }

      // success — clear form + errors
      setHeading("");
      setSelected("text");
      setInputValue("");
      setNewMandatory(false);
      setPreviewOptions([]);
      setError("");
      setSavingData(false);
    } catch (err) {
      console.error("Error saving field:", err);
      setError("Failed to save. Try again.");
    }
  };

  useEffect(() => {
    localStorage.setItem(`form-form4`, JSON.stringify(fields));
  }, [fields]);

  const handleEdit = (index: number) => {
    const field = fields[index];
    setHeading(field.heading);
    setSelected(field.type);
    setNewMandatory(field.mandatory);
    setPreviewOptions(field.options || []);
    setInputValue(field.value || "");
    setEditIndex(index);
    setNewFieldsDisable(true);
  };

  // ...existing code...
  const handleDelete = async (id: number) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    setShowDeleteConfirm(null);
    if (editIndex !== null) setEditIndex(null);
    try {
      await saveFormToDB(updated);
    } catch (err) {
      console.error("Error saving after delete:", err);
    }
  };
  // ...existing code...

  const handleFieldChange = (fieldId: number, value: string) => {
    setFields((prev) => {
      const updated = prev.map((f) => (f.id === fieldId ? { ...f, value } : f));
      // Persist the change (best-effort)
      saveFormToDB(updated).catch((err) =>
        console.error("Error saving field change:", err)
      );
      return updated;
    });
  };

  const handleOptionToggle = (fieldId: number, index: number) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;

        if (field.type === "checkbox (single choice)") {
          const updated = field.checkedOptions?.map((_, i) => i === index);
          return { ...field, checkedOptions: updated };
        }

        if (field.type === "checkbox (multiple choice)") {
          const updated = field.checkedOptions?.map((checked, i) =>
            i === index ? !checked : checked
          );
          return { ...field, checkedOptions: updated };
        }

        return field;
      })
    );
  };

  const addPreviewOption = () => {
    setPreviewOptions((prev) => [...prev, ""]);
    setError("");
  };

  const updatePreviewOption = (index: number, value: string) => {
    setPreviewOptions((prev) => prev.map((p, i) => (i === index ? value : p)));
    if (value.trim() !== "") setError("");
  };

  return (
    <>
      {loading && (
        <div className="w-2/3 h-10 flex justify-center items-center">
          <LoadingBar />
        </div>
      )}
      {!loading && (
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-violet-400 rounded-2xl w-[95vw] sm:w-2/3 flex flex-col justify-start items-start py-4 px-4 gap-3"
        >
          {/*  */}
          <div className="w-full flex justify-end items-center px-3">
            <div className="flex gap-4 relative">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-2"
                  >
                    <button
                      onClick={saveHeadingtoDB}
                      className="cursor-pointer h-8 flex justify-center items-center "
                    >
                      <Check />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="cursor-pointer h-8 flex justify-center items-center"
                    >
                      <img src="/cancel.svg" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <button ref={ref} onClick={() => setIsEditing(true)}>
                      <EditIcon />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Headline */}
          <div
            className={`border-2 ${
              isEditing ? "border-red-300" : "border-white"
            } w-full flex justify-between items-center px-3 py-2 rounded bg-white/10`}
          >
            <input
              placeholder="Form headline"
              className=" text-2xl outline-none text-gray-700 font-bold w-full"
              value={headLine}
              onChange={(e) => {
                setHeadLine(e.target.value);
                setIsEditing(true);
              }}
              maxLength={30}
              disabled={!isEditing}
            />
          </div>

          {/* Description */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`border-2 ${
              isEditing ? "border-red-300" : "border-white"
            } w-full h-auto flex justify-between items-center px-3 py-2 rounded bg-white/10`}
          >
            <textarea
              className="w-full outline-none text-black resize-none overflow-hidden"
              placeholder="Write your description here"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsEditing(true);
              }}
              rows={1}
              disabled={!isEditing}
              onInput={(e) => {
                const target = e.currentTarget;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </motion.div>
          {/*  */}

          {/* Render saved fields */}
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              layout
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="border-2 w-full flex flex-col justify-start items-start gap-2 p-3 rounded bg-white/10 relative"
            >
              {editIndex === index ? (
                // Inline edit mode
                <div className="w-full flex flex-col gap-3">
                  <textarea
                    className="w-full text-2xl outline-none bg-transparent"
                    placeholder="Type your heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                  />

                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newMandatory}
                      onChange={(e) => setNewMandatory(e.target.checked)}
                    />
                    <div className="text-white bg-gradient-to-r from-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2">
                      Mark as important
                    </div>
                  </div>

                  {/* Dropdown */}
                  <motion.div layout className="w-full flex flex-col gap-2">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full text-black bg-yellow-300 text-left px-3 py-2 rounded cursor-pointer"
                    >
                      {selected}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.ul
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                          }}
                          className="w-full bg-white text-black cursor-pointer border rounded shadow-md overflow-hidden"
                        >
                          {typeOptions.map((option) => (
                            <li
                              key={option}
                              onClick={() => handleSelect(option)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {option}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {!selected.includes("checkbox") ? (
                    <input
                      type={selected}
                      className="w-full bg-blue-200 px-3 py-2 rounded text-black"
                      placeholder={`Type ${typeOptions} here`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  ) : (
                    <div className="w-full flex flex-col gap-2">
                      {previewOptions.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 w-full">
                          <input
                            type={
                              selected === "checkbox (single choice)"
                                ? "radio"
                                : "checkbox"
                            }
                            name="preview"
                          />
                          <input
                            type="text"
                            className="flex-1 bg-blue-200 px-2 py-1 rounded text-black"
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) =>
                              updatePreviewOption(i, e.target.value)
                            }
                          />
                        </div>
                      ))}
                      <button
                        onClick={addPreviewOption}
                        className="self-start bg-purple-700 text-white px-3 py-1 rounded mt-2"
                      >
                        + Add more options
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (heading.trim().length < 3) return; // stop save if invalid
                        handleAddOrUpdate();
                      }}
                      className={`bg-green-500 hover:bg-green-700 ${
                        heading.trim().length < 3
                          ? "cursor-not-allowed bg-green-800"
                          : "cursor-pointer"
                      } transition-all text-white px-4 py-2 rounded`}
                    >
                      {savingData ? <PuffLoader size={30} /> : "Update"}
                    </button>
                    <button
                      onClick={() => {
                        setEditIndex(null);
                        setNewFieldsDisable(false);
                      }}
                      className="bg-gray-400 hover:bg-gray-600 transition-all cursor-pointer text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                //Normal view mode
                <>
                  <div className="flex justify-between w-full items-start">
                    <div className="text-lg font-semibold whitespace-pre-wrap break-words w-full pl-2">
                      {field.heading}
                    </div>
                  </div>

                  <div className="flex justify-start items-center">
                    <div className="text-white bg-gradient-to-r from-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800  font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2">
                      Type: {field.type}
                    </div>

                    <div
                      className={`text-white ${
                        field.mandatory
                          ? "bg-gradient-to-r from-[#f43f5e] via-[#db2777] to-[#ef4444]"
                          : "bg-gradient-to-r from-[#6b7280] via-[#22c55e] to-[#4ade80]"
                      } font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2`}
                    >
                      {field.mandatory ? "Important" : "Not Important"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-green-400 hover:bg-green-300 transition-all text-black px-1 py-1 rounded-xl cursor-pointer"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(field.id)}
                        className="bg-red-500 hover:bg-red-800 transition-all text-white px-2 py-1 rounded-xl cursor-pointer"
                      >
                        <Delete />
                      </button>
                    </div>
                  </div>

                  {!field.type.includes("checkbox") ? (
                    <input
                      type={field.type}
                      className="w-full ml-1 bg-blue-200 px-3 py-2 rounded text-black decoration-0 outline-none"
                      placeholder={`Type ${selected} here`}
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                    />
                  ) : (
                    <div className="w-full flex flex-col gap-2">
                      {field.options?.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 w-full">
                          <input
                            type={
                              field.type === "checkbox (single choice)"
                                ? "radio"
                                : "checkbox"
                            }
                            name={String(field.id)}
                            checked={field.checkedOptions?.[i] || false}
                            onChange={() => handleOptionToggle(field.id, i)}
                          />
                          <div className="flex-1 bg-blue-200 px-2 py-1 rounded text-black">
                            {opt || `Option ${i + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Delete confirmation modal (same as before) */}
              {showDeleteConfirm === field.id && (
                <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded">
                  <div className="bg-white p-4 rounded shadow-lg flex flex-col gap-3">
                    <p className="text-black font-medium">
                      Are you sure you want to delete this field?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(field.id)}
                        className="bg-red-600 hover:bg-red-400 transition-all cursor-pointer text-white px-3 py-1 rounded"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="bg-gray-300 hover:bg-gray-500 transition-all cursor-pointer text-black px-3 py-1 rounded"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {/* Add or Edit Field Section */}
          {newAdd && (
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="border-2 w-full flex flex-col justify-start items-start gap-3 p-4 bg-white/10 rounded"
            >
              <textarea
                className="w-full text-2xl outline-none bg-transparent resize-none overflow-hidden break-words"
                placeholder="Type your heading"
                value={heading}
                onChange={(e) => {
                  setHeading(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
              />
              <div className="flex justify-center items-center gap-2">
                <input
                  type="checkbox"
                  checked={newMandatory}
                  onChange={(e) => setNewMandatory(e.target.checked)}
                />
                <div className="text-white bg-gradient-to-r from-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2">
                  Mark as important
                </div>
              </div>

              {/*Validation message */}
              {heading.trim().length > 0 && heading.trim().length < 3 && (
                <p className="text-red-700 text-sm ont-semibold">
                  Heading must be at least 3 characters long.
                </p>
              )}
              {heading.trim().length === 0 && (
                <p className="text-red-700 text-sm font-semibold">
                  Please enter a heading before saving.
                </p>
              )}

              {/* Dropdown Section */}
              <motion.div layout className="w-full flex flex-col gap-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full text-black bg-yellow-300 text-left px-3 py-2 rounded cursor-pointer"
                >
                  {selected}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.ul
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                      className="w-full bg-white text-black cursor-pointer border rounded shadow-md overflow-hidden"
                    >
                      {typeOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => handleSelect(option)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {option}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>

              {!selected.includes("checkbox") ? (
                <input
                  type={selected}
                  className="w-full bg-blue-200 px-3 py-2 rounded text-black"
                  placeholder="Type"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              ) : (
                <div className="w-full flex flex-col gap-2">
                  {previewOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 w-full">
                      <input
                        type={
                          selected === "checkbox (single choice)"
                            ? "radio"
                            : "checkbox"
                        }
                        name="preview"
                      />
                      <input
                        type="text"
                        className="flex-1 bg-blue-200 px-2 py-1 rounded text-black"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => updatePreviewOption(i, e.target.value)}
                      />
                    </div>
                  ))}
                  <button
                    onClick={addPreviewOption}
                    className="self-start bg-purple-700 text-white px-3 py-1 rounded mt-2"
                  >
                    + Add more options
                  </button>
                </div>
              )}
              {error && (
                <p className="text-red-700 text-sm mt-1 font-semibold">
                  {error}
                </p>
              )}
              {/*Save + Cancel buttons with validation */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    if (heading.trim().length < 3) return; // stop save if invalid
                    handleAddOrUpdate();
                  }}
                  className={`px-4 py-2 cursor-pointer rounded text-white ${
                    heading.trim().length < 3
                      ? "bg-green-500/50 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 transition-all"
                  }`}
                >
                  {savingData ? <PuffLoader size={30} /> : "Save"}
                </button>

                {!savingData ? (
                  <button
                    onClick={() => {
                      setNewAdd(false);
                      setHeading("");
                      setPreviewOptions([]);
                      setInputValue("");
                      setSelected("text");
                      setError("");
                    }}
                    className="bg-gray-500 hover:bg-gray-600 transition-all text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                ) : (
                  ""
                )}
              </div>
            </motion.div>
          )}
          {/* Add New Button */}
          {!newAdd && (
            <div className="flex justify-start gap-3 w-full mt-4">
              <button
                onClick={() => setNewAdd(true)}
                disabled={newFieldsDisable}
                className={`group ${
                  newFieldsDisable ? "cursor-not-allowed" : "cursor-pointer"
                }  relative overflow-hidden rounded-xl bg-purple-950 px-3 py-2 text-lg transition-all`}
              >
                <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
                <span className="font-semibold text-purple-200 ">
                  Add new fields
                </span>
              </button>

              {/*Preview Button */}
              <Link href={`/home/preview/form4`} className="cursor-pointer">
                <PreviewButton text="Preview Form" />
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {fields.length !== 0 && (
        !loading && (
          <button
          onClick={() => navigator.clipboard.writeText(publicLink)}
          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
          >
          Copy Shareable Link
          </button>
        )
      )}

      {fields.length !== 0 && (
        !loading && (
          <p className="text-sm mt-2 text-gray-600">Share link: {publicLink}</p>
        )
      )}

      {!loading && fieldsForm1.length !== 0 && (
        <Link href={"/home/form1"} className="w-full px-3 sm:w-2/3 cursor-default">
          <FormSwitchButton
            firstText="Switch to form 1"
            secondText="Switch to form 1"
          />
        </Link>
      )}

      {!loading && fieldsForm2.length !== 0 && (
        <Link href={"/home/form2"} className="w-full px-3 sm:w-2/3 cursor-default">
          <FormSwitchButton
            firstText="Switch to form 2"
            secondText="Switch to form 2"
          />
        </Link>
      )}

      {!loading && fieldsForm3.length !== 0 && (
        <Link href={"/home/form3"} className="w-full px-3 sm:w-2/3 cursor-default">
          <FormSwitchButton
            firstText="Switch to form 3"
            secondText="Switch to form 3"
          />
        </Link>
      )}
    </>
  );
};

export default Form4;
