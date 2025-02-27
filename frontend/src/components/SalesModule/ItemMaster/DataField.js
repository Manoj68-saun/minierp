import { Col, Card, Input, Form, DatePicker, Select } from "antd";
import classes from "../Pages.module.css";
import dayjs from "dayjs";

const { Option } = Select;

const DataField = (props) => {
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
                bordered={false}
                onChange={(date, dateString) =>
                  props.handleChange(date, dateString, props.param)
                }
              />
            ) : props.type === "Select" ? (
              <Select
                value={props.value === null ? null : props.value}
                id={props.id}
                showSearch
                onChange={(value) => props.handleChange(value, props.param)}
                bordered={false}
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
                placeholder=""
                value={props.value ? props.value : null}
                bordered={false}
                id={props.id}
                onChange={(e) => props.handleChange(e, props.param, props.id)}
                style={{
                  width: "100%",
                  float: "left",
                  backgroundColor: "white",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
