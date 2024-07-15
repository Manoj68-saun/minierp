const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");
const { Client } = require("pg");
const AppError = require("../utils/appError");
//const db = require('../db');

const signToken = (id, userType, finyear) =>
  jwt.sign({ id, userType, finyear }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, userType, finyear, statusCode, req, res) => {
  let token;
  if (userType === "employee")
    token = signToken(user.spec_code, "employee", finyear);
  else if (userType === "payroll") token = signToken(user.SPEC_CODE, "payroll");
  else if (userType === "sales")
    token = signToken(user.spec_code, "sales", finyear);
  else if (userType === "stock")
    token = signToken(user.spec_code, "stock", finyear);
  else if (userType === "customer")
    token = signToken(user.S_TAX_NO, "customer");
  else if (userType === "management")
    token = signToken(user.SPEC_CODE, "management");
  else if (userType === "salesGuy")
    token = signToken(user.SPEC_CODE, "salesGuy");
  else if (userType === "productionGuy")
    token = signToken(user.SPEC_CODE, "productionGuy");
  else token = signToken(user.SERVICE_TAX, "vendor");

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    sameSite: "Strict",
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.ITEM_CODE = undefined;
  user.C_PORTAL_PWD = undefined;
  user.V_PORTAL_PWD = undefined;

  user.userType = userType;
  user.finyear = finyear;
  // console.log(req.user, "authCon             token ready to send")
  // console.log(user.finyear,"gffffffffffffffffffffffffffff")
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.login = async (req, res, next) => {
  let client;

  try {
    client = new Client({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    client.connect();
    console.log(req.body);
    const { userCode, password, userType, finyear, company } = req.body;
    // console.log(req.body.finyear ,"authController iiiiiiiiiiiiiiiiiiiiiii")
    // console.log(req.user,"authController iiiiiiiiiiiiiiiiiiiiiii")

    // 1) Check if email and password exist
    console.log(userType === "sales");
    if (!userCode || !password || !userType || !finyear) {
      return next(
        new AppError("Please provide Email, Password and User Type!", 400)
      );
    }

    let user;
    // 2) Check if user exists && password is correct
    if (
      userType === "employee" ||
      userType === "payroll" ||
      userType === "sales" ||
      userType === "stock" ||
      userType === "management" ||
      userType === "salesGuy" ||
      userType === "productionGuy"
    ) {
      user = await client.query(
        `SELECT SPEC_CODE, decrypt10g(ITEM_CODE) AS ITEM_CODE, COMPANY_CODE, UNIT_CODE FROM SL_SEC_SPEC_ITEM_HDR WHERE SPEC_CODE='${userCode}'`
      );

      //console.log(res.send(user.rows[0].jsonb_agg));
      // console.log(req.user, "authCon            after login")
      // console.log(user.rows);
      // console.log(user.rows[0].item_code);
      // console.log(password);
      // console.log(user.rows[0].ITEM_CODE)
      if (!user.rows[0] || password !== user.rows[0].item_code) {
        return next(new AppError("Incorrect User Code or Password", 401));
      }
    } else if (userType === "customer") {
      user = await client.query(
        `SELECT S_TAX_NO, C_PORTAL_PWD, DISTRIBUTOR_CODE, ACCOUNT_CODE, COMPANY_CODE, UNIT_CODE, DEALER_CODE FROM SL_MST_DISTRIBUTOR WHERE S_TAX_NO='${userCode}'`
      );
      if (!user.rows[0] || password !== user.rows[0].C_PORTAL_PWD) {
        return next(new AppError("Incorrect Tax Number or Password", 401));
      }
    } else if (userType === "vendor") {
      user = await client.query(
        `SELECT SERVICE_TAX, V_PORTAL_PWD, ACCOUNT_CODE, PARTY_CODE, COMPANY_CODE, UNIT_CODE FROM PUR_MST_PARTY WHERE SERVICE_TAX='${userCode}'`
      );
      if (!user.rows[0] || password !== user.rows[0].V_PORTAL_PWD) {
        return next(
          new AppError("Incorrect Service Tax Number or Password", 401)
        );
      }
    }
    // console.log(req.user, "authCon             before token")
    // 3) If everything ok, send token to client
    createSendToken(user.rows[0], userType, finyear, 200, req, res);
  } catch (err) {
    console.error(err);
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (err) {
        console.error(err);
      }
    }
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  let client;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log(token, "prottttttttttttttttttttttttttttt");
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please login to get access",
      });
    }
    // console.log (req.user,    "INNNNNNNNNNNNNNN protect")
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
    client = await new Client({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTION_STRING,
    });
    client.connect();
    req.dbConnection = client;

    // console.log('sdcdfdfdfdgfgffhgfhgfh');
    // 3) Check if user still exists
    let currentUser;
    if (
      decoded.userType === "employee" ||
      decoded.userType === "payroll" ||
      decoded.userType === "stock" ||
      decoded.userType === "sales" ||
      decoded.userType === "management" ||
      decoded.userType === "salesGuy" ||
      decoded.userType === "productionGuy"
    ) {
      currentUser = await client.query(
        `SELECT SPEC_CODE, ITEM_CODE, COMPANY_CODE, UNIT_CODE FROM SL_SEC_SPEC_ITEM_HDR WHERE SPEC_CODE='${decoded.id}'`
      );
      // console.log(currentUser,"authController protect")
    }
    // console.log(currentUser)
    else if (decoded.userType === "customer") {
      currentUser = await client.query(
        `SELECT S_TAX_NO, C_PORTAL_PWD, DISTRIBUTOR_CODE, ACCOUNT_CODE, COMPANY_CODE, UNIT_CODE, DEALER_CODE FROM SL_MST_DISTRIBUTOR WHERE S_TAX_NO='${decoded.id}'`
      );
    } else if (decoded.userType === "vendor") {
      currentUser = await client.query(
        `SELECT SERVICE_TAX, V_PORTAL_PWD, ACCOUNT_CODE, PARTY_CODE, COMPANY_CODE, UNIT_CODE FROM PUR_MST_PARTY WHERE SERVICE_TAX='${decoded.id}'`
      );
    }

    if (!currentUser || !currentUser.rows[0]) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }
    currentUser.rows.userType = decoded.userType;
    currentUser.rows.finyear = decoded.finyear;
    req.user = currentUser.rows;

    let permissions;
    if (decoded.id === "employee") {
      permissions = await client.query(
        `SELECT LOGIN_CODE, L_ADD, L_MODIFY, L_DELETE, L_QUERY FROM SL_SEC_LOGIN_RIGHTS WHERE LOGIN_CODE='${decoded.id}'`
      );
      req.user.PERMISSIONS = permissions.rows;
    }

    res.locals.user = req.user;
    // console.log(res.locals.user);
    next();
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });

    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error(error);
      }
    }
  }
};

