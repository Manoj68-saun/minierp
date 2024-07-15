
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const {Client} = require('pg');
const fs = require('fs');
const wrapper = require('../utils/wrapper');
const { Console } = require('console');



// const generateId = async (connection) => {
//     const response = await connection.execute(`SELECT MAX(ATTEND_CODE) AS MAX FROM sl_MST_CATEGORY`);
//     return response.rows[0].max + 1;
//   };



  exports.getAllCategory = wrapper(async (req, res, next) => {
    const client = req.dbConnection;
    console.log("fjddjdjdv")
    const category = await client.query(
      `SELECT CHARGE_CATEGORY_CODE, CHARGE_CATEGRY_DESC  FROM sl_MST_CATEGORY `
    );
    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  });
  