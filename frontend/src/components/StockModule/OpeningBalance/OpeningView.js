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

const OpeningView = (props) => {
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
  const [editDisable, setEditDisable] = useState(true);
  const [responseDataArray, setResponseDataArray] = useState([]);
  const [dataFetchingCompleted, setDataFetchingCompleted] = useState();
  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(employeeData.URL + "/api/v1/opening/" + id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setItemm(response.data.data);
        setDataFetchingCompleted(response.data.data.openingDetail.length);
        setAllData((allData) => {
          let newDetails = response.data.data;

          newDetails.openingDetail.forEach((detail) => {
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
      .get(employeeData.URL + "/api/v1/opening/additional-data", {
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
    const fetchData = async (item) => {
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
        setResponseDataArray((prevDataArray) => [...prevDataArray, data]);
        // console.log(data); // Do something with the data
      } catch (error) {
        console.error(
          `Error fetching data for item_code ${item.item_code}:`,
          error
        );
      }
    };

    const fetchAllData = async () => {
      if (!itemm && !itemm.openingDetail) {
        // Check if itemm and invoiceSize are not null
        // Use Promise.all to execute all asynchronous functions concurrently
        await Promise.all(itemm.openingDetail.map((item) => fetchData(item)));
      } else {
        console.error(
          "itemm or itemm.openingDetail is null or undefined",
          itemm
        );
      }
    };

    // Call the function to fetch data for all items in the array
    fetchAllData();
  }, [itemm, setResponseDataArray]);
  const isValidObject = (obj) => {
    return obj.size && obj.grade && obj.uom && obj.cost;
  };

  // Determine if all objects in responseDataArray meet the condition
  const allObjectsValid = responseDataArray.every(isValidObject);

  const handleEditButtonClick = () => {
    setEditMode(true);
    setEditDode(true);
  };

  const handleSave = (event) => {
    const postData = {
      ...allData,
    };

    const postDataS = {
      ...storeData,
      openingDetail: allData.openingDetail.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.openingDetail.forEach((lang, index) => {
      if (!lang.uniq_code) {
        postData.openingDetail[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.openingDetail[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.openingDetail.forEach((lang, index) => {
      const dataIndex = postData.openingDetail.findIndex(
        (element) => element.uniq_code === lang.uniq_code
      );
      if (dataIndex === -1) {
        postData.openingDetail.push({
          uniq_code: lang.uniq_code,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(employeeData.URL + "/api/v1/opening/" + id, postData, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        message.success({
          content: "Opening Balance Updated Successfully!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
        history("/stock/transaction/opening-balance");
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

    setEditMode(false);
  };

  const handleCancel = (event) => {
    setLoading(false);
    history("/stock/transaction/opening-balance");
  };

  return (
    <>
      {allData && ad ? (
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
              <Tabs
                defaultActiveKey="0"
                centered
                style={{ height: "100%" }}
                tabPosition={"left"}
                type="line"
                tabBarGutter="0"
              >
                <TabPane tab={<span>Basic Details</span>} key="0">
                  <BasicDetail
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.openingBalance[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Opening Details</span>} key="1">
                  {responseDataArray.length == dataFetchingCompleted &&
                    allObjectsValid && (
                      <SizeDetail
                        ad={ad}
                        setData={setAllData}
                        data={allData.openingDetail}
                        editMode={editMode}
                        editDode={editDode}
                        setEditDode={setEditDode}
                        responseDataArray={responseDataArray}
                        editDisable={editDisable}
                        lenght={dataFetchingCompleted}
                      />
                    )}
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

export default OpeningView;
