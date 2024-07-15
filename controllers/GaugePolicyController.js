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
  fs.readFileSync(`${__dirname}/../GaugePolicy.json`, "utf8")
);

const generateGaugeId = async (client) => {
  //const response = await client.query(`SELECT MAX(BOOKING_CODE) AS MAX FROM SL_TRANS_BOOKING_HDR`);

  //const response1 = await client.query(`SELECT MAX(TO_NUMBER(SUBSTR(BOOKING_CODE,8))) M FROM SL_TRANS_BOOKING_HDR`);
  // const response1=await client.query(`SELECT max(TO_NUMBER(BOOKING_CODE,'"x"99999'))M FROM SL_TRANS_BOOKING_HDR`);
  const response1 = await client.query(
    `SELECT MAX(a_code) M FROM SL_MST_GAUGE_DIFF_HDR`
  );
  console.log("ggjhjkkjkj", response1);

  return Number(response1.rows[0].m) + 1;
};

exports.getAllGauge = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const gaugepolicy = await client.query(
    `SELECT item_code,item_name,a_code,timestamptostring(norm_date) norm_date, timestamptostring(expire_date) expire_date,approved_status,approved_by,remarks 
    from sl_mst_gauge_diff_hdr WHERE MARKED IS NULL`
  );
  res.status(200).json({
    status: "success",
    data: {
      gaugepolicy,
    },
  });
});

exports.getSizeForItem = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.body);
  console.log(req.params.code);

  const size = await client.query(
    `select size_code, get_size(size_code)size_nm from sl_mst_item_size_det where item_code=${req.params.code}`
  );

  const grade = await client.query(
    `select quality_code, get_quality(quality_code) from  sl_mst_item_qual_det where item_code=${req.params.code}`
  );

  res.status(200).json({
    status: "success",
    data: {
      size,
      grade,
    },
  });
});

exports.getGauge = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.params.code);
  const size = await client.query(
    `select size_code, get_size(size_code) size_name from sl_mst_item_size_det where item_code=${req.params.code}`
  );
  // console.log(size);
  const grade = await client.query(
    `select quality_code, get_quality(quality_code) grade_name from sl_mst_item_qual_det  where item_code=${req.params.code}`
  );
  // console.log(grade);

  const mergedData = size.rows.map((sizeItem, index) => ({
    ...sizeItem,
    ...grade.rows[index],
  }));
  console.log(mergedData);

  res.status(200).json({
    status: "success",
    data: mergedData,
  });
});

exports.getGaugeData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Gauge Code",
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
    query += ` WHERE ${arr[i].uniqueGaugeIdentifier}='${req.params.code}'`;
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
  const operationType = req.query.operationType;
  console.log(operationType, "ryyyyyyyyyyyyyyyyyyyyyyyyy");

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].lovFields) {
      const obj = arr[i].lovFields;

      for (const key in obj) {
        let query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName}`;

        // Conditionally add WHERE clause for ITEM_CODE
        if (
          !(operationType === "update") &&
          key === "ITEM_CODE" &&
          obj[key].whereClause
        ) {
          query += ` WHERE ${obj[key].whereClause}`;
        }

        console.log(query);

        const dbData = await client.query(query);
        data[key] = dbData; // Assuming you want to store the rows in the data object
      }
    }
  }

  res.status(200).json({
    status: "success",
    data,
  });
});

// exports.getAdditionalData = wrapper(async (req, res, next) => {
//   const client = req.dbConnection;
//   const arr = jsonData.createNupdate.fieldNames;
//   const data = {};
//   const operationType = req.query.operationType;
//   console.log(operationType, "ryyyyyyyyyyyyyyyyyyyyyyyyy");
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].lovFields) {
//       const obj = arr[i].lovFields;

//       for (const key in obj) {
//         let query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName}`;

//         //Add WHERE clause for ITEM_CODE if it exists
//         if (key === "ITEM_CODE" && obj[key].whereClause) {
//           query += ` WHERE ${obj[key].whereClause}`;
//         }

//         console.log(query);

//         const dbData = await client.query(query);
//         data[key] = dbData;
//       }
//     }
//   }

//   res.status(200).json({
//     status: "success",
//     data,
//   });
// });

exports.createGauge = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const arr = jsonData.createNupdate.fieldNames;
  console.log(arr);
  const gaugeCode = await generateGaugeId(client);
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
        const query = `INSERT INTO ${arr[i].tableName} (A_CODE, ${fields}) VALUES ('${gaugeCode}', ${values})`;
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
          const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueGaugeIdentifier}, ${fields}) VALUES ('${gaugeCode}', ${values})`;
          console.log(query);
          await client.query(query);
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Gauge Created Successfully",
  });
});

exports.updateGauge = wrapper(async (req, res, next) => {
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Gauge Code",
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
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueGaugeIdentifier}='${req.params.code}'`;
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
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueGaugeIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "Gauge Updated Successfully",
  });
});

exports.deleteGauge = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Gauge Code",
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `DELETE FROM ${arr[i].tableName} WHERE ${arr[i].uniqueGaugeIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Gauge Deleted Successfully",
  });
});
