import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
export const CreatePackage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Description: "",
    ShortText: "",
  });
  
  const currAgent = JSON.parse(localStorage.getItem("currAgent")) || {};

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCreate = () => {
    const dataToSend = {
      packageDetails: formData,
      agent: currAgent.apiData,
    }

    console.log("data to send", dataToSend);

    axios.post('http://localhost:8080/api/v1/migration/designtime/create/package', dataToSend).then(response => {
      if(response.status === 200) {
        setFormData({
          Id: "",
          Name: "",
          Description: "",
          ShortText: "",
        });
        console.log("Api call Successfull");
        handleClose();
      } else {
        console.error("Api call failed");
      }
    }).catch(error => {
      console.error("Error : ", error);
    });
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <div>
      <Button 
        variant="contained"
        color="primary"       
        onClick={handleOpen}
        style={{ padding: '15px 16px' }}
      >
        Create
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Package</DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} style={{ textTransform: 'capitalize' }}>{key}</label><br />
                <input 
                  type="text" 
                  id={key} 
                  name={key}
                  value={value}
                  onChange={handleChange} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                /><br />
              </div> 
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}