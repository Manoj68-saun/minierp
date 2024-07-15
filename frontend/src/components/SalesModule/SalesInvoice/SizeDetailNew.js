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

const SizeDetailNew = (props) => {
  console.log(props);
  console.log(props.data, "props in sizedetail");
  //   console.log(props.data.length == 1);
  const employeeData = useContext(DataContext);
  const [sizef, setSizef] = useState([]);

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        invoiceSize: allValues.invoiceSize,
        invoiceSize1: changedValues.invoiceSize,
        invoiceSizeWithOrder: allValues.invoiceSizeWithOrder,
      };
    });
  };

  return props.data && props.manoj ? (
    <Form
      layout="vertical"
      name="filter_form"
      onValuesChange={handleValueChanges}
      autoComplete="off"
    >
      <div className="component-container">
        <Form.List name="invoiceSizeWithOrder" initialValue={props.data}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(
                  ({ key, name, fieldKey, ...restField }, i, { length }) => (
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
                            BOOKING NO <span style={{ color: "red" }}>*</span>
                          </th>
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
                          <td style={{ border: "1px solid white" }}>
                            <Form.Item
                              {...restField}
                              name={[name, "booking_code"]}
                              fieldKey={[fieldKey, "booking_code"]}
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
                                disabled={true}
                              />
                            </Form.Item>
                          </td>
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
                                disabled={true}
                              >
                                {props.ad.ITEM_CODE.rows.map((option) => {
                                  return (
                                    <Option
                                      style={{
                                        textTransform: "capitalize",
                                      }}
                                      key={
                                        option[
                                          props.ad.ITEM_CODE.fields[0].name
                                        ]
                                      }
                                      value={
                                        option[
                                          props.ad.ITEM_CODE.fields[0].name
                                        ]
                                      }
                                    >
                                      {
                                        option[
                                          props.ad.ITEM_CODE.fields[1].name
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
                                disabled={true}
                              />
                            </Form.Item>
                          </td>

                          <td style={{ border: "1px solid white" }}>
                            <Form.Item
                              {...restField}
                              name={[name, "uom"]}
                              fieldKey={[fieldKey, "uom"]}

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
                                disabled={true}
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
                                disabled={true}
                              >
                                {props.ad.SIZE_CODE.rows.map((option) => {
                                  return (
                                    <Option
                                      style={{
                                        textTransform: "capitalize",
                                        color: "#1777C4",
                                      }}
                                      key={
                                        option[
                                          props.ad.SIZE_CODE.fields[0].name
                                        ]
                                      }
                                      value={
                                        option[
                                          props.ad.SIZE_CODE.fields[0].name
                                        ]
                                      }
                                    >
                                      {
                                        option[
                                          props.ad.SIZE_CODE.fields[1].name
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
                                disabled={true}
                              >
                                {props.ad.QUALITY.rows.map((option) => {
                                  return (
                                    <Option
                                      style={{
                                        textTransform: "capitalize",
                                        color: "#1777C4",
                                      }}
                                      key={
                                        option[props.ad.QUALITY.fields[0].name]
                                      }
                                      value={
                                        option[props.ad.QUALITY.fields[0].name]
                                      }
                                    >
                                      {option[props.ad.QUALITY.fields[1].name]}
                                    </Option>
                                  );
                                })}
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
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
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
                              name={[name, "net_rate"]}
                              fieldKey={[fieldKey, "net_rate"]}
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
                                disabled={true}
                              />
                            </Form.Item>
                          </td>
                          <td style={{ border: "1px solid white" }}>
                            <Form.Item
                              {...restField}
                              name={[name, "tot_item_amount"]}
                              fieldKey={[fieldKey, "tot_item_amount"]}
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
                                disabled={true}
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
                                }}
                              />
                            )}

                            {i === length - 1 ? (
                              <PlusCircleOutlined
                                className={classes["Add"]}
                                onClick={() => add()}
                              />
                            ) : null}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )
                )}

                <Form.Item>
                  {/* <Button
                      type="dashed"
                      id="add_item"
                      style={{ display: "none" }}
                      onClick={() => {
                        add();
                      }}
                    ></Button> */}
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </div>
    </Form>
  ) : null;
};

export default SizeDetailNew;
