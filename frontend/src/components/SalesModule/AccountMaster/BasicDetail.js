import { Row } from "antd";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetail = (props) => {
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["accountHeader"]];
      newdata[0][param] = e.target.value;
      //  console.log(newdata)
      return {
        ...data,
        accountHeader: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["accountHeader"]];

      newdata[0][param] = val;
      return {
        ...data,
        accountHeader: newdata,
      };
    });
  };
  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["accountHeader"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        accountHeader: newdata,
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
            name="ACCOUNT CODE"
            param="account_code"
            value={props.data.account_code}
          />
        )}
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="ACCOUNT NAME"
          param="account_name"
          value={props.data.account_name}
        />
        {/* <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.GROUP_CODE}
          type="Select"
          name="GROUP"
          param="group_code"
          value={props.data.account_name}
        />  */}
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="ADDRESS1"
          param="add1"
          value={props.data.add1}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="ADDRESS2"
          param="add2"
          value={props.data.add2}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.CITY_CODE}
          type="Select"
          name="CITY"
          param="city_code"
          value={props.data.city_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="PIN CODE"
          type="str"
          param="pin_code"
          value={props.data.pin_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="PHONE NO"
          type="str"
          param="ph1"
          value={props.data.ph1}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="PAN NO"
          type="str"
          param="pan_no"
          value={props.data.pan_no}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="EMAIL"
          type="str"
          param="email"
          value={props.data.email}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="BANK ACCOUNT NO"
          type="str"
          param="bank_account_number"
          value={props.data.bank_account_number}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="IFSC CODE"
          type="str"
          param="bank_ifsc_code"
          value={props.data.bank_ifsc_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ACCOUNT_USED}
          type="Select"
          name="Trans Type"
          param="account_used"
          value={props.data.account_used}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
