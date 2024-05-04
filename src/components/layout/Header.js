import React from "react";

const Header = () => {
  return <div className="main-container">
  <div className="">
    <div
      // className={`h-44 w-full bg-cover bg-center mb-8 flex items-center justify-center bg-no-repeat bg-[url(./data/images/header_graphic_img.png)] rounded-b-lg`}
      className="bg-[#2c4b60] p-1"
    >
      <h2 className="text-sm md:text-2xl text-left text-white py-2 px-4">
        PO to CPI Migration Tool
      </h2>
    </div>
  </div>
</div>;
};

export default Header;
