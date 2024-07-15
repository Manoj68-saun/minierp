import { Row, Col } from "antd";
import classes from "../Pages.module.css";
import DataField from "./DataField";
import axios from "axios"; // Import axios for API calls
import { useState, useEffect, useContext } from "react";
import DataContext from "../../../Context/dataContext";
import AdminTable from "./AdminTable";
const BasicDetail = (props) => {
  console.log(props, "props in basic deatil");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sizeData, setSizeData] = useState(null);
  const [cat, setCat] = useState(null);

  const employeeData = useContext(DataContext);

  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["GaugeHeader"]];
      newdata[0][param] = e.target.value;
      //  console.log(newdata)
      return {
        ...data,
        GaugeHeader: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    console.log(val, "vakkk");
    props.setData((data) => {
      const newdata = [...data["GaugeHeader"]];

      newdata[0][param] = val;
      return {
        ...data,
        GaugeHeader: newdata,
      };
    });

    setSelectedItem(val);
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["GaugeHeader"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        GaugeHeader: newdata,
      };
    });
  };

  useEffect(() => {
    setSizeData(null);
    if (selectedItem) {
      axios
        .get(employeeData.URL + `/api/v1/gauge/new/${selectedItem}`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setSizeData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching item details:", error);
        });
    }
  }, [selectedItem]);

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
            name="A CODE"
            param="a_code"
            value={props.data.a_code}
          />
        )}
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="GAUGE DESCRIPTION"
          type="str"
          param="g_desc"
          value={props.data.g_desc}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleSChange}
          options={props.ad.ITEM_CODE}
          type="Select"
          name="ITEM NAME"
          param="item_code"
          value={props.data.item_code}
          ed={props.edi}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleDChange}
          name="NORM DATE"
          type="Date"
          param="norm_date"
          value={props.data.norm_date}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleDChange}
          name="EXPIRE DATE"
          type="Date"
          param="expire_date"
          value={props.data.expire_date}
        />
        <DataField
          editMode={props.editMode}
          lg={12}
          md={24}
          handleChange={handleChange}
          name="REMARKS"
          type="str"
          param="remarks"
          value={props.data.remarks}
        />
        <Col span={24} className={classes["Col"]}>
          <div>
            {/* Other components or content */}
            {sizeData !== null ? (
              <AdminTable
                sizeData={sizeData}
                setMata={props.setData}
                data1={props.data1}
                data2={props.data2}
              />
            ) : (
              <p></p>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BasicDetail;
