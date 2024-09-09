"use client";
import React, { useState, useEffect } from "react";
import HelperGuide from "@/components/HelperGuide";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import TerminalLoader from "@/components/TerminalLoader";

export default function TerminalPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {isLoading ? (
        <TerminalLoader />
      ) : (
        <>
          <InteractiveTerminal />
          <div className="absolute bottom-12 right-12">
            <HelperGuide />
          </div>
        </>
      )}
    </div>
  );
}
