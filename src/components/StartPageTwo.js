import BannerImg from "../data/images/Banner.png"

const StartPageTwo = () => {
  return (
    <div className="flex">
      {/* Larger part (80%) */}
      <div className="w-3/5">
        {/* Centering content */}
        <div className="h-screen flex justify-center items-center">
          {/* Image */}
          <img src={BannerImg} alt="Banner" className="max-w-full max-h-full object-contain w-[50%]" />
        </div>
      </div>
      {/* Smaller part (20%) */}
      <div className="w-2/5">
        {/* Centering content */}
        <div className="h-screen flex flex-col bg-[#2A4862] text-white justify-evenly">
  {/* Header */}
          <header className=" flex flex-col mx-6">
            <h1 className="text-6xl text-left font-bold mb-4">POrtIT</h1>
            <span className="">SAP PO 7.5 to IS Migration Simplified</span>
          </header>

          {/* Button */}
          <button className="self-center mb-8 ">Start Migration</button>
        </div>


      </div>
    </div>
  );
}

export default StartPageTwo;
