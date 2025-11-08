"use client";
import { useEffect, useState } from "react";
import StaggeredMenu from "@/styles/StaggeredMenu";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [openMenuButtonColor, setOpenMenuButtonColor] = useState("#000000");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpenMenuButtonColor("#ffffff"); // for lg and above
      } else {
        setOpenMenuButtonColor("#000000"); // below lg
      }
    };

    // Run once on mount
    handleResize();

    // Listen for screen resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/home" },
    { label: "Forms", ariaLabel: "Go to forms", link: "/template" },
    { label: "Analytics", ariaLabel: "Go to analytics", link: "/home/form1/responses" },
    { label: "Upgrade", ariaLabel: "Go to upgrade", link: "/upgrade" },
  ];



  return (
    <>
      {session && (
        <div className="relative w-full">
          <StaggeredMenu
            position="left"
            items={menuItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#fff"
            openMenuButtonColor={openMenuButtonColor}
            changeMenuColorOnOpen={true}
            colors={["#B19EEF", "#5227FF"]}
            logoUrl="/file.svg"
            accentColor="#ff6b6b"
            isFixed={true}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
