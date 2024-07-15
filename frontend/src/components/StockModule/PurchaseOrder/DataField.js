import React, { useState, useRef, useImperativeHandle } from "react";
import { Col, Card, Input, Form, DatePicker, Select } from "antd";
import classes from "../Pages.module.css";
import dayjs from "dayjs";

const { Option } = Select;

const DataField = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  // Expose focus method to parent component
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  }));

  // Handle key down events
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (props.type === "Date") {
        if (isOpen) {
          const picker = inputRef.current.picker;
          if (picker) {
            const selectedDate = picker.state.value;
            if (selectedDate) {
              props.handleChange(
                selectedDate,
                selectedDate.format("DD-MM-YYYY"),
                props.param
              );
              setIsOpen(false);
              if (props.onNextFocus) {
                props.onNextFocus();
              }
            }
          }
        } else {
          setIsOpen(true);
        }
      } else if (props.type === "Select") {
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
          if (props.onNextFocus) {
            props.onNextFocus();
          }
        }
      } else {
        if (props.onNextFocus) {
          props.onNextFocus();
        }
      }
    }
  };

  // Handle date change
  const handleDateChange = (date, dateString) => {
    props.handleChange(date, dateString, props.param);
    setIsOpen(false);
    if (props.onNextFocus) {
      props.onNextFocus();
    }
  };
  const disabledDate = (current) => {
    // Can't select days before today and today
    return current && current < dayjs().startOf("day");
  };
  return (
    <Col lg={props.lg} md={props.md} className={classes["Col"]}>
      {props.editMode ? (
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
                {props.name}
                {props.required ? <span style={{ color: "red" }}> *</span> : ""}
              </div>
            }
          >
            {props.type === "Date" ? (
              <DatePicker
                value={
                  props.value === null ? null : dayjs(props.value, "DD-MM-YYYY")
                }
                format="DD-MM-YYYY"
                style={{
                  textAlign: "left",
                  width: "100%",
                  backgroundColor: "white",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                onChange={handleDateChange}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                open={isOpen}
                onOpenChange={(status) => setIsOpen(status)}
                disabledDate={disabledDate} // Disable dates before today
                showToday={false} // Hide "Today" button in the picker
              />
            ) : props.type === "Select" ? (
              <Select
                id={props.id}
                value={props.value === null ? null : props.value}
                onChange={(value) => {
                  props.handleChange(value, props.param);
                  setIsOpen(false);
                }}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                open={isOpen}
                onDropdownVisibleChange={(status) => setIsOpen(status)}
                dropdownStyle={{ textTransform: "capitalize" }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  backgroundColor: "white",
                  textTransform: "capitalize",
                  color: "#1777C4",
                  fontWeight: "bold",
                  height: "33px",
                  boxShadow: "rgba(100, 100, 111, 0.1) 0px 0px 12px 0px",
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
              >
                {props.options.rows.map((option) => (
                  <Option
                    style={{ textTransform: "capitalize", color: "#1777C4" }}
                    key={option[props.options.fields[0].name]}
                    value={option[props.options.fields[0].name]}
                  >
                    {option[props.options.fields[1].name]}
                  </Option>
                ))}
              </Select>
            ) : (
              <Input
                placeholder="Enter"
                id={props.id}
                value={props.value ? props.value : ""}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => props.handleChange(e, props.param, props.id)}
                style={{
                  padding: "13.3px 63px 14px 24px",
                  borderRadius: "50px",
                  background: "transparent",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "1.5",
                  color: "#071e54",
                  WebkitAppearance: "none",
                  WebkitBoxShadow:
                    "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff",
                  boxShadow:
                    "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff",
                  height: "40px",
                }}
              />
            )}
          </Form.Item>
        </Form>
      ) : (
        <Card
          bodyStyle={{ padding: "0.5rem 1rem" }}
          bordered={false}
          className={classes["Card"]}
        >
          {props.type === "Select" ? (
            <p className={classes["Label"]}>
              {props.name}
              <span className={classes["Data"]}>
                {props.value
                  ? props.options.rows[
                      props.options.rows.findIndex(
                        (element) =>
                          element[props.options.fields[0].name] === props.value
                      )
                    ][props.options.fields[1].name]
                  : null}
              </span>
            </p>
          ) : (
            <p className={classes["Label"]}>
              {props.name}{" "}
              <span className={classes["Data"]}>
                {props.value ? props.value : ""}
              </span>
            </p>
          )}
        </Card>
      )}
    </Col>
  );
});

export default DataField;
