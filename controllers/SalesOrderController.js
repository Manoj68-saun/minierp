const { Client } = require("pg");
const fs = require("fs");
const wrapper = require("../utils/wrapper");
const pdf2base64 = require("pdf-to-base64");
const Pdfmake = require("pdfmake");
const util = require("util");
const unlink = util.promisify(fs.unlink);
const path = require("path");
//const jimp=require('jimp');

const jsonData = JSON.parse(
  fs.readFileSync(`${__dirname}/../SalesOrder.json`, "utf8")
);

const generateOrderId = async (client) => {
  //const response = await client.query(`SELECT MAX(BOOKING_CODE) AS MAX FROM SL_TRANS_BOOKING_HDR`);

  //const response1 = await client.query(`SELECT MAX(TO_NUMBER(SUBSTR(BOOKING_CODE,8))) M FROM SL_TRANS_BOOKING_HDR`);
  // const response1=await client.query(`SELECT max(TO_NUMBER(BOOKING_CODE,'"x"99999'))M FROM SL_TRANS_BOOKING_HDR`);
  const response1 = await client.query(
    // `SELECT MAX((substr(BOOKING_CODE,8)))M FROM SL_TRANS_BOOKING_HDR`
    `SELECT MAX(CAST(substring(BOOKING_CODE from '[0-9]+$') AS INTEGER)) AS M FROM SL_TRANS_BOOKING_HDR`
  );
  console.log("ggjhjkkjkj", response1);

  // const num='A12223-';
  // const num2=num.concat(response1);
  // return(num2);
  // const num = response.rows[0].MAX.slice(0,8);
  // const num2 = (response1.rows[0].M) + 1;
  // const numZeros=7-num2.toString().length;
  // const zeros = '0'.repeat(numZeros);
  // console.log(`${num}${zeros}${num2}`);
  // return `${num}${zeros}${num2}`;
  if (response1.rows.m === null) {
    return `A12223-1`;
  } else {
    console.log("numfgfgfgfgfgf");
    const num = Number(response1.rows[0].m) + 1;

    console.log(num);
    return `A12223-${num}`;
  }
  //  const numZeros = 8 - num.toString().length;
  //   const zeros = '0'.repeat(numZeros);
  //  console.log(`A12223-${num}`);
  //   return `A12223-${num}`;
};

