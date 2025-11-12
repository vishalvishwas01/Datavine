"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const FormResponseToggle = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    async function loadForms() {
      const res = await fetch("/api/forms/all", { cache: "no-store" });
      const data = await res.json();
      setFormLinks(data.forms || []);
    }
    loadForms();
  }, []);

  const parts = pathname.split("/");
  if (parts[1] !== "home" || parts[2] === "preview" || parts.length < 4)
    return null;

  const currentShareId = parts[2];
  const currentPage = parts[3];

  const navTo = (where: string) => {
    router.push(`/home/${currentShareId}/${where}`);
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
              <Image width={25} height={25} alt="lock" src="/lock.svg" />
            </button>

            <button
              onClick={() => navTo("report")}
              className="cursor-pointer bg-gradient-to-r from-yellow-400 to-amber-700 hover:to-amber-500 transition-all rounded-2xl px-2 py-1 flex justify-center items-center gap-2"
            >
              <span>Download</span>
              <Image width={25} height={25} alt="lock" src="/lock.svg" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormResponseToggle;
