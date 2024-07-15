const {Client} = require('pg')

exports.getCNS = async (req, res, next) => {
  let client;

  try {
    client =  new Client({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING,
    });
     client.connect();
     console.log(process.env.DB_CONNECTION_STRING);
     console.log(process.env.DB_USERNAME)

    console.log(process.env.DB_PASSWORD)
    //console.log(companies)
    const companies = await client.query(
     // `SELECT COMPANY_CODE, COMPANY_NAME FROM SL_MST_COMPANY`
      `select company_code, company_name from sl_mst_company`
    );
    //console.log(companies)
    const sites = await client.query(`SELECT SITE_CODE, COMPANY, SITE_DESC FROM SL_MST_SITE`);

    const finYears = await client.query(`SELECT year_code, year_desc FROM fin_mst_year_mst`);
    
    
    res.status(200).json({
      status: 'success',
      data: {
        companies: companies.rows,
        sites: sites.rows,
        finYears: finYears.rows,
        
      },

    });
    
   /* const dbData = await connection.execute(`SELECT DB_NAME FROM DB_CONN_STRINFO`)
    const getserver=dbData.rows[0].DB_NAME;
    const getserver2=dbData.rows[1].DB_NAME;

           if(req.body.dbData===(getserver)){
           dotenv.config({ path: './config1.env' });
          console.log("iqon is connected")
          const port = process.env.PORT || 8000;
           app.listen(port, () => {
              console.log(`App running on port ${port} and server name is IQON`);
            });
    
               }
                 else if(req.body.dbData===(getserver2)){
                  dotenv.config({ path: './config2.env' });
                   console.log("iqsaas is connected")
                  const port = process.env.PORT || 8000;
                  app.listen(port, () => {
                    console.log(`App running on port ${port} and server name is IQSAAS...`);
                  });  

    }
    */
   
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  } finally {
    if (client) {
      try {
        await client.end()
      } catch (err) {
        console.error(err);
      }
    }
  }
};