const generateInvoiceId = async (client) => {
  const response1 = await client.query(
    `SELECT MAX((substr(invoice_no,8)))M FROM sl_trans_invoice_hdr`
  );
  console.log("ggjhjkkjkj", response1);

  if (response1.rows.m === null) {
    return `I12223-1`;
  } else {
    console.log("numfgfgfgfgfgf");
    const num = Number(response1.rows[0].m) + 1;

    console.log(num);
    return `I12223-${num}`;
  }
};
exports.getAllOrder = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  function date_to_postgres(dateparam) {
    var date = new Date(dateparam);

    date.setHours(date.getHours() + 5);

    date.setMinutes(date.getMinutes() + 30);

    date.toISOString().slice(0, 10);
    // how reverse date
    var Date2 = date.toISOString().slice(0, 10);
    var reverse = Date2.split("-").reverse().join("-");

    console.log(reverse);

    return reverse;
  }
  const order = await client.query(
    `select booking_code, get_distributor(distributor_code) customer_name ,timestamptostring (booking_date::timestamp)booking_date, get_external_entity(dealer_name) dealer_name, order_type, 
    invoice_type_code, payment_days, get_del_site(del_site_code) address, freight_type_code,  broker_code, payment_code,
    tolerance, payment_amt, remarks from sl_trans_booking_hdr`
  );

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getOrderData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Order Code",
    });
  }

  const data = {};
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    //  how call timestamptostring function when arr[i].fieldsRequired==='booking_date'

    console.log(arr, "vandna");

    let query = `SELECT ${arr[i].fieldsRequired} FROM ${arr[i].tableName}`;
    if (arr[i].leftJoiner) {
      arr[i].leftJoiner.forEach((joiner) => {
        query += ` LEFT JOIN ${joiner}`;
      });
    }
    query += ` WHERE ${arr[i].uniqueOrderIdentifier}='${req.params.code}'`;
    console.log(query, "manoj");
    const dbData = await client.query(query);
    data[arr[i].responseFieldName] = dbData.rows;
  }
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getAdditionalData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  const arr = jsonData.createNupdate.fieldNames;
  const data = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].lovFields) {
      let query = ``;
      const obj = arr[i].lovFields;
      for (const key in obj) {
        query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName}`;
        console.log(query);
        const dbData = await client.query(query);
        data[key] = dbData;
      }
    }
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.createOrder = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const arr = jsonData.createNupdate.fieldNames;
  const orderCode = await generateOrderId(client);
  for (let i = 0; i < arr.length; i++) {
    if (req.body[arr[i].responseFieldName]) {
      if (!arr[i].typeArray) {
        const obj = req.body[arr[i].responseFieldName][0];
        let fields = ``;
        let values = ``;
        Object.keys(arr[i].fieldsRequired).forEach((field) => {
          if (obj[field]) {
            fields += `${field}, `;
            if (arr[i].fieldsRequired[field] === "date")
              values += `TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
            else if (arr[i].fieldsRequired[field] === "number")
              values += `${obj[field]}, `;
            else values += `'${obj[field]}', `;
          }
        });
        fields = fields.slice(0, -2);
        values = values.slice(0, -2);
        const query = `INSERT INTO ${arr[i].tableName} (BOOKING_CODE, ${fields}) VALUES ('${orderCode}', ${values})`;
        console.log(query);
        await client.query(query);
      } else {
        const arr1 = req.body[arr[i].responseFieldName];
        for (let j = 0; j < arr1.length; j++) {
          const obj = arr1[j];
          let fields = ``;
          let values = ``;
          Object.keys(arr[i].fieldsRequired).forEach((field) => {
            if (obj[field]) {
              fields += `${field}, `;
              if (arr[i].fieldsRequired[field] === "date")
                values += `TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
              else if (arr[i].fieldsRequired[field] === "number")
                values += `${obj[field]}, `;
              else values += `'${obj[field]}', `;
            }
          });
          fields = fields.slice(0, -2);
          values = values.slice(0, -2);
          const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueOrderIdentifier}, ${fields}) VALUES ('${orderCode}', ${values})`;
          console.log(query);
          await client.query(query);
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Order Created Successfully",
  });
});

exports.updateOrder = wrapper(async (req, res, next) => {
  console.log("manoj  mmake othher constoeller");
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",

      message: "Please specify the Order Code",
    });
  }
  const client = req.dbConnection;

  const arr = jsonData.createNupdate.fieldNames;
  // console.log(arr);
  // console.log(req.body)
  for (let i = 0; i < arr.length; i++) {
    if (req.body[arr[i].responseFieldName]) {
      if (!arr[i].typeArray) {
        const obj = req.body[arr[i].responseFieldName][0];

        console.log(obj);
        let fields = ``;
        Object.keys(arr[i].fieldsRequired).forEach((field) => {
          if (obj[field]) {
            if (arr[i].fieldsRequired[field] === "date")
              fields += `${field} = TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
            else if (arr[i].fieldsRequired[field] === "number")
              fields += `${field} = ${obj[field]}, `;
            else fields += `${field} = '${obj[field]}', `;
          }
        });
        fields = fields.slice(0, -2);
        console.log("ddfdfdfdfddfddfddfd");
        console.log(fields);
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueOrderIdentifier}='${req.params.code}'`;
        console.log(query);
        await client.query(query);
      } else {
        const arr1 = req.body[arr[i].responseFieldName];
        for (let j = 0; j < arr1.length; j++) {
          const obj = arr1[j];
          if (obj.PARAM === "UPDATE") {
            let fields = ``;
            Object.keys(arr[i].fieldsRequired).forEach((field) => {
              if (obj[field]) {
                if (arr[i].fieldsRequired[field] === "date")
                  fields += `${field} = TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
                else if (arr[i].fieldsRequired[field] === "number")
                  fields += `${field} = ${obj[field]}, `;
                else fields += `${field} = '${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${
              arr[i].uniqueRowIdentifier
            }='${obj[arr[i].uniqueRowIdentifier]}'`;
            console.log(query);
            await client.query(query);
          } else if (obj.PARAM === "DELETE") {
            const query = `DELETE FROM ${arr[i].tableName} WHERE ${
              arr[i].uniqueRowIdentifier
            }='${obj[arr[i].uniqueRowIdentifier]}'`;
            console.log(query);
            await client.query(query);
          } else {
            let fields = ``;
            let values = ``;
            Object.keys(arr[i].fieldsRequired).forEach((field) => {
              if (obj[field]) {
                fields += `${field}, `;
                if (arr[i].fieldsRequired[field] === "date")
                  values += `TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
                else if (arr[i].fieldsRequired[field] === "number")
                  values += `${obj[field]}, `;
                else values += `'${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            values = values.slice(0, -2);
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueOrderIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "Order Updated Successfully",
  });
});

exports.deleteOrder = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Order Code",
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `DELETE FROM ${arr[i].tableName} SET MARKED='D' WHERE ${arr[i].uniqueOrderIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Order Deleted Successfully",
  });
});

const fonts = {
  Roboto: {
    normal: `${__dirname}/../fonts/Roboto-Regular.ttf`,
    bold: `${__dirname}/../fonts/Roboto-Medium.ttf`,
    italics: `${__dirname}/../fonts/Roboto-Italic.ttf`,
    bolditalics: `${__dirname}/../fonts/Roboto-MediumItalic.ttf`,
  },
};

const pdfmake = wrapper(async (req, res, str) => {
  const client = req.dbConnection;
  const order = await client.query(
    `select booking_code,GET_DISTRIBUTOR (DISTRIBUTOR_Code)  CUST,get_external_entity (DEALER_NAME) DELAER_nm,get_del_site (DEL_SITE_CODE) Delivery_add, coalesce(get_freight(FREIGHT_TYPE_CODE),'n/a')Freight_type ,BOOKING_DATE from sl_trans_booking_hdr where booking_code='${req.params.code}'`
  );
  const itemDetail = await client.query(
    `select get_item(item_code) item, get_size(size_code) siz, get_quality(quality) qual,  get_uom(uom) um, no_pcs, qty, book_rate_guage, discount_amount, tot_item_amt, net_rate, net_size_rate from sl_trans_booking_size_detail where booking_code='${req.params.code}'`
  );
  const itemlogo = await client.query(
    `select site_desc, add1,ph1,email from sl_mst_site`
  );
  const company = await client.query(`select company_name from sl_mst_company`);
  //       const totalAmount=await client.query(
  // `INSERT INTO sl_trans_booking_size_detail (TOT_ITEM_AMT) VALUES ( '${(rows[i].qty)*(rows[i].net_rate)) )where booking_code='${req.params.code}'`
  //       );

  console.log(order.rows[0].booking_date);
  console.log(company.rows[0].company_name);
  var date = new Date(order.rows[0].booking_date);
  console.log(date.toLocaleDateString());
  console.log(date.toLocaleTimeString());
  //console.log(itemDetail.rows);
  let productDetail = itemDetail.rows;

  var headers = {
    file_0: {
      col_1: {
        text: "S.No",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_2: {
        text: "Item",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_3: {
        text: "Size",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_4: {
        text: "Grade",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_5: {
        text: "Pcs",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_6: {
        text: "Quantity",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_7: {
        text: "Rate",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_8: {
        text: "Uom",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
      col_9: {
        text: "Total",
        style: "tableheader",
        alignment: "left",
        color: "#02075d",
        fontSize: 9,
        bold: true,
        margin: [0, 8, 0, 0],
      },
    },
  };
  var rows = productDetail;
  console.log(rows);
  var body = [];
  for (var key in headers) {
    var header = headers[key];
    var row = new Array();
    row.push(header.col_1);
    row.push(header.col_2);
    row.push(header.col_3);
    row.push(header.col_4);
    row.push(header.col_5);
    row.push(header.col_6);
    row.push(header.col_7);
    row.push(header.col_8);
    row.push(header.col_9);
    body.push(row);
  }

  for (var i = 0; i < rows.length; i++) {
    var row = new Array();
    row.push(i + 1);
    row.push(rows[i].item);
    row.push(rows[i].siz);
    row.push(rows[i].qual);
    row.push(rows[i].no_pcs);
    row.push(rows[i].qty);
    row.push(rows[i].net_rate);
    row.push(rows[i].um);
    row.push(rows[i].qty * rows[i].net_rate);
    // row.push(rows[i].tot_item_amt);
    body.push(row);
  }

  const sumtotal = function () {
    var total = 0;
    for (var i = 0; i < rows.length; i++) {
      total += rows[i].qty * rows[i].net_rate;
    }
    console.log(total);
    return total;
  };
  const netRate = sumtotal();
  console.log(netRate);

  var th = ["", "thousand", "million", "billion", "trillion"];
  var dg = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  var tn = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  var tw = [
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  //const word= function (s) {

  const word = function (num) {
    var ones = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen ",
    ];
    var tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    if ((num = num.toString()).length > 9)
      return "Overflow: Maximum 9 digits supported";
    n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = "";
    str +=
      n[1] != 0
        ? (ones[Number(n[1])] || tens[n[1][0]] + " " + ones[n[1][1]]) + "Crore "
        : "";
    str +=
      n[2] != 0
        ? (ones[Number(n[2])] || tens[n[2][0]] + " " + ones[n[2][1]]) + "Lakh "
        : "";
    str +=
      n[3] != 0
        ? (ones[Number(n[3])] || tens[n[3][0]] + " " + ones[n[3][1]]) +
          "Thousand "
        : "";
    str +=
      n[4] != 0
        ? (ones[Number(n[4])] || tens[n[4][0]] + " " + ones[n[4][1]]) +
          "Hundred "
        : "";
    str +=
      n[5] != 0
        ? (str != "" ? "and " : "") +
          (ones[Number(n[5])] || tens[n[5][0]] + " " + ones[n[5][1]])
        : "";
    return str;
  };

  //     s = s.toString();
  //     console.log(s)
  //     s = s.replace(/[\, ]/g,'');
  //     if (s != parseFloat(s)) return 'not a number';
  //     var x = s.indexOf('.');
  //     if (x == -1)
  //         x = s.length;
  //     if (x > 15)
  //         return 'too big';
  //     var n = s.split('');
  //     var str = '';
  //     var sk = 0;
  //     for (var i=0;   i < x;  i++) {
  //         if ((x-i)%3==2) {
  //             if (n[i] == '1') {
  //                 str += tn[Number(n[i+1])] + ' ';
  //                 i++;
  //                 sk=1;
  //             } else if (n[i]!=0) {
  //                 str += tw[n[i]-2] + ' ';
  //                 sk=1;
  //             }
  //         } else if (n[i]!=0) { // 0235
  //             str += dg[n[i]] +' ';
  //             if ((x-i)%3==0) str += 'hundred ';
  //             sk=1;
  //         }
  //         if ((x-i)%3==1) {
  //             if (sk)
  //                 str += th[(x-i-1)/3] + ' ';
  //             sk=0;
  //         }
  //     }

  //     if (x != s.length) {
  //         var y = s.length;
  //         str += 'point ';
  //         for (var i=x+1; i<y; i++)
  //             str += dg[n[i]] +' ';
  //     }
  //     return str.replace(/\s+/g,' ');
  // }

  const final = word(netRate);

  console.log(final);

  const filename = "test";
  const file = `C:/imaxpart4/pdfs/` + filename + ".pdf";
  console.log(file);
  //console.log(__dirname);
  const downloadPD = `C:/imaxpart4/pdfs/` + filename + ".pdf";
  let docDefination = {
    pageSize: "A4",
    content: [
      {
        style: "tableExample",
        color: "#444",
        table: {
          widths: [350, 21, 144],

          // keepWithHeaderRows: 1,
          body: [
            [
              {
                rowSpan: 3,
                text: "SALE ORDER",
                style: "tableHeader",
                alignment: "center",
                color: "blue",
                bold: true,
                fontSize: 16,
                margin: [0, 10, 0, 10],
              },
              "",
              {
                text: "Original for Recipient",
                alignment: "center",
                bold: true,
              },
            ],
            [
              "",
              "",
              {
                text: "Duplicate for Transporter",
                alignment: "center",
                bold: true,
              },
            ],
            [
              "",
              "",
              {
                text: "Triplicate for Supplier",
                alignment: "center",
                bold: true,
              },
            ],
          ],
        },
      },

      {
        style: "tableExamplee",
        table: {
          heights: [75],
          widths: [350, 174],
          body: [
            // [{text: 'SALE ORDER' ,style: 'tableHeader',alignment: 'center',color: 'blue',bold: true,fontSize:16,margin:[0,10,0,10]}, {text:'Original for Recipient\nDuplicate for Transporter\nTriplicate for Supplier',alignment: 'center',bold: true,decoration: 'underline' }],
            [
              {
                text:
                  company.rows[0].company_name +
                  "\nUnit-1" +
                  itemlogo.rows[0].add1 +
                  itemlogo.rows[0].ph1 +
                  itemlogo.rows[0].email,
                alignment: "center",
                color: "red",
                bold: true,
                margin: [16, 16],
              },
              {
                image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAABvCAYAAABsMxVZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDM5MUI5RkJDNzc5MTFFNjk5RTVBMEFBQzNGOTBCQzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDM5MUI5RkFDNzc5MTFFNjk5RTVBMEFBQzNGOTBCQzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjBDQ0E0OTMyQUU4ODc4MzJFMTM3NkE1MDk2MzZBNTk1IiBzdFJlZjpkb2N1bWVudElEPSIwQ0NBNDkzMkFFODg3ODMyRTEzNzZBNTA5NjM2QTU5NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgMVr0MAAIDlSURBVHja7L0HnGRXdSf8vy9U7hxnenpyj2Y0o5xQ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",
                width: 100,
                height: 55,
                alignment: "center",
              },
            ],
          ],
        },
      },

      {
        style: "tableExample",
        table: {
          widths: [262, 262],
          headerRows: 1,
          body: [
            [
              {
                text: "Customer Name    :    " + order.rows[0].cust,
                margin: [0, 1],
              },
              {
                text:
                  "Order No                       :      " +
                  order.rows[0].booking_code,
                bold: true,
                margin: [0, 1],
              },
            ],
            [
              {
                text: "Dealer Name          :    " + order.rows[0].dealer_nm,
                margin: [0, 1],
              },
              {
                text:
                  "Order Date                    :      " +
                  date.toLocaleDateString(),
                margin: [0, 1],
              },
            ],
            [
              "Broker                      :    ",
              {
                text:
                  "Customer Po No          :      " +
                  order.rows[0].freight_type,
                margin: [0, 1],
              },
            ],
            [
              "GSTIN                      :     ",
              {
                text:
                  "Customer Po Date       :      " + order.rows[0].freight_type,
                margin: [0, 1],
              },
            ],
            [
              "Delivery Site            :    ",
              {
                text:
                  "Freight type                   :      " +
                  order.rows[0].freight_type,
                margin: [0, 2],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "white";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length
              ? "black"
              : "black";
          },
          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        },
      },

      {
        style: "tableExampl",
        table: {
          widths: [350, 174],
          headerRows: 1,
          body: [
            [
              {
                text: "Customer Name  :  " + order.rows[0].cust,
                color: "#CCCCCC",
              },
              {
                text: "Order No  :  " + order.rows[0].booking_code,
                color: "#CCCCCC",
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "white";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length
              ? "black"
              : "#CCCCCC";
          },

          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex % 2 === 0 ? "#CCCCCC" : null;
          },

          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        },
      },

      {
        style: "tableProductDetail",
        table: {
          headerrRows: 1,
          widths: [
            "10%",
            "30%",
            "10%",
            "10%",
            "10%",
            "10%",
            "10%",
            "6.4%",
            "10%",
          ],
          body: body,
        },
      },

      //       {
      //   text: 'ioremitypesettingindustry.manojdmmdvdddldldldldlldlldlldldddd',
      //   style: 'center'
      // },

      {
        style: "tableExampl",
        table: {
          widths: [350, 174],
          headerRows: 1,
          body: [
            [
              {
                text: "Customer Name  :  " + order.rows[0].cust,
                color: "#CCCCCC",
              },
              {
                text: "Order No  :  " + order.rows[0].booking_code,
                color: "#CCCCCC",
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "white";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length
              ? "black"
              : "#CCCCCC";
          },

          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex % 2 === 0 ? "#CCCCCC" : null;
          },

          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        },
      },

      {
        style: "tableExample",
        table: {
          widths: [230, 294],
          // headerRows: 1,
          body: [
            [
              { text: "Total Value (In Words) : " + final, color: "#02075d" },
              {
                text:
                  "Total : " +
                  netRate +
                  "\n\n\n Certified that the particulars given above are true & correct\n" +
                  company.rows[0].company_name +
                  "\n\n\n\n\nAuthorised Signatory\nE. & O.E.",
                alignment: "right",
                fontSize: 11,
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "black";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length
              ? "black"
              : "black";
          },
          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        },
      },
      {
        style: "tableExampl",
        table: {
          widths: [350, 174],
          headerRows: 1,
          body: [
            [
              {
                text: "Customer Name  :  " + order.rows[0].cust,
                color: "#CCCCCC",
              },
              {
                text: "Order No  :  " + order.rows[0].booking_code,
                color: "#CCCCCC",
              },
            ],
          ],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 1 : 1;
          },
          hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "black" : "white";
          },
          vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length
              ? "black"
              : "#CCCCCC";
          },

          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex % 2 === 0 ? "#CCCCCC" : null;
          },

          // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          // paddingLeft: function(i, node) { return 4; },
          // paddingRight: function(i, node) { return 4; },
          // paddingTop: function(i, node) { return 2; },
          // paddingBottom: function(i, node) { return 2; },
          // fillColor: function (rowIndex, node, columnIndex) { return null; }
        },
      },
    ],

    // tableExample: {
    //   margin:[0,10,0,10]
    // },

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        color: "#02075d",
      },
      titles: {
        alignment: "left",
        color: "red",
      },
      total: {
        color: "red",
      },

      center: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 0],
        background: "#F0F0F0",
        color: "#F0F0F0",
      },
      tableProductDetail: {
        fontSize: 9,
      },
      tableExample: {
        fontSize: 12,
      },
      tableExamplee: {
        fontSize: 11,
      },
      tableExampl: {
        fontSize: 12,
      },
      // tableExampl:{
      //   background:'gray'
      // }
    },
  };
  const writable = fs.createWriteStream(`C:/imaxpart5/pdfs/test.pdf`);

  let pdfmake = new Pdfmake(fonts);
  let pdfDoc = pdfmake.createPdfKitDocument(docDefination);
  await pdfDoc.pipe(writable);
  pdfDoc.end();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

  //return res.sendFile(`C:/imaxpart4/pdfs/test.pdf`)
  writable.on("finish", () => {
    res.sendFile(`C:/imaxpart5/pdfs/test.pdf`, () => {
      unlink(`C:/imaxpart5/pdfs/test.pdf`);
    });
  });
});

exports.downloadPDF = async (req, res, next) => {
  console.log("1" + req.params.code);
  await pdfmake(req, res, "download");
  console.log("2" + req.params.code);
};

exports.getOrderForInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const order1 = await client.query(
    `SELECT booking_code, distributor_code, booking_date, dealer_name, order_type, invoice_type_code, payment_days, del_site_code, freight_type_code,  broker_code, payment_code, tolerance, payment_amt, remarks FROM sl_trans_booking_hdr WHERE booking_code='${req.params.code}'`
  );
  const order2 = await client.query(
    // `SELECT  booking_code, item_code ,get_item(item_code) item_nm, size_code, get_size(size_code) size_nm, quality, get_quality(quality), no_pcs, uom, discount_on, dis_type, qty, book_rate_guage, discount_amount, tot_item_amt, net_rate, net_size_rate,unique_id FROM sl_trans_booking_size_detail WHERE booking_code='${req.params.code}'`
    `SELECT  d.booking_code Booking_No ,get_item(d.item_code) Item, d.item_code, get_uom(d.uom) Uom_nm, d.uom, get_size(d.size_code) Size, d.size_code, 
    get_quality(d.quality) Grade,d.quality, d.no_pcs Pcs,  d.qty Qty, d.bk_rate Rate, d.discount_amount Discount_Value, d.discount_on, d.dis_type, 
    d.booking_rate Rate_After_Discount,  d.tot_item_amt Amount,d.unique_id,(SELECT HSN FROM SL_MST_ITEM WHERE MARKED IS NULL AND ITEM_CODE=d.ITEM_CODE)HSN
    FROM sl_trans_booking_size_detail d WHERE d.booking_code ='${req.params.code}'`
  );
  res.status(200).json({
    status: "success",
    data: {
      order1,
      order2,
    },
  });
});

// exports.getOrderForInvoice = wrapper(async (req, res, next) => {
//   const client = req.dbConnection;
//   const order1 = await client.query(
//     `SELECT booking_code, distributor_code, booking_date, dealer_name, order_type, invoice_type_code, payment_days, del_site_code, freight_type_code,  broker_code, payment_code, tolerance, payment_amt, remarks FROM sl_trans_booking_hdr WHERE booking_code='${req.params.code}'`
//   );
//   const order2 = await client.query(
//     // `SELECT  booking_code, item_code ,get_item(item_code) item_nm, size_code, get_size(size_code) size_nm, quality, get_quality(quality), no_pcs, uom, discount_on, dis_type, qty, book_rate_guage, discount_amount, tot_item_amt, net_rate, net_size_rate,unique_id FROM sl_trans_booking_size_detail WHERE booking_code='${req.params.code}'`
//     `SELECT  d.booking_code Booking_No ,get_item(d.item_code) Item, d.item_code, get_uom(d.uom) Uom_nm, d.uom, get_size(d.size_code) Size, d.size_code,
//     get_quality(d.quality) Grade,d.quality, d.no_pcs Pcs,  d.qty Qty, d.bk_rate Rate, d.discount_amount Discount_Value, d.discount_on, d.dis_type,
//     d.booking_rate Rate_After_Discount,  d.tot_item_amt Amount,d.unique_id,(SELECT HSN FROM SL_MST_ITEM WHERE MARKED IS NULL AND ITEM_CODE=d.ITEM_CODE)HSN
//     FROM sl_trans_booking_size_detail d WHERE d.booking_code ='${req.params.code}'`
//   );
//   // Create an empty object to hold data
//   const data = {};
//   const order3 =
//     await client.query(`SELECT  d.booking_code  ,d.item_code,  d.uom, d.size_code,
//   d.quality, d.no_pcs ,  d.qty , d.bk_rate , d.discount_amount , d.discount_on, d.dis_type,
//   d.booking_rate ,  d.tot_item_amt ,d.unique_id,(SELECT HSN FROM SL_MST_ITEM WHERE MARKED IS NULL AND ITEM_CODE=d.ITEM_CODE)HSN
//   FROM sl_trans_booking_size_detail d WHERE d.booking_code ='${req.params.code}'`);

//   data["invoiceSizeWithOrder"] = order3.rows;
//   res.status(200).json({
//     status: "success",

//     order1,
//     order2,
//     data,
//   });
// });

exports.getCustomerOrderForInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const order1 = await client.query(
    `SELECT booking_code, distributor_code, booking_date, dealer_name, order_type, invoice_type_code, payment_days, del_site_code, freight_type_code,  broker_code, payment_code, tolerance, payment_amt, remarks FROM sl_trans_booking_hdr WHERE booking_code='${req.params.code}'`
  );
  const order2 = await client.query(
    `SELECT  booking_code, item_code ,get_item(item_code) item_nm, size_code, get_size(size_code) size_nm, quality, get_quality(quality), no_pcs, uom, discount_on, dis_type, qty, book_rate_guage, discount_amount, tot_item_amt, net_rate, net_size_rate,unique_id FROM sl_trans_booking_size_detail WHERE booking_code='${req.params.code}'`
  );
  res.status(200).json({
    status: "success",
    data: {
      order1,
      order2,
    },
  });
});

exports.getCustomerOrder = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  // Create an empty object to hold data
  const data = {};
  const order2 = await client.query(
    `SELECT  booking_code, item_code ,get_item(item_code) item_nm, size_code, get_size(size_code) size_nm, quality, get_quality(quality), no_pcs, uom, discount_on, dis_type, qty, book_rate_guage, discount_amount, tot_item_amt, net_rate, net_size_rate,unique_id, bk_rate, booking_rate FROM sl_trans_booking_size_detail  WHERE unique_id='${req.params.code}'`
  );
  data["invoiceSizeWithOrder"] = order2.rows;
  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getCustumerOrderForInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const code = req.params.code;
  const c = req.query.c;
  console.log(code);
  console.log(c);
  console.log(`Code: ${code}`);
  console.log(`c: ${c}`);
  const order1 = await client.query(
    `SELECT H.BOOKING_CODE,REF_BOOKING_NO,H.BOOKING_DATE,H.DISTRIBUTOR_code,GET_DISTRIBUTOR(H.DISTRIBUTOR_code)CUST_NAME,H.DEALER_NAME,
    GET_EXTERNAL_ENTITY(H.DEALER_NAME)DEALER_NM,D.ITEM_CODE,GET_ITEM(D.ITEM_CODE)TEM_NM,D.SIZE_CODE,GET_SIZE(D.SIZE_CODE)SZ,D.QUALITY,GET_QUALITY(D.QUALITY)QUAL,
    D.QTY,D.NO_PCS,D.UOM,GET_UOM(D.UOM)UOM_NM,D.UNIQUE_ID,D.BOOKING_RATE,
    (SELECT HSN FROM SL_MST_ITEM WHERE MARKED IS NULL AND ITEM_CODE=D.ITEM_CODE)HSN,
    (coalesce(D.QTY,0)-coalesce(aa.TOT_QTY,0))PEN_QTY,(coalesce(D.NO_PCS,0)-coalesce(v.TOT_PCS,0))PEN_PCS
    FROM  sl_trans_booking_hdr h
    LEFT OUTER JOIN sl_trans_booking_size_detail d ON (H.BOOKING_CODE = D.BOOKING_CODE)
    LEFT OUTER JOIN (SELECT DE.Booking_no,DE.UNIQ_CODE,SUM(DE.QTY)TOT_QTY,SUM(DE.NO_PCS)TOT_PCS
    FROM SL_TRANS_INV_SIZE_DETAIL DE WHERE DE.MARKED IS NULL GROUP BY  DE.Booking_no,DE.UNIQ_CODE) aa ON (aa.BOOKING_NO=H.BOOKING_CODE )
    LEFT OUTER JOIN  (SELECT DE.Booking_no,DE.UNIQ_CODE,SUM(DE.QTY)TOT_QTY,SUM(DE.NO_PCS)TOT_PCS
    FROM SL_TRANS_INV_SIZE_DETAIL DE WHERE DE.MARKED IS NULL GROUP BY  DE.Booking_no,DE.UNIQ_CODE)v ON (v.UNIQ_CODE=D.UNIQUE_ID)
    WHERE H.MARKED IS NULL AND D.MARKED IS NULL and H.DISTRIBUTOR_code= '${req.params.code}'  and h.booking_code<>'${req.query.c}'`
  );

  res.status(200).json({
    status: "success",
    data: {
      order1,
    },
  });
});

exports.createInvoiceFromOrder = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  //const arr = jsonData.createNupdate.fieldNames;
  const invoiceCode = await generateInvoiceId(client);
  // console.log (req.body)
  const obj = req.body;
  console.log("fgfgfgfg", obj.salesOrder[0].booking_code);
  const query = `INSERT INTO sl_trans_invoice_hdr (INVOICE_NO, DISTRIBUTOR_CODE, DEALER_CODE, ORDER_TYPE, DEL_ADD, BOOKING_NO, BOOKING_DATE) VALUES ('${invoiceCode}', ${obj.salesOrder[0].distributor_code}, ${obj.salesOrder[0].dealer_name}, ${obj.salesOrder[0].order_type}, ${obj.salesOrder[0].del_site_code}, '${obj.salesOrder[0].booking_code}', '${obj.salesOrder[0].booking_date}')`;
  console.log(query);
  await client.query(query);

  for (let i = 0; i < obj.bookingSize.length; i++) {
    const query = `INSERT INTO sl_trans_inv_size_detail (INVOICE_NO, ITEM_CODE, SIZE_CODE, QUALITY, QTY, BOOKING_NO, UOM_FOR_ITEMS, NET_RATE, NET_DISCOUNT, AMOUNT) VALUES ('${invoiceCode}', ${obj.bookingSize[i].item_code}, ${obj.bookingSize[i].size_code}, ${obj.bookingSize[i].quality}, ${obj.bookingSize[i].qty}, '${obj.bookingSize[i].booking_code}', ${obj.bookingSize[i].uom}, ${obj.bookingSize[i].net_rate},${obj.bookingSize[i].discount_amount},${obj.bookingSize[i].net_size_rate})`;
    console.log(query);
    await client.query(query);
  }

  // }
  // if (req.body[arr[i].responseFieldName]) {
  //   if (!arr[i].typeArray) {
  //     const obj = req.body[arr[i].responseFieldName][0];
  //     let fields = ``;
  //     let values = ``;
  //     Object.keys(arr[i].fieldsRequired).forEach((field) => {
  //       if (obj[field]) {
  //         fields += `${field}, `;
  //         if (arr[i].fieldsRequired[field] === 'date') values += `TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
  //         else if (arr[i].fieldsRequired[field] === 'number') values += `${obj[field]}, `;
  //         else values += `'${obj[field]}', `;

  //       }
  //     });
  //     fields = fields.slice(0, -2);
  //     values = values.slice(0, -2);
  //     const query = `INSERT INTO ${arr[i].tableName} (BOOKING_CODE, ${fields}) VALUES ('${orderCode}', ${values})`;
  //     console.log(query);
  //     await client.query(query);
  //   } else {
  //     const arr1 = req.body[arr[i].responseFieldName];
  //     for (let j = 0; j < arr1.length; j++) {
  //       const obj = arr1[j];
  //       let fields = ``;
  //       let values = ``;
  //       Object.keys(arr[i].fieldsRequired).forEach((field) => {
  //         if (obj[field]) {
  //           fields += `${field}, `;
  //           if (arr[i].fieldsRequired[field] === 'date') values += `TO_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
  //           else if (arr[i].fieldsRequired[field] === 'number') values += `${obj[field]}, `;
  //           else values += `'${obj[field]}', `;
  //         }
  //       });
  //       fields = fields.slice(0, -2);
  //       values = values.slice(0, -2);
  //       const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueOrderIdentifier}, ${fields}) VALUES ('${orderCode}', ${values})`;
  //       console.log(query);
  //       await client.query(query);
  //     }
  //   }
  // }
  // }

  res.status(200).json({
    status: "success",
    message: "Order Created Successfully",
  });
});

exports.getAllOrderRegisterByWeek = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  var today = new Date();
  var startOfWeek = today.getDate() - today.getDay();
  var endOfWeek = startOfWeek + 6;
  console.log(today.getDay());
  console.log(startOfWeek);
  console.log(endOfWeek);
  var startDate = new Date(today.setDate(startOfWeek));
  var endDate = new Date(today.setDate(endOfWeek));
  console.log(startDate);
  console.log(endDate);
  var startDateInISO = startDate.toISOString().split("T")[0];
  var endDateInISO = endDate.toISOString().split("T")[0];
  var startDate2 = `${startDateInISO.split("-").reverse().join("-")}`;
  var endDate2 = endDateInISO.split("-").reverse().join("-");
  console.log(startDate2);
  console.log(endDate2);
  console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrweek");
  var dat1 = [];
  function date_to_postgres(dateparam) {
    var date = new Date(dateparam);

    date.setHours(date.getHours() + 5);

    date.setMinutes(date.getMinutes() + 30);

    date.toISOString().slice(0, 10);
    // how reverse date
    var Date2 = date.toISOString().slice(0, 10);
    var reverse = Date2.split("-").reverse().join("-");

    console.log(reverse);

    return reverse;
  }
  var query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,grade_name,order_rate,order_qty 
  from V_SALE_ORDER  where so_date between  '${startDateInISO}' AND '${endDateInISO}'
  `;
  const order = await client.query(query);
  console.log(order.rows);
  for (var i = 0; i < order.rows.length; i++) {
    dat1.push({
      booking_code: order.rows[i].booking_code,
      so_date: date_to_postgres(order.rows[i].so_date),
      customer_name: order.rows[i].customer_name,
      delaer_name: order.rows[i].delaer_name,
      delivery_add: order.rows[i].delivery_add,
      freight_type: order.rows[i].freight_type,
      tolerance: order.rows[i].tolerance,
      item_name: order.rows[i].item_name,
      size_name: order.rows[i].size_name,
      grade_name: order.rows[i].grade_name,
      order_rate: order.rows[i].order_rate,
      order_qty: order.rows[i].order_qty,
    });
  }
  console.log(dat1);
  res.status(200).json({
    status: "success",
    data: {
      order,
      dat1,
    },
  });
});

exports.getAllPendingSalesByWeek = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  var today = new Date();
  var startOfWeek = today.getDate() - today.getDay();
  var endOfWeek = startOfWeek + 6;
  console.log(today.getDay());
  console.log(startOfWeek);
  console.log(endOfWeek);
  var startDate = new Date(today.setDate(startOfWeek));
  var endDate = new Date(today.setDate(endOfWeek));
  console.log(startDate);
  console.log(endDate);
  var startDateInISO = startDate.toISOString().split("T")[0];
  var endDateInISO = endDate.toISOString().split("T")[0];
  var startDate2 = `${startDateInISO.split("-").reverse().join("-")}`;
  var endDate2 = endDateInISO.split("-").reverse().join("-");
  console.log(startDate2);
  console.log(endDate2);
  console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrweek");
  var dat1 = [];
  function date_to_postgres(dateparam) {
    var date = new Date(dateparam);

    date.setHours(date.getHours() + 5);

    date.setMinutes(date.getMinutes() + 30);

    date.toISOString().slice(0, 10);
    // how reverse date
    var Date2 = date.toISOString().slice(0, 10);
    var reverse = Date2.split("-").reverse().join("-");

    console.log(reverse);

    return reverse;
  }
  var query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,
  grade_name,order_rate,order_qty,invoice_qty,balance_qty 
  from V_SALE_ORDER where so_date between  '${startDateInISO}' AND '${endDateInISO}'
  `;
  const order = await client.query(query);
  console.log(order.rows);
  for (var i = 0; i < order.rows.length; i++) {
    dat1.push({
      booking_code: order.rows[i].booking_code,
      so_date: date_to_postgres(order.rows[i].so_date),
      customer_name: order.rows[i].customer_name,
      delaer_name: order.rows[i].delaer_name,
      delivery_add: order.rows[i].delivery_add,
      freight_type: order.rows[i].freight_type,
      tolerance: order.rows[i].tolerance,
      item_name: order.rows[i].item_name,
      size_name: order.rows[i].size_name,
      grade_name: order.rows[i].grade_name,
      order_rate: order.rows[i].order_rate,
      order_qty: order.rows[i].order_qty,
      invoice_qty: order.rows[i].invoice_qty,
      balance_qty: order.rows[i].balance_qty,
    });
  }
  console.log(dat1);
  res.status(200).json({
    status: "success",
    data: {
      invoice,
      dat1,
    },
  });
});

exports.getAllOrderRegister = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  var dat1 = [];
  function date_to_postgres(dateparam) {
    var date = new Date(dateparam);

    date.setHours(date.getHours() + 5);

    date.setMinutes(date.getMinutes() + 30);

    date.toISOString().slice(0, 10);
    // how reverse date
    var Date2 = date.toISOString().slice(0, 10);
    var reverse = Date2.split("-").reverse().join("-");

    console.log(reverse);

    return reverse;
  }
  var query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,grade_name,order_rate,order_qty 
  from V_SALE_ORDER
  `;
  if (req.query.to) {
    `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,grade_name,order_rate,order_qty 
  from V_SALE_ORDER where so_date between  '${req.query.from}' AND '${req.query.to}'
  `;
  } else {
    query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,grade_name,order_rate,order_qty 
    from V_SALE_ORDER
    `;
  }
  const order = await client.query(query);

  for (var i = 0; i < order.rows.length; i++) {
    dat1.push({
      booking_code: order.rows[i].booking_code,
      so_date: date_to_postgres(order.rows[i].so_date),
      customer_name: order.rows[i].customer_name,
      delaer_name: order.rows[i].delaer_name,
      delivery_add: order.rows[i].delivery_add,
      freight_type: order.rows[i].freight_type,
      tolerance: order.rows[i].tolerance,
      item_name: order.rows[i].item_name,
      size_name: order.rows[i].size_name,
      grade_name: order.rows[i].grade_name,
      order_rate: order.rows[i].order_rate,
      order_qty: order.rows[i].order_qty,
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
      dat1,
    },
  });
});

