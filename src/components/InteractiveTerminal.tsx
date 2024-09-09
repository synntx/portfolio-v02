"use client";

import { fileSystem } from "@/lib/fileSystem";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { FaFile, FaFolder, FaTerminal } from "react-icons/fa";
import Tooltip from "./ui/Tooltip";

const InteractiveTerminal: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    {
      input: "",
      output: "Welcome to HarshOS v0.1! Type 'help' to see available commands.",
      directry: "",
    },
  ]);
  const [currentDir, setCurrentDir] = useState<string>("/home/harsh");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const commands = {
    whoareyou: "Introduces the developer behind this digital playground",
    whoami: "Describes your role as an explorer in the HarshOS universe",
    cd: "Change directory. Usage: cd <directory>",
    ls: "List contents of the current directory",
    cat: "Display contents of a file. Usage: cat <filename>",
    clear: "Clear the terminal screen",
    hello: "Displays a fancy 'Hello World' message",
    joke: "Tells a programming joke",
    time: "Displays the current time",
    sudo: "Attempts to use superuser privileges",
    fact: "Shares a random interesting fact",
    fortune: "Provides a random fortune",
    rickroll: "You know the rules, and so do I",
    hack: "Simulates a hacking attempt (just for fun!)",
    sing: "Sings a little tune",
    help: "Displays this help message",
  };

  const processCommand = (cmd: string): any => {
    const parts = cmd.split(" ");
    const [command, ...args] = parts;

    switch (command) {
      case "":
        return "";
      case "help":
        return (
          <div>
            <p>Available commands:</p>
            {Object.entries(commands).map(([cmd, desc]) => (
              <div key={cmd} className="ml-4">
                <span className="font-bold">{cmd}</span>: {desc}
              </div>
            ))}
          </div>
        );
      case "whoareyou":
        return "I'm Harsh, the developer behind this digital playground. Nice to meet you!";
      case "whoami":
        return "You're an explorer in the HarshOS universe. Your mission? To discover all the hidden gems!";
      case "cd":
        return changeDirectory(args[0]);
      case "ls":
        return listDirectory();
      case "cat":
        return catFile(args[0]);
      case "clear":
        setHistory([]);
        return "";
      case "hello":
        return (
          <pre>
            {`
        _   _      _ _         __        __         _     _ _ 
       | | | | ___| | | ___    \\ \\      / /__  _ __| | __| | |
       | |_| |/ _ \\ | |/ _ \\    \\ \\ /\\ / / _ \\| '__| |/ _\` | |
       |  _  |  __/ | | (_) |    \\ V  V / (_) | |  | | (_| |_|
       |_| |_|\\___|_|_|\\___( )    \\_/\\_/ \\___/|_|  |_|\\__,_(_)
                            |/                                   
            `}
          </pre>
        );
      case "joke":
        return "How do you comfort a JavaScript bug? You console it!";
      case "time":
        const now = new Date();
        return `Current time is: ${now.toLocaleTimeString()} - Make the most of your time!`;
      case "sudo":
        const sudo = [
          "Nice try, but even sudo can't make you cool. That's all natural, baby! 😎",
          "Just because you can, doesn't mean you should...",
        ];
        return sudo[Math.floor(Math.random() * sudo.length)];
      case "fact":
        const facts = [
          "Honey never spoils.",
          "A group of flamingos is called a 'flamboyance'.",
          "Octopuses have three hearts.",
          "Bananas are berries, but strawberries aren't.",
          "The first computer bug was an actual real-life bug. A moth, to be precise!",
          "The programming language Python isn't named after a snake, but after Monty Python!",
          "The first computer mouse was made of wood!",
          "The world's first computer programmer was a woman named Ada Lovelace.",
          "The first electronic computer ENIAC weighed more than 27 tons!",
        ];
        return facts[Math.floor(Math.random() * facts.length)];
      case "fortune":
        const fortunes = [
          "You will debug a major issue with a single console.log().",
          "A great open-source contribution is in your future.",
          "Your next side project will go viral. Choose wisely!",
          "You will finally understand that one Stack Overflow answer.",
          "Your code will work on the first try. Yes, really!",
        ];
        return fortunes[Math.floor(Math.random() * fortunes.length)];
      case "rickroll":
        return "Never gonna give you up, never gonna let you down...";
      case "hack":
        return "Accessing secure server...\nBypassing firewall...\nDownloading confidential files...\nJust kidding! 😂";
      case "sing":
        return "🎶 Twinkle, twinkle, little star, how I wonder what you are... 🎶";
      default:
        return "Command not found. Type 'help' for a list of available commands.";
    }
  };

  const getDirectoryContent = (
    path: string
  ): { content: any; isDirectory: boolean } | null => {
    const parts = path.split("/").filter(Boolean);
    let current: any = fileSystem["/"];
    for (const part of parts) {
      if (current[part]) {
        if (typeof current[part] === "object" && !current[part].type) {
          current = current[part];
        } else if (current[part].type === "file") {
          return { content: current[part], isDirectory: false };
        }
      } else {
        return null;
      }
    }
    return { content: current, isDirectory: true };
  };

  const changeDirectory = (dir: string): string => {
    if (!dir) return "Please specify a directory.";

    if (dir === ".." && currentDir === "/") return "Cannot go up from root.";

    let newDir = currentDir;

    if (dir === "/") {
      newDir = "/";
    } else if (dir === "..") {
      if (newDir !== "/") {
        newDir = newDir.split("/").slice(0, -1).join("/") || "/";
      }
    } else {
      const targetDir = dir.startsWith("/")
        ? dir
        : `${currentDir}/${dir}`.replace(/\/+/g, "/");

      const directoryContent = getDirectoryContent(targetDir);

      if (directoryContent) {
        if (!directoryContent.isDirectory) {
          return `'${dir}' is a file, not a directory use 'cat ${dir}'.`;
        }

        newDir = targetDir;
      } else {
        return `Directory '${dir}' does not exist.`;
      }
    }

    setCurrentDir(newDir);
    return "";
  };

  const listDirectory = (): JSX.Element => {
    const content = getDirectoryContent(currentDir);
    if (!content) return <div>Directory does not exist.</div>;

    return (
      <div className="flex flex-wrap gap-3">
        {Object.keys(content.content).map((key) => {
          const item = content.content[key];
          const isDirectory = typeof item === "object" && !item.type;

          return (
            <div key={key} className="flex items-center">
              {isDirectory ? (
                <FaFolder className="inline-block h-4 w-4 mr-2 text-yellow-500" />
              ) : (
                <FaFile className="inline-block h-4 w-4 mr-2 text-foreground/70" />
              )}
              <span>{key}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const catFile = (args: string) => {
    if (!args) return "Please specify a file.";

    console.log(args);

    const targetDir = args.startsWith("/")
      ? args
      : `${currentDir}/${args}`.replace(/\/+/g, "/");

    console.log(targetDir);

    const fileName = targetDir.split("/").filter(Boolean).slice(-1)[0];
    const content = getDirectoryContent(targetDir);

    if (!content) {
      return "No such file found";
    }

    if (content?.isDirectory) {
      return `${args} is not a file`;
    } else {
      return (
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center">
            <FaFile className="inline-block h-3 w-3 mr-2 text-foreground/70" />
            {fileName}
          </div>
          {content?.content.content}
        </div>
      );
    }
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.scrollIntoView();

    const cmd = input.trim().toLowerCase();
    const commandOutput = processCommand(cmd);

    if (cmd !== "clear") {
      setHistory((prev) => [
        ...prev,
        { input: cmd, output: commandOutput, directry: currentDir },
      ]);
    }
    setInput("");
  };

  const handleCloseClick = () => {
    router.push("/", {
      scroll: true,
    });
  };

  return (
    <div className="w-full max-w-4xl  shadow-lg bg-[#ffffff] dark:bg-[#101110]  rounded-lg overflow-hidden dark:shadow-2xl  border border-[#cccccc] dark:border-border no-scrollbar">
      <div className="px-4 py-2 flex items-center justify-between bg-gradient-to-r from-[#dcdcdc] to-[#f0f0f0] dark:from-[#272727] dark:to-[#292c29]">
        <div className="flex space-x-2">
          <div
            className="w-3 h-3 rounded-full bg-red-500 items-center group hover:scale-[1.3] transition-all duration-300 cursor-pointer"
            onClick={handleCloseClick}
          >
            <Tooltip delay={10} content="Close terminal" position="top">
              <X className="w-3 h-3 text-red-500 group-hover:text-gray-200 transition-colors ease-in-out duration-200" />
            </Tooltip>
          </div>
          <Tooltip delay={10} content="Minimize terminal" position="top">
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-[1.3] transition-all duration-300"></div>
          </Tooltip>
          <Tooltip delay={10} content="Maximize terminal" position="top">
            <div className="w-3 h-3 rounded-full bg-green-500 hover:scale-[1.3] transition-all duration-300"></div>
          </Tooltip>
        </div>
        <div className="flex items-center justify-center gap-3 text-foreground text-sm">
          <FaTerminal className="text-sm" />
          <span>HarshOS Terminal</span>
        </div>
      </div>
      <div
        className="p-4 h-96 overflow-y-auto font-mono text-sm text-green-400 scrollbar-terminal"
        ref={outputRef}
        onClick={handleTerminalClick}
      >
        {history.map((item, index) => (
          <div key={index} onClick={(e) => e.stopPropagation()}>
            <div className="flex">
              <span className="mr-2 text-blue-700 dark:text-blue-400">
                {item.directry !== "" ? `${item.directry} $` : ""}
              </span>
              <span className="text-green-600 dark:text-green-400">
                {item.input}
              </span>
            </div>
            <div
              className="text-green-600 dark:text-green-400 whitespace-pre-line"
              // onClick={(e) => e.stopPropagation()}
            >
              {item.output}
            </div>
          </div>
        ))}
        <form className="flex" onSubmit={handleInputSubmit}>
          <span
            className="mr-2 text-blue-700 dark:text-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            {currentDir} $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-transparent outline-none text-green-600 dark:text-green-400"
          />
        </form>
      </div>
    </div>
  );
};

export default InteractiveTerminal;
