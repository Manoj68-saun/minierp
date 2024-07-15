/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const { Client } = require("pg");
const fs = require("fs");
const wrapper = require("../utils/wrapper");
const { Console } = require("console");

const jsonData = JSON.parse(
  fs.readFileSync(`${__dirname}/../itemMasterData.json`, "utf8")
);
//const client = req.dbConnection;
const generateItemId = async (itemCode, tableName, client) => {
  const response = await client.query(
    `SELECT MAX(${itemCode}) AS MAX FROM ${tableName}`
  );
  //return response.rows[0].MAX + 1;
  console.log(response);
  return response.rows[0].max + 1;
};
//console.log(generateItemId);

exports.getAllItems = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  console.log("user1");
  console.log(req.user.finyear, "itttttttttttttttttttttttttttttttemmmm");
  console.log(req, " ytytytyyyyuyuyuyuyuyuyyuy");
  console.log(req.user);
  console.log(req.user[0].spec_code, "user");
  console.log("user1", req.body.finyear);
  const items = await client.query(
    `SELECT ITEM_CODE, ITEM_NAME, ITEM_UOM, CATEGORY_DESC, HSN_NO, ITEM_GROUP, SUB_GROUP_NAME, ACTUAL_NAME, MIN_LEVEL, MAX_LEVEL  FROM V_ITEM_MASTER order by item_code`
  );
  res.status(200).json({
    status: "success",
    data: {
      items,
    },
  });
});

exports.getItemData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Item Code",
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
    query += ` WHERE ${arr[i].uniqueItemIdentifier}='${req.params.code}'`;
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
        //   console.log(obj[key]+"\n")
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

exports.createItem = wrapper(async (req, res, next) => {
  const client = req.dbConnection;

  const arr = jsonData.createNupdate.fieldNames;
  const item = req.body.itemMaster[0].item_name;
  console.log(item);
  // console.log(itemCode);
  const itemCode = await generateItemId(
    arr[0].uniqueItemIdentifier,
    arr[0].tableName,
    client
  );
  console.log(itemCode);
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
          // console.log(field);
          // console.log(values);
        });
        // console.log(fields);
        fields = fields.slice(0, -2);
        values = values.slice(0, -2);
        const getYear = await client.query(
          `select duplicate_item_chk('${item}');`
        );
        console.log(getYear.rows[0], "dgjejygdejydhejdyejdhejde");
        // console.log(getYear.rows[0].duplicate_item_chk == "1");
        if (getYear.rows[0].duplicate_item_chk >= "1") {
          return res.status(200).json({
            status: "fail",
            message: "Item Already Exists",
          });
        }
        const query = `INSERT INTO ${arr[i].tableName} (ITEM_CODE, ${fields}) VALUES ('${itemCode}', ${values})`;
        console.log("ghghguuhjh", query);

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
            // console.log(values += `'${obj[field]}' `)
          });
          fields = fields.slice(0, -2);
          values = values.slice(0, -2);
          const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueItemIdentifier}, ${fields}) VALUES ('${itemCode}', ${values})`;
          console.log("zzzzzzz", query);
          await client.query(query);
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "item master Created Successfully",
  });
});

exports.updateItem = wrapper(async (req, res, next) => {
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Employee Code",
    });
  }
  const client = req.dbConnection;
  const item = req.body.itemMaster[0].item_name;
  console.log(item, "update-------------------------");
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
        console.log(fields);
        fields = fields.slice(0, -2);
        const getYear = await client.query(
          `select duplicate_item_chk('${item}');`
        );
        console.log(getYear.rows[0], "dgjejygdejydhejdyejdhejde");
        console.log(getYear.rows[0].duplicate_item_chk == "1");
        if (getYear.rows[0].duplicate_item_chk >= "1") {
          return res.status(200).json({
            status: "fail",
            message: "Item Already Exists",
          });
        }
        console.log(fields);
        console.log(arr[i].uniqueItemIdentifier);
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueItemIdentifier}=${req.params.code}`;
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
            console.log("zzzz", arr[i].uniqueRowIdentifier);
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
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueItemIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "item master Updated Successfully",
  });
});

exports.deleteItem = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Employee Code",
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `UPDATE ${arr[i].tableName} set marked='D' WHERE ${arr[i].uniqueItemIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Item Deleted Successfully",
  });
});

//get employee data in payroll

// exports.getEmployeeData = wrapper(async (req, res, next) => {
//   const connection = req.dbConnection;
//   const employees = await connection.execute(
//     `SELECT EMPLOYEE_NAME, DEPARTMENT_NAME, DESIGNATION_NAME, DATE_OF_BIRTH, JOINING_DATE, GENDER, GROSS_SALARY FROM V_EMPLOYEE_MASTER`
//   );
//   res.status(200).json({
//     status: 'success',
//     data: {
//       employees,
//     },
//   });
// });

//get attenadance data in pyaroll

// exports.getAttendanceData = wrapper(async (req, res, next) => {
//   const connection = req.dbConnection;
//   const employees = await connection.execute(
//     `SELECT DESIGNATION,NO_WORKING_HRS, EMPLOYEE_NAME, DEPARTMENT_NAME,DEPARTMENT_CODE , TIME_IN, TIME_OUT, ATTEND_DATE, EMPLOYEE_CODE, STATUS2,DESIGNATION_CODE FROM V_ATTENDANCE`
//   );
//   res.status(200).json({
//     status: 'success',
//     data: {
//       employees,
//     },
//   });
// });
