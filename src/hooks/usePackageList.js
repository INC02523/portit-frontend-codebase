import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const usePackageList = (apiData, refreshFlag) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.post("http://localhost:8080/api/v1/migration/designtime/get/package/list", apiData)
      .then(response => {
        if (response.data && response.data.status === "Success") {
          setPackages(response.data.payload.list);
        } else {
          throw new Error("Invalid API Response");
        }
      })
      .catch(err => {
        setError("Error while Fetching Package List");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [apiData, refreshFlag]);

  return { packages};
};

export default usePackageList;
