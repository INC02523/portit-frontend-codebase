import React from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { Checkbox, ListItemText, FormControlLabel } from '@material-ui/core';
import axios from "axios";
import Navbar from "../layout/Navbar";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import { CreatePackage } from "./CreatePackage";

function MigrationProcess() {
  const [inputValue, setInputValue] = useState([]);
  const [icos, setIcos] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedICO, setSelectedICO] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [poData, setPoData] = useState({});
  const [cpiData, setCpiData] = useState({});
  const [errors, setErrors] = useState({
    integrationNameError: "",
  });

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const selectedData = JSON.parse(localStorage.getItem("currAgent")) || {};
    setCpiData(selectedData?.apiData);
    setPoData(selectedData?.poData);
    const fetchIcoList = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/metadata/get/ico/list",
          selectedData.poData
        );
        if (response.data.status === "Success") {
          setIcos(response.data.payload.root.key);
        } else {
          toast.error("Error while Fetching Data");
        }
      } catch (error) {
        toast.error("Error while Fetching Data");
      }
    };

    const fetchPackageList = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/migration/designtime/get/package/list",
          selectedData.apiData
        );
        if (response.data.status === "Success") {
          setPackages(response.data.payload.list);
        } else {
          toast.error("Error while Fetching Data");
        }
      } catch (error) {
        toast.error("Error while Fetching Data");
      }
    };
    fetchIcoList();
    fetchPackageList();
  }, []);
  
  function handleInputChange(e) {
      const values = e.target.value.split(",");
      setInputValue(values);
      // console.log(inputValue)
  }

  function handleIcoChange(event, newValue) {
      setSelectedICO(newValue);
  }

  useEffect(() => {
   console.log("inputInside UseEffect",inputValue);
   console.log("inside Selected ICO", selectedICO)
  }, [inputValue, selectedICO])

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formValid = true;
    const newErrors = {
      integrationNameError: "",
    };

    if (!inputValue.length === 0) {
      newErrors.integrationNameError =
        "Integration Flow Name cannot be empty !!";
      formValid = false;
    }

    setErrors(newErrors);
    setLoading(true);
    if (formValid) {
      const postData = {
        poAgent: poData,
        cpiAgent: cpiData,
        migrationDetails: {
          iCOKey: selectedICO,
          packageId: selectedPackage.id, // Using selectedPackage.id here
          integrationName: inputValue,
        },
      };

      try {
        console.log("Post Data", postData);
        await axios.post(
          "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/multipleiflow",
          postData
        );

        setInputValue([]);
        setSelectedICO([]);
        setSelectedPackage(null);
        setLoading(false);
        toast.success("Iflow Created Successfully");
      } catch (error) {
        setLoading(false);
        toast.error("Error While Creating Iflow");
      }
    }
    
  };
  
  return (
    <>
      <Navbar>
        <form onSubmit={handleSubmit}>
          <div className="main-container">
            <div className="">
              <div
                className={`h-44 w-full bg-[length:100%_100%] mb-8 bg-center flex items-center   bg-no-repeat bg-[url(./data/images/header_graphic_img.png)]`}
              >
                <h1 className="text-2xl md:text-5xl  mx-8 text-white">
                  PI/PO to CPI Migration Tool
                </h1>
              </div>
            </div>
            <div className="inputs items-center">
              <div className="input-group">
                <label htmlFor="autocomplete-ico">Select ICO:</label>
                <Autocomplete
                  multiple
                  fullWidth
                  id="autocomplete-ico"
                  options={icos}
                  getOptionLabel={(option) => option}
                  value={selectedICO}
                  onChange={(event, newValue) => handleIcoChange(event, newValue)}
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
                      placeholder="Select ICO"
                      required
                    />
                  )}
                />
              </div>

              <div className="input-group grid grid-cols-11 items-center justify-cente gap-2">
                <div className="col-span-10">
                  <div>
                  <label htmlFor="autocomplete-package">Select Package:</label>
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
                </div>
                <div className="col-span-1 flex justify-center pt-5">
                  <CreatePackage />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="integration-name">
                  Enter Integration Flow Name:
                </label>
                <TextField
                  id="integration-name"
                  variant="outlined"
                  fullWidth
                  value={inputValue}
                  onChange={(e) => handleInputChange(e)}
                  error={!!errors.integrationNameError}
                  helperText={errors.integrationNameError}
                  required
                  placeholder="Enter Iflow Name"
                />
              </div>

              <ToastContainer />

              {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <CircularProgress />
            </div>
          )}

              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Navbar>
      <Footer />
    </>
  );
}

export default MigrationProcess;
