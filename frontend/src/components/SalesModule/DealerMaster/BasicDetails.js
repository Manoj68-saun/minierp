import { Row, message } from "antd";
import PropTypes from "prop-types";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetails = (props) => {
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["dealerMaster"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        dealerMaster: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["dealerMaster"]];
      newdata[0][param] = val;
      return {
        ...data,
        dealerMaster: newdata,
      };
    });
  };
  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["dealerMaster"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        dealerMaster: newdata,
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
            name="DEALER CODE"
            param="EXTERNAL_ENTITY_CODE"
            value={props.data.external_entity_code}
          />
        )}

        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="text"
          name="DEALER NAME"
          param="external_entity_name"
          value={props.data.external_entity_name}
          rules={[{ message: "missing name" }]}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.EXT_ENTITY_TYPE_CODE}
          type="Select"
          name="TYPE"
          param="ext_entity_type_code"
          value={props.data.ext_entity_type_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.EXTERNAL_ENTITY_GROUP_CODE}
          type="Select"
          name="GROUP"
          param="external_entity_group_code"
          value={props.data.external_entity_group_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="text"
          name="ADDRESS"
          param="address"
          value={props.data.address}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.CITY}
          type="Select"
          name="CITY"
          param="city"
          value={props.data.city}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.LOCALITY_CODE}
          type="Select"
          name="LOCALITY"
          param="locality_code"
          value={props.data.locality_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="text"
          name="PAN NO"
          param="pan_no"
          value={props.data.pan_no}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="number"
          name="INTEREST RATE(MO)"
          param="int_per"
          value={props.data.int_per}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="text"
          name="CST NO"
          param="cst_no"
          value={props.data.cst_no}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="number"
          name="PIN"
          param="pin_no"
          value={props.data.pin_no}
        />
      </Row>
    </div>
  );
};

export default BasicDetails;
