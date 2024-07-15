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

const { TabPane } = Tabs;

const identifiers = ["openingDetail"];

const OpeningNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editDode, setEditDode] = useState(false);
  const [allData, setAllData] = useState({
    openingBalance: [
      {
        stock_date: dayjs(new Date()).format("DD-MM-YYYY"),
        store_cd: null,
      },
    ],

    openingDetail: [
      {
        item_code: null,
        hsn: null,
        uom_code: null,
        size_code: null,
        quality_code: null,
        pcs: null,
        quantity: null,
        rate: null,
        avg_wt: null,
        amt: null,
      },
    ],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);
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

  const handleSave = (event) => {
    var formv = true;

    identifiers.forEach((val) => {
      let count = 0;
      allData[val].forEach((data) => {
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
        openingDetail: allData.openingDetail.map((dep) => {
          return {
            ...dep,
          };
        }),
      };

      console.log(postData);

      axios
        .post(employeeData.URL + "/api/v1/opening", postData, {
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
              content: "Opening Balance Successfully!!!",
              className: "custom-class",
              style: {
                marginTop: "2vh",
              },
            });
            setLoading(false);
            history("/stock/transaction/opening-balance");
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
    history("/stock/transaction/opening-balance");
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
              <span style={{ fontWeight: "bold", color: "#1677ff" }}>
                Opening Balance
              </span>
              <BasicDetail
                create={true}
                ad={ad}
                setData={setAllData}
                data={allData.openingBalance[0]}
                editMode={editMode}
              />
              <Tabs
                defaultActiveKey="0"
                centered // Center the Tabs
                type="line" // Set the type to "card"
                // tabBarGutter="10"
                // id="tabs"
                // tabBarUnderlineStyle={{ borderWidth: 0 }} // Remove border from the tab bar
              >
                <TabPane
                  tab={
                    <span style={{ fontWeight: "bold", color: "000000" }}>
                      Opening Details
                    </span>
                  }
                  key="0"
                  style={{ marginTop: "-18px" }}
                >
                  <div
                    style={{
                      overflowX: "scroll",
                      padding: "10px",
                      // border: "2px solid red",
                    }}
                  >
                    <SizeDetail
                      ad={ad}
                      setData={setAllData}
                      data={allData.openingDetail}
                      editMode={editMode}
                      editDode={editDode}
                      setEditDode={setEditDode}
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

export default OpeningNew;
