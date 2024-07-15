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
} from "antd";
import axios from "axios";
import classes from "../Pages.module.css";
import DataField from "./DataField";
//import BoonkigSizeEdit from './BookingSizeEdit';
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState, useContext, useEffect } from "react";
import DataContext from "../../../Context/dataContext";
//import SalesNew from './SalesNew';
//import { useState, useEffect, useContext} from 'react';
const { Option } = Select;

const BookingSize = (props) => {
  const employeeData = useContext(DataContext);
  const [sizef, setSizef] = useState([]);
  const [gradef, setGradef] = useState([]);
  const [uom, setUom] = useState([]);

  const handleChangee = (changedValues, allValues) => {
    props.setData((data) => {
      //  let newDetails = data.changedValues
      //  console.log(newDetails)
      //  console.log(changedValues.bookingSize.length)
      console.log("ytu");
      console.log(data);
      console.log(data.bookingSize1.length);
      var i = data.bookingSize.length;
      var j = data.bookingSize1.length;
      // console.log(changedValues.bookingSize.length)
      console.log(j);
      if (data.bookingSize.length == data.bookingSize1.length) {
        if (
          data.bookingSize[i - 1].discount_on == "r" &&
          data.bookingSize[i - 1].dis_type == "p"
        ) {
          const Totvalue =
            (data.bookingSize[i - 1].bk_rate *
              data.bookingSize[i - 1].discount_amount) /
            100;

          const ForderRate = data.bookingSize[i - 1].bk_rate - Totvalue;
          data.bookingSize[i - 1].booking_rate = ForderRate;
          data.bookingSize[i - 1].tot_item_amt =
            data.bookingSize[i - 1].qty * ForderRate;
        } else if (
          !data.bookingSize[i - 1].discount_on &&
          !data.bookingSize[i - 1].dis_type
        ) {
          data.bookingSize[i - 1].tot_item_amt =
            data.bookingSize[i - 1].qty * data.bookingSize[i - 1].bk_rate;
          // document.getElementById("qty").value = data.invoiceSize[i-1].qty;
        } else if (
          data.bookingSize[i - 1].discount_on == "r" &&
          data.bookingSize[i - 1].dis_type == "a"
        ) {
          const Totvalue1 =
            data.bookingSize[i - 1].bk_rate -
            data.bookingSize[i - 1].discount_amount;
          data.bookingSize[i - 1].booking_rate = Totvalue1;
          const Final1 = data.bookingSize[i - 1].qty * Totvalue1;
          data.bookingSize[i - 1].tot_item_amt = Final1;
        } else if (
          data.bookingSize[i - 1].discount_on == "ta" &&
          data.bookingSize[i - 1].dis_type == "p"
        ) {
          data.bookingSize[i - 1].booking_rate =
            data.bookingSize[i - 1].bk_rate;
          const Totvalue =
            (data.bookingSize[i - 1].bk_rate *
              data.bookingSize[i - 1].discount_amount *
              data.bookingSize[0].qty) /
            100;

          const ForderRate =
            data.bookingSize[i - 1].bk_rate * data.bookingSize[i - 1].qty -
            Totvalue;

          data.bookingSize[i - 1].tot_item_amt = ForderRate;
        } else if (
          data.bookingSize[i - 1].discount_on == "ta" &&
          data.bookingSize[i - 1].dis_type == "a"
        ) {
          data.bookingSize[i - 1].booking_rate =
            data.bookingSize[i - 1].bk_rate;
          const Totvalue1 =
            data.bookingSize[i - 1].bk_rate * data.bookingSize[i - 1].qty -
            data.bookingSize[i - 1].discount_amount;
          data.bookingSize[i - 1].tot_item_amt = Totvalue1;
        }
      } else {
        if (
          data.bookingSize[j - 1].discount_on == "r" &&
          data.bookingSize[j - 1].dis_type == "p"
        ) {
          const Totvalue =
            (data.bookingSize[j - 1].bk_rate *
              data.bookingSize[j - 1].discount_amount) /
            100;

          const ForderRate = data.bookingSize[j - 1].bk_rate - Totvalue;
          data.bookingSize[j - 1].booking_rate = ForderRate;
          data.bookingSize[j - 1].tot_item_amt =
            data.bookingSize[j - 1].qty * ForderRate;
        } else if (
          data.bookingSize[j - 1].discount_on == "r" &&
          data.bookingSize[j - 1].dis_type == "a"
        ) {
          const Totvalue1 =
            data.bookingSize[j - 1].bk_rate -
            data.bookingSize[j - 1].discount_amount;
          data.bookingSize[j - 1].booking_rate = Totvalue1;
          const Final1 = data.bookingSize[j - 1].qty * Totvalue1;
          data.bookingSize[j - 1].tot_item_amt = Final1;
        } else if (
          !data.bookingSize[j - 1].discount_on &&
          !data.bookingSize[j - 1].dis_type
        ) {
          data.bookingSize[j - 1].tot_item_amt =
            data.bookingSize[j - 1].qty * data.bookingSize[j - 1].bk_rate;
          // document.getElementById("qty").value = data.invoiceSize[i-1].qty;
        } else if (
          data.bookingSize[j - 1].discount_on == "ta" &&
          data.bookingSize[j - 1].dis_type == "p"
        ) {
          data.bookingSize[j - 1].booking_rate =
            data.bookingSize[j - 1].bk_rate;
          const Totvalue =
            (data.bookingSize[j - 1].bk_rate *
              data.bookingSize[j - 1].discount_amount *
              data.bookingSize[0].qty) /
            100;

          const ForderRate =
            data.bookingSize[j - 1].bk_rate * data.bookingSize[j - 1].qty -
            Totvalue;

          data.bookingSize[j - 1].tot_item_amt = ForderRate;
        } else if (
          data.bookingSize[j - 1].discount_on == "ta" &&
          data.bookingSize[j - 1].dis_type == "a"
        ) {
          data.bookingSize[j - 1].booking_rate =
            data.bookingSize[j - 1].bk_rate;
          const Totvalue1 =
            data.bookingSize[i - 1].bk_rate * data.bookingSize[j - 1].qty -
            data.bookingSize[j - 1].discount_amount;
          data.bookingSize[j - 1].tot_item_amt = Totvalue1;
        }
      }

      //for second item if we add

      // if (data.bookingSize[1].discount_on == 'r' && data.bookingSize[1].dis_type =='p') {

      //     const Totvalue = data.bookingSize[1].net_rate * data.bookingSize[1].discount_amount / 100;

      //     const ForderRate = data.bookingSize[1].net_rate - Totvalue

      //     data.bookingSize[1].net_size_rate = data.bookingSize[1].qty * ForderRate
      // }

      // else if (data.bookingSize[1].discount_on == 'r' && data.bookingSize[1].dis_type =='a') {
      //     const Totvalue1 = data.bookingSize[1].net_rate - data.bookingSize[1].discount_amount;
      //     const Final1 = data.bookingSize[1].qty * Totvalue1
      //     data.bookingSize[1].net_size_rate = Final1
      // }

      // else if (data.bookingSize[1].discount_on == 'ta' && data.bookingSize[1].dis_type =='p') {
      //     const Totvalue = data.bookingSize[1].net_rate * data.bookingSize[1].discount_amount*data.bookingSize[1].qty / 100;

      //     const ForderRate = data.bookingSize[1].net_rate*data.bookingSize[1].qty - Totvalue

      //     data.bookingSize[1].net_size_rate =  ForderRate
      // }

      // else if (data.bookingSize[1].discount_on == 'ta' && data.bookingSize[1].dis_type =='a') {
      //     const Totvalue1 = data.bookingSize[1].net_rate * data.bookingSize[1].qty- data.bookingSize[1].discount_amount;
      //     data.bookingSize[1].net_size_rate = Totvalue1
      // }
      return {
        ...data,
        //   bookingSize: changedValues.bookingSize
      };
    });

    //  console.log( allValues.bookingSize)
  };

  const handleSelectChange = async (selectedValue) => {
    console.log(selectedValue);
    props.setData((data) => {
      axios
        .get(
          employeeData.URL +
            "/api/v1/salesInvoice/additional-data-of-hsn/ " +
            selectedValue,
          {
            withCredentials: true,
          }
        )

        .then((response) => {
          console.log(response);
          setSizef([]);
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
          setUom(
            response.data.data.uom.rows.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option[response.data.data.uom.fields[0].name]}
                  value={option[response.data.data.uom.fields[0].name]}
                >
                  {option[response.data.data.uom.fields[1].name]}
                </Option>
              );
            })
          );
        });

      return {
        ...data,
      };
    });
  };

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      //  console.log(changedValues.bookingSize.length)
      return {
        ...data,
        bookingSize: allValues.bookingSize,
        bookingSize1: changedValues.bookingSize,
      };
    });
    // console.log( allValues.bookingSize)
    // console.log(changedValues.bookingSize)
    // console.log(changedValues.bookingSize.length)
  };
  return props.editMode ? (
    <Form
      layout="vertical"
      name="filter_form"
      onValuesChange={handleValueChanges}
      autoComplete="off"
    >
      <Form.List name="bookingSize" initialValue={props.data}>
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
                        RATE<span style={{ color: "red" }}>*</span>
                      </th>
                      <th style={{}}>DIS ON</th>
                      <th style={{}}>DIS VAL</th>
                      <th style={{}}>DIS TYPE</th>
                      <th style={{}}>ACTUAL RATE</th>
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
                          rules={[{ required: true, message: "Missing Name" }]}
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
                            onChange={(valu) => handleSelectChange(valu)}
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
                          name={[name, "uom"]}
                          fieldKey={[fieldKey, "uom"]}
                          rules={[{ required: true, message: "Missing Name" }]}
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
                            {uom.length > 0 ? uom : null}
                          </Select>
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "size_code"]}
                          fieldKey={[fieldKey, "size_code"]}
                          rules={[{ required: true, message: "Missing Name" }]}
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
                            {console.log("size", sizef)}
                            {/* {console.log("dert",sizef.length)} */}
                            {sizef.length > 0 ? sizef : null}
                          </Select>
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "quality"]}
                          fieldKey={[fieldKey, "quality"]}
                          rules={[{ required: true, message: "Missing Name" }]}
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
                            {gradef.length > 0 ? gradef : null}
                          </Select>
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "no_pcs"]}
                          fieldKey={[fieldKey, "no_pcs"]}
                          rules={[
                            {
                              //   required: true,
                              //message: 'Field should not be blank!!'
                            },
                            {
                              //   type: 'number',
                              // message: "please enter only numeric value"
                            },
                          ]}
                        >
                          <Input
                            style={{
                              width: "100%",
                              float: "left",
                              backgroundColor: "white",
                              color: "#1777C4",
                              fontWeight: "bold",
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                            bordered={false}
                            placeholder="Enter No of Pcs"
                          />
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "qty"]}
                          fieldKey={[fieldKey, "qty"]}
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
                          <InputNumber
                            onChange={handleChangee}
                            style={{
                              width: "100%",
                              float: "left",
                              backgroundColor: "white",
                              color: "#1777C4",
                              fontWeight: "bold",
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                            bordered={false}
                            placeholder="Enter Order Quantity"
                          />
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "bk_rate"]}
                          fieldKey={[fieldKey, "bk_rate"]}
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
                            onChange={handleChangee}
                            style={{
                              width: "100%",
                              float: "left",
                              backgroundColor: "white",
                              color: "#1777C4",
                              fontWeight: "bold",
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                            bordered={false}
                            placeholder="Enter Order Rate"
                          />
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "discount_on"]}
                          fieldKey={[fieldKey, "discount_on"]}
                          rules={[{ required: true, message: "Missing Name" }]}
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
                            {props.ad.DISCOUNT_ON.rows.map((option) => {
                              return (
                                <Option
                                  style={{
                                    textTransform: "capitalize",
                                    color: "#1777C4",
                                  }}
                                  key={
                                    option[props.ad.DISCOUNT_ON.fields[0].name]
                                  }
                                  value={
                                    option[props.ad.DISCOUNT_ON.fields[0].name]
                                  }
                                >
                                  {option[props.ad.DISCOUNT_ON.fields[1].name]}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </td>
                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "discount_amount"]}
                          fieldKey={[fieldKey, "discount_amount"]}
                          rules={[{ required: true, message: "Missing Name" }]}
                        >
                          <Input
                            onChange={handleChangee}
                            style={{
                              width: "100%",
                              float: "left",
                              backgroundColor: "white",
                              color: "#1777C4",
                              fontWeight: "bold",
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                            bordered={false}
                            placeholder="Enter Discount Value "
                          />
                        </Form.Item>
                      </td>
                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "dis_type"]}
                          fieldKey={[fieldKey, "dis_type"]}
                          rules={[{ required: true, message: "Missing Name" }]}
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
                                  key={option[props.ad.DIS_TYPE.fields[0].name]}
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

                      {/* <Col lg = {6} md = {12}>
                            <Form.Item
                                {...restField}
                                name={[name, 'discount_on']}
                                fieldKey={[fieldKey, 'discount_on']}
                                label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>DISCOUNT ON</div>}
                                rules={[{ required: true, message: 'Missing Name' }]}
                            >
                                <Select
                                    bordered = {false}
                                    style={{ width: "100%" , textAlign: "left", float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                                    placeholder="Select"
                                    optionFilterProp="children"
                                    
                                >
                                {
                                    props.options.rows.map((option) => {
                                        return(
                                            <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = {option[props.options.fields[0].name]} value={option[props.options.fields[0].name]}>{option[props.options.fields[1].name]}</Option>
                                        );
                                    })
                                }
                                </Select>
                            </Form.Item>
                        </Col> */}

                      {/* <Col lg = {6} md = {12}>
                    <Form.Item
                    {...restField}
                    name={[name, 'dis_type']}
                    fieldKey={[fieldKey, 'dis_type']}
                    label = {<div style = {{padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold"}} className={classes['Label']}>DISCOUNT TYPE</div>}
                    rules={[{ required: true, message: 'Missing Name' }]}
                >
                    <Select
                        bordered = {false}
                        style={{ width: "100%" , textAlign: "left", float: "left", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}} 
                        placeholder="Select"
                        optionFilterProp="children" 
                    >
                    {
                        props.options.rows.map((option) => {
                            return(
                                <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = {option[props.options.fields[0].name]} value={option[props.options.fields[0].name]}>{option[props.options.fields[1].name]}</Option>
                            );
                        })
                    }
                    </Select>
                </Form.Item>
                </Col> */}

                      {/* <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'book_rate_gauge']}
                                                    fieldKey={[fieldKey, 'book_rate_gauge']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>Rate After Discount</div>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Field should not be blank!!'
                                                        },
                                                        {
                                                            type: 'number',
                                                            message: "please enter only numeric value"
                                                        },
    
                                                    ]}
                                                >
                                                    <Input
                                                        style={{ width: "100%", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        bordered={false}
                                                        placeholder=""
                                                    />
                                                </Form.Item>
                                            </Col> */}
                      {/* <Col lg={8} md={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'net_size_rate']}
                                                    fieldKey={[fieldKey, 'net_size_rate']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>Amount</div>}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Field should not be blank!!'
                                                        },
                                                        {
                                                            type: 'number',
                                                            message: "please enter only numeric value"
                                                        },
    
                                                    ]}
                                                >
                                                    <Input
                                                        style={{ width: "100%", float: "left", backgroundColor: "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                                                        bordered={false}
                                                        placeholder="Enter Net Amount"
                                                    />
                                                </Form.Item>
                                            </Col>
    
    
    
                                            <Col lg={21} md={0}>
    
                                            </Col> */}
                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "booking_rate"]}
                          fieldKey={[fieldKey, "booking_rate"]}
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
                              width: "100%",
                              float: "left",
                              backgroundColor: "white",
                              color: "#1777C4",
                              fontWeight: "bold",
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                            bordered={false}
                            placeholder=""
                          />
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "tot_item_amt"]}
                          fieldKey={[fieldKey, "tot_item_amt"]}
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
                              width: "100%",
                              float: "left",
                              backgroundColor: "white",
                              color: "#1777C4",
                              fontWeight: "bold",
                              boxShadow:
                                "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            }}
                            bordered={false}
                            placeholder=""
                          />
                        </Form.Item>
                      </td>

                      <td style={{ border: "1px solid white" }}>
                        {i === 0 ? null : (
                          <MinusCircleOutlined
                            className={classes["Remove"]}
                            onClick={() => {
                              remove(name);
                            }}
                          />
                        )}
                        <PlusCircleOutlined
                          className={classes["Add"]}
                          onClick={() => {
                            add();
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  style={{ display: "none" }}
                  onClick={() => {
                    add();
                  }}
                >
                  Add Booking
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
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
                options={props.ad.ITEM_CODE}
                type="Select"
                name="Item"
                value={data.item_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.SIZE_CODE}
                type="Select"
                name="Size"
                value={data.size_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.UOM}
                type="Select"
                name="Uom"
                value={data.uom}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.QUALITY}
                type="Select"
                name="Grade"
                value={data.quality}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="Pcs"
                value={data.no_pcs}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="Qty"
                value={data.qty}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="Rate"
                value={data.bk_rate}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                options={props.ad.DISCOUNT_ON}
                type="Select"
                name="Discount On"
                value={data.discount_on}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="Discount value"
                value={data.discount_amount}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                options={props.ad.DIS_TYPE}
                type="Select"
                name="Discount Type"
                value={data.dis_type ? data.dis_type : null}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="Rate After Discount"
                value={data.net_rate}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="ORDER AMT"
                value={data.tot_item_amt}
              />

              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="NET AMOUNT"
                value={data.net_size_rate}
              />
            </Row>
            <p></p>
          </div>
        );
      })}
    </>
  );
};

export default BookingSize;
