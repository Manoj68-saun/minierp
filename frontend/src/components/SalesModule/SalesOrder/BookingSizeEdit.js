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
import classes from "../Pages.module.css";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import SalesNew from "./SalesNew";
//import { useState, useEffect, useContext} from 'react';
const { Option } = Select;

const BookingSizeEdit = (props) => {
  // const handleChangee = (changedValues, allValues) => {

  //     props.setData(data => {
  //         console.log("ytu");
  //         if (data.bookingSize[0].DISCOUNT_ON == 'R' && data.bookingSize[0].DIS_TYPE =='P') {

  //                 const Totvalue = data.bookingSize[0].net_rate * data.bookingSize[0].discount_amount / 100;

  //                 const ForderRate = data.bookingSize[0].net_rate - Totvalue

  //                 data.bookingSize[0].net_size_rate = data.bookingSize[0].qty * ForderRate

  //               console.log(props.disoptions.rows[0].VALUE == 'R' && props.dtoptions.rows[0].VALUE =='P')
  //             console.log(props.disoptions.rows[0].VALUE == 'RATE' && props.dtoptions.rows[1].VALUE == 'AMOUNT')

  //             }

  //             // else if (data.bookingSize[0].DISCOUNT_ON == 'R' && data.bookingSize[0].DIS_TYPE =='A') {
  //             //     const Totvalue1 = data.bookingSize[0].net_rate - data.bookingSize[0].discount_amount;
  //             //     const Final1 = data.bookingSize[0].qty * Totvalue1
  //             //     data.bookingSize[0].net_size_rate = Final1
  //             //     console.log(Final1);
  //             //     console.log(data.bookingSize[0].DISCOUNT_ON)
  //             //     console.log(data.bookingSize[0].DIS_TYPE)
  //             //     console.log(data.bookingSize[0].DISCOUNT_ON == 'R' && data.bookingSize[0].DIS_TYPE =='P')

  //             // }

  //             return ({
  //                 ...data,
  //              //   bookingSize: allValues.bookingSize
  //             })
  //     })

  //     console.log( allValues.bookingSize)
  // }

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        bookingSize: allValues.bookingSize,
      };
    });
    console.log(allValues.bookingSize);
  };
  return (
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
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} className={classes["Space"]} align="center">
                  <Row gutter={16}>
                    <p></p>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "item_code"]}
                        fieldKey={[fieldKey, "item_code"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Item
                          </div>
                        }
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
                          {props.itemOptions.rows.map((option) => {
                            return (
                              <Option
                                style={{
                                  textTransform: "capitalize",
                                  color: "#1777C4",
                                }}
                                key={option[props.itemOptions.fields[0].name]}
                                value={option[props.itemOptions.fields[0].name]}
                              >
                                {option[props.itemOptions.fields[1].name]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "uom"]}
                        fieldKey={[fieldKey, "uom"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Uom
                          </div>
                        }
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
                          {props.uomOptions.rows.map((option) => {
                            return (
                              <Option
                                style={{
                                  textTransform: "capitalize",
                                  color: "#1777C4",
                                }}
                                key={option[props.uomOptions.fields[0].name]}
                                value={option[props.uomOptions.fields[0].name]}
                              >
                                {option[props.uomOptions.fields[1].name]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "size_code"]}
                        fieldKey={[fieldKey, "size_code"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Size
                          </div>
                        }
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
                          {props.sizeOptions.rows.map((option) => {
                            return (
                              <Option
                                style={{
                                  textTransform: "capitalize",
                                  color: "#1777C4",
                                }}
                                key={option[props.sizeOptions.fields[0].name]}
                                value={option[props.sizeOptions.fields[0].name]}
                              >
                                {option[props.sizeOptions.fields[1].name]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "quality"]}
                        fieldKey={[fieldKey, "quality"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Grade
                          </div>
                        }
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
                          {props.qualityOptions.rows.map((option) => {
                            return (
                              <Option
                                style={{
                                  textTransform: "capitalize",
                                  color: "#1777C4",
                                }}
                                key={
                                  option[props.qualityOptions.fields[0].name]
                                }
                                value={
                                  option[props.qualityOptions.fields[0].name]
                                }
                              >
                                {option[props.qualityOptions.fields[1].name]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "no_pcs"]}
                        fieldKey={[fieldKey, "no_pcs"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Pcs
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Field should not be blank!!",
                          },
                          {
                            type: "number",
                            message: "please enter only numeric value",
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
                          placeholder="Enter NO PCS"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "qty"]}
                        fieldKey={[fieldKey, "qty"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Qty
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Field should not be blank!!",
                          },
                          {
                            type: "number",
                            message: "please enter only numeric value",
                          },
                        ]}
                      >
                        <InputNumber
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
                          placeholder="Enter order qty"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "bk_rate"]}
                        fieldKey={[fieldKey, "bk_rate"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Rate
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Field should not be blank!!",
                          },
                          {
                            type: "number",
                            message: "please enter only numeric value",
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
                          placeholder="Enter order rate"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={6} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "discount_on"]}
                        fieldKey={[fieldKey, "discount_on"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Discount On
                          </div>
                        }
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
                          {props.disoptions.rows.map((option) => {
                            return (
                              <Option
                                style={{
                                  textTransform: "capitalize",
                                  color: "#1777C4",
                                }}
                                key={option[props.disoptions.fields[0].name]}
                                value={option[props.disoptions.fields[0].name]}
                              >
                                {option[props.disoptions.fields[1].name]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col lg={6} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "dis_type"]}
                        fieldKey={[fieldKey, "dis_type"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            DISCOUNT TYPE
                          </div>
                        }
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
                          {props.dtoptions.rows.map((option) => {
                            return (
                              <Option
                                style={{
                                  textTransform: "capitalize",
                                  color: "#1777C4",
                                }}
                                key={option[props.dtoptions.fields[0].name]}
                                value={option[props.dtoptions.fields[0].name]}
                              >
                                {option[props.dtoptions.fields[1].name]}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>

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
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "discount_amount"]}
                        fieldKey={[fieldKey, "discount_amount"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            DISCOUNT
                          </div>
                        }
                        rules={[{ required: true, message: "Missing Name" }]}
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
                          placeholder="Enter "
                        />
                      </Form.Item>
                    </Col>
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

                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "tot_item_amt"]}
                        fieldKey={[fieldKey, "tot_item_amt"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Order Amt
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Field should not be blank!!",
                          },
                          {
                            type: "number",
                            message: "please enter only numeric value",
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
                          placeholder="Enter Earning"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "net_rate"]}
                        fieldKey={[fieldKey, "net_rate"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Net Rate
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Field should not be blank!!",
                          },
                          {
                            type: "number",
                            message: "please enter only numeric value",
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
                          placeholder="Enter Earning"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "net_size_rate"]}
                        fieldKey={[fieldKey, "net_size_rate"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Net Amount
                          </div>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Field should not be blank!!",
                          },
                          {
                            type: "number",
                            message: "please enter only numeric value",
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
                          placeholder="Enter Net Amount"
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={21} md={0}></Col>
                    <Col lg={1} md={24}>
                      <MinusCircleOutlined
                        className={classes["Remove"]}
                        onClick={() => {
                          remove(name);
                        }}
                      />
                    </Col>
                    <Col lg={1} md={24}>
                      <PlusCircleOutlined
                        className={classes["Add"]}
                        onClick={() => {
                          add();
                        }}
                      />
                    </Col>
                    <Col lg={1} md={24}></Col>
                    <Col lg={24} md={24}>
                      <hr></hr>
                    </Col>
                  </Row>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  className={classes["DashedButton"]}
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
  );
};

export default BookingSizeEdit;
