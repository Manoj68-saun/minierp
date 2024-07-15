/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const { Client } = require("pg");
const fs = require("fs");
const wrapper = require("../utils/wrapper");
const { Console } = require("console");
const pdf2base64 = require("pdf-to-base64");
const Pdfmake = require("pdfmake");
const util = require("util");
const unlink = util.promisify(fs.unlink);
const path = require("path");
const { reverse } = require("dns");

const jsonData = JSON.parse(
  fs.readFileSync(`${__dirname}/../SalesInvoice.json`, "utf8")
);

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

exports.getAllInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const invoice = await client.query(
    `select invoice_no, timestamptostring(invoice_date) invoice_date, get_distributor(distributor_code)distributor_name, get_external_entity(Dealer_code)dealer_name,
    net_wt, net_amt, tax_type, booking_no, del_add, voucher_code from sl_trans_invoice_hdr where marked is null`
  );
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
});

exports.getAllInvoiceRegisterByWeek = wrapper(async (req, res, next) => {
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
  var query = `SELECT H.INVOICE_NO,H.INVOICE_DATE,H.voucher_code,get_distributor(H.DISTRIBUTOR_CODE)customer_name, get_dealer_name(H.DEALER_CODE)dealer_name,
                    GET_ITEM(D.ITEM_CODE)ITEM_NAME,GET_SIZE(D.SIZE_CODE)SIZE_NAME,GET_QUALITY(D.QUALITY)GRADE,D.QTY,D.BK_RATE,D.ITEMQTYAMOUNT
                    FROM SL_TRANS_INVOICE_HDR H , SL_TRANS_INV_SIZE_DETAIL D WHERE H.MARKED IS NULL AND D.MARKED IS NULL
                    AND H.INVOICE_NO=D.INVOICE_NO AND H.INVOICE_DATE BETWEEN '${startDateInISO}' AND '${endDateInISO}'
                    `;
  const invoice = await client.query(query);
  console.log(invoice.rows);
  for (var i = 0; i < invoice.rows.length; i++) {
    console.log(invoice.rows[i].invoice_date);
    dat1.push({
      invoice_no: invoice.rows[i].invoice_no,
      invoice_date: date_to_postgres(invoice.rows[i].invoice_date),
      voucher_code: invoice.rows[i].voucher_code,
      customer_name: invoice.rows[i].customer_name,
      dealer_name: invoice.rows[i].dealer_name,
      item_name: invoice.rows[i].item_name,
      size_name: invoice.rows[i].size_name,
      grade: invoice.rows[i].grade,
      qty: invoice.rows[i].qty,
      bk_rate: invoice.rows[i].bk_rate,

      item_qtyamount: invoice.rows[i].item_qtyamount,
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

exports.getAllInvoiceRegister = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  // console.log(req.query, "jjjjjjjjjjj")
  console.log("manoj");
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
  var query = `SELECT H.INVOICE_NO,H.INVOICE_DATE,H.voucher_code,get_distributor(H.DISTRIBUTOR_CODE)customer_name, get_dealer_name(H.DEALER_CODE)dealer_name,
GET_ITEM(D.ITEM_CODE)ITEM_NAME,GET_SIZE(D.SIZE_CODE)SIZE_NAME,GET_QUALITY(D.QUALITY)GRADE,D.QTY,D.BK_RATE,D.ITEMQTYAMOUNT
FROM SL_TRANS_INVOICE_HDR H , SL_TRANS_INV_SIZE_DETAIL D WHERE H.MARKED IS NULL AND D.MARKED IS NULL
AND H.INVOICE_NO=D.INVOICE_NO
`;
  if (req.query.to) {
    query = `SELECT H.INVOICE_NO,H.INVOICE_DATE,H.voucher_code,get_distributor(H.DISTRIBUTOR_CODE)customer_name, get_dealer_name(H.DEALER_CODE)dealer_name,
  GET_ITEM(D.ITEM_CODE)ITEM_NAME,GET_SIZE(D.SIZE_CODE)SIZE_NAME,GET_QUALITY(D.QUALITY)GRADE,D.QTY,D.BK_RATE,D.ITEMQTYAMOUNT
  FROM SL_TRANS_INVOICE_HDR H , SL_TRANS_INV_SIZE_DETAIL D WHERE H.MARKED IS NULL AND D.MARKED IS NULL
  AND H.INVOICE_NO=D.INVOICE_NO  AND H.INVOICE_DATE BETWEEN '${req.query.from}' AND '${req.query.to}'`;
  } else {
    query = `SELECT H.INVOICE_NO,H.INVOICE_DATE,H.voucher_code,get_distributor(H.DISTRIBUTOR_CODE)customer_name, get_dealer_name(H.DEALER_CODE)dealer_name,
  GET_ITEM(D.ITEM_CODE)ITEM_NAME,GET_SIZE(D.SIZE_CODE)SIZE_NAME,GET_QUALITY(D.QUALITY)GRADE,D.QTY,D.BK_RATE,D.ITEMQTYAMOUNT
  FROM SL_TRANS_INVOICE_HDR H , SL_TRANS_INV_SIZE_DETAIL D WHERE H.MARKED IS NULL AND D.MARKED IS NULL
  AND H.INVOICE_NO=D.INVOICE_NO`;
  }
  const invoice = await client.query(query);
  console.log(invoice.rows);
  for (var i = 0; i < invoice.rows.length; i++) {
    console.log(invoice.rows[i].invoice_date);
    dat1.push({
      invoice_no: invoice.rows[i].invoice_no,
      invoice_date: date_to_postgres(invoice.rows[i].invoice_date),
      voucher_code: invoice.rows[i].voucher_code,
      customer_name: invoice.rows[i].customer_name,
      dealer_name: invoice.rows[i].dealer_name,
      item_name: invoice.rows[i].item_name,
      size_name: invoice.rows[i].size_name,
      grade: invoice.rows[i].grade,
      qty: invoice.rows[i].qty,
      bk_rate: invoice.rows[i].bk_rate,

      item_qtyamount: invoice.rows[i].item_qtyamount,
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

exports.getExternalData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  const externalData = await client.query(
    `SELECT  BOOKING_CODE, DEALER_CODE FROM SL_TRANS_BOOKING_HDR WHERE BOOKING_CODE = '${req.params.BookingId}'`
  );
  console.log(externalData);

  res.status(200).json({
    status: "success",
    data: {
      externalData,
    },
  });
});

exports.getInvoiceData = wrapper(async (req, res, next) => {
  console.log("vannnna");
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Order Code",
    });
  }
  console.log("vannnna");
  const data = {};
  const arr = jsonData.getNdelete.dataSources;
  // console.log(arr)
  for (let i = 0; i < arr.length; i++) {
    let query = `SELECT ${arr[i].fieldsRequired} FROM ${arr[i].tableName}`;
    if (arr[i].leftJoiner) {
      arr[i].leftJoiner.forEach((joiner) => {
        query += ` LEFT JOIN ${joiner}`;
      });
    }
    console.log("mannnna");
    query += ` WHERE ${arr[i].uniqueInvoiceIdentifier}='${req.params.code}'`;
    console.log(query);
    const dbData = await client.query(query);
    data[arr[i].responseFieldName] = dbData.rows;
    // console.log(arr[i].responseFieldName,  "anderka")
    // console.log(data)
    // console.log([arr[i].responseFieldName], "bharka")
    // console.log(dbData.rows, "right ka")
    // console.log(data)
  }
  // console.log(data)
  const dbData = await client.query(`
    select   get_charge(charge_code) charge_desc, charge_cat,charge_value ,charge_type, INCLUDE_COST, 
    use_for, get_charge(ref_charge)ref_chrg,ref_on, charge_type_on ,TaxValue,RunningTotal 
	   from  invoice_tax_charge_detail where invoice_no='${req.params.code}'
    `);
  data["invoiceTaxChargeDetail"] = dbData.rows;
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
        if (req.params.item_code && obj[key].columnsRequired == "size_code") {
          query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName}
          where item_code='${req.params.item_code}'`;
          console.log(query, "item-----------");
        } else {
          query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName}`;
        }
        console.log(query, "invoice------------------");
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

exports.createInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const arr = jsonData.createNupdate.fieldNames;
  console.log(arr);
  console.log("manoj");
  console.log(req);
  const body = req.body;
  console.log(body);
  // console.log(body.amount[0])
  var qty = 0;
  for (let i = 0; i < body.invoiceSize.length; i++) {
    qty = qty + body.invoiceSize[i].qty;
  }
  const TOTAL_QTY = qty;
  console.log(TOTAL_QTY, "Total qtyyyyyyyyyyyyyyyyyyyyyyyy");
  const invoiceCode = await generateInvoiceId(client);

  const vdate = body.salesInvoice[0].invoice_date;
  // for voucher posting
  console.log(vdate);
  const vdate1 = body.salesInvoice[0].invoice_date
    .split("-")
    .reverse()
    .join("-");

  // console.log(body.salesInvoice[0].invoice_date.split("-").reverse().join("-"))
  // const cdate1=cdate.split("-").reverse().join("-");
  console.log(vdate1);
  const getYear = await client.query(`select fin_yr('${vdate1}');`);
  const Year1 = getYear.rows[0].fin_yr;
  console.log(":gfhggjgjhjhjhkj", Year1);

  // const response1 = await client.query(` select Voucher_Id_1('${Year1}',to_char(to_date('${vdate}', 'YYYY-MM-DD'), 'MM'),to_char(to_date('${vdate}', 'YYYY-MM-DD'), 'DD'),
  // to_date('${vdate}', 'YYYY-MM-DD'),1,1,'A' )`);
  const ponse1 =
    await client.query(` select Voucher_Id_1('${Year1}',to_char(to_date('${vdate}', 'DD-MM-YYYY'), 'MM'),to_char(to_date('${vdate}', 'DD-MM-YYYY'), 'DD'),
    to_date('${vdate}', 'DD-MM-YYYY'),6,1,'A' )`);
  console.log("ggjhjkkjkj", ponse1);

  const voucherCode = ponse1.rows[0].voucher_id_1;
  console.log("voucherCode", voucherCode);
  //if(vdate1>='2020-04-01'){
  console.log(req.user.finyear);
  const Yesno = await client.query(`select fin_year_change from control_table`);
  const Noyes = Yesno.rows[0].fin_year_change;
  const getFinYear = await client.query(
    `select year_nm from fin_mst_year_mst where year_desc= '${req.user.finyear}'`
  );
  console.log("finYear", getFinYear);

  const finYear = getFinYear.rows[0].year_nm;
  console.log("finYear", finYear);
  //select Check_Voucher_Dt('2223' , '2023/06/07', coalesce('N'))
  const response2 = await client.query(
    `select Check_Voucher_Dt('${finYear}' , '${vdate1}', coalesce('${Noyes}','N'))`
  );
  console.log("response2", response2);
  const Checkdata = response2.rows[0].check_voucher_dt;

  //  select Check_Voucher_Dt('2223' , '2023/06/07', coalesce('N'))
  if (Checkdata == "N") {
    return res.status(200).json({
      status: "fail",
      message: "Invoice Date is not in range of Financial Year",
    });
  } else {
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
          const query = `INSERT INTO ${arr[i].tableName} (INVOICE_NO, voucher_code, net_amt, total_qty, ${fields}) VALUES ('${invoiceCode}', '${voucherCode}', ${body.amount[0]}, ${TOTAL_QTY}, ${values})`;
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
                  (dat1 = function reverse_date() {
                    var date = obj[field];
                    var split = date.split("-");
                    var reverse = split.reverse();
                    var join = reverse.join("-");
                    return join;
                  }),
                    (values += `TO_DATE('${dat1()}', 'YYYY-MM-DD HH:MM:SS'), `);
                else if (arr[i].fieldsRequired[field] === "number")
                  values += `${obj[field]}, `;
                else values += `'${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            values = values.slice(0, -2);
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueInvoiceIdentifier}, ${fields}) VALUES ('${invoiceCode}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }

    if (body.chargedata) {
      for (let i = 0; i < body.chargedata.length; i++) {
        const query = `INSERT INTO invoice_tax_charge_detail (INVOICE_NO, charge_code, charge_cat,charge_value ,charge_type, INCLUDE_COST, use_for, ref_charge,ref_on, charge_type_on ,RunningTotal, TaxValue) VALUES ('${invoiceCode}',${
          body.chargedata[i].charge_code
        },
  ${body.chargedata[i].charge_cat},${body.chargedata[i].charge_value}, '${
          body.chargedata[i].charge_type || ""
        }','${body.chargedata[i].include_cost}',
  '${body.chargedata[i].use_for}',${body.chargedata[i].ref_charge},'${
          body.chargedata[i].ref_on || ""
        }','${body.chargedata[i].charge_type_on || ""}' ,${
          body.chargedata[i].RunningTotal
        },${body.chargedata[i].TaxValue})`;

        console.log(query);
        await client.query(query);
      }
    }

    if (body.amount) {
      // {
      //   console.log('manoj')
      //   const queryvoucher = `INSERT INTO fin_mst_t_voucher_hdr (VOUCHER_CODE, VOUCHER_TYPE, VOUCHER_DATE, AMOUNT,NARRATION, VOUCHER_YEAR, COMPANY_CODE, UNIT_CODE , time, INV_YN, status, BILLING_CO_CD, send_status)
      //   VALUES ('${voucherCode}', ${6}, '${vdate}',${body.amount[0]},'${'Voucher posted against Distributor: '||get_distributor(body.salesInvoice[0].distributor_code)||','||'Truck No:'||body.salesInvoice[0].truck_number||','||'net Wt:'||body.salesInvoice[0].net_wt||','||
      //   'Invoice_NO:'|| invoiceCode||','||'QTY :'|| TOTAL_QTY}','${Year1}', ${1},${1}, ','${to_date(to_char(now(), 'DD-MM-YYYY HH24:MI:SS'), 'DD-MM-YYYY HH24:MI:SS')}','${Year1}','${M}', ${1},'${A}' )`;
      //   console.log(queryvoucher);
      //  await client.query(queryvoucher);
      // }

      var customer_name = body.salesInvoice[0].distributor_code;
      var a = await client.query(`select  get_distributor('${customer_name}')`);
      console.log(a);
      const distributor_name = a.rows[0].get_distributor;

      console.log(distributor_name, "distributor_name");
      const narration =
        "Voucher posted against Distributor: " +
        distributor_name +
        "," +
        "Truck No: " +
        (body.salesInvoice[0].truck_number || "") +
        "," +
        "net Wt: " +
        (body.salesInvoice[0].net_wt || "") +
        "," +
        "Invoice_NO: " +
        invoiceCode +
        "," +
        "QTY: " +
        TOTAL_QTY;
      console.log(narration, "narration");
      console.log("manoj");
      //  var currenttime=await client.query(`SELECT to_timestamp(to_char(now(), 'YYYY/MM/DD HH24:MI:SS'), 'YYYY/MM/DD HH24:MI:SS')`);
      //  const current_time=currenttime.rows[0].to_timestamp
      //   console.log(current_time,'current_time')
      const queryvoucher = `INSERT INTO fin_mst_t_voucher_hdr (VOUCHER_CODE, VOUCHER_TYPE, VOUCHER_DATE, AMOUNT,NARRATION, VOUCHER_YEAR, COMPANY_CODE, UNIT_CODE , INV_YN, status, BILLING_CO_CD, send_status)

  VALUES ('${voucherCode}', ${6}, '${vdate1}',${
        body.amount[0]
      },'${narration}','${Year1}', ${1},${1},  '${Year1}','M', ${1},'A' )`;
      console.log(queryvoucher);
      await client.query(queryvoucher);

      var account = await client.query(
        `select account_code from sl_mst_distributor where distributor_code=${customer_name}`
      );
      console.log(account);
      const acc_code = account.rows[0].account_code;
      console.log(acc_code, "acc_code");

      const detailvoucher = `INSERT INTO fin_mst_t_voucher_det (VOUCHER_CODE,Entry_type,account_code,AMOUNT,COMPANY_CODE,UNIT_CODE,  status ,BILLING_CO_CD, send_status,  DEALER_CODE, VOUCHER_TYPE) VALUES
  ('${voucherCode}', 'Credit', ${acc_code},${
        body.amount[0]
      }, ${1},${1},  'M', ${1},'A', ${body.salesInvoice[0].dealer_code}, ${3})`;

      console.log(detailvoucher);
      await client.query(detailvoucher);
    }
  }

  return res.status(200).json({
    status: "success",
    message: "Invoice Created Successfully",
  });
});

