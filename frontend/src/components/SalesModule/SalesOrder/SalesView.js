import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";
import BookingSize from "./BookingSize";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const { TabPane } = Tabs;

const SalesView = (props) => {
  const { id } = useParams();
  const employeeData = useContext(DataContext);

  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editMode1, setEditMode1] = useState(false);
  const [allData, setAllData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [ad, setAD] = useState(null);
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(employeeData.URL + "/api/v1/salesOrder/" + id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        // Extract distributor_code from the first API response
        const distributorCode =
          response.data.data.salesOrder[0].distributor_code;

        // Make a second API call using distributorCode as a parameter
        axios
          .get(
            employeeData.URL +
              "/api/v1/salesInvoice/additional-data-of-customer/" +
              distributorCode,
            {
              withCredentials: true,
            }
          )
          .then((secondResponse) => {
            console.log(secondResponse);
            const customer = secondResponse.data.data.customer.rows; // Replace with the actual response structure
            setCustomers(customer);

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
          });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(employeeData.URL + "/api/v1/salesOrder/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;
          return {
            ...newad,
            DISCOUNT_ON: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "r", value: "rate" },
                { key: "ta", value: "total amount" },
              ],
            },
            DIS_TYPE: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "p", value: "%" },
                { key: "a", value: "amount" },
              ],
            },
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
      bookingSize: storeData.bookingSize.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.bookingSize.forEach((lang, index) => {
      if (!lang.unique_id) {
        postData.bookingSize[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.bookingSize[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.bookingSize.forEach((lang, index) => {
      const dataIndex = postData.bookingSize.findIndex(
        (element) => element.unique_id === lang.unique_id
      );
      if (dataIndex === -1) {
        postData.bookingSize.push({
          unique_id: lang.unique_id,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(
        employeeData.URL +
          "/api/v1/salesOrder/" +
          postData.salesOrder[0]["booking_code"],
        postData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        message.success({
          content: "Sales Order Updated Successfully!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
        history("/sales/transaction/salesOrder");
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
    history("/sales/transaction/salesOrder");
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
                onClick={() => {
                  setEditMode(true);
                  setEditMode1(true);
                }}
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
                    customers={customers}
                    setData={setAllData}
                    data={allData.salesOrder[0]}
                    editMode={editMode}
                    editMode1={editMode1}
                  />
                </TabPane>
                <TabPane tab={<span>Booking Size Details</span>} key="1">
                  <BookingSize
                    ad={ad}
                    setData={setAllData}
                    data={allData.bookingSize}
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

export default SalesView;
