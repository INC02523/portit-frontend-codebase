import Navbar from "../layout/Navbar";
import { Link } from "react-router-dom";
import Header from "../layout/Header";
import React, { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { FormControlLabel, Checkbox, ListItemText } from '@mui/material';
import { CircularProgress } from "@material-ui/core";

import usePackageList from "../../hooks/usePackageList";

function MigrationTool() {
  const [names, setNames] = useState(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState([]);
  const [apiData, setApiData] = useState({});
  const [refreshFlag, setRefreshFlag] = useState("");
  const { packages } = usePackageList(apiData, refreshFlag);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [servicesAdded, setServicesAdded] = useState(true);
  const [loading, setLoading] = useState(false);
  const services = ["Mail", "ServiceNow", "Slack"];

  useEffect(() => {
    const currAgent = JSON.parse(localStorage.getItem("currAgent"));
    if (currAgent) {
      setApiData(currAgent.apiData);
      setNames({
        poName: currAgent?.poData?.name,
        cpiName: currAgent?.cpiData.name,
        adapters: currAgent?.adapter,
      });
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    if (!dropdownValue || !selectedPackage || !inputValue) {
      toast.error("Please fill in all fields before submitting.");
      setLoading(false); // Reset loading state
      return;
    }

    const postData = {
      cpiAgent: apiData,
      adapterType: {
        adapterKey: dropdownValue,
        packageId: selectedPackage?.id,
        integrationName: inputValue,
      },
    };

    try {
      const response = await axios.post("http://localhost:8080/api/v1/migration/designtime/create/exception/adapter", postData);
      if (response.status === 200) {
        const currAgent = JSON.parse(localStorage.getItem("currAgent"));
    const updatedCurrAgent = { ...currAgent, adapter: dropdownValue };
    localStorage.setItem("currAgent", JSON.stringify(updatedCurrAgent));
        setDropdownValue([]);
        setSelectedPackage(null);
        setInputValue('');
        setServicesAdded(false);
        // setLoading(false); // Set loading to false once request is completed
        toast.success("Services Added Successfully");
        // handleClose();
      }
    } catch (error) {
      toast.error("Failed to Create Services");
      // setLoading(false); // Reset loading state
    }

    // Update localStorage
    const currAgent = JSON.parse(localStorage.getItem("currAgent"));
    // const updatedCurrAgent = { ...currAgent, adapter: dropdownValue };
    // localStorage.setItem("currAgent", JSON.stringify(updatedCurrAgent));
    const agent = JSON.parse(localStorage.getItem("agents"));
    const agentIndex = agent.findIndex((a) => a?.poData?.name === currAgent?.poData?.name);
    if (agentIndex !== -1) {
      agent[agentIndex].adapter = dropdownValue;
    }
    localStorage.setItem('agents', JSON.stringify(agent));

    // Check for missing names
    if (names.poName === null || names.cpiName === null) {
      toast.error("Please fill in all fields before proceeding.");
    }
  };

  return (
    <>
    {/* {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <CircularProgress />
        </div>
      )} */}
      {/* <Navbar> */}
        <div className="md:w-full w-full h-screen overflow-y-auto">
          <Header />
          <div className="w-full lg:w-[75%] md:w-[70%] mt-5 mx-auto">
            <h2 className="text-center md:text-2xl">
              {names && (
                <div className="flex w-[65%] justify-around mx-auto">
                  <div>
                    <span className="text-[#1f1f1f] font-semibold">PO Tenant Name:</span>{" "}
                    <span className="text-gray-700">{names?.poName}</span>{" "}
                  </div>
                  <div>
                    <span className="text-[#1f1f1f] font-semibold">IS Tenant Name:</span>{" "}
                    <span className="text-gray-700">{names?.cpiName}</span>
                  </div>
                </div>
              )}
            </h2>
          </div>

          <div className="md:mt-8 mt-7 md:w-[95%] md:mx-auto flex flex-col md:flex-row w-[70%] mx-auto justify-center gap-12 items-center font-serif py-6 bg-[#f5f5f5]">
            {names?.adapters?.length === 0 ? (
              <button className="bg-[#2c4b60] hover:bg-[#3b6978] transition duration-400 text-xl font-bold text-center text-white hover:cursor-pointer hover:shadow-lg w-52 h-44 flex justify-center items-center" onClick={handleOpen}>
                MIGRATION PROCESS
              </button>
            ) : (
              <Link to="/migration-process">
                <button className="bg-[#2c4b60] hover:bg-[#3b6978] transition duration-400 text-xl font-bold text-center text-white hover:cursor-pointer hover:shadow-lg w-52 h-44 flex justify-center items-center">
                  MIGRATION PROCESS
                </button>
              </Link>
            )}
            <Link to="/payload-comparison">
              <div className="bg-[#2c4b60] hover:bg-[#3b6978] transition duration-400 text-xl font-bold text-center text-white hover:cursor-pointer hover:shadow-lg w-52 h-44 flex justify-center items-center">
                AUTOMATED TESTING
              </div>
            </Link>
          </div>
        </div>
        <ToastContainer position="bottom-center" />      
        <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>For Exception Subprocess</DialogTitle>
        <DialogContent sx={{ width: "600px", display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label htmlFor="autocomplete-service">Select Service</label>
            <Autocomplete
              multiple
              fullWidth
              id="autocomplete-service"
              options={services}
              getOptionLabel={(option) => option}
              value={dropdownValue}
              onChange={(event, newValue) => {
                setDropdownValue(newValue);
              }}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <FormControlLabel
                    control={<Checkbox checked={selected} />}
                    label={<ListItemText primary={option} />}
                  />
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select Service"
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="autocomplete-package">Select Package</label>
            <Autocomplete
              fullWidth
              id="autocomplete-package"
              options={packages}
              getOptionLabel={(option) => option.name}
              value={selectedPackage}
              onChange={(event, newValue) => {
                setSelectedPackage(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select Package"
                />
              )}
            />
          </div>
          <div className="mt-2">
            <TextField
              autoFocus
              margin="dense"
              id="input-field"
              label="Integration Name"
              type="text"
              fullWidth
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="bg-[#2c4b60] text-white md:px-5 py-2 rounded-sm hover:bg-[#3b6978]">
            Cancel
          </button>
          <button onClick={(e) => handleSubmit(e)} className="bg-[#2c4b60] text-white md:px-5 py-2 rounded-sm hover:bg-[#3b6978]">
            Submit
          </button>
          <Link to="/migration-process">
            <button disabled={servicesAdded} className={`text-white md:px-5 px-6 py-2 rounded-sm ${servicesAdded ? "bg-gray-400" : "bg-[#2c4b60] hover:bg-[#3b6978] transition duration-100"}`}>
              Next
            </button>
          </Link>
        </DialogActions>
      </Dialog>
      
    </>
  );
}

export default MigrationTool;
