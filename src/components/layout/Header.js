import React from "react";

const Header = () => {
  return <div className="main-container sticky top-0 z-50">
  <div className="">
    <div
      // className={`h-44 w-full bg-cover bg-center mb-8 flex items-center justify-center bg-no-repeat bg-[url(./data/images/header_graphic_img.png)] rounded-b-lg`}
      className="bg-[#2c4b60] p-1 flex text-center"
    >
      <h2 className="text-sm md:text-2xl text-left text-white py-2 px-4">
        PO to IS Migration Tool
      </h2>
      {/* <a href="/">
<li className="ml-4  hover:text-blue-500 group transition duration-300 list-none text-center">Home        
<span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>
</li>
</a> */}
    </div>
  </div>
</div>;
};

export default Header;
