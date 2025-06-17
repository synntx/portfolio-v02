import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/lib/ProjectsData";
import Link from "next/link";

const Page = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-3xl font-semibold text-foreground my-4 md:mb-6 group transition-all duration-300 active:scale-95"
      >
        <span className="w-0 opacity-0 group-hover:w-6 group-hover:opacity-100 transition-all duration-300 ease-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </span>
        Projects
      </Link>
      <div className="border-b border-border/80" />
      <div className="grid grid-cols-1">
        {projectsData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
      <div className="my-8 text-center">
        <a
          href="https://github.com/synntx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:underline"
        >
          For more projects, visit GitHub Profile
        </a>
      </div>
    </div>
  );
};

export default Page;
