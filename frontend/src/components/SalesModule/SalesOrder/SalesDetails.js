import { Row, Col, Skeleton, message, Tooltip } from "antd";
import { RiUserSearchFill } from "react-icons/ri";
import axios from "axios";
import classes from "../Pages.module.css";
import { useState, useEffect, useContext } from "react";
import DataContext from "../../../Context/dataContext";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { VscFilePdf } from "react-icons/vsc";
import { saveAs } from "file-saver";
const SalesDetails = (props) => {
  const employeeData = useContext(DataContext);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);
  const [drows, setDRows] = useState(null);

  useEffect(() => {
    setDRows(null);
    setRows(null);
    setColumns([]);

    axios
      .get(employeeData.URL + "/api/v1/salesOrder", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setColumns((columns) => {
          let newCols = response.data.data.order.fields.map((col) => {
            return {
              name: col.name,
              title: col.name.split("_").join(" ").toLowerCase(),
            };
          });

          const newNewCols = [
            { name: "D", title: "D" },
            { name: "V", title: "V" },
            { name: "Z", title: "Z" },
            { name: "SNO", title: "SNo" },
            ...newCols,
          ];
          return newNewCols;
        });

        setRows((rows) => {
          let newRows = response.data.data.order.rows.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(
                          event,
                          index,
                          response.data.data.order.rows,
                          row["booking_code"]
                        )
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              V: (
                <Tooltip placement="bottom" title="View" color="#1777C4">
                  <Link
                    to={
                      "/sales/transaction/salesOrder-form-view/" +
                      row["booking_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <RiUserSearchFill
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              Z: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(
                          event,
                          index,
                          response.data.data.order.rows,
                          row["booking_code"]
                        )
                      }
                      style={{
                        color: "#FFA07A",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              SNO: index + 1,
              ...row,
            };
          });
          return newRows;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteHandler = (event, index, newrows, code) => {
    console.log(index);
    console.log(code);

    setRows(null);
    axios
      .delete(employeeData.URL + "/api/v1/salesOrder/" + code.toString(), {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        const rowvals = newrows.filter((row) => row["booking_code"] !== code);
        setRows((rows) => {
          let newDRows = rowvals.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(
                          event,
                          index,
                          rowvals,
                          row["booking_code"]
                        )
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              V: (
                <Tooltip placement="bottom" title="View" color="#1777C4">
                  <Link
                    to={
                      "/sales/transaction/salesOrder-form-view/" +
                      row["booking_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <RiUserSearchFill
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              Z: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(event, index, newrows, row["booking_code"])
                      }
                      style={{
                        color: "#FFA07A",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              SNO: index + 1,
              ...row,
            };
          });
          return newDRows;
        });
      })
      .catch((error) => {
        setRows((rows) => {
          let newDRows = newrows.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(
                          event,
                          index,
                          newrows,
                          row["booking_code"]
                        )
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              V: (
                <Tooltip placement="bottom" title="View" color="#1777C4">
                  <Link
                    to={
                      "/sales/transaction/salesOrder-form-view/" +
                      row["booking_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <RiUserSearchFill
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              Z: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(event, index, newrows, row["booking_code"])
                      }
                      style={{
                        color: "#FFA07A",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              SNO: index + 1,
              ...row,
            };
          });
          return newDRows;
        });
        console.log(error);
      });
  };

  const pdfHandler = (event, index, newrows, code) => {
    console.log(index);
    console.log(code);

    setRows(null);
    axios
      // .get(employeeData.URL + '/api/v1/salesOrder/pdf' + code.toString(),{
      //     withCredentials: true
      // })
      .post(
        employeeData.URL + "/api/v1/salesOrder/pdf" + code.toString(),

        { filter: "" },
        { responseType: "arraybuffer" },
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        console.log(response);
        const data = response.data;
        // console.log(data)

        const blob = new Blob([data], { type: "application/pdf" });
        saveAs("test.pdf");
        //  let fileURL = URL.createObjectURL(blob);
        //  window.open(fileURL);
        message.success({
          content: "PDF Generated Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        // setTimeout( ()=> {
        //     const response={
        //         type: 'application/pdf',
        //         file: data,

        //     };
        //     console.log(response.file);
        //     saveAs("C:/imaxpart4/pdfs/test.pdf");

        // }, 100);
      })
      .then((response) => {
        console.log(response);
        //  const rowvals = newrows.filter(row => row['booking_code'] !== code)
        setRows((rows) => {
          let newDRows = newrows.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(
                          event,
                          index,
                          newrows,
                          row["booking_code"]
                        )
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              V: (
                <Tooltip placement="bottom" title="View" color="#1777C4">
                  <Link
                    to={
                      "/sales/transaction/salesOrder-form-view/" +
                      row["booking_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <RiUserSearchFill
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              Z: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(event, index, newrows, row["booking_code"])
                      }
                      style={{
                        color: "#FFA07A",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              SNO: index + 1,
              ...row,
            };
          });
          return newDRows;
        });
      })

      .catch((error) => {
        setRows((rows) => {
          let newDRows = newrows.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(
                          event,
                          index,
                          newrows,
                          row["booking_code"]
                        )
                      }
                      style={{
                        color: "red",
                        fontWeight: "bolder",
                        fontSize: "0.8rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              V: (
                <Tooltip placement="bottom" title="View" color="#1777C4">
                  <Link
                    to={
                      "/sales/transaction/salesOrder-form-view/" +
                      row["booking_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <RiUserSearchFill
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              Z: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(event, index, newrows, row["booking_code"])
                      }
                      style={{
                        color: "#FFA07A",
                        fontWeight: "bolder",
                        fontSize: "1.5rem",
                      }}
                    />
                  </Link>
                </Tooltip>
              ),
              SNO: index + 1,
              ...row,
            };
          });
          return newDRows;
        });
        console.log(error);
      });
  };

  return (
    <>
      <Row className={classes["Row"]}>
        <Col md={14}>
          <p className={classes["Title"]}>Sales Order Details</p>
        </Col>
        <Col className={classes["Col"]} md={10}></Col>
      </Row>
      <p></p>
      <Row className={classes["Row"]}>
        <Col lg={19} md={17}></Col>
        <Col className={classes["Col"]} lg={5} md={7}>
          <Link to="/sales/transaction/sales-create">
            <button className={classes["ProfileButton"]}>
              Add Sales Order
            </button>
          </Link>
        </Col>
      </Row>
      <p></p>
      {rows && columns.length > 0 ? (
        <>
          <EmployeeTable data={rows} columns={columns} val={true} />
        </>
      ) : (
        <>
          <Skeleton active={true} />
          <Skeleton active={true} />
          <Skeleton active={true} />
          <Skeleton active={true} />
        </>
      )}
    </>
  );
};

export default SalesDetails;
