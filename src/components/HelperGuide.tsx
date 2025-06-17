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
2. cd [directory] - Change directory
3. ls - List files in the current directory
4. cat [filename] - View contents of a file
5. clear - Clear the terminal screen
6. hello - Get a friendly ASCII art greeting
7. time - Check the current time
8. fact - Learn a random fact
9. sudo - Gain superuser privileges
10. exit - Exit the terminal



Tip: Type 'help' for a list of available commands
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
