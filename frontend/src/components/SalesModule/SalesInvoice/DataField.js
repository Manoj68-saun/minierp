import { Col, Card, Input, Form, DatePicker, Select, InputNumber } from "antd";
import classes from "../Pages.module.css";
import dayjs from "dayjs";
import { TextField } from "@material-ui/core";

const { Option } = Select;

const DataField = (props) => {
  // console.log(props, "props in datafield");
  return (
    <Col
      lg={props.lg}
      md={props.md}
      id={props.id ? props.id : ""}
      className={classes["Col"]}
    >
      {
        //    id = {props.id? props.id : ''}
        props.editMode ? (
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

                  {props.required ? (
                    <span style={{ color: "red" }}> *</span>
                  ) : (
                    ""
                  )}
                </div>
              }
            >
              {props.type === "Date" ? (
                <DatePicker
                  value={
                    props.value === null
                      ? null
                      : dayjs(props.value, "DD-MM-YYYY")
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
                  showSearch
                  onChange={(value) => props.handleChange(value, props.param)}
                  onClick={(value) => {
                    // Add a conditional check for props.param
                    if (props.param === "distributor_code") {
                      props.handleSelectClick(value, props.param);
                    }
                  }}
                  bordered={false}
                  disabled={props.param === "dealer_code" && props.ed}
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
                  {props.param !== "distributor_code" &&
                    props.param !== "del_add" &&
                    props.options.rows.map((option) => {
                      return (
                        <Option
                          style={{
                            textTransform: "capitalize",
                            color: "#1777C4",
                          }}
                          key={option[props.options.fields[0].name]}
                          value={option[props.options.fields[0].name]}
                        >
                          {option[props.options.fields[1].name]}
                        </Option>
                      );
                    })}
                  {props.param === "distributor_code" &&
                    props.customers &&
                    props.customers.map((customer) => (
                      <Option
                        key={customer.distributor_code}
                        value={customer.distributor_code}
                      >
                        {customer.cust_name}
                      </Option>
                    ))}
                  {props.param === "del_add" &&
                    props.addres &&
                    props.addres.map((addres) => (
                      <Option
                        key={addres.del_site_code}
                        value={addres.del_site_code}
                      >
                        {addres.add_1}
                      </Option>
                    ))}
                </Select>
              ) : props.type === "Input" ? (
                <Input
                  placeholder=""
                  value={props.value ? props.value : null}
                  bordered={false}
                  disabled={props.disabled}
                  onChange={(e) => props.handleChange(e, props.param, props.id)}
                  // onClick={(e) => props.handleChangebok(e, props.param, props.id)}
                  onKeyPress={(e) => {
                    if (
                      !(
                        props.name === "EWAY BILL NO" ||
                        props.name === "SHIP TO"
                      ) &&
                      !/^[0-9\b.]+$/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    width: "100%",
                    textAlign: props.text_align ? props.text_align : "right",
                    backgroundColor: "white",
                    color: "#1777C4",
                    fontWeight: "bold",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  }}
                />
              ) : (
                // :

                //    <InputNumber

                //        placeholder=""

                //        value = {props.value? props.value : null}

                //        bordered = {false}

                //        onChange = {(e) => props.handleChange1(e, props.param, props.id)}
                //       // onClick={(e) => props.handleChangebok(e, props.param, props.id)}
                //        style={{ width: "100%" , textAlign: "right", backgroundColor : "white", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
                //        />
                <Input
                  // placeholder="Click to Generate Invoice From Order"
                  value={props.value ? props.value : null}
                  onClick={(e) =>
                    props.handleChangebok(e, props.param, props.id)
                  }
                  style={{
                    width: "100%",
                    textAlign: "right",
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
            bodyStyle={{ padding: "0.1rem 0.1rem" }}
            bordered={false}
            className={classes["Card"]}
          >
            {props.type === "Select" ? (
              <p className={classes["Label"]}>
                {props.name}
                <span className={classes["Data"]}>
                  {props.param === "distributor_code" ||
                  props.param === "del_add"
                    ? props.value
                      ? props.options1.rows[
                          props.options1.rows.findIndex(
                            (element) =>
                              element[props.options1.fields[0].name] ===
                              props.value
                          )
                        ][props.options1.fields[1].name]
                      : null
                    : props.value
                    ? props.options.rows[
                        props.options.rows.findIndex(
                          (element) =>
                            element[props.options.fields[0].name] ===
                            props.value
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
        )
      }
    </Col>
  );
};

export default DataField;
