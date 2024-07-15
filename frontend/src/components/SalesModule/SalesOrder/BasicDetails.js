import { Row } from "antd";
import classes from "../Pages.module.css";
import DataField from "./DataField";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import DataContext from "../../../Context/dataContext";

const BasicDetails = (props) => {
  const employeeData = useContext(DataContext);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [addres, setAddres] = useState(null);
  const [customers, setCustomers] = useState([]);

  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["salesOrder"]];
      newdata[0][param] = e.target.value;
      //  console.log(newdata)
      return {
        ...data,
        salesOrder: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    props.setData((data) => {
      const newdata = [...data["salesOrder"]];
      if (param === "dealer_name") {
        setSelectedDealer(val);

        // Make API call to fetch customer list based on dealer_code
        axios
          .get(
            employeeData.URL +
              "/api/v1/salesInvoice/additional-data-of-customer/" +
              val,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            const customer = response.data.data.customer.rows; // Replace with the actual response structure
            setCustomers(customer);
            // Update state with the new customer list
          })
          .catch((error) => {
            console.error("Error fetching customer list:", error);
          });
      }

      if (param == "distributor_code") {
        console.log(props);
        const dis = props["data"];
        console.log(dis);
        console.log(dis["distributor_code"]);
        axios
          .get(
            employeeData.URL +
              "/api/v1/salesInvoice/additional-data-of-cust/ " +
              val,
            {
              withCredentials: true,
            }
          )

          .then((response) => {
            console.log(response);

            const add = response.data.data.custdetail.rows;
            setAddres(add);
          });
      }

      newdata[0][param] = val;
      return {
        ...data,
        salesOrder: newdata,
      };
    });
  };
  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["salesOrder"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        salesOrder: newdata,
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
            name="CUSTOMER CODE"
            param="order_code"
            value={props.data.order_code}
          />
        )}

        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleDChange}
          name="Order DATE"
          type="Date"
          param="booking_date"
          value={props.data.booking_date}
        />
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEALER_NAME}
          type="Select"
          name="DEALER NAME"
          param="dealer_name"
          value={props.data.dealer_name}
        />
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DISTRIBUTOR_CODE}
          type="Select"
          name="CUSTOMER NAME"
          param="distributor_code"
          customers={props.editMode1 ? props.customers : customers}
          value={props.data.distributor_code}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.ORDER_TYPE} type = "Select" name = "ORDER TYPE" param = "order_type" value = {props.data.order_type}/>   */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.INVOICE_TYPE_CODE} type = "Select" name = "INVOICE TYPE" param = "invoice_type_code" value = {props.data.invoice_type_code}/>  */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "PAYMENT DAYS" param = "payment_days" value = {props.data.payment_days}/>    */}
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEL_SITE_CODE}
          type="Select"
          name="DELIVERY SITE"
          param="del_site_code"
          addres={addres}
          value={props.data.del_site_code}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange} options = {props.ad.AUTH_STATUS} type = "Select" name = "AUTH STATUS" param = "auth_status" value = {props.data.auth_status}/>   */}
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleSChange}
          options={props.ad.FREIGHT_TYPE_CODE}
          type="Select"
          name="FREIGHT TYPE"
          param="freight_type_code"
          value={props.data.freight_type_code}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleDChange} name = "CUSTOMER PO DATE" type="Date" param = "customer_po_date" value = {props.data.customer_po_date}/>   */}
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleChange}
          name="CUSTOMER PO NUMBER"
          type="str"
          param="customer_po_no"
          value={props.data.customer_po_no}
        />
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleSChange}
          options={props.ad.BROKER_CODE}
          type="Select"
          name="BROKER NAME"
          param="broker_code"
          value={props.data.broker_code}
        />
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleSChange}  options = {props.ad.PAYMENT_CODE} type = "Select" name = "PAYMENT" param = "payment_code" value = {props.data.payment_code}/>  */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "TOLERANCE"  param = "tolerance" value = {props.data.tolerance}/>   */}
        {/* <DataField editMode = {props.editMode} lg = {12} md = {24} handleChange = {handleChange} name = "PAYMENT AMOUNT"  param = "payment_amt" value = {props.data.payment_amt}/>   */}
        <DataField
          editMode={props.editMode}
          lg={8}
          md={24}
          handleChange={handleChange}
          name="REMARKS"
          type="str"
          param="remarks"
          value={props.data.remarks}
        />
      </Row>
    </div>
  );
};

export default BasicDetails;
