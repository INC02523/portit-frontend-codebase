import React, { useState, useEffect } from "react";
import { handelTestConnection } from "../StepperAPIs";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PODetails = ({
  setDisableNext,
  testingConn,
  setTestingConn,
  currAgent,
}) => {
  const initialExistingData = {
    //if agent press back or save data is present then initialize values
    environment:
      currAgent && currAgent.poData ? currAgent.poData.environment : "",
    host: currAgent && currAgent.poData ? currAgent.poData.host : "",
    id: null,
    name: currAgent && currAgent.poData ? currAgent.poData.name : "",
    password: "",
    port: currAgent && currAgent.poData ? currAgent.poData.port : "",
    username: currAgent && currAgent.poData ? currAgent.poData.username : "",
    status: "",
  };

  const [agents, setagents] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // const [poName, setPoName] = useState(false); //name validation
  const [isInvalidName, setIsInvalidName] = useState(false); //name validation
  const [selectedExistingAgent, setSelectedExistingAgent] =
    useState(initialExistingData);

  useEffect(() => {
    // Retrieve the array of people from local storage when the component mounts
    const storedAgents = localStorage.getItem("agents");
    if (storedAgents) {
      setagents(JSON.parse(storedAgents));
    }
  }, []);

  const handleExistingAgentSelect = (event) => {
    // Find the corresponding person and set their data to state
    const selectedExistingAgent = agents.find(
      (agent) => agent.poData.name === event.target.value
    );
    // console.log(selectedExistingAgent && selectedExistingAgent.poData);
    if (selectedExistingAgent) {
      setSelectedExistingAgent(selectedExistingAgent.poData);
    } else {
      setSelectedExistingAgent({
        environment: "",
        host: "",
        id: null,
        name: null,
        password: "",
        port: "",
        status: "",
        username: "",
      });
    }
  };

  const handleNameValidation = (event) => {
    // Check your validation condition here
    let isNameExists = 0;
    if (agents.find((agent) => agent.poData.name === event.target.value)) {
      // toast.error("Name already exists!", { autoClose: 2000 });
      isNameExists = 1;
      setIsInvalidName(true);
      console.log("ERROERR PODETAILS - Name exist");
    }
    if (!isNameExists) {
      setIsInvalidName(false);
    }
  };

  //gurmeet chnges end

  const handleSubmit = (event) => {
    event.preventDefault();
    setTestingConn(true);
    const formData = {
      name: event.target.elements.Name.value,
      username: event.target.elements.Username.value,
      password: event.target.elements.Password.value,
      host: event.target.elements.Host.value,
      port: event.target.elements.Port.value,
      environment: event.target.elements.Env.value,
      status: "Success",
    };
    // console.log(formData, "formdata");
    handelTestConnection(
      { dataType: "poData", formData: formData },
      setDisableNext,
      setTestingConn
    );
  };

  return (
    <div className="flex justify-center">
      <form
        className="md:block bg-white p-4  rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Existing
          </label>
          <select
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="text"
            name="Existing"
            defaultValue=""
            onChange={handleExistingAgentSelect}
          >
            <option value="">Select a Name</option>
            {agents &&
              agents.map((agent, index) => (
                <option key={index} value={agent.poData.name}>
                  {agent.poData.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0 ">Name</label>
          <div className="w-full md:w-2/3">
            <input
              className={`w-full sm:h-12 md:h-10 rounded border px-3 box-border ${
                isInvalidName
                  ? "border-red-500 border-2 focus:border-red-500 focus:border-4 outline-none "
                  : "border-gray-300"
              }`}
              type="text"
              name="Name"
              required
              defaultValue={
                currAgent && currAgent.poData ? currAgent.poData.name : ""
              }
              placeholder="Name"
              onChange={handleNameValidation}
            ></input>
            {isInvalidName && (
              <span className=" text-red-500 block">
                ⁍ Name Already Exists !
              </span>
            )}
          </div>
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Username
          </label>
          <input
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="text"
            name="Username"
            required
            value={
              selectedExistingAgent.username
                ? selectedExistingAgent.username
                : ""
            }
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, username: e.target.value };
              });
            }}
            placeholder="Username"
          />
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Password
          </label>
          <div className="w-full md:w-2/3 relative">
          <input
            className="w-full sm:h-12 md:h-10 rounded border px-3 pr-10"
            type={showPassword ? "text" : "password"}
            name="Password"
            required
            // value={selectedExistingAgent.password ?selectedExistingAgent.password :null}
            // onChange={(e) => {
            //   setSelectedExistingAgent((prev) => {
            //     return { ...prev, password: e.target.value };
            //   });
            // }}
          />
        <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </div>
          </div>
          </div>
        
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">Host</label>
          <input
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="text"
            name="Host"
            required
            value={selectedExistingAgent.host}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, host: e.target.value };
              });
            }}
            placeholder="ex. SAP_Server"
          />
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">Port</label>
          <input
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="number"
            name="Port"
            required
            value={selectedExistingAgent.port}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, port: e.target.value };
              });
            }}
            placeholder="ex. 5050"
          />
        </div>
        <div className="mb-6 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Environment
          </label>
          <select
            name="Env"
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            id="environment"
            value={selectedExistingAgent.environment}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, environment: e.target.value };
              });
            }}
            required
          >
            <option value="">Select</option>
            <option value="DEV">DEV</option>
            <option value="QA">QA</option>
            <option value="PROD">PROD</option>
          </select>
        </div>
        <div className="text-center">
          <button
            className="bg-[#3026B9]  text-white  md:px-5 px-2  py-1 rounded-md  hover:bg-[#3026b9d3]"
            type="submit"
            disabled={testingConn}
          >
            {testingConn ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PODetails;
