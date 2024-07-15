import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const RequisitionView = (props) => {
  const { id } = useParams();
  const employeeData = useContext(DataContext);

  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editDode, setEditDode] = useState(true);
  const [allData, setAllData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [ad, setAD] = useState(null);
  const [itemm, setItemm] = useState(null);
  const [responseDataArray, setResponseDataArray] = useState([]);
  const [dataFetchingCompleted, setDataFetchingCompleted] = useState();

  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(employeeData.URL + "/api/v1/purchaseorder/" + id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setItemm(response.data.data);
        setDataFetchingCompleted(response.data.data.purreqDetail.length);

        setAllData((allData) => {
          let newDetails = response.data.data;

          // Modify reqDetail array to include Mode property with value true for each object
          newDetails.purreqDetail.forEach((detail) => {
            detail.Mode = true;
          });

          return {
            ...newDetails,
          };
        });

        setStoreData((storeData) => {
          let newDetails = response.data.data;

          return {
            ...newDetails,
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(employeeData.URL + "/api/v1/requisition/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;
          return {
            ...newad,
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async (item, index) => {
      try {
        console.log(item.item_code);
        const response = await axios.get(
          `${employeeData.URL}/api/v1/opening/additional-data-of-hsn/${item.item_code}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.data);
        const data = response.data.data;
        setResponseDataArray((prevDataArray) => {
          const newArray = [...prevDataArray];
          newArray[index] = data; // Set the response data at the correct index
          return newArray;
        });
      } catch (error) {
        console.error(
          `Error fetching data for item_code ${item.item_code}:`,
          error
        );
      }
    };

    const fetchAllData = async () => {
      if (!itemm || !itemm.purreqDetail) {
        console.error(
          "itemm or itemm.purreqDetail is null or undefined",
          itemm
        );
        return;
      }

      try {
        await Promise.all(
          itemm.purreqDetail.map((item, index) => fetchData(item, index))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData().then(() => {
      console.log(responseDataArray.length);
      console.log(responseDataArray);
    });
  }, [itemm, setResponseDataArray]);
  // const isValidObject = (obj) => {
  //   return obj.size && obj.grade && obj.uom && obj.cost;
  // };

  // // Determine if all objects in responseDataArray meet the condition
  // const allObjectsValid = responseDataArray.every(isValidObject);

  const handleEditButtonClick = () => {
    setEditMode(true);
    setEditDode(true);
  };

  const handleSave = (event) => {
    console.log(storeData, "this is store data");
    console.log(allData, "all data");
    const postData = {
      ...allData,
    };

    const postDataS = {
      ...storeData,
      purreqDetail: allData.purreqDetail.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    // Filter out undefined elements from reqDetail array
    postData.purreqDetail = postData.purreqDetail.filter(
      (detail) => detail !== null && detail !== undefined
    );

    // Process the filtered array
    postData.purreqDetail.forEach((lang, index) => {
      if (!lang.unique_code) {
        postData.purreqDetail[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.purreqDetail[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    storeData.purreqDetail.forEach((lang, index) => {
      const dataIndex = postData.purreqDetail.findIndex(
        (element) => element.unique_code === lang.unique_code
      );
      if (dataIndex === -1) {
        postData.purreqDetail.push({
          unique_code: lang.unique_code,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    if (
      postData.purreqHdr[0].plan_date == null ||
      postData.purreqHdr[0].requirement_date == null ||
      postData.purreqHdr[0].dept_code == null ||
      postData.purreqHdr[0].requester_code == null
    ) {
      message.error({
        content: "Please Fill The Mandatory Fields!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      setLoading(false);
      return; // Stop further execution if validation fails
    }

    const allFieldsNull = postData.purreqDetail.every(
      (detail) =>
        detail.item_code === null &&
        detail.uom_code === null &&
        detail.size_code === null &&
        detail.quality_code === null &&
        detail.purpose === null &&
        detail.actual_bal === null &&
        detail.qty === null
    );

    if (allFieldsNull) {
      message.error({
        content: "Please Fill At Least One Row In The Item Detail Tab!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      setLoading(false);
      return; // Stop further execution if all fields are null
    }

    const fieldDisplayNameMap = {
      item_code: "Item",
      size_code: "Size",
      quality_code: "Grade",

      qty: "Quantity",
      uom_code: "Uom",
    };

    const invalidRows = postData.purreqDetail.filter((detail, index) => {
      if (detail.PARAM === "DELETE") {
        return false;
      }
      const mandatoryFields = [
        "item_code",
        "size_code",
        "quality_code",

        "qty",
        "uom_code",
      ];
      const missingFields = mandatoryFields.filter(
        (field) =>
          detail[field] === null ||
          detail[field] === undefined ||
          detail[field] === ""
      );
      if (missingFields.length > 0) {
        // Map field names to display names
        const displayNames = missingFields.map(
          (field) => fieldDisplayNameMap[field]
        );
        // Construct error message for this row
        const errorMessage = `Row ${
          index + 1
        }: Please Fill All Mandatory Fields (${displayNames.join(", ")})`;
        // Display error message
        message.error({
          content: errorMessage,
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });

        setLoading(false);
        return true;
      }
      return false;
    });
    if (invalidRows.length > 0) {
      return; // Stop further execution if validation fails
    }

    axios
      .patch(employeeData.URL + "/api/v1/purchaseindent/" + id, postData, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        message.success({
          content: "requisition Updated Successfully!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
        history("/stock/transactions/purchase-order");
      })
      .catch((err) => {
        message.error({
          content: "An Error Occurred!!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
      });

    // setEditMode(false);
  };

  const handleCancel = (event) => {
    setLoading(false);
    history("/stock/transactions/purchase-order");
  };

  return (
    <>
      {allData && ad && responseDataArray.length == dataFetchingCompleted ? (
        <Row className={classes["RowP"]}>
          <Col
            lg={editMode ? 13 : 19}
            md={editMode ? 13 : 19}
            className={classes["Col"]}
          ></Col>
          {editMode ? (
            <>
              <Col md={4}>
                {loading ? (
                  <SyncLoader color={"rgba(255,163,77,0.8)"} size={10} />
                ) : (
                  <button
                    style={{ backgroundColor: "#D0F0C0", color: "#234F1E" }}
                    onClick={(event) => handleSave(event)}
                    className={classes["ProfileButton"]}
                  >
                    Save
                  </button>
                )}
              </Col>
              <Col md={4}>
                {loading ? (
                  <SyncLoader color={"rgba(255,163,77,0.8)"} size={10} />
                ) : (
                  <button
                    style={{ backgroundColor: "#FC9483", color: "#640000" }}
                    onClick={(event) => handleCancel(event)}
                    className={classes["ProfileButton"]}
                  >
                    Cancel
                  </button>
                )}
              </Col>
            </>
          ) : (
            <Col md={4}>
              <button
                onClick={handleEditButtonClick}
                className={classes["ProfileButton"]}
              >
                Edit Details
              </button>
            </Col>
          )}
          <Col lg={1} md={1}></Col>
          <Col lg={24} md={24} className={classes["Col"]}>
            <div className={classes["EditView"]}>
              <Col
                style={{
                  // border: "2px solid red",
                  marginTop: "5px",
                  marginBottom: "-28px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#1677ff" }}>
                  Purchase Indent
                </span>

                <BasicDetail
                  create={true}
                  ad={ad}
                  setData={setAllData}
                  data={allData.purreqHdr[0]}
                  editMode={editMode}
                />
              </Col>
              <Tabs
                defaultActiveKey="0"
                centered // Center the Tabs
                type="line" // Set the type to "card"
                tabBarGutter="10"
                id="tabs"
                tabBarUnderlineStyle={{ borderWidth: 0 }} // Remove border from the tab bar
              >
                <TabPane
                  tab={
                    <span style={{ fontWeight: "bold", color: "000000" }}>
                      Item Details
                    </span>
                  }
                  key="0"
                  style={{
                    // border: "none !important",
                    // border: "2px solid black",
                    marginTop: "-16px",
                  }}
                >
                  <div
                    style={{
                      overflowX: "scroll",
                      // padding: "10px",
                      // border: "2px solid red",
                    }}
                  >
                    {console.log(dataFetchingCompleted, "this is lenght")}
                    {console.log(responseDataArray.length)}
                    {dataFetchingCompleted && (
                      <SizeDetail
                        ad={ad}
                        setData={setAllData}
                        data={allData.purreqDetail}
                        editMode={editMode}
                        editDode={editDode}
                        setEditDode={setEditDode}
                        responseDataArray={responseDataArray}
                        lenght={dataFetchingCompleted}
                        setResponseDataArray={setResponseDataArray}
                        setDataFetchingCompleted={setDataFetchingCompleted}
                      />
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <Skeleton active={true} />
          <Skeleton active={true} />
          <Skeleton active={true} />
          <Skeleton active={true} />
        </>
      )}
    </>
  );
};

export default RequisitionView;
