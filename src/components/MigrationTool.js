import Navbar from "./layout/Navbar";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import React, { useEffect, useState } from "react";
import headerImg from "../data/images/Header-Banner.png";

function MigrationTool() {
  const [names, setNames] = useState(null);
  useEffect(() => {
    const currAgent = JSON.parse(localStorage.getItem("currAgent"));
    if (currAgent) {
      setNames({
        poName: currAgent?.poData?.name,
        cpiName: currAgent?.cpiData.name,
      });
    }
  }, []);
  return (
    <>
      <Navbar>
        <div className="md:w-[90%] mx-auto md:my-10 w-full">
          <div className="relative">
            <div className="">
              <img className="h-44 w-full" src={headerImg} alt="" />
            </div>

            <div className="absolute top-1/2 transform -translate-y-1/2 w-full md:left-0md:w-[60%] ">
              <h2 className="md:text-5xl font-bold text-white text-3xl text-center md:text-left md:ml-2">
                PI/PO to CPI Migration Tool
              </h2>
            </div>
          </div>

          <div className="w-fullm:w-[50%] mt-5">
            <h2 className="text-center md:text-left sm:text-xl font-bold md:text-3xl">
              {names &&
                `Agent name : ${names?.poName} | CPI Name: ${names?.cpiName}`}
            </h2>
          </div>

          <div className="md:mt-5 mt-7 md:w-[75%] flex  flex-col md:flex-row w-[70%] mx-auto md:mx-0 justify-between gap-3">
            <div className="bg-[#3026B9] hover:bg-[#5c5cb3] transition duration-400 md:p-16 text-2xl font-bold text-center p-10 rounded-lg text-zinc-200  hover:cursor-pointer hover:shadow-lg ">
              Migration Assessment
            </div>

            <Link to="/migration-process">
              <div className="bg-[#3026B9] hover:bg-[#5c5cb3] transition duration-400 md:p-16 text-2xl font-bold text-center p-10 rounded-lg text-zinc-200  hover:cursor-pointer hover:shadow-lg">
                Migration Process
              </div>
            </Link>

            <div className="bg-[#3026B9] hover:bg-[#5c5cb3] transition duration-400 md:p-16 text-2xl font-bold text-center p-10 rounded-lg text-zinc-200 hover:cursor-pointer hover:shadow-lg">
              Payload Comparision
            </div>
          </div>
        </div>
      </Navbar>
      <Footer />
    </>
  );
}

export default MigrationTool;
