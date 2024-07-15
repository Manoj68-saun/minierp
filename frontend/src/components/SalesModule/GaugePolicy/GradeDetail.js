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
import classes from "../Pages.module.css";
import DataField from "./DataField";
//import BoonkigSizeEdit from './BookingSizeEdit';
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
//import TaxNew from './TaxNew';
//import { useState, useEffect, useContext} from 'react';
const { Option } = Select;

const GradeDetail = (props) => {
  console.log(props);
  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        GaugeGradeDetail: allValues.GaugeGradeDetail,
      };
    });
    console.log(allValues.GaugeGradeDetail);
  };
  return props.editMode ? (
    <Form
      layout="vertical"
      name="filter_form"
      onValuesChange={handleValueChanges}
      autoComplete="off"
    >
      <Form.List name="GaugeGradeDetail" initialValue={props.data}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} className={classes["Space"]} align="center">
                  <Row gutter={16}>
                    <p></p>

                    <Col lg={8} md={24}>
                      {/* <Form.Item
                                                    {...restField}
                                                    name={[name, 'grade_code']}
    
                                                    fieldKey={[fieldKey, 'grade_code']}
                                                    label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}>Grade</div>}
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
                                                        placeholder="Enter Grade"
                                                    />
                                                </Form.Item> */}
                      <Form.Item
                        {...restField}
                        name={[name, "grade_code"]}
                        fieldKey={[fieldKey, "grade_code"]}
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
                          {props.grd.length > 0 ? props.grd : null}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col lg={8} md={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "g_amount"]}
                        fieldKey={[fieldKey, "g_amount"]}
                        label={
                          <div
                            style={{
                              padding: "0rem 0.5rem",
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                            }}
                            className={classes["Label"]}
                          >
                            Amount
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
                          placeholder="Enter Amount"
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
                  Add Grade
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
                type="Select"
                options={props.ad.QUALITY}
                name="Grade"
                value={data.grade_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="Amount"
                value={data.g_amount}
              />
            </Row>
            <p></p>
          </div>
        );
      })}
    </>
  );
};

export default GradeDetail;
