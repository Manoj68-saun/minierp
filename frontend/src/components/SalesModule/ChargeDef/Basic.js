import { Row, Col, Form, Input, DatePicker, Select } from "antd";
import classes from "../Pages.module.css";
import dayjs from "dayjs";

const { Option } = Select;

const Basic = (props) => {
  const handleChange = (event, param) => {
    props.setForm((form) => {
      let newform = form;
      newform[param] = event.target.value;
      return {
        ...form,
        ...newform,
      };
    });
  };

  const handleSChange = (e, param) => {
    props.setForm((form) => {
      let newform = form;
      newform[param] = e;
      return {
        ...form,
        ...newform,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setForm((form) => {
      let newform = form;
      newform[param] = dateString;
      return {
        ...form,
        ...newform,
      };
    });
  };

  return (
    <>
      <Form layout="vertical">
        <Row
          gutter={32}
          style={{ margin: "0.5rem" }}
          className={classes["RowDE"]}
        >
          <Col md={9}>
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
                  SITE
                </div>
              }
            >
              <Input
                style={{
                  width: "100%",
                  float: "left",
                  backgroundColor: "white",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
                bordered={false}
                placeholder="Enter Data"
              />
            </Form.Item>
            <p></p>
          </Col>

          <Col lg={8} md={24}>
            <p></p>
            <button
              onClick={(event) => props.handleSave(event)}
              className={classes["ProfileButtonF"]}
            >
              Search Employees
            </button>
            <p></p>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Basic;
