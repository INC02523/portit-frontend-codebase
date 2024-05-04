import React, { useState } from "react";
import { handelTestConnection } from "../StepperAPIs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ApiDetails = ({
  setDisableNext,
  testingConn,
  setTestingConn,
  currAgent,
}) => {
  const [fileData, setFileData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileUpload = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setFileData(jsonData);
        fillFormFields(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        setFileData(null);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  };

  const fillFormFields = (data) => {
    const { oauth } = data;
    if (oauth) {
      const { clientid, clientsecret, url, tokenurl } = oauth;
      const form = document.getElementById("apiDetailsForm");
      form.elements.ClientID.value = clientid;
      form.elements.ClientSecret.value = clientsecret;
      form.elements.URL.value = url;
      form.elements.TokenURL.value = tokenurl;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTestingConn(true);
    const formData = {
      name: event.target.elements.Name.value,
      clientId: event.target.elements.ClientID.value,
      clientSecret: event.target.elements.ClientSecret.value,
      tokenUrl: event.target.elements.TokenURL.value,
      url: event.target.elements.URL.value,
      environment: event.target.elements.Env.value,
      status: "Success",
    };
    handelTestConnection(
      { dataType: "apiData", formData: formData },
      setDisableNext,
      setTestingConn
    );
  };

  return (
    <div className="flex justify-center">
      <form
        id="apiDetailsForm"
        className="md:block bg-white p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">Name</label>
          <input
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="text"
            name="Name"
            defaultValue={
              currAgent && currAgent.cpiData ? currAgent.cpiData.name : ""
            }
            disabled
            required
          />
        </div>
        <div className="mb-4 md:flex ">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Client ID
          </label>
          <input
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="text"
            name="ClientID"
            required
            placeholder="ClientID"
            defaultValue={
              currAgent && currAgent.apiData ? currAgent.apiData.clientId : ""
            }
          />
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Client Secret
          </label>
          <div className="w-full md:w-2/3 relative">
            <input
              className="w-full sm:h-12 md:h-10 rounded border px-3 pr-10"
              type={showPassword ? "text" : "password"}
              name="ClientSecret"
              required
              placeholder="ClientSecret"
              defaultValue={
                currAgent && currAgent.apiData
                  ? currAgent.apiData.clientSecret
                  : ""
              }
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
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="url"
            name="TokenURL"
            required
            placeholder="TokenURL"
            defaultValue={
              currAgent && currAgent.apiData ? currAgent.apiData.tokenUrl : ""
            }
          />
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">URL</label>
          <input
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
            type="url"
            name="URL"
            required
            placeholder="URL"
            defaultValue={
              currAgent && currAgent.apiData ? currAgent.apiData.url : ""
            }
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
            defaultValue={
              currAgent && currAgent.cpiData
                ? currAgent.cpiData.environment
                : ""
            }
            required
            disabled
          >
            <option value="">Select</option>
            <option value="DEV">DEV</option>
            <option value="QA">QA</option>
            <option value="PROD">PROD</option>
          </select>
        </div>
        <div className="mb-4 md:flex">
          <label className="md:w-1/3 text-right pr-4 mb-1 md:mb-0">
            Upload Security key
          </label>
          <input
            type="file"
            accept=".json, .txt"
            onChange={handleFileUpload}
            className="w-full md:w-2/3 sm:h-12 md:h-10 rounded border px-3"
          />
        </div>
        
        <div className="my-5 text-center">
          <button
            className="bg-[#2c4b60]  text-white md:px-5 px-2 py-1 rounded-sm  hover:bg-[#3b6978]"
            type="submit"
          >
            {testingConn ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiDetails;
