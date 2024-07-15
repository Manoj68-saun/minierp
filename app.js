const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const app = express();
const wrapper = require("./utils/wrapper");
const { Client } = require("pg");
const bodyParser = require("body-parser");

// REQUIRING ROUTERS
const userRouter = require("./routes/userRoutes");
const cnsRouter = require("./routes/cnsRoutes");
const authController = require("./controllers/authController");
const employeeMiscRouter = require("./routes/employeeMiscRoutes");
const itemMasterRouter = require("./routes/itemMasterRoutes");
const customerMasterRouter = require("./routes/customerMasterRoutes");
const SalesOrderRouter = require("./routes/SalesOrderRoutes");
const categoryDetail = require("./routes/categoryDetailRoutes");
const miscSalesRouter = require("./routes/salesMiscRoutes");
const InvoiceRouter = require("./routes/InvoiceRoutes");
const accountMasterRouter = require("./routes/accountMasterRoutes");
const itemTaxRouter = require("./routes/itemWiseTaxRoutes");
const gaugePolicyRouter = require("./routes/GaugePolicyRoutes");
const contractRoutes = require("./routes/contractRoutes");
const VoucherRoutes = require("./routes/VoucherRoutes");
const Dashboard = require("./routes/dashbordRoutes");
const dealerMasterRouter = require("./routes/dealerMasterRoutes");
const openingBalanceRouter = require("./routes/openingBalanceRoutes");
const RequisitionRouter = require("./routes/RequisitionRoutes");
const dailyIssueRouter = require("./routes/dailyIssueRoutes");
const stockAdjustmnet = require("./routes/StockAdjust");
const dailyProd = require("./routes/dailyProdeRoutes");
const purchaseIndent = require("./routes/PurchaseRequisitionRoutes");
const purchaseOrder = require("./routes/purchaseOrderRoutes");

//faerhgljkgfdgfds demo for Pramod ji
// 1) MIDDLEWARES

// Implement CORS
// Access Control Allow Origin
// Allowing requests from only front end of this project..! --- MUST BE ADDED IMMEDIATELY AFTER DEPLPOYMENT!🛠
app.use(
  cors({
    origin: "http://localhost:3005",
    credentials: true,
  })
);
//Responding to OPTIONS req or pre-flight phase
app.options("*", cors());

// Set security HTTP headers
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       'script-src': ["'self'", "'unsafe-inline'"],
//     },
//   })
// );

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.static("frontend/build"));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(express.json());
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// 3) Add app.use to Routes using Routers
app.use("/api/v1/users", userRouter);
//app.use('/api/v1/reports', authController.protect, authController.checkUser('employee'), reportRouter);
//app.use('/api/v1/schedule-report', authController.protect, authController.checkUser('employee'), reportScheduleRouter);
app.use(
  "/api/v1/cns",
  authController.protect,
  authController.checkUser("employee"),
  cnsRouter
);
//
app.use(
  "/api/v1/employee-misc",
  authController.protect,
  authController.checkUser("payroll"),
  employeeMiscRouter
);
app.use(
  "/api/v1/items",
  authController.protect,
  authController.checkUser("sales"),
  itemMasterRouter
);
app.use(
  "/api/v1/customerm",
  authController.protect,
  authController.checkUser("sales"),
  customerMasterRouter
);
app.use(
  "/api/v1/salesOrder",
  authController.protect,
  authController.checkUser("sales"),
  SalesOrderRouter
);
app.use(
  "/api/v1/salesOrderm",
  authController.protect,
  authController.checkUser("sales"),
  categoryDetail
);
app.use(
  "/api/v1/salesMisc",
  authController.protect,
  authController.checkUser("sales"),
  miscSalesRouter
);
app.use(
  "/api/v1/salesInvoice",
  authController.protect,
  authController.checkUser("sales"),
  InvoiceRouter
);
app.use(
  "/api/v1/account",
  authController.protect,
  authController.checkUser("sales"),
  accountMasterRouter
);
app.use(
  "/api/v1/tax",
  authController.protect,
  authController.checkUser("sales"),
  itemTaxRouter
);

app.use(
  "/api/v1/gauge",
  authController.protect,
  authController.checkUser("sales"),
  gaugePolicyRouter
);
app.use(
  "/api/v1/salesContract",
  authController.protect,
  authController.checkUser("sales"),
  contractRoutes
);
app.use(
  "/api/v1/voucher",
  authController.protect,
  authController.checkUser("sales"),
  VoucherRoutes
);
app.use(
  "/api/v1/dashboard",
  authController.protect,
  authController.checkUser("sales"),
  Dashboard
);
app.use(
  "/api/v1/dealer",
  authController.protect,
  authController.checkUser("sales"),
  dealerMasterRouter
);

app.use(
  "/api/v1/opening",
  authController.protect,
  authController.checkUser("stock"),
  openingBalanceRouter
);

app.use(
  "/api/v1/requisition",
  authController.protect,
  authController.checkUser("stock"),
  RequisitionRouter
);
app.use(
  "/api/v1/dailyIssue",
  authController.protect,
  authController.checkUser("stock"),
  dailyIssueRouter
);

app.use(
  "/api/v1/stockadj",
  authController.protect,
  authController.checkUser("stock"),
  stockAdjustmnet
);

app.use(
  "/api/v1/dailyprod",
  authController.protect,
  authController.checkUser("stock"),
  dailyProd
);

app.use(
  "/api/v1/purchaseindent",
  authController.protect,
  authController.checkUser("stock"),
  purchaseIndent
);

app.use(
  "/api/v1/purchaseorder",
  authController.protect,
  authController.checkUser("stock"),
  purchaseOrder
);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  // const index = path.join(__dirname,   './public/index.html');
  // res.sendFile(index);
  // res.sendFile(__dirname + '/index.html');
});

module.exports = app;
