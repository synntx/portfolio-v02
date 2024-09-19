"use client";
import Link from "next/link";
import { GithubIcon, LinkSquare02Icon } from "./Icon";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="md:hover:bg-card/20 cursor-pointer py-6 md:py-12 w-full md:p-6 active:scale-[0.96] duration-200 transition-all border-b border-border border-dashed">
      <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
      <p className="text-secondary mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="bg-muted/60 text-foreground/70 px-2 py-1 rounded-lg text-sm"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="grid grid-flow-col items-center gap-4 mt-6 w-full">
        {project.liveLink && (
          <Link
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center transition-colors gap-2 text-accent p-2 bg-accent/5 hover:bg-accent/10 rounded-lg"
          >
            <LinkSquare02Icon className="w-5 h-5 text-accent" />
            <span>Live Site</span>
          </Link>
        )}
        {project.githubLink && (
          <Link
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center transition-colors gap-2 text-accent p-2 bg-muted/70 hover:bg-muted  rounded-lg"
          >
            <GithubIcon className="w-5 h-5 text-accent" />
            <span>Source Code</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
