import { Row, Col, message, Skeleton, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { useState, useEffect, useContext } from "react";
import classes from "../Pages.module.css";
import DataField from "./DataField";
import axios from "axios";
import dayjs from "dayjs";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import AdminTable from "./AdminTable";
const BasicDetail = (props) => {
  console.log("props in basic", props);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);
  const [itemdata, setItemdata] = useState(null);

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
          setColumns((columns) => {
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
                props.setData((prevData) => ({
                  ...prevData,
                  issueDetail: newItemDetail,
                }));

                props.setData((prevData) => ({
                  ...prevData,
                  issueHdr: newIssueHdr,
                }));
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

  // console.log(props.data.req_type, "basic");
  const handleChange = (e, param) => {
    props.setData((data) => {
      const newdata = [...data["issueHdr"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        issueHdr: newdata,
      };
    });
  };

  const onClickHandler = (e, param) => {
    console.log("click");
    openModal();

    props.setData((data) => {
      const newdata = [...data["issueHdr"]];
      newdata[0][param] = e.target.value;
      return {
        ...data,
        issueHdr: newdata,
      };
    });
  };

  const handleSChange = (val, param) => {
    console.log(val, "Truwwww");
    if (val == "wr") {
      console.log(document.getElementById("table_order"));
      document.getElementById("table_order").style.display = "none";
      // document.getElementById("tabpane").style.display = "none";
    }

    if (val == "wour") {
      // If val is not "wr", show the table_order element
      document.getElementById("table_order").style.display = "block"; // Assuming you want to set it to block display
      // document.getElementById("tabpane").style.display = "block";
    }

    props.setData((data) => {
      const newdata = [...data["issueHdr"]];
      newdata[0][param] = val;
      return {
        ...data,
        issueHdr: newdata,
      };
    });
  };

  const handleDChange = (date, dateString, param) => {
    props.setData((data) => {
      const newdata = [...data["issueHdr"]];
      newdata[0][param] = dateString;
      return {
        ...data,
        issueHdr: newdata,
      };
    });
  };

  const handleTChange = (time, timeString, param) => {
    props.setData((data) => {
      const newdata = [...data["issueHdr"]];
      // Assuming `timeString` is in the format "HH:mm:ss"
      newdata[0][param] = timeString;
      return {
        ...data,
        issueHdr: newdata,
      };
    });
  };

  return (
    <div>
      <p></p>
      <Row className={props.editMode ? classes["RowDEX"] : classes["RowD"]}>
        {!props.create && (
          <DataField
            editMode={props.editMode}
            lg={12}
            md={24}
            name="Issue Code"
            param="issue_code"
            value={props.data.issue_code}
          />
        )}

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.REQ_TYPE}
          type="Select"
          name="Requisition Type"
          required="True"
          param="req_type"
          value={props.data.req_type}
          editDisable={props.editDisable}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleChange}
          // type="Date"
          id="req_code"
          // required="True"
          name="Requisition Code"
          param="req_code"
          value={props.data.req_code}
          temp={props.data.req_type}
          onClick={props.data.req_type === "wr" ? onClickHandler : null}
          rules={[{ message: "missing name" }]}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleDChange}
          type="Date"
          id="issue_date"
          required="True"
          name="Issue Date"
          param="issue_date"
          value={props.data.issue_date}
          rules={[{ message: "missing name" }]}
        />

        {/* <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleTChange}
          type="Time"
          id="Req_time"
          required="True"
          name="REQUISITION TIME"
          param="Req_time"
          value={props.data.Req_time}
          rules={[{ message: "missing name" }]}
        /> */}

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.DEPT_CODE}
          required="True"
          type="Select"
          name="Department"
          param="dept_code"
          value={props.data.dept_code}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.EMPLOYEE_CODE}
          required="True"
          type="Select"
          name="Requested By"
          param="emp_cd"
          value={props.data.emp_cd}
        />

        <DataField
          editMode={props.editMode}
          lg={4}
          md={24}
          handleChange={handleSChange}
          options={props.ad.D_CODE}
          type="Select"
          name="Division Code"
          param="d_code"
          value={props.data.d_code}
        />

        <Col span={24} className={classes["Col"]}>
          <div style={{ marginTop: "10px" }}>
            {/* Other components or content */}
            {itemdata !== null ? (
              <AdminTable
                sizeData={itemdata}
                setMata={props.setData}
                data1={props.data1}
                updateIssueDetail={props.updateIssueDetail}
                // data2={props.data2}
              />
            ) : (
              <p></p>
            )}
          </div>
        </Col>
      </Row>
      <Modal
        title="Select a Req Code"
        visible={isModalOpen} // Use visible instead of open
        onCancel={closeModal}
        footer={null}
        width={800} // Adjust the width as needed
        bodyStyle={{ height: "400px", overflow: "scroll" }}
      >
        {rows && columns.length > 0 ? (
          <EmployeeTable data={rows} columns={columns} val={true} />
        ) : (
          <>
            <Skeleton loading={false} />
            <Skeleton loading={false} />
            <Skeleton loading={false} />
            <Skeleton loading={false} />
          </>
        )}
      </Modal>
    </div>
  );
};

export default BasicDetail;
