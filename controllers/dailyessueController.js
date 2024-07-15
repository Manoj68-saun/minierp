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
  fs.readFileSync(`${__dirname}/../DailyIssue.json`, "utf8")
);

// how to get data from postgres database and create a pdf file from it and save it in the folder

const generateReqId = async (client) => {
  //const response = await client.query(`SELECT MAX(BOOKING_CODE) AS MAX FROM SL_TRANS_BOOKING_HDR`);

  //const response1 = await client.query(`SELECT MAX(TO_NUMBER(SUBSTR(BOOKING_CODE,8))) M FROM SL_TRANS_BOOKING_HDR`);
  // const response1=await client.query(`SELECT max(TO_NUMBER(BOOKING_CODE,'"x"99999'))M FROM SL_TRANS_BOOKING_HDR`);
  const response1 = await client.query(
    `SELECT MAX(issue_code)M FROM PUR_TRANS_INGOT_ISSUE_hdr`
  );
  console.log("ggjhjkkjkj", response1);

  return Number(response1.rows[0].m) + 1;
};

exports.getAllIssue = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const AllIssue = await client.query(
    `
    select issue_code, timestamptostring(issue_date)  issue_date, get_employee(emp_cd) employee_name, d_code, req_code, get_department(dept_code) department_name
    from PUR_TRANS_INGOT_ISSUE_hdr where marked is null`
  );
  res.status(200).json({
    status: "success",
    data: {
      AllIssue,
    },
  });
});

exports.getAllReq = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const AllReq = await client.query(
    `SELECT DISTINCT
    h.req_date,
    h.req_code,
    h.dept_cd,
    h.emp_cd,
    get_department(h.dept_cd) AS dept,
    SUM(d.qty) AS qty,
    d.item_code AS item,
    d.size_code AS sz,
    d.quality_code AS qt,
    SUM(d.qty) - COALESCE((
        SELECT SUM(d1.qty)
        FROM pur_trans_ingot_issue d1
        WHERE d1.marked IS NULL
        AND d1.ref_issue_code = h.req_code
        AND d1.item_code = d.item_code
        AND d1.size_code = d.size_code
        AND d1.quality_code = d.quality_code
    ), 0) AS pending_qty
FROM pur_store_req_hdr h
JOIN pur_store_req_det d ON h.req_code = d.req_code 
WHERE
    h.marked IS NULL
    AND d.marked IS NULL

    AND h.req_date <= '2024-03-13'
GROUP BY
    h.req_date,
    h.req_code,
    h.dept_cd,
    h.emp_cd,
    d.qty,
    d.item_code,
    d.size_code,
    d.quality_code
HAVING COALESCE(SUM(d.qty), 0) > COALESCE((
    SELECT SUM(d2.qty)
    FROM pur_trans_ingot_issue d2
    WHERE d2.marked IS NULL
    AND d2.ref_issue_code = h.req_code
    AND d2.item_code = d.item_code
    AND d2.size_code = d.size_code
    AND d2.quality_code = d.quality_code
), 0)
ORDER BY h.req_date`
  );
  res.status(200).json({
    status: "success",
    data: {
      AllReq,
    },
  });
});

exports.getAllReqdata = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  const req1 = await client.query(
    `SELECT req_date, dept_cd, emp_cd , req_code FROM PUR_STORE_REQ_HDR WHERE req_code='${req.params.code}'`
  );

  const req2 = await client.query(
    // `SELECT  booking_code, item_code ,get_item(item_code) item_nm, size_code, get_size(size_code) size_nm, quality, get_quality(quality), no_pcs, uom, discount_on, dis_type, qty, book_rate_guage, discount_amount, tot_item_amt, net_rate, net_size_rate,unique_id FROM sl_trans_booking_size_detail WHERE booking_code='${req.params.code}'`
    `SELECT  item_code ,get_item(item_code) Item_name ,size_code, get_size(size_code) Size_name,
    get_quality(quality_code) Grade, quality_code,
    no_of_pcs, get_uom(uom_code) Uom, uom_code, actual_bal, 
    qty, get_cost_center(cost_code) cost_center, req_code, uniq_id
    FROM PUR_STORE_REQ_DET WHERE req_code ='${req.params.code}'`
    // `SELECT  item_code ,size_code, quality_code, no_of_pcs, uom_code, actual_bal,
    // qty,cost_code
    // FROM PUR_STORE_REQ_DET WHERE req_code ='${req.params.code}'`
  );

  res.status(200).json({
    status: "success",
    data: {
      req1,
      req2,
    },
  });
});

