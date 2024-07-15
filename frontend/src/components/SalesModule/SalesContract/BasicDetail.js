import { Row } from "antd";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetail = (props) => {
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["SaudatHeader"]];
      newdata[0][param] = e.target.value;
      //  console.log(newdata)
      return {
        ...data,
        SaudatHeader: newdata,
      };
    });
  };

  const handleChange1 = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["SaudatHeader"]];
      newdata[0][param] = e.target.value;
      //  console.log(newdata)
      return {
        ...data,
        SaudatHeader: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["SaudatHeader"]];

      newdata[0][param] = val;
      return {
        ...data,
        SaudatHeader: newdata,
      };
    });
  };
  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["SaudatHeader"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        SaudatHeader: newdata,
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
            handleChange={handleChange}
            name="SAUDA CODE"
            param="sauda_code"
            value={props.data.sauda_code}
          />
        )}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "ACCOUNT NAME" param = "account_name" value = {props.data.account_name}/>    */}
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleDChange}
          name="SAUDA DATE"
          type="Date"
          param="sauda_date"
          value={props.data.sauda_date}
        />

        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEALER_CODE}
          type="Select"
          name="DEALER"
          param="dealer_code"
          value={props.data.dealer_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.CUST_CODE}
          type="Select"
          name="CUSTOMER"
          param="cust_code"
          value={props.data.cust_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_CAT_CODE}
          type="Select"
          name="ITEM CATEGORY"
          param="item_cat_code"
          value={props.data.item_cat_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_CODE}
          type="Select"
          name="ITEM"
          param="item_code"
          value={props.data.item_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.SAUDA_QUALITY}
          type="Select"
          name="GRADE"
          param="sauda_quality"
          value={props.data.sauda_quality}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="SAUDA QTY"
          param="sauda_qty"
          type="Input"
          value={props.data.sauda_qty}
        />

        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="SAUDA REMARK"
          type="Input"
          param="sauda_remark"
          value={props.data.sauda_remark}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="SAUDA RATE"
          param="sauda_rate"
          type="Input"
          value={props.data.sauda_rate}
        />

        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.FREIGHT_TYPE_CODE}
          type="Select"
          name="FREIGHT TYPE"
          param="freight_type_code"
          value={props.data.freight_type_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="ACTUAL QTY"
          param="actual_qty"
          type="Input"
          value={props.data.actual_qty}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
