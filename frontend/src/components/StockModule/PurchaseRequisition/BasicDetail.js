import React, { useRef } from "react";
import { Row } from "antd";
import PropTypes from "prop-types";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetail = (props) => {
  const planDateRef = useRef(null);
  const requirementDateRef = useRef(null);
  const departmentRef = useRef(null);
  const requestedByRef = useRef(null);

  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["purreqHdr"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        purreqHdr: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["purreqHdr"]];
      newdata[0][param] = val;
      return {
        ...data,
        purreqHdr: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["purreqHdr"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        purreqHdr: newdata,
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
          id="plan_date"
          required="True"
          name="Plan Date"
          param="plan_date"
          value={props.data.plan_date}
          rules={[{ message: "missing name" }]}
          ref={planDateRef}
          onNextFocus={() => requirementDateRef.current.focus()}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleDChange}
          type="Date"
          id="requirement_date"
          required="True"
          name="Requirement Date"
          param="requirement_date"
          value={props.data.requirement_date}
          rules={[{ message: "missing name" }]}
          ref={requirementDateRef}
          onNextFocus={() => departmentRef.current.focus()}
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
          param="dept_code"
          value={props.data.dept_code}
          ref={departmentRef}
          onNextFocus={() => requestedByRef.current.focus()}
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
          param="requester_code"
          value={props.data.requester_code}
          ref={requestedByRef}
          onNextFocus={null}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
