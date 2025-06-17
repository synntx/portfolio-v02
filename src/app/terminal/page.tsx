"use client";
import React from "react";
import { useRouter } from "next/navigation";
import HelperGuide from "@/components/HelperGuide";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import { IoChevronBack } from "react-icons/io5";

export default function TerminalPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-1 absolute left-4 top-4 md:left-8 md:top-8 border border-border md:border-transparent  hover:border hover:border-border rounded-md text-foreground transistion-all duration-200 active:scale-95"
        >
          <IoChevronBack className="text-lg" />
          <span className="hidden md:block">Go Back</span>
        </button>
        <InteractiveTerminal />
        <div className="absolute bottom-12 right-12">
          <HelperGuide />
        </div>
      </>
    </div>
  );
}
