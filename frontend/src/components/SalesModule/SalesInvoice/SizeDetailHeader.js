import { Tabs } from "antd";
import { RiUserSearchFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import classes from "../Pages.module.css";
import DataField from "./DataField";
import SizeDetail from "./SizeDetail";
import Dialog from "@mui/material/Dialog";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import DataContext from "../../../Context/dataContext";
import { AiFillDelete } from "react-icons/ai";
import { Row, Col, Skeleton, Tooltip, message } from "antd";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import SizeDetailWithOrder from "./SizeDetailWithOrder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SizeDetailNew from "./SizeDetailNew";
const { TabPane } = Tabs;

const BasicDetail = (props) => {
  console.log(props, "props in BasicDetail");
  const employeeData = useContext(DataContext);
  // console.log(employeeData.Year)
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);

  const [rowsedi, setRowsedi] = useState(null);
  const [columnsedi, setColumnsedi] = useState([]);
  const [drows, setDRows] = useState(null);
  // const [message, setMessage] = useState(null)
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [dRow, setDRow] = useState(null);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [b, setB] = useState(null); //  b is customer_code pass when add item button click for withorder
  const [c, setC] = useState(null); //  c is booking_code pass when add item button click for withorder
  const [columnscust, setColumnscust] = useState(null);
  const [rowscust, setRowscust] = useState(null);
  const [childData, setChildData] = useState(false);
  const [allData, setAllData] = useState(null);
  const [ad, setAD] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [addres, setAddres] = useState(null);
  const [customer, setCoutomer] = useState(false);
  const [dealer, setDealer] = useState(false);
  const [addItemClicked, setAddItemClicked] = useState(false);
  const [manoj, setManoj] = useState(null);
  const [dinesh, setDinesh] = useState(false);
  //console.log(currentRow)
  //// WEIGHT AND TARE WEIGHT CALCULATION LINE 253 TO 273//DELETE IN EDITABLE TABLE LINE 400 TO 449// ADD ITEM IN EDITABLE TABLE LINE NO 67 TO 234
  ////FOR HIDE AND SHOW FEILD LINE 650 TO 589///// PRICE COLUMN CALCULATION IN EDITABLE TABLE LINE 634 TO 692
  ////editable table when when we select order no from the header dioluge box line 456 to 457
  //WHEN WE SELECT  THE INVOICE TYPE WITH ORDER AND CLICK ON BOOKING NO IN HEADER TABLE LINE 173 TO 234

  //// THIS IS FOR WHEN WE ADD ITEM IN EDITABLE TABLE LINE NO 67 TO 234

  const handleDialog1Open = () => {
    setOpenDialog1(true);
    console.log(allData, "fdddddddddd");
    setAddItemClicked(false);

    axios
      .get(
        `http://localhost:8002` +
          `/api/v1/salesOrder/customer-order-for-invoice/${b}?c=${c}`,

        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        setColumnscust((columns) => {
          let newCols = response.data.data.order1.fields.map((col) => {
            return {
              name: col.name,
              title: col.name.split("_").join(" "),
              editable: true,
            };
          });

          const newNewCols = [
            { name: "SNO", title: "SNo" },
            { name: "Select", title: "Select" },
            ...newCols,
          ];
          console.log(newNewCols);
          return newNewCols;
        });
        const deleteHandler = async (event, index, code) => {
          console.log(index);
          console.log(code);

          await axios
            .get(
              "http://localhost:8002" +
                "/api/v1/salesOrder/customer-order/" +
                code,
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log(response);

              // document.getElementById("table_order").style.display = "none";
              setAllData((allData) => {
                let newDetails = response.data.data.data;
                let mergedData = {
                  ...allData,
                  invoiceSizeWithOrder: [
                    ...(allData.invoiceSizeWithOrder || []), // Existing array (or empty array if undefined)
                    ...(newDetails.invoiceSizeWithOrder || []), // New array
                  ],
                };

                // Log the merged data
                console.log("Merged Data:", mergedData);
                // setAddItemClicked((prevValue) => {
                //   console.log(addItemClicked);
                //   return true; // Set the new value for addItemClicked
                // });

                return mergedData;
              });
            })
            .then(() => {
              handleDialog1Close();
            });
        };

        setRowscust((rows) => {
          let newRows = response.data.data.order1.rows.map((row, index) => {
            return {
              SNO: index + 1,
              Select: (
                <Tooltip
                  placement="bottom"
                  title="Select Order Here"
                  color="#1777C4"
                >
                  <Link
                    to={"/sales/transaction/invoice-create"}
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <BsFillArrowRightSquareFill
                      onClick={(event) =>
                        deleteHandler(event, index, row["unique_id"])
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                        id: "hhh",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              ...row,
            };
          });
          return newRows;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDialog1Close = () => {
    setOpenDialog1(false);
    setAddItemClicked((prevValue) => {
      console.log("Previous Value:", prevValue);
      const newValue = true;
      console.log("New Value:", newValue);
      return newValue; // Set the new value for addItemClicked
    });
  };
  //////
  // This effect will be triggered whenever 'allData' changes

  /// THIS IS FOR  THE TABLE  WHEN WE SELECT  THE INVOICE TYPE WITH ORDER AND CLICK ON BOOKING NO IN HEADER TABLE LINE 173 TO 234
  useEffect(() => {
    setDRows(null);
    setRows(null);
    setColumns([]);
    console.log("useEffect open is true");
    axios
      .get("http://localhost:8002" + "/api/v1/salesOrder", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setColumns((columns) => {
          let newCols = response.data.data.order.fields.map((col) => {
            return {
              name: col.name,
              title: col.name.split("_").join(" ").toLowerCase(),
              editable: true,
            };
          });

          const newNewCols = [
            { name: "SNO", title: "SNo" },
            { name: "Select", title: "Select" },
            ...newCols,
          ];
          console.log(newNewCols);
          return newNewCols;
        });
        const deleteHandler = (event, index, code) => {
          console.log(index);
          console.log(code);
          setAllData(null);
          handleSChangei(code);
          handleClose();
          axios
            .get(
              "http://localhost:8002" +
                "/api/v1/salesOrder/additional-data/" +
                code,
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              console.log(response);
            });
        };

        setRows((rows) => {
          let newRows = response.data.data.order.rows.map((row, index) => {
            return {
              SNO: index + 1,
              Select: (
                <Tooltip
                  placement="bottom"
                  title="Select Order Here"
                  color="#1777C4"
                >
                  <Link
                    to={"/sales/transaction/invoice-create"}
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <BsFillArrowRightSquareFill
                      onClick={(event) =>
                        deleteHandler(event, index, row["booking_code"])
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                        id: "hhh",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              ...row,
            };
          });
          return newRows;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [open === true]);

  const HandleSChangeLov = () => {
    console.log(props.data.invoice_type);
    if (props.data.invoice_type === "wo") {
      setOpen(true);
      console.log("manoj");
    } else {
      setOpen(false);
      const element = document.getElementById("invoice_type");
      element.getElementsByTagName("input")[0].focus();
      message.warning({
        content: "please select invoice type as work order",
        className: "custom-class",
        style: {
          marginTop: "1vh",
        },
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["salesInvoice"]];
      console.log(data);

      //    props.data['salesInvoice'][0]['net_wt'] = data['salesInvoice'][0]['gross_wt'] - data['salesInvoice'][0]['tare_wt']

      newdata[0][param] = e.target.value;

      console.log(newdata);
      return {
        ...data,
        salesInvoice: newdata,
      };
    });
  };

  ////   THIS IS FOR  THE TABLE  WHEN WE SELECT  THE INVOICE TYPE in headr and autofill the customer,dealer of that order in invoice 298 TO 381
  const handleSChangei = (e, param) => {
    setCurrentRow(null);
    props.setData((data) => {
      const newdata = [...data["salesInvoice"]];
      console.log(data);
      console.log(newdata);
      newdata[0][param] = e;
      console.log(props.data.distributor_code);
      setAllData(null);
      // setCurrentRow(null)
      Edittable(e);
      console.log(data.salesInvoice[0].booking_no);
      axios
        .get(employeeData.URL + "/api/v1/salesOrder/additional-data/" + e, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setDealer(true);
          setAllData((allData) => {
            let newDetails = response.data.data;
            return {
              ...newDetails,
            };
          });
          props.setData((prevData) => {
            const newDetails = response.data.data;

            return {
              ...prevData,
              invoiceSizeWithOrder: newDetails, // Set response.data.data in invoiceSizeWithOrder
            };
          });

          console.log(props.data.distributor_code);
          const res = response.data.order1.rows[0].distributor_code;
          props.data.booking_no = response.data.order1.rows[0].booking_code;
          setC(props.data.booking_no);
          props.data.distributor_code =
            response.data.order1.rows[0].distributor_code;
          setB(props.data.distributor_code);
          props.data.dealer_code = response.data.order1.rows[0].dealer_name;
          props.data.order_type = response.data.order1.rows[0].order_type;
          props.data.del_add = response.data.order1.rows[0].del_site_code;
          console.log(res);

          setDRows(null);
          setRows(null);
          setColumns([]);
        });

      console.log(newdata);
      console.log(allData);
      return {
        ...data,
      };
    });
  };

  useEffect(() => {
    // setEditMode(true);
    setAD(null);
    // setLoading(false);
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
  /// THIS IS FOR DELETE IN EDITABLE TABLE LINE 400 TO 449
  useEffect(() => {
    // This effect will run whenever allData changes
    if (allData) {
      // Additional logic to perform after allData is set
      handleDialog1Close();
      console.log("mododod");
    }
  }, [allData]);
  ////  this is for the editable table when when we select order no from the header dioluge box line 456 to 457
  const Edittable = (e) => {
    console.log(e);
    console.log(allData);
    // const rowsedi1=setRowsedi()
    // console.log(rowsedi1)
    axios
      .get(employeeData.URL + "/api/v1/salesOrder/additional-data/" + e, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setAllData(null);
        setAllData((allData) => {
          let newDetails = response.data.data;
          return {
            ...newDetails,
          };
        });
        console.log(allData);
      });
  };

  const handleClick = () => {
    setChildData("true");
    props.sendDataToParent(childData);
  };
  // THIS IS FOR HIDE AND SHOW FEILD LINE 650 TO 589
  const handleSChange = (val, param) => {
    console.log(param);
    console.log("IIIIIIIIIIIIIIIIIII", val);
    //     console.log(props.data.distributor_code)
    if (param == "invoice_type") {
      if (val == "wut") {
        document.getElementById("booking_no").style.display = "none";
        document.getElementById("table_order").style.display = "block";
        document.getElementById("filter_form").style.display = "block";
      } else {
        handleClick();
        document.getElementById("booking_no").style.display = "block";
        document.getElementById("table_order").style.display = "none";
        document.getElementById("filter_form").style.display = "none";
        document.getElementById("net_amount_box").style.display = "none";
        document.getElementById("table_ord").style.display = "none";
      }
    }
    //     if (param=='distributor_code'){
    //         console.log(props)
    //         const dis=props['data']
    //         console.log(dis)
    //         console.log(dis['distributor_code'])
    //         axios.get(employeeData.URL + '/api/v1/salesInvoice/additional-data-of-cust/ '+ props.data.distributor_code, {
    //             withCredentials: true
    //         })

    //         .then((response) => {

    //             console.log(response);

    //              var res = response.data.data.custdetail.rows[0].del_add
    //             // var res1=response.data.data.hsn1.rows[0].uom_nm
    //             console.log("bbdbdbcdcbdcc", res)

    // //console.log(allValues.invoiceSize)

    //        })

    //    }
    if (param === "dealer_code") {
      setSelectedDealer(val);

      // Make API call to fetch customer list based on dealer_code
      axios
        .get(
          employeeData.URL +
            "/api/v1/salesInvoice/additional-data-of-customer/" +
            val,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          const customer = response.data.data.customer.rows; // Replace with the actual response structure
          setCustomers(customer);
          // Update state with the new customer list
        })
        .catch((error) => {
          console.error("Error fetching customer list:", error);
        });
    }

    ///////////////////////
    if (param === "distributor_code" && !selectedDealer && val !== null) {
      // Show a message or handle the condition as needed
      // For this example, an Alert component is used to display a message
      // Adjust this based on your UI/UX design requirements
      console.log("Please select DEALER NAME first.");
      return;
    }

    props.setData((data) => {
      console.log(data);
      const newdata = [...data["salesInvoice"]];
      console.log(val);
      if (param == "distributor_code") {
        console.log(props);
        const dis = props["data"];
        console.log(dis);
        console.log(dis["distributor_code"]);
        axios
          .get(
            employeeData.URL +
              "/api/v1/salesInvoice/additional-data-of-cust/ " +
              val,
            {
              withCredentials: true,
            }
          )

          .then((response) => {
            console.log(response);

            const add = response.data.data.custdetail.rows;
            setAddres(add);
            // var res1=response.data.data.hsn1.rows[0].uom_nm
            //  console.log("bbdbdbcdcbdcc", res)
            props.setData((data) => {
              console.log(data);
              const newdata = [...data["salesInvoice"]];
              newdata[0][param] = val;
              return {
                ...data,
                salesInvoice: newdata,
              };
            });
          });
      }
      newdata[0][param] = val;
      return {
        ...data,
        salesInvoice: newdata,
        invoiceSizeWithOrder: allData,
      };
    });
  };

  const handleSelectClick = (value, param) => {
    console.log("hi how are you");
    console.log(param);
    console.log(value);
    console.log(selectedDealer);
    console.log(param === "distributor_code" && !selectedDealer);
    // Check if the user is trying to select "CUSTOMER NAME" without selecting the dealer first
    if (param === "distributor_code" && !selectedDealer) {
      // Show a message or handle the condition as needed
      // For this example, an Alert component is used to display a message
      console.log("Please select DEALER NAME first.");
      message.error("Please select DEALER NAME first.");
      return;
    }

    // Perform additional actions as needed
    // ...

    // Call the original handleChange function to handle the click
    // props.handleChange(props.value, props.param);
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["salesInvoice"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        salesInvoice: newdata,
      };
    });
  };

  const handleChangegross = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["salesInvoice"]];
      console.log(data);
      newdata[0][param] = e.target.value;
      props.data.net_wt =
        data.salesInvoice[0].gross_wt - data.salesInvoice[0].tare_wt;

      //    props.data['salesInvoice'][0]['net_wt'] = data['salesInvoice'][0]['gross_wt'] - data['salesInvoice'][0]['tare_wt']

      console.log(newdata);
      return {
        ...data,
        salesInvoice: newdata,
      };
    });
  };
  return (
    <div>
      <p></p>
      <Row className={props.editMode ? classes["RowDEX"] : classes["RowD"]}>
        {!props.create && (
          <DataField
            editMode={props.editMode}
            lg={12}
            md={24}
            handleChange={handleChange}
            type="Input"
            name="INVOICE CODE"
            param="invoice_no"
            value={props.data.invoice_no}
          />
        )}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "BOOKING DATE" type="Date" param = "booking_date" value = {props.data.booking_date}/>     */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "PLANNING DATE" type="Date" param = "dispatch_date" value = {props.data.dispatch_date}/>    */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChangei}  options = {props.ad.BOOKING_NO} type = "Select" name = "BOOKING DESC" param = "booking_no" value = {props.data.booking_no}/>  */}
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.TRANS_TYPE}
          type="Select"
          id="trans_type"
          name="TRANS TYPE"
          required="True"
          param="trans_type"
          value={props.data.trans_type}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.INVOICE_TYPE}
          id="invoice_type"
          type="Select"
          param="invoice_type"
          name="INVOICE TYPE"
          required="True"
          value={props.data.invoice_type}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChangebok={HandleSChangeLov}
          id="booking_no"
          name="BOOKING NO"
          param="booking_no"
          value={props.data.booking_no}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEALTYPE_CODE}
          type="Select"
          id="deal_type"
          name="DEAL TYPE"
          param="dealtype_code"
          required="True"
          value={props.data.dealtype_code}
        />
        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleDChange}
          name="INVOICE DATE"
          type="Date"
          id="invoice_date"
          param="invoice_date"
          required="True"
          value={props.data.invoice_date}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEALER_CODE}
          type="Select"
          id="dealer_name"
          name="DEALER NAME"
          param="dealer_code"
          required="True"
          value={props.data.dealer_code}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          // options={customers}
          options1={props.ad.DISTRIBUTOR_CODE}
          type="Select"
          id="customer_nm"
          name="CUSTOMER NAME"
          required="True"
          param="distributor_code"
          value={props.data.distributor_code}
          customers={customers}
          handleSelectClick={handleSelectClick}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.BROKER_CODE} type = "Select" name = "BROKER NAME" param = "broker_code" value = {props.data.broker_code}/>  */}

        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleSChange}
          options1={props.ad.DEL_ADD}
          type="Select"
          id="del_add"
          name="DELIVERY ADD"
          param="del_add"
          required="True"
          value={props.data.del_add}
          addres={addres}
        />
        {/* <DataField editMode = {props.editMode} lg = {8} md = {24} handleChange = {handleChange} type = "Input" text_align="left" name = "DELIVERY ADD" param = "del_add" value = {props.data.del_add}/> */}
        <DataField
          editMode={props.editMode}
          lg={3}
          md={24}
          handleChange={handleChange}
          type="Input"
          name="TRUCK NO"
          text_align="left"
          param="truck_no"
          value={props.data.truck_no}
        />
        <DataField
          editMode={props.editMode}
          lg={3}
          md={24}
          handleChange={handleChangegross}
          type="Input"
          name="TARE WEIGHT"
          param="tare_wt"
          value={props.data.tare_wt}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleChangegross}
          type="Input"
          id="gross_weight"
          name="GROSS WEIGHT"
          param="gross_wt"
          value={props.data.gross_wt}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleChange}
          id="net_weight"
          type="Input"
          name="NET WEIGHT"
          param="net_wt"
          value={props.data.net_wt}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange}type = "Input" name = "NET WEIGHT" param = "net_wt" value = {props.data.net_wt}/>   */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange}type = "Input" name = "FACTORY WEIGHT" param = "factory_weight" value = {props.data.factory_weight}/>   */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} type = "Input" name = "PARTY WEIGHT" param = "party_weight" value = {props.data.party_weight}/>    */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} type = "Input"  name = "REF INVOICE NO" type1="str1"  param = "grn_no" value = {props.data.grn_no}/> */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} type = "Input" name = "ORDER TYPE" type1="str"  param = "order_type" value = {props.data.order_type}/>  */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} type = "Input" name = "CITY" param = "city_code" value = {props.data.city_code}/>   */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} type = "Input" name = "STATE" param = "state_code" value = {props.data.state_code}/>  
                <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} type = "Input" name = "LOCALITY" param = "locality" value = {props.data.locality}/>   */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange}type = "Input" name = "VOUCHER CODE" type1="str"  param = "voucher_code" value = {props.data.voucher_code}/>  */}
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleDChange}
          name="EWAY BILL DATE DATE"
          type="Date"
          param="eway_bill_date"
          value={props.data.eway_bill_date}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleChange}
          type="Input"
          name="EWAY BILL NO"
          type1="str"
          text_align="left"
          param="eway_bill"
          value={props.data.eway_bill}
        />
        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleChange}
          type="Input"
          name="SHIP TO"
          text_align="left"
          param="ship_to_cd"
          value={props.data.ship_to_cd}
        />
      </Row>
      <p></p>
      {!props.editMode ? (
        <Box sx={{ height: 20, width: "100%" }}>
          Total Amount :&nbsp;
          <input type="text" value={props.data.net_amt}></input>
        </Box>
      ) : (
        <></>
      )}

      <>
        {allData && (
          <>
            <Tabs
              defaultActiveKey="0"
              // style={{ height: "30%" }}
              tabPosition="left"
              type="line"
              tabBarGutter="10"
            >
              <TabPane tab={<span> Item Details</span>} key="0">
                <div
                  style={{
                    overflowX: "scroll",
                    padding: "10px",
                    // border: "2px solid red",
                  }}
                >
                  <SizeDetailWithOrder
                    hdata={props.data}
                    data={allData.invoiceSizeWithOrder}
                    ad={ad}
                    setData={props.setData}
                  />
                </div>
              </TabPane>
              <TabPane tab={<span>Item Tax Details</span>} key="1"></TabPane>
            </Tabs>
            <div align="left">
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialog1Open}
              >
                Add Item
              </Button>
            </div>
          </>
        )}
      </>

      {
        // dialog box for order list
        <div>
          <Dialog open={open} onClose={handleClose}>
            {/* <DialogTitle>List of Order's</DialogTitle>
                  <DialogContent> */}
            {/* {console.log("hello dia")} */}

            <DialogContentText>
              {rows && columns.length > 0 ? (
                <>
                  <EmployeeTable data={rows} columns={columns} val={true} />
                </>
              ) : (
                <>
                  <Skeleton loading={false} />
                  <Skeleton loading={false} />
                  <Skeleton loading={false} />
                  <Skeleton loading={false} />
                </>
              )}
            </DialogContentText>
            {/* {console.log("hello kiara")} */}
            {/* </DialogContent> */}
            {/* <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>ok</Button>
                  </DialogActions> */}
          </Dialog>
        </div>
      }

      {
        // dialog box for order list
        <div>
          <Dialog open={openDialog1} onClose={handleDialog1Close}>
            <DialogContentText>
              {rowscust && columnscust.length > 0 ? (
                <>
                  <EmployeeTable
                    data={rowscust}
                    columns={columnscust}
                    val={true}
                  />
                </>
              ) : (
                <>
                  <Skeleton loading={false} />
                  <Skeleton loading={false} />
                  <Skeleton loading={false} />
                  <Skeleton loading={false} />
                </>
              )}
            </DialogContentText>
          </Dialog>
        </div>
      }
    </div>
  );
};

