import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const postApi = async (apiURL, toPostData) => {
  //   API CALLING AND RESPONSE
  try {
    const res = await axios.post(apiURL, toPostData);

    // console.log(res.data, "api response");
    return res;
  } catch (e) {
    // toast.error(e.message + " - " + e.name, {
    //   position: toast.POSITION.TOP_CENTER,
    // });
    console.log("Axios error : ",e);
    return e;
  }
};

export const handelTestConnection = (data, setDisableNext, setTestingConn) => {
  
  
  // ALERT DATA TO SHOW
  const alertShow = (type) => {
    if (type === "success") {
      toast.success("Connection Successful", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.error("Connection Failed", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  // AGENT/PO DETAILS TEST CONNECTION CHECK---------------------------------------
  if (data.dataType === "poData") {
    const toPostData = data.formData;

    postApi("http://localhost:8080/api/v1/migration/configuration/connect/esr", toPostData)
      .then((response1) => {
        // IF ESR Success
        if (response1?.data?.status === "Success") {
          postApi("http://localhost:8080/api/v1/migration/configuration/connect/id", toPostData)
            .then((response2) => {
              // IF ID Success
              if (response2?.data?.status === "Success") {
                //Storing Agent Data in local storage on 'test-conn' success.
                const thisAgentPrevData = JSON.parse(
                  localStorage.getItem("currAgent")
                  );
                  console.log(thisAgentPrevData);

                const thisAgentNewData = {
                  ...(thisAgentPrevData ? thisAgentPrevData : null),
                  poData: toPostData,
                };

                localStorage.setItem(
                  "currAgent",
                  JSON.stringify(thisAgentNewData)
                );

                //
                setDisableNext(false);
                alertShow("success");
              } else {
                //IF ID FAILED
                setDisableNext(true);
                alertShow("error");
              }
              setTestingConn(false);
            })
            .catch((error) => {
              toast.error("Connection Failed!- " + error.message, {
                position: toast.POSITION.BOTTOM_CENTER,
              });
              console.error("Error:", error);
              setTestingConn(false);
            });
        } else {
          //IF ESR FAILED
          setDisableNext(true);
          setTestingConn(false);
          alertShow("error");
        }
      })
      .catch((error) => {
        toast.error("Connection Failed!- " + error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error("Error:", error);
        setTestingConn(false);
      });
  } //  CPI DETAILS TEST CONNECTION CHECK-----------------------------------------
  else if (data.dataType === "cpiData") {
    const toPostData = data.formData;

    postApi("http://localhost:8080/api/v1/migration/configuration/connect/is/cpi", toPostData)
      .then((response) => {
        // IF IS CPI Connectivity Success
        if (response?.data?.status === "Success") {
          //Storing Agent Data in local storage on 'test-conn' success.
          const thisAgentPrevData = JSON.parse(
            localStorage.getItem("currAgent")
          );
          console.log(thisAgentPrevData);


          const thisAgentNewData = {
            ...(thisAgentPrevData ? thisAgentPrevData : null),
            cpiData: toPostData,
          };

          localStorage.setItem("currAgent", JSON.stringify(thisAgentNewData));
          //
          setDisableNext(false);
          alertShow("success");
        } else {
          //IF IS CPI Connectivity  FAILED
          setDisableNext(true);
          alertShow("error");
        }
        setTestingConn(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Connection Failed!- " + error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTestingConn(false);
      });
  } //  API DETAILS TEST CONNECTION CHECK ------------------------------------------
  else if (data.dataType === "apiData") {
    const toPostData = data.formData;

    postApi("http://localhost:8080/api/v1/migration/configuration/connect/is/api", toPostData)
      .then((response) => {
        // IF IS API Connectivity Success
        if (response?.data?.status === "Success") {
          //Storing Agent Data in local storage on 'test-conn' success.
          const thisAgentPrevData = JSON.parse(
            localStorage.getItem("currAgent")
          );
          console.log(thisAgentPrevData);


          const thisAgentNewData = {
            ...(thisAgentPrevData ? thisAgentPrevData : null),
            apiData: toPostData,
            adapter: [],
          };

          localStorage.setItem("currAgent", JSON.stringify(thisAgentNewData));

          //
          setDisableNext(false);
          alertShow("success");
        } else {
          //IF IS API Connectivity  FAILED
          setDisableNext(true);
          alertShow("error");
        }
        setTestingConn(false);
      })
      .catch((error) => {
        toast.error("Connection Failed!- " + error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error("Error:", error);
        setTestingConn(false);
      });
  } else {
    // alert("API DATA MISSING - FAIL");
    toast.error("API DATA MISSING - FAIL", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    console.log("error in StepperAPI.js");
    setTestingConn(false);
  }
};
