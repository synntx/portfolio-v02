"use client";
import { useState } from "react";
import { BiQuestionMark } from "react-icons/bi";
import Modal from "./ui/Modal";

const HelperGuide = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const guideContent = `
Welcome to HarshOS Terminal!

Available Commands:
1. whoareyou - Learn about the developer
2. whoami - Find out who you are
3. cd [directory] - Change directory
4. ls - List files in the current directory
5. cat [filename] - View contents of a file
6. clear - Clear the terminal screen
7. hello - Get a friendly ASCII art greeting
8. joke - Hear a programming joke
9. time - Check the current time
10. sudo - Try to use admin privileges
11. fact - Learn a random fact
12. fortune - Get your fortune told
13. rickroll - Experience a classic internet prank
14. hack - Simulate a hacking attempt
15. sing - Enjoy a little song

Tip: Type 'help' for a list of available commands

Feedback:
If you have suggestions for new features, 
encountered any bugs, or want to share your experience, please reach out:

Email: harshdana1@gmail.com
Instagram: https://www.instagram.com/harshyadavone
Twitter: https://twitter.com/harshyadavone
GitHub: https://github.com/harshyadavone/harshOS

Your input is invaluable in making this project better. Thank you for your support!

Remember, this is a simulated environment. Have fun exploring!
  `;

  return (
    <>
      <div
        className="bg-card text-foreground/70 p-2 rounded-full hover:text-foreground cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-1 hover:scale-[0.95] active:scale-[0.90]"
        onClick={() => setShowModal(!showModal)}
      >
        <BiQuestionMark className="h-5 w-5" />
      </div>
      {showModal && (
        <Modal
          title="HarshOS Terminal Guide & Feedback"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="text-sm">
            <pre className="whitespace-pre-wrap">{guideContent}</pre>
          </div>
        </Modal>
      )}
    </>
  );
};

export default HelperGuide;
