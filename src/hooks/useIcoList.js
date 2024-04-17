import { useState, useEffect } from 'react';
import axios from 'axios';

const useIcoList = (poData) => {
  const [icos, setIcos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!poData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.post("http://localhost:8080/api/v1/metadata/get/ico/list", poData)
      .then(response => {
        if (response.data && response.data.status === "Success") {
          setIcos(response.data.payload.root.key);
        } else {
          throw new Error("Invalid API Response");
        }
      })
      .catch(err => {
        setError("Error while Fetching ICO List");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [poData]);

  return { icos };
};

export default useIcoList;
