import React from "react";

const Header = () => {
  return <div className="main-container">
  <div className="">
    <div
      className={`h-44 w-full bg-cover bg-center mb-8 flex items-center justify-center bg-no-repeat bg-[url(./data/images/header_graphic_img.png)] rounded-b-lg`}
    >
      <h1 className="text-2xl md:text-5xl text-center text-white font-serif font-extrabold">
        PI/PO to CPI Migration Tool
      </h1>
    </div>
  </div>
</div>;
};

export default Header;
