export const fileSystem = {
  "/": {
    home: {
      harsh: {
        projects: {
          "react-app": {
            type: "file",
            content:
              "React project files: A modern web application using React and Next.js",
          },
          "node-api": {
            type: "file",
            content:
              "Node.js API project: RESTful API built with Express and MongoDB",
          },
          "portfolio-site": {
            type: "file",
            content:
              "Personal portfolio website built with Next.js and Tailwind CSS",
          },
          ".secret-project": {
            type: "file",
            content:
              "🕵️ You've found a secret project! It's a time machine built with JavaScript. Don't tell anyone!",
          },
        },
        documents: {
          "resume.pdf": {
            type: "file",
            content: "Harsh Yadav's professional resume (PDF format)",
          },
          "blog-ideas.txt": {
            type: "file",
            content:
              "1. Mastering React Hooks\n2. Building Scalable Node.js Applications\n3. CSS Grid vs Flexbox\n4. TypeScript Best Practices",
          },
          ".hidden-diary": {
            type: "file",
            content:
              "Dear Diary, today I finally understood how to center a div. It was a good day.",
          },
        },
        "skills.txt": {
          type: "file",
          content:
            "JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, Tailwind CSS, Git, GitHub, Vercel, AWS, Docker, GraphQL",
        },
        "contact.txt": {
          type: "file",
          content:
            "Email: harshyadav00000@gmail.com\nLinkedIn: https://www.linkedin.com/in/harshyadav/\nGitHub: https://github.com/harshyadavone/\nTwitter: @harshyadavdev",
        },
        "about-me.txt": {
          type: "file",
          content:
            "Hi, I'm Harsh Yadav, a passionate full-stack developer with a love for creating efficient and user-friendly web applications. I specialize in JavaScript technologies and enjoy solving complex problems.",
        },
      },
      public: {
        "welcome.txt": {
          type: "file",
          content:
            "Welcome to HarshOS! Feel free to explore the file system using commands like 'ls', 'cd', and 'cat'.",
        },
      },
    },
    etc: {
      "config.json": {
        type: "file",
        content:
          '{\n  "version": "1.0.0",\n  "theme": "dark",\n  "language": "en"\n}',
      },
      ".secret-config": {
        type: "file",
        content:
          '{\n  "cheat_code": "up up down down left right left right B A",\n  "meaning_of_life": 42\n}',
      },
    },
    usr: {
      bin: {
        "custom-script.sh": {
          type: "file",
          content:
            '#!/bin/bash\necho "This is a custom script"\n# todo: add custom-script',
        },
      },
      lib: {
        "helper-functions.js": {
          type: "file",
          content:
            "// Helper functions\nfunction formatDate(date) {\n  // Implementation here\n}\n\nfunction calculateSum(numbers) {\n  // Implementation here\n}\n\n// Secret function\nfunction secretFunction() {\n  console.log('You found the secret function! 🎉');\n}",
        },
      },
    },
    var: {
      log: {
        "system.log": {
          type: "file",
          content:
            "2023-05-15 10:30:15 - System started\n2023-05-15 10:30:16 - Initializing services\n2023-05-15 10:30:18 - All services running",
        },
        ".hidden-log": {
          type: "file",
          content:
            "2023-05-15 03:14:15 - 🍕 Late night coding session started\n2023-05-15 07:30:00 - 💤 Fell asleep on keyboard. Commit message: 'asdfghjkl'",
        },
      },
    },
    ".secret-directory": {
      "treasure-map.txt": {
        type: "file",
        content: "🗺 🏴‍☠️ ",
      },
      "quantum-computer.js": {
        type: "file",
        content:
          "// TODO: Implement quantum computing algorithm\n// Note: May require understanding of parallel universes",
      },
    },
  },
};

export type FileSystemItem = {
  type: "file" | "directory";
  content?: string;
  [key: string]: any;
};

export type FileSystem = {
  [key: string]: FileSystem | FileSystemItem;
};
