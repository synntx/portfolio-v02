import Link from "next/link";
import { GithubIcon, LabelImportantIcon, LinkSquare02Icon } from "./Icon";
import Tooltip from "./ui/Tooltip";

interface Project {
  title: string;
  author: string;
  description: string[];
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div
      className="relative rounded-xl overflow-hidden h-fit group cursor-pointer border border-background transition-colors duration-300
      hover:border-border"
    >
      <img
        src="/bg.avif"
        alt={project.title}
        className="w-full h-full min-h-80 object-cover rounded-xl transition-all duration-300 group-hover:scale-105 opacity-50 group-hover:opacity-100 ease-in-out"
        aria-label={project.title}
      />
      <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-background/90 to-background/60 dark:from-black dark:to-black/40 rounded-lg dark:group-hover:from-black/60 dark:group-hover:to-black">
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Tooltip content="View on GitHub" position="right" delay={10}>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={project.githubLink}
                className="flex items-center justify-start gap-2 hover:text-foreground transition-colors duration-300 group/liveLink"
              >
                <GithubIcon className="w-3 h-3 text-foreground/50 transition-colors duration-300 group-hover/liveLink:text-foreground" />
                <span className="text-foreground/60 text-sm group-hover/liveLink:text-foreground transition-colors duration-300">
                  {project.author}
                </span>
              </Link>
            </Tooltip>
            <Tooltip content="Live Link" position="left" delay={10}>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={project.liveLink}
                className="flex items-center justify-start gap-2"
              >
                <LinkSquare02Icon className="w-5 h-5 text-foreground/50 hover:text-foreground transition-colors duration-300" />
              </Link>
            </Tooltip>
          </div>
          <div className="flex items-center justify-start gap-2 mb-3">
            <h4 className="text-foreground font-semibold text-xl tracking-wide">
              {project.title}
            </h4>
          </div>
          {project.description.map((desc: string, index: number) => (
            <p key={index} className="text-sm text-foreground/80 my-2">
              {desc}
            </p>
          ))}
          <div className="flex flex-col gap-2 items-start mt-2">
            <div className="flex flex-wrap  gap-2 pt-2 text-sm text-foreground/80">
              {project.technologies.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="bg-muted/50 text-foreground/70 px-2 rounded-full border border-border flex gap-1 items-center justify-center group-hover:text-foreground transition-colors duration-300"
                >
                  <LabelImportantIcon className="w-3 h-3 text-foreground/50" />{" "}
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
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
      description: [
        "- A web search assistant that uses AI to provide relevant information and answers questions.",
        "- Using Google custom json search api for text and image search results and youtube API for getting the videos related to query",
        "- used open weather api for getting the weather results and news api for getting the news results",
      ],
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
      description: [
        "- A progressive web app for video streaming with an advanced, infinitely scalable nested comment system and robust search functionality.",
        "- Implements user authentication, lazy loading, and memoization for optimal performance. Utilizes Zod for validation and follows best practices in development.",
      ],
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
      description: [
        "- An advanced food ordering application with user authentication via Auth0, featuring search functionality and filters for an enhanced user experience.",
        "- Integrates Tanstack Query for efficient data caching, provides real-time order updates, and uses Stripe for secure payments. Employs React Hooks and Zod for form management and validation.",
      ],
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
      description: [
        "- A comprehensive social media web application with full CRUD operations, featuring user profiles, a follow/unfollow system, and interactive liking and commenting functionalities.",
        "- Implements secure authentication using JWT, Google OAuth, and GitHub Auth, providing a robust and versatile user access system.",
      ],
      technologies: ["React", "NodeJS", "ExpressJS", "MongoDB", "Firebase"],
    },
  ];
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
