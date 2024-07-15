import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import ChargeType from "./ChargeType";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const TaxView = (props) => {
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
      .get(employeeData.URL + "/api/v1/tax/" + id, {
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
      .get(employeeData.URL + "/api/v1/tax/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;
          return {
            ...newad,
            HSN_STATUS: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "o", value: "open" },
                { key: "s", value: "suspend" },
              ],
            },
            CHARGE_TYPE: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "p", value: "%" },
                { key: "a", value: "amount" },
              ],
            },
            CHARGE_TYPE_ON: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "o", value: "on qty" },
                { key: "t", value: "total" },
              ],
            },
            REF_ON: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "a", value: "amount" },
                { key: "r", value: "running total" },
              ],
            },
            USE_FOR: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "a", value: "all" },
                { key: "s", value: "single" },
              ],
            },
            INCLUDE_COST: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "y", value: "yes" },
                { key: "n", value: "no" },
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
      taxDet: storeData.taxDet.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.taxDet.forEach((lang, index) => {
      if (!lang.unique_id) {
        postData.taxDet[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.taxDet[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.taxDet.forEach((lang, index) => {
      const dataIndex = postData.taxDet.findIndex(
        (element) => element.unique_id === lang.unique_id
      );
      if (dataIndex === -1) {
        postData.taxDet.push({
          unique_id: lang.unique_id,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(
        employeeData.URL + "/api/v1/tax/" + postData.itemTax[0]["tax_code"],
        postData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        message.success({
          content: "Tax Updated Successfully!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
        history("/sales/norms/tax-details");
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
    history("/sales/norms/tax-details");
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
                    setData={setAllData}
                    data={allData.itemTax[0]}
                    editMode={editMode}
                  />
                </TabPane>
                <TabPane tab={<span>Charge Type Details</span>} key="1">
                  <ChargeType
                    ad={ad}
                    setData={setAllData}
                    data={allData.taxDet}
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

export default TaxView;
