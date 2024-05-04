import React from "react";

const Steps = ({ step, setStep, handleNext, handleBack }) => {
  return (
    <div className="relative mt-4 w-full ">
      <div className="z-10 w-full grid grid-cols-4 gap-0 justify-between text-sm font-medium text-gray-500">
        <div
          className={`flex transition-all w-full justify-center duration-200 ease-in-out  items-center gap-2 bg-white py-2 pr-2 ${
            step >= 1 &&
            "border-b-2 shadow-[5px_5px_5px_0px_rgba(48,38,185,0.3)]  border-[#2c4b60] cursor-pointer"
          }`}
        >
          <span
            className={`h-8 min-w-[2rem] transition-all duration-300 ease-in-out rounded-full  text-center pt-1 border-2 border-[#2c4b60] font-bold ${
              step >= 1 ? "bg-[#3b6978] text-white" : "bg-gray-100"
            }`}
          >
            1
          </span>
          <span className="hidden md:block"> Introduction </span>
          <span
            className={` xl:32 lg:w-20 hidden sm:block md:w-15 sm:w-6 transition-all duration-300 ease-in-out border-b-2 ${
              step > 1 ? "border-[#2c4b60]" : "border-[#d1e3f8]"
            }`}
          />
        </div>

        <div
          className={`flex transition-all duration-200 ease-in-out w-full justify-center  items-center gap-2 bg-white p-2 ${
            step >= 2 &&
            "border-b-2 shadow-[5px_5px_5px_0px_rgba(48,38,185,0.3)] border-[#2c4b60] cursor-pointer"
          }`}
        >
          <span
            className={`h-8 min-w-[2rem] transition-all duration-300 ease-in-out rounded-full  text-center pt-1 border-2 border-[#2c4b60] font-bold ${
              step >= 2 ? "bg-[#3b6978] text-white" : "bg-gray-100"
            }`}
          >
            2
          </span>

          <span className="hidden md:block"> PO Details </span>
          <span
            className={` xl:32 lg:w-20 hidden sm:block md:w-15 sm:w-6 transition-all duration-300 ease-in-out  border-b-2 ${
              step > 2 ? "border-[#2c4b60]" : "border-[#d1e3f8]"
            }`}
          />
        </div>

        <div
          className={`flex w-full  transition-all duration-200 ease-in-out justify-center items-center gap-2 bg-white p-2 ${
            step >= 3 &&
            "border-b-2 shadow-[5px_5px_5px_0px_rgba(48,38,185,0.3)]  border-[#2c4b60] cursor-pointer"
          }`}
        >
          <span
            className={`h-8 min-w-[2rem] transition-all duration-300 ease-in-out rounded-full  text-center pt-1 border-2 border-[#2c4b60] font-bold ${
              step >= 3 ? "bg-[#3b6978] text-white" : "bg-gray-100"
            }`}
          >
            3
          </span>

          <span className="hidden md:block"> CPI Details </span>
          <span
            className={` xl:32 lg:w-20 hidden sm:block md:w-15 sm:w-6 transition-all duration-300 ease-in-out border-b-2 ${
              step > 3 ? "border-[#2c4b60]" : "border-[#d1e3f8]"
            }`}
          />
        </div>
        <div
          className={`flex w-full  transition-all duration-200 ease-in-out justify-center  items-center gap-2 bg-white p-2 ${
            step >= 4 &&
            "border-b-2  shadow-[0px_15px_15px_-15px_rgba(48,38,185,0.8)] border-[#2c4b60] cursor-pointer"
          }`}
        >
          <span
            className={` transition-all duration-300 ease-in-out h-8 min-w-[2rem] rounded-full   text-center pt-1 border-2 border-[#2c4b60] font-bold ${
              step >= 4 ? "bg-[#3b6978] text-white" : "bg-gray-100"
            }`}
          >
            4
          </span>

          <span className="hidden md:block"> API Details </span>
        </div>
      </div>
    </div>
  );
};

export default Steps;
