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
    <div className="md:hover:bg-card/20 cursor-pointer py-6 md:py-12 w-full md:p-6 md:hover:scale-[0.97] duration-200 transition-all border-b border-border border-dashed">
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

const Projects = () => {
  const projectsData = [
    {
      title: "Synapse - AI Assistant",
      author: "harshyadavone",
      liveLink: "https://synapse-search.vercel.app/",
      githubLink: "https://github.com/harshyadavone/synapse-search",
      description:
        "A web search assistant that uses AI to provide relevant information and answers questions. A web search assistant that uses AI to provide relevant information and answers questions.",

      technologies: [
        "Nextjs",
        "Gemini AI",
        "Typescript",
        "Langchain",
        "Google Search API",
      ],
    },
    {
      title: "Zync - Video Streaming PWA",
      author: "harshyadavone",
      liveLink: "https://zync-v1.onrender.com/",
      githubLink:
        "https://github.com/harshyadavone/ZYNC-video-streaming-pwa-fronend",
      description:
        "A progressive web app for video streaming with an advanced, infinitely scalable nested comment system and robust search functionality.",

      technologies: [
        "React",
        "Typescript",
        "NodeJS",
        "ExpressJS",
        "PostgreSQL",
        "Docker",
        "Prisma",
        "Tanstack-query",
      ],
    },
    {
      title: "Food-Ordering-App",
      author: "harshyadavone",
      liveLink: "https://food-ordering-app-frontend-so2p.onrender.com/",
      githubLink: "https://github.com/harshyadavone/food-ordering-app-frontend",
      description:
        "An advanced food ordering application with user authentication via Auth0, featuring search functionality and filters for an enhanced user experience.",
      technologies: [
        "React",
        "NodeJS",
        "ExpressJS",
        "MongoDB",
        "Auth0",
        "Stripe",
      ],
    },
    {
      title: "Vibe - Social Media App",
      author: "harshyadavone",
      liveLink: "https://vibe-lklt.onrender.com/",
      githubLink: "https://github.com/harshyadavone/vibe",
      description:
        "A comprehensive social media web application with full CRUD operations, featuring user profiles, a follow/unfollow system, and interactive liking and commenting functionalities.",
      technologies: ["React", "NodeJS", "ExpressJS", "MongoDB", "Firebase"],
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold text-foreground my-4 md:mb-6">
        Projects
      </h2>
      <div className="border-b border-border/40" />
      <div className="grid grid-cols-1 md:grid-cols-1">
        {projectsData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