exports.updateInvoice = wrapper(async (req, res, next) => {
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Order Code",
    });
  }

  const client = req.dbConnection;
  const arr = jsonData.createNupdate.fieldNames;
  for (let i = 0; i < arr.length; i++) {
    if (req.body[arr[i].responseFieldName]) {
      if (!arr[i].typeArray) {
        const obj = req.body[arr[i].responseFieldName][0];
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
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueInvoiceIdentifier}='${req.params.code}'`;
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
            await client.query(
              `delete from invoice_tax_charge_detail where invoice_no='${
                obj[arr[i].uniqueRowIdentifier]
              }'`
            );
            // await client.query(`delete from FIN_MST_T_VOUCHER_DET where voucher_code='${obj[arr[i].uniqueRowIdentifier]}'`);
            // await client.query(`delete from FIN_MST_T_VOUCHER_HDR where voucher_code='${obj[arr[i].uniqueRowIdentifier]}'`);
          } else if (obj.PARAM === "DELETE") {
            console.log(arr[i].uniqueRowIdentifier);
            console.log("uniq_code_value", obj[arr[i].uniqueRowIdentifier]);
            const query = `DELETE FROM ${arr[i].tableName} WHERE ${
              arr[i].uniqueRowIdentifier
            }='${obj[arr[i].uniqueRowIdentifier]}'`;
            console.log(query);
            await client.query(query);
            await client.query(
              `delete from invoice_tax_charge_detail where invoice_no='${
                obj[arr[i].uniqueRowIdentifier]
              }'`
            );
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
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueInvoiceIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
            await client.query(
              `delete from invoice_tax_charge_detail where invoice_no='${
                obj[arr[i].uniqueRowIdentifier]
              }'`
            );
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "Invoice Updated Successfully",
  });
});

