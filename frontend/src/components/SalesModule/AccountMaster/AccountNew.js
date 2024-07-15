import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const identifiers = ["accountHeader"];

const AccountNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [allData, setAllData] = useState({
    accountHeader: [
      {
        account_name: null,
        group_code: null,
        add1: null,
        add2: null,
        city_code: null,
        pin_code: null,
        ph1: null,
        pan_no: null,
        email: null,
        bank_account_number: null,
        bank_ifsc_code: null,
        account_used: null,
      },
    ],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);

    axios
      .get(employeeData.URL + "/api/v1/account/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;
          return {
            ...newad,
            ACCOUNT_USED: {
              fields: [{ name: "KEY" }, { name: "VALUE" }],
              rows: [
                { KEY: "P", VALUE: "PUR" },
                { KEY: "S", VALUE: "SLS" },
              ],
            },
            // ALLOWANCE_TYPE: {
            //     metaData: [{name: "KEY"},{name: "VALUE"}],
            //     rows: [{KEY: "%", VALUE: "Percentage"},{KEY: "A", VALUE: "Amount"}]
            //   },
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
        .post(employeeData.URL + "/api/v1/account/create-account", postData, {
          withCredentials: true,
          credentials: "include",
        })
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
              content: "Account Created Successfully!!!",
              className: "custom-class",
              style: {
                marginTop: "2vh",
              },
            });
            setLoading(false);
            history("/sales/accountmaster/account-details");
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
    }
  };

  const handleCancel = (event) => {
    setLoading(false);
    history("/sales/accountmaster/account-details");
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
                  <BasicDetail
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.accountHeader[0]}
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

export default AccountNew;
