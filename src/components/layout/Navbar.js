import React from "react";
import inctureIcon from "../../data/images/Incture-logo.svg";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = (props) => {


  
  return (
    <>
      <div className="p-1 shadow-xl flex items-center justify-between bg-[rgb(238, 238, 238)] px-5">
        <img src={inctureIcon} alt="inctureIcon" />
        <ul className="list-none flex align-middle tracking-wider space-x-10 ml-auto mr-10 font-semibold">
          <a href="/">

          <li className="ml-4  hover:text-blue-500 group transition duration-300">Home        
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>
          </li>
          </a>

          {/* <li className="ml-4 hover:text-blue-500  group transition duration-300">How it Works
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>

          </li>
          <li className="ml-4 hover:text-blue-500  group transition duration-300">Our Work
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>

          </li>
          <li className="ml-4 hover:text-blue-500  group transition duration-300">Pricing
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>

          </li>
          <li className="ml-4 hover:text-blue-500  group transition duration-300">About Us
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>

          </li> */}
        </ul>
        <AccountCircleIcon fontSize="large" color="primary"/>
      </div>
      <div>{props.children}</div>
    </>
  );
};

export default Navbar;