exports.deleteInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Invoice Code",
    });
  }

  const arr = jsonData.getNdelete.dataSources;
  const voucher = await client.query(
    `select VOUCHER_CODE from sl_trans_invoice_hdr where invoice_no ='${req.params.code}'`
  );
  console.log(voucher);
  const voucherId = voucher.rows[0].voucher_code;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `update FROM ${arr[i].tableName} set marked='D' WHERE ${arr[i].uniqueInvoiceIdentifier}='${req.params.code}'`
    );
  }
  await client.query(
    `update from invoice_tax_charge_detail set marked='D' where invoice_no='${req.params.code}'`
  );

  // console.log(voucherId)
  await client.query(
    `update  from FIN_MST_T_VOUCHER_HDR set marked='D' where VOUCHER_CODE='${voucherId}'`
  );
  await client.query(
    `update from  FIN_MST_T_VOUCHER_DET set marked='D' where VOUCHER_CODE='${voucherId}'`
  );

  res.status(200).json({
    status: "success",
    message: "Invoice Deleted Successfully",
  });
});

exports.InvoiceTaxCalByHsn = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.body, "postman");
  const obj = req.body;
  console.log(obj);
  // const hsn=obj.invoiceSize[0].hsn
  const date = obj.salesInvoice[0].invoice_date;
  console.log(date);
  const date1 = date.split("-").reverse().join("-");
  console.log(date1);

  function calculate_tax_charge_ref(
    ref_chrg,
    data,
    charge_type,
    ref_on,
    charge_value
  ) {
    if (charge_type === "p") {
      console.log("77", data);
      for (let row of data) {
        if (ref_chrg === row.charge_desc) {
          console.log("manoj", row);
          if (ref_on === "r") {
            return (
              Math.round(((row.RunningTotal * charge_value) / 100) * 100) / 100
            );
          } else {
            return (
              Math.round(((row.TaxValue * charge_value) / 100) * 100) / 100
            );
          }
          break;
        }
      }
    } else {
      return charge_value;
    }
  }

  const ob1 = [];
  const ob = [];
  const feild1 = [];
  var tax = [];
  var newTax = [];
  console.log(obj.invoiceSize.length);
  // console.log(obj.invoiceSize3.length)
  console.log(obj.invoiceSize !== null);
  console.log(obj.invoiceSize == null);
  console.log(obj.invoiceSize);
  console.log(obj.salesInvoice[0].booking_no, "booking_no");

  if (obj.salesInvoice[0].booking_no == null) {
    for (let i = 0; i < obj.invoiceSize.length; i++) {
      const hsnTax = await client.query(
        `SELECT get_charge(D.charge_code) charge_desc, D.charge_code, D.charge_cat,D.charge_value ,D.charge_type,D.ref_charge,D.CHARGE_TYPE_ON,D.ref_on,D.use_for,
        D.deal_type,D.INCLUDE_COST,get_charge(D.ref_charge)ref_chrg
        FROM  SL_MST_ITEM_TAX_DET D,SL_MST_ITEM_TAX_HDR H 
       WHERE D.MARKED IS NULL AND H.MARKED IS NULL AND H.TAX_CODE=D.TAX_CODE AND H.HSN='${obj.invoiceSize[i].hsn}' and '${date1}' between  H.f_date  and H.t_date       
       ;`
      );

      ob.push(hsnTax.rows);
      for (let j = i; j <= i; j++) {
        tax = [];
        console.log("j", j);
        var amount = obj.invoiceSize[i].itemqtyamount;
        var qty = obj.invoiceSize[i].qty;
        for (let k = 0; k < ob[j].length; k++) {
          console.log("k", k);
          console.log("data", ob[j][k]);
          console.log("data", ob[j][k].charge_desc);

          let Tax = 0;
          if (ob[j][k].charge_type_on === "t") {
            if (ob[j][k].ref_chrg) {
              Tax = calculate_tax_charge_ref(
                ob[j][k].ref_chrg,
                tax,
                ob[j][k].charge_type,
                ob[j][k].ref_on,
                ob[j][k].charge_value
              );
            } // console.log(tax)
            else if (!ob[j][k].ref_chrg && ob[j][k].charge_type === "p") {
              Tax =
                Math.round(((amount * ob[j][k].charge_value) / 100) * 100) /
                100;
            } else {
              Tax = Math.round(ob[j][k].charge_value * 100) / 100;
            }
          } else if (ob[j][k].charge_type_on === "o") {
            tax = Math.round(qty * ob[j][k].charge_value * 100) / 100;
          }

          amount = Math.round((amount + Tax) * 100) / 100;
          tax.push({ ...ob[j][k], TaxValue: Tax, RunningTotal: amount });
          newTax.push({ ...ob[j][k], TaxValue: Tax, RunningTotal: amount });

          console.log("basic", ob);
        }
      }

      ob1.push(hsnTax.rows);
      feild1.push(hsnTax.fields);
    }
  } else {
    var tax = [];
    if (obj.invoiceSize !== null) {
      for (let i = 0; i < obj.invoiceSize3.length; i++) {
        console.log(obj.invoiceSize3[i].hsn);
        const hsnTax = await client.query(
          `SELECT get_charge(D.charge_code) charge_desc, D.charge_code, D.charge_cat,D.charge_value ,D.charge_type,D.ref_charge,D.CHARGE_TYPE_ON,D.ref_on,D.use_for,
          D.deal_type,D.INCLUDE_COST,get_charge(D.ref_charge)ref_chrg
          FROM  SL_MST_ITEM_TAX_DET D,SL_MST_ITEM_TAX_HDR H 
         WHERE D.MARKED IS NULL AND H.MARKED IS NULL AND H.TAX_CODE=D.TAX_CODE AND H.HSN='${obj.invoiceSize3[i].hsn}' and '${date1}' between  H.f_date  and H.t_date       
         ;`
        );

        ob.push(hsnTax.rows);
        for (let j = i; j <= i; j++) {
          tax = [];
          console.log("j", j);
          var amount = obj.invoiceSize3[i].Price;
          console.log("amount", amount);
          var qty = obj.invoiceSize3[i].qty;
          console.log("qty", qty);
          for (let k = 0; k < ob[j].length; k++) {
            console.log("k", k);
            console.log("data", ob[j][k]);
            console.log("data", ob[j][k].charge_desc);

            let Tax = 0;
            if (ob[j][k].charge_type_on === "t") {
              if (ob[j][k].ref_chrg) {
                Tax = calculate_tax_charge_ref(
                  ob[j][k].ref_chrg,
                  tax,
                  ob[j][k].charge_type,
                  ob[j][k].ref_on,
                  ob[j][k].charge_value
                );
              } // console.log(tax)
              else if (!ob[j][k].ref_chrg && ob[j][k].charge_type === "p") {
                Tax =
                  Math.round(((amount * ob[j][k].charge_value) / 100) * 100) /
                  100;
              } else {
                Tax = Math.round(ob[j][k].charge_value * 100) / 100;
              }
            } else if (ob[j][k].charge_type_on === "o") {
              Tax = Math.round(qty * ob[j][k].charge_value * 100) / 100;
            }

            amount = Math.round((amount + Tax) * 100) / 100;
            tax.push({ ...ob[j][k], TaxValue: Tax, RunningTotal: amount });
            newTax.push({ ...ob[j][k], TaxValue: Tax, RunningTotal: amount });

            console.log("basic", ob);
          }
        }

        ob1.push(hsnTax.rows);
        feild1.push(hsnTax.fields);
      }
    }
  }

  console.log("tax", tax);
  console.log("without dot", ob);
  // console.log("without dot",ob)
  console.log("with dot", ob1);
  console.log("feild", feild1);
  console.log("newTax", newTax);
  //ob.push(rows.low)
  res.status(200).json({
    status: "success",
    data: {
      ob1,
      feild1,
      tax,
      newTax,
    },
  });
});

