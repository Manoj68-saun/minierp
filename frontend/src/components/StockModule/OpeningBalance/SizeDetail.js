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
  const [edi, setEdi] = useState(false);
  const pcsRef = useRef(null);
  const sizeRef = useRef(null);
  const [form] = Form.useForm();

  const handlechangee1 = async (changedValues, allValues, i) => {
    console.log(pcsRef.current.value);
    setEdi(true);
    props.setEditDode(false);
    const values = form.getFieldsValue(["openingDetail"]);
    // Reset the value of PCS field to null
    console.log(values);

    values.openingDetail[i].size_code = null;
    values.openingDetail[i].uom_code = null;
    values.openingDetail[i].quality_code = null;
    // Set the updated values back to the form
    form.setFieldsValue(values);

    // props.setData((prevData) => ({
    //   ...prevData,
    //   openingDetail: [
    //     {
    //       ...prevData.openingDetail[0],
    //       pcs: null,
    //     },
    //   ],
    // }));

    // props.setData((prevData) => ({
    //   ...prevData,
    //   openingDetail: prevData.openingDetail.map((detail, index) => {
    //     if (index === i) {
    //       return {
    //         ...detail,
    //         pcs: null, // Set pcs to null for the current item
    //       };
    //     }
    //     return detail;
    //   }),
    // }));

    pcsRef.current.value = null;
    sizeRef.current.value = null;

    props.setData((data) => {
      console.log(data);
      console.log(i);

      axios
        .get(
          employeeData.URL +
            "/api/v1/opening/additional-data-of-hsn/ " +
            data.openingDetail[i].item_code,
          {
            withCredentials: true,
          }
        )

        .then((response) => {
          console.log(response);

          setSizef(
            response.data.data.size.rows.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option[response.data.data.size.fields[0].name]}
                  value={option[response.data.data.size.fields[0].name]}
                >
                  {option[response.data.data.size.fields[1].name]}
                </Option>
              );
            })
          );

          setGradef(
            response.data.data.grade.rows.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option[response.data.data.grade.fields[0].name]}
                  value={option[response.data.data.grade.fields[0].name]}
                >
                  {option[response.data.data.grade.fields[1].name]}
                </Option>
              );
            })
          );

          setUomf(
            response.data.data.uom.rows.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option[response.data.data.uom.fields[0].name]}
                  value={option[response.data.data.uom.fields[0].name]}
                >
                  {option[response.data.data.uom.fields[1].name]}
                </Option>
              );
            })
          );
        });

      return {
        ...data,
      };
    });
  };

  const handleKeyPress = (e, i) => {
    console.log(e);
    console.log(i, "iiii");
    props.setData((data) => {
      const itemCode = data.openingDetail[i].item_code;
      const quantity = data.openingDetail[i].quantity;
      const qualityCode = data.openingDetail[i].quality_code;
      const sizeCode = data.openingDetail[i].size_code;
      const stockDate = data.openingBalance[0].stock_date;
      const storeCode = data.openingBalance[0].store_code;

      // Make the API call only if the quantity has changed
      if (e.key === "Enter") {
        axios
          .get(employeeData.URL + "/api/v1/opening/ope-ningb-alance", {
            params: {
              item_code: itemCode,
              quantity: quantity,
              quality_code: qualityCode,
              size_code: sizeCode,
              stock_date: stockDate,
              store_code: storeCode,
            },
            withCredentials: true,
          })
          .then((response) => {
            data.openingDetail[i].avg_wt =
              response.data.data.OpenningValue.rows[0].stock_with_opbal;
            // Handle the response data if needed
            //data.openingDetail[0].avg_wt
          })
          .catch((error) => {
            console.error("Error fetching opening balance:", error);
            // Handle the error if needed
          });
      }
      return {
        ...data,
      };
    });
  };

  const handleChangee = (changedValues, allValues, i) => {
    props.setData((data) => {
      const Qty = data.openingDetail[i].quantity;
      console.log(Qty);

      //   const itemCode = data.openingDetail[i].item_code;
      //   const quantity = data.openingDetail[i].quantity;
      //   const qualityCode = data.openingDetail[i].quality_code;
      //   const sizeCode = data.openingDetail[i].size_code;
      //   const stockDate = data.openingBalance[0].stock_date;
      //   const storeCode = data.openingBalance[0].store_code;

      //   // Make the API call only if the quantity has changed

      //   axios
      //     .get(employeeData.URL + "/api/v1/opening/ope-ningb-alance", {
      //       params: {
      //         item_code: itemCode,
      //         quantity: quantity,
      //         quality_code: qualityCode,
      //         size_code: sizeCode,
      //         stock_date: stockDate,
      //         store_code: storeCode,
      //       },
      //       withCredentials: true,
      //     })
      //     .then((response) => {
      //       console.log(response);
      //       // Handle the response data if needed
      //     })
      //     .catch((error) => {
      //       console.error("Error fetching opening balance:", error);
      //       // Handle the error if needed
      //     });

      const Rate = data.openingDetail[i].rate;
      console.log(Rate);
      let amt = 0; // Initialize amount to 0 by default

      // Check if rate is not null or undefined before performing calculation
      //   if (Qty && Rate) {
      //     data.openingDetail[i].amt = Qty * Rate; // Calculate and assign the amount directly
      //   } else {
      //     data.openingDetail[i].amt = 0; // Set amount to 0 if Qty or Rate is null or undefined
      //   }
      // Check if both Qty and Rate are not null or undefined before performing calculation
      if (
        Qty !== null &&
        Qty !== undefined &&
        Rate !== null &&
        Rate !== undefined
      ) {
        data.openingDetail[i].amt = Qty * Rate; // Calculate and assign the amount directly
      }
      // Create a new object with the updated amount
      //   const updatedOpeningDetail = [...data.openingDetail]; // Create a copy of the openingDetail array
      const updatedOpeningDetail = [...data.openingDetail]; // Update the amt field for the item at index i

      // Return a new state object with the updated openingDetail array
      return {
        ...data,
        openingDetail: updatedOpeningDetail,
      };
    });
  };

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        openingDetail: allValues.openingDetail,
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
        <Form.List name="openingDetail" initialValue={props.data}>
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
                          Qty
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

                        <th style={{}}>Avg. Weight</th>
                        <th style={{}}>Amount</th>
                        <th>
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
                            height: "25px",
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

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "pcs"]}
                            fieldKey={[fieldKey, "pcs"]}
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
                              placeholder="Enter Pcs"
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
                            name={[name, "quantity"]}
                            fieldKey={[fieldKey, "quantity"]}
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
                              onChange={(changedValues, allValues) =>
                                handleChangee(changedValues, allValues, i)
                              }
                              onKeyPress={(e) => handleKeyPress(e, i)}
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
                              placeholder="Enter Quantity"
                              //    step={0.01}
                              decimalScale={2}
                              type="number"

                              // formatter={value => <NumberFormat value={value} displayType={'text'}  decimalScale={2} step={0.01} />}
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
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
                              onChange={(changedValues, allValues) =>
                                handleChangee(changedValues, allValues, i)
                              }
                              style={{
                                width: "100%",
                                textAlign: "right",
                                color: "#000000",
                                // fontWeight: "bold",

                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder="Enter Rate"
                              type="number"
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "avg_wt"]}
                            fieldKey={[fieldKey, "avg_wt"]}
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
                              placeholder=""
                              type="number"
                              disabled
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
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
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",
                                // fontWeight: "bold",
                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={false}
                              placeholder=""
                              type="number"
                              disabled
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

                <Form.Item>
                  <Button
                    type="dashed"
                    id="add_item"
                    style={{ display: "none" }}
                    onClick={() => {
                      add();
                    }}
                  ></Button>
                </Form.Item>
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
                value={data.quality_code}
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
                name="PCS NO"
                value={data.pcs}
              />

              <DataField
                editMode={false}
                lg={12}
                md={24}
                name="QUANTITY"
                value={data.quantity}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="RATE"
                value={data.rate}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name="AVERAGE WEIGHT"
                value={data.avg_wt}
              />
              <DataField
                editMode={false}
                lg={8}
                md={24}
                name=" TOTAL AMOUNT"
                value={data.itemqtyamount}
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
