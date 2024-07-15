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
import { Tabs } from "antd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaxDetail from "./TaxDetail";
import { Select } from "antd";

const { Option } = Select;
const { TabPane } = Tabs;
const BasicDetail = (props) => {
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
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [addres, setAddres] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [feild, setFeild] = useState(false);
  //console.log(currentRow)
  //// WEIGHT AND TARE WEIGHT CALCULATION LINE 253 TO 273//DELETE IN EDITABLE TABLE LINE 400 TO 449// ADD ITEM IN EDITABLE TABLE LINE NO 67 TO 234
  ////FOR HIDE AND SHOW FEILD LINE 650 TO 589///// PRICE COLUMN CALCULATION IN EDITABLE TABLE LINE 634 TO 692
  ////editable table when when we select order no from the header dioluge box line 456 to 457
  //WHEN WE SELECT  THE INVOICE TYPE WITH ORDER AND CLICK ON BOOKING NO IN HEADER TABLE LINE 173 TO 234

  //// THIS IS FOR WHEN WE ADD ITEM IN EDITABLE TABLE LINE NO 67 TO 234

  const handleDialog1Open = () => {
    setOpenDialog1(true);
    console.log("handleDialog1Open");
    console.log(openDialog1);
    console.log(b);
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
        const deleteHandler = (event, index, code) => {
          console.log(index);
          console.log(code);

          handleDialog1Close();
          axios
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

              setRowsedi((rows) => {
                let newRows = response.data.data.data.invoiceSizeWithOrder.map(
                  (row, index) => {
                    console.log("Current Row:", row);
                    return {
                      id: row["unique_id"],
                      booking_no: row["booking_code"],
                      item_code: row["item_code"],
                      size_code: row["size_code"],
                      quality: row["quality"],
                      item: row["item_nm"],
                      uom: row["uom"],
                      size: row["size_nm"],
                      grade: row["get_quality"],
                      pcs: row["no_pcs"],
                      qty: row["qty"],
                      rate: parseFloat(row["bk_rate"]),
                      discount_value: row["discount_amount"],
                      discount_on: row["discount_on"],
                      dis_type: row["dis_type"],
                      rate_after_discount: parseFloat(row["booking_rate"]),
                      amount: row["qty"] * row["booking_rate"],
                      unique_id: row["unique_id"],
                      Price: row["qty"] * row["booking_rate"],
                    };
                  }
                );
                console.log(rows);
                console.log(newRows);
                console.log([...rows, ...newRows]);
                setCurrentRow([...currentRow, ...newRows]);
                return [...rows, ...newRows];
              });
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
  };

  /// THIS IS FOR  THE TABLE  WHEN WE SELECT  THE INVOICE TYPE WITH ORDER AND CLICK ON BOOKING NO IN HEADER TABLE LINE 173 TO 234
  useEffect(() => {
    setDRows(null);
    setRows(null);
    setColumns([]);
    //console.log("useEffect")
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

  //// THIS IS FOR GROSS WEIGHT AND TARE WEIGHT CALCULATION LINE 253 TO 273

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
      // setCurrentRow(null)
      Edittable(e);
      console.log(data.salesInvoice[0].booking_no);
      axios
        .get(employeeData.URL + "/api/v1/salesOrder/additional-data/" + e, {
          withCredentials: true,
        })
        .then((response) => {
          const res = response.data.data.order1.rows[0].distributor_code;
          props.data.booking_no =
            response.data.data.order1.rows[0].booking_code;
          setC(props.data.booking_no);
          console.log(props.ad.DISTRIBUTOR_CODE);
          // Find the distributor_name object with distriubutor_code

          const selectedDistributorCode =
            response.data.data.order1.rows[0].distributor_code;
          setB(response.data.data.order1.rows[0].distributor_code);
          const filteredDistributors = props.ad.DISTRIBUTOR_CODE.rows.filter(
            (option) => option.distributor_code === selectedDistributorCode
          );
          console.log(filteredDistributors[0].distributor_name, "gggggggggg");
          const distributorOptions = filteredDistributors.map(
            (filteredDistributor) => (
              <Option
                style={{
                  textTransform: "capitalize",
                  color: "#1777C4",
                }}
                key={filteredDistributor.distributor_code}
                value={filteredDistributor.distributor_code}
              >
                {filteredDistributor.distributor_name}
              </Option>
            )
          );
          console.log(distributorOptions, "fffefe");
          props.data.distributor_code =
            filteredDistributors[0].distributor_name;
          props.data.distributor_name =
            response.data.data.order1.rows[0].distributor_code;

          // Find the add_name object with add_code

          const selectedAddCode =
            response.data.data.order1.rows[0].del_site_code;
          const filteredAdd = props.ad.DEL_ADD.rows.filter(
            (option) => option.del_site_code === selectedAddCode
          );

          // Find the add_name object with add_code

          const selectedDealerCode =
            response.data.data.order1.rows[0].dealer_name;
          const filteredDealer = props.ad.DEALER_CODE.rows.filter(
            (option) => option.external_entity_code === selectedDealerCode
          );

          props.data.dealer_code = filteredDealer[0].external_entity_name;
          props.data.external_entity_code =
            response.data.data.order1.rows[0].dealer_name;
          props.data.order_type = response.data.data.order1.rows[0].order_type;
          props.data.del_add = filteredAdd[0].add_1;
          props.data.del_site_code =
            response.data.data.order1.rows[0].del_site_code;
          console.log(res);

          setDRows(null);
          setRows(null);
          setColumns([]);
        });

      console.log(newdata);
      return {
        ...data,
        salesInvoice: newdata,
      };
    });
  };

  const handleEditClick = (e) => {
    console.log(e);
  };

  /// THIS IS FOR DELETE IN EDITABLE TABLE LINE 400 TO 449

  const handleDeleteClick = (rowData, newrows, code, c) => {
    console.log(code);
    console.log(c);
    console.log(newrows);
    console.log(rowData);
    console.log(currentRow);
    console.log(c);
    setColumnsedi((columns) => {
      let newCols = c.map((col) => {
        return {
          field: col.name,
          headerName: col.name.split("_").join(" ").toLowerCase(),
          editable: true,
        };
      });

      const newNewCols = [
        {
          field: "actions",
          headerName: "Actions",
          renderCell: (rowData, rowIndex) => (
            <>
              <Button
                onClick={() =>
                  handleDeleteClick(rowData, rowVal, rowData["id"], c)
                }
              >
                <DeleteIcon />
              </Button>
            </>
          ),
        },
        ...newCols,
        { field: "price", headerName: "Price" },
      ];
      console.log(newNewCols);
      console.log(newCols);
      return newNewCols;
    });
    const rowVal = newrows.filter((row) => row["unique_id"] !== code);
    console.log(rowVal);
    setRowsedi((rows) => {
      let newDRows = rowVal.map((row, index) => {
        return {
          id: row["unique_id"],

          ...row,
        };
      });
      setCurrentRow(newDRows);
      console.log(newDRows);
      return newDRows;
    });
  };

  const handleChangeqty = (params) => {
    console.log(params.id);
  };

  ////  this is for the editable table when when we select order no from the header dioluge box line 456 to 457
  const Edittable = (e) => {
    console.log(e);

    // const rowsedi1=setRowsedi()
    // console.log(rowsedi1)
    axios
      .get(employeeData.URL + "/api/v1/salesOrder/additional-data/" + e, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setColumnsedi((columns) => {
          const requiredColumns = response.data.data.order2.fields.map(
            (col) => {}
          );
          let newCols = response.data.data.order2.fields.map((col) => {
            if (col.name == "qty") {
              return {
                field: col.name,
                headerName: col.name.split("_").join(" ").toUpperCase(),
                editable: true,
              };
            } else {
              if (
                col.name == "item_code" ||
                col.name == "uom" ||
                col.name == "size_code" ||
                col.name == "quality"
              )
                return {
                  field: col.name,
                  headerName: col.name.split("_").join(" ").toUpperCase(),
                  editable: false,
                  hide: true,
                };
              else
                return {
                  field: col.name,
                  headerName: col.name.split("_").join(" ").toUpperCase(),
                };
            }
          });

          const newNewCols = [
            {
              field: "actions",
              headerName: "Actions",
              renderCell: (rowData, rowIndex) => (
                <>
                  <Button
                    onClick={() =>
                      handleDeleteClick(
                        rowData,
                        response.data.data.order2.rows,
                        rowData["id"],
                        response.data.data.order2.fields
                      )
                    }
                  >
                    <DeleteIcon />
                  </Button>
                </>
              ),
            },
            ...newCols,
            {
              field: "price",
              headerName: "Price",
              valueGetter: (params) => {
                if (params.row["discount_on"] == "r")
                  return params.row["qty"] * params.row["rate_after_discount"];
                else if (
                  params.row["discount_on"] == "ta" &&
                  params.row["dis_type"] == "p"
                )
                  return (
                    params.row["qty"] * params.row["rate_after_discount"] -
                    (params.row["qty"] *
                      params.row["rate_after_discount"] *
                      params.row["discount_value"]) /
                      100
                  );
                else if (
                  params.row["discount_on"] == "ta" &&
                  params.row["dis_type"] == "a"
                )
                  return (
                    params.row["qty"] * params.row["rate_after_discount"] -
                    params.row["discount_value"]
                  );
              },
            },
          ];
          // else if(params.row['discount_type==p']){ { return params.row['qty']*params.row['rate_after_discount'] }}}}]
          console.log(newNewCols);
          console.log(newCols);
          return newNewCols;
        });

        setRowsedi((rows) => {
          let newRoww = response.data.data.order2.rows.map((row, index) => {
            return {
              id: row["unique_id"],
              ...row,
            };
          });

          console.log(newRoww);
          setCurrentRow(newRoww);
          setDRow(newRoww);
          props.setData((data) => {
            console.log(data);

            return {
              ...data,
              InvoiceSizewithorder1: newRoww,
            };
          });
          console.log(currentRow);
          onratechange();
          console.log(currentRow);
          return newRoww;
        });
      });
  };

  useEffect(() => {
    if (currentRow) {
      console.log(currentRow);
    }
    onratechange();
  }, [currentRow]);

  const onBlur = () => {
    console.log("onblur");
  };

  // THIS IS FOR HIDE AND SHOW FEILD LINE 650 TO 589
  const handleSChange = (val, param) => {
    console.log(param);
    console.log("IIIIIIIIIIIIIIIIIII", val);
    //     console.log(props.data.distributor_code)
    if (param === "invoice_type") {
      if (val === "wut") {
        props.data.dealer_code = null;
        props.data.del_add = null;
        props.data.distributor_code = null;
        setFeild(false);
        document.getElementById("booking_no").style.display = "none";
        document.getElementById("net_amount_box").style.display = "block";
      } else {
        setFeild(true);
        document.getElementById("booking_no").style.display = "block";
        document.getElementById("net_amount_box").style.display = "none";
      }
    }
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

  const handleChange1 = (val, param) => {
    props.setData((data) => {
      console.log(data);
      const newdata = [...data["salesInvoice"]];
      newdata[0][param] = val;
      return {
        ...data,
        salesInvoice: newdata,
      };
    });
  };

  const onratechange = () => {
    props.setData((data) => {
      return {
        ...data,
        invoiceSize3: currentRow,
      };
    });
  };

  const itemDetails = (param) => {
    console.log(param);
  };

  const editRowsModel = () => {
    console.log("edit");
  };
  const priceRow = (prow) => {
    const pricerow = prow.map((row) => {
      return {
        Price: row["qty"] * row["rate_after_discount"],

        ...row,
      };
    });
    console.log(pricerow);
    return pricerow;
  };

  /// PRICE COLUMN CALCULATION IN EDITABLE TABLE LINE 634 TO 692
  const processRowUpdate = (newRow) => {
    console.log(currentRow);

    const index1 = currentRow.findIndex((row) => row.id === newRow.id);

    setCurrentRow(
      currentRow.map((row, index) => {
        if (index === index1) {
          console.log(newRow.qty * newRow.net_rate);
          return { ...newRow, Price: newRow.qty * newRow.net_rate };
        }
        return row;
      })
    );

    const Ind = () => {
      const index1 = currentRow.findIndex((row) => row.id === newRow.id);

      return index1;
    };

    const updatedid = newRow.id;
    console.log(updatedid);
    const finalRows = currentRow.filter((row, index) => {
      return row.id !== updatedid;
    });

    console.log(finalRows);

    console.log(finalRows.concat(newRow));

    const b = Ind();
    console.log(b);

    console.log({
      ...newRow,
      Price:
        newRow["discount_on"] === "r"
          ? newRow["qty"] * newRow["rate_after_discount"]
          : newRow["discount_on"] === "ta" && newRow["dis_type"] === "p"
          ? newRow["qty"] * newRow["rate_after_discount"] -
            (newRow["qty"] *
              newRow["rate_after_discount"] *
              newRow["discount_value"]) /
              100
          : newRow["discount_on"] === "ta" && newRow["dis_type"] === "a"
          ? newRow["qty"] * newRow["rate_after_discount"] -
            newRow["discount_value"]
          : null,
    });
    //    { if(params.row['discount_on']=='r') return params.row['qty']*params.row['rate_after_discount']
    //    else if(params.row['discount_on']=='ta' && params.row['dis_type']=='p') return params.row['qty']*params.row['rate_after_discount']-(params.row['qty']*params.row['rate_after_discount']*params.row['discount_value']/100)
    //    else if(params.row['discount_on']=='ta' && params.row['dis_type']=='a') return params.row['qty']*params.row['rate_after_discount']-params.row['discount_value']}}]

    setCurrentRow(
      finalRows.concat({
        ...newRow,
        Price:
          newRow["discount_on"] === "r"
            ? newRow["qty"] * newRow["rate_after_discount"]
            : newRow["discount_on"] === "ta" && newRow["dis_type"] === "p"
            ? newRow["qty"] * newRow["rate_after_discount"] -
              (newRow["qty"] *
                newRow["rate_after_discount"] *
                newRow["discount_value"]) /
                100
            : newRow["discount_on"] === "ta" && newRow["dis_type"] === "a"
            ? newRow["qty"] * newRow["rate_after_discount"] -
              newRow["discount_value"]
            : null,
      })
    );

    setRowsedi((rows) => {
      let newRowwbeforesort = finalRows.concat({
        ...newRow,
        Price:
          newRow["discount_on"] === "r"
            ? newRow["qty"] * newRow["rate_after_discount"]
            : newRow["discount_on"] === "ta" && newRow["dis_type"] === "p"
            ? newRow["qty"] * newRow["rate_after_discount"] -
              (newRow["qty"] *
                newRow["rate_after_discount"] *
                newRow["discount_value"]) /
                100
            : newRow["discount_on"] === "ta" && newRow["dis_type"] === "a"
            ? newRow["qty"] * newRow["rate_after_discount"] -
              newRow["discount_value"]
            : null,
      });
      let shortedRow = newRowwbeforesort.sort((a, b) => (a.id > b.id ? 1 : -1));
      console.log(shortedRow);
      let newRoww = shortedRow.map((row, index) => {
        return {
          ...row,
          //  Price:(newRow['discount_on'] === 'r') ? newRow['qty']*newRow['rate_after_discount'] : ((newRow['discount_on'] === 'ta' && newRow ['dis_type'] === 'p') ? (newRow['qty']*newRow['rate_after_discount'] - (newRow['qty']*newRow['rate_after_discount']*newRow['discount_value']/100)) : (newRow ['discount_on']==='ta' && newRow ['dis_type']==='a') ? (newRow ['qty']*newRow ['rate_after_discount']-newRow ['discount_value']) : null)          ,
        };
      });
      console.log(newRoww);

      setCurrentRow(newRoww);
      setDRow(newRoww);
      console.log(currentRow);
      onratechange();
      console.log(currentRow);
      return newRoww;
    });
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

  const addrow = () => {
    setRowsedi((rows) => {
      const newrow = {
        id: Math.random(),
        SNO: "",
        booking_code: "",
        item_nm: "",
        size_nm: "",
        get_quality: "",
        no_pcs: "",
        uom: "",
        discount_on: "",
        dis_type: "",
        qty: "",
        book_rate_guage: "",
        book_rate: "",
        book_rate_amt: "",
      };
      console.log(newrow);
      console.log(rows);
      console.log(currentRow);
      console.log(dRow);
      console.log([...rows, newrow]);
      console.log([...currentRow, newrow]);
      console.log([...dRow, newrow]);
      setCurrentRow([...currentRow, newrow]);
      console.log(currentRow);
      return [...rows, newrow];
    });
  };

  const saveDeviceCell = (params) => {
    console.log(params);
  };

  const column1 = [
    { field: "SNO", headerName: "SNO", editable: true },

    { field: "booking_code", headerName: "booking code", editable: true },

    { field: "item_nm", headerName: "item nm", editable: true },

    { field: "size_nm", headerName: "size nm", editable: true },

    { field: "get_quality", headerName: "get quality", editable: true },

    { field: "no_pcs", headerName: "no pcs", editable: true },

    { field: "uom", headerName: "uom", editable: true },

    { field: "discount_on", headerName: "discount on", editable: true },

    { field: "dis_type", headerName: "dis type", editable: true },

    { field: "qty", headerName: "qty", editable: true },

    { field: "book_rate_guage", headerName: "book rate guage", editable: true },

    { field: "discount_amount", headerName: "discount amount", editable: true },

    { field: "tot_item_amt", headerName: "tot item amt", editable: true },

    { field: "net_rate", headerName: "net rate", editable: true },

    { field: "net_size_rate", headerName: "net size rate", editable: true },
  ];

  const rows1 = [
    {
      SNO: 1,
      V: 2,
      book_rate_guage: null,
      booking_code: "A12223-1",
      dis_type: "p",
      discount_amount: "20.00",
      discount_on: "ta",
      get_quality: "ST",
      id: "A12223-1",
      item_nm: "TMT",
      net_rate: "100.00",
      net_size_rate: "1600.00",
    },
  ];

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
          lg={6}
          md={24}
          handleChange={handleSChange}
          options={props.ad.INVOICE_TYPE}
          id="invoice_type"
          type="Select"
          param="invoice_type"
          name="INVOICE TYPE"
          required="True"
          feild={feild}
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

        {feild ? (
          <>
            <DataField
              editMode={props.editMode}
              lg={4}
              md={24}
              handleChange={handleChange}
              type="Input"
              id="dealer_name"
              name="DEALER NAME"
              param="dealer_code"
              required="True"
              value={props.data.dealer_code}
              disabled={true}
              text_align="left"
            />
            <DataField
              editMode={props.editMode}
              lg={4}
              md={24}
              handleChange={handleChange}
              type="Input"
              id="customer_nm"
              name="CUSTOMER NAME"
              required="True"
              param="distributor_code"
              value={props.data.distributor_code}
              disabled={true}
              text_align="left"
            />
            <DataField
              editMode={props.editMode}
              lg={8}
              md={24}
              handleChange={handleChange}
              type="Input"
              id="del_add"
              name="DELIVERY ADD"
              param="del_add"
              required="True"
              value={props.data.del_add}
              text_align="left"
            />
          </>
        ) : (
          <>
            <DataField
              editMode={props.editMode}
              lg={6}
              md={24}
              handleChange={handleSChange}
              options={props.ad.DEALER_CODE}
              type="Select"
              id="dealer_name"
              name="DEALER NAME"
              param="dealer_code"
              required="True"
              feild={feild}
              value={props.data.dealer_code}
              ed={props.editDode}
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
              // customers={customers}
              customers={props.editDode ? props.customer : customers}
              handleSelectClick={handleSelectClick}
              feild={feild}
            />

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
              feild={feild}
            />
          </>
        )}
        <DataField
          editMode={props.editMode}
          lg={3}
          md={24}
          handleChange={handleChange}
          type="Input"
          name="TRUCK NO"
          text_align="left"
          param="truck_number"
          value={props.data.truck_number}
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

      {rowsedi && column1.length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialog1Open}
            >
              + Item
            </Button>

            <Box sx={{ height: 20, width: "100%" }}>
              <span style={{ color: "#1777C4" }}>Total Amount :</span>&nbsp;
              <input type="text" value={props.data.net_amt}></input>
            </Box>
          </div>
          <Tabs
            defaultActiveKey="0"
            // style={{ height: "30%" }}
            tabPosition="left"
            type="line"
            tabBarGutter="10"
          >
            <TabPane tab={<span> Item Details</span>} key="0">
              <Box
                sx={{
                  height: 400,
                  width: "100%",
                  bgcolor: "rgba(52, 52, 52, 0.1)",
                }}
              >
                <DataGrid
                  onEditCellChangeCommitted={handleChangeqty}
                  processRowUpdate={processRowUpdate}
                  onCellEditCommit={saveDeviceCell}
                  rows={rowsedi}
                  columns={columnsedi}
                  editRowsModel={editRowsModel}
                  // onEditCellChangeCommitted ={handleChangeqty}
                  editMode="row"
                  // onEditRowsModelChange={handleEditRowsModelChange}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  //checkboxSelection
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  // how change price in grid after change qty in grid

                  // onEditRowsModelChange={handleEditRowsModelChange}
                  // onRowEditCommit={handleRowEditCommit}
                  // onRowEditCancel={handleRowEditCancel}
                />
              </Box>
            </TabPane>
            <TabPane tab={<span>Item Tax Details</span>} key="1">
              <TaxDetail editMode={props.editMode} setData={props.setData} />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <>
          <Skeleton loading={false} />
          <Skeleton loading={false} />
          <Skeleton loading={false} />
          <Skeleton loading={false} />
        </>
      )}
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
            {/* <DialogContent>  */}

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
            {/* {console.log("hello kiara")} */}
            {/* </DialogContent>  */}
            {/* <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>ok</Button>
                  </DialogActions> */}
          </Dialog>
        </div>
      }
    </div>
  );
};

export default BasicDetail;
