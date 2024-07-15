import {
  Row,
  InputNumber,
  Col,
  Card,
  Input,
  Form,
  DatePicker,
  Select,
} from "antd";
import classes from "../Pages.module.css";
import dayjs from "dayjs";
import { TimePicker } from "antd";

const { Option } = Select;

const DataField = (props) => {
  // console.log(props, "datafeild");
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
            {" "}
            {props.type === "Date" ? (
              <DatePicker
                value={
                  props.value === null ? null : dayjs(props.value, "DD-MM-YYYY")
                }
                format="DD-MM-YYYY"
                style={{
                  width: "100%",
                  float: "left",
                  backgroundColor: "white",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                // bordered={false}
                onChange={(date, dateString) =>
                  props.handleChange(date, dateString, props.param)
                }
              />
            ) : props.type === "Time" ? (
              <TimePicker
                value={props.value ? dayjs(props.value, "HH:mm:ss") : null}
                format="HH:mm:ss"
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
                onChange={(time, timeString) =>
                  props.handleChange(time, timeString, props.param)
                }
              />
            ) : props.type === "Select" ? (
              <Select
                id={props.id}
                value={props.value === null ? null : props.value}
                showSearch
                onChange={(value) => props.handleChange(value, props.param)}
                // bordered={false}
                dropdownStyle={{ textTransform: "capitalize" }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  backgroundColor: "white",
                  textTransform: "capitalize",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) => option.children >= 0}
                filterSort={(optionA, optionB) => optionA.children}
                disabled={props.param === "req_type" && props.editDisable}
              >
                {props.options.rows.map((option) => {
                  return (
                    <Option
                      style={{ textTransform: "capitalize", color: "#1777C4" }}
                      key={option[props.options.fields[0].name]}
                      value={option[props.options.fields[0].name]}
                    >
                      {option[props.options.fields[1].name]}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <Input
                placeholder="Please Select Requisition code"
                id={props.id}
                value={props.value ? props.value : null}
                // bordered={false}
                onChange={(e) => props.handleChange(e, props.param, props.id)}
                onClick={props.onClick}
                style={{
                  width: "100%",
                  float: "left",
                  backgroundColor: "white",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                disabled={props.temp === "wour"} // Disable based on req_type
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
                {props.value ? props.value : null}
              </span>
            </p>
          )}
        </Card>
      )}
    </Col>
  );
};

export default DataField;
