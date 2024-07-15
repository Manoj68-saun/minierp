import React from "react";
import { Row } from "antd";
import { Modal, Col, message, Skeleton, Tooltip } from "antd";
import Table from "@mui/material/Table";
import Input from "@mui/material/Input";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { IconButton, Button } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useContext } from "react";
import EmployeeTable from "../EmployeeTable/EmployeeTable";

const AdminTable = (props) => {
  console.log(props, "this is props in admin table");
  console.log(props.sizeData);
  const [columnss, setColumnss] = useState([]);
  const [rows, setRows] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(props.sizeData);
  const [itemdata, setItemdata] = useState(null);

  // const handleDelete = (uniqId) => {
  //   const newData = data.filter((item) => item.uniq_id !== uniqId);
  //   console.log(newData);
  //   setData(newData);
  //   // props.setMata((prevData) => ({
  //   //   ...prevData,
  //   //   issueDetail: newData,
  //   // }));
  // };

  const openModal = (loadId) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.getElementById("table_order");
      axios
        .get("http://localhost:8005/api/v1/dailyIssue/additional-data-of-req", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setColumnss((columns) => {
            let newCols = response.data.data.AllReq.fields.map((col) => {
              return {
                name: col.name,
                title: col.name.split("_").join(" ").toLowerCase(),
                editable: true,
              };
            });

            const newNewCols = [
              { name: "SNO", title: "SNo" },
              { name: "Select", title: "Select" },
              ...newCols,
            ];
            console.log(newNewCols);
            return newNewCols;
          });
          const deleteHandler = (event, index, code) => {
            console.log(index);
            console.log(code);
            setItemdata(null);
            closeModal();
            axios
              .get(
                "http://localhost:8005" +
                  "/api/v1/dailyIssue/additional-data/" +
                  code,
                {
                  withCredentials: true,
                }
              )
              .then((response) => {
                console.log(response);
                // Clear the existing item data when selecting a new code
                setItemdata(null);
                const newIssueHdr = response.data.data.req1.rows.map((row) => ({
                  ...row,
                  dept_code: row.dept_cd,
                  emp_cd: row.emp_cd,
                  req_code: row.req_code,
                  issue_date: dayjs(new Date()).format("DD-MM-YYYY"),
                }));
                console.log(response.data.data.req2.rows);
                setItemdata(response.data.data.req2.rows);
                const newItemDetail = response.data.data.req2.rows.map(
                  (data) => ({
                    ...data,
                    // Assuming the field in response.data.data is named item_code
                  })
                );
                // props.setEditMode(false);
                // setData(newItemDetail);
                setData((prevData) => [...prevData, ...newItemDetail]);
                //   setData((prevData) => ({
                //     ...prevData,
                //     issueHdr: newIssueHdr,
                //   }));
              });
          };

          setRows((rows) => {
            let newRows = response.data.data.AllReq.rows.map((row, index) => {
              return {
                SNO: index + 1,
                Select: (
                  <Tooltip
                    placement="bottom"
                    title="Select Req Here"
                    color="#1777C4"
                  >
                    <BsFillArrowRightSquareFill
                      onClick={(event) =>
                        deleteHandler(event, index, row["req_code"])
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                        id: "hhh",
                      }}
                    />
                  </Tooltip>
                ),
                ...row,
              };
            });
            return newRows;
          });
          // Add your code here to handle the response
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isModalOpen]);

  const handleDelete = (uniqId) => {
    const newData = data.filter((item) => item.uniq_id !== uniqId);
    setData(newData);
    props.setMata((prevData) => ({
      ...prevData,
      issueDetail: newData,
    }));
    // props.updateItemData(newData); // Call the callback function to update itemdata
    props.updateIssueDetail(newData); // Call the callback function to update issue detail
  };

  const onInputChange = (e, index, record) => {
    const { value } = e.target;
    const newValue = typeof value === "string" ? value : String(value); // Ensure value is a string
    console.log(newValue);
    // Update the data array with the new value
    const newData = [...props.data1]; // Create a copy of the data array

    newData[index] = { ...record, qty: newValue }; // Update the qty property of the corresponding record
    console.log(newData);
    // Update the state with the new data
    setData(newData);
    props.setMata((prevData) => ({
      ...prevData,
      issueDetail: newData,
    }));

    // Your other logic here
  };
  const fetchMoreData = () => {
    console.log("button clik for get more row");
    fetch("your_api_endpoint_here")
      .then((response) => response.json())
      .then((newRows) => {
        // Assuming newRows is an array of new data
        setData((prevData) => [...prevData, ...newRows]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const columns = [
    // { key: "1", title: "SIZE CODE", dataIndex: "size_code" },
    { key: "1", title: "Item", dataIndex: "item_name" },
    { key: "2", title: "Req Code", dataIndex: "req_code" },
    { key: "3", title: "Size", dataIndex: "size_name" },
    { key: "4", title: "Uom", dataIndex: "uom" },
    { key: "5", title: "Grade", dataIndex: "grade" },
    { key: "6", title: "Cost Center", dataIndex: "cost_center" },

    { key: "7", title: "Actual Bal.", dataIndex: "actual_bal" },
    // { key: "7", title: "Qty", dataIndex: "qty" },
    {
      key: "8",
      title: "Qty",
      dataIndex: "qty",
      editable: true,
      render: (text, record, index) => {
        const qtyInteger = parseInt(text, 10); // Convert to integer
        return (
          record.qty && (
            <Input
              type="number"
              style={{
                border: "none", // Remove border
                outline: "none", // Remove outline
                textAlign: "right",
                width: "70px", // Set width to 70px
                height: "20px", // Set height to 20px
              }}
              value={isNaN(qtyInteger) ? "" : String(qtyInteger)} // Convert back to string
              onChange={(e) => {
                onInputChange(e, index, record);
              }}
            />
          )
        );
      },
    },
    { key: "9", title: "Pcs", dataIndex: "no_of_pcs" },
    {
      key: "10",
      title: "Action",
      render: (text, record, index) => (
        <IconButton
          onClick={() => handleDelete(record.uniq_id)}
          aria-label="delete"
          color="primary"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Row>
      <Button variant="contained" onClick={openModal}>
        ADD More Item
      </Button>
      <Modal
        title="Select a Req Code"
        visible={isModalOpen} // Use visible instead of open
        onCancel={closeModal}
        footer={null}
        width={800} // Adjust the width as needed
        bodyStyle={{ height: "400px", overflow: "scroll" }}
      >
        {rows && columns.length > 0 ? (
          <EmployeeTable data={rows} columns={columnss} val={true} />
        ) : (
          <>
            <Skeleton loading={false} />
            <Skeleton loading={false} />
            <Skeleton loading={false} />
            <Skeleton loading={false} />
          </>
        )}
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Typography
                    variant="h7"
                    color="primary"
                    style={{ fontWeight: "bold" }}
                  >
                    {column.title}
                  </Typography>
                </TableCell>
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
