import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext, useRef } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const identifiers = ["stockDetail"];

const RequisitionNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editDode, setEditDode] = useState(false);
  const sizeRef = useRef(null);
  const [allData, setAllData] = useState({
    stockHdr: [
      {
        stock_date: dayjs(new Date()).format("DD-MM-YYYY"),

        effect: "+",
        trans_type: null,
        reason: null,
      },
    ],

    stockDetail: [
      {
        item_code: null,
        uom_code: null,
        size_code: null,
        quality_code: null,
        pices: null,
        store_cd: null,
        rate: null,
        actual_bal: null,
        quantity: null,
      },
    ],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);
    axios
      .get(employeeData.URL + "/api/v1/requisition/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;
          return {
            ...newad,
            st: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "G", value: "Plant Generation" },
                { key: "A", value: "ADJ" },
              ],
            },
            effect: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "+", value: "+" },
                { key: "-", value: "-" },
              ],
            },
            sn: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "2", value: "Capital" },
                { key: "1", value: "Revenue" },
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
        stockDetail: allData.stockDetail.map((dep) => {
          return {
            ...dep,
          };
        }),
      };

      console.log(postData);
      // Add validation logic here
      if (
        allData.stockHdr[0].stock_date == null ||
        allData.stockHdr[0].effect == null ||
        allData.stockHdr[0].trans_type == null ||
        allData.stockHdr[0].reason == null
      ) {
        message.error({
          content: "Please Fill The Mandatory Fields!!!",
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });
        setLoading(false);
        return; // Stop further execution if validation fails
      }

      // if (
      //   allData.reqDetail.some(
      //     (detail) =>
      //       detail.item_code == null ||
      //       detail.uom_code == null ||
      //       detail.size_code == null ||
      //       detail.quality_code == null ||
      //       detail.no_of_pcs == null ||
      //       detail.cost_code == null ||
      //       detail.remark == null ||
      //       detail.actual_bal == null ||
      //       detail.qty == null
      //   )
      // ) {
      //   message.error({
      //     content: "Please fill all fields in the Item Detail tab!!!",
      //     className: "custom-class",
      //     style: {
      //       marginTop: "1vh",
      //     },
      //   });
      //   setLoading(false);
      //   return; // Stop further execution if validation fails
      // }

      const allFieldsNull = allData.stockDetail.every(
        (detail) =>
          detail.item_code === null &&
          detail.uom_code === null &&
          detail.size_code === null &&
          detail.quality_code === null &&
          detail.pices === null &&
          detail.store_cd === null &&
          detail.rate === null &&
          detail.actual_bal === null &&
          detail.quantity === null
      );

      if (allFieldsNull) {
        message.error({
          content: "Please Fill At Least One Row In The Item Detail Tab!!!",
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });
        setLoading(false);
        return; // Stop further execution if all fields are null
      }

      // Check if any row in reqDetail has empty mandatory fields
      // const invalidRows = allData.reqDetail.filter((detail, index) => {
      //   const mandatoryFields = [
      //     "item_code",
      //     "size_code",
      //     "quality_code",
      //     "cost_code",
      //     "no_of_pcs",
      //     "qty",
      //     "uom_code",
      //   ];
      //   const missingFields = mandatoryFields.filter(
      //     (field) => detail[field] === null
      //   );
      //   if (missingFields.length > 0) {
      //     // Construct error message for this row
      //     const errorMessage = `Row ${
      //       index + 1
      //     }: Please Fill All Mandatory Fields (${missingFields.join(", ")})`;
      //     // Display error message
      //     message.error({
      //       content: errorMessage,
      //       className: "custom-class",
      //       style: {
      //         marginTop: "1vh",
      //       },
      //     });
      //     setLoading(false);
      //     return true;
      //   }

      //   return false;
      // });
      // Check if any row in reqDetail has empty mandatory fields

      ///////////////////////  work fine
      // const invalidRows = allData.reqDetail.filter((detail, index) => {
      //   const mandatoryFields = [
      //     "item_code",
      //     "size_code",
      //     "quality_code",
      //     "cost_code",
      //     "no_of_pcs",
      //     "qty",
      //     "uom_code",
      //   ];
      //   const missingFields = mandatoryFields.filter(
      //     (field) =>
      //       detail[field] === null ||
      //       detail[field] === undefined ||
      //       detail[field] === ""
      //   );
      //   if (missingFields.length > 0) {
      //     // Construct error message for this row
      //     const errorMessage = `Row ${
      //       index + 1
      //     }: Please Fill All Mandatory Fields (${missingFields.join(", ")})`;
      //     // Display error message
      //     message.error({
      //       content: errorMessage,
      //       className: "custom-class",
      //       style: {
      //         marginTop: "1vh",
      //       },
      //     });
      //     setLoading(false);
      //     return true;
      //   }
      //   return false;
      // });
      //////////////////////with level
      const fieldDisplayNameMap = {
        item_code: "Item",
        size_code: "Size",
        quality_code: "Grade",
        store_cd: "Store Name",
        pices: "Pcs",
        quantity: "Quantity",
        uom_code: "Uom",
      };

      const invalidRows = allData.stockDetail.filter((detail, index) => {
        const mandatoryFields = [
          "item_code",
          "size_code",
          "quality_code",
          "store_cd",
          "pices",
          "quantity",
          "uom_code",
        ];
        const missingFields = mandatoryFields.filter(
          (field) =>
            detail[field] === null ||
            detail[field] === undefined ||
            detail[field] === ""
        );
        if (missingFields.length > 0) {
          // Map field names to display names
          const displayNames = missingFields.map(
            (field) => fieldDisplayNameMap[field]
          );
          // Construct error message for this row
          const errorMessage = `Row ${
            index + 1
          }: Please Fill All Mandatory Fields (${displayNames.join(", ")})`;
          // Display error message
          message.error({
            content: errorMessage,
            className: "custom-class",
            style: {
              marginTop: "1vh",
            },
          });
          console.log(sizeRef.current.state);
          // console.log(document.getElementById("sizewala"));
          // const element = document.getElementById("sizewala");
          // if (element) {
          //   element.style.opacity = 1;
          //   element.style.border = "1px solid red";
          // }
          // Focus on the first empty mandatory field
          // switch (missingFields[0]) {
          //   // case "no_of_pcs":
          //   //   pcsRef.current.focus();
          //   //   break;
          //   case "size_code":
          //     sizeRef.current.focus();
          //     break;
          //   // Focus on other fields as needed
          //   default:
          //     break;
          // }
          setLoading(false);
          return true;
        }
        return false;
      });
      if (invalidRows.length > 0) {
        return; // Stop further execution if validation fails
      }

      // Move this line outside of the filter function

      axios
        .post(employeeData.URL + "/api/v1/stockadj", postData, {
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
              content: "Stock Adjustment Successfully!!!",
              className: "custom-class",
              style: {
                marginTop: "2vh",
              },
            });
            setLoading(false);
            history("/stock/transaction/stock-adj");
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
    history("/stock/transaction/stock-adj");
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
                    style={{
                      padding: "7px 30px 14px 24px",
                      borderRadius: "50px",
                      background: "transparent",
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      lineHeight: "1.5",
                      color: "#071e54",
                      WebkitAppearance: "none",

                      boxShadow:
                        "-3px -3px 6px #fff, 3px 3px 6px #bfc3cf, 3px 3px 6px #bfc3cf, -3px -3px 6px #fff", // Original box shadow
                      height: "40px",

                      // Ensure the button takes full width
                    }}
                    onClick={(event) => handleSave(event)}
                    className={classes["ProfileButtonn"]}
                    id="save"
                    onMouseOver={(event) => {
                      event.target.style.boxShadow = "0px 5px 15px 0px #264a9f"; // Apply spread color on hover with 0 spread at the top
                    }}
                    onMouseOut={(event) => {
                      event.target.style.boxShadow =
                        "-3px -3px 6px #fff, 3px 3px 6px #bfc3cf, 3px 3px 6px #bfc3cf, -3px -3px 6px #fff"; // Restore original shadow on mouse out
                    }}
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
                      padding: "7px 30px 14px 24px",
                      borderRadius: "50px",
                      background: "transparent",
                      width: "100%",
                      border: "none",
                      outline: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      lineHeight: "1.5",
                      color: "#071e54",
                      WebkitAppearance: "none",

                      boxShadow:
                        "-3px -3px 6px #fff, 3px 3px 6px #bfc3cf, 3px 3px 6px #bfc3cf, -3px -3px 6px #fff", // Original box shadow
                      height: "40px",

                      // Ensure the button takes full width
                    }}
                    onClick={(event) => handleCancel(event)}
                    onMouseOver={(event) => {
                      event.target.style.boxShadow = "0px 5px 15px 0px #264a9f"; // Apply spread color on hover with 0 spread at the top
                    }}
                    onMouseOut={(event) => {
                      event.target.style.boxShadow =
                        "-3px -3px 6px #fff, 3px 3px 6px #bfc3cf, 3px 3px 6px #bfc3cf, -3px -3px 6px #fff"; // Restore original shadow on mouse out
                    }}
                    className={classes["ProfileButtonn"]}
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
          <Col
            lg={24}
            md={24}
            className={classes["Col"]}
            // style={{ border: "2px solid red" }}
          >
            <div className={classes["EditView"]}>
              <Col
                style={{
                  // border: "2px solid red",
                  marginTop: "5px",
                  marginBottom: "-28px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#1677ff" }}>
                  Stock Adjustment
                </span>

                <BasicDetail
                  create={true}
                  ad={ad}
                  setData={setAllData}
                  data={allData.stockHdr[0]}
                  editMode={editMode}
                />
              </Col>
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
                      Item Details
                    </span>
                  }
                  key="0"
                  style={{
                    // border: "none !important",
                    // border: "2px solid black",
                    marginTop: "-16px",
                  }}
                >
                  <div
                    style={{
                      overflowX: "scroll",
                      // padding: "10px",
                      // border: "2px solid red",
                    }}
                  >
                    <SizeDetail
                      ad={ad}
                      setData={setAllData}
                      data={allData.stockDetail}
                      editMode={editMode}
                      editDode={editDode}
                      setEditDode={setEditDode}
                      sizeRef={sizeRef}
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

export default RequisitionNew;
