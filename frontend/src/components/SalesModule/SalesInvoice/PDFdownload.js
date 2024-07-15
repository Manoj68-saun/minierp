import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./pdf.css";
// import logo from "../src/images/1.jpg"

const PDFdownload = (props) => {
  // const[total,setTotal]=useState()
  console.log(props, "hey there sup");
  const [totalTaxSum, setTotalTaxSum] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  // props.pdfResponse.item
  // console.log(props.pdfResponse, "this is my pdf data");
  // console.log(props.pdfResponse.address[0].add1, "this is my pdf data");
  const contentRef = useRef(null);

  const handleDownload = () => {
    const content = contentRef.current;

    if (content) {
      const pdfOptions = {
        margin: 2,
        filename: "downloaded-pdf.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(content).set(pdfOptions).save();
    }
  };
  const items = props.pdfResponse.item;
  const amount = props.pdfResponse.item;
  const myamt = props.pdfResponse.totalAmount;
  const itemsLength = items.length;
  const txLength = myamt.length;
  console.log(itemsLength);

  let total_qty = 0;
  let tamount = 0;

  useEffect(() => {
    // Logging total_qty after rendering rows
    console.log("Total Quantity is Printing in the useEffect:", total_qty);
  }, [items]);
  useEffect(() => {
    thisisTax();
  }, [props.pdfResponse.totalAmount]);

  useEffect(() => {
    // Calculate round-off and update state
    const calculatedRoundOff =
      Math.round(totalTaxSum + tamount) - (totalTaxSum + tamount);
    setRoundOff(calculatedRoundOff);
  }, [totalTaxSum, tamount]);

  console.log("hi there we are outside of the effect:", totalTaxSum);

  const thisisTax = () => {
    // Calculate total tax
    const newTotalTaxSum = props.pdfResponse.totalAmount.reduce(
      (sum, totalAmount) => {
        const taxValAsNumber = parseFloat(totalAmount.tax_val);
        return isNaN(taxValAsNumber) ? sum : sum + taxValAsNumber;
      },
      0
    );

    // Update state with the new value
    setTotalTaxSum(newTotalTaxSum, () => {
      console.log("Total Tax Sum updated:", totalTaxSum);
    });
  };

  console.log(totalTaxSum);

  const renderRows = () => {
    return items.map((item, index) => {
      const qtyAsNumber = parseFloat(item.qty); // or use parseInt if you want an integer

      if (!isNaN(qtyAsNumber)) {
        total_qty += qtyAsNumber;
      }

      const amtAsNumber = parseFloat(item.itemqtyamount);
      if (!isNaN(amtAsNumber)) {
        tamount += amtAsNumber;
      }

      // setTotal+=item.qty;
      console.log(item.qty);
      console.log("hey there_________________--------------------------------");
      return (
        <tr key={index}>
          <td style={{ ...tdStyle }}>{index + 1}</td>
          <td style={{ ...tdStyle }}>{item.item}</td>
          <td style={{ ...tdStyle, textAlign: "end" }}>{item.hsn}</td>
          <td style={{ ...tdStyle, textAlign: "end" }}>{item.qty}</td>
          <td style={{ ...tdStyle, textAlign: "end" }}>{item.bk_rate}</td>
          <td style={{ ...tdStyle, textAlign: "end" }}>{item.um}</td>
          <td style={{ ...tdStyle, textAlign: "end" }}>{item.discount_amt}</td>
          <td style={{ ...tStyle, textAlign: "end" }}>{item.itemqtyamount}</td>
        </tr>
      );
    });
  };

  // Logging total_qty after rendering rows
  // console.log('Total Quantity:', total_qty);

  console.log(totalTaxSum);

  const numberToWords = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convert = (num) => {
      if (num < 10) return units[num];
      if (num < 20) return teens[num - 11];
      if (num < 100) {
        const tenPart = tens[Math.floor(num / 10)];
        const unitPart = units[num % 10];
        return tenPart + (unitPart ? ` ${unitPart}` : "");
      }
      if (num < 1000)
        return units[Math.floor(num / 100)] + " Hundred " + convert(num % 100);
      if (num < 100000)
        return (
          convert(Math.floor(num / 1000)) + " Thousand " + convert(num % 1000)
        );
      if (num < 10000000)
        return (
          convert(Math.floor(num / 100000)) + " Lakh " + convert(num % 100000)
        );
      return "Number out of range";
    };

    const integerPart = Math.floor(num);
    const fractionalPart = Math.round((num - integerPart) * 100); // Convert decimal part to integer for simplicity

    let result = convert(integerPart);
    if (fractionalPart > 0) {
      result += ` point ${convert(fractionalPart)}`;
    }

    return result;
  };

  const thStyle = {
    borderBottom: "0.5px solid #000", // Bolder border for header bottom
    borderRight: "0.5px solid #000", // Border applied to header right
    padding: "4px",
    fontWeight: "bold",
    fontSize: "0.7rem",
  };
  const tkStyle = {
    borderBottom: "0.5px solid #000", // Bolder border for header bottom
    // Border applied to header right
    padding: "4px",
    fontWeight: "bold",
    fontSize: "0.7rem",
  };

  const tdStyle = {
    borderRight: "0.5px solid #000", // Border applied to all sides for data cells
    borderBottom: "0.5px solid #000",
    padding: "4px",
    fontSize: "0.6rem",
  };
  const tStyle = {
    // Border applied to all sides for data cells
    borderBottom: "0.5px solid #000",
    padding: "4px",
    fontSize: "0.6rem",
    width: "10rem",
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
  };

  const normalTdStyle = {
    padding: "0.2px",
    fontSize: "0.8rem",
  };

  const boldTdStyle = {
    ...normalTdStyle,
    fontWeight: "bold", // Bold for the first column
    fontSize: "0.8rem",
  };

  const lastRowStyle = {
    borderBottom: "1px solid #000", // Bottom border for the last row
  };

  return (
    <div className="App">
      <div style={{ paddingTop: "1rem" }} ref={contentRef}>
        {/* Your JSX content goes here */}

        <div
          style={{
            width: "100%",
            border: "0.5px solid black",
            height: "69rem",
          }}
        >
          <div
            style={{
              marginTop: "-19",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              borderBottom: "0.5px solid black",
              height: "144px",
            }}
          >
            <div style={{ textAlign: "center", width: "70%" }}>
              <div style={{ width: "70%", paddingTop: "3ss0px" }}>
                <span
                  style={{
                    fontWeight: "bolder",
                    fontSize: 19,
                    fontFamily: "Tahoma, sans-serif",
                  }}
                >
                  TAX INVOICE
                </span>

                <h6
                  style={{
                    fontWeight: "bolder",
                    color: "red",
                    fontSize: 10,
                    fontFamily: "Tahoma, sans-serif",
                    marginTop: "1rem",
                  }}
                >
                  ({props.pdfResponse.address[0].site_desc})
                  {props.pdfResponse.address[0].add1}
                </h6>

                <h6
                  style={{
                    fontWeight: "bolder",
                    color: "red",
                    fontSize: 10,
                    fontFamily: "Tahoma, sans-serif",
                    marginTop: "1rem",
                  }}
                >
                  Phone: +91{props.pdfResponse.address[0].ph1} E-mail:-
                  {props.pdfResponse.address[0].email}
                </h6>
              </div>
            </div>

            <div
              style={{
                width: "40%",
                borderLeft: "1px solid black",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        height: "4%",
                        fontSize: 12,
                        borderTop: "1px solid black",
                        borderBottom: "1px solid black",
                        padding: 1,
                      }}
                    ></td>
                    <td
                      style={{
                        fontSize: 12,
                        fontWeight: 1000,
                        height: "1%",
                        borderLeft: "1px solid black",
                        borderTop: "1px solid black",
                        padding: 1,
                      }}
                    >
                      Original for Recipient
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        height: "4%",
                        fontSize: 12,
                        borderBottom: "1px solid black",
                        padding: 1,
                      }}
                    ></td>
                    <td
                      style={{
                        fontSize: 12,
                        fontWeight: 1000,
                        height: "1%",
                        borderLeft: "1px solid black",
                        borderTop: "1px solid black",
                        padding: 1,
                      }}
                    >
                      Duplicate for Transporter
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: "40%",
                        height: "4%",
                        fontSize: 12,
                        borderBottom: "1px solid black",
                        padding: 1,
                      }}
                    ></td>
                    <td
                      style={{
                        fontSize: 12,
                        fontWeight: 1000,
                        height: "1%",
                        borderBottom: "1px solid black",
                        borderLeft: "1px solid black",
                        borderTop: "1px solid black",
                        padding: 1,
                      }}
                    >
                      Triplicate for Supplier
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                {/* <img src={logo} style={{ height: "91px", width: "192px" }} alt="logo cant show" /> */}
              </div>
            </div>
          </div>

          {/* this is my second info */}
          <div
            style={{
              borderBottom: "1px solid black",
              width: "100%",
              height: "15%",
              display: "flex",
            }}
          >
            <div
              style={{
                borderRight: "1px solid black",
                width: "50%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 12,
                  padding: 11,
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        Our GSTIN :
                      </td>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        {props.pdfResponse.address[0].gst_no}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        CIN NO :
                      </td>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        {props.pdfResponse.address[0].cin_no}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        Invoice No :
                      </td>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        {props.pdfResponse.customere[0].invoice_no}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        Invoice Date :
                      </td>
                      <td style={{ textAlign: "left" }}>
                        {props.pdfResponse.customere[0].invoice_date}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ width: "50%", height: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 12,
                  padding: 11,
                  justifyContent: "flex-start",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    lineHeight: "1.2",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        Vehicle No :
                      </td>
                      <td style={{ textAlign: "left" }}>
                        {props.pdfResponse.customere[0].truck_number}
                      </td>
                    </tr>
                    {/* <tr>
          <td style={{ textAlign: 'left', fontWeight: 'bold' }}>GR NO :</td>
          <td style={{ textAlign: 'left' }}></td>
        </tr>
        <tr>
          <td style={{ textAlign: 'left', fontWeight: 'bold' }}>Date & Time of Supply :</td>
          <td style={{ textAlign: 'left' }}>02/02/2022 12:53:54</td>
        </tr> */}
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        Place of Supply :
                      </td>
                      <td style={{ textAlign: "left" }}></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        E-WayBill No :
                      </td>
                      <td style={{ textAlign: "left" }}></td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", fontWeight: "bold" }}>
                        Remarks :
                      </td>
                      <td style={{ textAlign: "left" }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* this is my third info */}
          <div
            style={{
              borderBottom: "1px solid black",
              width: "100%",
              height: "15%",
              display: "flex",
            }}
          >
            <div
              style={{
                borderRight: "1px solid black",
                width: "50%",
                height: "100%",
                paddingLeft: "0.7rem",
              }}
            >
              <h6 style={{ fontWeight: "bolder" }}>
                Detail Of Receiver (Billed to)
              </h6>

              <div style={{ fontSize: "0.7rem" }}>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>Name :</td>
                  <td
                    style={{
                      border: "none",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].cust}
                  </td>
                </tr>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>Address :</td>
                  <td
                    style={{
                      height: "4rem",
                      width: "20rem",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].delivery_add}
                  </td>
                </tr>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>State Code:</td>
                  <td
                    style={{
                      border: "none",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].state_code}
                  </td>
                </tr>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>GSTIN/UIN:</td>
                  <td
                    style={{
                      border: "none",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].service_tax_no}
                  </td>
                </tr>
              </div>
            </div>

            <div
              style={{ width: "50%", height: "100%", paddingLeft: "0.7rem" }}
            >
              <h6 style={{ fontWeight: "bolder" }}>
                Detail Of Consignee (Shipped to)
              </h6>
              <div style={{ fontSize: "0.7rem" }}>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>Name :</td>
                  <td
                    style={{
                      border: "none",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].cust}
                  </td>
                </tr>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>Address :</td>
                  <td
                    style={{
                      height: "4rem",
                      width: "20rem",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].delivery_add}
                  </td>
                </tr>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>State Code:</td>
                  <td
                    style={{
                      border: "none",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].state_code}
                  </td>
                </tr>
                <tr style={{ border: "none" }}>
                  <td style={{ border: "none" }}>GSTIN/UIN:</td>
                  <td
                    style={{
                      border: "none",
                      marginLeft: "10rem",
                      padding: "0px 0px 0px 20px",
                    }}
                  >
                    {props.pdfResponse.customere[0].service_tax_no}
                  </td>
                </tr>
              </div>
            </div>
          </div>

          <div>
            <div>
              <thead style={{ width: "100%" }}>
                <tr>
                  <th style={thStyle}>S.No </th>
                  {/* <th style={{...thStyle, }}>Description of Goods</th> */}
                  <th
                    style={{ ...thStyle, width: "250px", textAlign: "center" }}
                  >
                    Description of Goods
                  </th>

                  <th
                    style={{ ...thStyle, width: "105px", textAlign: "center" }}
                  >
                    HSN Code
                  </th>
                  <th
                    style={{ ...thStyle, width: "100px", textAlign: "center" }}
                  >
                    Qty(Kg)
                  </th>
                  <th
                    style={{ ...thStyle, width: "100px", textAlign: "center" }}
                  >
                    Rate
                  </th>

                  <th
                    style={{ ...thStyle, width: "100px", textAlign: "center" }}
                  >
                    Alt UOM{" "}
                  </th>

                  <th
                    style={{ ...thStyle, width: "100px", textAlign: "center" }}
                  >
                    Discount
                  </th>
                  <th
                    style={{ ...tkStyle, width: "10px", textAlign: "center" }}
                  >
                    Taxable Value
                  </th>
                </tr>
              </thead>

              <tbody>
                {itemsLength > 0 ? (
                  renderRows()
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      style={{ border: "2px solid red", textAlign: "end" }}
                    >
                      No items to display
                    </td>
                  </tr>
                )}
              </tbody>
            </div>
          </div>

          <div>
            <table style={tableStyle}>
              <tbody style={{}}>
                <tr style={{}}>
                  <td
                    style={{ ...boldTdStyle, textAlign: "end", width: "41%" }}
                  >
                    Total :
                  </td>
                  <td style={{ ...normalTdStyle }}>{total_qty}</td>
                  <td
                    style={{
                      ...normalTdStyle,
                      textAlign: "end",
                      fontWeight: "bold",
                    }}
                  >
                    {tamount}
                  </td>
                </tr>

                <tr style={lastRowStyle}>
                  <td style={normalTdStyle}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* my second last box */}
          <div
            style={{
              borderBottom: "1px solid black",
              width: "100%",
              height: "18%",
              display: "flex",
            }}
          >
            <div style={{ borderRight: "0.5px solid black", width: "50%" }}>
              <div
                style={{
                  paddingLeft: "0.7rem",
                  borderBottom: "0.5px solid black",
                  width: "100%",
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontWeight: "bolder", fontSize: 13 }}>
                  Total Tax (In Words) :
                </span>
                <span style={{ fontSize: 13 }}>
                  Rupees. {numberToWords(Math.round(totalTaxSum))} only
                </span>
              </div>
              <div
                style={{
                  paddingLeft: "0.7rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontWeight: "bolder", fontSize: 13 }}>
                  Total Invoice Value (In Words) :
                </span>
                <span style={{ fontSize: 13 }}>
                  Rupees. {numberToWords(Math.round(totalTaxSum + tamount))}{" "}
                  only
                </span>
              </div>
            </div>
            <table className="your-table">
              <thead>
                <tr>
                  <th style={{ borderTop: "none" }}>Total Amount Before Tax</th>
                  <th
                    style={{
                      textAlign: "end",
                      borderTop: "none",
                      borderRight: "none",
                    }}
                  >
                    {tamount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.pdfResponse.totalAmount.map((totalAmountItem, index) => (
                  <tr key={index}>
                    <td>
                      {totalAmountItem.get_charge} @{" "}
                      {totalAmountItem.charge_value}
                    </td>
                    <td>{totalAmountItem.tax_val}</td>
                  </tr>
                ))}

                <tr>
                  <td>TOTAL G.S.T</td>
                  <td> {totalTaxSum.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Net Amount</td>
                  <td>{(totalTaxSum + tamount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Round Off +/-</td>
                  <td>
                    {roundOff >= 0
                      ? `+${roundOff.toFixed(2)}`
                      : `${roundOff.toFixed(2)}`}
                  </td>
                </tr>
                <tr>
                  <td>Final Net Amount</td>
                  <td>{Math.round(totalTaxSum + tamount)}</td>
                </tr>
                <tr></tr>
              </tbody>
            </table>
          </div>

          {/* Last box */}
          <div
            style={{
              borderBottom: "1px solid black",
              width: "100%",
              height: "20%",
              display: "flex",
            }}
          >
            <div style={{ borderRight: "0.5px solid black", width: "50%" }}>
              <span
                style={{
                  fontWeight: "bolder",
                  paddingLeft: "0.6rem",
                  fontSize: 12,
                }}
              >
                Our Bank Details
              </span>
              <table style={{ borderCollapse: "collapse", lineHeight: "1.2" }}>
                <tbody style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                  <tr style={{ border: "none" }}>
                    <td style={{ border: "none", paddingLeft: "10px" }}>
                      Bank Name.:{" "}
                    </td>
                    <td style={{ border: "none" }}>
                      {props.pdfResponse.address[0].bank_name}
                    </td>
                  </tr>
                  <tr style={{ border: "none" }}>
                    <td style={{ border: "none", paddingLeft: "10px" }}>
                      Bank Address.:
                    </td>
                    <td style={{ border: "none" }}>
                      {" "}
                      {props.pdfResponse.address[0].bank_add1}
                    </td>
                  </tr>
                  <tr style={{ border: "none" }}>
                    <td style={{ border: "none", paddingLeft: "10px" }}>
                      Bank A/C No.:{" "}
                    </td>
                    <td style={{ border: "none" }}>
                      {props.pdfResponse.address[0].account_no}
                    </td>
                  </tr>
                  <tr style={{ border: "none" }}>
                    <td style={{ border: "none", paddingLeft: "10px" }}>
                      Bank IFSC.:{" "}
                    </td>
                    <td style={{ border: "none" }}>
                      {props.pdfResponse.address[0].ifsc_cd}
                    </td>
                  </tr>
                </tbody>
              </table>

              <span
                style={{
                  fontWeight: "bolder",
                  paddingLeft: "0.6rem",
                  fontSize: 12,
                }}
              >
                TERMS & CONDITIONS :
              </span>

              <div
                style={{
                  fontSize: "0.7rem",
                  paddingLeft: "0.6rem",
                  fontWeight: "bold",
                }}
              >
                <p style={{ margin: "0" }}>
                  1) Accounts should be settled by cross Cheques/Drafts payable
                  to the company act Delhi/Haryana only
                </p>
                <p style={{ margin: "0" }}>
                  2) Interest @24% will be charged if payment not made within 15
                  Days
                </p>
                <p style={{ margin: "0" }}>
                  3) Our responsibility ceases absolutely once the goods have
                  been handed over in carriers
                </p>
                <p style={{ margin: "0" }}>
                  4) Subject to Delhi/Haryana jurisdiction
                </p>
              </div>
            </div>

            <div style={{ width: "50%" }}>
              <div
                style={{
                  paddingLeft: "0.7rem",
                  borderBottom: "0.5px solid black",
                  width: "100%",
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    margin: "45px 2px 20px 61px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                  }}
                >
                  Certified that the particulars given above are true & correct
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "10px",
                  textAlign: "end",
                }}
              >
                <span style={{ fontWeight: "bolder", fontSize: "0.7rem" }}>
                  For
                </span>
                <br />
                <br />
                <br />
                <br />
                <span style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
                  Authorised Signatory <br />
                  <span>E. & O.E</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button style={{ position: "fixed", bottom: 0 }} onClick={handleDownload}>
        Download as PDF
      </button>
    </div>
  );
};

export default PDFdownload;
