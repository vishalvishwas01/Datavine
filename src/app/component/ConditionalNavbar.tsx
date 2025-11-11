"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  const shouldHideNavbar =
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname === "/template" ||
    pathname === "/upgrade";

  // Always call hooks at top-level, control rendering via JSX
  return <>{!shouldHideNavbar && <Navbar />}</>;
}
