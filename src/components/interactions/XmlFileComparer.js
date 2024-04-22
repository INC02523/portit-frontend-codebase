import {useState}  from "react";
import useXmlComparison from "../../hooks/useXmlComparison";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

export const XmlFileComparer = () => {
  const [xml1, setXmlFile1] = useState(null);
  const [xml2, setXmlFile2] = useState(null);

  const { comparisonResult, errorMessage, compareXmlFiles} = useXmlComparison();

  const handleFile1Change = (e) => {
    setXmlFile1(e.target.files[0]);
  }

  const handleFile2Change = (e) => {
    setXmlFile2(e.target.files[0]);
  }

  const handleSubmit = async () => {
    if(!xml1 || !xml2) {
      alert("Please select both XML files");
      return;
    }

    await compareXmlFiles(xml1, xml2);
    console.log("Comparison Result:", comparisonResult);
    console.log("Error Message:", errorMessage);
  }
  return (
    <>
    {/* <Navbar />
      <Header /> */}
    <div className="h-full shadow-lg p-5 bg-slate-100 w-1/2 mx-auto">
    <h2 className="text-2xl mb-4 text-center font-bold underline">XML FILE COMPARER</h2>

    <div className="flex flex-col justify-between">
      <div className="mb-1 flex flex-col ml-2">
        <label className="block mb-2 font-bold">Enter XML File 1:</label>
        <input type="file" onChange={handleFile1Change} className="border rounded w-full" accept="application/xml, text/xml"/>
      </div>

      <div className="mb-1 flex flex-col ml-2">
        <label className="block mb-2 font-bold">Enter XML File 2:</label>
        <input type="file" onChange={handleFile2Change} className="border rounded w-full" accept="application/xml, text/xml"/>
      </div>

      <div className="flex justify-center flex-col mt-5 items-center">
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded w-1/4 hover:bg-blue-700">
          Compare
        </button>
      <div>
      {comparisonResult && <div className={`text-white px-4 py-2 mt-4 rounded text-center ${comparisonResult === "XML files are equal." ? 'bg-green-500' : "bg-red-500"} `}>{comparisonResult}</div>}
      {errorMessage && <div className="bg-red-500 text-white px-4 py-2 mt-4 rounded text-center">Error: {errorMessage}</div>}
      </div>
    </div>
    </div>
    

    </div>
    </>
  )
}