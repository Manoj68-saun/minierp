import { Row } from "antd";
import classes from "../Pages.module.css";
import DataField from "./DataField";

const BasicDetails = (props) => {
  console.log(props);
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["itemMaster"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        itemMaster: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["itemMaster"]];
      newdata[0][param] = val;
      return {
        ...data,
        itemMaster: newdata,
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
            name="ITEM CODE"
            param="item_code"
            value={props.data.item_code}
          />
        )}
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          type="Input"
          id="item_nam"
          name="ITEM NAME"
          param="item_name"
          required="True"
          value={props.data.item_name}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_UOM}
          type="Select"
          id="uom"
          name="UOM"
          param="item_uom"
          required="True"
          value={props.data.item_uom}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_CATEGORY}
          type="Select"
          id="item_category"
          name="CATEGORY"
          param="item_category"
          required="True"
          value={props.data.item_category}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="HSN NO"
          id="hsn_no"
          param="hsn"
          required="True"
          value={props.data.hsn}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_GROUP_CD}
          type="Select"
          id="item_group_cd"
          name="GROUP"
          param="item_group_cd"
          value={props.data.item_group_cd}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_SUBGROUP_CODE}
          type="Select"
          id="subgroup"
          name="SUBGROUP"
          param="item_subgroup_code"
          value={props.data.item_subgroup_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_RATING_CODE}
          type="Select"
          id="rating"
          name="RATING"
          param="item_rating_code"
          value={props.data.item_rating_code}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="ACTUAL NAME"
          id="actual_name"
          param="actual_name"
          value={props.data.actual_name}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="MIN LEVEL"
          id="item_min_qty"
          param="item_min_qty"
          value={props.data.item_min_qty}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="MAX LEVEL"
          id="item_max_qty"
          param="item_max_qty"
          value={props.data.item_max_qty}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="REORDER LEVEL"
          id="reorder_level"
          param="reorder_level"
          value={props.data.reorder_level}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="AVG REODER LEVEL"
          id="avg_reorderqty"
          param="avg_reorderqty"
          value={props.data.avg_reorderqty}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange} options = {props.ad.ITEM_HOME_YN} type = "Select" name = "PRIORITY" param = "ITEM_HOME_YN" value = {props.data.item_home_yn}/>           */}
      </Row>
    </div>
  );
};

export default BasicDetails;
