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

const Consumption = (props) => {
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
  const [totalQuantity, setTotalQuantity] = useState(0); // State to hold total quantity sum
  // const sizeRef = useRef(null);
  const [form] = Form.useForm();

  const handleCurrentReadingChange = (e, index) => {
    const newValue = e.target.value;
    const updatedValues = form.getFieldsValue();
    updatedValues.prodElecDet[index].current_reading = newValue;

    const updatedData = calculatePmtUnits(updatedValues);

    props.setData((prevData) => ({
      ...prevData,
      prodElecDet: updatedData,
    }));

    form.setFieldsValue({
      prodElecDet: updatedData,
    });
  };

  const handlechangee1 = async (changedValues, allValues, i) => {
    props.setData((data) => {
      console.log(data);
      console.log(i);

      axios
        .get(
          employeeData.URL +
            "/api/v1/dailyprod/additional-data-of-hsn/ " +
            data.prodElecDet[i].meter_no,
          {
            withCredentials: true,
          }
        )

        .then((response) => {
          console.log(response);
          const updatedData = { ...data };
          updatedData.prodElecDet[i].rate_unit =
            response.data.data.size.rows[0].rate_per_unit;
          // Update the form field directly
          form.setFieldsValue({
            prodElecDet: updatedData.prodElecDet,
          });
        });

      return {
        ...data,
      };
    });
  };

  const handleValueChanges = (changedValues, allValues) => {
    console.log(props.data);
    props.setData((data) => {
      return {
        ...data,
        prodElecDet: allValues.prodElecDet,
        // invoiceSize1: changedValues.invoiceSize,
      };
    });
  };

  const calculatePmtUnits = (allValues) => {
    return allValues.prodElecDet.map((item) => {
      const currentReading = parseFloat(item.current_reading) || 0;
      const previousReading = parseFloat(item.reading) || 0;
      const pmtUnit = currentReading - previousReading;
      return {
        ...item,
        pmt_unit: pmtUnit,
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
        <Form.List name="prodElecDet" initialValue={props.data}>
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
                            Meter No{" "}
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
                            Rate unit{" "}
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
                            Previous Reading{" "}
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
                            Current Reading{" "}
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
                            Unit Consumption{" "}
                            <span
                              style={{
                                backgroundColor: "rgb(217 217 217 / -0.65%)",
                                color: "red",
                              }}
                            >
                              *
                            </span>
                          </th>

                          <th style={{ width: "8%", textAlign: "left" }}>#</th>
                        </tr>
                      </thead>
                    )}

                    <tbody>
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
                            name={[name, "meter_no"]}
                            fieldKey={[fieldKey, "meter_no"]}
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
                              {props.ad.METER_CODE.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[props.ad.METER_CODE.fields[0].name]
                                    }
                                    value={
                                      option[props.ad.METER_CODE.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.METER_CODE.fields[1].name]}{" "}
                                    {option[props.ad.METER_CODE.fields[0].name]}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "rate_unit"]}
                            fieldKey={[fieldKey, "rate_unit"]}
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
                              // onChange={(e) =>
                              //   handleQuantityChange(i, e.target.value)
                              // }
                              bordered={true}
                              placeholder=""
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "reading"]}
                            fieldKey={[fieldKey, "reading"]}
                            initialValue={
                              i > 0 ? props.data[i - 1].current_reading : ""
                            }
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
                              // onChange={(e) =>
                              //   handleQuantityChange(i, e.target.value)
                              // }
                              bordered={true}
                              placeholder=""
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
                            />
                          </Form.Item>
                        </td>

                        <td style={{ border: "1px solid white" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "current_reading"]}
                            fieldKey={[fieldKey, "current_reading"]}
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
                              onChange={(e) => handleCurrentReadingChange(e, i)}
                              type="number"
                              id={pcsRef}
                              ref={pcsRef}
                              className={classes["ant-input-number-input1"]}
                              placeholder="Enter "
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
                            name={[name, "pmt_unit"]}
                            fieldKey={[fieldKey, "pmt_unit"]}
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
                              // onChange={(e) =>
                              //   handleQuantityChange(i, e.target.value)
                              // }
                              bordered={true}
                              placeholder="Enter Quantity"
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
                            />
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
                              console.log(i, "in add button");
                              setDeletedIndex(i);
                              setEdi(true);

                              remove(name);
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

export default Consumption;
