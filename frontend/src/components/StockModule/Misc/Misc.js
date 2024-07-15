import { useEffect, useContext, useState } from "react";
import axios from "axios";
import classes from "../Pages.module.css";
import { Skeleton, Row, Col, message, Tooltip, Modal, Button } from "antd";
import { AiFillDelete } from "react-icons/ai";
import { FaPenAlt } from "react-icons/fa";
import DataContext from "../../../Context/dataContext";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import FormRenderer from "../FormRenderer/FormRenderer";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

console.log("manoj");
const Misc = (props) => {
  const { id1 } = useParams();
  const employeeData = useContext(DataContext);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(null);
  const [urows, setURows] = useState(null);
  const [uform, setUForm] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setID] = useState("");
  const [identifier, setIdentifier] = useState("");
  console.log(id1);
  const deleteHandler = (event, identifier, code) => {
    console.log(identifier, code);
    setLoading(true);

    axios
      .delete(
        employeeData.URL +
          "/api/v1/salesMisc/" +
          id1 +
          "?identifier=" +
          code.toString(),
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        message.success({
          content: "Record Deleted Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setLoading(false);
        setRows(null);

        axios
          .get(employeeData.URL + "/api/v1/salesMisc/" + id1, {
            withCredentials: true,
          })
          .then((response) => {
            setRows((rows) => {
              let newRows = response.data.data.tableData.rows.map(
                (row, index) => {
                  return {
                    E: (
                      <Tooltip placement="bottom" title="Edit" color="#1777C4">
                        <Link
                          to="#"
                          style={{ color: "#1777C4", fontWeight: "bolder" }}
                          onClick={(event) =>
                            editHandler(
                              event,
                              index,
                              response.data.data.tableHeader.row_identifier,
                              row[
                                response.data.data.tableHeader.row_identifier
                              ],
                              response.data.data.tableHeader.master_fields
                            )
                          }
                        >
                          <FaPenAlt
                            style={{ color: "#1777C4", fontWeight: "bolder" }}
                          />
                        </Link>
                      </Tooltip>
                    ),
                    D: (
                      <Tooltip placement="bottom" title="Delete" color="red">
                        <Link
                          to="#"
                          style={{ color: "red", fontWeight: "bolder" }}
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              response.data.data.tableHeader.row_identifier,
                              row[response.data.data.tableHeader.row_identifier]
                            )
                          }
                        >
                          <AiFillDelete
                            style={{ color: "red", fontWeight: "bolder" }}
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
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        message.error({
          content: "Some Error Occurred!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setLoading(false);
      });
  };
  useEffect(() => {
    setTitle("");
    setForm((form) => {
      const newForm = null;
      return newForm;
    });
    setID("");
    setIdentifier("");
    setRows(null);
    setColumns([]);
    setLoading(false);

    axios
      .get(employeeData.URL + "/api/v1/salesMisc/" + id1, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setTitle((title) => {
          const newTitle = response.data.data.tableHeader.form_name;
          return newTitle;
        });

        setColumns((columns) => {
          let newCols = response.data.data.tableData.fields.map((col) => {
            return {
              name: col.name,
              title: col.name.split("_").join(" ").toLowerCase(),
            };
          });

          const newNewCols = [
            { name: "E", title: "E" },
            { name: "D", title: "D" },
            { name: "SNO", title: "SNo" },
            ...newCols,
          ];
          return newNewCols;
        });

        setRows((rows) => {
          let newRows = response.data.data.tableData.rows.map((row, index) => {
            return {
              E: (
                <Tooltip placement="bottom" title="Edit" color="#1777C4">
                  <Link
                    to="#"
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                    onClick={(event) =>
                      editHandler(
                        event,
                        index,
                        response.data.data.tableHeader.row_identifier,
                        row[response.data.data.tableHeader.row_identifier],
                        response.data.data.tableHeader.master_fields
                      )
                    }
                  >
                    <FaPenAlt
                      style={{ color: "#1777C4", fontWeight: "bolder" }}
                    />
                  </Link>
                </Tooltip>
              ),
              D: (
                <Tooltip placement="bottom" title="Delete" color="red">
                  <Link
                    to="#"
                    style={{ color: "red", fontWeight: "bolder" }}
                    onClick={(event) =>
                      deleteHandler(
                        event,
                        response.data.data.tableHeader.row_identifier,
                        row[response.data.data.tableHeader.row_identifier]
                      )
                    }
                  >
                    <AiFillDelete
                      style={{ color: "red", fontWeight: "bolder" }}
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

        setForm((form) => {
          let inputTypes =
            response.data.data.tableHeader.input_type.split(", ");
          const newForm = response.data.data.tableHeader.table_fields
            .split(", ")
            .map((field, index) => {
              if (inputTypes[index] === "Input")
                return {
                  value: "",
                  label: response.data.data.tableHeader.labels
                    .split(", ")
                    [index].split("_")
                    .join(" "),
                  name: field,
                  type: "Input",
                };

              if (inputTypes[index] === "Date")
                return {
                  value: "",
                  label: response.data.data.tableHeader.labels
                    .split(", ")
                    [index].split("_")
                    .join(" "),
                  name: field,
                  type: "Date",
                };

              if (inputTypes[index] === "Select")
                return {
                  value: "",
                  label: response.data.data.tableHeader.labels
                    .split(", ")
                    [index].split("_")
                    .join(" "),
                  name: field,
                  type: "Select",
                  options: response.data.data.tableHeader.select_lists
                    .split(";")
                    [index].split(", ")
                    .map((item) => {
                      return {
                        key: item,
                        name: item,
                      };
                    }),
                };

              return {
                value: "",
                label: response.data.data.tableHeader.labels
                  .split(", ")
                  [index].split("_")
                  .join(" "),
                name: field,
                type: "Master",
                options: response.data.data.obj[index],
              };
            });

          console.log(newForm);
          return newForm;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id1]);

  const editHandler = (event, mainindex, identifier, code, masterFields) => {
    setLoading(true);
    setURows(null);
    setUForm(null);

    axios
      .get(employeeData.URL + "/api/v1/salesMisc/" + id1, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);

        let inputTypes = response.data.data.tableHeader.input_type.split(", ");

        let newRows = response.data.data.tableData.rows.map((row, index) => {
          return {
            E: (
              <Tooltip placement="bottom" title="Edit" color="#1777C4">
                <Link
                  to="#"
                  style={{ color: "#1777C4", fontWeight: "bolder" }}
                  onClick={(event) =>
                    editHandler(
                      event,
                      index,
                      response.data.data.tableHeader.row_identifier,
                      row[response.data.data.tableHeader.row_identifier],
                      response.data.data.tableHeader.master_fields
                    )
                  }
                >
                  <FaPenAlt
                    style={{ color: "#1777C4", fontWeight: "bolder" }}
                  />
                </Link>
              </Tooltip>
            ),
            D: (
              <Tooltip placement="bottom" title="Delete" color="red">
                <Link
                  to="#"
                  style={{ color: "red", fontWeight: "bolder" }}
                  onClick={(event) =>
                    deleteHandler(
                      event,
                      response.data.data.tableHeader.row_identifier,
                      row[response.data.data.tableHeader.row_identifier]
                    )
                  }
                >
                  <AiFillDelete
                    style={{ color: "red", fontWeight: "bolder" }}
                  />
                </Link>
              </Tooltip>
            ),
            SNO: index + 1,
            ...row,
          };
        });

        const newUForm = response.data.data.tableHeader.table_fields
          .split(", ")
          .map((field, index) => {
            if (inputTypes[index] === "Input")
              return {
                value: "",
                label: response.data.data.tableHeader.labels
                  .split(", ")
                  [index].split("_")
                  .join(" "),
                name: field,
                type: "Input",
              };

            if (inputTypes[index] === "Date")
              return {
                value: "",
                label: response.data.data.tableHeader.labels
                  .split(", ")
                  [index].split("_")
                  .join(" "),
                name: field,
                type: "Date",
              };

            if (inputTypes[index] === "Select")
              return {
                value: "",
                label: response.data.data.tableHeader.labels
                  .split(", ")
                  [index].split("_")
                  .join(" "),
                name: field,
                type: "Select",
                options: response.data.data.tableHeader.select_lists
                  .split(";")
                  [index].split(", ")
                  .map((item) => {
                    return {
                      key: item,
                      name: item,
                    };
                  }),
              };

            return {
              value: "",
              label: response.data.data.tableHeader.labels
                .split(", ")
                [index].split("_")
                .join(" "),
              name: field,
              type: "Master",
              options: response.data.data.obj[index],
            };
          });

        setID(code);
        setIdentifier(identifier);
        let fieldref = masterFields ? masterFields.split("; ") : [];

        console.log(fieldref);
        console.log(newUForm);
        console.log(newRows);

        newUForm.forEach((item, indexN) => {
          if (item.type === "Master") {
            let codeField = fieldref[indexN].split(" ")[0];
            let nameField = fieldref[indexN].split(" ")[3];
            console.log(nameField);
            const indexF = item.options.findIndex(
              (element) => element.N === newRows[mainindex][nameField]
            );
            console.log(indexF);
            item.value = item.options[indexF].C;
          } else item.value = newRows[mainindex][item.name];
        });

        console.log(newUForm);
        setUForm(newUForm);
        setURows(newRows);
        setVisible(true);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    console.log(form);
    const postData = {};
    form.forEach((element) => {
      postData[element.name] = element.value;
    });

    console.log(postData);
    setLoading(true);
    axios
      .post(employeeData.URL + "/api/v1/salesMisc/" + id1, postData, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        console.log(response);
        // Check the response for success
        if (response.data.status === "success") {
          // Display success message
          message.success({
            content: "Record Added Successfully!!!!",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        } else {
          // Display error message for duplicate data
          message.error({
            content: response.data.message || "Error adding record.",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }

        setRows(null);
        setLoading(false);
        setForm((form) => {
          const newForm = [...form];
          newForm.forEach((element) => (element.value = ""));

          return newForm;
        });

        axios
          .get(employeeData.URL + "/api/v1/salesMisc/" + id1, {
            withCredentials: true,
          })
          .then((response) => {
            setRows((rows) => {
              let newRows = response.data.data.tableData.rows.map(
                (row, index) => {
                  return {
                    E: (
                      <Tooltip placement="bottom" title="Edit" color="#1777C4">
                        <Link
                          to="#"
                          style={{ color: "#1777C4", fontWeight: "bolder" }}
                          onClick={(event) =>
                            editHandler(
                              event,
                              index,
                              response.data.data.tableHeader.row_identifier,
                              row[
                                response.data.data.tableHeader.row_identifier
                              ],
                              response.data.data.tableHeader.master_fields
                            )
                          }
                        >
                          <FaPenAlt
                            style={{ color: "#1777C4", fontWeight: "bolder" }}
                          />
                        </Link>
                      </Tooltip>
                    ),
                    D: (
                      <Tooltip placement="bottom" title="Delete" color="red">
                        <Link
                          to="#"
                          style={{ color: "red", fontWeight: "bolder" }}
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              response.data.data.tableHeader.row_identifier,
                              row[response.data.data.tableHeader.row_identifier]
                            )
                          }
                        >
                          <AiFillDelete
                            style={{ color: "red", fontWeight: "bolder" }}
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
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        setLoading(false);

        message.error({
          content: "please fill all feild!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
      });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    console.log("Submitting");
    const postData = {};
    uform.forEach((element) => {
      postData[element.name] = element.value;
    });

    console.log(postData);

    axios
      .patch(
        employeeData.URL +
          "/api/v1/salesMisc/" +
          id1 +
          "?identifier=" +
          id.toString(),
        postData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((response) => {
        console.log(response);
        setConfirmLoading(false);
        setVisible(false);
        message.success({
          content: "Record Added Successfully!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        setRows(null);
        setLoading(false);
        setID("");
        setIdentifier("");
        setForm((form) => {
          const newForm = [...form];
          newForm.forEach((element) => (element.value = ""));

          return newForm;
        });

        axios
          .get(employeeData.URL + "/api/v1/salesMisc/" + id1, {
            withCredentials: true,
          })
          .then((response) => {
            setRows((rows) => {
              let newRows = response.data.data.tableData.rows.map(
                (row, index) => {
                  return {
                    E: (
                      <Tooltip placement="bottom" title="Edit" color="#1777C4">
                        <Link
                          to="#"
                          style={{ color: "#1777C4", fontWeight: "bolder" }}
                          onClick={(event) =>
                            editHandler(
                              event,
                              index,
                              response.data.data.tableHeader.row_identifier,
                              row[
                                response.data.data.tableHeader.row_identifier
                              ],
                              response.data.data.tableHeader.master_fields
                            )
                          }
                        >
                          <FaPenAlt
                            style={{ color: "#1777C4", fontWeight: "bolder" }}
                          />
                        </Link>
                      </Tooltip>
                    ),
                    D: (
                      <Tooltip placement="bottom" title="Delete" color="red">
                        <Link
                          to="#"
                          style={{ color: "red", fontWeight: "bolder" }}
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              response.data.data.tableHeader.row_identifier,
                              row[response.data.data.tableHeader.row_identifier]
                            )
                          }
                        >
                          <AiFillDelete
                            style={{ color: "red", fontWeight: "bolder" }}
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
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        setLoading(false);
        setConfirmLoading(false);
        message.error({
          content: "Some Error Occurred!!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
      });
  };

  const handleCancel = () => {
    setVisible(false);
    setConfirmLoading(false);
  };

  return (
    <>
      <Modal
        title="Edit Record"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <FormRenderer
          loading={loading}
          form={uform}
          setForm={setUForm}
          handleSubmit={handleOk}
          save={false}
        />
      </Modal>

      <Row className={classes["Row"]}>
        <Col md={14}>
          <p className={classes["Title"]}>{title}</p>
        </Col>
        <Col className={classes["Col"]} md={10}></Col>
      </Row>
      <p></p>
      {form ? (
        <FormRenderer
          loading={loading}
          form={form}
          setForm={setForm}
          handleSubmit={handleSubmit}
          save={true}
        />
      ) : (
        <>
          <Skeleton active={true} />
        </>
      )}
      <hr></hr>
      <p></p>
      {rows && columns.length > 0 ? (
        <EmployeeTable
          val={false}
          data={rows}
          columns={columns}
          deleteHandler={deleteHandler}
        />
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

export default Misc;