// how add two no
// SELECT  DEL_SITE_CODE,add_1||','||get_city(CITY_CODE)||','||get_locality(LOCALITY_CODE)||','||get_state(STATE_CODE)del_add
// FROM SL_MST_DEL_SITe
// WHERE marked IS NULL and cust code=1
//   for Detail tab hsn and size
exports.getHsnForItem = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.body);
  console.log(req.params.code);
  const hsn1 = await client.query(
    `SELECT hsn, get_uom(item_uom) uom_nm FROM sl_mst_item WHERE  item_code=${req.params.code}`
  );

  const size = await client.query(
    `select size_code, get_size(size_code)size_nm from sl_mst_item_size_det where item_code=${req.params.code}`
  );

  const grade = await client.query(
    `select quality_code, get_quality(quality_code) from  sl_mst_item_qual_det where item_code=${req.params.code}`
  );
  const uom = await client.query(
    `select item_uom, get_uom(item_uom) from  sl_mst_item where item_code=${req.params.code}`
  );

  res.status(200).json({
    status: "success",
    data: {
      hsn1,
      size,
      grade,
      uom,
    },
  });
});

exports.getcustomer = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.body);
  console.log(req.params.code);

  const customer = await client.query(
    `select distributor_code,get_distributor(distributor_code)cust_name from sl_mst_dealer_dist_det where external_entity_code =${req.params.code}`
  );

  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});
