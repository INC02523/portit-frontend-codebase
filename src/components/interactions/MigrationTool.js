import Navbar from "../layout/Navbar";
import { Link } from "react-router-dom";
import Footer from "../layout/Footer";
import React, { useEffect, useState } from "react";

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
        <div className="md:w-[100%]   w-full  h-screen overflow-y-auto">
          <div className="">
            <div
              className={`h-44 w-full bg-[length:100%_100%] bg-center mb-8 flex items-center   bg-no-repeat bg-[url(./data/images/header_graphic_img.png)]`}
            >
              <h1 className="text-2xl md:text-5xl  mx-8 text-white">
                PI/PO to CPI Migration Tool
              </h1>
            </div>
          </div>

          <div className="w-full lg:w-[50%] m:w-[50%] mt-5 mx-auto">
            <h2 className="text-center md:text-left sm:text-xl font-bold md:text-3xl">
              {names &&
                `Agent name : ${names?.poName} | CPI Name: ${names?.cpiName}`}
            </h2>
          </div>

          <div className="md:mt-20 mt-7 md:w-[100%] flex  flex-col md:flex-row w-[70%] mx-auto md:mx-0 justify-evenly items-center">
            {/* <div className="bg-[#3026B9] hover:bg-[#5c5cb3] transition duration-400 md:p-16 text-2xl font-bold text-center p-10 rounded-lg text-zinc-200  hover:cursor-pointer hover:shadow-lg ">
              Migration Assessment
            </div> */}

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
