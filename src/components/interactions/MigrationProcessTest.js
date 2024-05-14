import axios from "axios";
import { Autocomplete } from "@material-ui/lab";
import useIcoList from "../../hooks/useIcoList";
import React, { useEffect, useState } from "react";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Checkbox, ListItemText, FormControlLabel, TextField } from '@material-ui/core';

const MigrationProcessTest = () => {
  const [formData, setFormData] = useState({
    iflowName: '',
    iflowDescription: '',
    selectedIco: '',
  });
  const [poData, setPoData] = useState({});
  const { icos } = useIcoList(poData);
  const [selectedICO, setSelectedICO] = useState([]);
  const [selectedOption, setSelectedOption] = useState("icos");
  const [table, setTable] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedValues, setEditedValues] = useState({ iflowName: '', iflowDescription: '' });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currAgent")) || {};
    setPoData(data?.poData);
  }, []);

  const handleIcoChange = (event, newValue) => {
    event.preventDefault();
    setSelectedICO(newValue);

    const payload = {
      poAgent: poData,
      icoKey: newValue
    }

    axios.post("http://localhost:8080/api/v1/migration/designtime/get/iflow/details", payload).then(response => {
      const responseData = response?.data;
      if (Array.isArray(responseData)) {
        const names = responseData?.map(item => item?.iflowName);
        const descriptions = responseData?.map(item => item?.description);

        // console.log(names, descriptions);
        setFormData(prevFormData => ({
          ...prevFormData,
          iflowName: names,
          iflowDescription: descriptions,
          selectedIco: newValue,
        }));
        console.log("form data", formData)
        setTable(responseData);
        console.log("table",table)
      } else {
        console.error("Response data is not an array:", responseData);
      }
    });
  }

  const handleEdit = (e, index) => {
    setEditIndex(index);
    setShowEditModal(true);
    const item = iflowList[index];
    setEditedValues({ iflowName: item.integrationName, iflowDescription: item.description });
    setShowEditModal(true);
  }

  const handleSave = () => {
    if (editedValues.iflowName.trim() === "" || editedValues.iflowDescription.trim() === "") {
      // Handle empty values if necessary
      return;
    }

    const updatedIflowList = [...iflowList];
    updatedIflowList[editIndex] = {
      ...updatedIflowList[editIndex],
      integrationName: editedValues.iflowName,
      description: editedValues.iflowDescription
    };
    // setIflowList(updatedIflowList);

    // Perform API call with updated iflowList
    const updatedPayload = updatedIflowList.map(item => ({
      iCOkey: item.iCOkey,
      iflowName: item.integrationName,
      description: item.description
    }));
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
  }  

  const { iflowName, iflowDescription, selectedIco } = formData;
  let iflowList = [];

  if (iflowName != null && Array.isArray(iflowName) && iflowName.length > 0) {
    iflowList = iflowName.map((name, index) => ({
      iCOkey: selectedIco[index],
      integrationName: name,
      description: iflowDescription[index]
    }));
  } else {
    console.error("iflowName is either null, not an array, or empty:", iflowName);
  }

  console.log(iflowList);

  return (
    <>
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

      {table?.length > 0 && selectedOption === 'icos' && (
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
            {table?.map((item, index) => (
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
      {console.log(formData)}

      {/* Edit Modal */}
      <Dialog open={showEditModal} maxWidth="md" fullWidth>
              <DialogTitle className="text-2xl font-semibold mb-4">Edit Parameters</DialogTitle>
              <DialogContent>
                <div className="mb-4">
                  <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">Integration Name :</label>
                  <TextField id="inputValue" fullWidth value={editedValues.iflowName} onChange={(e) => setEditedValues({...editedValues, iflowName: e.target.value})} variant="outlined" />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                  <TextField id="description" fullWidth value={editedValues.iflowDescription} onChange={(e) => setEditedValues({...editedValues, iflowDescription: e.target.value})} variant="outlined" />
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
    </>
  );
}

export default MigrationProcessTest;
