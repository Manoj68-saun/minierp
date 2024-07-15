import React from "react";
import { Row } from "antd";
import Table from "@mui/material/Table";
import Input from "@mui/material/Input";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect, useContext } from "react";

const AdminTable = (props) => {
  console.log(props, "this is props in admin table");
  console.log(props.sizeData);
  //   const initialData = [
  //     { id: 1, size_code: "S", amt: 10, quality_code: "A", amt_val: 100 },
  //     { id: 2, size_code: "M", amt: 20, quality_code: "B", amt_val: 150 },
  //     { id: 3, size_code: "L", amt: 30, quality_code: "C", amt_val: 200 },
  //     // Add more dummy data as needed
  //   ];
  const [data, setData] = useState(props.sizeData);

  //   const onInputChange = (e, index, record) => {
  //     const { value } = e.target;

  //     // Ensure that only numbers are entered
  //     if (/^\d*$/.test(value)) {
  //       const updatedData = [...data];
  //       updatedData[index].amt1 = value;
  //       setData(updatedData);
  //     }
  //   };

  //   const onInputChange1 = (e, index, record) => {
  //     const { value } = e.target;

  //     // Ensure that only numbers are entered
  //     if (/^\d*$/.test(value)) {
  //       const updatedData = [...data];
  //       updatedData[index].amt2 = value;
  //       setData(updatedData);
  //     }
  //   };

  //   const onInputChange = (e, index, record) => {
  //     const { value } = e.target;
  //     console.log("manoj", value);
  //     console.log("item", props.setMata);
  //     // Update props.data2 properties
  //     console.log({ ...props.data2, key: "ytytyy" });
  //     const updatedData2 = {
  //       ...props.data2,
  //       size_amt: value,
  //       size_code: record.size_code,
  //     };

  //     console.log(updatedData2, "fijfifjf");
  //     // Update state
  //     // const updatedData = [...data];
  //     // updatedData[index].amt1 = value;
  //     // setData(updatedData);
  //   };

  //   const onInputChange = (e, index, record) => {
  //     const { value } = e.target;

  //     // Create a new array by spreading the existing data2 array
  //     const updatedData2 = [...props.data2];

  //     // Update the specific item in the array based on the index
  //     updatedData2[index] = {
  //       ...updatedData2[index],
  //       size_amt: value,
  //       size_code: record.size_code,
  //     };

  //     // Log the updatedData2 array
  //     console.log(updatedData2, "fijfifjf");

  //     // Assuming props.setMata is a function that sets the state for data2
  //     // props.setMata(updatedData2);
  //   };

  const onInputChange = (e, index, record) => {
    const { value } = e.target;

    if (!/^\d+$/.test(value)) {
      // If the input is not numeric, you can handle the error or simply return
      console.error("Invalid input. Please enter only numeric values.");
      return;
    }
    // Create a new array by spreading the existing GaugeSizeDetail array
    const updatedGaugeSizeDetail = [...props.data2];

    updatedGaugeSizeDetail[index] = {
      ...updatedGaugeSizeDetail[index],
      size_amt: value,
      size_code: record.size_code,
    };

    console.log(updatedGaugeSizeDetail);
    //Update the state with the new array
    props.setMata((prevData) => ({
      ...prevData,
      GaugeSizeDetail: updatedGaugeSizeDetail,
    }));
  };

  //   const onInputChange1 = (e, index, record) => {
  //     const { value } = e.target;

  //     // Update props.data1 properties
  //     const updatedData1 = {
  //       ...props.data1,
  //       g_amount: value,
  //       grade_code: record.quality_code,
  //     };
  //     props.setData(updatedData1);

  //     // Update state
  //     const updatedData = [...data];
  //     updatedData[index].amt2 = value;
  //     setData(updatedData);
  //   };

  const onInputChange1 = (e, index, record) => {
    const { value } = e.target;

    // Create a new array by spreading the existing GaugeSizeDetail array
    const updatedGaugeGradeDetail = [...props.data1];

    updatedGaugeGradeDetail[index] = {
      ...updatedGaugeGradeDetail[index],
      g_amount: value,
      grade_code: record.quality_code,
    };

    console.log(updatedGaugeGradeDetail);
    //Update the state with the new array
    props.setMata((prevData) => ({
      ...prevData,
      GaugeGradeDetail: updatedGaugeGradeDetail,
    }));
  };

  const columns = [
    { key: "1", title: "SIZE CODE", dataIndex: "size_code" },
    { key: "2", title: "SIZE", dataIndex: "size_name" },
    {
      key: "3",
      title: "AMOUNT",
      dataIndex: "amt1",
      editable: true,
      render: (text, record, index) =>
        record.size_name && (
          <Input
            value={text}
            onChange={(e) => {
              onInputChange(e, index, record);
            }}
          />
        ),
    },
    { key: "4", title: "GRADE CODE", dataIndex: "quality_code" },
    { key: "5", title: "GRADE", dataIndex: "grade_name" },
    {
      key: "6",
      title: "AMOUNT",
      dataIndex: "amt2",
      editable: true,
      render: (text, record, index) =>
        record.grade_name && (
          <Input
            value={text}
            onChange={(e) => {
              onInputChange1(e, index, record);
            }}
          />
        ),
    },
  ];

  return (
    <Row>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record, index) => (
              <TableRow key={record.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Row>
  );
};

export default AdminTable;
