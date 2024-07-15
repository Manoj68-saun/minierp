import { Row, Col, Skeleton, Tooltip, message } from "antd";
import { RiUserSearchFill } from "react-icons/ri";
import axios from "axios";
import classes from "../Pages.module.css";
import { useState, useEffect, useContext } from "react";
import DataContext from "../../../Context/dataContext";
import EmployeeTable from "../EmployeeTable/EmployeeTable";
import { Link } from "react-router-dom";
import BasicDetail from "./BasicDetail";
import SizeDetail from "./SizeDetail";
import { TreeDataState } from "@devexpress/dx-react-grid";
import { CssBaseline } from "@material-ui/core";

const TaxDetail = (props) => {
  console.log(props, "props in size detail");
  console.log(props.data, "props in taxdetail");
  // console.log(props.data[0].charge_code)
  const employeeData = useContext(DataContext);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState(null);
  const [columnsup, setColumnsup] = useState([]);
  const [rowsup, setRowsup] = useState(null);
  const [drows, setDRows] = useState(null);
  const [taxdata, setTaxdata] = useState({});
  const identifiers = ["invoiceSize"];

  //     useEffect(
  //         () => {
  //             if(props.editMode==false){
  //     setColumnsup((columnsup) => {

  //         const newNewCols = [  {name: "SNO", title: "SNo"},{name: "charge_desc", title: "Charge Desc"},{name: "charge_value", title: "Charge Value"},{name: "charge_type", title: "Charge Type"},{name: "ref_chrg", title: "Ref Charge"},{name: "ref_on", title: "Ref On"}, {name: "TaxValue", title: "TaxValue"}, {name: "RunningTotal", title: "Running Total"}]
  //         return newNewCols;
  //     })
  // }
  // }

  // ,[] );

  // console.log(columnsup)

  //     setRowsup(rowsup => {

  //         let newRows = props.data.map((row,index) => {

  //                  return(
  //             {

  //                 "SNO": index + 1,
  //                 ...row
  //             }
  //         );})

  //         return newRows;
  //   })

  const HandleSaveTax = (event) => {
    props.setData((data) => {
      var chargedata = [];
      var netamt = [];

      console.log(data);
      //  console.log (data.invoiceSize[0].hsn,"hsn")
      // console.log(console.log (data.invoiceSize[0].hsn))
      const postData = {
        ...data,
      };

      console.log(postData);

      axios
        .post(
          employeeData.URL + "/api/v1/salesInvoice/invoice-tax-cal-by-hsn/",
          postData,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          var ob = response.data.data.ob1;
          var newTax = response.data.data.newTax;

          setDRows(null);
          setRows(null);
          setColumns([]);

          var amount = 0;
          var l = 0;
          for (var i = 0; i < ob.length; i++) {
            l = l + ob[i].length;
            // console.log(l)
            amount = amount + newTax[l - 1].RunningTotal;

            // console.log(amount)
          }
          netamt.push(amount);

          document.getElementById("net_amount").value = amount;

          chargedata.push(...response.data.data.newTax);

          // localStorage.setItem("chargesData", JSON.stringify(chargesData));
          // const postData = {
          //     ...data,
          //    taxdata: response.data.data.newTax
          // }

          setColumns((columns) => {
            let newCols = response.data.data.feild1[0].map((col) => {
              return {
                name: col.name,
                title: col.name.split("_").join(" ").toLowerCase(),
              };
            });

            const newNewCols = [
              { name: "SNO", title: "SNo" },
              { name: "charge_desc", title: "Charge Desc" },
              { name: "charge_value", title: "Charge Value" },
              { name: "charge_type", title: "Charge Type" },
              { name: "ref_chrg", title: "Ref Charge" },
              { name: "ref_on", title: "Ref On" },
              { name: "TaxValue", title: "TaxValue" },
              { name: "RunningTotal", title: "Running Total" },
            ];
            return newNewCols;
          });

          setRows((rows) => {
            let newRows = response.data.data.newTax.map((row, index) => {
              return {
                V: (
                  <Tooltip placement="bottom" title="View" color="#1777C4">
                    <Link
                      to={
                        "/sales/transaction/salesInvoice-form-view1/" +
                        row["charge_code"]
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

                SNO: index + 1,
                ...row,
              };
            });

            return newRows;
          });
          //            setTaxdata(taxdata => {

          //             let newTaxdata =  response.data.data.newTax.map((row,index) => {
          //             return({

          //                 ...row
          //             })
          //         })

          //         return newTaxdata;

          //     })
        });

      // how call setTaxdata here because taxdata: response.data.data.newTax show response not define here

      //  console.log(taxdata,"taxdata")

      return {
        ...data,
        taxdata: taxdata,
        chargedata: chargedata,
        amount: netamt,
      };
    });
  };

  return props.editMode ? (
    <>
      <Row className={classes["Row"]}>
        <Col md={14}>
          <p className={classes["Title"]}>Tax Details</p>
        </Col>
        {/* { console.log(taxdata,"taxdata")} */}
        <Col className={classes["Col"]} md={10}></Col>
      </Row>
      <p></p>
      <Row className={classes["Row"]}>
        <Col lg={19} md={17}></Col>
        <Col className={classes["Col"]} lg={5} md={7}>
          <button
            className={classes["ProfileButton"]}
            onClick={(event) => HandleSaveTax(event)}
          >
            Tax Calculation
          </button>
        </Col>
      </Row>
      <p></p>
      {rows && columns.length > 0 ? (
        <>
          <EmployeeTable data={rows} columns={columns} val={true} />
        </>
      ) : (
        <>
          <Skeleton loading={false} />
          <Skeleton loading={false} />
          <Skeleton loading={false} />
          <Skeleton loading={false} />
        </>
      )}
    </>
  ) : (
    <>
      {
        //    props.data.map((data, index) => {

        // return (
        <div>
          <Row className={props.editMode ? classes["RowDEX"] : classes["RowD"]}>
            <table>
              <tr>
                <th style={{ padding: "6px" }}>Charge Desc</th>
                <th style={{ whiteSpace: "nowrap" }}>Charge Value</th>
                <th style={{ padding: "6px" }}>Charge Type</th>
                <th>Ref Charge</th>
                <th>Ref On</th>
                <th>TaxValue</th>
                <th>Running Total</th>
              </tr>

              {props.data.map((row) => {
                return (
                  <tr>
                    <td>{row.charge_desc}</td>
                    <td>{row.charge_value}</td>
                    <td>{row.charge_type}</td>
                    <td>{row.ref_chrg}</td>
                    <td>{row.ref_on}</td>
                    <td>{row.taxvalue}</td>
                    <td>{row.runningtotal}</td>
                  </tr>
                );
              })}
            </table>
          </Row>
        </div>

        // );

        //  })
      }
    </>
  );
};

export default TaxDetail;
