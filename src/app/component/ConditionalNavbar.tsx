"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Example: hide navbar for home, template, upgrade, or any path starting with /home/
  const shouldHideNavbar =
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname === "/template" ||
    pathname === "/upgrade";

  if (shouldHideNavbar) return null;

  return <Navbar />;
}
