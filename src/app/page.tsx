"use client";
import Link from "next/link";
import RotatingText from "@/styles/RotatingText";
import SlideArrowButton from "@/styles/SlideArrowButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: Session } = useSession();

  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center z-70">
        <div className="text-4xl flex justify-center items-center gap-3">
          <div className="text-white">Welcome to</div>
          <RotatingText
            texts={["Dynamic", "Form", "Builder"]}
            mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>

        <Link
          href={Session ? "/home" : "/auth/login"}
          className="cursor-pointer"
        >
          <SlideArrowButton
            text="Get Started"
            className="text-white border-white px-4 py-2 cursor-pointer"
          />
        </Link>

        <div className="text-white">{Session?.user?.name}</div>
      </div>
    </>
  );
}
