import React from "react";

/**
 * Navbar component
 */
function Navbar() {
  return (
    <div className="p-4 flex items-center gap-3 md:gap-5 justify-between md:justify-center">
      <span className="hidden md:block border-t w-1/6"></span>
      <span className="text-4xl font-title "> CALO</span>
      <span className="hidden md:block border-t w-1/6"></span>
      <div className="flex gap-4 text-sm md:hidden font-bold">
        <a href="#jobImages">Images</a>
        <a href="#jobList">Jobs</a>
      </div>
    </div>
  );
}

export default Navbar;
