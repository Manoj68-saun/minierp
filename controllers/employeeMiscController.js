/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const { Client } = require("pg");
const wrapper = require("../utils/wrapper");

exports.getAllTables = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const tables = await client.query(`SELECT * FROM DYN_PAYROLL_MISC_DATA`);
  res.status(200).json({
    status: "success",
    data: {
      tables,
    },
  });
});

exports.getTableData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const table = await client.query(
    `SELECT * FROM DYN_PAYROLL_MISC_DATA WHERE SLUG='${req.params.slug}'`
  );

  if (!table.rows[0]) {
    return res.status(404).json({
      status: "fail",
      message: "The table does not exist",
    });
  }

  let query = `SELECT ${table.rows[0].ROW_IDENTIFIER}, ${
    table.rows[0].REQUIRED_FIELDS || table.rows[0].TABLE_FIELDS
  } FROM ${table.rows[0].TABLE_NAME} WHERE MARKED IS NULL`;

  if (table.rows[0].LEFT_JOINER) {
    query += ` ${table.rows[0].LEFT_JOINER}`;
  }

  const tableData = await connection.execute(query);
  const obj = {};
  if (table.rows[0].MASTER_LISTS) {
    const masterLists = table.rows[0].MASTER_LISTS.split(", ");
    const masterFields = table.rows[0].MASTER_FIELDS.split("; ");
    for (let i = 0; i < masterLists.length; i++) {
      if (masterLists[i] === "#") {
        obj[i] = [];
      } else {
        console.log(`SELECT ${masterFields[i]} FROM ${masterLists[i]}`);
        const data = await client.query(
          `SELECT ${masterFields[i]} FROM ${masterLists[i]}`
        );
        obj[i] = data.rows;
      }
    }
  }

  console.log("tableData \n" + JSON.stringify(tableData));
  console.log("table.rows[0] \n" + JSON.stringify(table.rows[0]));
  console.log("obj \n" + JSON.stringify(obj));

  tableData.rows.map((row) => {
    // console.log("row \n" + JSON.stringify((msToTime(new Date(row.IN_TIME)))));
    row.IN_TIME = msToTime(row.IN_TIME);
    row.TIME_OUT = msToTime(row.TIME_OUT);
  });

  res.status(200).json({
    status: "success",
    data: {
      tableData,
      tableHeader: table.rows[0],
      obj,
    },
  });
});

exports.createRow = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const table = await client.query(
    `SELECT * FROM DYN_PAYROLL_MISC_DATA WHERE SLUG='${req.params.slug}'`
  );

  if (!table.rows[0]) {
    return res.status(404).json({
      status: "fail",
      message: "The table does not exist",
    });
  }

  let max = await client.query(
    `SELECT MAX(${table.rows[0].ROW_IDENTIFIER}) AS MAX FROM ${table.rows[0].TABLE_NAME}`
  );
  max = max.rows[0].MAX + 1;

  let values = ``;
  const fieldsArr = table.rows[0].TABLE_FIELDS.split(", ");
  const fieldTypes = table.rows[0].INPUT_TYPE.split(", ");
  fieldsArr.forEach((field, index) => {
    if (fieldTypes[index] === "Date")
      values += `TO_DATE('${req.body[field]}', 'DD-MM-YYYY HH24:MI:SS'), `;
    else if (typeof req.body[field] === "number")
      values += `${req.body[field]}, `;
    else values += `'${req.body[field]}', `;
  });
  values = values.split(`'undefined'`).join(null);
  values = values.split(`'null'`).join(null);
  values = values.slice(0, -2);
  console.log(
    `INSERT INTO ${table.rows[0].TABLE_NAME} (${table.rows[0].ROW_IDENTIFIER}, ${table.rows[0].TABLE_FIELDS}) VALUES (${max}, ${values})`
  );

  await client.query(
    `INSERT INTO ${table.rows[0].TABLE_NAME} (${table.rows[0].ROW_IDENTIFIER}, ${table.rows[0].TABLE_FIELDS}) VALUES (${max}, ${values})`
  );
  res.status(200).json({
    status: "success",
    message: "Data Inserted Successfully",
  });
});

exports.updateRow = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const table = await client.query(
    `SELECT * FROM DYN_PAYROLL_MISC_DATA WHERE SLUG='${req.params.slug}'`
  );

  if (!table.rows[0]) {
    return res.status(404).json({
      status: "fail",
      message: "The table does not exist",
    });
  }
  if (!req.query.identifier) {
    return res.status(404).json({
      status: "fail",
      message: "Please Specify a Unique Identifier",
    });
  }
  console.log(req.body);
  let fields = ``;
  const fieldTypes = table.rows[0].INPUT_TYPE.split(", ");
  if (req.body) {
    Object.keys(req.body).forEach((key, index) => {
      if (fieldTypes[index] === "Date")
        fields += `${key} = TO_DATE('${req.body[key]}', 'DD-MM-YYYY HH24:MI:SS'), `;
      else if (typeof req.body[key] === "number")
        fields += `${key} = ${req.body[key]}, `;
      else fields += `${key} = '${req.body[key]}', `;
    });
    fields = fields.slice(0, -2);
  }

  console.log(
    `UPDATE ${table.rows[0].TABLE_NAME} SET ${fields} WHERE ${table.rows[0].ROW_IDENTIFIER}=${req.query.identifier}`
  );
  await client.query(
    `UPDATE ${table.rows[0].TABLE_NAME} SET ${fields} WHERE ${table.rows[0].ROW_IDENTIFIER}=${req.query.identifier}`
  );
  res.status(200).json({
    status: "success",
    message: "Data Updated Successfully",
  });
});

exports.deleteRow = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const table = await client.query(
    `SELECT * FROM DYN_PAYROLL_MISC_DATA WHERE SLUG='${req.params.slug}'`
  );

  if (!table.rows[0]) {
    return res.status(404).json({
      status: "fail",
      message: "The table does not exist",
    });
  }
  if (!req.query.identifier) {
    return res.status(404).json({
      status: "fail",
      message: "Please Specify a Unique Identifier",
    });
  }

  await client.query(
    `UPDATE  ${table.rows[0].TABLE_NAME}  SET MARKED='d' WHERE  ${table.rows[0].ROW_IDENTIFIER}=${req.query.identifier}`
    //  `DELETE FROM ${table.rows[0].TABLE_NAME} WHERE ${table.rows[0].ROW_IDENTIFIER}=${req.query.identifier}`
  );
  res.status(200).json({
    status: "success",
    message: "Row Deleted Successfully",
  });
});

function msToTime(duration) {
  hours = new Date(Date.parse(duration)).getHours();
  minutes = new Date(Date.parse(duration)).getMinutes();
  // seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes;
}
