import classes from "../Pages.module.css";
import { Row, Col, Tabs, Card, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";
import BookingSize from "./BookingSize";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const identifiers = ["bookingSize"];

const SalesNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [allData, setAllData] = useState({
    salesOrder: [
      {
        distributor_name: null,
        dealer_name: null,
        order_type: null,
        booking_date: null,
        invoice_type_code: null,
        payment_days: null,
        del_site_code: null,
        auth_status: null,
        freight_type_code: null,
        customer_po_no: null,
        broker_code: null,
        payment_code: null,
        tolerance: null,
        payment_amt: null,
        remarks: null,
      },
    ],

    bookingSize: [
      {
        item_code: null,
        size_code: null,
        quality: null,
        uom: null,
        no_pcs: null,
        qty: null,
        book_rate_guage: null,
        discount_on: null,
        discount_amount: null,
        bk_rate: null,
        booking_rate: null,
        dis_type: null,
        tot_item_amt: null,
        net_rate: null,
        net_size_rate: null,
      },
    ],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);

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
            // AUTH_STATUS: {
            //     fields: [{name: "KEY"},{name: "VALUE"}],
            //     rows: [{KEY: "P", VALUE: "PENDING"},{KEY: "A", VALUE: "APPROVEL"}]
            //   },
            // ALLOWANCE_TYPE: {
            //     metaData: [{name: "KEY"},{name: "VALUE"}],
            //     rows: [{KEY: "%", VALUE: "Percentage"},{KEY: "A", VALUE: "Amount"}]
            //   },
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
    console.log("ytu467676");
    var formv = true;

    identifiers.forEach((val) => {
      console.log(val);
      console.log(allData[val]);
      let count = 0;
      allData[val].forEach((data) => {
        console.log(data);
        console.log(allData[val]);
        if (!data) {
          formv = formv && false;
          if (count === 0) {
            message.error({
              content: "Empty Fields In " + val.toUpperCase() + " Tab!!!",
              className: "custom-class",
              style: {
                marginTop: "1vh",
              },
            });
          }

          count = count + 1;
        }
      });
    });

    if (formv) {
      setLoading(true);
      const postData = {
        ...allData,
      };

      console.log(postData);

      axios
        .post(employeeData.URL + "/api/v1/salesOrder/create-sales", postData, {
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          message.success({
            content: "SALES ODRDER Created Successfully!!!",
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
    }
  };

  const handleCancel = (event) => {
    setLoading(false);
    history("/sales/transaction/salesOrder");
  };

  return (
    <>
      {ad ? (
        <Row className={classes["RowP"]}>
          <Col
            lg={editMode ? 13 : 19}
            md={editMode ? 13 : 19}
            className={classes["Col"]}
          ></Col>
          {editMode ? (
            <>
              <Col md={12}>
                <h2
                  style={{
                    color: "#355576",
                    fontWeight: "bold",
                    borderRadius: "20px",

                    fontFamily: "Montserrat",
                    // fontWeight: 900,
                    fontSize: "1.1rem",
                  }}
                >
                  Sale Order
                </h2>
              </Col>
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
              <div style={{ margin: "16px", border: "" }}>
                <Card
                  bordered={false}
                  style={{ background: "rgba(0, 0, 0, 0.12)" }}
                  bodyStyle={{
                    border: 0,
                    padding: "1px",
                  }}
                >
                  <BasicDetails
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.salesOrder[0]}
                    editMode={editMode}
                  />
                </Card>
              </div>

              <Tabs
                defaultActiveKey="0"
                centered
                style={{ height: "100%" }}
                tabPosition={"left"}
                type="line"
                tabBarGutter="0"
              >
                <TabPane
                  tab={
                    <span
                      style={{
                        color: "#355576",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        lineHeight: "1.2rem",
                        fontFamily: "Montserrat",
                        fontWeight: 900,
                        fontSize: "1rem",
                      }}
                    >
                      Size Details
                    </span>
                  }
                  key="0"
                >
                  <div
                    style={{
                      overflowX: "scroll",
                      padding: "10px",
                      // border: "2px solid red",
                    }}
                  >
                    <BookingSize
                      create={true}
                      ad={ad}
                      setData={setAllData}
                      data={allData.bookingSize}
                      editMode={editMode}
                    />
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

export default SalesNew;
