import { FaTerminal } from "react-icons/fa";
import Link from "next/link";
import Tooltip from "./ui/Tooltip";

export default function Terminal() {
  const fullText = `const harsh = {
  skills: ['Typescript', 'Golang', "Rust", 'Docker', 'Git'],
  passion: 'Building Software',
  location: 'India',
  age: 20,
  connect: () => {
    console.log("Let\'s create something amazing!");
  }
};

harsh.connect();`;

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#f5f5f5] dark:bg-[#1e1e1e] rounded-lg overflow-hidden dark:shadow-2xl border border-[#cccccc] dark:border-border">
        <div className="bg-gradient-to-r from-[#dcdcdc] to-[#f0f0f0] dark:from-[#1b1b1b] dark:to-[#191b19] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-[#ff605c] dark:bg-[#ff5f56] shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd44] dark:bg-[#ffbd2e] shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-[#28c941] dark:bg-[#27c93f] shadow-inner" />
            </div>
            <div className="text-sm text-[#333333] dark:text-[#cccccc] font-medium">
              about.ts
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm hidden md:block text-[#333333] dark:text-[#cccccc] opacity-80">
              harsh@MacBook-Air: ~/projects
            </div>
            <Tooltip
              delay={10}
              position="top"
              content="Open Interactive Terminal"
            >
              <Link href="/terminal" passHref>
                <button className="px-3 py-1 text-xs font-semibold text-white bg-accent rounded-md transition-all duration-200 ease-in-out flex items-center space-x-1 active:scale-[0.95] group">
                  <FaTerminal className="text-sm group-hover:translate-x-16 duration-300 transition-all" />
                  <span className="group-hover:-translate-x-5 duration-300 transition-all">
                    Interactive
                  </span>
                </button>
              </Link>
            </Tooltip>
          </div>
        </div>

        <div className="p-6 font-ibmPlexMono text-sm bg-[#ffffff] dark:bg-[#101110] overflow-x-auto">
          <div className="whitespace-pre text-[#006400] dark:text-[#4ec95e]">
            <p className="whitespace-pre-wrap">{fullText}</p>
          </div>
          <Link href="/terminal" passHref>
            <div className="inline-block cursor-pointer group">
              <span className="text-[#006400] dark:text-[#4ec95e] mr-2">$</span>
              <span className="text-accent group-hover:underline group-active:text-accent/80">
                explore_interactive_terminal
              </span>
              <div className="animate-blink inline-block w-2 h-5 bg-[#006400] dark:bg-[#52c94e] ml-1 relative top-[2px]"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