//SELECT  DEL_SITE_CODE,add_1||','||get_city(CITY_CODE)||','||get_locality(LOCALITY_CODE)||','||get_state(STATE_CODE)del_add
//FROM SL_MST_DEL_SITe
//WHERE marked IS NULL and cust_code=${req.params.code}
exports.getdetailsOfCustomer = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.body);
  console.log(req.params.code);
  const custdetail = await client.query(
    `SELECT  DEL_SITE_CODE,add_1
      FROM SL_MST_DEL_SITe
      WHERE marked IS NULL and cust_code=${req.params.code}`
  );
  res.status(200).json({
    status: "success",
    data: {
      custdetail,
    },
  });
});

// exports.getAllInvoiceRegister = wrapper(async (req, res, next) => {
//     const client = req.dbConnection;

//     const invoice = await client.query(

//       `SELECT H.INVOICE_NO,H.INVOICE_DATE,H.DISTRIBUTOR_CODE,H.DEALER_CODE,
//       GET_ITEM(D.ITEM_CODE)ITEM_NAME,GET_SIZE(D.SIZE_CODE)SIZE_NAME,GET_QUALITY(D.QUALITY)GRADE,D.QTY,D.BK_RATE,D.ITEMQTYAMOUNT
//       FROM SL_TRANS_INVOICE_HDR H , SL_TRANS_INV_SIZE_DETAIL D WHERE H.MARKED IS NULL AND D.MARKED IS NULL
//       AND H.INVOICE_NO=D.INVOICE_NO
//       `
//     );
//     res.status(200).json({
//       status: 'success',
//       data: {
//         invoice,
//       },
//     });
//   });

