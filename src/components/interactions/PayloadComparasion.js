import Navbar from "../layout/Navbar"
import Footer from "../layout/Footer";
import { Link } from "react-router-dom";

export const PayloadComparison = () => {
  return (
    <>
    <Navbar />
      <div className="main-container h-screen overflow-y-auto">
        <div className="">
          <div
            className={`h-44 w-full bg-cover bg-center mb-8 flex items-center justify-center bg-no-repeat bg-[url(./data/images/header_graphic_img.png)]`}
          >
            <h1 className="text-2xl md:text-5xl text-center text-white font-serif font-extrabold">
              PI/PO to CPI Migration Tool
            </h1>
          </div>
        </div>
        <div className=" w-1/2 mx-auto flex flex-col flex-wrap justify-around gap-10 h-64">

          <Link to="/payload-comparison/xml-comparer">
            <div className="bg-[#0070f2] p-8 rounded text-2xl text-center text-white font-bold hover:bg-[#3c72af] transition duration-400 cursor-pointer">COMPARE XML FILE</div>
          </Link>

          <Link to="">
            <div className="bg-[#0070f2] p-8 rounded text-2xl text-center text-white font-bold hover:bg-[#3c72af] transition duration-400 cursor-pointer">COMPARE XML PAYLOAD</div>
          </Link>

          <Link to="/payload-comparison/json-comparer">
            <div className="bg-[#0070f2] p-8 rounded text-2xl text-center text-white font-bold hover:bg-[#3c72af] transition duration-400 cursor-pointer">COMPARE JSON FILE</div>
          </Link>
          <div className="bg-[#0070f2] p-8 rounded text-2xl text-center text-white font-bold hover:bg-[#3c72af] transition duration-400 cursor-pointer">COMPARE JSON PAYLOAD</div>
        </div>
      </div>
      
    <Footer/>
    </>
  )
}