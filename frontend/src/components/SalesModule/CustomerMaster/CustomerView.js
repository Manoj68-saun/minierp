import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";
import ContactDetails from "./ContactDetails";
import DeliveryDetails from "./DeliveryDetails";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const CustomerView = (props) => {
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
      .get(employeeData.URL + "/api/v1/customerm/" + id, {
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
      .get(employeeData.URL + "/api/v1/customerm/additional-data", {
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
      contactDetails: storeData.contactDetails.map((dep) => {
        return {
          ...dep,
        };
      }),
      deliveryDetails: storeData.deliveryDetails.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.contactDetails.forEach((lang, index) => {
      if (!lang.unique_code) {
        postData.contactDetails[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.contactDetails[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.contactDetails.forEach((lang, index) => {
      const dataIndex = postData.contactDetails.findIndex(
        (element) => element.unique_code === lang.unique_code
      );
      if (dataIndex === -1) {
        postData.contactDetails.push({
          unique_code: lang.unique_code,
          PARAM: "DELETE",
        });
      }
    });

    postData.deliveryDetails.forEach((lang, index) => {
      if (!lang.del_site_code) {
        postData.deliveryDetails[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.deliveryDetails[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.deliveryDetails.forEach((lang, index) => {
      const dataIndex = postData.deliveryDetails.findIndex(
        (element) => element.del_site_code === lang.del_site_code
      );
      if (dataIndex === -1) {
        postData.deliveryDetails.push({
          del_site_code: lang.del_site_code,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(
        employeeData.URL +
          "/api/v1/customerm/" +
          postData.customerMaster[0]["distributor_code"],
        postData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        if (response.data.status === "fail") {
          message.error({
            content: response.data.message,
            className: "custom-class",
            style: {
              marginTop: "2vh",
            },
          });

          setLoading(false);
        } else {
          message.success({
            content: "customer master Updated Successfully!!!",
            className: "custom-class",
            style: {
              marginTop: "2vh",
            },
          });
          setLoading(false);
          history("/sales/customerMaster/customer-details");
        }
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
    history.replace("/sales/customerMaster/customer-details");
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
                    data={allData.customerMaster[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Contact Details</span>} key="1">
                  <ContactDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.contactDetails}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Delivery Deatils</span>} key="2">
                  <DeliveryDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.deliveryDetails}
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

export default CustomerView;
