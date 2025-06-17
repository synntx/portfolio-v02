import Projects from "@/components/Projects";
import Link from "next/link";
import Terminal from "@/components/Terminal";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import Tooltip from "@/components/ui/Tooltip";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-start min-h-screen">
      <header className="w-full flex justify-between items-center max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-allura flex gap-3 items-center justify-center text-xl">
          <Image
            src="/logo.png"
            alt="Harsh's logo"
            width={40}
            height={40}
            className="bg-gradient-to-t from-black/90 to-black/50 dark:bg-none rounded-xl"
          />
          Harsh
        </h1>
        <Tooltip delay={10} content="Toggle theme" position="left">
          <ThemeToggle />
        </Tooltip>
      </header>
      <div className="flex flex-col items-start justify-start w-full max-w-4xl gap-10 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-2">
            Harsh Yadav
          </h1>
          <p className="text-lg text-secondary">
            - 20y/o Tech Enthusiast, India
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-lg text-foreground/80 leading-relaxed">
            Hi! I&apos;m Harsh, a software engineer from India with a passion
            for tech. I mostly work with
            <span className="font-semibold">
              {" "}
              TypeScript, React, Next.js, and Node.js
            </span>{" "}
            for web development, and I&apos;ve been exploring
            <span className="font-semibold"> Go</span> for backend projects.
            I&apos;m always excited to learning something new. Currently diving
            into Rust to understand systems programming better.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            If you&apos;d like to connect, feel free to reach out on{" "}
            <Link
              href="https://twitter.com/harshyadavone"
              className="text-accent hover:text-green-500 tracking-wide transition-colors duration-200 ease-in-out"
            >
              Twitter
            </Link>{" "}
            or drop me an email at{" "}
            <Link
              href="mailto:harshdana@protonmail.com"
              className="text-accent hover:text-green-500 tracking-wide transition-colors duration-200 ease-in-out"
            >
              harshdana@protonmail.com
            </Link>
            . I&apos;d love to hear from you!
          </p>
        </div>
      </div>
      <Terminal />
      <Projects />
      <div className="w-full max-w-full self-center">
        <Footer />
      </div>
    </main>
  );
}
