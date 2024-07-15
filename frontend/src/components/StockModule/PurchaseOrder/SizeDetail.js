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
  // this for tally key next item
  const itemCodeRef = useRef(null);
  const sizeCodeRef = useRef(null);
  const uomCodeRef = useRef(null);
  const qualityCodeRef = useRef(null);
  const quantityRef = useRef(null);
  const purposeRef = useRef(null);

  const [form] = Form.useForm();
  // for select dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [isOpeng, setIsOpeng] = useState(false);
  const [openStates, setOpenStates] = useState({});
  const qualityCodeRefs = useRef({});
  const quantityRefs = useRef({});
  const itemCodeRefs = useRef({});
  const sizeCodeRefs = useRef({});
  const basicRateRefs = useRef({});
  const DiscountOnRefs = useRef({});
  const DiscountValRefs = useRef({});
  const DiscountTypeRefs = useRef({});
  const purposeRefs = useRef({});

  const handlechangee1 = async (changedValues, allValues, i) => {
    console.log(i, "after item change");
    // console.log(props.data[i].Mode, "this is mode");
    setItemindex(i);
    setEdi(true);
    // console.log(pcsRef.current.value);
    setSizef(sizef);
    const values = form.getFieldsValue(["purreqDetail"]);

    console.log(values);
    // Check if Mode is true or present, then set it to false
    // if (props.data[i].Mode === true) {
    //   props.data[i].Mode = false;
    // }
    values.purreqDetail[i].Mode = false;
    values.purreqDetail[i].size_code = null;
    values.purreqDetail[i].uom_code = null;
    values.purreqDetail[i].quality_code = null;

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
            data.purreqDetail[i].item_code,
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
            values.purreqDetail[i].uom_code = uomOptions[0].value;
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

          // setCost((prevCost) => {
          //   const newCost = [...prevCost];
          //   newCost[i] = response.data.data.cost.rows.map((option) => (
          //     <Option
          //       style={{ textTransform: "capitalize", color: "#1777C4" }}
          //       key={option[response.data.data.cost.fields[0].name]}
          //       value={option[response.data.data.cost.fields[0].name]}
          //     >
          //       {option[response.data.data.cost.fields[1].name]}
          //     </Option>
          //   ));
          //   return newCost;
          // });
        });

      return {
        ...data,
      };
    });
  };

  const handlePurposeKeyPress = (e, add) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
      setTimeout(() => {
        const newRowIndex = props.data.length;
        itemCodeRefs.current[newRowIndex]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e, index, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!openStates[`${field}_${index}`]) {
        setOpenStates((prev) => ({ ...prev, [`${field}_${index}`]: true }));
      } else {
        const selectedValue = form.getFieldValue([
          "purreqDetail",
          index,
          field,
        ]);
        if (selectedValue) {
          setOpenStates((prev) => ({ ...prev, [`${field}_${index}`]: false }));
          if (field === "item_code") {
            sizeCodeRefs.current[index]?.focus();
          } else if (field === "size_code") {
            qualityCodeRefs.current[index]?.focus();
          } else if (field === "quality_code") {
            quantityRefs.current[index]?.focus();
          }
          // else if (field === "total_qty") {
          //   basicRateRefs.current[index]?.focus();
          // }
          // else if (field === "rate") {
          //   DiscountOnRefs.current[index]?.focus();
          // }
          else if (field === "discount_on") {
            DiscountValRefs.current[index]?.focus();
          } else if (field === "dis_type") {
            purposeRefs.current[index]?.focus();
          }
        }
      }
    }
  };

  const handleDropdownVisibleChange = (visible, index, field) => {
    setOpenStates((prev) => ({ ...prev, [`${field}_${index}`]: visible }));
  };

  const handleKeyPress = (e, nextRef, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current && nextRef.current[index]) {
        nextRef.current[index].focus();
      }
    }
  };

  ///////////////////////////
  const handleRateChange = (value, index) => {
    const total_qty = form.getFieldValue(["purreqDetail", index, "total_qty"]);
    const discount_on = form.getFieldValue([
      "purreqDetail",
      index,
      "discount_on",
    ]);
    const discount_type = form.getFieldValue([
      "purreqDetail",
      index,
      "discount_type",
    ]);
    const discount = form.getFieldValue(["purreqDetail", index, "discount"]); // Assuming there's a discount field

    let rate1 = value;
    let amount = value * total_qty;
    let amount2 = amount;

    if (discount_on === "r" && discount_type === "p") {
      rate1 = value * (1 - discount / 100);
      amount2 = total_qty * rate1;
    }

    form.setFieldsValue({
      purreqDetail: {
        [index]: {
          rate1,
          amount,
          amount2,
        },
      },
    });
  };

  const handleValueChanges = (changedValues, allValues) => {
    props.setData((data) => {
      return {
        ...data,
        purreqDetail: allValues.purreqDetail,
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
        <Form.List name="purreqDetail" initialValue={props.data}>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, i) => (
                  <table
                    id="table_order"
                    className="table table-bordered"
                    style={{
                      tableLayout: "fixed",
                      width: "1600px",
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
                          <th style={{}}>
                            Basic Rate{" "}
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
                            Amount{" "}
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
                            Discount On{" "}
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
                            Dis. Val.{" "}
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
                            Dis. Type{" "}
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
                            Rate{" "}
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
                            Gross Amount{" "}
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
                              showSearch
                              ref={(el) => (itemCodeRefs.current[i] = el)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, i, "item_code")
                              }
                              open={openStates[`item_code_${i}`]}
                              bordered={true}
                              onDropdownVisibleChange={(visible) =>
                                handleDropdownVisibleChange(
                                  visible,
                                  i,
                                  "item_code"
                                )
                              }
                              // onKeyPress={(e) => handleKeyPress(e, sizeCodeRef)}
                              onChange={(changedValues, allValues) =>
                                handlechangee1(changedValues, allValues, i)
                              }
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
                              showSearch
                              // ref={sizeCodeRef}
                              // onKeyPress={(e) => handleKeyPress(e, uomCodeRef)}

                              ref={(el) => (sizeCodeRefs.current[i] = el)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, i, "size_code")
                              }
                              open={openStates[`size_code_${i}`]}
                              bordered={true}
                              onDropdownVisibleChange={(visible) =>
                                handleDropdownVisibleChange(
                                  visible,
                                  i,
                                  "size_code"
                                )
                              }
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
                              // ref={props.sizeRef}
                              id="sizewala"
                              placeholder="Select Size"
                              optionFilterProp="children"
                            >
                              {console.log(i, "i in the size ")}
                              {console.log(sizef, " mode false ")}
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
                          >
                            <Select
                              showSearch
                              ref={(el) => (qualityCodeRefs.current[i] = el)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, i, "quality_code")
                              }
                              open={openStates[`quality_code_${i}`]}
                              bordered={true}
                              onDropdownVisibleChange={(visible) =>
                                handleDropdownVisibleChange(
                                  visible,
                                  i,
                                  "quality_code"
                                )
                              }
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

                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "total_qty"]}
                            fieldKey={[fieldKey, "total_qty"]}
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
                              ref={(el) => (quantityRefs.current[i] = el)}
                              onKeyPress={(e) =>
                                handleKeyPress(e, basicRateRefs, i)
                              }
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
                              // ref={uomCodeRef}
                              // onKeyDown={(e) => {
                              //   if (e.key === "Enter") {
                              //     e.preventDefault();
                              //     purposeRef.current.focus();
                              //   }
                              // }}
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
                          >
                            <Input
                              ref={(el) => (basicRateRefs.current[i] = el)}
                              onKeyPress={(e) =>
                                handleKeyPress(e, DiscountOnRefs, i)
                              }
                              onChange={(e) =>
                                handleRateChange(e.target.value, i)
                              }
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",

                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              placeholder="Enter Rate"
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
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
                            name={[name, "amount"]}
                            fieldKey={[fieldKey, "amount"]}
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
                              placeholder="Amount"
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
                              disabled={true}
                              // formatter={(value) => {
                              //   console.log(value);
                              //   const numberValue = parseFloat(value);
                              //   // Format the number to always display three decimal places
                              //   return numberValue.toFixed(3);
                              // }}
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
                            name={[name, "discount_on"]}
                            fieldKey={[fieldKey, "discount_on"]}
                            rules={[
                              { required: true, message: "Missing Name" },
                            ]}
                          >
                            <Select
                              showSearch
                              ref={(el) => (DiscountOnRefs.current[i] = el)}
                              onKeyDown={(e) =>
                                handleKeyDown(e, i, "discount_on")
                              }
                              open={openStates[`discount_on${i}`]}
                              bordered={true}
                              // onDropdownVisibleChange={(visible) =>
                              //   handleDropdownVisibleChange(
                              //     visible,
                              //     i,
                              //     "item_code"
                              //   )
                              // }
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
                              {props.ad.Dis_On.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={option[props.ad.Dis_On.fields[0].name]}
                                    value={
                                      option[props.ad.Dis_On.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.Dis_On.fields[1].name]}{" "}
                                  </Option>
                                );
                              })}
                            </Select>
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
                            name={[name, "discount"]}
                            fieldKey={[fieldKey, "discount"]}
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
                              ref={(el) => (DiscountValRefs.current[i] = el)}
                              onKeyPress={(e) =>
                                handleKeyPress(e, DiscountTypeRefs, i)
                              }
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",

                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              placeholder="Enter Value"
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

                        <td
                          style={{
                            textAlign: "right",
                            border: "1px solid white",
                          }}
                        >
                          <Form.Item
                            // style={{ border: "2px solid red" }}
                            {...restField}
                            name={[name, "dis_type"]}
                            fieldKey={[fieldKey, "dis_type"]}
                            //  label={<div style={{ padding: "0rem 0.5rem", fontSize: "0.6rem", fontWeight: "bold" }} className={classes['Label']}></div>}
                            rules={[
                              { required: true, message: "Missing Name" },
                            ]}
                          >
                            <Select
                              showSearch
                              ref={(el) => (DiscountTypeRefs.current[i] = el)}
                              onKeyDown={(e) => handleKeyDown(e, i, "dis_type")}
                              open={openStates[`dis_type${i}`]}
                              bordered={true}
                              // onDropdownVisibleChange={(visible) =>
                              //   handleDropdownVisibleChange(
                              //     visible,
                              //     i,
                              //     "item_code"
                              //   )
                              // }
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
                              {props.ad.Dis_Type.rows.map((option) => {
                                return (
                                  <Option
                                    style={{
                                      textTransform: "capitalize",
                                      color: "#1777C4",
                                    }}
                                    key={
                                      option[props.ad.Dis_Type.fields[0].name]
                                    }
                                    value={
                                      option[props.ad.Dis_Type.fields[0].name]
                                    }
                                  >
                                    {option[props.ad.Dis_Type.fields[1].name]}{" "}
                                  </Option>
                                );
                              })}
                            </Select>
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
                            name={[name, "rate1"]}
                            fieldKey={[fieldKey, "rate1"]}
                          >
                            <Input
                              // ref={(el) => (quantityRefs.current[i] = el)}
                              // onKeyPress={(e) =>
                              //   handleKeyPress(e, purposeRefs, i)
                              // }
                              style={{
                                width: "100%",
                                textAlign: "right",
                                backgroundColor: "white",
                                color: "#000000",

                                boxShadow:
                                  "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                              }}
                              bordered={true}
                              placeholder="final rate"
                              step={0.01}
                              decimalScale={2}
                              type="number"
                              min={0}
                              disabled={true}
                              // formatter={(value) => {
                              //   console.log(value);
                              //   const numberValue = parseFloat(value);
                              //   // Format the number to always display three decimal places
                              //   return numberValue.toFixed(3);
                              // }}
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
                            name={[name, "amount2"]}
                            fieldKey={[fieldKey, "amount2"]}
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
                              // ref={(el) => (quantityRefs.current[i] = el)}
                              // onKeyPress={(e) =>
                              //   handleKeyPress(e, purposeRefs, i)
                              // }
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
                              disabled={true}
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
                            name={[name, "remarks"]}
                            fieldKey={[fieldKey, "remarks"]}
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
                              ref={(el) => (purposeRefs.current[i] = el)}
                              onKeyPress={(e) => handlePurposeKeyPress(e, add)}
                              // onPressEnter={() => add()}
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
                              setSizef((prevSizef) =>
                                prevSizef.filter((_, idx) => idx !== i)
                              );
                              setUomf((prevUomf) =>
                                prevUomf.filter((_, idx) => idx !== i)
                              );
                              setGradef((prevGradef) =>
                                prevGradef.filter((_, idx) => idx !== i)
                              );
                              if (
                                props.responseDataArray &&
                                props.responseDataArray.length > 0
                              ) {
                                console.log(props.responseDataArray);
                                props.setResponseDataArray((prevData) => {
                                  const updatedResponseDataArray = [
                                    ...prevData,
                                  ];
                                  updatedResponseDataArray.splice(i, 1);
                                  props.setDataFetchingCompleted(
                                    updatedResponseDataArray.length
                                  );
                                  return updatedResponseDataArray;
                                });
                              }
                              console.log(i, "in add button");
                              setDeletedIndex(i);
                              setEdi(true); // Set p

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

export default SizeDetail;
