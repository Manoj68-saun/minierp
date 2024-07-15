import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetails from "./BasicDetails";
import ItemSize from "./ItemSize";
import GradeDetails from "./GradeDetails";
import AccountDetails from "./AccountDetails";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const identifiers = ["itemSize", "gradeDetails", "accountDetails"];

const ItemNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [allData, setAllData] = useState({
    itemMaster: [
      {
        item_name: null,
        item_uom: null,
        item_category: null,
        hsn: null,
        item_group_cd: null,
        item_subgroup_code: null,
        item_rating_code: null,
        actual_name: null,
        item_min_qty: null,
        item_max_qty: null,
        reorder_level: null,
        avg_reorderqty: null,
        item_home_yn: null,
      },
    ],
    itemSize: [],
    gradeDetails: [],
    accountDetails: [],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);
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
            ITEM_HOME_YN: {
              fields: [{ name: "KEY" }, { name: "VALUE" }],
              rows: [
                { KEY: "Y", VALUE: "YES" },
                { KEY: "N", VALUE: "NO" },
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
    if (
      allData.itemMaster[0].item_name == null &&
      allData.itemMaster[0].item_category == null &&
      allData.itemMaster[0].item_uom == null &&
      allData.itemMaster[0].hsn == null &&
      allData.itemMaster[0].item_group_cd == null &&
      allData.itemMaster[0].item_subgroup_code == null
    ) {
      // console.log("header feilds are empty");
      message.error({
        content: "Please Fill the Mandatory Fields!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });

      return;
    } else if (allData.itemMaster[0].item_name == null) {
      // console.log("header feilds are empty");
      document.getElementById("item_nam").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Item name can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.itemMaster[0].item_uom == null) {
      // console.log("header feilds are empty");
      document.getElementById("uom").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Item uom can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.itemMaster[0].item_category == null) {
      // console.log("header feilds are empty");
      document.getElementById("item_category").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Item category can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.itemMaster[0].hsn == null) {
      // console.log("header feilds are empty");
      document.getElementById("hsn_no").focus();
      // const element=document.getElementById('item_nam');
      //      element.getElementsByTagName('input')[0].focus();
      message.error({
        content: "Hsn can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
      // } else if (allData.itemMaster[0].item_group_cd == null) {
      //   // console.log("header feilds are empty");
      //   document.getElementById("item_group_cd").focus();
      //   // const element=document.getElementById('item_nam');
      //   //      element.getElementsByTagName('input')[0].focus();
      //   message.error({
      //     content: "Item Group can not be null",
      //     className: "custom-class",
      //     style: {
      //       marginTop: "1vh",
      //     },
      //   });
      //   return;
      // } else if (allData.itemMaster[0].item_subgroup_code == null) {
      //   // console.log("header feilds are empty");
      //   document.getElementById("subgroup").focus();
      //   // const element=document.getElementById('item_nam');
      //   //      element.getElementsByTagName('input')[0].focus();
      //   message.error({
      //     content: "Item Subgroup can not be null",
      //     className: "custom-class",
      //     style: {
      //       marginTop: "1vh",
      //     },
      //   });
      //   return;
    } else if (allData.itemSize.length == 0) {
      message.error({
        content: "Please Fill the Mandatory Fields in Item Size Tab!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.gradeDetails.length == 0) {
      message.error({
        content: "Please Fill the Mandatory Fields in  Grade Detail tab!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.accountDetails.length == 0) {
      message.error({
        content: "Please Fill the Mandatory Fields in  Account Detail tab!!!",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    }

    var formv = true;

    identifiers.forEach((val) => {
      let count = 0;
      allData[val].forEach((data) => {
        console.log(!data);
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
        itemSize: allData.itemSize.map((dep) => {
          return {
            ...dep,
          };
        }),
        gradeDetails: allData.gradeDetails.map((dep) => {
          return {
            ...dep,
          };
        }),
        accountDetails: allData.accountDetails.map((dep) => {
          return {
            ...dep,
          };
        }),
      };

      console.log(postData);

      axios
        .post(employeeData.URL + "/api/v1/items", postData, {
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
              content: "item master Created Successfully!!!",
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
          // if(response.data.status === 'fail'){
          //     message.error({
          //         content: response.data.message,
          //         className: 'custom-class',
          //         style: {
          //             marginTop: '2vh',
          //         },
          //     });

          //     setLoading(false)
          // }
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
    history("/sales/itemMaster/item-details");
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

export default ItemNew;
