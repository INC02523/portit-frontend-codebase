import React, { useState, useEffect } from "react";
import { handelTestConnection } from "../StepperAPIs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const CpiDetails = ({
  setDisableNext,
  testingConn,
  setTestingConn,
  currAgent,
}) => {
  const initialExistingData = {
    //if agent press back or save data is present then initialize values
    name: currAgent && currAgent.cpiData ? currAgent.cpiData.name : "",
    clientId: currAgent && currAgent.cpiData ? currAgent.cpiData.clientId : "",
    clientSecret:
      currAgent && currAgent.cpiData ? currAgent.cpiData.clientSecret : "",
    tokenUrl: currAgent && currAgent.cpiData ? currAgent.cpiData.tokenUrl : "",
    url: currAgent && currAgent.cpiData ? currAgent.cpiData.url : "",
    environment:
      currAgent && currAgent.cpiData ? currAgent.cpiData.environment : "",
    status: "",
    id: null,
  };
  const [showPassword, setShowPassword] = useState(false);

  const [agents, setAgents] = useState([]);
  // const [poName, setPoName] = useState(false); //name validation
  const [isInvalidName, setIsInvalidName] = useState(false); //name validation
  const [selectedExistingAgent, setSelectedExistingAgent] =
    useState(initialExistingData);

  useEffect(() => {
    // Retrieve the array of people from local storage when the component mounts
    const storedAgents = localStorage.getItem("agents");
    if (storedAgents) {
      setAgents(JSON.parse(storedAgents));
    }
  }, []);

  const handleExistingAgentSelect = (event) => {
    // Find the corresponding person and set their data to state
    const selectedExistingAgent = agents.find(
      (agent) => agent.cpiData.name === event.target.value
    );
    // console.log(selectedExistingAgent && selectedExistingAgent.poData);
    if (selectedExistingAgent) {
      setSelectedExistingAgent(selectedExistingAgent.cpiData);
    } else {
      setSelectedExistingAgent({
        id: null,
        name: null,
        clientId: "",
        clientSecret: "",
        tokenUrl: "",
        url: "",
        environment: "",
        status: "",
      });
    }
  };

  const handleNameValidation = (event) => {
    // Check your validation condition here
    let isNameExists = 0;
    if (agents.find((agent) => agent.cpiData.name === event.target.value)) {
      // toast.error("Name already exists!", { autoClose: 2000 });
      isNameExists = 1;
      setIsInvalidName(true);
      console.log("ERROERR CPIDETAILS - Name exist");
    }
    if (!isNameExists) {
      setIsInvalidName(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = JSON.parse(e.target.result);
          const oauthData = fileContent.oauth || {};
          const clientSecretKey = Object.keys(oauthData).find(
            (key) =>
              key.toLowerCase() === "clientsecret" || key === "clientSecret"
          );

          setSelectedExistingAgent({
            clientId: oauthData.clientid || "",
            clientSecret: oauthData[clientSecretKey] || "",
            tokenUrl: oauthData.tokenurl || "",
            url: oauthData.url || "",
          });
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTestingConn(true);
    const formData = {
      name: event.target.elements.Name.value,
      clientId: event.target.elements.ClientId.value,
      clientSecret: event.target.elements.ClientSecret.value,
      tokenUrl: event.target.elements.TokenUrl.value,
      url: event.target.elements.Url.value,
      environment: event.target.elements.Environment.value,
      status: "Success",
    };
    // console.log(formData, "formdata");
    handelTestConnection(
      { dataType: "cpiData", formData: formData },
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
            className="w-full md:w-2/3  sm:h-12 md:h-10  rounded border px-3"
            type="text"
            name="Existing"
            defaultValue=""
            onChange={handleExistingAgentSelect}
            //   currAgent && currAgent.cpiData ? currAgent.cpiData.name : null
          >
            <option value="">Select a Name</option>
            {agents &&
              agents.map((agent, index) => (
                <option key={index} value={agent.cpiData.name}>
                  {agent.cpiData.name}
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
                currAgent && currAgent.cpiData ? currAgent.cpiData.name : ""
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
            Client ID
          </label>
          <input
            className="w-full md:w-2/3  sm:h-12 md:h-10   rounded border px-3"
            id="clientid"
            placeholder="Client ID"
            type="text"
            name="ClientId"
            required
            value={selectedExistingAgent.clientId}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, clientId: e.target.value };
              });
            }}
            // value={formData.ClientId}
            // onChange={handleInputChange}
          />
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Client Secret
          </label>
          <div className="w-full md:w-2/3 relative">
            <input
              className="w-full sm:h-12 md:h-10 rounded border px-3 pr-10"
              id="clientsecret"
              placeholder="Client Secret"
              type={showPassword ? "text" : "password"}
              name="ClientSecret"
              required
              value={
                selectedExistingAgent.clientSecret !== undefined
                  ? selectedExistingAgent.clientSecret
                  : currAgent && currAgent.cpiData
                  ? currAgent.cpiData.clientSecret
                  : ""
              }
              onChange={(e) => {
                setSelectedExistingAgent((prev) => {
                  return { ...prev, clientSecret: e.target.value };
                });
              }}
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
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Token URL
          </label>
          <input
            className="w-full md:w-2/3  sm:h-12 md:h-10   rounded border px-3 
            invalid:border-pink-500 invalid:text-pink-600
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            id="tokenurl"
            placeholder="Token URL"
            type="url"
            name="TokenUrl"
            value={selectedExistingAgent.tokenUrl}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, tokenUrl: e.target.value };
              });
            }}
            required
          />
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">URL</label>
          <input
            className="w-full md:w-2/3  sm:h-12 md:h-10   rounded border px-3
            invalid:border-pink-500 invalid:text-pink-600
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            id="url"
            type="url"
            name="Url"
            placeholder="URL"
            required
            value={selectedExistingAgent.url}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, url: e.target.value };
              });
            }}
          />
        </div>
        <div className="mb-6 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Environment
          </label>
          <select
            name="Environment"
            className="w-full md:w-2/3  sm:h-12 md:h-10   rounded border px-3"
            id="environment"
            value={selectedExistingAgent.environment}
            onChange={(e) => {
              setSelectedExistingAgent((prev) => {
                return { ...prev, environment: e.target.value };
              });
            }}
            required
            // value={formData.Enviroment}
            // onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="DEV">DEV</option>
            <option value="QA">QA</option>
            <option value="PROD">PROD</option>
          </select>
        </div>

        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Upload Security Key
          </label>
          <input
            type="file"
            accept=".json, .txt"
            onChange={handleFileUpload}
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
          />
        </div>
        <div className="text-center">
          <button
            className="bg-[#2c4b60]  text-white  md:px-5 px-2  py-1 rounded-sm  hover:bg-[#3b6978]"
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
export default CpiDetails;