exports.createInvoiceFromInvoice = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log("hi manoj");
  // console.log(arr);
  console.log("manoj");
  const obj = req.body;
  console.log(obj);
  var qty = 0;
  for (let i = 0; i < obj.invoiceSize3.length; i++) {
    qty = qty + obj.invoiceSize3[i].qty;
  }
  const TOTAL_QTY = qty;
  // const invoiceCode = await generateInvoiceId(client);

  const vdate = obj.salesInvoice[0].invoice_date;
  // for voucher posting
  console.log(vdate);
  const vdate1 = vdate.split("-").reverse().join("-");
  // const cdate1=cdate.split("-").reverse().join("-");
  console.log(vdate1);
  const getYear = await client.query(`select fin_yr('${vdate1}');`);
  const Year1 = getYear.rows[0].fin_yr;
  console.log(":gfhggjgjhjhjhkj", Year1);

  // const response1 = await client.query(` select Voucher_Id_1('${Year1}',to_char(to_date('${vdate}', 'YYYY-MM-DD'), 'MM'),to_char(to_date('${vdate}', 'YYYY-MM-DD'), 'DD'),
  // to_date('${vdate}', 'YYYY-MM-DD'),1,1,'A' )`);
  const response1 =
    await client.query(` select Voucher_Id_1('${Year1}',to_char(to_date('${vdate}', 'DD-MM-YYYY'), 'MM'),to_char(to_date('${vdate}', 'DD-MM-YYYY'), 'DD'),
    to_date('${vdate}', 'DD-MM-YYYY'),6,1,'A' )`);
  console.log("ggjhjkkjkj", response1);

  const voucherCode = response1.rows[0].voucher_id_1;
  console.log("voucherCode", voucherCode);
  //const arr = jsonData.createNupdate.fieldNames;
  const invoiceCode = await generateInvoiceId(client);
  // console.log (req.body)
  // const obj = req.body
  console.log("obj", obj);
  console.log("fgfgfgfg", obj.salesInvoice[0].booking_no);
  //obj.salesInvoice[0].booking_date
  const query = `INSERT INTO sl_trans_invoice_hdr (INVOICE_NO, voucher_code, DISTRIBUTOR_CODE, DEALER_CODE, ORDER_TYPE, DEL_ADD, BOOKING_NO, NET_AMT, INVOICE_DATE) VALUES ('${invoiceCode}','${voucherCode}', ${obj.salesInvoice[0].distributor_name}, ${obj.salesInvoice[0].external_entity_code}, ${obj.salesInvoice[0].order_type}, ${obj.salesInvoice[0].del_site_code},'${obj.salesInvoice[0].booking_no}', ${obj.amount[0]} , to_date('${obj.salesInvoice[0].invoice_date}', 'DD-MM-YYYY'))`;
  console.log(query);
  console.log(query, "manooooo");
  await client.query(query);

  for (let i = 0; i < obj.invoiceSize3.length; i++) {
    const query = `INSERT INTO sl_trans_inv_size_detail (INVOICE_NO, ITEM_CODE, SIZE_CODE, QUALITY, QTY, BOOKING_NO, UOM_FOR_ITEMS, NET_RATE, NET_DISCOUNT, AMOUNT) VALUES ('${invoiceCode}', ${obj.invoiceSize3[i].item_code}, ${obj.invoiceSize3[i].size_code}, ${obj.invoiceSize3[i].quality}, ${obj.invoiceSize3[i].qty}, '${obj.invoiceSize3[i].booking_no}', ${obj.invoiceSize3[i].uom}, ${obj.invoiceSize3[i].rate_after_discount},${obj.invoiceSize3[i].discount_value},${obj.invoiceSize3[i].amount})`;
    console.log(query);
    await client.query(query);
  }
  for (let i = 0; i < obj.chargedata.length; i++) {
    const query = `INSERT INTO invoice_tax_charge_detail (INVOICE_NO, charge_code, charge_cat,charge_value ,charge_type, include_cost, use_for, ref_charge,ref_on, charge_type_on ,RunningTotal, TaxValue) VALUES ('${invoiceCode}',${
      obj.chargedata[i].charge_code
    },
      ${obj.chargedata[i].charge_cat},${obj.chargedata[i].charge_value}, '${
      obj.chargedata[i].charge_type || ""
    }','${obj.chargedata[i].include_cost || ""}',
      ${obj.chargedata[i].use_for},${obj.chargedata[i].ref_charge},'${
      obj.chargedata[i].ref_on || ""
    }','${obj.chargedata[i].charge_type_on || ""}' ,${
      obj.chargedata[i].RunningTotal
    },${obj.chargedata[i].TaxValue});
      `;
    console.log(query, "manoooooooooooooooooo");
    await client.query(query);
  }

  {
    var customer_name = obj.salesInvoice[0].distributor_code;
    var a = await client.query(`select  get_distributor('${customer_name}')`);
    console.log(a);
    const distributor_name = a.rows[0].get_distributor;

    console.log(distributor_name, "distributor_name");
    const narration =
      "Voucher posted against Distributor: " +
      distributor_name +
      "," +
      "Truck No: " +
      (obj.salesInvoice[0].truck_number || "") +
      "," +
      "net Wt: " +
      (obj.salesInvoice[0].net_wt || "") +
      "," +
      "Invoice_NO: " +
      invoiceCode +
      "," +
      "QTY: " +
      TOTAL_QTY;
    console.log(narration, "narration");
    console.log("manoj");
    //  var currenttime=await client.query(`SELECT to_timestamp(to_char(now(), 'YYYY/MM/DD HH24:MI:SS'), 'YYYY/MM/DD HH24:MI:SS')`);
    //  const current_time=currenttime.rows[0].to_timestamp
    //   console.log(current_time,'current_time')
    const queryvoucher = `INSERT INTO fin_mst_t_voucher_hdr (VOUCHER_CODE, VOUCHER_TYPE, VOUCHER_DATE, AMOUNT,NARRATION, VOUCHER_YEAR, COMPANY_CODE, UNIT_CODE , INV_YN, status, BILLING_CO_CD, send_status)

  VALUES ('${voucherCode}', ${6}, '${vdate1}',${
      obj.amount[0]
    },'${narration}','${Year1}', ${1},${1},  '${Year1}','M', ${1},'A' )`;
    console.log(queryvoucher);
    await client.query(queryvoucher);

    var account = await client.query(
      `select account_code from sl_mst_distributor where distributor_code=${customer_name}`
    );
    console.log(account);
    const acc_code = account.rows[0].account_code;
    console.log(acc_code, "acc_code");

    const detailvoucher = `INSERT INTO fin_mst_t_voucher_det (VOUCHER_CODE,Entry_type,account_code,AMOUNT,COMPANY_CODE,UNIT_CODE,  status ,BILLING_CO_CD, send_status,  DEALER_CODE, VOUCHER_TYPE) VALUES
  ('${voucherCode}', 'Credit', ${acc_code},${
      obj.amount[0]
    }, ${1},${1},  'M', ${1},'A', ${obj.salesInvoice[0].dealer_code}, ${3})`;

    console.log(detailvoucher);
    await client.query(detailvoucher);
  }

  res.status(200).json({
    status: "success",
    message: "Order Created Successfully",
  });
});

