import {useState} from 'react';
import axios from 'axios';

const useXmlComparison = () => {
  const [comparisonResult, setComparisonResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const compareXmlFiles = async(xmlFile1, xmlFile2) => {
    const formData = new FormData();
    formData.append('xmlFile1', xmlFile1);
    formData.append('xmlFile2', xmlFile2);

    try {
      const response = await axios.post("http://localhost:8080/api/v1/comparison/xmlfiles", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // console.log('API Response:', response.data);
      setComparisonResult(response.data);
      setErrorMessage("");
    } catch {
      setErrorMessage('Error comparing XML files');
    }
  };

  return {comparisonResult, errorMessage, compareXmlFiles};
};

export default useXmlComparison;