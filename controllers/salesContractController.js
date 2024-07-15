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
  fs.readFileSync(`${__dirname}/../SalesContract.json`, "utf8")
);

// const generateSaudaId = async (client) => {

//   //const response = await client.query(`SELECT MAX(BOOKING_CODE) AS MAX FROM SL_TRANS_BOOKING_HDR`);

//   //const response1 = await client.query(`SELECT MAX(TO_NUMBER(SUBSTR(BOOKING_CODE,8))) M FROM SL_TRANS_BOOKING_HDR`);
//   // const response1=await client.query(`SELECT max(TO_NUMBER(BOOKING_CODE,'"x"99999'))M FROM SL_TRANS_BOOKING_HDR`);
//   const response1 = await client.query(`SELECT MAX((substr(SAUDA_CODE,8)))M FROM SL_TRANS_SAUDA_HDR`);
//   console.log("ggjhjkkjkj", response1);

//   if (response1.rows.m === null) {
//     return `A12223-1`;
//   } else {

//     console.log('numfgfgfgfgfgf');
//     const num = Number(response1.rows[0].m) + 1;

//     console.log(num);
//     return `A12223-${num}`;
//   }

//   }

exports.getAllSauda = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const sauda = await client.query(
    `SELECT SAUDA_CODE, timestamptostring(SAUDA_DATE) SAUDA_DATE, Get_external_entity(dealer_code)DEALER_NAME, 
    get_distributor(cust_code)CUST_NAME ,get_item_category(item_cat_code) ITEM_CATEGORY, 
    get_item(item_code)ITEM_NM,get_quality(SAUDA_QUALITY) QUALITY_NM,  SAUDA_RATE, SAUDA_QTY,
    get_freight(freight_type_code)FREIGHT_TYPE_NM
    FROM sl_trans_sauda_hdr`
  );
  res.status(200).json({
    status: "success",
    data: {
      sauda,
    },
  });
});

exports.getSaudaData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Sales Contract Code",
    });
  }

  const data = {};
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    let query = `SELECT ${arr[i].fieldsRequired.replace(
      /sauda_date/g,
      "to_char(sauda_date, 'DD-MM-YYYY') as sauda_date"
    )}`;
    if (arr[i].leftJoiner) {
      arr[i].leftJoiner.forEach((joiner) => {
        query += ` LEFT JOIN ${joiner}`;
      });
    }
    // Add logic for FROM clause
    query += ` FROM ${arr[i].tableName}`;

    // here  logic
    query += ` WHERE ${arr[i].uniqueSaudaIdentifier}='${req.params.code}'`;
    console.log(query);
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

exports.createSauda = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const arr = jsonData.createNupdate.fieldNames;
  console.log(arr);
  console.log("hii", req.body);
  const sdate = req.body.SaudatHeader[0].sauda_date;

  console.log("vandna", sdate);
  const sdate1 = sdate.split("-").reverse().join("-");
  // const cdate1=cdate.split("-").reverse().join("-");
  console.log(sdate1);
  const getYear = await client.query(`select fin_yr('${sdate1}'); `);
  const Year1 = getYear.rows[0].fin_yr;
  console.log(":gfhggjgjhjhjhkj", Year1);

  const response1 = await client.query(
    `SELECT MAX(coalesce(substr(SAUDA_CODE,8)))M FROM SL_TRANS_SAUDA_HDR`
  );

  console.log("ggjhjkkjkj", Number(response1.rows[0].m));
  const max = Number(response1.rows[0].m) + 1;

  console.log("max", max);
  const scode = `A1${Year1}-${max}`;
  console.log("scode", scode);
  // const voucherCode =response1.rows[0].voucher_id_1
  // ----------

  const saudaCode = scode;
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
              values += `TO_DATE(TO_CHAR(TO_DATE('${obj[field]}', 'DD-MM-YYYY'), 'YYYY-MM-DD'),'YYYY-MM-DD'), `;
            else if (arr[i].fieldsRequired[field] === "number")
              values += `${obj[field]}, `;
            else values += `'${obj[field]}', `;
          }
        });
        fields = fields.slice(0, -2);
        values = values.slice(0, -2);
        const query = `INSERT INTO ${arr[i].tableName} (SAUDA_CODE, ${fields}) VALUES ('${saudaCode}', ${values})`;
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
          const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueSaudaIdentifier}, ${fields}) VALUES ('${saudaCode}', ${values})`;
          console.log(query);
          await client.query(query);
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Sales Contract Created Successfully",
  });
});

exports.updateSauda = wrapper(async (req, res, next) => {
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Sales Contract Code",
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
              fields += `${field} = TO_DATE(TO_CHAR(TO_DATE('${obj[field]}', 'DD-MM-YYYY'), 'YYYY-MM-DD'),'YYYY-MM-DD'), `;
            else if (arr[i].fieldsRequired[field] === "number")
              fields += `${field} = ${obj[field]}, `;
            else fields += `${field} = '${obj[field]}', `;
          }
        });
        fields = fields.slice(0, -2);
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueSaudaIdentifier}='${req.params.code}'`;
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
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueSaudaIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "Sales Contract Updated Successfully",
  });
});

exports.deleteSauda = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Sales contract Code",
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `DELETE FROM ${arr[i].tableName} SET MARKED='D' WHERE ${arr[i].uniqueSaudaIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Sales Contract Deleted Successfully",
  });
});

exports.getAllContract = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  const sauda = await client.query(
    `SELECT SAUDA_CODE,SAUDA_DATE,CUSTOMER_NAME,DEALER_NAME,ITEM_NAME,SAUDA_GRADE,CONTRACT_QTY,SO_QTY,INV_QTY,SO_PEN_SAUDA,INV_PEN_SAUDA
    FROM V_SAUDA
    `
  );
  res.status(200).json({
    status: "success",
    data: {
      sauda,
    },
  });
});
