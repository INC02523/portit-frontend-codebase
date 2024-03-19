import React from "react";
import Navbar from "../components/layout/Navbar";
import homepageImage from "../data/images/homepageImage.svg";
import { Link } from "react-router-dom";
import Footer from "./layout/Footer";

const StartPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex bg-gradient-to-b from-blue-300 to-white">
        {/* Left Column */}
        <div className="flex-1 p-8 mt-20 ">
          <h1 className="text-4xl font-bold mb-4 ml-10">JACANA</h1>
          <h2 className="text-lg mb-4 ml-10">PI/PO to CPI Migration Tool</h2>
          <Link to="/home">
            <button className="bg-blue-500 text-white rounded-full py-3 px-8 text-lg font-semibold ml-8">
              Homepage
            </button>
          </Link>
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