exports.checkPermissions = (action) => (req, res, next) => {
  if (!req.user.PERMISSIONS[action]) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
};

exports.checkUser = (userType) => (req, res, next) => {
  if (req.user.userType !== userType) {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorised to see this data",
    });
  }
  next();
};

exports.isLoggedIn = async (req, res, next) => {
  console.log("fgfhjl;");
  // console.log(req)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (token) {
    let client;
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      console.log(decoded);
      console.log(token);
      console.log(process.env.NODE_ENV);
      client = new Client({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING,
      });
      client.connect();
      // 2) Check if user still exists
      let currentUser;
      //  let finYears;
      if (
        decoded.userType === "employee" ||
        decoded.userType === "payroll" ||
        decoded.userType === "stock" ||
        decoded.userType === "sales" ||
        decoded.userType === "management" ||
        decoded.userType === "salesGuy" ||
        decoded.userType === "productionGuy"
      ) {
        currentUser = await client.query(
          `SELECT SPEC_CODE, ITEM_CODE, COMPANY_CODE, UNIT_CODE FROM SL_SEC_SPEC_ITEM_HDR WHERE SPEC_CODE='${decoded.id}'`
        );

        // finYears = await client.query(`SELECT year_code, year_desc FROM fin_mst_year_mst`);
      } else if (decoded.userType === "customer") {
        currentUser = await client.query(
          `SELECT S_TAX_NO, C_PORTAL_PWD, DISTRIBUTOR_CODE, ACCOUNT_CODE, COMPANY_CODE, UNIT_CODE, DEALER_CODE FROM SL_MST_DISTRIBUTOR WHERE S_TAX_NO='${decoded.id}'`
        );
      } else if (decoded.userType === "vendor") {
        currentUser = await client.query(
          `SELECT SERVICE_TAX, V_PORTAL_PWD, ACCOUNT_CODE, PARTY_CODE, COMPANY_CODE, UNIT_CODE FROM PUR_MST_PARTY WHERE SERVICE_TAX='${decoded.id}'`
        );
      }

      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      currentUser.rows[0].userType = decoded.userType;
      res.locals.user = currentUser.rows[0];
      res.status(200).json({
        status: "success",
        data: {
          user: currentUser,
          //finYears: finYears.rows,
        },
      });
    } catch (err) {
      return next();
    } finally {
      if (client) {
        try {
          await client.end();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  next();
};

exports.finYearModule = async (req, res, next) => {
  let client;
  client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING,
  });
  client.connect();
  // const client = req.dbConnection;
  // console.log(client);

  const finYears = await client.query(`
  SELECT
    year_code,
    year_desc,
    CASE WHEN date_part('year', CURRENT_DATE) = CAST(SUBSTRING(year_desc, 1, 4) AS double precision) THEN true ELSE false END AS selected
  FROM
    fin_mst_year_mst;`);
  res.status(200).json({
    status: "success",
    data: {
      finYears: finYears.rows,
    },
  });
};

