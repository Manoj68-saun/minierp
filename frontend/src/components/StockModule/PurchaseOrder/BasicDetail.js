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
  const requestedByRefrate = useRef(null);

  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["poHdr"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        poHdr: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["poHdr"]];
      newdata[0][param] = val;
      return {
        ...data,
        poHdr: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["poHdr"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        poHdr: newdata,
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
          id="deal_date"
          required="True"
          name="Deal Date"
          param="deal_date"
          value={props.data.deal_date}
          rules={[{ message: "missing name" }]}
          ref={planDateRef}
          onNextFocus={() => requirementDateRef.current.focus()}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          options={props.ad.DEAL_TYPE}
          handleChange={handleSChange}
          type="Select"
          id="deal_type_cd"
          required="True"
          name="Deal Type"
          param="deal_type_cd"
          value={props.data.deal_type_cd}
          rules={[{ message: "missing name" }]}
          ref={requirementDateRef}
          onNextFocus={() => departmentRef.current.focus()}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleSChange}
          options={props.ad.CURRENCY_CODE}
          type="Select"
          name="Currency"
          id="currency_cd"
          required="True"
          param="currency_cd"
          value={props.data.currency_cd}
          ref={departmentRef}
          onNextFocus={() => requestedByRefrate.current.focus()}
        />
        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleChange}
          name="Currency Rate"
          required="True"
          id="currency_rate1"
          param="currency_rate1"
          value={props.data.currency_rate1}
          ref={requestedByRefrate}
          onNextFocus={() => requestedByRef.current.focus()}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleSChange}
          options={props.ad.PARTY_CODE}
          type="Select"
          name="Party"
          required="True"
          id="party_code"
          param="party_code"
          value={props.data.party_code}
          ref={requestedByRef}
          onNextFocus={null}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
