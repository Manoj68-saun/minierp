import { Row, message } from "antd";
import PropTypes from "prop-types";
import classes from "../Pages.module.css";
import DataField from "./DataField";
import dayjs from "dayjs";
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
      const newdata = [...data["prodHdr"]];
      newdata[0][param] = val;
      return {
        ...data,
        prodHdr: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["prodHdr"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        prodHdr: newdata,
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

  const handleDTChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["prodHdr"]];
      newdata[0][param] = dateString;

      // Calculate the total time if both from_req_time and to_req_time are filled
      const fromTime =
        param === "from_time" ? dateString : data.prodHdr[0].from_time;
      const toTime = param === "to_time" ? dateString : data.prodHdr[0].to_time;

      if (fromTime && toTime) {
        const from = dayjs(fromTime, "DD-MM-YYYY HH:mm:ss");
        const to = dayjs(toTime, "DD-MM-YYYY HH:mm:ss");

        if (to.isAfter(from)) {
          const diff = to.diff(from, "hour", true); // Calculate the difference in hours
          newdata[0]["no_of_hrs"] = diff.toFixed(2); // Update the total with the calculated difference
        } else {
          message.error("To Time should be after From Time");
          newdata[0]["no_of_hrs"] = "";
        }
      }

      return {
        ...data,
        prodHdr: newdata,
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
          id="stock_date"
          required="True"
          name="Prod Date"
          param="stock_date"
          value={props.data.stock_date}
          rules={[{ message: "missing name" }]}
        />

        {/* <DataField
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
        /> */}

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleDTChange}
          type="DateTime"
          id="from_time"
          required="True"
          name="From Time"
          param="from_time"
          value={props.data.from_time}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleDTChange}
          type="DateTime"
          id="to_time"
          required="True"
          name="To Time"
          param="to_time"
          value={props.data.to_time}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleChange}
          type="Input"
          name="No Of Hrs"
          id="Department"
          required="True"
          param="no_of_hrs"
          value={props.data.no_of_hrs}
        />

        {/* <DataField
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
        /> */}
      </Row>
    </div>
  );
};

export default BasicDetail;
