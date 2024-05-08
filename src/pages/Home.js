import React from "react";
import Navbar from "../components/layout/Navbar";
import Configuration from "../components/interactions/Configuration";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <>
      {/* <Navbar> */}
      <Configuration />
      <Footer /> 
      {/* </Navbar> */}
    </>
  );
};

export default Home;
