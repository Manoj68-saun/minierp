
const { Client } = require('pg');
const fs = require('fs');
const wrapper = require('../utils/wrapper');
const pdf2base64 = require('pdf-to-base64');
const Pdfmake = require('pdfmake');
const util = require('util');
const unlink = util.promisify(fs.unlink);
const path = require('path');
//const jimp=require('jimp');


const jsonData = JSON.parse(fs.readFileSync(`${__dirname}/../Voucher.json`, 'utf8'));



// const generateOrderId = async (client) => {

//   //const response = await client.query(`SELECT MAX(BOOKING_CODE) AS MAX FROM SL_TRANS_BOOKING_HDR`);

//   //const response1 = await client.query(`SELECT MAX(TO_NUMBER(SUBSTR(BOOKING_CODE,8))) M FROM SL_TRANS_BOOKING_HDR`);
//   // const response1=await client.query(`SELECT max(TO_NUMBER(BOOKING_CODE,'"x"99999'))M FROM SL_TRANS_BOOKING_HDR`);
// //   const response1 = await client.query(`select Voucher_Id_1('2023',to_char(to_date('15-11-2010', 'DD-MM-YYYY'), 'MM'),to_char(to_date('15-11-2010', 'DD-MM-YYYY'), 'DD'),
// //   to_date('15-11-2010', 'DD-MM-YYYY'),1,1 );`);
// //   console.log("ggjhjkkjkj", response1);


// }


// const AllVoucherId = await client.query(
//     `select Voucher_Id_1(${Year1},('${date}', 'MM'),('${date}', 'DD'),
   
//       '${date}',1,1,'A' ); `


//     `select Voucher_Id_1('${Year1}',to_char(to_date('${date1}', 'DD-MM-YYYY'), 'MM'),to_char(to_date('${date1}', 'DD-MM-YYYY'), 'DD'),
//     to_date('${date1}', 'DD-MM-YYYY'),1,1,'A' );`

    
//   );
// console.log(AllVoucherId)


  

 

  //  res.status(200).json({
  //   status: 'success',
  //   data: {
  //       getYear,
  //       AllVoucherId

  //   },
  //   });

 
exports.getAllVoucher = wrapper(async (req, res, next) => {
    const client = req.dbConnection;
    const order = await client.query(
      `select get_voucher_type(Voucher_type)voucher_type_desc, voucher_code, voucher_date, account_codeh, ref_voucher_code, cheque_no, cheque_date, cr, dr
      from fin_mst_t_voucher_hdr where marked is null`
    );
    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  });
  


exports.getVoucherData = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please specify the Order Code',
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
    query += ` WHERE ${arr[i].uniqueVoucherIdentifier}='${req.params.code}'`;
    console.log(query);
    const dbData = await client.query(query);
    data[arr[i].responseFieldName] = dbData.rows;
  }

  res.status(200).json({
    status: 'success',
    data,
    

  });
});

const getVoucherid = wrapper(async (req ,client) => {
 // const client = req.dbConnection;
  const { site, date, send_status, voucher_type} = req.query;
  console.log(req)
  console.log(req.body)
 // const f_yr= fin_yr(${date});
  console.log('hudhdhd',date)
  const date1=date.split("-").reverse().join("-");
  console.log(date1)
  const getYear = await client.query(
  
    `select fin_yr('${date1}'); `
  );
const Year1=getYear.rows[0].fin_yr
return Year1
});


// const generateYear = async (client) => {
    
//     const date1 = await client.query(`select fin_yr('${date}')`);
//     console.log("ggjhjkkjkj", response1);
//     return date1;
  
//   } 



 //const date1=date.split("-").reverse().join("-");
// const generateVoucherId = async (req,client) => {
//     const Year1 = await getVoucherid(req , client);
//     const response1 = await client.query(` select Voucher_Id_1('${Year1}',to_char(to_date('${date1}', 'DD-MM-YYYY'), 'MM'),to_char(to_date('${date1}', 'DD-MM-YYYY'), 'DD'),
//     to_date('${date1}', 'DD-MM-YYYY'),${voucher_type},${site},'${send_status}' )`);
//     console.log("ggjhjkkjkj", response1);
//     return response1;
  
//  } 






