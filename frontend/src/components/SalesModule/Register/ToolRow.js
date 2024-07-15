import {
  Col,
  Row,
  Dropdown,
  Menu,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import classes from "./ToolRow.module.css";
import { FaFileExport } from "react-icons/fa";
import { saveAs } from "file-saver";
import { useContext, useState } from "react";
import axios from "axios";
import SyncLoader from "react-spinners/SyncLoader";
import DataContext from "../../../Context/dataContext";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const { Option } = Select;

const ToolRow = (props) => {
  const employeeData = useContext(DataContext);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [type, setType] = useState("Excel Sheet");

  const showModal = (event, val) => {
    setType(val);
    setVisible(true);
  };

  const printPageExcel = (event) => {
    setExporting(true);
    axios
      .post(
        employeeData.URL +
          "/api/v1/excel/download/" +
          employeeData.parentReportData.report_code +
          "?cc=" +
          employeeData.company.code.toString() +
          "&uc=" +
          employeeData.site.code.toString(),
        { filter: employeeData.filterString.slice(0, -5) },
        { responseType: "arraybuffer" },
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        const data = response.data;
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, employeeData.parentReportData.report_name + ".xlsx");
        message.success({
          content: "Excel Sheet Generated Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setExporting(false);
      })
      .catch((err) => {
        console.log(err);
        setExporting(false);
      });
  };

  const printPagePdf = (event) => {
    setExporting(true);
    axios
      .post(
        employeeData.URL +
          "/api/v1/pdf/download/" +
          employeeData.parentReportData.report_code +
          "?cc=" +
          employeeData.company.code.toString() +
          "&uc=" +
          employeeData.site.code.toString(),
        { filter: employeeData.filterString.slice(0, -5) },
        { responseType: "arraybuffer" },
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        const data = response.data;
        const blob = new Blob([data], { type: "application/pdf" });
        saveAs(blob, employeeData.parentReportData.report_name + ".pdf");
        message.success({
          content: "PDF Generated Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setExporting(false);
      })
      .catch((err) => {
        console.log(err);
        setExporting(false);
      });
  };

  const mailPDF = (email) => {
    setExporting(true);
    axios
      .post(
        employeeData.URL +
          "/api/v1/pdf/email/" +
          employeeData.parentReportData.report_code +
          "?cc=" +
          employeeData.company.code.toString() +
          "&uc=" +
          employeeData.site.code.toString(),
        { email: email, filter: employeeData.filterString.slice(0, -5) },
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        setIsValid(true);
        setConfirmLoading(false);
        setEmail("");
        setVisible(false);
        message.success({
          content: "PDF Mailed Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setExporting(false);
      })
      .catch((err) => {
        console.log(err);
        setExporting(false);
      });
  };

  const mailExcel = (email) => {
    setExporting(true);
    axios
      .post(
        employeeData.URL +
          "/api/v1/excel/email/" +
          employeeData.parentReportData.report_code +
          "?cc=" +
          employeeData.company.code.toString() +
          "&uc=" +
          employeeData.site.code.toString(),
        { email: email, filter: employeeData.filterString.slice(0, -5) },
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        setIsValid(true);
        setConfirmLoading(false);
        setEmail("");
        setVisible(false);
        message.success({
          content: "Excel Sheet Mailed Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setExporting(false);
      })
      .catch((err) => {
        console.log(err);
        setExporting(false);
      });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (email.includes("@")) {
      if (type === "Excel Sheet") mailExcel(email);
      else if (type === "PDF") mailPDF(email);
    } else {
      setIsValid(false);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setConfirmLoading(false);
    setIsValid(true);
    setEmail("");
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const menu = (
    <Menu style={{ textAlign: "left" }}>
      <Menu.Item key="e1">
        <button
          onClick={printPagePdf}
          className={classes["StyledButtonX"]}
          style={{ color: "black" }}
        >
          Print
        </button>
      </Menu.Item>
      <Menu.Item key="e2">
        <button
          onClick={printPageExcel}
          className={classes["StyledButtonX"]}
          style={{ color: "black" }}
        >
          Download as Excel
        </button>
      </Menu.Item>
      <Menu.Item key="e3">
        <button
          onClick={(event) => showModal(event, "Excel Sheet")}
          className={classes["StyledButtonX"]}
          style={{ color: "black" }}
        >
          Mail as Excel
        </button>
      </Menu.Item>
      <Menu.Item key="e4">
        <button
          onClick={printPagePdf}
          className={classes["StyledButtonX"]}
          style={{ color: "black" }}
        >
          Download as PDF
        </button>
      </Menu.Item>
      <Menu.Item key="e5">
        <button
          onClick={(event) => showModal(event, "PDF")}
          className={classes["StyledButtonX"]}
          style={{ color: "black" }}
        >
          Mail as PDF
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className={classes["SiteLayoutBackground"]}>
        <Modal
          title={"Mail " + type}
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form layout="vertical">
            <Form.Item
              label={
                <div
                  className={
                    isValid ? classes["Label"] : classes["InvalidLabel"]
                  }
                >
                  Receiver's Mail ID
                </div>
              }
            >
              <Input
                placeholder="Enter Email ID"
                onChange={onEmailChange}
                value={email}
                className={isValid ? classes["Input"] : classes["InvalidInput"]}
              />
              {!isValid ? (
                <p style={{ textAlign: "left", color: "red" }}>
                  Enter a Valid Email!!!!
                </p>
              ) : null}
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={10} className={classes["SiteLayoutBackground"]}>
          {props.data || props.netDue ? (
            <Col
              lg={props.netDue ? 5 : 6}
              md={props.netDue ? 6 : 7}
              className={classes["Col"]}
            >
              <p
                style={{
                  color: "#1777C4",
                  fontWeight: "bold",
                  marginLeft: "1rem",
                }}
              >
                {props.netDue ? "Total" : "Opening Balance"}{" "}
                <span
                  style={{
                    float: "right",
                    color: props.ob >= 0 || props.netDue ? "green" : "red",
                  }}
                >
                  {props.netDue ? props.total : props.ob}
                </span>
              </p>
            </Col>
          ) : null}
          {props.netDue ? (
            <Col lg={1} md={1} className={classes["Col"]}></Col>
          ) : null}

          <Col
            lg={props.ft ? (props.ledger ? 3 : 9) : props.ledger ? 11 : 17}
            md={props.ft ? (props.ledger ? 0 : 8) : props.ledger ? 8 : 15}
            className={classes["Col"]}
          ></Col>
          <Col lg={4} md={5}>
            {props.netDue ? (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  textTransform: "capitalize",
                  color: "#1777C4",
                  fontWeight: "bold",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <DatePicker
                  bordered={false}
                  value={props.date ? dayjs(props.date, "DD-MM-YYYY") : null}
                  format="DD-MM-YYYY"
                  allowClear={false}
                  onChange={(date, dateString) =>
                    props.onDateChange(date, dateString)
                  }
                />
              </div>
            ) : (
              <Select
                value={props.dFilter}
                showSearch
                bordered={false}
                dropdownStyle={{ textTransform: "capitalize" }}
                onChange={(value) => props.onDChange(value, "col")}
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
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {!props.ledger && (
                  <Option
                    style={{ textTransform: "capitalize", color: "#1777C4" }}
                    key="all"
                    value="all"
                  >
                    All Records
                  </Option>
                )}
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key="today"
                  value="today"
                >
                  Today
                </Option>
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key="yesterday"
                  value="yesterday"
                >
                  Yesterday
                </Option>
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key="week"
                  value="week"
                >
                  This Week
                </Option>
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key="month"
                  value="month"
                >
                  This Month
                </Option>
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key="finYear"
                  value="finYear"
                >
                  This Year
                </Option>
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key="fromTo"
                  value="fromTo"
                >
                  From - To
                </Option>
              </Select>
            )}
          </Col>
          {props.ft ? (
            <>
              <Col
                xl={8}
                lg={8}
                md={8}
                xs={{ span: 24 }}
                className={classes["Col"]}
              >
                <RangePicker
                  bordered={false}
                  format="DD-MM-YYYY"
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    textTransform: "capitalize",
                    color: "#2EA2EC",
                    fontWeight: "bold",
                  }}
                  onChange={(date, dateString) =>
                    props.onDateChange(date, dateString)
                  }
                />
              </Col>
            </>
          ) : null}
          {/* <Col xl = {3} lg = {3} md = {4} xs={{span : 24}} className={classes['Col']}>
                        {
                            exporting
                            ?
                            <SyncLoader color = {"rgba(255,163,77,0.8)"} size = {13}/>
                            :
                            <Dropdown overlay = {menu} placement = "bottomCenter" arrow>
                                <button className = {classes['StyledButtonPdf']} style = {{color: "rgba(255,163,77,1)"}}><FaFileExport className = {classes['StyledIcon']} />  Export</button>
                            </Dropdown>
                        }
                    </Col> */}
        </Row>
      </div>
    </>
  );
};

export default ToolRow;
