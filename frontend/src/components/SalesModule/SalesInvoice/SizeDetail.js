//import {Row} from 'antd';
import {
  Row,
  Col,
  Form,
  Input,
  Space,
  Button,
  DatePicker,
  Select,
  InputNumber,
  message,
} from "antd";
import classes from "../Pages.module.css";
import DataField from "./DataField";
import axios from "axios";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState, useContext, useEffect } from "react";
import DataContext from "../../../Context/dataContext";

const { Option } = Select;

const SizeDetail = (props) => {
  console.log(props, "props in sizedetail");
  console.log(props.data, "props in sizedetail");
  console.log(props.data.length == 1);
  const employeeData = useContext(DataContext);
  const [sizef, setSizef] = useState([]);
  const [gradef, setGradef] = useState([]);

  const calculate_total = () => {
    alert("hello");
  };

  function validateNumber(rule, value, callback) {
    console.log(value);
    if (!isNaN(value)) {
      // console.log(!isNaN(value))
      callback("");
    } else {
      callback("Please enter a valid number");
    }
  }

  const handlechangee1 = async (changedValues, allValues, i) => {
    props.setEditDode(false);
    console.log(i, "dfdfdfdfdfdfdfdfdfdf");
    console.log(props, "item change");
    // props.setData((data) => {
    //   data[i].size_code = "";
    // });
    props.setData((data) => {
      const obj = data;

      //  console.log(j)
      // console.log(obj.invoiceSize.length)
      // console.log(data)
      var i = data.invoiceSize.length;
      console.log(i);
      var j = data.invoiceSize1.length;
      console.log(j);
      console.log(data.invoiceSize[0].item_code);
      if (data.invoiceSize.length == data.invoiceSize1.length) {
        axios
          .get(
            employeeData.URL +
              "/api/v1/salesInvoice/additional-data-of-hsn/ " +
              data.invoiceSize[i - 1].item_code,
            {
              withCredentials: true,
            }
          )

          .then((response) => {
            console.log(response);

            var res = response.data.data.hsn1.rows[0].hsn;
            var res1 = response.data.data.hsn1.rows[0].uom_nm;

            console.log("bbdbdbcdcbdcc", res1);
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

            props.setData((data) => {
              console.log(data);
              console.log(i);
              // console.log(j);
              //  for (var i = 0; i < obj.invoiceSize.length; i++) {
              data.invoiceSize[i - 1].hsn = res;
              // props.ad.UOM_FOR_ITEMS=res1
              // data.invoiceSize[i-1].uom_for_items = res1
              // props.ad.UOM_FOR_ITEMS.fields[0].name=res1
              // props.data.distributor_code

              const code = props.ad.UOM_FOR_ITEMS.rows
                .filter((item) => item.uom === res1)
                .map((item) => item.uom_code);
              console.log(code[0]);

              data.invoiceSize[i - 1].uom_for_items = code[0];
              // }
              return {
                ...data,
              };
            });
            //console.log(allValues.invoiceSize)
          });
      } else {
        axios
          .get(
            employeeData.URL +
              "/api/v1/salesInvoice/additional-data-of-hsn/ " +
              data.invoiceSize[j - 1].item_code,
            {
              withCredentials: true,
            }
          )

          .then((response) => {
            console.log(response);

            var res = response.data.data.hsn1.rows[0].hsn;
            var res1 = response.data.data.hsn1.rows[0].uom_nm;

            console.log("bbdbdbcdcbdcc", res);
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

            props.setData((data) => {
              console.log(data);
              console.log(j);

              data.invoiceSize[j - 1].hsn = res;

              const code = props.ad.UOM_FOR_ITEMS.rows
                .filter((item) => item.uom === res1)
                .map((item) => item.uom_code);
              console.log(code[0]);

              data.invoiceSize[i - 1].uom_for_items = code[0];

              // }
              return {
                ...data,
              };
            });
            //console.log(allValues.invoiceSize)
          });
      }

      return {
        ...data,
      };
    });
  };

  const handleChangee = (changedValues, allValues) => {
    props.setData((data) => {
      // alert("hello")
      console.log("ytu");
      console.log(data, "data after minus");

      // document.getElementByTagName("filter_form_invoiceSize_0_qty").align = "right";

      var qty = 0;
      for (var t = 0; t < data.invoiceSize.length; t++) {
        qty += parseInt(data.invoiceSize[t]?.qty || 0);
      }
      // this is for calculate total qty in edit view
      if (props.editMode == true && props.qty) {
        props.qty1(qty);
      }
      document.getElementById("qty").value = qty;
      console.log(qty);
      console.log("amount ke liye", data.invoiceSize[0].itemqtyamount);
      var totalAmount = 0;

      for (var u = 0; u < data.invoiceSize.length; u++) {
        var item = data.invoiceSize[u];

        // Convert qty, booking_rate, discount_amt, and bk_rate to numbers
        var qty = parseFloat(item.qty);
        var bookingRate = parseFloat(item.booking_rate);
        var discountAmt = parseFloat(item.discount_amt);
        var bkRate = parseFloat(item.bk_rate);

        // Log the values for debugging
        console.log("qty:", qty);
        console.log("bookingRate:", bookingRate);
        console.log("discountAmt:", discountAmt);
        console.log("bkRate:", bkRate);
        // Ensure that qty, bookingRate, discountAmt, and bkRate are valid numbers
        if (!isNaN(qty) && !isNaN(bookingRate)) {
          // Check if discount should be applied
          if (
            item.discount_on === "r" &&
            item.dis_type === "a" &&
            !isNaN(discountAmt)
          ) {
            var newRate = bookingRate - discountAmt;
            totalAmount += qty * newRate;
          } else if (
            item.discount_on === "r" &&
            item.dis_type === "p" &&
            !isNaN(discountAmt)
          ) {
            // Apply percentage discount
            var Totvalue = (bookingRate * discountAmt) / 100;
            var ForderRate = bookingRate - Totvalue;
            totalAmount += qty * ForderRate;
          } else if (
            item.discount_on === "ta" &&
            item.dis_type === "a" &&
            !isNaN(discountAmt)
          ) {
            // Apply total amount discount as an amount
            var Totvalue1 = bookingRate * qty - discountAmt;
            totalAmount += Totvalue1;
            // Update itemqtyamount with Totvalue1
            item.itemqtyamount = Totvalue1;
          } else if (
            item.discount_on === "ta" &&
            item.dis_type === "p" &&
            !isNaN(discountAmt)
          ) {
            // Apply total amount discount as a percentage
            var Totvalue = (bookingRate * discountAmt * qty) / 100;
            var ForderRate = bookingRate * qty - Totvalue;
            // Update itemqtyamount with ForderRate
            item.itemqtyamount = ForderRate;
            totalAmount += ForderRate;
          } else {
            totalAmount += qty * bookingRate;
          }
        } else if (!isNaN(item.itemqtyamount) && !isNaN(bookingRate)) {
          // Check if discount should be applied
          if (
            item.discount_on === "r" &&
            item.dis_type === "a" &&
            !isNaN(discountAmt)
          ) {
            var newRate = bookingRate - discountAmt;
            totalAmount += item.itemqtyamount * newRate;
          } else if (
            item.discount_on === "r" &&
            item.dis_type === "p" &&
            !isNaN(discountAmt)
          ) {
            // Apply percentage discount
            var Totvalue = (bookingRate * discountAmt) / 100;
            var ForderRate = bookingRate - Totvalue;
            totalAmount += item.itemqtyamount * ForderRate;
          } else {
            totalAmount += item.itemqtyamount * bookingRate;
          }
        }
      }

      // Now totalAmount contains the sum of all calculated values
      console.log("Total Amount:", totalAmount);
      // this is for calculate total amount in edit view
      if (props.editMode == true && props.amt) {
        props.amt1(totalAmount);
      }

      document.getElementById("amt").value = totalAmount;

      console.log(data.invoiceSize.length);
      var i = data.invoiceSize.length;
      var j = data.invoiceSize1.length;
      console.log(i);
      console.log(j);
      if (data.invoiceSize.length == data.invoiceSize1.length) {
        if (
          data.invoiceSize[i - 1].discount_on == "r" &&
          data.invoiceSize[i - 1].dis_type == "p"
        ) {
          const Totvalue =
            (data.invoiceSize[i - 1].booking_rate *
              data.invoiceSize[i - 1].discount_amt) /
            100;
          const ForderRate = data.invoiceSize[i - 1].booking_rate - Totvalue;
          data.invoiceSize[i - 1].bk_rate = ForderRate;
          data.invoiceSize[i - 1].itemqtyamount =
            data.invoiceSize[i - 1].qty * data.invoiceSize[i - 1].bk_rate;
        } else if (
          !data.invoiceSize[i - 1].discount_on &&
          !data.invoiceSize[i - 1].dis_type
        ) {
          data.invoiceSize[i - 1].itemqtyamount =
            data.invoiceSize[i - 1].qty * data.invoiceSize[i - 1].booking_rate;
          // document.getElementById("qty").value = data.invoiceSize[i-1].qty;
        } else if (
          data.invoiceSize[i - 1].discount_on == "r" &&
          data.invoiceSize[i - 1].dis_type == "a"
        ) {
          const Totvalue1 =
            data.invoiceSize[i - 1].booking_rate -
            data.invoiceSize[i - 1].discount_amt;
          data.invoiceSize[i - 1].bk_rate = Totvalue1;
          const Final1 =
            data.invoiceSize[i - 1].qty * data.invoiceSize[i - 1].bk_rate;
          console.log(Final1);
          data.invoiceSize[i - 1].itemqtyamount =
            data.invoiceSize[i - 1].qty * data.invoiceSize[i - 1].bk_rate;
        } else if (
          data.invoiceSize[i - 1].discount_on == "ta" &&
          data.invoiceSize[i - 1].dis_type == "p"
        ) {
          const Totvalue =
            (data.invoiceSize[i - 1].booking_rate *
              data.invoiceSize[i - 1].discount_amt *
              data.invoiceSize[i - 1].qty) /
            100;

          const ForderRate =
            data.invoiceSize[i - 1].booking_rate * data.invoiceSize[i - 1].qty -
            Totvalue;
          data.invoiceSize[i - 1].bk_rate =
            data.invoiceSize[i - 1].booking_rate;
          data.invoiceSize[i - 1].itemqtyamount = ForderRate;
        } else if (
          data.invoiceSize[i - 1].discount_on == "ta" &&
          data.invoiceSize[i - 1].dis_type == "a"
        ) {
          const Totvalue1 =
            data.invoiceSize[i - 1].booking_rate * data.invoiceSize[i - 1].qty -
            data.invoiceSize[i - 1].discount_amt;
          data.invoiceSize[i - 1].bk_rate =
            data.invoiceSize[i - 1].booking_rate;
          data.invoiceSize[i - 1].itemqtyamount = Totvalue1;
        }
      } else {
        if (
          data.invoiceSize[j - 1].discount_on == "r" &&
          data.invoiceSize[j - 1].dis_type == "p"
        ) {
          const Totvalue =
            (data.invoiceSize[j - 1].booking_rate *
              data.invoiceSize[j - 1].discount_amt) /
            100;
          const ForderRate = data.invoiceSize[j - 1].booking_rate - Totvalue;
          data.invoiceSize[j - 1].bk_rate = ForderRate;
          data.invoiceSize[j - 1].itemqtyamount =
            data.invoiceSize[j - 1].qty * data.invoiceSize[j - 1].bk_rate;
        } else if (
          !data.invoiceSize[j - 1].discount_on &&
          !data.invoiceSize[j - 1].dis_type
        ) {
          data.invoiceSize[j - 1].itemqtyamount =
            data.invoiceSize[j - 1].qty * data.invoiceSize[j - 1].booking_rate;
        } else if (
          data.invoiceSize[j - 1].discount_on == "r" &&
          data.invoiceSize[j - 1].dis_type == "a"
        ) {
          const Totvalue1 =
            data.invoiceSize[j - 1].booking_rate -
            data.invoiceSize[j - 1].discount_amt;
          data.invoiceSize[j - 1].bk_rate = Totvalue1;
          const Final1 =
            data.invoiceSize[j - 1].qty * data.invoiceSize[j - 1].bk_rate;
          console.log(Final1);
          data.invoiceSize[j - 1].itemqtyamount =
            data.invoiceSize[j - 1].qty * data.invoiceSize[j - 1].bk_rate;
        } else if (
          data.invoiceSize[j - 1].discount_on == "ta" &&
          data.invoiceSize[j - 1].dis_type == "p"
        ) {
          const Totvalue =
            (data.invoiceSize[j - 1].booking_rate *
              data.invoiceSize[j - 1].discount_amt *
              data.invoiceSize[j - 1].qty) /
            100;

          const ForderRate =
            data.invoiceSize[j - 1].booking_rate * data.invoiceSize[j - 1].qty -
            Totvalue;
          data.invoiceSize[j - 1].bk_rate =
            data.invoiceSize[j - 1].booking_rate;
          data.invoiceSize[j - 1].itemqtyamount = ForderRate;
        } else if (
          data.invoiceSize[j - 1].discount_on == "ta" &&
          data.invoiceSize[j - 1].dis_type == "a"
        ) {
          const Totvalue1 =
            data.invoiceSize[j - 1].booking_rate * data.invoiceSize[j - 1].qty -
            data.invoiceSize[j - 1].discount_amt;
          data.invoiceSize[j - 1].bk_rate =
            data.invoiceSize[j - 1].booking_rate;
          data.invoiceSize[j - 1].itemqtyamount = Totvalue1;
        }
      }

      return {
        ...data,
        qty: qty,
      };
    });
  };

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        invoiceSize: allValues.invoiceSize,
        invoiceSize1: changedValues.invoiceSize,
      };
    });
  };

  return props.editMode ? (
    <Form
      layout="vertical"
      name="filter_form"
      onValuesChange={handleValueChanges}
      autoComplete="off"
    >
      <div className="component-container">
        <Form.List name="invoiceSize" initialValue={props.data}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, i) => (
                  <table
                    id="table_order"
                    className="table table-bordered"
                    style={{ tableLayout: "fixed", width: "1800px" }}
                  >
                    {i == 0 && (
                      <tr
                        style={{
                          height: "0.4rem",
                          backgroundColor: "rgb(217 217 217 / 35%)",
                          // display: "inline-block",
                          // border: "2px solid red",
                          // width: "100vw",
                        }}
                      >
                        <th style={{ width: "12%" }}>
                          {" "}
                          ITEM <span style={{ color: "red" }}>*</span>
                        </th>
                        <th style={{}}>HSN</th>
                        <th style={{}}>Uom</th>
                        <th style={{}}>
                          SIZE <span style={{ color: "red" }}>*</span>
                        </th>
                        <th style={{}}>
                          GRADE<span style={{ color: "red" }}>*</span>
                        </th>
                        <th style={{}}>PCS</th>

                        <th style={{}}>
                          QTY<span style={{ color: "red" }}>*</span>
                        </th>
                        <th style={{}}>
                          Rate<span style={{ color: "red" }}>*</span>
                        </th>
                        <th style={{}}>DIS ON</th>
                        <th style={{}}>DIS VAL</th>
                        <th style={{}}>DIS TYPE</th>
                        <th style={{}}>RATE NW</th>
                        <th style={{}}>AMOUNT</th>
                        <th style={{}}>#</th>
                      </tr>
                    )}

                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "12%",
                            height: "25px",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "item_code"]}
                            fieldKey={[fieldKey, "item_code"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              { required: true, message: "Missing Name" },
                            ]}
                          >
                            <Select
                              onChange={(changedValues, allValues) =>
                                handlechangee1(changedValues, allValues, i)
                              }
                              bordered={false}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select"
                              optionFilterProp="children"
                            >
                              {props.ad.ITEM_CODE.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[props.ad.ITEM_CODE.fields[0].name]
                                    }
                                    value={
                                      option[props.ad.ITEM_CODE.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.ITEM_CODE.fields[1].name]}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>
                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "hsn"]}
                            fieldKey={[fieldKey, "hsn"]}
                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={
                              [
                                // {
                                //     required: true,
                                //     message: 'Field should not be blank!!'
                                // },
                                // {
                                //     type: 'number',
                                //     message: "please enter only numeric value"
                                // },
                              ]
                            }
                          >
                            <Input
                              style={{
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder=""
                              type="number"
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "uom_for_items"]}
                            fieldKey={[fieldKey, "uom_for_items"]}

                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              bordered={false}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select"
                              optionFilterProp="children"
                            >
                              {props.ad.UOM_FOR_ITEMS.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[
                                        props.ad.UOM_FOR_ITEMS.fields[0].name
                                      ]
                                    }
                                    value={
                                      option[
                                        props.ad.UOM_FOR_ITEMS.fields[0].name
                                      ]
                                    }
                                  >
                                    {
                                      option[
                                        props.ad.UOM_FOR_ITEMS.fields[1].name
                                      ]
                                    }
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "size_code"]}
                            fieldKey={[fieldKey, "size_code"]}

                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              // why sizef  is not getting updated

                              bordered={false}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select"
                              optionFilterProp="children"
                              // defaultValue={props.editDode ? undefined : ""}
                            >
                              {props.editDode
                                ? props.responseDataArray[i].size.rows.map(
                                    (option) => (
                                      <Option
                                        style={{
                                          textTransform: "capitalize",
                                          color: "#1777C4",
                                        }}
                                        key={
                                          option[
                                            props.responseDataArray[i].size
                                              .fields[0].name
                                          ]
                                        }
                                        value={
                                          option[
                                            props.responseDataArray[i].size
                                              .fields[0].name
                                          ]
                                        }
                                      >
                                        {
                                          option[
                                            props.responseDataArray[i].size
                                              .fields[1].name
                                          ]
                                        }
                                      </Option>
                                    )
                                  )
                                : sizef.length > 0
                                ? sizef
                                : null}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "quality"]}
                            fieldKey={[fieldKey, "quality"]}
                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              bordered={false}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select"
                              optionFilterProp="children"
                            >
                              {props.editDode
                                ? props.responseDataArray[i].grade.rows.map(
                                    (option) => (
                                      <Option
                                        style={{
                                          textTransform: "capitalize",
                                          color: "#1777C4",
                                        }}
                                        key={
                                          option[
                                            props.responseDataArray[i].grade
                                              .fields[0].name
                                          ]
                                        }
                                        value={
                                          option[
                                            props.responseDataArray[i].grade
                                              .fields[0].name
                                          ]
                                        }
                                      >
                                        {
                                          option[
                                            props.responseDataArray[i].grade
                                              .fields[1].name
                                          ]
                                        }
                                      </Option>
                                    )
                                  )
                                : gradef.length > 0
                                ? gradef
                                : null}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "no_pcs"]}
                            fieldKey={[fieldKey, "no_pcs"]}
                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              {
                                // required: true,
                                message: "",
                              },
                              {
                                type: "number",
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              style={{
                                textAlign: "right !important",
                                width: "100%",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              type="number"
                              className={classes["ant-input-number-input1"]}
                              placeholder="enter no of pcs"
                            />
                          </Form.Item>
                        </td>

                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "qty"]}
                            fieldKey={[fieldKey, "qty"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              {
                                required: true,
                                message: "Field should not be blank!!",
                              },

                              {
                                type: "number",
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              onChange={handleChangee}
                              onSubmit={handleChangee}
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter Quantity"
                              //    step={0.01}
                              decimalScale={2}
                              type="number"

                              // formatter={value => <NumberFormat value={value} displayType={'text'}  decimalScale={2} step={0.01} />}
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "booking_rate"]}
                            fieldKey={[fieldKey, "booking_rate"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              {
                                required: true,
                                message: "Field should not be blank!!",
                              },
                              {
                                type: "number",
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              onChange={handleChangee}
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter invoice rate"
                              type="number"
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "discount_on"]}
                            fieldKey={[fieldKey, "discount_on"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            ///  rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              onChange={handleChangee}
                              bordered={false}
                              style={{
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select"
                              optionFilterProp="children"
                            >
                              {props.ad.DISCOUNT_ON.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[
                                        props.ad.DISCOUNT_ON.fields[0].name
                                      ]
                                    }
                                    value={
                                      option[
                                        props.ad.DISCOUNT_ON.fields[0].name
                                      ]
                                    }
                                  >
                                    {
                                      option[
                                        props.ad.DISCOUNT_ON.fields[1].name
                                      ]
                                    }
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "discount_amt"]}
                            fieldKey={[fieldKey, "discount_amt"]}
                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Input
                              onChange={handleChangee}
                              style={{
                                width: "100%",
                                float: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter Discount Value"
                              type="number"
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "dis_type"]}
                            fieldKey={[fieldKey, "dis_type"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            //  rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              onChange={handleChangee}
                              bordered={false}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select"
                              optionFilterProp="children"
                            >
                              {props.ad.DIS_TYPE.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[props.ad.DIS_TYPE.fields[0].name]
                                    }
                                    value={
                                      option[props.ad.DIS_TYPE.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.DIS_TYPE.fields[1].name]}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "bk_rate"]}
                            fieldKey={[fieldKey, "bk_rate"]}
                            rules={[]}
                          >
                            <Input
                              style={{
                                width: "100%",
                                float: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder=""
                              type="number"
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "itemqtyamount"]}
                            fieldKey={[fieldKey, "itemqtyamount"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Input
                              style={{
                                width: "100%",
                                float: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder=""
                              type="number"
                            />
                          </Form.Item>
                        </td>

                        {/* onChange={handleChangee} */}
                        <td style={{ border: "1px solid white" }}>
                          {i === 0 ? null : (
                            <MinusCircleOutlined
                              className={classes["Remove"]}
                              onClick={() => {
                                remove(name);
                                handleChangee();
                              }}
                            />
                          )}

                          <PlusCircleOutlined
                            className={classes["Add"]}
                            onClick={(i) => {
                              add();
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
                {props.editMode && !props.editDode ? (
                  <div
                    id="table_ord"
                    style={{
                      display: "flex",

                      flexDirection: "row",
                    }}
                  >
                    TOTAL:
                    <tr
                      style={{
                        //   border: "2px solid blue",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <input
                        type="text"
                        id="qty"
                        style={{
                          width: "10rem",
                          color: "#1777C4",
                          textAlign: "right",
                          border: "1px solid black",
                          marginLeft: "78rem",
                        }}
                      />
                      <input
                        type="text"
                        id="amt"
                        style={{
                          width: "10rem",
                          border: "1px solid black",
                          marginLeft: "38rem",
                        }}
                      />
                    </tr>
                  </div>
                ) : (
                  <div
                    id="table_ord"
                    style={{
                      display: "flex",

                      flexDirection: "row",
                    }}
                  >
                    TOTAL:
                    <tr
                      style={{
                        //   border: "2px solid blue",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <input
                        type="text"
                        id="qty"
                        value={props.qty}
                        style={{
                          width: "10rem",
                          color: "#1777C4",
                          textAlign: "right",
                          border: "1px solid black",
                          marginLeft: "78rem",
                        }}
                      />
                      <input
                        type="text"
                        id="amt"
                        value={props.amt}
                        style={{
                          width: "10rem",
                          border: "1px solid black",
                          marginLeft: "38rem",
                        }}
                      />
                    </tr>
                  </div>
                )}

                <Form.Item>
                  <Button
                    type="dashed"
                    id="add_item"
                    style={{ display: "none" }}
                    onClick={() => {
                      add();
                    }}
                  ></Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </div>
    </Form>
  ) : (
    <>
      {props.data.map((data, index) => {
        return (
          <div key={index}>
            <p></p>
            <Row
              className={props.editMode ? classes["RowDEX"] : classes["RowD"]}
            >
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.BOOKING_NO}
                type="Select"
                name="BOOKING NO"
                value={data.booking_no}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="HSN"
                value={data.hsn}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.ITEM_CODE}
                type="Select"
                name="ITEM"
                value={data.item_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.SIZE_CODE}
                type="Select"
                name="ITEM SIZE"
                value={data.size_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.QUALITY}
                type="Select"
                name="QUALITY"
                value={data.quality}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.UOM_FOR_ITEMS}
                type="Select"
                name="UOM"
                value={data.uom_for_items}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="PCS NO"
                value={data.no_pcs}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.DIS_TYPE}
                type="Select"
                name="DIS TYPE"
                value={data.dis_type}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.DISCOUNT_ON}
                type="Select"
                name="DIS ON"
                value={data.discount_on}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="QUANTITY"
                value={data.qty}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="RATE"
                value={data.booking_rate}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name=" DISCOUNT AMOUNT"
                value={data.discount_amt}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name=" TOTAL AMOUNT"
                value={data.itemqtyamount}
              />
            </Row>
            <p></p>
          </div>
        );
      })}
    </>
  );
};

export default SizeDetail;
