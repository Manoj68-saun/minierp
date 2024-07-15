import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";

import VendorDetails from "./VendorDetails";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const DealerView = (props) => {
  const { id } = useParams();
  const employeeData = useContext(DataContext);

  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [allData, setAllData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(employeeData.URL + "/api/v1/dealer/" + id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);

        setAllData((allData) => {
          let newDetails = response.data.data;
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
      .get(employeeData.URL + "/api/v1/dealer/additional-data", {
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

  const handleSave = (event) => {
    const postData = {
      ...allData,
    };

    const postDataS = {
      ...storeData,
      customerDetails: allData.customerDetails.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.customerDetails.forEach((lang, index) => {
      if (!lang.unique_code) {
        postData.customerDetails[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.customerDetails[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.customerDetails.forEach((lang, index) => {
      const dataIndex = postData.customerDetails.findIndex(
        (element) => element.unique_code === lang.unique_code
      );
      if (dataIndex === -1) {
        postData.customerDetails.push({
          unique_code: lang.unique_code,
          PARAM: "DELETE",
        });
      }
    });

    // postData.dealerGroup.forEach((lang,index) => {

    //     if(!lang.EXTERNAL_ENTITY_GR_CD){
    //         postData.dealerGroup[index] = {
    //             ...lang,
    //             PARAM: "INSERT"
    //         }
    //     }

    //     else{
    //         postData.dealerGroup[index] = {
    //             ...lang,
    //             PARAM: "UPDATE"
    //         }
    //     }
    // })

    // postDataS.dealerGroup.forEach((lang,index) => {
    //     const dataIndex = postData.dealerGroup.findIndex(element => element.EXTERNAL_ENTITY_GR_CD === lang.EXTERNAL_ENTITY_GR_CD)
    //     if(dataIndex === -1){
    //         postData.dealerGroup.push({
    //             EXTERNAL_ENTITY_GR_CD: lang.EXTERNAL_ENTITY_GR_CD,
    //             PARAM: "DELETE"
    //         })
    //     }
    // })

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(employeeData.URL + "/api/v1/dealer/" + id, postData, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        message.success({
          content: "Dealer master Updated Successfully!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
        history("/sales/dealerMaster/dealer-details");
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
    history("/sales/dealerMaster/dealer-details");
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
                onClick={() => setEditMode(true)}
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
                  <BasicDetails
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.dealerMaster[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Vendor Details</span>} key="1">
                  <VendorDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.customerDetails}
                    editMode={editMode}
                  />
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

export default DealerView;
