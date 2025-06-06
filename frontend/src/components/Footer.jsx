import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#84848482] text-[#272727d4] py-2 text-center font-sans mt-52 sticky bottom-0">
      <div>
        <p className="text-sm m-0">&copy; 2025 Rohit Kumar. All Rights Reserved.</p>
      </div>
      <div className="mt-2">
        <a
          href="https://www.linkedin.com/in/rohit-kumar011"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 text-sm hover:text-[#3498db] transition-colors duration-300"
        >
          LinkedIn
        </a>
        |
        <a
          href="mailto:rohitraj42192@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 text-sm hover:text-[#3498db] transition-colors duration-300"
        >
          Email
        </a>
      </div>
    </footer>
  );
};

export default Footer;
