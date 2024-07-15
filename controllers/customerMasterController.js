/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const { Client } = require("pg");
const fs = require("fs");
const wrapper = require("../utils/wrapper");

const jsonData = JSON.parse(
  fs.readFileSync(`${__dirname}/../customerMasterData.json`, "utf8")
);

const generateCustomerId = async (customerCode, tableName, client) => {
  const response = await client.query(
    `SELECT MAX(${customerCode}) AS MAX FROM ${tableName}`
  );
  return response.rows[0].max + 1;
};

exports.getAllCustomer = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const customer = await client.query(
    `SELECT DISTRIBUTOR_CODE, DISTRIBUTOR_NAME, ACC_GROUP_CODE, ACCOUNT_GROUP, PAYMENT_DAYS, EMAIL_ID, ADDRESS, CITY_CODE, CITY, CONTACT_PERSON, PHONE, GST_NO, PAN_NO FROM VW_CUSTOMER_MST`
  );
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});

exports.getAccGroup = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  const ACC_GROUP_CODE = await client.query(
    `SELECT ACCOUNT_CODE, ACCOUNT_NAME FROM FIN_MST_ACCOUNT`
  );
  res.status(200).json({
    status: "success",
    data: {
      ACC_GROUP_CODE,
    },
  });
});

exports.getCustomer = wrapper(async (req, res, next) => {
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
    query += ` WHERE ${arr[i].uniqueCustomerIdentifier}='${req.params.code}'`;
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
        query = `SELECT ${obj[key].columnsRequired} FROM ${obj[key].masterName} order by 2`;
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

exports.createCustomer = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  console.log(req.body, "req body dal de");
  const arr = jsonData.createNupdate.fieldNames;
  console.log(arr, "arrrrrrrr");
  const item = req.body.customerMaster[0].distributor_name;
  console.log(item);
  const customerCode = await generateCustomerId(
    arr[0].uniqueCustomerIdentifier,
    arr[0].tableName,
    client
  );
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
        const getYear = await client.query(
          `select duplicate_cust_chk('${item}');`
        );
        console.log(getYear.rows[0], "dgjejygdejydhejdyejdhejde");
        // console.log(getYear.rows[0].duplicate_cust_chk=='1')
        if (getYear.rows[0].duplicate_cust_chk >= "1") {
          return res.status(200).json({
            status: "fail",
            message: "Customer Already Exists",
          });
        }
        const query = `INSERT INTO ${arr[i].tableName} (DISTRIBUTOR_CODE, ${fields}) VALUES ('${customerCode}', ${values})`;
        console.log(query);
        await client.query(query);
      } else {
        console.log(i, "iiiii");

        const arr1 = req.body[arr[i].responseFieldName];
        for (let j = 0; j < arr1.length; j++) {
          console.log(j, "jjjjj");
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

          const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueCustomerIdentifier}, ${fields}) VALUES ('${customerCode}', ${values})`;
          console.log(query);
          await client.query(query);
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    message: "Customer master Created Successfully",
  });
});

exports.updateCustomer = wrapper(async (req, res, next) => {
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Customer Code",
    });
  }
  const client = req.dbConnection;

  const arr = jsonData.createNupdate.fieldNames;
  const item = req.body.customerMaster[0].distributor_name;
  console.log(item);
  for (let i = 0; i < arr.length; i++) {
    if (req.body[arr[i].responseFieldName]) {
      if (!arr[i].typeArray) {
        const obj = req.body[arr[i].responseFieldName][0];
        let fields = ``;
        Object.keys(arr[i].fieldsRequired).forEach((field) => {
          if (obj[field]) {
            if (arr[i].fieldsRequired[field] === "date")
              fields += `${field} = TO_CHAR('${obj[field]}', 'DD-MM-YYYY'), `;
            else if (arr[i].fieldsRequired[field] === "number")
              fields += `${field} = ${obj[field]}, `;
            else fields += `${field} = '${obj[field]}', `;
          }
        });
        fields = fields.slice(0, -2);
        const getYear = await client.query(
          `select duplicate_cust_chk('${item}');`
        );
        console.log(getYear.rows[0], "dgjejygdejydhejdyejdhejde");
        // console.log(getYear.rows[0].duplicate_cust_chk=='1')
        if (getYear.rows[0].duplicate_cust_chk >= "1") {
          return res.status(200).json({
            status: "fail",
            message: "Customer Already Exists",
          });
        }
        const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueCustomerIdentifier}=${req.params.code}`;
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
                  fields += `${field} = TO_CHAR('${obj[field]}', 'DD-MM-YYYY'), `;
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
                  values += `TO_CHAR('${obj[field]}', 'DD-MM-YYYY'), `;
                else if (arr[i].fieldsRequired[field] === "number")
                  values += `${obj[field]}, `;
                else values += `'${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            values = values.slice(0, -2);
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueCustomerIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: "success",
    message: "Customer master Updated Successfully",
  });
});

exports.deleteCustomer = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify the Customer Code",
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `UPDATE ${arr[i].tableName} SET MARKED='D' WHERE ${arr[i].uniqueCustomerIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Item Deleted Successfully",
  });
});
