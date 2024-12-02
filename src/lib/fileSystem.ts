export const fileSystem = {
  "/": {
    home: {
      harsh: {
        projects: {
          "zync-pwa": {
            type: "file",
            content:
              "Zync (Video Streaming Progressive Web App):\nTech stack: Reactjs, Typescript, NodeJS, ExpressJS, PostgreSQL, Cloudinary, Docker, Prisma, Tanstack-query\n- Implemented an advanced, infinitely scalable nested comment system.\n- Developed advanced search functionality with filters for title, tags, and description.\n- Robust user authentication and authorization following best practices.\n- Added lazy loading and memoization for performance and optimization.\n- Implemented validation using Zod.",
          },
          "food-ordering-app": {
            type: "file",
            content:
              "Food-Ordering-App:\nTech stack: Reactjs, NodeJS, ExpressJS, MongoDB, Auth0\n- Implemented user authentication and authorization with Auth0.\n- Advanced food ordering app with search functionality and filters.\n- Utilizes Tanstack Query for efficient data caching.\n- Provides real-time order status updates.\n- Integrates Stripe for secure payment processing.\n- Uses React Hooks for effective form state management and validation (Zod & Express Validator).",
          },
          "vibe-social-media-app": {
            type: "file",
            content:
              "Vibe (Social Media App):\nTech stack: Reactjs, NodeJS, ExpressJS, MongoDB, Firebase\n- Social media web app with CRUD operations.\n- Developed profile page.\n- Implemented follow/unfollow system.\n- Implemented liking and comment functionality.\n- Authentication using JWT, Google OAuth, and GitHub Auth.",
          },
          "synapse-ai-assistant": {
            type: "file",
            content:
              "Synapse - AI Assistant:\nTech stack: Nextjs, Gemini AI, Typescript, Langchain, Google Search API\n- A web search assistant that uses AI to provide relevant information and answers questions.\n- Using Google custom JSON search API for text and image search results and YouTube API for getting videos related to queries.\n- Used OpenWeather API for getting weather results and News API for getting news results.",
          },
          ".secret-project": {
            type: "file",
            content:
              "🕵️ You've found a secret project! It's a time machine built with JavaScript.",
          },
        },
        documents: {
          "resume.pdf": {
            type: "file",
            content:
              "Harsh Yadav resume (PDF format)\nEmail: harshdana1@gmail.com \nSkills:\n- Frameworks: React, NextJs, Express, Nodejs\n- Other Technologies: WebSockets, Redis, Stripe, Tanstack Query, React Hook Form, Auth0, Redux Toolkit\n- Databases: PostgreSQL, SQL, MongoDB\n- Development Tools: VSCode, Git, GitHub, Docker",
          },
          "blog-ideas.txt": {
            type: "file",
            content:
              "1. Mastering React Hooks\n2. Building Scalable Node.js Applications\n3. CSS Grid vs Flexbox\n4. TypeScript Best Practices",
          },
        },
        "skills.txt": {
          type: "file",
          content:
            "Frameworks: React, NextJs, Express, Nodejs\nOther Technologies: WebSockets, Redis, Stripe, Tanstack Query, React Hook Form, Auth0, Redux Toolkit\nDatabases: PostgreSQL, SQL, MongoDB\nDevelopment Tools: VSCode, Git, GitHub, Docker",
        },
        "contact.txt": {
          type: "file",
          content:
            "Email: harshdana1@gmail.com\nLinkedIn: https://www.linkedin.com/in/harshdana/\nGitHub: https://github.com/harshyadavone/\nTwitter: @harshyadavone",
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
            "Welcome to HarshOS! Explore the file system using commands like 'ls', 'cd', and 'cat'.",
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
            '#!/bin/bash\necho "This is a custom script"\n# TODO: add custom-script',
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
