"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { startPayment } from "@/utils/payments";

const FormResponseToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  const showNavbarRoutes = [
    "/home/form1/responses",
    "/home/form2/responses",
    "/home/form3/responses",
    "/home/form4/responses",
    "/home/form1/analytics",
    "/home/form2/analytics",
    "/home/form3/analytics",
    "/home/form4/analytics",
    "/home/form1/report",
    "/home/form2/report",
    "/home/form3/report",
    "/home/form4/report",
  ];

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/user/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  const onPay = async () => {
    if (!user) return router.push("/auth/login");
    try {
      await startPayment(user.id);
    } catch (err: any) {
      alert(err.message || "Payment failed");
    }
  };

  if (!showNavbarRoutes.includes(pathname)) return null;

  const formName = pathname.split("/")[2];

  const navTo = (subPath: String) =>
    router.push(`/home/${formName}/${subPath}`);

  const formButtons = ["form1", "form2", "form3", "form4"];

  return (
    <div className="fixed z-10 w-full gap-4 py-2 flex flex-col justify-center items-center bg-white shadow-xl mt-18">
      <div className="gap-5 flex justify-center items-center">
        {formButtons.map((form) => (
          <button
            key={form}
            onClick={() => router.push(`/home/${form}/responses`)}
            className={`${
              pathname.includes(form) ? "bg-gray-400" : "bg-gray-300"
            } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}
          >
            {form.replace("form", "Form ")}
          </button>
        ))}
      </div>

      <div className="flex justify-center items-center gap-5">
        <button onClick={() => navTo("responses")} className={`${ pathname.endsWith("responses") ? "bg-gray-400" : "bg-gray-300" } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}>Responses</button>

        {user?.isPremium ? (
          <>
            <button onClick={() => navTo("analytics")} className={`${ pathname.endsWith("analytics") ? "bg-gray-400" : "bg-gray-300" } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}>Analytics</button>
            <button onClick={() => navTo("report")} className={`${ pathname.endsWith("report") ? "bg-gray-400" : "bg-gray-300" } hover:bg-gray-400 transition-all cursor-pointer rounded-2xl px-2 py-1`}>Download</button>
          </>
        ) : (
          <>
            <button onClick={() => navTo("analytics")} className="cursor-pointer bg-gradient-to-r from-yellow-400  to-amber-700 hover:to-amber-500 transition-all rounded-2xl px-2 py-1 flex justify-center items-center gap-2">
              <span>Analytics</span>
              <img src="/lock.svg"/>
            </button>

            <button onClick={() => navTo("report")} className="cursor-pointer bg-gradient-to-r from-yellow-400  to-amber-700 hover:to-amber-500 transition-all  rounded-2xl px-2 py-1 flex justify-center items-center gap-2">
              <span>Download</span>
              <img src="/lock.svg"/>
            </button>           
          </>
        )}
      </div>
    </div>
  );
};

export default FormResponseToggle;
