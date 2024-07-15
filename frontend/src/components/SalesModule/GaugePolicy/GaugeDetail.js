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
// import { saveAs } from 'file-saver'
const GaugeDetail = (props) => {
  const employeeData = useContext(DataContext);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);
  const [drows, setDRows] = useState(null);

  useEffect(() => {
    setDRows(null);
    setRows(null);
    setColumns([]);

    axios
      .get(employeeData.URL + "/api/v1/gauge", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setColumns((columns) => {
          let newCols = response.data.data.gaugepolicy.fields.map((col) => {
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
          let newRows = response.data.data.gaugepolicy.rows.map(
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
                            response.data.data.gaugepolicy.rows,
                            row["a_code"]
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
                      to={"/sales/norms/gauge-form-view/" + row["a_code"]}
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
      .delete(employeeData.URL + "/api/v1/gauge/" + code.toString(), {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        const rowvals = newrows.filter((row) => row["a_code"] !== code);
        setRows((rows) => {
          let newDRows = rowvals.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(event, index, rowvals, row["a_code"])
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
                    to={"/sales/norms/gauge-form-view/" + row["a_code"]}
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
                        deleteHandler(event, index, newrows, row["a_code"])
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
                    to={"/sales/norms/gauge-form-view/" + row["a_code"]}
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
          <p className={classes["Title"]}>Gauge Policy Details</p>
        </Col>
        <Col className={classes["Col"]} md={10}></Col>
      </Row>
      <p></p>
      <Row className={classes["Row"]}>
        <Col lg={19} md={17}></Col>
        <Col className={classes["Col"]} lg={5} md={7}>
          <Link to="/sales/norms/create-gauge">
            <button className={classes["ProfileButton"]}>
              Add Gauge Policy
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

export default GaugeDetail;
