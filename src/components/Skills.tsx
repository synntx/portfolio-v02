"use client";
import React from "react";
import { ReactIcon, Typescript01Icon } from "@/components/Icon";
import { FaAws, FaNodeJs } from "react-icons/fa";
import { TbBrandNextjs } from "react-icons/tb";
import { SiDocker, SiGit, SiLangchain, SiRedux } from "react-icons/si";

interface Skill {
  icon: React.ElementType;
  name: string;
}

const SkillBox: React.FC<Skill> = ({ icon: Icon, name }) => {
  return (
    <div className="flex items-center space-x-2 p-2 marquee border border-border rounded-md">
      <Icon className="w-6 h-6 text-foreground/50" />
      <span className="text-sm text-foreground/80">{name}</span>
    </div>
  );
};

const Skills: React.FC = () => {
  const skills: Skill[] = [
    { icon: Typescript01Icon, name: "Typescript" },
    { icon: ReactIcon, name: "React" },
    { icon: FaNodeJs, name: "Node.js" },
    { icon: TbBrandNextjs, name: "Next.js" },
    { icon: FaAws, name: "AWS" },
    { icon: SiDocker, name: "Docker" },
    { icon: SiGit, name: "Git" },
    { icon: SiLangchain, name: "Langchain" },
    { icon: SiRedux, name: "Redux" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Teck Stack</h2>
      <div className="flex flex-wrap gap-3 ">
        {skills.map((skill, index) => (
          <SkillBox key={index} {...skill} />
        ))}
      </div>
    </div>
  );
};

export default Skills;
