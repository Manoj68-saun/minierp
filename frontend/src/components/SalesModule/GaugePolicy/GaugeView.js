import classes from "../Pages.module.css";
import { Row, Col, Select, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import GradeDetail from "./GradeDetail";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;
const { Option } = Select;
const GaugeView = (props) => {
  const { id } = useParams();
  const employeeData = useContext(DataContext);

  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDode, setEditDode] = useState(true);
  const [allData, setAllData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [ad, setAD] = useState(null);
  const [it, setIt] = useState(null);
  const [sizef, setSizef] = useState([]);
  const [gradef, setGradef] = useState([]);

  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(employeeData.URL + "/api/v1/gauge/" + id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setIt(response.data.data.GaugeHeader[0].item_code);

        // axios
        //   .get(
        //     employeeData.URL + "/api/v1/gauge/additional-data-of-hsn/" + it,
        //     {
        //       withCredentials: true,
        //     }
        //   )

        //   .then((response) => {
        //     console.log(response);

        // var res = response.data.data.hsn1.rows[0].hsn;
        // var res1 = response.data.data.hsn1.rows[0].uom_nm;

        // console.log("bbdbdbcdcbdcc", res1);
        // setSizef(
        //   response.data.data.size.rows.map((option) => {
        //     return (
        //       <Option
        //         style={{ textTransform: "capitalize", color: "#1777C4" }}
        //         key={option[response.data.data.size.fields[0].name]}
        //         value={option[response.data.data.size.fields[0].name]}
        //       >
        //         {option[response.data.data.size.fields[1].name]}
        //       </Option>
        //     );
        //   })
        // );

        // setGradef(
        //   response.data.data.grade.rows.map((option) => {
        //     return (
        //       <Option
        //         style={{ textTransform: "capitalize", color: "#1777C4" }}
        //         key={option[response.data.data.grade.fields[0].name]}
        //         value={option[response.data.data.grade.fields[0].name]}
        //       >
        //         {option[response.data.data.grade.fields[1].name]}
        //       </Option>
        //     );
        //   })
        // );
        // });

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
      .get(employeeData.URL + "/api/v1/gauge/additional-data", {
        params: {
          operationType: "update", // or simply operationType as it's the same key and value
        },
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
    if (it !== null) {
      axios
        .get(employeeData.URL + "/api/v1/gauge/additional-data-of-sz/" + it, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setSizef(
            response.data.data.size.rows.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option[response.data.data.size.fields[0].name]}
                  value={option[response.data.data.size.fields[0].name]}
                >
                  {option[response.data.data.size.fields[1].name]}
                </Option>
              );
            })
          );

          setGradef(
            response.data.data.grade.rows.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option[response.data.data.grade.fields[0].name]}
                  value={option[response.data.data.grade.fields[0].name]}
                >
                  {option[response.data.data.grade.fields[1].name]}
                </Option>
              );
            })
          );
        })
        .catch((error) => {
          console.error("Error fetching additional data:", error);
        });
    }
  }, [it, employeeData.URL]);

  const handleSave = (event) => {
    const postData = {
      ...allData,
    };

    const postDataS = {
      ...storeData,
      GaugeSizeDetail: storeData.GaugeSizeDetail.map((dep) => {
        return {
          ...dep,
        };
      }),
      GaugeGradeDetail: storeData.GaugeGradeDetail.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.GaugeSizeDetail.forEach((lang, index) => {
      if (!lang.unique_id) {
        postData.GaugeSizeDetail[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.GaugeSizeDetail[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.GaugeSizeDetail.forEach((lang, index) => {
      const dataIndex = postData.GaugeSizeDetail.findIndex(
        (element) => element.unique_id === lang.unique_id
      );
      if (dataIndex === -1) {
        postData.GaugeSizeDetail.push({
          unique_id: lang.unique_id,
          PARAM: "DELETE",
        });
      }
    });
    postData.GaugeGradeDetail.forEach((lang, index) => {
      if (!lang.unique_id) {
        postData.GaugeGradeDetail[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.GaugeGradeDetail[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.GaugeGradeDetail.forEach((lang, index) => {
      const dataIndex = postData.GaugeGradeDetail.findIndex(
        (element) => element.unique_id === lang.unique_id
      );
      if (dataIndex === -1) {
        postData.GaugeGradeDetail.push({
          unique_id: lang.unique_id,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(
        employeeData.URL + "/api/v1/gauge/" + postData.GaugeHeader[0]["a_code"],
        postData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        message.success({
          content: "Gauge Updated Successfully!!!",
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

    setEditMode(false);
  };

  const handleCancel = (event) => {
    setLoading(false);
    history("/sales/norms/gauge-detail");
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
                  <BasicDetail
                    create={true}
                    ad={ad}
                    edi={editDode}
                    setData={setAllData}
                    data={allData.GaugeHeader[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span> Size Details</span>} key="1">
                  <SizeDetail
                    ad={ad}
                    setData={setAllData}
                    data={allData.GaugeSizeDetail}
                    editMode={editMode}
                    siz={sizef}
                  />
                </TabPane>
                <TabPane tab={<span>Grade Deatils</span>} key="2">
                  <GradeDetail
                    ad={ad}
                    setData={setAllData}
                    data={allData.GaugeGradeDetail}
                    editMode={editMode}
                    grd={gradef}
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

export default GaugeView;
