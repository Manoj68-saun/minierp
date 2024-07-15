import { Row, Col, Skeleton, Modal, message, Tooltip } from "antd";
import { RiUserSearchFill } from "react-icons/ri";
import axios from "axios";
import classes from "../Pages.module.css";
import { useState, useEffect, useContext } from "react";
import DataContext from "../../../Context/dataContext";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import { AiFillDelete } from "react-icons/ai";
import PDFDownloads from "./PDFdownload";

import html2pdf from "html2pdf.js";
// import logo from "../../../../../logo/logo.png"

import { Link } from "react-router-dom";
import { VscFilePdf } from "react-icons/vsc";
import { saveAs } from "file-saver";
import { selectionStateInitializer } from "@mui/x-data-grid/internals";

const InvoiceDetail = (props) => {
  const employeeData = useContext(DataContext);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);
  const [drows, setDRows] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfResponse, setPdfResponse] = useState(null);
  useEffect(() => {
    setDRows(null);
    setRows(null);
    setColumns([]);

    axios
      .get(employeeData.URL + "/api/v1/salesInvoice", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        console.log(response.data.data.invoice.rows);
        setColumns((columns) => {
          let newCols = response.data.data.invoice.fields.map((col) => {
            return {
              name: col.name,
              title: col.name.split("_").join(" ").toLowerCase(),
            };
          });

          const newNewCols = [
            { name: "D", title: "D" },
            { name: "V", title: "V" },
            { name: "PDF", title: "PDF" },
            { name: "SNO", title: "SNo" },
            ...newCols,
          ];
          return newNewCols;
        });

        setRows((rows) => {
          console.log(response.data.data.invoice.rows);
          let newRows = response.data.data.invoice.rows.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(
                          event,
                          index,
                          response.data.data.invoice.rows,
                          row["invoice_no"]
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
                      "/sales/transaction/salesInvoice-form-view/" +
                      row["invoice_no"]
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
              PDF: (
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
                          response.data.data.invoice.rows,
                          row["invoice_no"]
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
    console.log(newrows);

    setRows(null);
    axios
      .delete(employeeData.URL + "/api/v1/salesInvoice/" + code.toString(), {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        console.log(newrows);
        const rowvals = newrows.filter((row) => row["invoice_no"] !== code);
        setRows((rows) => {
          let newDRows = rowvals.map((row, index) => {
            return {
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link to="#" style={{ color: "red", fontWeight: "bolder" }}>
                    <AiFillDelete
                      onClick={(event) =>
                        deleteHandler(event, index, rowvals, row["invoice_no"])
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
                      "/sales/transaction/salesInvoice-form-view/" +
                      row["invoice_no"]
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
              PDF: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(event, index, newrows, row["invoice_no"])
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
                        deleteHandler(event, index, newrows, row["invoice_no"])
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
                      "/sales/transaction/salesInvoice-form-view/" +
                      row["invoice_no"]
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
              PDF: (
                <Tooltip placement="bottom" title="Export" color="#FFA07A">
                  <Link
                    to="#"
                    style={{ color: "FFA07A", fontWeight: "bolder" }}
                  >
                    <VscFilePdf
                      onClick={(event) =>
                        pdfHandler(event, index, newrows, row["invoice_no"])
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

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // to download the pdf
  const pdfHandler = (event, index, newrows, code) => {
    console.log(index);
    console.log(code);
    console.log("hey there, this is testing ");

    axios
      .get(employeeData.URL + "/api/v1/salesInvoice/pdf" + code.toString(), {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        console.log(response);
        setPdfResponse(response.data);
        setModalVisible(true);
        // Assuming you want to navigate to "/pdfDownload" after the axios call
        // window.location.href = "/sales/transaction/pdfDownload";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ms = {
    width: "1000px",
    height: "600px",
  };

  return (
    <>
      <Modal
        title="PDF Download"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        // bodystyle={{ms  }}
        width={1000}
        data={pdfResponse}
      >
        {/* Add your PDF content or an iframe here */}

        {/* Check if pdfResponse is available before rendering the iframe */}

        {pdfResponse && <PDFDownloads pdfResponse={pdfResponse} />}
      </Modal>
      <Row className={classes["Row"]}>
        <Col md={14}>
          <p className={classes["Title"]}>Invoice Details</p>
        </Col>
        <Col className={classes["Col"]} md={10}></Col>
      </Row>
      <p></p>
      <Row className={classes["Row"]}>
        <Col lg={19} md={17}></Col>
        <Col className={classes["Col"]} lg={5} md={7}>
          <Link to="/sales/transaction/invoice-create">
            <button className={classes["ProfileButton"]}>Add an Invoice</button>
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

export default InvoiceDetail;