const pdfmake = wrapper(async (req, res, str) => {
  const client = req.dbConnection;
  const order = await client.query(
    `SELECT
    h.invoice_no,
    GET_DISTRIBUTOR(h.DISTRIBUTOR_code) AS CUST,
    get_del_site(h.DEL_add) AS Delivery_add,
    h.INVOICE_DATE,truck_number,
    (SELECT C.service_tax_no FROM sl_mst_distributor C WHERE C.distributor_code = h.DISTRIBUTOR_code) AS service_tax_no,
    0||LEFT((SELECT C.service_tax_no FROM sl_mst_distributor C WHERE C.distributor_code = h.DISTRIBUTOR_code), 1) As state_code
FROM
    sl_trans_invoice_hdr h
WHERE
    h.invoice_no='${req.params.code}' `
  );
  console.log(order.rows, "customere");
  const itemDetail = await client.query(
    `select get_item(item_code) item, hsn, get_size(size_code) siz, get_quality(quality) qual,  get_uom(uom_for_items) um, no_pcs, qty,
      bk_rate, discount_amt, itemqtyamount from sl_trans_inv_size_detail where invoice_no='${req.params.code}'`
  );
  console.log(itemDetail.rows, "item");
  const itemlogo = await client.query(
    `select site_desc, add1, ph1, email, gst_no, cin_no, bank_name,bank_add1, account_no, ifsc_cd from sl_mst_site`
  );
  console.log(itemlogo.rows);
  const company = await client.query(`select company_name from sl_mst_company`);
  console.log(company.rows, "company");
  const chargeDetail =
    await client.query(`SELECT ALL invoice_tax_charge_detail.CHARGE_CODE, get_charge(invoice_tax_charge_detail.CHARGE_CODE),charge_value,
    invoice_tax_charge_detail.invoice_no ,sum(invoice_tax_charge_detail.taxvalue)tax_val FROM invoice_tax_charge_detail
   WHERE invoice_tax_charge_detail.MARKED IS NULL and invoice_tax_charge_detail.charge_code not in (1)
   and invoice_tax_charge_detail.invoice_no= '${req.params.code}'
   group by invoice_tax_charge_detail.CHARGE_CODE, charge_value,invoice_tax_charge_detail.invoice_no`);
  console.log("charge", chargeDetail.rows);

  const responseData = {
    customere: order.rows,
    item: itemDetail.rows,
    address: itemlogo.rows,
    company: company.rows,
    totalAmount: chargeDetail.rows,
  };
  console.log(responseData);

  // Sending the organized data as the response
  res.json(responseData);
});

exports.downloadPDF = async (req, res, next) => {
  console.log("1" + req.params.code);
  await pdfmake(req, res, "download");
  console.log("2" + req.params.code);
};
