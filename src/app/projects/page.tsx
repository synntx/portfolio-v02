import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/lib/ProjectsData";

const Page = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold text-foreground my-4 md:mb-6">
        Projects
      </h2>
      <div className="border-b border-border/80" />
      <div className="grid grid-cols-1">
        {projectsData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Page;
