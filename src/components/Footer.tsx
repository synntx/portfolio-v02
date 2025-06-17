import Link from "next/link";
import { GithubIcon, Linkedin02Icon, NewTwitterIcon } from "./Icon";
// import Tooltip from "./ui/Tooltip";
// import { SiBuymeacoffee } from "react-icons/si";

const Footer = () => {
  return (
    <div className="w-full">
      <footer className="bg-background text-foreground text-sm p-4 text-center border-t border-border">
        <div className="flex flex-row items-center justify-between mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 items-center justify-center">
            <Link
              href="https://github.com/synntx"
              target="_blank"
              rel="noreferrer"
              className="bg-card p-2 rounded-lg transistion-all duration-200 hover:scale-[0.95] active:scale-[0.92]"
            >
              <GithubIcon className="text-foreground h-5 w-5 " />
            </Link>
            <Link
              href="https://twitter.com/harshyadavone"
              target="_blank"
              rel="noreferrer"
              className="bg-card p-2 rounded-lg transistion-all duration-200 hover:scale-[0.95] active:scale-[0.92] hidden md:block"
            >
              <NewTwitterIcon className="text-foreground h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/harshdana"
              target="_blank"
              rel="noreferrer"
              className="bg-card p-2 rounded-lg transistion-all duration-200 hover:scale-[0.95] active:scale-[0.92]"
            >
              <Linkedin02Icon className="text-foreground h-5 w-5" />
            </Link>
          </div>
          <div className="flex gap-3 items-center justify-center">
            <div className="hidden md:block w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-inner" />
            <p className="flex gap-1">
              {" "}
              <span className="hidden md:block">Designed & </span> Developed by
              Harsh
            </p>
          </div>
        </div>
        {/* <Tooltip content="Design only" position="top" delay={30}>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <button className="px-3 py-1 text-xs text-neutral-900 bg-yellow-400 border border-yellow-300 hover:border-yellow-600 rounded-md transition-all duration-300 flex items-center space-x-1  hover:scale-[0.98] active:scale-[0.95]">
              <SiBuymeacoffee className="text-sm" />
              <span className="font-semibold transition-all duration-200 w-fit h-fit">
                Buy Me a Coffee
              </span>
            </button>
          </Link>
        </Tooltip> */}
      </footer>
    </div>
  );
};

export default Footer;
