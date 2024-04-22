import { useState, useRef } from "react";
import axios from "axios";

const XmlPayloadComparison = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const xml1Ref = useRef(null);
  const xml2Ref = useRef(null);

  const compareXml = async (xml1Value, xml2Value) => {
    setLoading(true);

    const postData = { xmlPayload1: xml1Value, xmlPayload2: xml2Value };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/comparison/xmlpayloads",
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
    const xml1Value = xml1Ref.current.value;
    const xml2Value = xml2Ref.current.value;

    compareXml(xml1Value, xml2Value);
  };

  return (
    <div className="flex flex-col x`">
      <div className="flex space-x-4">
        <textarea
          className="w-1/2 p-2 h-80 border"
          placeholder="Enter XML Payload 1"
          ref={xml1Ref}
        ></textarea>
        <textarea
          className="w-1/2 p-2 h-50vh border"
          placeholder="Enter XML Payload 2"
          ref={xml2Ref}
        ></textarea>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold text-xl w-1/4 mx-auto"
      >
        Compare
      </button>
      {loading && <div>Loading...</div>}
      {result  && <div className={`mt-4 text-center ${result === "XML payloads are equal." ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}`}>
  {JSON.stringify(result)}
</div>}
{error && <div className="bg-red-500 text-white px-4 py-2 mt-4 rounded text-center">Error: {error}</div>}
    </div>
  );
};

export default XmlPayloadComparison;
