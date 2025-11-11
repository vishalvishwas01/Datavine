"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const hideNavbarRoutes = [
    "/home",
    "/home/form1",
    "/home/form2",
    "/home/form3",
    "/home/form4",
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
    "/template",
    "/upgrade"
  ];

  const isHomeResponseRoute =
    pathname.startsWith("/home") &&
    (pathname.endsWith("/responses") || pathname.endsWith("/analytics") || pathname.endsWith("/report"));

  const shouldShowNavbar = hideNavbarRoutes.includes(pathname) || isHomeResponseRoute;

  if (!shouldShowNavbar) return null;

  return <Navbar />;
}
