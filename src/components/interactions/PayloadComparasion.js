import Navbar from "../layout/Navbar"
import Footer from "../layout/Footer";
import { Link } from "react-router-dom";
import Header from "../layout/Header";
import { useState } from "react";
import { JsonFileComparer } from "./JsonFileComparer";
import { XmlFileComparer } from "./XmlFileComparer";
import XmlPayloadComparison from "./XmlPayloadComaprison";
import JsonPayloadComparer from "./JsonPayloadComparer";
export const PayloadComparison = () => {
  const [selectedOption , setSelectedOption] = useState("Compare JSON File");
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  }

  const componentMap = {
    'Compare JSON File': <JsonFileComparer />,
    'Compare XML File': <XmlFileComparer />,
    'Compare JSON Payload': <JsonPayloadComparer />,
    'Compare XML Payload': <XmlPayloadComparison />,
  };

  return (
    <>
    <Navbar />
      <Header />
        <div className=" w-full mx-auto justify-around gap-10 font-serif flex flex-col ">

          <div className="mx-auto  w-[90%] ml-20 mb-32">
            <div className="w-[50%] mx-auto">
              <select className="w-full mb-10 p-4" value={selectedOption} onChange={handleChange}>
                {Object.keys(componentMap).map((option) => (
                <option key={option} value={option} className="p-2">
                  {option}
                </option>
              ))}
              </select>
            </div>
          <div className="">
          {componentMap[selectedOption]}
          </div>
          </div>
          
        </div>
      
      
    {/* <Footer/> */}
    </>
  )
}