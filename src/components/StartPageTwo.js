import BannerImg from "../data/images/Banner.png"
import VectorCloud from "../data/images/Vectorcloud.png";
import Vector from "../data/images/Vector.png";
import {Link} from "react-router-dom";

const StartPageTwo = () => {
  return (
  //   <div className="flex">
  //     {/* Larger part (80%) */}
  //     <div className="w-3/5">
  //       {/* Centering content */}
  //       <div className="h-screen flex justify-center items-center">
  //         {/* Image */}
  //         <img src={BannerImg} alt="Banner" className="max-w-full max-h-full object-contain w-[50%]" />
  //       </div>
  //     </div>
  //     {/* Smaller part (20%) */}
  //     <div className="w-2/5">
  //       {/* Centering content */}
  //       <div className="h-screen flex flex-col bg-[#2A4862] text-white justify-evenly">
  // {/* Header */}
  //         <header className=" flex flex-col w-[80%] mx-auto">
  //           <h1 className="text-7xl text-left font-bold mb-4">POrtIT</h1>
  //           <span className="">SAP PO 7.5 to IS Migration Simplified</span>
  //         </header>

  //         {/* Button */}
  //         <button className="self-center mb-8 p-22 bg-white text-[#2A4862] w-[80%]">Start Migration  &#129170;</button>
  //       </div>


  //     </div>
  //   </div>
  // <div className="flex h-screen">
  //     <div className="flex-1 flex items-center justify-center bg-gray-100">
  //       <img src={BannerImg} alt="Cloud" className="max-w-full h-auto" />
  //     </div>
  //     <div className="flex-1 flex flex-col items-center justify-center bg-blue-900 text-white p-8">
  //       <h1 className="text-4xl font-bold mb-4">POrtIT</h1>
  //       <p className="text-lg mb-8">SAP PO 7.5 to CPI Migration Simplified</p>
  //       <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Start Migration &gt;</button>
  //       <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Hug x Hug</button>
  //     </div>
  //   </div>

  <div className="flex h-screen">
  <div className="flex-1 w-3/5 flex items-center justify-center relative">
    {/* <img src={InctureLogo} className="absolute top-6 left-6 w-32" alt=""/> */}
    <img src={BannerImg} alt="Server" className="max-w-full h-auto w-[50%]"/>
  </div>
  <div className="w-2/5 flex flex-col justify-center border-l-2 border-[#A1A7AE] text-white p-2 relative">
    <div className="p-1">
    <h1 className="text-5xl text-center text-[#2A4862] font-black">Integration <span className="font-extralight">Workbench</span></h1>
    <p className="mt-4 text-xl text-[#2A4862] text-center">One stop solution for all your Integration needs</p>
    <div className="flex justify-center">
    <Link to="/home" className="w-full flex justify-center">
      <button className="mt-24 text-xl font-semibold text-white bg-[#0A6Ed1] w-[95%] p-3 rounded">Begin Integration Journey</button>
    </Link>
    </div>
    </div>
    <img src={VectorCloud} alt="cloud" className="absolute top-10 right-0 w-24"/>
    <img src={Vector} alt="Cloud" className="absolute bottom-10 -left-6 w-28"/>
  </div>
</div>
  );
}

export default StartPageTwo;
