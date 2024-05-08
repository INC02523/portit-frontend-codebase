import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import {
  TextField,
  Button,
  CircularProgress,
  Modal
} from "@material-ui/core";
import {
  Checkbox,
  ListItemText,
  FormControlLabel
} from '@material-ui/core';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { CreatePackage } from "./CreatePackage";
import useIcoList from '../../hooks/useIcoList';
import usePackageList from '../../hooks/usePackageList';
import { Radio, RadioGroup } from '@material-ui/core';
import axios from "axios";
import useValueMappingList from "../../hooks/useValueMappingList";
import Header from "../layout/Header";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MigrationReport from "./MigrationReport";
// import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function MigrationProcess() {
  const [inputValue, setInputValue] = useState([]);//
  const [description, setDescription] = useState([]);//
  const [selectedICO, setSelectedICO] = useState([]);
  const [valueMaping, setValueMaping] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [poData, setPoData] = useState({});//
  const [cpiData, setCpiData] = useState({});//
  const [errors, setErrors] = useState({ integrationNameError: "" });
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("icos");
  const [selectedValueMapping, setSelectedValueMapping] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [table, setTable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [responseAvailable, setResponseAvailable] = useState(false);//
  const [reportUrl, setReportUrl] = useState("");
  const [editedIndex, setEditedIndex] = useState(null);//
  const [editedInputValue, setEditedInputValue] = useState('');//
  const [editedDescription, setEditedDescription] = useState('');//
  const { icos } = useIcoList(poData);
  const { packages } = usePackageList(cpiData, refreshFlag);
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
  }

  function handleIcoChange(event, newValue) {
    setSelectedICO(newValue);

    const conventionData = { poAgent: poData, icoKey: newValue };

    axios.post("http://localhost:8080/api/v1/migration/designtime/get/iflow/details", conventionData).then(response => {
      const names = response?.data?.map(item => item?.iflowName);
      const description = response?.data?.map(item => item?.description);
      let updatedNames = [...names];
      let descriptions = [...description];
      setInputValue(updatedNames);
      setDescription(descriptions);
      setTable(response?.data);
    }).catch(error => {
      console.log("error", error);
    });
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
  };

  const handleVisible = (option) => {
    setSelectedOption(option);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let postData = 
      { 
        poAgent: poData, 
        cpiAgent: cpiData,
        migrationDetails: { 
            iCOKey: selectedOption === 'icos' ? selectedICO : selectedValueMapping, 
            packageId: selectedPackage.id, 
            integrationName: selectedOption === 'icos' ? inputValue : valueMaping } 
      };

      if (selectedOption === 'icos') {
        postData = { ...postData, migrationDetails: { ...postData.migrationDetails, descriptions: description } };
      }

      const endpoint = selectedOption === 'icos' ? "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/multipleiflow" : "http://localhost:8080/api/v1/migration/designtime/migrate/ico/to/vm";
      const response = await axios.post(endpoint, postData);

      if (response && selectedOption === 'icos') {
        setResponseData(response?.data?.responses);
        setReportUrl(response?.data?.reportBase64);
        setResponseAvailable(true);
      }

      setSelectedICO([]);
      setSelectedPackage(null);
      setSelectedValueMapping([]);
      setTable([]);
      setInputValue([]);
      setDescription([]);
      setLoading(false);
      toast.success("Migration Process Completed");
    } catch (error) {
      setLoading(false);
      if (selectedOption === 'icos' && (!selectedICO.length || !selectedPackage)) {
        toast.error("Please enter the details for ICO and Package.");
      } else if (selectedOption === 'packages' && (!selectedValueMapping.length)) {
        toast.error("Please enter details for value mapping");
      } else {
        toast.error("Error occurred while migrating.");
      }
    }
  };

  const handleEdit = (e, index) => {
    e.preventDefault();
    setEditedIndex(index);
    setEditedInputValue(inputValue[index]);
    setEditedDescription(description[index]);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if(editedInputValue.trim() === "" || editedDescription.trim() === "") {
        toast.error("Integration Name or Descripiton can not be empty!!")
        return 
    }

    setInputValue(prevInputValue => {
        const newValue = [...prevInputValue];
        newValue[editedIndex] = editedInputValue;
        return newValue;
      });
      setDescription(prevDescription => {
        const newDescription = [...prevDescription];
        newDescription[editedIndex] = editedDescription;
        return newDescription;
      });

    setTable(prevTable => {
      const newTable = [...prevTable];
      newTable[editedIndex].iflowName = editedInputValue;
      newTable[editedIndex].description = editedDescription;
      return newTable;
    });

    setShowEditModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="h-screen overflow-auto">
        <div className="main-container h-screen overflow-y-auto">
          <Header />
          <div className="inputs items-center">
            <div>
              <RadioGroup row aria-label="options" name="options" value={selectedOption} onChange={(event) => handleVisible(event.target.value)}>
                <FormControlLabel value="icos" control={<Radio style={{ color: '#2c4b60' }} />} label="Migrate ICOs" labelPlacement="end" />
                <FormControlLabel value="packages" control={<Radio style={{ color: '#2c4b60' }} />} label="Migrate Value Mapping" labelPlacement="end" />
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
                      <FormControlLabel control={<Checkbox checked={selected} />} label={<ListItemText primary={option} />} />
                    </React.Fragment>
                  )}
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select ICO" />}
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
                      <FormControlLabel control={<Checkbox checked={selected} />} label={<ListItemText primary={option} />} />
                    </React.Fragment>
                  )}
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Value Mapping" required />}
                />
                <div className="input-group">
                  <label htmlFor="integration-name">Enter Value Mapping Name:</label>
                  <TextField id="integration-name" variant="outlined" fullWidth value={valueMaping} onChange={(e) => handleInputValueChange(e)} error={!!errors.integrationNameError} helperText={errors.integrationNameError} placeholder="Enter Value Mapping Name" />
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
                    onChange={(event, newValue) => setSelectedPackage(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select Package" />}
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-center mt-6 col-span-5">
                <CreatePackage handleRefresh={handleRefresh} />
              </div>
            </div>
            {table.length > 0 && selectedOption === 'icos' && (
              <table className="w-full border border-collapse border-gray-300 sticky top-0 overflow-auto max-h-[180px]">
                <thead className="bg-[#E0E0E0] sticky top-0">
                  <tr className="">
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-black uppercase tracking-wider border border-gray-300 text-center" style={{ width: "100px" }}>Sl NO.</th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium text-black uppercase tracking-wider border border-gray-300 text-center" style={{ width: "100px" }}>iFlow Name</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider border border-gray-300">Description</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
                        <div className="text-sm text-gray-900 text-center">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-wrap border border-gray-300" style={{ maxWidth: "420px", minWidth: "150px" }}>
                        <div className="text-sm text-gray-900" style={{ wordWrap: 'break-word' }}>{item.iflowName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-wrap border border-gray-300" style={{ maxWidth: "150px" }}>
                        <div className="text-sm text-gray-900" style={{ wordWrap: 'break-word' }}>{item.description}</div>
                      </td>
                      <td>
                      <div className="flex items-center justify-center">
                        <button onClick={(e) => handleEdit(e, index)}>
                            
                            <BorderColorOutlinedIcon />
                           
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <Dialog open={showEditModal} maxWidth="md" fullWidth>
              <DialogTitle className="text-2xl font-semibold mb-4">Edit Parameters</DialogTitle>
              <DialogContent>
                <div className="mb-4">
                  <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">Integration Name :</label>
                  <TextField id="inputValue" fullWidth value={editedInputValue} onChange={(e) => setEditedInputValue(e.target.value)} variant="outlined" />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                  <TextField id="description" fullWidth value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} variant="outlined" />
                </div>
              </DialogContent>
              <DialogActions>
              <div className="flex justify-between gap-2">
                    <button
                        onClick={handleSave}
                        className="bg-[#2c4b60] text-white md:px-4 px-24 py-2 rounded-sm hover:bg-[#3b6978]"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="bg-[#2c4b60] text-white md:px-4 px-24 py-2 rounded-sm hover:bg-[#3b6978]"
                    >
                        Cancel
                    </button>
            </div>

              </DialogActions>
            </Dialog>
            <ToastContainer />
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <CircularProgress />
              </div>
            )}
            <MigrationReport isOpen={showModal} onClose={handleCloseModal} responseData={responseData} reportBase64={reportUrl} />
            <div className="flex justify-around w-[50%] flex-col md:flex-row">
              <div>
                <button type="submit" className="bg-[#2c4b60] text-white md:px-24 px-24 py-4 rounded-sm hover:bg-[#3b6978]" onClick={handleSubmit}>Migrate</button>
              </div>
              {selectedOption === 'icos' && (
                <div>
                  <button className={`text-white md:px-8 px-6 py-4 rounded-sm ${!responseAvailable ? " bg-gray-400" : "bg-[#2c4b60] hover:bg-[#3b6978] transition duration-100"}`} onClick={handleShowModal} disabled={!responseAvailable} type="button">View Migration Details</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default MigrationProcess;
