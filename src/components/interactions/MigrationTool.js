import Navbar from "../layout/Navbar";
import { Link } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import React, { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { FormControlLabel,Checkbox, ListItemText } from '@mui/material';
import usePackageList from "../../hooks/usePackageList";


function MigrationTool() {
  const [names, setNames] = useState(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState([]);
  const [apiData, setApiData] = useState({});
  const [refreshFlag, setRefreshFlag] = useState("");
  const {packages} = usePackageList(apiData, refreshFlag);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const services= ["Mail", "ServiceNow", "Slack"];

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
    console.log("handleOpen",open);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("handleClose", open);
  };

  const handleInputChange = (event) => {
    console.log("Input value", event.target.value);
    setInputValue(event.target.value);
  };
  
  const handleSubmit = (e) => {
    
    e.preventDefault(); 

    if (!dropdownValue || !selectedPackage || !inputValue) {
      toast.error("Please fill in all fields before submitting.");
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

    // console.log("payload",postData);

    console.log("adapter Data",postData)

    if(postData ) {
      try {
        axios.post("http://localhost:8080/api/v1/migration/designtime/create/exception/adapter", postData).then(response => {
          if (response.status === 200) {
            setDropdownValue([]);
            setSelectedPackage(null);
            toast.success("Services Added Successfully");
          }
        })
      } catch {
        toast.error("Failed to Create Services");
      }   
    }
      handleClose();
      
      const currAgent = JSON.parse(localStorage.getItem("currAgent"));
      const agent = JSON.parse(localStorage.getItem("agents"));
      const agentIndex = agent.findIndex((a) => a?.poData?.name === currAgent?.poData?.name);

      if (agentIndex !== -1) {
        agent[agentIndex].adapter = dropdownValue;
      }


      localStorage.setItem('agents', JSON.stringify(agent));


      
      if (names.poName !== null && names.cpiName !== null) {
        window.location.href = "/migration-process";
        
    } else {
        toast.error("Please fill in all fields before proceeding.");
    }
    
  };

  return (
    <>
      <Navbar>
        <div className="md:w-[100%]   w-full  h-screen overflow-y-auto">
          <Header />
        {/* <div className="">
          <div
            className={`h-44 w-full bg-cover bg-center mb-8 flex items-center justify-center bg-no-repeat bg-[url(./data/images/header_graphic_img.png)] rounded-b-lg`}
          >
            <h1 className="text-2xl md:text-5xl text-center text-white font-serif font-extrabold">
              PO to CPI Migration Tool
            </h1>
          </div>
        </div> */}



          <div className="w-full lg:w-[75%] md:w-[70%] mt-5 mx-auto">
            <h2 className="text-center md:text-2xl">
            {names && (
                <div className="flex w-[65%] justify-around mx-auto">
                  <div>
                    <span className="text-[#1f1f1f] font-semibold">PO Tenant Name:</span>{" "}
                    <span className="text-gray-700">{names?.poName}</span>{" "}
                  </div>
                  <div>
                    <span className="text-[#1f1f1f] font-semibold">CPI Tenant Name:</span>{" "}
                    <span className="text-gray-700">{names?.cpiName}</span>
                  </div>
                </div>
            )}
            </h2>
          </div>

          <div className="md:mt-8 mt-7 md:w-[95%] md:mx-auto flex  flex-col md:flex-row w-[70%] mx-auto justify-center gap-12 items-center font-serif py-6 bg-[#f5f5f5]">
            {/* <div className="bg-[#3026B9] hover:bg-[#5c5cb3] transition duration-400 md:p-16 text-2xl font-bold text-center p-10 rounded-lg text-zinc-200  hover:cursor-pointer hover:shadow-lg ">
              Migration Assessment
            </div> */}
            {
              names?.adapters?.length === 0 ? (
                <button className="bg-[#2c4b60] hover:bg-[#3b6978] transition duration-400 text-xl font-bold text-center text-white  hover:cursor-pointer hover:shadow-lg  w-52 h-44 flex justify-center items-center" onClick={handleOpen}>
                MIGRATION PROCESS
                
              </button>
              ) : (
                <Link to="/migration-process">
              <button className="bg-[#2c4b60] hover:bg-[#3b6978] transition duration-400 text-xl font-bold text-center text-white  hover:cursor-pointer hover:shadow-lg  w-52 h-44 flex justify-center items-center" >
                MIGRATION PROCESS
              </button>
            </Link>
              )
            }

            <Link to="/payload-comparison">
            <div className="bg-[#2c4b60] hover:bg-[#3b6978] transition duration-400 text-xl font-bold text-center text-white hover:cursor-pointer hover:shadow-lg w-52 h-44 flex justify-center items-center">
              PAYLOAD COMPARISON
            </div>
            </Link>
          </div>
        </div>

        
      </Navbar>
      <ToastContainer />
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>Select Service</DialogTitle>
        <DialogContent sx={{ width: "600px", display: 'flex', flexDirection: 'column', gap: '8px' }}> 
        <div>
          <label htmlFor="autocomplete-service">Select Adatper Type</label>
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
            renderOption={(option, {selected})=>(
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
                placeholder="Select Adapter Type"
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
        </DialogActions>
      </Dialog>
      {/* <Footer /> */}
    </>
  );
}

export default MigrationTool;
