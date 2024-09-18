import { ChevronRightIcon } from "lucide-react";
import ProjectCard from "./ProjectCard";
import Link from "next/link";

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
        {projectsData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
