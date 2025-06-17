const experiences = [
  {
    role: "Software Engineer Intern",
    company: "LibraAI",
    period: "Apr 2025 – Present",
    description:
      "Developing an AI-powered WorkOS that unifies enterprise applications like Google Drive, Slack, and Notion into a single source of truth. Responsible for building out core application functionality, integrating third-party APIs, and engineering a high-performance file search feature with Node.js and Typesense to provide users with instant, intelligent answers.",
    technologies: [
      "React (Vite)",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Golang",
      "Typesense",
    ],
  },
  {
    role: "Full Stack Intern",
    company: "Tracks & Towers",
    period: "Feb 2025 – Apr 2025",
    description:
      "Contributed to a full-stack ERP system by developing RESTful APIs and responsive frontend modules. Architected and built an AI chatbot to enable natural language interaction with project data and containerized services with Docker.",
    technologies: ["Node.js", "PostgreSQL", "Redis", "Docker"],
  },
];

const Experience = () => (
  <div className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8 mb-8">
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-3xl font-semibold text-foreground/90">Experience</h2>
    </div>
    <div className="flex flex-col">
      <div className="border-b border-dashed border-border/40 mt-2" />
      {experiences.map((exp, idx) => (
        <div
          key={idx}
          className="p-6 py-10 border-b border-dashed border-muted cursor-pointer hover:bg-muted/10 last:border-b-0"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-medium mb-2">{exp.role}</span>
              <span className="text-accent font-medium">@{exp.company}</span>
            </div>
            <span className="text-xs text-secondary">{exp.period}</span>
          </div>
          <p className="text-foreground/70 py-2">{exp.description}</p>
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech) => (
              <div key={tech} className="py-2">
                <span
                  key={tech}
                  className="bg-muted/60 text-foreground/80 px-2 py-1.5 rounded-lg text-xs"
                >
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Experience;
