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
  const pcsRef = useRef(null);
  const sizeRef = useRef(null);
  const [form] = Form.useForm();
  const [cost, setCost] = useState([]);
  const [itemindex, setItemindex] = useState();
  const [edi, setEdi] = useState(false);
  const handlechangee1 = async (changedValues, allValues, i) => {
    setItemindex(i);
    setEdi(true);
    console.log(pcsRef.current.value);
    setSizef(sizef);
    const values = form.getFieldsValue(["issueDetail"]);

    console.log(values);

    values.issueDetail[i].size_code = null;
    values.issueDetail[i].uom_code = null;
    values.issueDetail[i].quality_code = null;

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
            data.issueDetail[i].item_code,
          {
            withCredentials: true,
          }
        )

        .then((response) => {
          console.log(response);

          setSizef((prevSizef) => {
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

          setUomf((prevUomf) => {
            const newUomf = [...prevUomf];
            newUomf[i] = response.data.data.uom.rows.map((option) => (
              <Option
                style={{ textTransform: "capitalize", color: "#1777C4" }}
                key={option[response.data.data.uom.fields[0].name]}
                value={option[response.data.data.uom.fields[0].name]}
              >
                {option[response.data.data.uom.fields[1].name]}
              </Option>
            ));
            return newUomf;
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
      const itemCode = data.issueDetail[i].item_code;
      const quantity = data.issueDetail[i].quantity;
      const qualityCode = data.issueDetail[i].quality_code;
      const sizeCode = data.issueDetail[i].size_code;
      const stockDate = data.issueHdr[0].issue_date;

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
          data.issueDetail[i].actual_bal =
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
        issueDetail: allValues.issueDetail,
        // invoiceSize1: changedValues.invoiceSize,
      };
    });
  };

  return props.editMode ? (
    <Form
      layout="vertical"
      name="filter_form"
      onValuesChange={handleValueChanges}
      autoComplete="off"
      form={form}
    >
      <div className="component-container">
        <Form.List name="issueDetail" initialValue={props.data}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, i) => (
                  <table
                    id="table_order"
                    className="table table-bordered"
                    style={{
                      tableLayout: "fixed",
                      width: "1350px",
                      marginBottom: "-2rem",
                    }}
                  >
                    {i == 0 && (
                      <tr
                        style={{
                          height: "0.4rem",
                          backgroundColor: "rgb(217 217 217 / 35%)",
                          // display: "inline-block",
                          // border: "2px solid red",
                          // width: "100vw",
                          marginTop: "-1px",
                        }}
                      >
                        <th style={{ width: "12%" }}>
                          {" "}
                          Item{" "}
                          <span
                            style={{
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
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
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        </th>
                        <th style={{}}>
                          Grade
                          <span
                            style={{
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        </th>
                        <th style={{}}>
                          Cost Center
                          <span
                            style={{
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        </th>
                        <th style={{}}>Avail. Qty </th>
                        <th style={{}}>
                          Pcs{" "}
                          <span
                            style={{
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        </th>
                        <th style={{}}>
                          Quantity{""}
                          <span
                            style={{
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        </th>
                        <th style={{}}>
                          Rate
                          <span
                            style={{
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
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
                              backgroundColor: "rgb(217 217 217 /  -0.65%)",
                              color: "red",
                            }}
                          >
                            *
                          </span>
                        </th>
                        <th style={{ width: "8%", textAlign: "left" }}>#</th>
                      </tr>
                    )}

                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "12%",
                            // height: "25px",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
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
                              bordered={false}
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
                              placeholder="Select"
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
                                    {option[props.ad.ITEM_CODE.fields[1].name]}
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

                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              // why sizef  is not getting updated

                              bordered={false}
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
                              ref={sizeRef}
                              placeholder="Select"
                              optionFilterProp="children"
                              // defaultValue={props.editDode ? undefined : ""}
                            >
                              {/* {edi && sizef[i] && sizef[i].length > 0
                                ? sizef[i]
                                : props.editDode
                                ? props.responseDataArray[i].size.rows.map(
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
                                : null} */}

                              {props.data[i]?.Mode !== undefined
                                ? props.responseDataArray[i]?.size.rows.map(
                                    (option) => (
                                      <Option
                                        style={{
                                          textTransform: "capitalize",
                                          color: "#1777C4",
                                        }}
                                        key={
                                          option[
                                            props.responseDataArray[0].size
                                              .fields[0].name
                                          ]
                                        }
                                        value={
                                          option[
                                            props.responseDataArray[0].size
                                              .fields[0].name
                                          ]
                                        }
                                      >
                                        {
                                          option[
                                            props.responseDataArray[1].size
                                              .fields[1].name
                                          ]
                                        }
                                      </Option>
                                    )
                                  )
                                : null}
                              {edi ? sizef[i] : null}
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
                              bordered={false}
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
                              placeholder="Select"
                              optionFilterProp="children"
                              onChange={(changedValues, allValues) =>
                                handleKeyPress(changedValues, allValues, i)
                              }
                            >
                              {props.data[i]?.Mode !== undefined
                                ? props.responseDataArray[i]?.grade.rows.map(
                                    (option) => (
                                      <Option
                                        style={{
                                          textTransform: "capitalize",
                                          color: "#1777C4",
                                        }}
                                        key={
                                          option[
                                            props.responseDataArray[0].grade
                                              .fields[0].name
                                          ]
                                        }
                                        value={
                                          option[
                                            props.responseDataArray[0].grade
                                              .fields[0].name
                                          ]
                                        }
                                      >
                                        {
                                          option[
                                            props.responseDataArray[1].grade
                                              .fields[1].name
                                          ]
                                        }
                                      </Option>
                                    )
                                  )
                                : null}
                              {edi ? gradef[i] : null}
                            </Select>
                          </Form.Item>
                        </td>

                        <td
                          style={{
                            width: "10%",
                            height: "25px",
                            border: "1px solid white",
                          }}
                        >
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
                              bordered={false}
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
                              placeholder="Select"
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
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",
                                // fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Available Quantity"
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
                            rules={[
                              {
                                // required: true,
                                message: "",
                              },
                              {
                                type: "number",
                                message: "",
                              },
                            ]}
                          >
                            <Input
                              style={{
                                textAlign: "right !important",
                                width: "100%",
                                backgroundColor: "white",
                                color: "#000000",
                                // fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              type="number"
                              id={pcsRef}
                              ref={pcsRef}
                              className={classes["ant-input-number-input1"]}
                              placeholder="Enter No Of Pcs"
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "qty"]}
                            fieldKey={[fieldKey, "qty"]}
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
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",
                                // fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter Qty"
                              type="number"
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
                              //   onKeyPress={(e) => handleKeyPress(e, i)}
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",
                                // fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter Rate"
                              //    step={0.01}
                              decimalScale={2}
                              type="number"

                              // formatter={value => <NumberFormat value={value} displayType={'text'}  decimalScale={2} step={0.01} />}
                            />
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
                            name={[name, "uom_code"]}
                            fieldKey={[fieldKey, "uom_code"]}

                            // label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            // rules={[{ required: true, message: 'Missing Name' }]}
                          >
                            <Select
                              bordered={false}
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
                              placeholder="Select"
                              optionFilterProp="children"
                            >
                              {props.data[i]?.Mode !== undefined
                                ? props.responseDataArray[i]?.uom.rows.map(
                                    (option) => (
                                      <Option
                                        style={{
                                          textTransform: "capitalize",
                                          color: "#1777C4",
                                        }}
                                        key={
                                          option[
                                            props.responseDataArray[0].uom
                                              .fields[0].name
                                          ]
                                        }
                                        value={
                                          option[
                                            props.responseDataArray[0].uom
                                              .fields[0].name
                                          ]
                                        }
                                      >
                                        {
                                          option[
                                            props.responseDataArray[1].uom
                                              .fields[1].name
                                          ]
                                        }
                                      </Option>
                                    )
                                  )
                                : null}
                              {edi ? uomf[i] : null}
                            </Select>
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
                              remove(name);
                            }}
                          />

                          <PlusCircleOutlined
                            className={classes["Add"]}
                            onClick={(i) => {
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
                    style={{ display: "none" }}
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
                name="ITEM"
                value={data.item_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.SIZE_CODE}
                type="Select"
                name="ITEM SIZE"
                value={data.size_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.QUALITY_CODE}
                type="Select"
                name="ITEM QUALITY"
                value={data.qualty_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.UOM_CODE}
                type="Select"
                name="UOM"
                value={data.uom_code}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                options={props.ad.COST_CODE}
                type="Select"
                name="COST CENTER"
                value={data.cost_code}
              />

              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="AVAILABLE QUANTITY"
                value={data.actual_bal}
              />
              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="PCS NO"
                value={data.no_of_picces}
              />

              {/* <DataField
                editMode={false}
                lg={12}
                md={24}
                name="PURPOSE"
                value={data.remark}
              /> */}
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="QUANTITY"
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
