import React from "react";
import axios from "axios";

import { Scrollbars } from "react-custom-scrollbars-2";
import {
  LaptopOutlined,
  NotificationOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import classes from "./PayrollPageExtra.module.css";
// import "./PayrollPage.css";
import { Breadcrumb, Input, Layout, Menu, theme } from "antd";

import SiderContentS from "../../components/StockModule/SiderContentS/SiderContentS";

import { useEffect, useState } from "react";
import FieldDataS from "../../components/StockModule/FieldDataS/FieldDataS";

import { DataProvider } from "../../Context/dataContext";
import { Link, Route, Routes } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Item: MenuItem } = Menu;
const { Search } = Input;

const StockModule = (props) => {
  const [profiledata, setProfiledata] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [miscList, setMiscList] = useState(null);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const employeeData = {
    URL: props.url,
  };
  // console.log(employeeData.analysis);
  // useEffect(() => {
  //   axios
  //     .get(props.url + "/api/v1/salesMisc", { withCredentials: true })
  //     .then((response) => {
  //       console.log(response);
  //       setMiscList((miscList) => {
  //         const newList = response.data.data.tables.rows;
  //         console.log(newList);
  //         return newList;
  //       });
  //       axios
  //         .get(props.url + "/api/v1/dashboard/dash-board", {
  //           withCredentials: true,
  //         })
  //         .then((response) => {
  //           console.log(response);
  //           props.setAnalysis(response.data.data);
  //         });
  //     })

  //     .catch((err) => {
  //       console.log(err.response);
  //     });
  // }, []);
  // console.log(props.finyear);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "transparent" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{ backgroundColor: "transparent" }}
      >
        <SiderContentS url={props.url} miscList={miscList} />
      </Sider>

      <Layout className={classes["SiteLayout"]}>
        <Scrollbars>
          <DataProvider value={employeeData}>
            <Content>
              <FieldDataS />
            </Content>
          </DataProvider>
        </Scrollbars>
      </Layout>
    </Layout>
  );
};

export default StockModule;
