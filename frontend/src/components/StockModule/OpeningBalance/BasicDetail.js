import { Row, message } from "antd";
import PropTypes from "prop-types";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetail = (props) => {
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["openingBalance"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        openingBalance: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["openingBalance"]];
      newdata[0][param] = val;
      return {
        ...data,
        openingBalance: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["openingBalance"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        openingBalance: newdata,
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
            name="OPENING CODE"
            param="SSH_CODE"
            value={props.data.ssh_code}
          />
        )}

        <DataField
          editMode={props.editMode}
          lg={6}
          md={24}
          handleChange={handleDChange}
          type="Date"
          id="stock_date"
          required="True"
          name="Stock Date"
          param="stock_date"
          value={props.data.stock_date}
          rules={[{ message: "missing name" }]}
        />
        <DataField
          editMode={props.editMode}
          lg={6}
          md={24}
          handleChange={handleSChange}
          options={props.ad.STORE_CODE}
          required="True"
          type="Select"
          name="Store"
          param="store_cd"
          value={props.data.store_cd}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