exports.createVoucher = wrapper(async (req, res, next) => {
    const client = req.dbConnection;
    const arr = jsonData.createNupdate.fieldNames;
    const vdate=req.body.VoucherHeader[0].voucher_date
    const cdate=req.body.VoucherHeader[0].cheque_date
    console.log('vandna',cdate)
    const vdate1=vdate.split("-").reverse().join("-");
    // const cdate1=cdate.split("-").reverse().join("-");
    console.log(vdate)
    console.log(vdate1)
    const getYear = await client.query(
  
      `select fin_yr('${vdate1}');`
    );
    const Year1=getYear.rows[0].fin_yr
    console.log(":gfhggjgjhjhjhkj"  ,Year1)

    const queryString = `
    SELECT Voucher_Id_1(
      '${Year1}',
      to_char(to_date('${vdate}', 'DD-MM-YYYY'), 'MM'),
      to_char(to_date('${vdate}', 'DD-MM-YYYY'), 'DD'),
      to_date('${vdate1}', 'DD-MM-YYYY'),
      1, 1, 'A'
    )
  `;
  console.log(queryString, "eqyerureueie")
    // const response1 = await client.query(` select Voucher_Id_1('${Year1}',to_char(to_date('${vdate}', 'YYYY-MM-DD'), 'MM'),to_char(to_date('${vdate}', 'YYYY-MM-DD'), 'DD'),
    // to_date('${vdate}', 'YYYY-MM-DD'),1,1,'A' )`);
    const response1 = await client.query(queryString);
    console.log("ggjhjkkjkj", response1);
  
    const voucherCode =response1.rows[0].voucher_id_1
    console.log(req.body,"dudfhudfhudvhuduhdhudhuduhuhds")
    for (let i = 0; i < arr.length; i++) {
      if (req.body[arr[i].responseFieldName]) {
        if (!arr[i].typeArray) {
          const obj = req.body[arr[i].responseFieldName][0];
          
          let fields = ``;
          let values = ``;
          Object.keys(arr[i].fieldsRequired).forEach((field) => {
            if (obj[field]) {
              fields += `${field}, `;
              if (arr[i].fieldsRequired[field] === 'date') values += `VOUCHER_DATE('${obj[field]}', 'YYYY-MM-DD'), `;
              else if (arr[i].fieldsRequired[field] === 'number') values += `${obj[field]}, `;
              else values += `'${obj[field]}', `;
           
            }
          });
          fields = fields.slice(0, -2);
          values = values.slice(0, -2);
          const query = `INSERT INTO ${arr[i].tableName} (VOUCHER_CODE, ${fields}) VALUES ('${voucherCode}', ${values})`;
         // const query = `INSERT INTO ${arr[i].tableName} (VOUCHER_CODE,cheque_date, voucher_date, ${fields}) VALUES ('${voucherCode}','${cdate}','${vdate}', ${values})`;
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
                if (arr[i].fieldsRequired[field] === 'date') values += `VOUCHER_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
                else if (arr[i].fieldsRequired[field] === 'number') values += `${obj[field]}, `;
                else values += `'${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            values = values.slice(0, -2);
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueVoucherIdentifier}, ${fields}) VALUES ('${voucherCode}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  
    res.status(200).json({                                                                                                                   
      status: 'success',
      message: 'Voucher Created Successfully',
    });
  });



exports.getAdditionalData = wrapper(async (req, res, next) => {
    const client = req.dbConnection;
  
    const ACCOUNT_CODEH = await client.query(`with recursive cte_connect_by as (
      select 1 as level, s.* from fin_mst_account s
      where marked is null and account_type='A' and parent_group=(SELECT BANK_ACC1 FROM CONTROL_TABLE) or parent_group=(SELECT BANK_ACC2 FROM CONTROL_TABLE)
      union all
      select level + 1 as level, s.* from cte_connect_by r inner join fin_mst_account s on   r.uniq_code =s.parent_group
      )
      select  account_code, account_name from cte_connect_by  
      order by ltrim(upper(account_name))`);
    
    const VOUCHER_TYPE = await client.query(`select voucher_type_code,voucher_type_desc from fin_mst_voucher_type where marked is null `);

    // const ACCOUNT_CODE = await client.query(`with recursive cte_connect_by as (
    //   select 1 as level, s.* from fin_mst_account s
    //   where marked is null and account_type='A'
    //   union all
    //   select level + 1 as level, s.* from cte_connect_by r inner join fin_mst_account s on   r.uniq_code =s.parent_group
    //   )
    //   select  account_code, account_name from cte_connect_by  `);
    
    const ACCOUNT_CODE = await client.query(`select account_name, account_code from fin_mst_account where marked is null and account_type='A'`);
    res.status(200).json({
      status: 'success',
      data: {
        ACCOUNT_CODEH,
        ACCOUNT_CODE,
        VOUCHER_TYPE,
      },
    });
  });
  

exports.updateVoucher = wrapper(async (req, res, next) => {
  console.log("manoj  mmake othher constoeller")
  if (!req.params.code) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please specify the Voucher Code',
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
        
        console.log(obj)
        console.log(obj.cheque_date)
        let fields = ``;
        Object.keys(arr[i].fieldsRequired).forEach((field) => {
        
          if (obj[field]) {
            
            if (arr[i].fieldsRequired[field] === 'date')
              fields += `${field} ('${obj[field]}', 'DD-MM-YYYY'), `;
            else if (arr[i].fieldsRequired[field] === 'number') fields += `${field} = ${obj[field]}, `;
            else fields += `${field} = '${obj[field]}', `;
          }
        });
        fields = fields.slice(0, -2);
        console.log('ddfdfdfdfddfddfddfd')
        console.log(fields)
        const query = `UPDATE ${arr[i].tableName} SET  ${fields} WHERE ${arr[i].uniqueVoucherIdentifier}='${req.params.code}'`;
        console.log(query);
        await client.query(query);
      } else {
        const arr1 = req.body[arr[i].responseFieldName];
        for (let j = 0; j < arr1.length; j++) {
          const obj = arr1[j];
          if (obj.PARAM === 'UPDATE') {
            let fields = ``;
            Object.keys(arr[i].fieldsRequired).forEach((field) => {
              if (obj[field]) {
                if (arr[i].fieldsRequired[field] === 'date')
                  fields += `${field} = VOUCHER_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
                else if (arr[i].fieldsRequired[field] === 'number') fields += `${field} = ${obj[field]}, `;
                else fields += `${field} = '${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            const query = `UPDATE ${arr[i].tableName} SET ${fields} WHERE ${arr[i].uniqueRowIdentifier}='${obj[arr[i].uniqueRowIdentifier]
              }'`;
            console.log(query);
            await client.query(query);
          } else if (obj.PARAM === 'DELETE') {
            const query = `DELETE FROM ${arr[i].tableName} WHERE ${arr[i].uniqueRowIdentifier}='${obj[arr[i].uniqueRowIdentifier]
              }'`;
            console.log(query);
            await client.query(query);
          } else {
            let fields = ``;
            let values = ``;
            Object.keys(arr[i].fieldsRequired).forEach((field) => {
              if (obj[field]) {
                fields += `${field}, `;
                if (arr[i].fieldsRequired[field] === 'date') values += `VOUCHER_DATE('${obj[field]}', 'DD-MM-YYYY'), `;
                else if (arr[i].fieldsRequired[field] === 'number') values += `${obj[field]}, `;
                else values += `'${obj[field]}', `;
              }
            });
            fields = fields.slice(0, -2);
            values = values.slice(0, -2);
            const query = `INSERT INTO ${arr[i].tableName} (${arr[i].uniqueVoucherIdentifier}, ${fields}) VALUES ('${req.params.code}', ${values})`;
            console.log(query);
            await client.query(query);
          }
        }
      }
    }
  }
  res.status(200).json({
    status: 'success',
    message: 'Voucher Updated Successfully',
  });
});

exports.deleteVoucher = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.params.code) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please specify the Voucher Code',
    });
  }
  const arr = jsonData.getNdelete.dataSources;
  for (let i = 0; i < arr.length; i++) {
    await client.query(
      `DELETE FROM ${arr[i].tableName} WHERE ${arr[i].uniqueVoucherIdentifier}='${req.params.code}'`
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Voucher Deleted Successfully',
  });
});








