import { Scrollbars } from "react-custom-scrollbars-2";
import classes from "./App.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "./components/LayoutWrapper/LayoutWrapper";
//import MainPage from './Pages/MainPage/MainPage'
//import CustomerPortalPage from './Pages/CustomerPortalPage/CustomerPortalPage'
//import VendorPortalPage from './Pages/VendorPortalPage/VendorPortalPage'
//import PayrollPage from './Pages/PayrollPage/PayrollPage';
import LandingPage from "./Pages/LandingPage/LandingPage";
import Lov from "./Pages/LovPage/Lov";
//import LandingPageC from './Pages/LandingPageC/LandingPageC';
//import LandingPageV from './Pages/LandingPageV/LandingPageV';
import SignInPage from "./Pages/SignInPage/SignInPage";
//import SignInPageC from './Pages/SignInPageC/SignInPageC';
//import SignInPageV from './Pages/SignInPageV/SignInPageV';

import SalesModule from "./Pages/SalesModulePage/SalesModule";
import StockModule from "./Pages/StockModulePage/StockModule";
import { getFabUtilityClass } from "@mui/material";
import { get } from "react-hook-form";

function App() {
  const AURL = "http://localhost:8005";
  const [company, setCompany] = useState(null);
  const [site, setSite] = useState(null);
  const [finYear, setFinYear] = useState(null);
  const [type, setType] = useState("");
  const [userTypes, setUserTypes] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [companyTypes, setCompanyTypes] = useState(null);
  const [cite, setCite] = useState(null);
  //const [analysisV, setAnalysisV] = useState(null)
  const history = useNavigate();

  useEffect(() => {
    axios
      .get(AURL + "/api/v1/users/finYearModule", {
        withCredentials: true,
      })

      .then((response) => {
        console.log(response.data.data.finYears);

        console.log(finYear);
        setFinYear(response.data.data.finYears);
        console.log(finYear);
      });

    axios
      .get(AURL + "/api/v1/users/companyModule", {
        withCredentials: true,
      })

      .then((response) => {
        console.log(response);

        setCompanyTypes(response.data.data.companys);
        // console.log(finYear);
      });

    // axios
    //   .get(AURL + "/api/v1/users/site", {
    //     withCredentials: true,
    //   })

    //   .then((response) => {
    //     console.log(response);

    //     setCite(response.data.data.userTypes);
    //     // console.log(finYear);
    //   });

    axios
      .get(AURL + "/api/v1/users/getUserType", {
        withCredentials: true,
      })

      .then((response) => {
        console.log(response);

        setUserTypes(response.data.data.userTypes);
        // console.log(finYear);
      });

    axios
      .get(AURL + "/api/v1/users/checkStatus", {
        withCredentials: true,
      })
      .then((responseA) => {
        console.log(responseA);

        if (responseA.data.data) {
          if (responseA.data.data.user.rows[0].userType === "employee") {
            axios
              .get(AURL + "/api/v1/cns", { withCredentials: true })
              .then((response) => {
                console.log(response);
                const index = response.data.data.companies.findIndex(
                  (element) =>
                    element.company_code ===
                    responseA.data.data.user.rows[0].company_code
                );
                setCompany({
                  code: responseA.data.data.user.rows[0].company_code,
                  name: response.data.data.companies[index].company_name,
                });
                console.log(company);
                const index2 = response.data.data.sites.findIndex(
                  (element) =>
                    element.site_code ===
                    responseA.data.data.user.rows[0].unit_code
                );
                setSite({
                  code: responseA.data.data.user.rows[0].unit_code,
                  name: response.data.data.sites[index2].site_desc,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
          if (responseA.data.data.user.rows[0].userType === "erp") {
            axios
              .get(AURL + "/api/v1/cns", { withCredentials: true })
              .then((response) => {
                const index = response.data.data.companies.findIndex(
                  (element) =>
                    element.COMPANY_CODE ===
                    responseA.data.data.user.rows[0].COMPANY_CODE
                );
                setCompany({
                  code: responseA.data.data.user.rows[0].COMPANY_CODE,
                  name: response.data.data.companies[index].COMPANY_NAME,
                });

                const index2 = response.data.data.sites.findIndex(
                  (element) =>
                    element.SITE_CODE ===
                    responseA.data.data.user.rows[0].UNIT_CODE
                );
                setSite({
                  code: responseA.data.data.user.rows[0].UNIT_CODE,
                  name: response.data.data.sites[index2].SITE_DESC,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }

          if (responseA.data.data.user.rows[0].userType === "sales") {
            setAnalysis(null);
            axios
              .get(AURL + "/api/v1/dashboard/dash-board", {
                withCredentials: true,
              })
              .then((response) => {
                console.log(response);
                setAnalysis((analysis) => {
                  let newAnalysis = response.data.data;
                  return newAnalysis;
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }

          // if(responseA.data.data.user.rows[0].userType === "vendor"){
          //   axios
          //   .get(AURL + '/api/v1/vendor/analysis',{withCredentials: true})
          //   .then((response) => {

          //     setAnalysisV((analysisV) => {
          //       let newAnalysis = response.data.data
          //       return newAnalysis
          //     })

          //   })
          //   .catch((err) => {
          //     console.log(err);
          //   });
          // }.

          if (
            responseA.data.data.user.rows[0].userType !== "customer" &&
            window.location.href.split("/")[3] === "customer-portal"
          ) {
            history.replace("/customer");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          }

          if (
            responseA.data.data.user.rows[0].userType !== "vendor" &&
            window.location.href.split("/")[3] === "vendor-portal"
          ) {
            history.replace("/vendor");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          }

          if (
            responseA.data.data.user.rows[0].userType !== "employee" &&
            window.location.href.split("/")[3] === "reports"
          ) {
            history.replace("/employee");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          }

          if (
            responseA.data.data.user.rows[0].userType !== "payroll" &&
            window.location.href.split("/")[3] === "payroll"
          ) {
            history.replace("/employee");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          }

          if (
            responseA.data.data.user.rows[0].userType !== "sales" &&
            window.location.href.split("/")[3] === "SalesModule"
          ) {
            history.replace("/employee");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          }
        } else {
          if (
            window.location.href.split("/")[3] !== "employee" &&
            window.location.href.split("/")[3] !== "signIn" &&
            window.location.href.split("/")[3] === "reports"
          ) {
            history.replace("/employee");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          } else if (
            window.location.href.split("/")[3] !== "employee" &&
            window.location.href.split("/")[3] !== "signIn" &&
            window.location.href.split("/")[3] === "payroll"
          ) {
            history.replace("/employee");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          } else if (
            window.location.href.split("/")[3] !== "erp" &&
            window.location.href.split("/")[3] !== "signIn" &&
            window.location.href.split("/")[3] === "erp"
          ) {
            history.replace("/erp");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          } else if (
            window.location.href.split("/")[3] !== "customer" &&
            window.location.href.split("/")[3] !== "signInC" &&
            window.location.href.split("/")[3] === "customer-portal"
          ) {
            history.replace("/customer");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          } else if (
            window.location.href.split("/")[3] !== "vendor" &&
            window.location.href.split("/")[3] !== "signInV" &&
            window.location.href.split("/")[3] === "vendor-portal"
          ) {
            history.replace("/vendor");
            message.error({
              content: "Sign In to gain Access!!!!",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log("finyearasfdgffgfh", finYear);

  return (
    <Scrollbars className={classes["App"]}>
      <LayoutWrapper>
        <Routes>
          <Route exact path="/lov" Lov type={type} setType={setType} />

          <Route
            exact
            path="/employee"
            element={
              <LandingPage type={type} setType={setType} finYear={finYear} />
            }
          />

          <Route
            exact
            path="/signIn"
            element={
              finYear !== null &&
              userTypes !== null && (
                <SignInPage
                  url={AURL}
                  analysis={analysis}
                  setAnalysis={setAnalysis}
                  setCompany={setCompany}
                  setSite={setSite}
                  company={company}
                  site={site}
                  type={type}
                  finYear={finYear}
                  userTypes={userTypes}
                  companyType={companyTypes}
                  cite={cite}
                />
              )
            }
          />

          <Route
            path="/sales*"
            element={
              analysis ? (
                <SalesModule
                  url={AURL}
                  finYear={finYear}
                  analysis={analysis}
                  setAnalysis={setAnalysis}
                />
              ) : (
                // Render a loading component or a placeholder while waiting for data
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100vh",
                      background: "#F0E5F3", // Set your desired background color
                    }}
                  >
                    <h1 style={{ color: "white" }}>Welcome to Mini Erp</h1>
                  </div>
                </>
              )
            }
          />

          <Route
            path="/stock*"
            element={
              <StockModule url={AURL} finYear={finYear} />

              // Render a loading component or a placeholder while waiting for data
              // <>
              //   <div
              //     style={{
              //       display: "flex",
              //       flexDirection: "column",
              //       alignItems: "center",
              //       justifyContent: "center",
              //       height: "100vh",
              //       background: "#F0E5F3", // Set your desired background color
              //     }}
              //   >
              //     <h1 style={{ color: "white" }}>Welcome to Mini Erp</h1>
              //   </div>
              // </>
            }
          />
        </Routes>
      </LayoutWrapper>
    </Scrollbars>
  );
}

export default App;
