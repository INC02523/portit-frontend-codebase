import {useState} from 'react';
import axios from 'axios';

const useJsonComparison = () => {
  const [comparisonResult, setComparisonResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const compareJsonFiles = async(jsonFile1, jsonFile2)=> {
    const formData = new FormData();
    formData.append('jsonFile1', jsonFile1);
    formData.append('jsonFile2', jsonFile2);

    try {
      const response = await axios.post("http://localhost:8080/api/v1/comparison/jsonfiles", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      setComparisonResult(response.data);
      setErrorMessage('');
    } catch {
      setErrorMessage('Error comparing JSON files');
    }
  };

  return {comparisonResult, errorMessage, compareJsonFiles};
}

export default useJsonComparison;