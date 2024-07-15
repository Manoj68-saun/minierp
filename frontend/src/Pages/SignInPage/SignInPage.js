import classes from "./SignInPage.module.css";
import landingLogo from "../../assets/login1Logo.png";
// import {
//   FormControl,
//   InputLabel,
//   TextField,
//   Select,
//   MenuItem,
//   Button,
// } from "@mui/material";
import axios from "axios";
import { Form, Input, Typography, Button, Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useNavigate } from 'react-router';
import { message } from "antd";
//import SalesModule from '../../Pages/SalesModulePage/SalesModule';
const SignIn = (props) => {
  console.log(props, "sing in props");
  // const navigate = useNavigate();
  const history = useNavigate();
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [finYear, setFinYear] = useState("");
  const [finFinal, setFinFinal] = useState("");
  const [companyFinal, setCompanyFinal] = useState("");
  const [usertype, setUserType] = useState("");
  const [codeIsValid, setCodeIsValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [typeValid, setTypeValid] = useState(true);
  const [yearValid, setYearValid] = useState(true);
  const [company, setCompany] = useState("");
  const [companyValid, setCompanyValid] = useState(true);
  const [type, setType] = useState("employee");
  const [label, setLabel] = useState("Report Writer");
  const { Option } = Select;
  console.log(props);
  console.log(props);

  const userChange = (e) => {
    if (e.target.value !== "") setCodeIsValid(true);
    else setCodeIsValid(false);
    console.log(e.target.value);
    setUserCode(e.target.value);
  };

  const passwordChange = (e) => {
    if (e.target.value !== "") setPasswordValid(true);
    else setPasswordValid(false);

    setPassword(e.target.value);
  };

  const finyearChange = (value) => {
    console.log(value);
    if (value !== "") setYearValid(true);
    else setYearValid(false);
    console.log("yearValid:", yearValid);
    setFinYear(value);
    setFinFinal(value);
  };

  const companyChange = (value) => {
    console.log(value);
    if (value !== "") setCompanyValid(true);
    else setCompanyValid(false);
    console.log("yearValid:", yearValid);
    setCompany(value);
    setCompanyFinal(value);
  };

  const submitHandler = (e) => {
    console.log(usertype);
    if (userCode === "") setCodeIsValid(false);

    if (password === "") setPasswordValid(false);
    if (finYear === "") setYearValid(false);
    if (usertype === "") setTypeValid(false);
    if (company === "") setCompanyValid(false);
    if (
      userCode !== "" &&
      password !== "" &&
      finYear !== "" &&
      usertype !== "" &&
      company !== ""
    ) {
      setCodeIsValid(true);
      setPasswordValid(true);
      setYearValid(true);
      setTypeValid(true);
      setCompanyValid(true);
      console.log("Submitting");

      const postData = {
        userCode: userCode,
        password: password,
        userType: usertype,
        finyear: finYear,
        company: company,
      };

      console.log(postData);

      axios
        .post(props.url + "/api/v1/users/login", postData, {
          withCredentials: true,
          credentials: "include",
        })
        .then((responseA) => {
          console.log(responseA);
          console.log(type, "type");
          if (type === "employee") {
            axios
              .get(props.url + "/api/v1/cns", { withCredentials: true })
              .then((response) => {
                console.log(response);
                const index = response.data.data.companies.findIndex(
                  (element) =>
                    element.COMPANY_CODE ===
                    responseA.data.data.user.COMPANY_CODE
                );
                props.setCompany({
                  code: responseA.data.data.user.COMPANY_CODE,
                  name: response.data.data.companies[index].COMPANY_NAME,
                });

                const index2 = response.data.data.sites.findIndex(
                  (element) =>
                    element.SITE_CODE === responseA.data.data.user.UNIT_CODE
                );
                props.setSite({
                  code: responseA.data.data.user.UNIT_CODE,
                  name: response.data.data.sites[index2].SITE_DESC,
                });
                // props.setFinYear(response.data.data.finYears);
                // const index3 = response.data.data.finYears.findIndex((element) => element.fin_year === responseA.data.data.user.rows[0].year_code)
                //  props.setFinYear({code: responseA.data.data.user.rows[0].year_code, name: response.data.data.finYears[index3].year_desc});

                message.success({
                  content: "Welcome to O2C Report Writer!!!!",
                  className: "custom-class",
                  style: {
                    marginTop: "20vh",
                  },
                });

                history.replace("/reports");
              })
              .catch((err) => {
                console.log(err);
              });
          }

          if (type === "stock") {
            history("/stock");
          }
          if (type === "sales") {
            axios
              .get(props.url + "/api/v1/dashboard/dash-board", {
                withCredentials: true,
              })
              .then((response) => {
                console.log(response);
                props.setAnalysis((analysis) => {
                  let newAnalysis = response.data.data;
                  return newAnalysis;
                });
              })
              .catch((err) => {
                console.log(err);
              });

            history("/sales/dashboard");
          }
        })

        .catch((err) => {
          message.error({
            content: "Invalid Username or Password!!!!",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        });
    }
  };

  const typeHandler = (value) => {
    console.log(value);
    if (value !== "") setTypeValid(true);
    else setTypeValid(false);
    setUserType(value);
    console.log(typeValid);
    setType(value);
    // console.log(val)
    if (value === "employee") {
      setLabel("Report writer");
    }

    if (value === "payroll") {
      setLabel("Payroll Portal");
    }
    if (value === "sales") {
      setLabel("Sales Module");
    }
  };

  return (
    <div className={classes["SignInSignUpbg"]}>
      <Form
        style={{
          padding: "0px 60px 16px 60px",
          boxShadow: "2px 2px 5px 2px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
        }}
        id="signInForm"
        className={classes["SignupFormbg"]}
      >
        {/* <img className={classes['SignInSignUpLogo']} src={signInSignUpLogo} alt="Logo" /> */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "1rem",
          }}
        >
          <img src={landingLogo} alt="Logo" />

          <Input
            placeholder="Enter User Code"
            value={userCode}
            onChange={userChange}
            style={{
              padding: "13.3px 63px 14px 24px",
              borderRadius: "50px",
              background: "transparent",
              width: "80%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "1.5",
              color: "#1777C4",
              WebkitAppearance: "none",
              WebkitBoxShadow:
                "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff",
              boxShadow: codeIsValid
                ? "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff"
                : "inset 3px 3px 6px #ff0000, inset -3px -3px 6px #ff0000",
              height: "40px",

              borderColor: codeIsValid ? "transparent" : "red",
              marginTop: "1rem", // Add margin top of 1rem
            }}
          />
        </div>

        <Form.Item
          style={{
            flex: 1,
            minWidth: 175,
            paddingRight: "4px",
            paddingLeft: "8px",
            marginTop: "1rem",
          }}
        >
          <Input.Password
            placeholder="Enter Password"
            value={password}
            onChange={passwordChange}
            style={{
              padding: "13.3px 63px 14px 24px",
              borderRadius: "50px",
              background: "transparent",
              width: "80%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "1.5",
              color: "#1777C4",
              WebkitAppearance: "none",
              WebkitBoxShadow:
                "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff",
              boxShadow: "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff",
              height: "40px",
              boxShadow: passwordValid
                ? "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff"
                : "inset 3px 3px 6px #ff0000, inset -3px -3px 6px #ff0000",
              borderColor: passwordValid ? "transparent" : "red",
              marginTop: "1rem", // Add margin top of 1rem
            }}
          />
          {!passwordValid && (
            <p style={{ color: "red" }}>Password is Required</p>
          )}
        </Form.Item>

        <Form.Item
          style={{
            flex: 1,
            minWidth: 175,
            paddingRight: "4px",
            paddingLeft: "8px",
            marginTop: "1rem",
          }}
        >
          <select
            value={company}
            onChange={(event) => companyChange(event.target.value)}
            style={{
              border: companyValid ? "" : "1px solid red",
              borderRadius: "50px",
              background: "transparent",
              width: "80%",
              height: "40px",
              padding: "0.5rem",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1777C4",
              boxShadow: companyValid
                ? "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff"
                : "inset 3px 3px 6px #ff0000, inset -3px -3px 6px #ff0000",
              borderColor: companyValid ? "transparent" : "red",
            }}
          >
            <option value="" disabled>
              Select Company Name
            </option>
            {props.companyType.map((option) => (
              <option
                key={option.company_code}
                value={option.company_name}
                style={{ textTransform: "capitalize" }}
              >
                {option.company_name}
              </option>
            ))}
          </select>
          {!companyValid && <p style={{ color: "red" }}>Company is Required</p>}
        </Form.Item>

        {/* <Form.Item
          style={{
            flex: 1,
            minWidth: 175,
            paddingRight: "4px",
            paddingLeft: "8px",
            marginTop: "1rem",
          }}
        >
          <Select
            placeholder="Select Site"
            style={{ border: companyValid ? "" : "red 1px solid" }}
            onChange={(value) => companyChange(value)}
          >
            {props.companyType.map((option) => {
              return (
                <Option
                  style={{ textTransform: "capitalize", color: "#1777C4" }}
                  key={option.company_code}
                  value={option.company_name}
                >
                  {option.company_name}{" "}
                </Option>
              );
            })}
          </Select>
          {!companyValid && <p style={{ color: "red" }}>year is Required</p>}
        </Form.Item> */}

        <Form.Item
          style={{
            flex: 1,
            minWidth: 175,
            paddingRight: "4px",
            paddingLeft: "8px",
            marginTop: "1rem", // Add position relative
          }}
        >
          {/* <Select
            placeholder="Select Module"
            onChange={(value) => typeHandler(value)}
            style={{
              display: "none", // Hide the input field
            }}
          >
            {props.userTypes.map((option) => (
              <Option
                key={option.module_id}
                value={option.module_name}
                style={{ textTransform: "capitalize" }}
              >
                {option.module_name}
              </Option>
            ))}
          </Select> */}

          <select
            value={usertype}
            onChange={(event) => typeHandler(event.target.value)}
            style={{
              border: typeValid ? "" : "1px solid red",
              borderRadius: "50px",
              background: "transparent",
              width: "80%",
              height: "40px",
              padding: "0.5rem",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1777C4",
              boxShadow: typeValid
                ? "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff"
                : "inset 3px 3px 6px #ff0000, inset -3px -3px 6px #ff0000",
              borderColor: typeValid ? "transparent" : "red",
            }}
          >
            <option value="" disabled>
              Select Module Name
            </option>
            {props.userTypes.map((option) => (
              <option
                key={option.module_id}
                value={option.module_name}
                style={{ textTransform: "capitalize" }}
              >
                {option.module_name}
              </option>
            ))}
          </select>
          {!typeValid && <p style={{ color: "red" }}>User type is Required</p>}
        </Form.Item>

        <Form.Item
          style={{
            flex: 1,
            minWidth: 175,
            paddingRight: "4px",
            paddingLeft: "8px",
            marginTop: "1rem",
            // Add position relative
          }}
        >
          <select
            value={finYear}
            onChange={(event) => finyearChange(event.target.value)}
            style={{
              border: yearValid ? "" : "1px solid red",
              borderRadius: "50px",
              background: "transparent",
              width: "80%",
              height: "40px",
              padding: "0.5rem",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1777C4",
              boxShadow: yearValid
                ? "inset 3px 3px 6px #bfc3cf, inset -3px -3px 6px #fff"
                : "inset 3px 3px 6px #ff0000, inset -3px -3px 6px #ff0000",
              borderColor: yearValid ? "transparent" : "red",
            }}
          >
            <option value="" disabled>
              Select Financial Year
            </option>
            {props.finYear.map((option) => (
              <option
                key={option.year_code}
                value={option.year_desc}
                style={{ textTransform: "capitalize" }}
              >
                {option.year_desc}
              </option>
            ))}
          </select>
          {!yearValid && <p style={{ color: "red" }}>Year is Required</p>}
        </Form.Item>

        <p></p>

        <Button
          onClick={(e) => submitHandler(e)}
          type="primary"
          htmlType="submit"
          form="signInForm"
          block
          style={{
            border: "none",
            borderRadius: "50px",
            background:
              "linear-gradient(179deg, rgba(13, 53, 148, 0.9) -102%, #35d3e1 162%)",
            width: "80%",
            height: "40px",
            padding: "0.5rem",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default SignIn;
