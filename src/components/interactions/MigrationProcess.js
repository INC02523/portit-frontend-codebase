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
  const { icos} = useIcoList(poData);
  const { packages} = usePackageList(cpiData, refreshFlag);
  const { vms } = useValueMappingList(poData);
  const [table, setTable] = useState([]);
  


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
      console.log("api called");
      const names = response?.data?.map(item => item?.iflowName);
      // console.log("names : ",names);
      let updatedNames = [...names];
      // console.log("inputvalue: ",inputValue);
      setInputValue(updatedNames);
      console.log("inputValue", updatedNames);
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
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        const postData = {
            poAgent: poData,
            cpiAgent: cpiData,
            migrationDetails: {
                iCOKey: selectedOption === 'icos' ? selectedICO : selectedValueMapping,
                packageId: selectedPackage.id,
                integrationName: selectedOption === 'icos' ? inputValue : valueMaping,
            },
        };

        console.log("Post Data", postData);

        const endpoint = selectedOption === 'icos' 
            ? "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/multipleiflow"
            : "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/vm";
        const response = await axios.post(endpoint, postData);
        console.log(response);
        if(response && selectedOption === 'icos') {
          setResponseData(response.data);
          console.log(responseData)
        }

        // Reset form values and show success message
        setSelectedICO([]);
        setSelectedPackage(null);
        setSelectedValueMapping([]);
        setTable([]);
        setInputValue([]);
        setLoading(false);
        toast.success(response.data.responses[0]);
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
                            control={<Radio color="primary" />}
                            label="Select ICOs"
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value="packages"
                            control={<Radio color="primary" />}
                            label="Select Value Mapping"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </div>
                {selectedOption === 'icos' ? (
                    <div className="input-group">
                        <label htmlFor="autocomplete-ico">Select ICO:</label>
                        <Autocomplete
                            required
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
                                    required
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
                <button
                    // variant="contained"
                    // color="primary"
                    type="submit"
                    className="bg-[#2c4b60]  text-white  md:px-5 px-6  py-4 rounded-sm  hover:bg-[#3b6978]"
                    onClick={handleSubmit}
                >
                    Migrate
                </button>
            </div>
        </div>
    </form>
    {/* <Navbar /> */}
    {/* <Footer />   */}
</>

  );
}

export default MigrationProcess;
