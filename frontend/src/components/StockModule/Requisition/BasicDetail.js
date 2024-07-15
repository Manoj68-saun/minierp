import { Row, message } from "antd";
import PropTypes from "prop-types";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetail = (props) => {
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["reqHdr"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        reqHdr: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    console.log(val, "Truwwww");
    props.setData((data) => {
      const newdata = [...data["reqHdr"]];
      newdata[0][param] = val;
      return {
        ...data,
        reqHdr: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["reqHdr"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        reqHdr: newdata,
      };
    });
  };

  const handleTChange = (time, timeString, param) => {
    props.setData((data) => {
      const newdata = [...data["reqHdr"]];
      // Assuming `timeString` is in the format "HH:mm:ss"
      newdata[0][param] = timeString;
      return {
        ...data,
        reqHdr: newdata,
      };
    });
  };

  return (
    <div>
      <p></p>
      <Row className={props.editMode ? classes["RowDEX"] : classes["RowD"]}>
        {!props.create && (
          <DataField
            editMode={props.editMode}
            lg={12}
            md={24}
            name="Requisition Code"
            param="REQ_CODE"
            value={props.data.req_code}
          />
        )}

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleDChange}
          type="Date"
          id="req_date"
          required="True"
          name="Requisition Date"
          param="req_date"
          value={props.data.req_date}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleTChange}
          type="Time"
          id="Req_time"
          required="True"
          name="Requisition Time"
          param="Req_time"
          value={props.data.req_time}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEPT_CODE}
          type="Select"
          name="Department"
          id="Department"
          required="True"
          param="dept_cd"
          value={props.data.dept_cd}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleSChange}
          options={props.ad.EMPLOYEE_CODE}
          type="Select"
          name="Requested By"
          required="True"
          id="employee"
          param="emp_cd"
          value={props.data.emp_cd}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
