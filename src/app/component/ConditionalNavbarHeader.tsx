"use client";

import { usePathname } from "next/navigation";

export default function ConditionalNavbarHeader() {
  const pathname = usePathname();
  const hideNavbarRoutes = [
    "/forms/share/form1",
    "/home/preview/form1",
    "/forms/share/form2",
    "/home/preview/form2",
    "/forms/share/form3",
    "/home/preview/form3",
    "/forms/share/form4",
    "/home/preview/form4",
  ];

  if (hideNavbarRoutes.includes(pathname)) return null;

  return (
    <div className="text-white fixed w-full h-auto flex justify-center items-center pt-5 pb-3 text-4xl font-bold z-20 bg-gradient-to-r from-[#0f172a]  to-[#334155] shadow-xl">
      Datavine
    </div>
  );
}