exports.getPendingOrders = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  var dat1 = [];
  function date_to_postgres(dateparam) {
    var date = new Date(dateparam);

    date.setHours(date.getHours() + 5);

    date.setMinutes(date.getMinutes() + 30);

    date.toISOString().slice(0, 10);
    // how reverse date
    var Date2 = date.toISOString().slice(0, 10);
    var reverse = Date2.split("-").reverse().join("-");

    console.log(reverse);

    return reverse;
  }

  var query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,
  grade_name,order_rate,order_qty,invoice_qty,balance_qty 
  from V_SALE_ORDER
  `;

  if (req.query.to) {
    query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,
    grade_name,order_rate,order_qty,invoice_qty,balance_qty 
    from V_SALE_ORDER where so_date between  '${req.query.from}' AND '${req.query.to}'
    `;
  } else {
    query = `select booking_code,so_date,customer_name,delaer_name,delivery_add,freight_type,tolerance,item_name,size_name,
    grade_name,order_rate,order_qty,invoice_qty,balance_qty 
    from V_SALE_ORDER
    `;
  }
  const order = await client.query(query);

  for (let i = 0; i < order.rows.length; i++) {
    dat1.push({
      booking_code: order.rows[i].booking_code,
      so_date: date_to_postgres(order.rows[i].so_date),
      customer_name: order.rows[i].customer_name,
      delaer_name: order.rows[i].delaer_name,
      delivery_add: order.rows[i].delivery_add,
      freight_type: order.rows[i].freight_type,
      tolerance: order.rows[i].tolerance,
      item_name: order.rows[i].item_name,
      size_name: order.rows[i].size_name,
      grade_name: order.rows[i].grade_name,
      order_rate: order.rows[i].order_rate,
      order_qty: order.rows[i].order_qty,
      invoice_qty: order.rows[i].invoice_qty,
      balance_qty: order.rows[i].balance_qty,
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
      dat1,
    },
  });
});