export default BasicDetail;

///////////////////////////////////////////////////

// import { Col, Card, Input, Form, DatePicker, Select, InputNumber } from "antd";
// import classes from "../Pages.module.css";
// import dayjs from "dayjs";
// import { TextField } from "@material-ui/core";

// const { Option } = Select;

// const DataField = (props) => {
//   console.log(props, "props in datafield");
//   return (
//     <Col
//       lg={props.lg}
//       md={props.md}
//       id={props.id ? props.id : ""}
//       className={classes["Col"]}
//     >
//       {
//         //    id = {props.id? props.id : ''}
//         props.editMode ? (
//           <Form layout="vertical">
//             <Form.Item
//               colon={false}
//               style={{ margin: "0", padding: "0" }}
//               label={
//                 <div
//                   style={{
//                     padding: "0rem 0.5rem",
//                     fontSize: "0.6rem",
//                     fontWeight: "bold",
//                   }}
//                   className={classes["Label"]}
//                 >
//                   {props.name}
//                   {props.required ? (
//                     <span style={{ color: "red" }}> *</span>
//                   ) : (
//                     ""
//                   )}
//                 </div>
//               }
//             >
//               {props.type === "Date" ? (
//                 <DatePicker
//                   value={
//                     props.value === null
//                       ? null
//                       : dayjs(props.value, "DD-MM-YYYY")
//                   }
//                   format="DD-MM-YYYY"
//                   style={{
//                     textAlign: "left",
//                     width: "100%",
//                     backgroundColor: "white",
//                     color: "#1777C4",
//                     fontWeight: "bold",
//                     boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//                   }}
//                   bordered={false}
//                   onChange={(date, dateString) =>
//                     props.handleChange(date, dateString, props.param)
//                   }
//                 />
//               ) : props.type === "Select" ? (
//                 <Select
//                   value={props.value === null ? null : props.value}
//                   showSearch
//                   onChange={(value) => props.handleChange(value, props.param)}
//                   onClick={(value) => {
//                     // Add a conditional check for props.param
//                     if (props.param === "distributor_code") {
//                       props.handleSelectClick(value, props.param);
//                     }
//                   }}
//                   bordered={false}
//                   dropdownStyle={{ textTransform: "capitalize" }}
//                   style={{
//                     width: "100%",
//                     textAlign: "left",
//                     backgroundColor: "white",
//                     textTransform: "capitalize",
//                     color: "#1777C4",
//                     fontWeight: "bold",
//                     boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//                   }}
//                   placeholder="Search to Select"
//                   optionFilterProp="children"
//                   filterOption={(input, option) => option.children >= 0}
//                   filterSort={(optionA, optionB) => optionA.children}
//                 >
//                   {props.param !== "distributor_code" &&
//                     props.param !== "del_add" &&
//                     props.options.rows.map((option) => {
//                       return (
//                         <Option
//                           style={{
//                             textTransform: "capitalize",
//                             color: "#1777C4",
//                           }}
//                           key={option[props.options.fields[0].name]}
//                           value={option[props.options.fields[0].name]}
//                         >
//                           {option[props.options.fields[1].name]}
//                         </Option>
//                       );
//                     })}
//                   {props.param === "distributor_code" &&
//                     props.customers &&
//                     props.customers.map((customer) => (
//                       <Option
//                         key={customer.distributor_code}
//                         value={customer.distributor_code}
//                       >
//                         {customer.cust_name}
//                       </Option>
//                     ))}
//                   {props.param === "del_add" &&
//                     props.addres &&
//                     props.addres.map((addres) => (
//                       <Option
//                         key={addres.del_site_code}
//                         value={addres.del_site_code}
//                       >
//                         {addres.add_1}
//                       </Option>
//                     ))}
//                 </Select>
//               ) : props.type === "Input" ? (
//                 <Input
//                   placeholder=""
//                   value={props.value ? props.value : null}
//                   bordered={false}
//                   onChange={(e) => props.handleChange(e, props.param, props.id)}
//                   // onClick={(e) => props.handleChangebok(e, props.param, props.id)}
//                   style={{
//                     width: "100%",
//                     textAlign: props.text_align ? props.text_align : "right",
//                     backgroundColor: "white",
//                     color: "#1777C4",
//                     fontWeight: "bold",
//                     boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//                   }}
//                 />
//               ) : (
//                 // :

