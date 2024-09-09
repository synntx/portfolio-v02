import Projects from "@/components/Projects";
import Link from "next/link";
import Terminal from "@/components/Terminal";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import Tooltip from "@/components/ui/Tooltip";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-start min-h-screen">
      <header className="w-full flex justify-between items-center max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="font-allura flex gap-3 items-center justify-center text-xl">
          <img
            src="/logo.png"
            className="w-10 h-10 bg-gradient-to-t from-black/90 to-black/50 dark:bg-none rounded-xl"
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
            Hi! I'm Harsh, a software developer from India with a passion for
            tech. I specialize in building websites using
            <span className="font-semibold">
              {" "}
              JavaScript, TypeScript, React, Next.js, and Node.js
            </span>
            . I'm always excited to learn and grow in the fast-paced world of
            software development. Currently learning Rust to get better at
            low-level programming.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            If you'd like to connect, feel free to reach out on{" "}
            <Link
              href="https://twitter.com/harshyadavone"
              className="text-accent hover:text-green-500 tracking-wide transition-colors duration-200 ease-in-out"
            >
              Twitter
            </Link>{" "}
            or drop me an email at{" "}
            <Link
              href="mailto:harshdana1@gmail.com"
              className="text-accent hover:text-green-500 tracking-wide transition-colors duration-200 ease-in-out"
            >
              harshdana1@gmail.com
            </Link>
            . I'd love to hear from you!
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
