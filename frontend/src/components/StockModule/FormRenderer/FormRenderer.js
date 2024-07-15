import classes from "../Pages.module.css";
import { Row, Col, Form, Input, Select, TimePicker, DatePicker } from "antd";
import SyncLoader from "react-spinners/SyncLoader";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Option } = Select;

const FormRenderer = (props) => {
  const handleIChange = (e, index) => {
    props.setForm((form) => {
      const newForm = [...form];
      newForm[index].value = e.target.value;

      return newForm;
    });
  };

  const handleSChange = (e, index) => {
    props.setForm((form) => {
      const newForm = [...form];
      newForm[index].value = e;

      return newForm;
    });
  };

  const handleDChange = (date, dateString, time) => {
    console.log(date, dateString);
    props.setForm((form) => {
      const newForm = [...form];
      newForm[time].value = dateString;

      return newForm;
    });
  };

  return (
    <>
      <Row className={classes["RowDE"]}>
        {props.form.map((item, index) => {
          return (
            <Col
              lg={props.save ? 8 : 12}
              md={12}
              className={classes["Col"]}
              key={index}
            >
              <Form layout="vertical">
                <Form.Item
                  colon={false}
                  style={{ margin: "0", padding: "0" }}
                  label={
                    <div
                      style={{
                        padding: "0rem 0.5rem",
                        fontSize: "0.6rem",
                        fontWeight: "bold",
                      }}
                      className={classes["Label"]}
                    >
                      {item.label}
                    </div>
                  }
                >
                  {item.type === "Input" ? (
                    <Input
                      placeholder="Enter Data"
                      value={props.form[index].value}
                      bordered={false}
                      onChange={(event) => handleIChange(event, index)}
                      style={{
                        width: "100%",
                        float: "left",
                        backgroundColor: "white",
                        color: "#1777C4",
                        fontWeight: "bold",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                    />
                  ) : item.type === "Select" ? (
                    <Select
                      value={item.value === "" ? null : item.value}
                      showSearch
                      onChange={(value) => handleSChange(value, index)}
                      bordered={false}
                      dropdownStyle={{ textTransform: "capitalize" }}
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        textTransform: "capitalize",
                        color: "#1777C4",
                        fontWeight: "bold",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {item.options.map((option) => {
                        return (
                          <Option
                            style={{
                              textTransform: "capitalize",
                              color: "#1777C4",
                            }}
                            key={option.key}
                            value={option.key}
                          >
                            {option.name}
                          </Option>
                        );
                      })}
                    </Select>
                  ) : item.type === "Master" ? (
                    <Select
                      value={item.value === "" ? null : item.value}
                      showSearch
                      onChange={(value) => handleSChange(value, index)}
                      bordered={false}
                      dropdownStyle={{
                        textTransform: "capitalize",
                        textAlign: "left",
                      }}
                      style={{
                        textAlign: "left",
                        width: "100%",
                        backgroundColor: "white",
                        textTransform: "capitalize",
                        color: "#1777C4",
                        fontWeight: "bold",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {item.options.map((option) => {
                        return (
                          <Option
                            style={{
                              textTransform: "capitalize",
                              color: "#1777C4",
                              textAlign: "left",
                            }}
                            key={option.c}
                            value={option.c}
                          >
                            {option.n.toLowerCase()}
                          </Option>
                        );
                      })}
                    </Select>
                  ) : (
                    <TimePicker
                      value={
                        item.value === ""
                          ? null
                          : dayjs(item.value, "DD-MM-YYYY HH:mm")
                      }
                      format="DD-MM-YYYY HH:mm"
                      className={classes["Time"]}
                      style={{
                        textAlign: "left",
                        width: "100%",
                        backgroundColor: "white",
                        color: "#1777C4",
                        fontWeight: "bold",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      }}
                      bordered={false}
                      onChange={(date, dateString) =>
                        handleDChange(date, dateString, index)
                      }
                    />
                  )}
                </Form.Item>
              </Form>
            </Col>
          );
        })}
        <Col lg={8} md={24} className={classes["ColF"]}>
          <p></p>
          {props.loading ? (
            <SyncLoader color={"rgba(255,163,77,0.8)"} size={10} />
          ) : (
            <>
              {props.save ? (
                <button
                  onClick={(event) => props.handleSubmit(event)}
                  className={classes["ProfileButtonF"]}
                >
                  Add Record
                </button>
              ) : null}
            </>
          )}
        </Col>
        <p></p>
      </Row>
    </>
  );
};

export default FormRenderer;