//                 //    <InputNumber

//                 //        placeholder=""

//                 //        value = {props.value? props.value : null}

//                 //        bordered = {false}

//                 //        onChange = {(e) => props.handleChange1(e, props.param, props.id)}
//                 //       // onClick={(e) => props.handleChangebok(e, props.param, props.id)}
//                 //        style={{ width: "100%" , textAlign: "right", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
//                 //        />
//                 <Input
//                   // placeholder="Click to Generate Invoice From Order"
//                   value={props.value ? props.value : null}
//                   onClick={(e) =>
//                     props.handleChangebok(e, props.param, props.id)
//                   }
//                   style={{
//                     width: "100%",
//                     textAlign: "right",
//                     backgroundColor: "white",
//                     color: "#1777C4",
//                     fontWeight: "bold",
//                     boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//                   }}
//                 />
//               )}
//             </Form.Item>
//           </Form>
//         ) : (
//           <Card
//             bodyStyle={{ padding: "0.5rem 1rem" }}
//             bordered={false}
//             className={classes["Card"]}
//           >
//             {props.type === "Select" ? (
//               <p className={classes["Label"]}>
//                 {props.name}
//                 <span className={classes["Data"]}>
//                   {props.param === "distributor_code"
//                     ? props.value
//                       ? props.options1.rows[
//                           props.options1.rows.findIndex(
//                             (element) =>
//                               element[props.options1.fields[0].name] ===
//                               props.value
//                           )
//                         ][props.options1.fields[1].name]
//                       : null
//                     : props.value
//                     ? props.options.rows[
//                         props.options.rows.findIndex(
//                           (element) =>
//                             element[props.options.fields[0].name] ===
//                             props.value
//                         )
//                       ][props.options.fields[1].name]
//                     : null}
//                 </span>
//               </p>
//             ) : (
//               <p className={classes["Label"]}>
//                 {props.name}{" "}
//                 <span className={classes["Data"]}>
//                   {props.value ? props.value : null}
//                 </span>
//               </p>
//             )}
//           </Card>
//         )
//       }
//     </Col>
//   );
// };

// export default DataField;
