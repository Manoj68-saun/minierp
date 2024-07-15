//import {Row} from 'antd';
import {
  Row,
  Col,
  Form,
  Input,
  Space,
  Button,
  DatePicker,
  Select,
  InputNumber,
  message,
} from "antd";

import classes from "../Pages.module.css";
import DataField from "./DataField";
import axios from "axios";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useState, useContext, useEffect, useRef } from "react";
import DataContext from "../../../Context/dataContext";

const { Option } = Select;

const SizeDetail = (props) => {
  console.log(props, "props in sizedetail");
  //   console.log(props.data, "props in sizedetail");
  //   console.log(props.data.length == 1);
  const employeeData = useContext(DataContext);
  const [sizef, setSizef] = useState([]);
  const [gradef, setGradef] = useState([]);
  const [uomf, setUomf] = useState([]);
  const [cost, setCost] = useState([]);
  const [edi, setEdi] = useState(false);
  const [itemindex, setItemindex] = useState();
  const [deletedIndex, setDeletedIndex] = useState(null);
  const pcsRef = useRef(null);
  // const sizeRef = useRef(null);
  const [form] = Form.useForm();

  const handleMinusClick = (index) => {
    // Update responseDataArray by removing the item at the specified index
    props.setResponseDataArray((prevData) => {
      const updatedResponseDataArray = [...prevData];
      updatedResponseDataArray.splice(index, 1);
      props.setDataFetchingCompleted(updatedResponseDataArray.length);
      return updatedResponseDataArray;
    });

    // Perform any additional logic immediately
    console.log(props.responseDataArray);
    // props.setDataFetchingCompleted(updatedResponseDataArray.lenght);
    console.log("Item removed");
  };

  const handlechangee1 = async (changedValues, allValues, i) => {
    console.log(i, "after item change");
    // console.log(props.data[i].Mode, "this is mode");
    setItemindex(i);
    setEdi(true);
    console.log(pcsRef.current.value);
    setSizef(sizef);
    const values = form.getFieldsValue(["reqDetail"]);

    console.log(values);
    // Check if Mode is true or present, then set it to false
    // if (props.data[i].Mode === true) {
    //   props.data[i].Mode = false;
    // }
    values.reqDetail[i].Mode = false;
    values.reqDetail[i].size_code = null;
    values.reqDetail[i].uom_code = null;
    values.reqDetail[i].quality_code = null;

    form.setFieldsValue(values);

    // pcsRef.current.value = null;
    // sizeRef.current.value = null;

    props.setData((data) => {
      console.log(data);
      console.log(i);

      axios
        .get(
          employeeData.URL +
            "/api/v1/opening/additional-data-of-hsn/ " +
            data.reqDetail[i].item_code,
          {
            withCredentials: true,
          }
        )

        .then((response) => {
          console.log(response);
          const uomOptions = response.data.data.uom.rows.map((option) => ({
            label: option[response.data.data.uom.fields[1].name],
            value: option[response.data.data.uom.fields[0].name],
          }));

          // Automatically set uom_code if there is only one option
          if (uomOptions.length === 1) {
            values.reqDetail[i].uom_code = uomOptions[0].value;
            form.setFieldsValue(values);
          }

          setUomf((prevUomf) => {
            const newUomf = [...prevUomf];
            newUomf[i] = uomOptions.map((option) => (
              <Option
                style={{ textTransform: "capitalize", color: "#1777C4" }}
                key={option.value}
                value={option.value}
              >
                {option.label}
              </Option>
            ));
            return newUomf;
          });

          setSizef((prevSizef) => {
            console.log(prevSizef, " In the 83 line");
            const newSizef = [...prevSizef];
            newSizef[i] = response.data.data.size.rows.map((option) => (
              <Option
                style={{ textTransform: "capitalize", color: "#1777C4" }}
                key={option[response.data.data.size.fields[0].name]}
                value={option[response.data.data.size.fields[0].name]}
              >
                {option[response.data.data.size.fields[1].name]}
              </Option>
            ));
            console.log(newSizef);
            return newSizef;
          });

          setGradef((prevGradef) => {
            const newGradef = [...prevGradef];
            newGradef[i] = response.data.data.grade.rows.map((option) => (
              <Option
                style={{ textTransform: "capitalize", color: "#1777C4" }}
                key={option[response.data.data.grade.fields[0].name]}
                value={option[response.data.data.grade.fields[0].name]}
              >
                {option[response.data.data.grade.fields[1].name]}
              </Option>
            ));
            return newGradef;
          });

          setCost((prevCost) => {
            const newCost = [...prevCost];
            newCost[i] = response.data.data.cost.rows.map((option) => (
              <Option
                style={{ textTransform: "capitalize", color: "#1777C4" }}
                key={option[response.data.data.cost.fields[0].name]}
                value={option[response.data.data.cost.fields[0].name]}
              >
                {option[response.data.data.cost.fields[1].name]}
              </Option>
            ));
            return newCost;
          });
        });

      return {
        ...data,
      };
    });
  };

  const handleKeyPress = (changedValues, allValues, i) => {
    console.log(i, "iiii");
    props.setData((data) => {
      const itemCode = data.reqDetail[i].item_code;
      const quantity = data.reqDetail[i].quantity;
      const qualityCode = data.reqDetail[i].quality_code;
      const sizeCode = data.reqDetail[i].size_code;
      const stockDate = data.reqHdr[0].req_date;

      axios
        .get(employeeData.URL + "/api/v1/opening/ope-ningb-alance", {
          params: {
            item_code: itemCode,
            quantity: quantity,
            quality_code: qualityCode,
            size_code: sizeCode,
            stock_date: stockDate,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response, "response is this");
          data.reqDetail[i].actual_bal =
            response.data.data.OpenningValue.rows[0].stock_with_opbal;
          // Handle the response data if needed
          //data.openingDetail[0].avg_wt
        })
        .catch((error) => {
          console.error("Error fetching opening balance:", error);
          // Handle the error if needed
        });

      return {
        ...data,
      };
    });
  };

  //   const handleKeyPress = (e, i) => {
  //     console.log(e);
  //     console.log(i, "iiii");
  //     props.setData((data) => {
  //       const itemCode = data.openingDetail[i].item_code;
  //       const quantity = data.openingDetail[i].quantity;
  //       const qualityCode = data.openingDetail[i].quality_code;
  //       const sizeCode = data.openingDetail[i].size_code;
  //       const stockDate = data.openingBalance[0].stock_date;
  //       const storeCode = data.openingBalance[0].store_code;

  //       // Make the API call only if the quantity has changed
  //       if (e.key === "Enter") {
  //         axios
  //           .get(employeeData.URL + "/api/v1/opening/ope-ningb-alance", {
  //             params: {
  //               item_code: itemCode,
  //               quantity: quantity,
  //               quality_code: qualityCode,
  //               size_code: sizeCode,
  //               stock_date: stockDate,
  //               store_code: storeCode,
  //             },
  //             withCredentials: true,
  //           })
  //           .then((response) => {
  //             data.openingDetail[i].avg_wt =
  //               response.data.data.OpenningValue.rows[0].stock_with_opbal;
  //             // Handle the response data if needed
  //             //data.openingDetail[0].avg_wt
  //           })
  //           .catch((error) => {
  //             console.error("Error fetching opening balance:", error);
  //             // Handle the error if needed
  //           });
  //       }
  //       return {
  //         ...data,
  //       };
  //     });
  //   };

  //   const handleChangee = (changedValues, allValues, i) => {
  //     props.setData((data) => {
  //       const Qty = data.openingDetail[i].quantity;
  //       console.log(Qty);

  //       const Rate = data.openingDetail[i].rate;
  //       console.log(Rate);
  //       let amt = 0; // Initialize amount to 0 by default

  //       // Check if rate is not null or undefined before performing calculation
  //       //   if (Qty && Rate) {
  //       //     data.openingDetail[i].amt = Qty * Rate; // Calculate and assign the amount directly
  //       //   } else {
  //       //     data.openingDetail[i].amt = 0; // Set amount to 0 if Qty or Rate is null or undefined
  //       //   }
  //       // Check if both Qty and Rate are not null or undefined before performing calculation
  //       if (
  //         Qty !== null &&
  //         Qty !== undefined &&
  //         Rate !== null &&
  //         Rate !== undefined
  //       ) {
  //         data.openingDetail[i].amt = Qty * Rate; // Calculate and assign the amount directly
  //       }
  //       // Create a new object with the updated amount
  //       //   const updatedOpeningDetail = [...data.openingDetail]; // Create a copy of the openingDetail array
  //       const updatedOpeningDetail = [...data.openingDetail]; // Update the amt field for the item at index i

  //       // Return a new state object with the updated openingDetail array
  //       return {
  //         ...data,
  //         openingDetail: updatedOpeningDetail,
  //       };
  //     });
  //   };

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        reqDetail: allValues.reqDetail,
        // invoiceSize1: changedValues.invoiceSize,
      };
    });
  };

  // const handleMinusClick = (index) => {
  //   // Update responseDataArray by removing the item at the specified index
  //   props.setResponseDataArray((prevData) => {
  //     const updatedResponseDataArray = [...prevData];
  //     updatedResponseDataArray.splice(index, 1);
  //     props.setDataFetchingCompleted(updatedResponseDataArray.length);
  //     return updatedResponseDataArray;
  //   });

  //   // Perform any additional logic immediately
  //   console.log(props.responseDataArray);
  //   // props.setDataFetchingCompleted(updatedResponseDataArray.lenght);
  //   console.log("Item removed");
  // };

  return props.editMode ? (
    <Form
      layout="vertical"
      name="filter_form"
      onValuesChange={handleValueChanges}
      autoComplete="off"
      form={form}
    >
      <div className="component-container">
        <Form.List name="reqDetail" initialValue={props.data}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, i) => (
                  <table
                    id="table_order"
                    className="table table-bordered"
                    style={{
                      tableLayout: "fixed",
                      width: "1250px",
                      marginBottom: "-2rem",
                    }}
                  >
                    {i == 0 && (
                      <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
                        <tr
                          style={{
                            height: "0.4rem",
                            backgroundColor: "rgb(217 217 217 / 35%)",
                          }}
                        >
                          <th style={{ width: "12%" }}>
                            {" "}
                            Item{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>

                          <th style={{}}>
                            Size{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>
                          <th style={{}}>
                            Grade{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>
                          <th style={{}}>
                            Cost Center{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>
                          <th style={{}}>Avail. Qty</th>
                          <th style={{}}>
                            Pcs{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>

                          <th style={{}}>
                            Quantity{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>
                          <th style={{}}>
                            Uom{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>
                          <th style={{}}>Purpose</th>
                          <th style={{ width: "8%", textAlign: "left" }}>#</th>
                        </tr>
                      </thead>
                    )}

                    <tbody
                    // style={{
                    //   width: "12%",
                    //   height: "10px",
                    //   // border: "2px solid black",
                    // }}
                    >
                      <tr
                        style={
                          {
                            // border: "2px solid red",
                          }
                        }
                      >
                        <td
                          style={{
                            width: "12%",
                            // height: "10px",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
                            // style={{ border: "2px solid red" }}
                            {...restField}
                            name={[name, "item_code"]}
                            fieldKey={[fieldKey, "item_code"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              { required: true, message: "Missing Name" },
                            ]}
                          >
                            <Select
                              onChange={(changedValues, allValues) =>
                                handlechangee1(changedValues, allValues, i)
                              }
                              bordered={true}
                              style={{
                                width: "110%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select Item"
                              optionFilterProp="children"
                            >
                              {props.ad.ITEM_CODE.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[props.ad.ITEM_CODE.fields[0].name]
                                    }
                                    value={
                                      option[props.ad.ITEM_CODE.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.ITEM_CODE.fields[1].name]}{" "}
                                    {option[props.ad.ITEM_CODE.fields[0].name]}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "size_code"]}
                            fieldKey={[fieldKey, "size_code"]}
                          >
                            <Select
                              bordered={true}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              ref={props.sizeRef}
                              id="sizewala"
                              placeholder="Select Size"
                              optionFilterProp="children"
                            >
                              {console.log(i, "i in the size ")}
                              {console.log(sizef[i], " mode false ")}
                              {props.data[i]?.Mode !== undefined &&
                                (props.data[i]?.Mode
                                  ? props.responseDataArray[i]?.size.rows.map(
                                      (option) => (
                                        <Option
                                          style={{
                                            textTransform: "capitalize",
                                            color: "#1777C4",
                                          }}
                                          key={
                                            option[
                                              props.responseDataArray[i].size
                                                .fields[0].name
                                            ]
                                          }
                                          value={
                                            option[
                                              props.responseDataArray[i].size
                                                .fields[0].name
                                            ]
                                          }
                                        >
                                          {
                                            option[
                                              props.responseDataArray[i].size
                                                .fields[1].name
                                            ]
                                          }
                                        </Option>
                                      )
                                    )
                                  : edi
                                  ? sizef[i]
                                  : null)}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "quality_code"]}
                            fieldKey={[fieldKey, "quality_code"]}
                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              bordered={true}
                              style={{
                                width: "100%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select Grade"
                              optionFilterProp="children"
                              onChange={(changedValues, allValues) =>
                                handleKeyPress(changedValues, allValues, i)
                              }
                            >
                              {props.data[i]?.Mode !== undefined &&
                                (props.data[i]?.Mode
                                  ? props.responseDataArray[i]?.grade.rows.map(
                                      (option) => (
                                        <Option
                                          style={{
                                            textTransform: "capitalize",
                                            color: "#1777C4",
                                          }}
                                          key={
                                            option[
                                              props.responseDataArray[i].grade
                                                .fields[0].name
                                            ]
                                          }
                                          value={
                                            option[
                                              props.responseDataArray[i].grade
                                                .fields[0].name
                                            ]
                                          }
                                        >
                                          {
                                            option[
                                              props.responseDataArray[i].grade
                                                .fields[1].name
                                            ]
                                          }
                                        </Option>
                                      )
                                    )
                                  : edi
                                  ? gradef[i]
                                  : null)}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "cost_code"]}
                            fieldKey={[fieldKey, "cost_code"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              { required: true, message: "Missing Name" },
                            ]}
                          >
                            <Select
                              bordered={true}
                              style={{
                                width: "110%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select Cost Center"
                              optionFilterProp="children"
                            >
                              {props.ad.COST_CODE.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[props.ad.COST_CODE.fields[0].name]
                                    }
                                    value={
                                      option[props.ad.COST_CODE.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.COST_CODE.fields[1].name]}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "actual_bal"]}
                            fieldKey={[fieldKey, "actual_bal"]}
                            rules={[]}
                          >
                            <Input
                              style={{
                                width: "80%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",
                                // fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              placeholder=""
                              type="number"
                              disabled
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "no_of_pcs"]}
                            fieldKey={[fieldKey, "no_of_pcs"]}
                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "",
                            //   },
                            //   {
                            //     type: "number",
                            //     message: "",
                            //   },
                            // ]}
                          >
                            <Input
                              style={{
                                textAlign: "right !important",
                                width: "80%",
                                backgroundColor: "white",
                                color: "#000000",

                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              type="number"
                              id={pcsRef}
                              ref={pcsRef}
                              className={classes["ant-input-number-input1"]}
                              placeholder="Enter No Of Pcs"
                            />
                          </Form.Item>
                        </td>

                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "qty"]}
                            fieldKey={[fieldKey, "qty"]}
                            // rules={[
                            //   {
                            //     type: "number",
                            //     min: 0,
                            //     message:
                            //       "Quantity should be a non-negative number!",
                            //   },
                            // ]}
                          >
                            <Input
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",

                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              placeholder="Enter Quantity"
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
                              // formatter={(value) => {
                              //   console.log(value);
                              //   const numberValue = parseFloat(value);
                              //   // Format the number to always display three decimal places
                              //   return numberValue.toFixed(3);
                              // }}
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "uom_code"]}
                            fieldKey={[fieldKey, "uom_code"]}

                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              bordered={true}
                              style={{
                                width: "80%",
                                textAlign: "left",
                                float: "left",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              placeholder="Select Uom"
                              optionFilterProp="children"
                            >
                              {console.log(uomf[i])}
                              {props.data[i]?.Mode !== undefined &&
                                (props.data[i]?.Mode
                                  ? props.responseDataArray[i]?.uom.rows.map(
                                      (option) => (
                                        <Option
                                          style={{
                                            textTransform: "capitalize",
                                            color: "#1777C4",
                                          }}
                                          key={
                                            option[
                                              props.responseDataArray[i].uom
                                                .fields[0].name
                                            ]
                                          }
                                          value={
                                            option[
                                              props.responseDataArray[i].uom
                                                .fields[0].name
                                            ]
                                          }
                                        >
                                          {
                                            option[
                                              props.responseDataArray[i].uom
                                                .fields[1].name
                                            ]
                                          }
                                        </Option>
                                      )
                                    )
                                  : edi
                                  ? uomf[i]
                                  : null)}
                            </Select>
                          </Form.Item>
                        </td>
                        {/* <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "rate"]}
                            fieldKey={[fieldKey, "rate"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              {
                                required: true,
                                message: "Field should not be blank!!",
                              },
                              {
                                type: "number",
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              //   onChange={(changedValues, allValues) =>
                              //     handleChangee(changedValues, allValues, i)
                              //   }
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter invoice rate"
                              type="number"
                            />
                          </Form.Item>
                        </td> */}
                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "remark"]}
                            fieldKey={[fieldKey, "remark"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              {
                                required: true,
                                message: "Field should not be blank!!",
                              },
                            ]}
                          >
                            <Input
                              //   onChange={(changedValues, allValues) =>
                              //     handleChangee(changedValues, allValues, i)
                              //   }
                              style={{
                                width: "100%",
                                textAlign: "left",
                                backgroundColor: "white",

                                color: "#000000",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              placeholder="Enter Purpose"
                            />
                          </Form.Item>
                        </td>

                        {/* <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "amt"]}
                            fieldKey={[fieldKey, "amt"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Input
                              style={{
                                width: "100%",
                                float: "right",
                                backgroundColor: "white",
                                color: "#1777C4",
                                fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder=""
                              type="number"
                            />
                          </Form.Item>
                        </td> */}

                        {/* onChange={handleChangee} */}
                        <td
                          style={{
                            border: "1px solid white",
                            // border: "2px solid red",
                            width: "8%",
                            textAlign: "left",
                          }}
                        >
                          <MinusCircleOutlined
                            className={classes["Remove"]}
                            onClick={() => {
                              console.log(i, "in add button");
                              setDeletedIndex(i);
                              setEdi(true); // Set p
                              // const updatedResponseDataArray = [
                              //   ...props.responseDataArray,
                              // ];
                              remove(name);
                              // handleMinusClick(i);
                              // props.setResponseDataArray((prevData) => {
                              //   // Create a copy of responseDataArray
                              //   const updatedResponseDataArray = [...prevData];
                              //   // Remove the item at index 'i' from updatedResponseDataArray
                              //   updatedResponseDataArray.splice(i, 1);
                              //   return updatedResponseDataArray;
                              // });
                            }}
                          />

                          <PlusCircleOutlined
                            className={classes["Add"]}
                            onClick={(i) => {
                              console.log(i, "in add button");
                              setEdi(true); // Set props.setEditDode to false when the plus icon is clicked

                              add();
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}

                {/* <Form.Item>
                  <Button
                    type="dashed"
                    id="add_item"
                    onClick={() => {
                      add();
                    }}
                  ></Button>
                </Form.Item> */}
              </>
            );
          }}
        </Form.List>
      </div>
    </Form>
  ) : (
    <>
      {props.data.map((data, index) => {
        return (
          <div key={index}>
            <p></p>
            <Row
              className={props.editMode ? classes["RowDEX"] : classes["RowD"]}
            >
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.ITEM_CODE}
                type="Select"
                name="Item"
                value={data.item_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.SIZE_CODE}
                type="Select"
                name="Item Size"
                value={data.size_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.QUALITY_CODE}
                type="Select"
                name="Item Quality"
                value={data.quality_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.UOM_CODE}
                type="Select"
                name="Uom"
                value={data.uom_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.COST_CODE}
                type="Select"
                name="Cost Center"
                value={data.cost_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="Available Quantity"
                value={data.actual_bal}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="Pcs No"
                value={data.no_of_pcs}
              />

              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="Purpose"
                value={data.remark}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="Quantity"
                value={data.qty}
              />
            </Row>
            <p></p>
          </div>
        );
      })}
    </>
  );
};

export default SizeDetail;