exports.AllLedger = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const ledger = await client.query(
    `
    SELECT
    distributor_code,
    distributor_name,
    ACC_CODE,
    AMT,
    (CASE
        WHEN COALESCE(amt, 0) < 0 THEN 'Dr'
        WHEN COALESCE(amt, 0) >= 0 THEN 'Cr'
    END) AS TYPE
FROM
(
    SELECT
        d.distributor_code,
        d.distributor_name,
        d.account_code ACC_CODE,
        (
            SELECT
                (COALESCE(SUM(round(D_TOT_AMT)), 0) - COALESCE(SUM(round(C_TOT_AMT)), 0)) AS amount
            FROM
                (
                    SELECT
                        CASE l.entry_type WHEN 'Credit' THEN l.amount * -1 ELSE l.amount END AS C_TOT_AMT,
                        CASE l.entry_type WHEN 'Debit' THEN l.amount * -1 ELSE l.amount END AS D_TOT_AMT
                    FROM
                        FIN_MST_T_VOUCHER_HDR f,
                        FIN_MST_T_VOUCHER_DET l
                    WHERE
                        f.marked IS NULL
                        AND l.marked IS NULL
                        AND f.voucher_code = l.voucher_code
                        AND f.voucher_date <= CURRENT_DATE
                        AND (l.account_code = d.account_code)
                        AND (f.voucher_date + COALESCE(l.no_days, 0) * INTERVAL '1 day') <= CURRENT_DATE -- Explicit cast to date
                ) AS p
        ) AS amt 
    FROM
        sl_mst_distributor d
    WHERE
        d.marked IS NULL
) AS t;
`
  );

  res.status(200).json({
    status: "success",
    data: {
      ledger,
    },
  });
});
