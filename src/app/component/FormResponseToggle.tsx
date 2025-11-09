"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { startPayment } from "@/utils/payments";

const FormResponseToggle = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [formMap, setFormMap] = useState<Record<string, string>>({}); // form1 -> shareId mapping
  const [formLinks, setFormLinks] = useState<
    { formId: string; shareId: string }[]
  >([]);
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/user/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  // Load mapping: form1 -> shareId, form2 -> shareId ...
  useEffect(() => {
    async function loadForms() {
      try {
        const res = await fetch("/api/forms/all", { cache: "no-store" });
        const data = await res.json();
        setFormLinks(data.forms || []);
      } catch (err) {}
    }
    loadForms();
  }, []);

  // If route doesn't look like /home/<id>/<page>, hide navbar
  const parts = pathname.split("/");
  if (parts[1] !== "home" || parts[2] === "preview" || parts.length < 4) return null;

  const currentShareId = parts[2];
  const currentPage = parts[3]; // responses | analytics | report

  const navTo = (where: string) => {
    router.push(`/home/${currentShareId}/${where}`);
  };

  const formButtons = ["form1", "form2", "form3", "form4"];

  const onPay = async () => {
    if (!user) return router.push("/auth/login");
    try {
      await startPayment(user.id);
    } catch (err: any) {
      alert(err.message || "Payment failed");
    }
  };

  return (
    <div className="fixed z-10 w-full gap-4 py-2 flex flex-col justify-center items-center bg-white shadow-xl mt-18">
      {/* Form Select Buttons */}
      <div className="gap-5 flex justify-center items-center">
        {formLinks.map((f) => (
          <button
            key={f.formId}
            onClick={() => router.push(`/home/${f.shareId}/responses`)}
            className={`${
              pathname.includes(f.shareId) ? "bg-gray-400" : "bg-gray-300"
            } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}
          >
            {f.formId.replace("form", "Form ")}
          </button>
        ))}
      </div>

      {/* Page Navigation */}
      <div className="flex justify-center items-center gap-5">
        <button
          onClick={() => navTo("responses")}
          className={`${
            currentPage === "responses" ? "bg-gray-400" : "bg-gray-300"
          } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}
        >
          Responses
        </button>

        {user?.isPremium ? (
          <>
            <button
              onClick={() => navTo("analytics")}
              className={`${
                currentPage === "analytics" ? "bg-gray-400" : "bg-gray-300"
              } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}
            >
              Analytics
            </button>

            <button
              onClick={() => navTo("report")}
              className={`${
                currentPage === "report" ? "bg-gray-400" : "bg-gray-300"
              } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}
            >
              Download
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navTo("analytics")}
              className="cursor-pointer bg-gradient-to-r from-yellow-400 to-amber-700 hover:to-amber-500 transition-all rounded-2xl px-2 py-1 flex justify-center items-center gap-2"
            >
              <span>Analytics</span>
              <img src="/lock.svg" />
            </button>

            <button
              onClick={() => navTo("report")}
              className="cursor-pointer bg-gradient-to-r from-yellow-400 to-amber-700 hover:to-amber-500 transition-all rounded-2xl px-2 py-1 flex justify-center items-center gap-2"
            >
              <span>Download</span>
              <img src="/lock.svg" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormResponseToggle;
