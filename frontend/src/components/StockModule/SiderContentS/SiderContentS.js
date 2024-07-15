import classes from "./SiderContentC.module.css";
import { Menu, message } from "antd";
import {
  FaSignOutAlt,
  FaFileInvoice,
  FaReceipt,
  FaHandsHelping,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import signInSignUpLogo from "../../../assets/signInSignUp.png";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { GiSellCard } from "react-icons/gi";
import { GiBuyCard } from "react-icons/gi";
import { AiOutlineDownSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdWatchLater, MdAssignmentTurnedIn } from "react-icons/md";
import { BsFillGrid3X3GapFill, BsFillPeopleFill } from "react-icons/bs";
import { AiFillFileMarkdown, AiFillPropertySafety } from "react-icons/ai";
import { GiRuleBook } from "react-icons/gi";
import { AiTwotoneRest, AiOutlineTeam } from "react-icons/ai";

const { SubMenu } = Menu;

const SiderContentS = (props) => {
  const history = useNavigate();

  const handleLogout = (event) => {
    axios
      .get(props.url + "/api/v1/users/logout", {
        withCredentials: true,
      })
      .then((response) => {
        message.success({
          content: "Goodbye!!!! See You Again!!!",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        history("/employee");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <img
        className={classes["SignInSignUpLogo"]}
        src={signInSignUpLogo}
        alt="Logo"
      />
      <Menu
        mode="inline"
        defaultSelectedKeys={["empDashboard"]}
        // defaultOpenKeys={["misc"]}
        style={{
          height: "100%",
          borderRight: 0,
          overflowY: "auto",
        }}
        theme="light"
      >
        <Menu.Item key="empDashboard" icon={<MdDashboard />}>
          <Link to="/sales/dashboard" style={{ textDecoration: "none" }}>
            Dashboard
          </Link>
        </Menu.Item>
        <Menu.Item key="custInvoices" icon={<FaFileInvoice />}>
          <Link
            to="/sales/invoices-register"
            style={{ textDecoration: "none" }}
          >
            Invoices Register
          </Link>
        </Menu.Item>

        <Menu.Item key="custOrder" icon={<FaHandsHelping />}>
          <Link to="/sales/order-register" style={{ textDecoration: "none" }}>
            Order Register
          </Link>
        </Menu.Item>

        <Menu.Item key="custPendingSales" icon={<GiSellCard />}>
          <Link
            to="/sales/pending-sales-register"
            style={{ textDecoration: "none" }}
          >
            Pending Sales Register
          </Link>
        </Menu.Item>

        <Menu.Item key="custledger" icon={<FaReceipt />}>
          <Link to="/sales/ledger" style={{ textDecoration: "none" }}>
            Ledger
          </Link>
        </Menu.Item>

        <SubMenu key="Masters" title="Masters" icon={<AiTwotoneRest />}>
          <Menu.Item key="itemMaster">
            <Link
              to="/sales/itemMaster/item-details"
              style={{ textDecoration: "none" }}
            >
              Item Master
            </Link>
          </Menu.Item>
          <Menu.Item key="customerMaster">
            <Link
              to="/sales/customerMaster/customer-details"
              style={{ textDecoration: "none" }}
            >
              Customer Master
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="categoryDetail">   
                    <NavLink to = '/sales/categoryDetail/category-Details'>
                        Category Detail
                    </NavLink>
                </Menu.Item> */}
          <Menu.Item key="DealerMaster">
            <Link
              to="/sales/DealerMaster/dealer-details"
              style={{ textDecoration: "none" }}
            >
              Dealer Master
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="chargedefMaster">   
                <NavLink to = '/sales/chargedefMaster/charge-details'>
                    Chargedef Master
                </NavLink>
            </Menu.Item> */}
          <Menu.Item key="accountmaster">
            <Link
              to="/sales/accountmaster/account-details"
              style={{ textDecoration: "none" }}
            >
              Account Master
            </Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="norms" title="Norms" icon={<GiRuleBook />}>
          {/* <Menu.Item key="DiscountNorms" >
                        <NavLink to = '/sales/norms/leave-norms'>
                            Discount Norms
                        </NavLink>
                    </Menu.Item> */}
          <Menu.Item key="GaugeNorms">
            <Link
              to="/sales/norms/gauge-detail"
              style={{ textDecoration: "none" }}
            >
              Gauge Policy
            </Link>
          </Menu.Item>
          <Menu.Item key="itemWiseTax">
            <Link
              to="/sales/norms/tax-details"
              style={{ textDecoration: "none" }}
            >
              Item Wise Tax
            </Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="transactions"
          title="Transactions"
          icon={<MdAssignmentTurnedIn />}
        >
          <Menu.Item key="Salesformorder">
            <Link
              to="/stock/transaction/purchase-order"
              style={{ textDecoration: "none" }}
            >
              Purchase Order
            </Link>
          </Menu.Item>
          <Menu.Item key="Salesform">
            <Link
              to="/stock/transaction/opening-balance"
              style={{ textDecoration: "none" }}
            >
              Opening Balance
            </Link>
          </Menu.Item>
          <Menu.Item key="requisition">
            <Link
              to="/stock/transaction/requisition"
              style={{ textDecoration: "none" }}
            >
              Store Requisition
            </Link>
          </Menu.Item>
          <Menu.Item key="dailyIssue">
            <Link
              to="/stock/transaction/dailyIssue"
              style={{ textDecoration: "none" }}
            >
              Daily Consumption Store
            </Link>
          </Menu.Item>
          <Menu.Item key="StockAdjustment">
            <Link
              to="/stock/transaction/stock-adj"
              style={{ textDecoration: "none" }}
            >
              Stock Adjustment
            </Link>
          </Menu.Item>
          <Menu.Item key="purchaseIndent">
            <Link
              to="/stock/transactions/purchase-indent"
              style={{ textDecoration: "none" }}
            >
              Purchase Indent
            </Link>
          </Menu.Item>
          <Menu.Item key="dailyProd">
            <Link
              to="/stock/transaction/daily-prod"
              style={{ textDecoration: "none" }}
            >
              Daily Production
            </Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="misc"
          title="Miscelleneous"
          icon={<BsFillGrid3X3GapFill />}
        >
          {props.miscList && props.miscList.length > 0 ? (
            <>
              {props.miscList.map((misc) => {
                return (
                  <Menu.Item key={misc.table_code}>
                    <Link
                      to={"/sales/misc/" + misc.slug}
                      style={{ textDecoration: "none" }}
                    >
                      {misc.form_name}
                    </Link>
                  </Menu.Item>
                );
              })}
            </>
          ) : null}
        </SubMenu>

        <Menu.Item
          key="empLogout"
          onClick={(event) => handleLogout(event)}
          icon={<FaSignOutAlt style={{ color: "red", opacity: "0.7" }} />}
        >
          <Link to="/customer-portal" style={{ textDecoration: "none" }}>
            Logout
          </Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default SiderContentS;