exports.companyModule = async (req, res, next) => {
  let client;
  client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING,
  });
  client.connect();
  // const client = req.dbConnection;
  // console.log(client);

  const companys = await client.query(`
  select company_code,company_name from sl_mst_company where marked is null;`);
  res.status(200).json({
    status: "success",
    data: {
      companys: companys.rows,
    },
  });
};

exports.getUserType = async (req, res, next) => {
  let client;
  client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTION_STRING,
  });
  client.connect();
  // const client = req.dbConnection;
  // console.log(client);

  const userTypes = await client.query(
    `select module_id, module_name from sl_mst_module`
  );
  res.status(200).json({
    status: "success",
    data: {
      userTypes: userTypes.rows,
    },
  });
};

exports.updateMyPassword = wrapper(async (req, res, next) => {
  const client = req.dbConnection;
  if (!req.body.password || req.body.password !== req.body.passwordConfirm) {
    return res.status(400).json({
      status: "fail",
      message: "Password and Confirm Password don't match",
    });
  }

  if (
    (req.user.userType === "employee" ||
      req.user.userType === "payroll" ||
      req.user.userType === "SalesModule" ||
      req.user.userType === "management" ||
      req.user.userType === "salesGuy" ||
      req.user.userType === "productionGuy") &&
    req.user.ITEM_CODE === req.body.currentPassword
  ) {
    await client.query(
      `UPDATE SL_SEC_SPEC_ITEM_HDR SET ITEM_CODE='${req.body.password}' WHERE SPEC_CODE='${req.user.SPEC_CODE}'`
    );
  } else if (
    req.user.userType === "customer" &&
    req.user.C_PORTAL_PWD === req.body.currentPassword
  ) {
    await client.query(
      `UPDATE SL_MST_DISTRIBUTOR SET C_PORTAL_PWD='${req.body.password}' WHERE S_TAX_NO='${req.user.S_TAX_NO}'`
    );
  } else if (
    req.user.userType === "vendor" &&
    req.user.V_PORTAL_PWD === req.body.currentPassword
  ) {
    await client.query(
      `UPDATE PUR_MST_PARTY SET V_PORTAL_PWD='${req.body.password}' WHERE SERVICE_TAX='${req.user.SERVICE_TAX}'`
    );
  } else {
    return res.status(400).json({
      status: "fail",
      message: "The password you entered does not match.",
    });
  }

  createSendToken(req.user, req.user.userType, 200, req, res);
});
