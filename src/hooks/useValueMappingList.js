import { useState, useEffect} from "react";
import axios from "axios";

const useValueMappingList = (poData) => {
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(!poData) {
      setLoading(false);
      return ;
    }
    setLoading(true);
    axios.post("http://localhost:8080/api/v1/metadata/get/vm/list", poData).then(response => {
      if(response.data && response.data.status === "Success") {
        setVms(response.data.payload.root.key);
      } else {
        throw new Error("Invalid API Response");
      }
    })
    .catch(err => {
      setError("Error while Fetching Value mapping list");
    })
    .finally(() => {
      setLoading(false);
    })

  }, [poData]);

  return {vms};
}

export default useValueMappingList;