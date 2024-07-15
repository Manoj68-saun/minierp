import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext, useRef } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import Consum from "./Consumption";
import Elect from "./Electricity";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const identifiers = ["prodDetail", "prodConsumDet", "prodElecDet"];

const RequisitionNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editDode, setEditDode] = useState(false);
  const sizeRef = useRef(null);
  const [allData, setAllData] = useState({
    prodHdr: [
      {
        stock_date: dayjs(new Date()).format("DD-MM-YYYY"),
        from_time: dayjs(new Date()).format("DD-MM-YYYY HH:mm:ss"),
        to_time: dayjs(new Date()).format("DD-MM-YYYY HH:mm:ss"),
        no_of_hrs: null,
      },
    ],
    // dayjs(new Date()).format("HH:mm:ss")
    prodDetail: [
      {
        item_code: null,
        uom_code: null,
        size_code: null,
        quality_code: null,
        no_of_picces: null,
        quantity: null,
        rate: null,
      },
    ],
    prodConsumDet: [
      {
        item_code: null,
        uom_code: null,
        size_code: null,
        quality_code: null,
        no_of_picces: null,
        quantity: null,
        rate: null,
      },
    ],
    prodElecDet: [
      {
        meter_no: null,
        rate_unit: null,
        reading: null,
        current_reading: null,
        pmt_unit: null,
      },
    ],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);
    axios
      .get(employeeData.URL + "/api/v1/dailyprod/additional-data", {
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
        prodDetail: allData.prodDetail.map((dep) => {
          return {
            ...dep,
          };
        }),
        prodConsumDet: allData.prodConsumDet.map((dep) => {
          return {
            ...dep,
          };
        }),
        prodElecDet: allData.prodElecDet.map((dep) => {
          return {
            ...dep,
          };
        }),
      };

      console.log(postData);
      // Add validation logic here
      if (
        allData.prodHdr[0].stock_date == null ||
        allData.prodHdr[0].from_time == null ||
        allData.prodHdr[0].to_time == null ||
        allData.prodHdr[0].no_of_hrs == null
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

      const allFieldsNull = allData.prodDetail.every(
        (detail) =>
          detail.item_code === null &&
          detail.uom_code === null &&
          detail.size_code === null &&
          detail.quality_code === null &&
          detail.no_of_picces === null &&
          detail.quantity === null &&
          detail.rate === null
      );

      if (allFieldsNull) {
        message.error({
          content:
            "Please Fill At Least One Row In The Production Detail Tab!!!",
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });
        setLoading(false);
        return; // Stop further execution if all fields are null
      }

      const fieldDisplayNameMap = {
        item_code: "Item",
        size_code: "Size",
        quality_code: "Grade",

        no_of_picces: "Pcs",
        quantity: "Quantity",
        uom_code: "Uom",
        rate: "Rate",
      };

      const invalidRows = allData.prodDetail.filter((detail, index) => {
        const mandatoryFields = [
          "item_code",
          "size_code",
          "quality_code",
          "rate",
          "no_of_picces",
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

          setLoading(false);
          return true;
        }
        return false;
      });
      if (invalidRows.length > 0) {
        return; // Stop further execution if validation fails
      }

      const allFieldsNullConsum = allData.prodConsumDet.every(
        (detail) =>
          detail.item_code === null &&
          detail.uom_code === null &&
          detail.size_code === null &&
          detail.quality_code === null &&
          detail.no_of_picces === null &&
          detail.quantity === null &&
          detail.rate === null
      );

      if (allFieldsNullConsum) {
        message.error({
          content:
            "Please Fill At Least One Row In the Consumption Details Tab!!!",
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });
        setLoading(false);
        return; // Stop further execution if all fields are null
      }

      const invalidRowsConsum = allData.prodConsumDet.filter(
        (detail, index) => {
          const mandatoryFields = [
            "item_code",
            "uom_code",
            "size_code",
            "quality_code",
            "no_of_picces",
            "quantity",
            "rate",
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

            setLoading(false);
            return true;
          }
          return false;
        }
      );
      if (invalidRowsConsum.length > 0) {
        return; // Stop further execution if validation fails
      }
      const allFieldsNullElec = allData.prodElecDet.every(
        (detail) =>
          detail.meter_no === null &&
          detail.rate_unit === null &&
          detail.reading === null &&
          detail.current_reading === null &&
          detail.pmt_unit === null
      );

      if (allFieldsNullElec) {
        message.error({
          content:
            "Please Fill At Least One Row In the Electricity Consumption Details Tab!!!",
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });
        setLoading(false);
        return; // Stop further execution if all fields are null
      }

      const invalidRowsElec = allData.prodElecDet.filter((detail, index) => {
        const mandatoryFields = [
          "meter_no",
          "rate_unit",
          "reading",
          "current_reading",
          "pmt_unit",
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

          setLoading(false);
          return true;
        }
        return false;
      });
      if (invalidRowsElec.length > 0) {
        return; // Stop further execution if validation fails
      }

      // Move this line outside of the filter function

      axios
        .post(employeeData.URL + "/api/v1/dailyprod", postData, {
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
              content: "Daily Prod Successfully!!!",
              className: "custom-class",
              style: {
                marginTop: "2vh",
              },
            });
            setLoading(false);
            history("/stock/transaction/daily-prod");
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
    history("/stock/transaction/daily-prod");
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
                  marginTop: "20px",
                  marginBottom: "-5px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#1677ff" }}>
                  Daily Production(Rolling)
                </span>

                <BasicDetail
                  create={true}
                  ad={ad}
                  setData={setAllData}
                  data={allData.prodHdr[0]}
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
                      Daily Production Details
                    </span>
                  }
                  key="0"
                  style={{
                    // border: "none !important",
                    // border: "2px solid black",
                    marginTop: "-16px", // Adjust the value as needed
                    marginBottom: "16px", // Adjust the value as needed
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
                      data={allData.prodDetail}
                      editMode={editMode}
                      editDode={editDode}
                      setEditDode={setEditDode}
                      sizeRef={sizeRef}
                    />
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span style={{ fontWeight: "bold", color: "000000" }}>
                      Consumption Details
                    </span>
                  }
                  key="1"
                  style={{
                    // border: "none !important",
                    // border: "2px solid black",
                    marginTop: "-16px", // Adjust the value as needed
                    marginBottom: "16px", // Adjust the value as needed,
                  }}
                >
                  <div
                    style={{
                      overflowX: "scroll",
                      // padding: "10px",
                      // border: "2px solid red",
                    }}
                  >
                    <Consum
                      ad={ad}
                      setData={setAllData}
                      data={allData.prodConsumDet}
                      editMode={editMode}
                      editDode={editDode}
                      setEditDode={setEditDode}
                      sizeRef={sizeRef}
                    />
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span style={{ fontWeight: "bold", color: "000000" }}>
                      Electricity Con Details
                    </span>
                  }
                  key="2"
                  style={{
                    // border: "none !important",
                    // border: "2px solid black",
                    marginTop: "-16px", // Adjust the value as needed
                    marginBottom: "16px", // Adjust the value as needed
                  }}
                >
                  <div
                    style={{
                      overflowX: "scroll",
                      // padding: "10px",
                      // border: "2px solid red",
                    }}
                  >
                    <Elect
                      ad={ad}
                      setData={setAllData}
                      data={allData.prodElecDet}
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
