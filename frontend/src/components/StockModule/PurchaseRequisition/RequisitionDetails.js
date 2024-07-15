import { Row, Col, Skeleton, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import classes from "../Pages.module.css";
import { useState, useEffect, useContext } from "react";
import DataContext from "../../../Context/dataContext";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import { AiFillDelete } from "react-icons/ai";

import { Link } from "react-router-dom";

const RequisitionDetails = (props) => {
  const employeeData = useContext(DataContext);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);
  const [drows, setDRows] = useState(null);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    setDRows(null);
    setRows(null);
    setColumns([]);

    axios
      .get(employeeData.URL + "/api/v1/purchaseindent", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);

        setColumns((columns) => {
          let newCols = response.data.data.Requisition.fields.map((col) => {
            return {
              name: col.name,
              title: col.name.split("_").join(" ").toLowerCase(),
            };
          });

          const newNewCols = [
            { name: "D", title: "D" },
            { name: "V", title: "V" },
            { name: "SNO", title: "SNo" },
            ...newCols,
          ];
          return newNewCols;
        });

        setRows((rows) => {
          let newRows = response.data.data.Requisition.rows.map(
            (row, index) => {
              return {
                D: (
                  <Tooltip placement="bottom" title="Delete" color="red">
                    <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                      <AiFillDelete
                        onClick={(event) =>
                          deleteHandler(
                            event,
                            index,
                            response.data.data.Requisition.rows,
                            row["rq_code"]
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
                        "/stock/transaction/purchase-indent-view/" +
                        row["rq_code"]
                      }
                      style={{ color: "#1777C4", fontWeight: "bolder" }}
                    >
                      <EditOutlined
                        style={{
                          color: "#1777C4",
                          fontWeight: "bolder",
                          fontSize: "0.9rem",
                        }}
                      />
                    </Link>
                  </Tooltip>
                ),

                SNO: index + 1,
                ...row,
              };
            }
          );
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
      .delete(employeeData.URL + "/api/v1/purchaseindent/" + code.toString(), {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        const rowvals = newrows.filter((row) => row["rq_code"] !== code);
        setRows((rows) => {
          let newDRows = rowvals.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(event, index, rowvals, row["rq_code"])
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
                      "/stock/transaction/purchase-indent-view/" +
                      row["rq_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <EditOutlined
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
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
                        deleteHandler(event, index, newrows, row["rq_code"])
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
                      "/stock/transaction/purchase-indent-view" + row["rq_code"]
                    }
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  >
                    <EditOutlined
                      style={{
                        color: "#1777C4",
                        fontWeight: "bolder",
                        fontSize: "0.9rem",
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
          <p className={classes["Title"]}>Purchase Requisition Details</p>
        </Col>
        <Col className={classes["Col"]} md={10}></Col>
      </Row>
      <p></p>
      <Row className={classes["Row"]}>
        <Col lg={19} md={17}></Col>
        <Col className={classes["Col"]} lg={5} md={7}>
          <Link to="/stock/transaction/purchase-requisition-create">
            <button
              style={{
                padding: "7px 30px 14px 24px",
                borderRadius: "50px",
                background: "transparent",
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "1.5",
                color: "#071e54",
                WebkitAppearance: "none",

                boxShadow:
                  "-3px -3px 6px #fff, 3px 3px 6px #bfc3cf, 3px 3px 6px #bfc3cf, -3px -3px 6px #fff", // Original box shadow
                height: "40px",

                // Ensure the button takes full width
              }}
              onMouseOver={(event) => {
                event.target.style.boxShadow = "0px 5px 15px 0px #264a9f"; // Apply spread color on hover with 0 spread at the top
              }}
              onMouseOut={(event) => {
                event.target.style.boxShadow =
                  "-3px -3px 6px #fff, 3px 3px 6px #bfc3cf, 3px 3px 6px #bfc3cf, -3px -3px 6px #fff"; // Restore original shadow on mouse out
              }}
              className={classes["ProfileButtonn"]}
            >
              Add Requisition
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

export default RequisitionDetails;
