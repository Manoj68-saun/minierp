import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";
import ItemSize from "./ItemSize";
import GradeDetails from "./GradeDetails";
import AccountDetails from "./AccountDetails";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const { TabPane } = Tabs;

const ItemView = (props) => {
  // console.log(props)
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
      .get(employeeData.URL + "/api/v1/items/" + id, {
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
      .get(employeeData.URL + "/api/v1/items/additional-data", {
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
      itemSize: storeData.itemSize.map((dep) => {
        return {
          ...dep,
        };
      }),
      gradeDetails: storeData.gradeDetails.map((dep) => {
        return {
          ...dep,
        };
      }),
      accountDetails: storeData.accountDetails.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.itemSize.forEach((lang, index) => {
      if (!lang.uniq_code) {
        postData.itemSize[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.itemSize[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.itemSize.forEach((lang, index) => {
      const dataIndex = postData.itemSize.findIndex(
        (element) => element.uniq_code === lang.uniq_code
      );
      if (dataIndex === -1) {
        postData.itemSize.push({
          uniq_code: lang.uniq_code,
          PARAM: "DELETE",
        });
      }
    });

    postData.gradeDetails.forEach((lang, index) => {
      if (!lang.uniq_code) {
        postData.gradeDetails[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.gradeDetails[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.gradeDetails.forEach((lang, index) => {
      const dataIndex = postData.gradeDetails.findIndex(
        (element) => element.uniq_code === lang.uniq_code
      );
      if (dataIndex === -1) {
        postData.gradeDetails.push({
          uniq_code: lang.uniq_code,
          PARAM: "DELETE",
        });
      }
    });

    postData.accountDetails.forEach((lang, index) => {
      if (!lang.uniq_code) {
        postData.accountDetails[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.accountDetails[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.accountDetails.forEach((lang, index) => {
      const dataIndex = postData.accountDetails.findIndex(
        (element) => element.uniq_code === lang.uniq_code
      );
      if (dataIndex === -1) {
        postData.accountDetails.push({
          uniq_code: lang.uniq_code,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(
        employeeData.URL +
          "/api/v1/items/" +
          postData.itemMaster[0]["item_code"],
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
            content: "Item master Updated Successfully!!!",
            className: "custom-class",
            style: {
              marginTop: "2vh",
            },
          });
          setLoading(false);
          history("/sales/itemMaster/item-details");
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
    history.replace("/sales/itemMaster/item-details");
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
                    data={allData.itemMaster[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Item Size</span>} key="1">
                  <ItemSize
                    ad={ad}
                    setData={setAllData}
                    data={allData.itemSize}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Grade Deatils</span>} key="2">
                  <GradeDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.gradeDetails}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Account Details</span>} key="3">
                  <AccountDetails
                    ad={ad}
                    setData={setAllData}
                    data={allData.accountDetails}
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

export default ItemView;
