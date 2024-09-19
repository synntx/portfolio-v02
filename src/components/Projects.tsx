import { ChevronRightIcon } from "lucide-react";
import ProjectCard from "./ProjectCard";
import Link from "next/link";
import projectsData from "@/lib/ProjectsData";

const Projects = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-foreground my-4 md:mb-6">
          Projects
        </h2>
        <div>
          <Link
            href="/projects"
            className="text-sm hover:bg-card/60 active:scale-[0.98] p-1.5 px-4 rounded-lg text-foreground/60 hover:text-foreground transition-all duration-200 flex items-center justify-center group"
          >
            View All
            <ChevronRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 hover:block group-hover:translate-x-1.5 duration-200 transition-all" />
          </Link>
        </div>
      </div>
      <div className="border-b border-border/40" />
      <div className="grid grid-cols-1 md:grid-cols-1">
        {projectsData.slice(0, 2).map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
