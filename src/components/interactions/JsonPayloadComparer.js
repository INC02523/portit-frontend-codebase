import { useState, useRef } from "react";
import axios from "axios";

const JsonPayloadComparer = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const json1Ref = useRef(null);
  const json2Ref = useRef(null);

  const compareXml = async (json1Value, json2Value) => {
    setLoading(true);

    const postData = { json1: json1Value, json2: json2Value };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/comparison/jsonpayloads",
        postData
      );
      setResult(response.data);
      setError(null);
    } catch {
      setError("Error comparing XML files");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const json1Value = json1Ref.current.value;
    const json2Value = json2Ref.current.value;

    if(json1Value === "" || json2Value === "") return ;

    compareXml(json1Value, json2Value);
  };

  return (
    <div className="flex flex-col x`">
      <div className="flex space-x-4">
        <textarea
          className="w-1/2 p-2 h-80 border"
          placeholder="Enter JSON Payload 1"
          ref={json1Ref}
        ></textarea>
        <textarea
          className="w-1/2 p-2 h-80 border"
          placeholder="Enter JSON Payload 2"
          ref={json2Ref}
        ></textarea>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Compare
      </button>
      {loading && <div>Loading...</div>}
      {result && <div className={`mt-4 text-center ${result === "JSON files are equal. Detailed differences:\n" ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}`}>
  {JSON.stringify(result)}
</div>}

    </div>
  );
};

export default JsonPayloadComparer;
