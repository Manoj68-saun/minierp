import classes from "../Pages.module.css";
import { Row, Col, Tabs, Skeleton, Card, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import SizeDetailHeader from "./SizeDetailHeader";
import TaxDetail from "./TaxDetail";
import dayjs from "dayjs";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";
import { EditingState } from "@devexpress/dx-react-grid";
import { useParams } from "react-router-dom";
const { TabPane } = Tabs;

const SalesView = (props) => {
  const { id } = useParams();
  const employeeData = useContext(DataContext);

  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDode, setEditDode] = useState(false);
  const [allData, setAllData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [ad, setAD] = useState(null);
  const [qty, setQty] = useState(0);
  const [amt, setAmt] = useState(0);
  const [distributorr, setDistributorr] = useState(null);
  const [setcustomerss, setCustomerss] = useState(null);
  const [itemm, setItemm] = useState(null);
  const [responseDataArray, setResponseDataArray] = useState([]);
  useEffect(() => {
    setAllData(null);
    setStoreData(null);
    setAD(null);

    axios
      .get(employeeData.URL + "/api/v1/salesInvoice/" + id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setItemm(response.data.data);
        const distributorCode = setDistributorr(
          response.data.data.salesInvoice[0].distributor_code
        );
        var amt = 0;
        for (var t = 0; t < response.data.data.invoiceSize.length; t++) {
          setAmt(
            (amt += parseInt(response.data.data.invoiceSize[t].itemqtyamount))
          );
        }
        //     console.log(amt)
        //     setTimeout(() => {
        //         document.getElementById("amt").value = amt;
        //     }, 2000);

        //  var qty = 0;
        for (var t = 0; t < response.data.data.invoiceSize.length; t++) {
          setQty(qty + parseInt(response.data.data.invoiceSize[t].qty));
        }
        //  console.log(qty)
        //  setTimeout(() => {
        // document.getElementById("qty").value = qty;
        //     }, 2000);
        //let totalqty=document.getElementById("qty").value;
        // document.getElementById("qty").value = 100;
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
      .get(employeeData.URL + "/api/v1/salesInvoice/additional-data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAD((ad) => {
          let newad = response.data.data;
          return {
            ...newad,
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
            INVOICE_TYPE: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "wo", value: "withorder" },
                { key: "wut", value: "withoutorder" },
              ],
            },
            TRANS_TYPE: {
              fields: [{ name: "key" }, { name: "value" }],
              rows: [
                { key: "s", value: "sales" },
                { key: "p", value: "purchase" },
              ],
            },
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (distributorr !== null) {
      axios
        .get(
          employeeData.URL +
            "/api/v1/salesInvoice/additional-data-of-customer/" +
            distributorr,
          {
            withCredentials: true,
          }
        )
        .then((secondResponse) => {
          console.log(secondResponse);
          const customer = secondResponse.data.data.customer.rows; // Replace with the actual response structure
          setCustomerss(customer);
        })
        .catch((additionalError) => {
          console.log("Additional API Error", additionalError);
        });
    }

    // Rest of your code...
  }, [distributorr, id]);

  useEffect(() => {
    const fetchData = async (item) => {
      try {
        console.log(item.item_code);
        const response = await axios.get(
          `${employeeData.URL}/api/v1/salesInvoice/additional-data-of-hsn/${item.item_code}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.data);
        const data = response.data.data;
        setResponseDataArray((prevDataArray) => [...prevDataArray, data]);
        // console.log(data); // Do something with the data
      } catch (error) {
        console.error(
          `Error fetching data for item_code ${item.item_code}:`,
          error
        );
      }
    };

    const fetchAllData = async () => {
      if (itemm && itemm.invoiceSize) {
        // Check if itemm and invoiceSize are not null
        // Use Promise.all to execute all asynchronous functions concurrently
        await Promise.all(itemm.invoiceSize.map((item) => fetchData(item)));
      } else {
        console.error("itemm or itemm.invoiceSize is null or undefined", itemm);
      }
    };

    // Call the function to fetch data for all items in the array
    fetchAllData();
  }, [itemm, setResponseDataArray]);

  // Log the data after responseDataArray has been updated
  useEffect(() => {
    console.log(responseDataArray);
  }, [responseDataArray]);

  const handleEditButtonClick = () => {
    setEditMode(true);
    setEditDode(true);
  };
  const handleSave = (event) => {
    const postData = {
      ...allData,
    };

    const postDataS = {
      ...storeData,
      invoiceSize: storeData.invoiceSize.map((dep) => {
        return {
          ...dep,
        };
      }),
    };

    console.log(postData);
    console.log(postDataS);
    console.log(allData);

    postData.invoiceSize.forEach((lang, index) => {
      if (!lang.uniq_code) {
        postData.invoiceSize[index] = {
          ...lang,
          PARAM: "INSERT",
        };
      } else {
        postData.invoiceSize[index] = {
          ...lang,
          PARAM: "UPDATE",
        };
      }
    });

    postDataS.invoiceSize.forEach((lang, index) => {
      const dataIndex = postData.invoiceSize.findIndex(
        (element) => element.uniq_code === lang.uniq_code
      );
      if (dataIndex === -1) {
        postData.invoiceSize.push({
          uniq_code: lang.uniq_code,
          PARAM: "DELETE",
        });
      }
    });

    console.log(JSON.stringify(postData, undefined, 2));

    axios
      .patch(
        employeeData.URL +
          "/api/v1/salesInvoice/" +
          postData.salesInvoice[0]["invoice_no"],
        postData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        message.success({
          content: "Sales Invoice Updated Successfully!!!",
          className: "custom-class",
          style: {
            marginTop: "2vh",
          },
        });
        setLoading(false);
        history("/sales/transaction/salesInvoice");
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
    history("/sales/transaction/salesInvoice");
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
                onClick={handleEditButtonClick}
                className={classes["ProfileButton"]}
              >
                Edit Details
              </button>
            </Col>
          )}
          <Col lg={1} md={1}></Col>
          <Col lg={24} md={24} className={classes["Col"]}>
            <Card
              title="Basic Detail"
              bordered={false}
              style={{ background: "rgb(217, 217, 217, 0.35)" }}
            >
              <BasicDetail
                create={true}
                ad={ad}
                setData={setAllData}
                data={allData.salesInvoice[0]}
                editMode={editMode}
                customer={setcustomerss}
                editDode={editDode}
              />
            </Card>
            {editMode ? (
              <div
                id="net_amount_box"
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  color: "#1777C4",
                  fontWeight: "bold",
                }}
              >
                {" "}
                Net Amount:&nbsp;{" "}
                <input
                  type="text"
                  id="net_amount"
                  style={{ border: "0.1px solid #999999" }}
                />{" "}
              </div>
            ) : null}
            <div style={{ overflowX: "scroll", padding: "10px" }}>
              {/* {editMode ? <SizeDetailHeader create={true} /> : null} */}
              <Tabs
                defaultActiveKey="0"
                centered
                style={{ height: "30%" }}
                tabPosition="top left"
                type="card"
                tabBarGutter="10"
              >
                <TabPane tab={<span> Invoice Details</span>} key="0">
                  <SizeDetail
                    qty={qty}
                    qty1={setQty}
                    amt1={setAmt}
                    amt={amt}
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.invoiceSize}
                    editMode={editMode}
                    editDode={editDode}
                    setEditDode={setEditDode}
                    responseDataArray={responseDataArray}
                  />
                  {/* <div style={{ padding: "5px",backgroundColor: "white", color: "#1777C4", fontWeight: "bold"}}>  Qty: <input type="text" id="net_amount"/>  </div> */}
                  {/* {editMode ? 
                    
                    (
                      <table
                        id="table_ord"
                        style={{ tableLayout: "fixed", width: "1540px" }}
                      >
                        <tr>
                          <div id="container">
                            Total: &nbsp;{" "}
                            <input
                              type="text"
                              id="qty"
                              value={qty ? qty : 100}
                              style={{
                                width: "9%",
                                color: "#1777C4",
                                border: "0.1px solid #999999",
                              }}
                            />{" "}
                            <input
                              type="text"
                              id="amt"
                              style={{
                                width: "11%",
                                float: "right",
                                border: "0.1px solid #999999",
                              }}
                            />
                          </div>
                        </tr>
                      </table>
                    ) : null} */}
                </TabPane>
                {/* <TabPane tab= {<span>Invoice Size Details</span>} key="1">
                                <SizeDetail create = {true} ad = {ad} setData = {setAllData} data = {allData.invoiceSize} editMode = {editMode} />
                                </TabPane>  */}
                <TabPane tab={<span>Invoice Tax Details</span>} key="1">
                  <TaxDetail
                    create={true}
                    ad={ad}
                    setData={setAllData}
                    data={allData.invoiceTaxChargeDetail}
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

export default SalesView;
