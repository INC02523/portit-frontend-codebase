import { Link } from "react-router-dom";
import StepperModal from "../stepper/StepperModal";
import React, { useEffect, useState } from "react";
import Header from "../layout/Header";

const Configuration = () => {
  const [agents, setAgents] = useState([]);
  const [showStepper, setShowStepper] = useState(false);
  const [agentSelected, setAgentSelected] = useState(false);
  const [editingAgentIdx, setEditingAgentIdx] = useState(-1);

  const toggleStepper = () => {
    setShowStepper((prev) => !prev);
  };

  const handleAddAgent = () => {
    localStorage.removeItem("currAgent");
    setAgentSelected(false);
    setShowStepper((prev) => !prev);
  };

  const handleEditAgent = (idx) => {
    setEditingAgentIdx(idx);
    localStorage.setItem("currAgent", JSON.stringify(agents[idx]));
    setAgentSelected(false);
    setShowStepper((prev) => !prev);
  };

  const handleDeleteAgent = (index) => {
    const updatedAgents = [...agents];

    if (index >= 0 && index < updatedAgents.length) {
      updatedAgents.splice(index, 1);
      setAgents(updatedAgents);
      localStorage.setItem("agents", JSON.stringify(updatedAgents));
    }
  };

  useEffect(() => {
    const allAgents = JSON.parse(localStorage.getItem("agents"));
    if (allAgents) {
      setAgents(allAgents);
    }

    localStorage.removeItem("currAgent");
  }, []);

  return (
    <>
      <Header />
      <div className="sm:mx-12 md:mx-20 lg:mx-24 mx-4 mb-12 md:mb-20 lg:mb-24  md:text-lg text-base">
        {showStepper && (
          <StepperModal
            toggleStepper={toggleStepper}
            editingAgentIdx={editingAgentIdx}
            setEditingAgentIdx={setEditingAgentIdx}
            setAgents={setAgents}
          />
        )}

<div className="mt-4 text-gray-500">
  {!agents || agents.length <= 0 ? (
    <div className="py-8 text-lg">
      <p className="mb-4">
        <span className="font-bold text-lg">JACANA</span> facilitates the seamless migration of integrations from SAP PO 7.5 to CPI through an interactive user interface. This migration tool is crafted to drastically reduce manual migration efforts and eliminate the possibility of human error in the process.
      </p>
      <p className="mb-4">
        <span className="font-bold">Salient Features</span>
        <ul className="list-disc pl-6">
          <li>Significant reduction in migration effort.</li>
          <li>Migrate multiple integrations simultaneously.</li>
          <li>Automated migration of PO 7.5 integrations to CPI.</li>
          <li>Dynamic migration templates automatically applied by Jacana.</li>
          <li>Migration report to validate the migrated and non-migrated components.</li>
          <li>Automatic implementation of error handling and payload logging across all integrations.</li>
          <li>Migration support for components not available in SAP Migration - Value Mapping, Encoding-Decoding etc.</li>
        </ul>
      </p>
      <p>
        <span className="font-bold">Want to Explore more? Try adding an agent below.</span>
      </p>
    </div>
  ) : null}
</div>
 
        {/* TABLE */}
        {agents && agents.length > 0 && (
          <div className=" text-left ">
            <table className=" table-fixed border-2 w-full border-[#E0E0E0] my-5">
              <thead>
                <tr className="bg-[#F5F5F5] ">
                  <th className="w-[10%]">
                    <div
                      className=" cursor-pointer my-5 mx-5 h-[20px] w-[20px] "
                      id="agentHeader"
                    ></div>
                  </th>
                  <th>PO TENANT</th>
                  <th>CPI TENANT</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agents &&
                  agents.length > 0 &&
                  agents.map((each, index) => {
                    return (
                      <tr className="h-12 border border-gray-300" key={index}>
                        <th>
                          <input
                            className="cursor-pointer my-5 sm:mx-5 mx-2 h-[20px] w-[20px] "
                            type="radio"
                            name="agentsSelect"
                            onChange={() => {
                              localStorage.setItem(
                                "currAgent",
                                JSON.stringify(each)
                              );
                              setAgentSelected(true);
                            }}
                          />
                        </th>
                        <td className=" overflow-hidden">
                          {each?.poData?.name}
                        </td>
                        <td className=" overflow-hidden">
                          {each?.cpiData?.name}
                        </td>
                        <td>
                          <button
                            className="bg-[#2c4b60] text-white  md:px-5 px-2 mx-auto    rounded-sm  hover:bg-[#3b6978]"
                            onClick={() => {
                              handleEditAgent(index);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="bg-red-700 text-white  md:px-5 px-2 mx-auto rounded-sm hover:bg-red-800"
                            onClick={() => {
                              handleDeleteAgent(index);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
        <div className={`${agents && agents.length > 0 ? 'flex justify-end gap-4' : 'flex justify-start gap-4'}`}>
        <button
            className="bg-transparent border border-[#2c4b60] text-[#2c4b60]  md:px-6 px-3  py-2 hover:bg-[#3b6978] hover:text-white transition duration-100"
            onClick={handleAddAgent}
          >
            + &nbsp; Add Tenant
          </button>
        {agents && agents.length > 0 && (
          <Link
            to={"/migration-tool"}
            style={{ pointerEvents: !agentSelected && "none" }}
          >
            
            <button
              className={` text-white md:px-10 px-6 py-2 text-lg  border border-[#2c4b60] ${
                !agentSelected
                  ? " bg-gray-400"
                  : "bg-[#2c4b60] hover:bg-[#3b6978] transition duration-100"
              }`}
              disabled={!agentSelected}
            >
              Migrate
            </button>
          </Link>
        )}
        </div>
      </div>
    </>
  );
};

export default Configuration;
