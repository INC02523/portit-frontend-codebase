import { Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@material-ui/core";
import { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export const CreatePackage = ({ handleRefresh }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Description: "",
    ShortText: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const currAgent = JSON.parse(localStorage.getItem("currAgent")) || {};

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCreate = async () => {
    setLoading(true); // Set loading to true when submitting

    const dataToSend = {
      packageDetails: formData,
      agent: currAgent.apiData,
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/migration/designtime/create/package', dataToSend);

      if (response.status === 200) {
        setFormData({
          Id: "",
          Name: "",
          Description: "",
          ShortText: "",
        });
        console.log("Api call Successful");
        handleClose();
        handleRefresh();
        toast.success("Package Created Successfully, Please Select it from the options")
      } else {
        console.error("Api call failed");
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
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
          <ToastContainer />
          <Button onClick={handleCreate} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loader */}
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <CircularProgress color="primary" />
        </div>
      )}
    </div>
  );
}
