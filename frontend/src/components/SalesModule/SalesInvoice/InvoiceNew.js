import classes from "../Pages.module.css";
import { Row, Col, Tabs, Card, Skeleton, message } from "antd";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { useState, useEffect, useContext } from "react";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import SizeDetailWithOrder from "./SizeDetailWithOrder";
import TaxDetail from "./TaxDetail";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const identifiers = ["invoiceSize"];

const InvoiceNew = (props) => {
  const employeeData = useContext(DataContext);
  const history = useNavigate();
  const [dataFro, setDataFro] = useState(false);
  const [dataFromChild, setDataFromChild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [editDode, setEditDode] = useState(false);
  const [allData, setAllData] = useState({
    salesInvoice: [
      {
        invoice_type: null,
        dealtype_code: null,
        booking_date: null,
        dispatch_date: null,
        booking_no: null,
        tax_type: null,
        invoice_date: null,
        distributor_code: null,
        distributor_name: null,

        dealer_code: null,
        external_entity_code: null,
        truck_number: null,
        gross_wt: null,
        tare_wt: null,
        broker_code: null,
        net_wt: null,
        factory_weight: null,
        party_weight: null,
        grn_no: null,
        invoice_no: null,
        order_type: null,
        del_add: null,
        del_site_code: null,
        city_code: null,
        state_code: null,
        locality: null,
        voucher_code: null,
        eway_bill_date: null,
        eway_bill: null,
        ship_to_cd: null,
        trans_type: null,
      },
    ],

    invoiceSize: [
      {
        item_code: null,
        hsn: null,
        uom_for_items: null,
        size_code: null,
        quality: null,
        no_pcs: null,
        qty: null,
        booking_rate: null,
        discount_on: null,
        discount_amt: null,
        dis_type: null,
        bk_rate: null,
        itemqtyamount: null,
      },
    ],
    invoiceSizeWithOrder: [
      {
        amount: null,
        booking_code: null,
        dis_type: null,
        discount_on: null,
        discount_value: null,
        hsn: null,
        item_code: null,
        no_pcs: null,
        qty: null,
        quality: null,
        booking_rate: null,
        net_rate: null,
        discount_amt: null,
        size_code: null,
        unique_id: null,
        uom: null,
        tot_item_amount: null,
      },
    ],
    invoiceTax: [],
  });
  const [ad, setAD] = useState(null);

  useEffect(() => {
    setEditMode(true);
    setAD(null);
    setLoading(false);
    //  console.log(props,'props in invoice new')
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

  const handleChildData = (childData) => {
    // Do something with the data received from the child
    console.log("hi");
    console.log(childData);
    setDataFro("true");
    setDataFromChild(childData);
  };

  const handleSave = (event) => {
    console.log("ytu467676");

    console.log(identifiers);
    var formv = true;
    console.log(allData);
    console.log();
    console.log(allData.salesInvoice[0]);

    console.log(allData.salesInvoice[0].invoice_type == null);
    console.log(
      !(
        allData.salesInvoice[0].invoice_type &&
        allData.salesInvoice[0].invoice_date
      )
    );
    console.log(
      !(
        allData.salesInvoice[0].invoice_type &&
        allData.salesInvoice[0].invoice_date &&
        allData.salesInvoice[0].distributor_code
      )
    );
    // if(allData.salesInvoice[0].invoice_type==null || allData.salesInvoice[0].dealtype_code==null || allData.salesInvoice[0].invoice_date==null || allData.salesInvoice[0].distributor_code==null || allData.salesInvoice[0].dealer_code==null)
    //  var errorheader=data==undefined ? 'Empty Fields In ' + val.toUpperCase() + ' Tab!!!': data['qty']==null ? "quantity field should be field":null;
    //{

    if (
      allData.salesInvoice[0].trans_type == null &&
      allData.salesInvoice[0].invoice_type == null &&
      allData.salesInvoice[0].dealtype_code == null &&
      allData.salesInvoice[0].invoice_date == null &&
      allData.salesInvoice[0].distributor_code == null &&
      allData.salesInvoice[0].dealer_code == null
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
    } else if (allData.salesInvoice[0].trans_type == null) {
      // console.log("header feilds are empty");
      const element = document.getElementById("trans_type");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: "TRANSACTION TYPE can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.salesInvoice[0].invoice_type == null) {
      // console.log("header feilds are empty");
      const element = document.getElementById("invoice_type");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: "INVOICE TYPE can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      // document.getElementById("customer_nm").focus()
      // console.log("header feilds are empty");
      return;
    } else if (allData.salesInvoice[0].dealtype_code == null) {
      const element = document.getElementById("deal_type");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: "DEAL TYPE can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.salesInvoice[0].invoice_date == null) {
      const element = document.getElementById("invoice_date");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: " INVOICE DATE can not be null",
        className: "custom-class",

        style: {
          marginTop: "1vh",
        },
      });

      return;
    } else if (allData.salesInvoice[0].distributor_code == null) {
      const element = document.getElementById("customer_nm");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: "CUSTOMER NAME  can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.salesInvoice[0].del_add == null) {
      // console.log("header feilds are empty");
      const element = document.getElementById("del_add");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: "delivery address can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      // document.getElementById("customer_nm").focus()
      // console.log("header feilds are empty");
      return;
    } else if (allData.salesInvoice[0].dealer_code == null) {
      const element = document.getElementById("dealer_name");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: " DEALER NAME can not be null",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    } else if (allData.salesInvoice[0].gross_wt < allData.qty) {
      const element = document.getElementById("gross_weight");
      element.getElementsByTagName("input")[0].focus();
      message.error({
        content: " Gross Weight should not be less than Total Quantity",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
      return;
    }
    //     document.getElementById("qty").value = qty;
    //     let totalqty=document.getElementById("qty").value;

    //     const element=document.getElementById('gross_weight');
    //  let totalgross_weight=element.getElementsByTagName('input')[0].value

    //     console.log("manoj")
    //     if(totalgross_weight<qty){
    //         console.log("hello")
    //         message.error({
    //             content: 'Gross Weight should be less than Total Quantity',
    //             className: 'custom-class',
    //             style: {
    //                 marginTop: '1vh',
    //             },
    //         });
    //     }

    //     else if(totalgross_weight>qty){

    //     console.log("header feilds are empty");
    //     message.error({
    //         content: 'Empty Fields In Basic Details Tab!!!',
    //         className: 'custom-class',
    //         style: {
    //             marginTop: '1vh',
    //         },
    //     });

    //    return;
    // }

    //if(!(allData.salesInvoice[0].invoice_type  &&  allData.salesInvoice[0].invoice_date && allData.salesInvoice[0].distributor_code && allData.salesInvoice[0].dealer_code && allData.salesInvoice[0].truck_number) === false){
    if (allData.salesInvoice[0].booking_no === null) {
      identifiers.forEach((val) => {
        console.log(val);
        console.log(allData);
        // console.log(!(allData.salesInvoice[0].invoice_type  &&  allData.salesInvoice[0].invoice_date && allData.salesInvoice[0].distributor_code && allData.salesInvoice[0].dealer_code && allData.salesInvoice[0].truck_number) )

        console.log(allData[val]);

        let count = 0;
        allData[val].forEach((data) => {
          console.log(data);
          console.log(allData[val]);
          if (
            !data ||
            data["qty"] == null ||
            data["item_code"] == null ||
            data["size_code"] == null ||
            data["booking_rate"] == null ||
            data["quality"] == null
          ) {
            console.log(!data);
            formv = formv && false;
            console.log(formv && false);
            console.log((formv = formv && false));
            var error1 =
              data == undefined
                ? "ITEM can not be null"
                : data["qty"] == null
                ? "QTY can not be null"
                : data["item_code"] == null
                ? "ITEM can not be null"
                : data["size_code"] == null
                ? "SIZE can not be null"
                : data["booking_rate"] == null
                ? "RATE can not be null"
                : data["quality"] == null
                ? "GRADE can not be null"
                : null;
            // var error= data['qty']==null ? "quantity field should be field": data['item_code'] ==null ? "item code should not be null" : " InvoiceSize" ;
            //  if(count === 0){
            message.error({
              content: error1,
              className: "custom-class",
              style: {
                marginTop: "1vh",
              },
            });
            // }

            count = count + 1;
          }
        });
      });
    }

    // }
    if (formv) {
      setLoading(true);
      var postData = {
        ...allData,
      };

      console.log(postData);
      //  console.log('chargedata' in postData)

      if ("chargedata" in postData === false) {
        setLoading(false);

        message.error({
          content: "Please Calculate Tax in Tax Details tab!!!",
          className: "custom-class",
          style: {
            marginTop: "1vh",
          },
        });
        return;
      }

      if (postData.salesInvoice[0].booking_no === null) {
        axios
          .post(
            employeeData.URL + "/api/v1/salesInvoice/create-invoice",
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
                content: "SALES Invoice Created Successfully!!!",
                className: "custom-class",
                style: {
                  marginTop: "2vh",
                },
              });
              setLoading(false);
              history("/sales/transaction/salesInvoice");
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
      } else {
        axios
          .post(
            employeeData.URL +
              "/api/v1/salesInvoice/create-invoice-from-invoice",
            postData,
            {
              withCredentials: true,
              credentials: "include",
            }
          )

          .then((response) => {
            message.success({
              content: "SALES Invoice Created Successfully!!!",
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
      }
    }
  };

  const handleCancel = (event) => {
    setLoading(false);
    history("/sales/transaction/salesInvoice");
  };

  return (
    <>
      {ad ? (
        <Card
          bordered={false}
          style={{ background: "rgba(0, 0, 0, 0.12)" }}
          bodyStyle={{
            border: 0,
            padding: "1px",
          }}
        >
          <Row className={classes["RowP"]}>
            <Col
              lg={editMode ? 13 : 19}
              md={editMode ? 13 : 19}
              className={classes["Col"]}
            ></Col>
            {editMode ? (
              <>
                <Col md={3}>
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
                <Col md={3}>
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
            {/* <Col lg={1} md={1}></Col> */}
            <Col lg={24} md={24}>
              <BasicDetail
                create={true}
                ad={ad}
                setData={setAllData}
                data={allData.salesInvoice[0]}
                editMode={editMode}
                sendDataToParent={handleChildData}
              />
              {/* </Card> */}

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
                <Tabs
                  defaultActiveKey="0"
                  // style={{ height: "30%" }}
                  tabPosition="left"
                  type="line"
                  tabBarGutter="10"
                  id="tabs"
                >
                  <>
                    <TabPane tab={<span> Item Details</span>} key="0">
                      <div
                        style={{
                          overflowX: "scroll",
                          padding: "10px",
                          // border: "2px solid red",
                        }}
                      >
                        {/* <SizeDetailHeader create={true} /> */}

                        <SizeDetail
                          create={true}
                          ad={ad}
                          setData={setAllData}
                          data={allData.invoiceSize}
                          editMode={editMode}
                          editDode={editDode}
                          setEditDode={setEditDode}
                        />
                      </div>
                    </TabPane>

                    <TabPane tab={<span>Item Tax Details</span>} key="1">
                      <TaxDetail
                        create={true}
                        ad={ad}
                        setData={setAllData}
                        editMode={editMode}
                      />
                    </TabPane>
                  </>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Card>
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

export default InvoiceNew;