exports.getdailyissueData = wrapper(async (req, res, next) => {
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
    let query = `SELECT ${arr[i].fieldsRequired} FROM ${arr[i].tableName}`;
    if (arr[i].leftJoiner) {
      arr[i].leftJoiner.forEach((joiner) => {
        query += ` LEFT JOIN ${joiner}`;
      });
    }
    query += ` WHERE ${arr[i].uniqueIssueIdentifier}='${req.params.code}' and marked is null`;
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
        // query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName} WHERE MARKED IS NULL ORDER BY 2`;
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

exports.createOpening = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const arr = jsonData.createNupdate.fieldNames;

  const openingBalanceCode = await generateReqId(client);
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
        // const getYear = await client.query(
        //   `select duplicate_account_chk('${item}');`
        // );
        // console.log(getYear.rows[0], "dgjejygdejydhejdyejdhejde");
        // // console.log(getYear.rows[0].duplicate_item_chk == "1");
        // if (getYear.rows[0].duplicate_account_chk >= "1") {
        //   return res.status(200).json({
        //     status: "fail",
        //     message: "Account Already Exists",
        //   });
        // }
        const query = `INSERT INTO ${arr[i].tableName} (issue_code,  ${fields}) VALUES ('${openingBalanceCode}',  ${values})`;
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
          const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueIssueIdentifier}, ${fields}) VALUES ('${openingBalanceCode}', ${values})`;
          console.log(query);
          await client.query(query);
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Opening Balance Created Successfully",
  });
});

exports.updateOpening = wrapper(async (req, res, next) => {
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Account Code",
    });
  }
  const client = req.dbConnection;

  const arr = jsonData.createNupdate.fieldNames;
  // const item = req.body.accountHeader[0].account_name;
  // console.log(item);
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
        // const getYear = await client.query(
        //   `select duplicate_account_chk('${item}');`
        // );
        // console.log(getYear.rows[0], "dgjejygdejydhejdyejdhejde");
        // // console.log(getYear.rows[0].duplicate_item_chk == "1");
        // if (getYear.rows[0].duplicate_account_chk >= "1") {
        //   return res.status(200).json({
        //     status: "fail",
        //     message: "Account Already Exists",
        //   });
        // }
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueIssueIdentifier}='${req.params.code}'`;
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
            const query = `UPDATE ${arr[i].tableName} SET MARKED='D' WHERE ${
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
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueIssueIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "Account Updated Successfully",
  });
});

exports.deleteOpening = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Account Code",
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `UPDATE ${arr[i].tableName} SET MARKED='D' WHERE ${arr[i].uniqueAccIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Account Deleted Successfully",
  });
});

exports.OpeningValue = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  const {
    item_code,
    quality_code,
    size_code,
    stock_date,
    store_code,
    quantity,
  } = req.query;

  console.log("Item:", item_code);
  console.log("Quality:", quality_code);
  console.log("Size:", size_code);
  console.log("Stock Date:", stock_date);
  // console.log("Store Code:", store_code);
  // console.log("gfddfdfdfdf", quantity);

  console.log(req.user.finyear);
  var year = req.user.finyear;
  var comany_code = req.user[0].company_code;
  var site = req.user[0].unit_code;

  const OpenningValue = await client.query(
    `select stock_with_opbal(
      ${item_code}, -- item
      ${quality_code}, -- quality
      ${size_code}, -- sz
      TO_DATE('${stock_date}', 'DD-MM-YYYY'),  -- Convert the date string to a proper date
      'M', -- status1 (hard-coded)
      ${comany_code}, -- comp_code
      ${site}, -- site
      'R', -- comp_type (hard-coded)
      '${store_code}', -- store_c
      '${year}' -- f_yr
    )`
  );

  res.status(200).json({
    status: "success",
    data: {
      OpenningValue,
    },
  });
});
