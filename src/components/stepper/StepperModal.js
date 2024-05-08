import React, { useEffect, useState } from "react";
import Steps from "./Steps";
//forms
import Introduction from "./stepperForms/Introduction";
import CpiDetails from "./stepperForms/CpiDetails";
import ApiDetails from "./stepperForms/ApiDetails";
import PODetails from "./stepperForms/PODetails";
//toastify
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const StepperModal = ({
  toggleStepper,
  setAgents,
  setEditingAgentIdx,
  editingAgentIdx,
}) => {
  const [step, setStep] = useState(1);
  const [currAgent, setCurrAgent] = useState(null);
  const [disableNext, setDisableNext] = useState(true);
  const [testingConn, setTestingConn] = useState(false);

  //useffect to get values restored if any agents details is partially saved
  useEffect(() => {
    const currAgentLocal = JSON.parse(localStorage.getItem("currAgent"));
    if (currAgentLocal) {
      setCurrAgent(currAgentLocal);
    }
    // console.log(currAgentLocal, "local useff");
  }, [disableNext]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
    // console.log(currAgent, "next btn clicked");
    setDisableNext(true);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
    setDisableNext(true);
  };

  const handleSubmitAgent = () => {
    const currAgent = JSON.parse(localStorage.getItem("currAgent"));

    //adding currAgent to agent list in local storage
    let allPrevAgents = JSON.parse(localStorage.getItem("agents"));

    if (editingAgentIdx >= 0 && allPrevAgents) {
      allPrevAgents[editingAgentIdx] = currAgent;
      localStorage.setItem("agents", JSON.stringify(allPrevAgents));
    } else {
      localStorage.setItem(
        "agents",
        JSON.stringify([...(allPrevAgents ? allPrevAgents : []), currAgent])
      );
    }

    //deleting current-agent after adding it to 'agents'
    localStorage.removeItem("currAgent");

    setAgents(JSON.parse(localStorage.getItem("agents")));
    toast.success(
      editingAgentIdx >= 0 && allPrevAgents
        ? "Tenant Details Edited Succesfully - Submitting... !"
        : "Tenant Added Succesfully - Submitting... !",
      {
        position: toast.POSITION.TOP_RIGHT,
      }
    );
    setEditingAgentIdx(-1);
    setTimeout(() => {
      toggleStepper();
    }, 2500);
  };
  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-0rem)] max-h-full bg-opacity-50 bg-black"
    >
      <div className="relative mx-auto my-16 md:w-[70%] sm:w-[90%] w-[100%]   max-h-full">
        {/* Modal content */}

        <div className="relative bg-white rounded-lg shadow ">
          <ToastContainer autoClose={2000} />
          {/* Modal header */}
          <div className="flex flex-col items-start justify-between md:px-10 px-5 pt-4 border-b-2 rounded-t ">
            <h3 className="text-2xl  font-semibold text-gray-900 ">
              Add Tenant
            </h3>

            <Steps
              step={step}
              setStep={setStep}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </div>
          {/* Modal body */}
          {step === 1 && <Introduction />}
          {step === 2 && (
            <PODetails
              setDisableNext={setDisableNext}
              testingConn={testingConn}
              setTestingConn={setTestingConn}
              currAgent={currAgent}
            />
          )}
          {step === 3 && (
            <CpiDetails
              setDisableNext={setDisableNext}
              testingConn={testingConn}
              setTestingConn={setTestingConn}
              currAgent={currAgent}
            />
          )}
          {step === 4 && (
            <ApiDetails
              setDisableNext={setDisableNext}
              testingConn={testingConn}
              setTestingConn={setTestingConn}
              currAgent={currAgent}
            />
          )}
          {/* Modal footer */}
          <div className="flex md:justify-end justify-center md:px-10 px-6  py-3 space-x-2 border-t-2 border-gray-200 rounded-b ">
            {step !== 1 && (
              <button
                className="bg-[#2c4b60] text-white  md:px-5 px-2  py-1 rounded-sm  hover:bg-[#3b6978]"
                onClick={handleBack}
              >
                Back
              </button>
            )}

            {step === 4 ? (
              <button
                className={` text-white  md:px-5 px-2   py-1 rounded-sm   ${
                  disableNext && step !== 1
                    ? " bg-gray-400"
                    : "bg-[#2c4b60] hover:bg-[#3b6978]"
                }`}
                onClick={handleSubmitAgent}
                disabled={disableNext && step !== 1}
              >
                Submit
              </button>
            ) : (
              <button
                className={` text-white  md:px-5 px-2  py-1 rounded-sm   ${
                  disableNext && step !== 1
                    ? " bg-gray-400"
                    : "bg-[#2c4b60] hover:bg-[#3b6978]"
                }`}
                onClick={handleNext}
                disabled={disableNext && step !== 1}
              >
                Next
              </button>
            )}
            <button
              className="bg-[#2c4b60] text-white md:px-5 px-2 py-1 rounded-sm  hover:bg-[#3b6978]"
              onClick={() => {
                toggleStepper();
                setEditingAgentIdx(-1);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperModal;
