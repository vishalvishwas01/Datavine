"use client";
import React, { useEffect, useState } from "react";
import { startPayment } from "@/utils/payments";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
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
      await startPayment(user._id);
    } catch (err: any) {
      alert(err.message || "Payment failed");
    }
  };
  return (
    <div className=" w-full h-screen pb-10 flex flex-col justify-start items-center pt-50 gap-5 bg-gradient-to-b from-slate-200  to-orange-200 overflow-auto overflow-x-hidden">
      <div className="font-semibold text-2xl sm:text-5xl w-full flex justify-center items-center">
        Unlock our premium features
      </div>
      <div className="flex flex-col justify-start items-center gap-2">
        <div className="text-3xl border-3 border-gray-500 rounded-2xl px-2 py-1">
          Analytics
        </div>
        <div className="text-sm sm:text-xl">
          Receive a wide range of analytical charts and dashboard
        </div>
        <div className=" flex flex-col gap-5 justify-center items-center w-screen">
          <div className="relative w-[95%] sm:w-[90%] lg:w-[70%] aspect-[16/9] rounded-2xl border-3 border-gray-400 overflow-hidden">
            <Image
              src="/ss1.png"
              alt="screenshot 1"
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>
          <div className="relative w-[95%] sm:w-[90%] lg:w-[70%] h-auto rounded-3xl border-3 border-gray-500 overflow-hidden flex justify-center items-center gap-5">
            <div className="relative w-[95%] sm:w-[90%] lg:w-[70%] aspect-[16/9] rounded-2xl border-3 border-gray-400 overflow-hidden">
              <Image
                src="/ss2.png"
                alt="screenshot 1"
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div className="relative w-[95%] sm:w-[90%] lg:w-[70%] aspect-[16/9] rounded-2xl border-3 border-gray-400 overflow-hidden">
              <Image
                src="/ss5.png"
                alt="screenshot 1"
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center gap-2 mt-10">
        <div className="text-3xl border-3 border-gray-500 rounded-2xl px-2 py-1">
          Report
        </div>
        <div className="text-sm sm:text-xl">
          Download the report in Excel or CSV with filters like email and date.
        </div>
        <div className=" flex flex-col gap-5 justify-center items-center w-screen">
          <div className="relative w-[95%] sm:w-[90%] lg:w-[70%] aspect-[13/3] rounded-2xl border-3 border-gray-400 overflow-hidden">
            <Image
              src="/ss4.png"
              alt="screenshot 1"
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {user?.isPremium ? <>
       <div className="flex flex-col justify-center items-center text-2xl sm:text-4xl mt-10 font-semibold">
        Thanks for being our premium user!
      </div>
      </>:<>
      <div className="flex flex-col justify-center items-center gap-5 mt-10">
        <div className="bg-gradient-to-r from-slate-300  to-yellow-100  rounded-xl px-5 py-1 text-5xl font-semibold text-gray-700">199/- Rupees Only (Lifetime offer)</div>
        <button onClick={onPay} className="bg-gradient-to-r from-slate-300  to-green-400 hover:to-green-500 transition-all rounded-xl cursor-pointer px-4 py-1 text-3xl mt-5">Pay now</button>
      </div>
      </>}
    </div>
  );
};

export default page;
