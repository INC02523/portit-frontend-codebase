import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Button, CircularProgress, setRef } from "@material-ui/core";
import { Checkbox, ListItemText, FormControlLabel } from '@material-ui/core';
import Navbar from "../layout/Navbar";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import { CreatePackage } from "./CreatePackage";
import useIcoList from '../../hooks/useIcoList';
import usePackageList from '../../hooks/usePackageList';
import { Radio, RadioGroup } from '@material-ui/core';
import  axios  from "axios";
import useValueMappingList from "../../hooks/useValueMappingList";
import Header from "../layout/Header";
import DownloadPdf from "./DownloadPdf";
import MigrationReport from "./MigrationReport";

function MigrationProcess() {
  const [inputValue, setInputValue] = useState([]);
  const [valueMaping, setValueMaping] = useState([]);
  const [selectedICO, setSelectedICO] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [poData, setPoData] = useState({});
  const [cpiData, setCpiData] = useState({});
  const [errors, setErrors] = useState({
    integrationNameError: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("icos");
  const [selectedValueMapping, setSelectedValueMapping] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [table, setTable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [responseAvailable, setResponseAvailable] = useState(false);
  const [reportUrl, setReportUrl] = useState("");
  const [description , setDescription] = useState([]);
  const { icos} = useIcoList(poData);
  const { packages} = usePackageList(cpiData, refreshFlag);
  const { vms } = useValueMappingList(poData);
  


  useEffect(() => {
    const selectedData = JSON.parse(localStorage.getItem("currAgent")) || {};
    setCpiData(selectedData?.apiData);
    setPoData(selectedData?.poData);
    
  }, []);

  useEffect(() => {
    console.log("Input Value Change useEffect", inputValue);
  }, [selectedICO, inputValue]);

  function handleInputValueChange(e) {
    const values = e.target.value.split(",");
    setValueMaping(values);
    console.log(values);
  }

  function handleIcoChange(event, newValue) {
    setSelectedICO(newValue);
    
    const conventionData = {
      poAgent: poData,
      icoKey: newValue,
    }

    axios.post("http://localhost:8080/api/v1/migration/designtime/get/iflow/details", conventionData).then(response => {
    //   console.log("api called", response);
      const names = response?.data?.map(item => item?.iflowName);
      const description = response?.data?.map(item => item?.description);
      // console.log("names : ",names);
      let updatedNames = [...names];
      let descriptions = [...description];
      
      // console.log("inputvalue: ",inputValue);
      setInputValue(updatedNames);
      setDescription(descriptions)
      console.log("Description ", description);     
    //   console.log(description);
    //   console.log("inputValue", updatedNames);
      setTable(response?.data);
      // console.log("tables", table);

      // if(names) {
      //   setInputValue(names || []);
      //   setConventionName(names);
      //   console.log("Convention Name", conventionName);
      //   console.log("Input values", inputValue);
      // }
      return names;
    }).catch(error => {
      console.log("error", error);
      // toast.error(error);
    })

  }

  
  function handleValueMapping(event, newValue) {
    if (Array.isArray(newValue)) {
      setSelectedValueMapping(newValue);
    } else if (newValue !== null) {
      setSelectedValueMapping([newValue]);
    } else {
      setSelectedValueMapping([]);
    }
  }

  const handleRefresh = () => {
    setRefreshFlag(!refreshFlag);
  }

  const handleVisible = (option) => {
    setSelectedOption(option);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        let postData = {
            poAgent: poData,
            cpiAgent: cpiData,
            migrationDetails: {
                iCOKey: selectedOption === 'icos' ? selectedICO : selectedValueMapping,
                packageId: selectedPackage.id,
                integrationName: selectedOption === 'icos' ? inputValue : valueMaping,
            },
        };

        console.log("Post Data", postData);

        if(selectedOption === 'icos') {
            postData = {
                ...postData,
                migrationDetails: {
                    ...postData.migrationDetails,
                    descriptions: description,
                }
            }

            console.log("postData",postData);
        }

        console.log("pssig", postData);
        const endpoint = selectedOption === 'icos' 
            ? "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/multipleiflow"
            : "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/vm";
        const response = await axios.post(endpoint, postData);
        console.log(response);
        if(response && selectedOption === 'icos') {
          setResponseData(response?.data?.responses);
          setReportUrl(response?.data?.reportBase64)
          setResponseAvailable(true);
        //   console.log(responseData)
        //   console.log(responseAvailable);
        //   console.log(response);
        //   console.log("Report Url", reportUrl);
        }

        // Reset form values and show success message
        setSelectedICO([]);
        setSelectedPackage(null);
        setSelectedValueMapping([]);
        setTable([]);
        setInputValue([]);
        setLoading(false);
        console.log("responses",response?.data?.responses);
        toast.success("Migration Process Completed");
    } catch (error) {
      setLoading(false);
      if (selectedOption === 'icos' && (!selectedICO.length || !selectedPackage)) {
          toast.error("Please enter the details for selected iCO and package.");
      } else if(selectedOption === 'packages' && (!selectedValueMapping.length)) {
        toast.error("Please enter details for value mapping")
      }
      else {
          toast.error("Error occurred while migrating.");
      }
  }
  
};

  

  return (
    <>
    <Navbar />
    <form onSubmit={handleSubmit} className="h-screen overflow-auto">
        <div className="main-container h-screen overflow-y-auto">
            <Header />
            <div className="inputs items-center">
                <div>
                    <RadioGroup
                        row
                        aria-label="options"
                        name="options"
                        value={selectedOption}
                        onChange={(event) => handleVisible(event.target.value)}
                    >
                        <FormControlLabel
                            value="icos"
                            control={<Radio style={{ color: '#2c4b60' }}/>}
                            label="Migrate ICOs"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="packages"
                            control={<Radio style={{ color: '#2c4b60' }}/>}
                            label="Migrate Value Mapping"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </div>
                {selectedOption === 'icos' ? (
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
                                    placeholder="Select ICO"
                                    // required
                                />
                            )}
                        />
                    </div>
                ) : (
                    <div className="input-group">
                        <label htmlFor="autocomplete-ico">Select Value Mapping</label>
                        <Autocomplete
                            multiple
                            fullWidth
                            id="autocomplete-ico"
                            options={vms}
                            getOptionLabel={(option) => option}
                            value={selectedValueMapping}
                            onChange={(event, newValue) => handleValueMapping(event, newValue)}
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
                                    placeholder="Select Value Mapping"
                                    required
                                />
                            )}
                        />
                        <div className="input-group">
                            <label htmlFor="integration-name">
                                Enter Integration Flow Name:
                            </label>
                            <TextField
                                id="integration-name"
                                variant="outlined"
                                fullWidth
                                value={valueMaping}
                                onChange={(e) => handleInputValueChange(e)}
                                error={!!errors.integrationNameError}
                                helperText={errors.integrationNameError}
                                placeholder="Enter Iflow Name"
                            />
                        </div>
                    </div>
                )}
                <div className="input-group grid grid-cols-11 items-center justify-center">
                    <div className="col-span-9">
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
                    <div className="md:col-span-2 flex justify-center mt-6 col-span-5">
                        <CreatePackage handleRefresh={handleRefresh} />
                    </div>
                </div>
                <div className="input-group">
                    {table.length > 0 && selectedOption === 'icos' && (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-black uppercase tracking-wider border border-gray-300 text-center" style={{ width: "100px" }}>
                                        Sl NO.
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border border-gray-300" style={{ width: "100px" }}>
                                        iFlow Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border border-gray-300">
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                                            <div className="text-sm text-gray-900 text-center">{index + 1}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap border border-gray-300" style={{ maxWidth: "450px" }}>
                                            <div className="text-sm text-gray-900" style={{ wordWrap: 'break-word' }}>{item.iflowName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap border border-gray-300" style={{ maxWidth: "150px" }}>
                                            <div className="text-sm text-gray-900 " style={{ wordWrap: 'break-word' }}>{item.description}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <ToastContainer />
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <CircularProgress />
                    </div>
                )}
                {console.log("Response Data", responseData)}
                <MigrationReport
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    responseData={responseData}
                    reportBase64={reportUrl}
                />
                <div className="flex justify-around w-[50%] flex-col md:flex-row">
                    <div>
                        <button
                        type="submit"
                        className="bg-[#2c4b60] text-white md:px-24 px-24 py-4 rounded-sm hover:bg-[#3b6978]"
                        onClick={handleSubmit}
                        
                        >
                        Migrate
                        </button>
                    </div>
                    {selectedOption === 'icos' && (<div>
                        <button
                            className={`text-white md:px-8 px-6 py-4 rounded-sm ${
                            !responseAvailable
                              ? " bg-gray-400"
                              : "bg-[#2c4b60] hover:bg-[#3b6978] transition duration-100"
                          }`}
                            onClick={handleShowModal}
                            disabled={!responseAvailable}
                            type="button"
                        >
                        View Migration Details
                        </button>
                       
                    </div>
                    )}
                    </div>

            </div>
        </div>
    </form>
    {/* <Navbar /> */}
    {/* <Footer />   */}
</>

  );
}

export default MigrationProcess;
