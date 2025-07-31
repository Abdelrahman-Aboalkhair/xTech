import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="max-w-[80%] mx-auto py-4 text-center text-gray-600">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SS-Ecommerce. All rights reserved.
        </p>
        <p className="text-xs mt-1">Built with ❤️ using Next.js and React.</p>
      </div>
    </footer>
  );
};

export default Footer;
