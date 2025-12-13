import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#14532D] text-white mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">
            <p>© {new Date().getFullYear()} PennyGrid. All rights reserved.</p>
          </div>
          <div className="text-sm mt-2 md:mt-0">
            <p>Developed by <span className="font-semibold">Jigyansu Mishra</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

