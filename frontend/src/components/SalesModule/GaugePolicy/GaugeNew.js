import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import GradeDetail from "./GradeDetail";

import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const identifiers = ["GaugeSizeDetail", "GaugeGradeDetail"];

const GaugeNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [allData, setAllData] = useState({
    GaugeHeader: [
      {
        g_desc: null,
        item_code: null,
        norm_date: null,
        expire_date: null,
        remarks: null,
      },
    ],
    GaugeSizeDetail: [
      {
        size_code: null,
        size_amt: null,
      },
    ],
    GaugeGradeDetail: [
      {
        grade_code: null,
        g_amount: null,
      },
    ],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);

    axios
      .get(employeeData.URL + "/api/v1/gauge/additional-data", {
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

  //const handleSave = (event) => {
  // console.log(allData);
  // ... (your existing handleSave code)
  //};

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
        GaugeSizeDetail: allData.GaugeSizeDetail.map((dep) => {
          return {
            ...dep,
          };
        }),
        GaugeGradeDetail: allData.GaugeGradeDetail.map((dep) => {
          return {
            ...dep,
          };
        }),
      };

      console.log(postData);

      axios
        .post(employeeData.URL + "/api/v1/gauge/create-gauge", postData, {
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          message.success({
            content: "Gauge Created Successfully!!!",
            className: "custom-class",
            style: {
              marginTop: "2vh",
            },
          });
          setLoading(false);
          history("/sales/norms/gauge-detail");
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
    history("/sales/norms/gauge-detail");
  };

  return (
    <>
      {ad ? (
        <Row>
          {editMode ? (
            <>
              <Col
                lg={editMode ? 13 : 19}
                md={editMode ? 13 : 19}
                className={classes["Col"]}
              ></Col>
              <Col md={4}>
                {loading ? (
                  <SyncLoader color={"rgba(255,163,77,0.8)"} size={10} />
                ) : (
                  <button
                    style={{
                      backgroundColor: "#D0F0C0",
                      color: "#234F1E",
                    }}
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
                    style={{
                      backgroundColor: "#FC9483",
                      color: "#640000",
                    }}
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

          <Col span={24} className={classes["Col"]}>
            <BasicDetail
              create={true}
              ad={ad}
              setData={setAllData}
              data={allData.GaugeHeader[0]}
              data1={allData.GaugeGradeDetail}
              data2={allData.GaugeSizeDetail}
              editMode={editMode}
            />
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

export default GaugeNew;
