import { Row, message } from "antd";
import PropTypes from "prop-types";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetail = (props) => {
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["stockHdr"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        stockHdr: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    console.log(val, "Truwwww");
    props.setData((data) => {
      const newdata = [...data["stockHdr"]];
      newdata[0][param] = val;
      return {
        ...data,
        stockHdr: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["stockHdr"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        stockHdr: newdata,
      };
    });
  };

  const handleTChange = (time, timeString, param) => {
    props.setData((data) => {
      const newdata = [...data["stockHdr"]];
      // Assuming `timeString` is in the format "HH:mm:ss"
      newdata[0][param] = timeString;
      return {
        ...data,
        stockHdr: newdata,
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
          name="Date"
          param="stock_date"
          value={props.data.stock_date}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          type="Select"
          id="trans_type"
          required="True"
          name="Stock Type"
          options={props.ad.st}
          param="trans_type"
          value={props.data.trans_type}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleSChange}
          options={props.ad.effect}
          type="Select"
          name="Stock Effect"
          id="effect"
          required="True"
          param="effect"
          value={props.data.effect}
        />

        <DataField
          editMode={props.editMode}
          lg={5}
          md={24}
          handleChange={handleChange}
          name="Reason"
          required="True"
          id="reason"
          param="reason"
          value={props.data.reason}
        />
      </Row>
    </div>
  );
};

export default BasicDetail;
