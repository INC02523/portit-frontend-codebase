import React from "react";
import Navbar from "../components/layout/Navbar";
import homepageImage from "../data/images/homepageImage.svg";
import logo from "../data/images/Jacana_Logo-removebg-preview.png";
import { Link } from "react-router-dom";
import Footer from "./layout/Footer";

const StartPage = () => {
  return (
    <>
      {/* <Navbar /> */}
      
      <div className="flex justify-evenly items-center bg-gradient-to-b from-blue-300 to-white h-screen relative">
        {/* Left Column */}
        {/* <div className="absolute -top-24 left-0">
          <img
              src={logo}
              alt="Homepage"
              className="object-cover mt-20"
            />
        </div> */}
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col items-center justify-center mt-10">
            <h1
              className="text-9xl font-bold mb-4 ml-10 text-[#2c4b60]"
              style={{
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#2c4b60",
                textShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              <span className="shine">P</span>
              <span className="shine">O</span>
              <span className="shine">r</span>
              <span className="shine">t</span>
              <span className="shine">I</span>
              <span className="shine">T</span>
            </h1>
            <h2 className="text-xl mb-4 ml-10 text-[#2c4b60]">
              SAP PO 7.5 to CPI Migration Simplified
            </h2>
            <Link to="/home">
              <button className="bg-[#2c4b60] text-white rounded-full py-3 px-8 text-lg font-semibold ml-8 hover:bg-[#3b6978] transition-colors duration-300">
                Start Migration
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <img
            src={homepageImage}
            alt="Homepage"
            className="w-full h-full object-cover mt-20"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StartPage;
