import classes from "./FieldDataC.module.css";
import { Link, Route, Routes } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import ItemDetails from "../ItemMaster/ItemDetails";
import ItemNew from "../ItemMaster/ItemNew";
import ItemView from "../ItemMaster/ItemView";
// import SalesCFormView from '../Transaction/SalesCFormView';
// import SalesCForm from '../Transaction/SalesCForm';
// import SalesCFormCreate from '../Transaction/SalesCFormCreate';
import CustomerDetails from "../CustomerMaster/CustomerDetails";
import CustomerNew from "../CustomerMaster/CustomerNew";
import CustomerView from "../CustomerMaster/CustomerView";
// import DealerDetails from '../DealerMaster/DealerDetails';
// import DealerNew from '../DealerMaster/DealerNew';
// import DealerView from '../DealerMaster/DealerView';
// import Charge from '../ChargeDefMaster/Charge';
// import ChargeCreate from '../ChargeDefMaster/ChargeCreate';
// import ChargeView from '../ChargeDefMaster/ChargeView';
import SalesDetails from "../SalesOrder/SalesDetails";
import SalesNew from "../SalesOrder/SalesNew";
import SalesView from "../SalesOrder/SalesView";
import SalesVieww from "../SalesOrder/SalesVieww";
import InvoiceDetail from "../SalesInvoice/InvoiceDetail";
import InvoiceNew from "../SalesInvoice/InvoiceNew";
import InvoiceView from "../SalesInvoice/InvoiceView";
import ChargeDetail from "../ChargeDef/ChargeDetail";
import Misc from "../Misc/Misc";
import TaxDetails from "../itemWiseTax/TaxDetails";
import TaxNew from "../itemWiseTax/TaxNew";
import TaxView from "../itemWiseTax/TaxView";
import AccountDetail from "../AccountMaster/AccountDetail";
import AccountNew from "../AccountMaster/AccountNew";
import AccMasterView from "../AccountMaster/AccMasterView";
import GaugeDetail from "../GaugePolicy/GaugeDetail";
import GaugeNew from "../GaugePolicy/GaugeNew";
import GaugeView from "../GaugePolicy/GaugeView";

import ContractDetail from "../SalesContract/ContractDetail";
import ContractNew from "../SalesContract/ContractNew";
import SalesContractView from "../SalesContract/SalesContractView";
import VoucherDetails from "../Vouchers/VoucherDetails";
import VoucherNew from "../Vouchers/VoucherNew";
import VoucherView from "../Vouchers/VoucherView";

import InvoiceRegister from "../Register/InvoiceRegister";
import DealerDetail from "../DealerMaster/DealerDetail";
import DealerNew from "../DealerMaster/DealerNew";
import DealerView from "../DealerMaster/DealerView";
import SaleOrderRegister from "../Register/SaleOrderRegister";
import PendingSalesRegister from "../Register/PendingSalesRegister";
import LedgerRegister from "../Register/LedgerRegister";
import { useLocation } from "react-router-dom";
const FieldDataS = (fieldProps) => {
  const location = useLocation();

  console.log("Current path:", location.pathname);
  return (
    <div className={classes["Fields"]}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/invoices-register" element={<InvoiceRegister />} />
        <Route path="/order-register" element={<SaleOrderRegister />} />
        <Route
          path="/pending-sales-register"
          element={<PendingSalesRegister />}
        />
        <Route path="/ledger" element={<LedgerRegister />} />
        <Route path="/itemMaster/item-details" element={<ItemDetails />} />
        <Route
          path="/itemMaster/item-details-view/:id"
          element={<ItemView />}
        />

        <Route path="/itemMaster/item-create" element={<ItemNew />} />

        <Route
          path="/customerMaster/customer-details"
          element={<CustomerDetails />}
        />

        <Route
          path="/customerMaster/customer-create"
          element={<CustomerNew />}
        />

        <Route
          path="/customerMaster/customer-details-view/:id"
          element={<CustomerView />}
        />
        <Route path="/DealerMaster/dealer-details" element={<DealerDetail />} />
        <Route path="/dealerMaster/dealer-create" element={<DealerNew />} />

        <Route
          path="/dealerMaster/dealer-form-view/:id"
          element={<DealerView />}
        />
        <Route
          path="/chargedefMaster/charge-details"
          element={<ChargeDetail />}
        />

        <Route path="/misc/:id1" element={<Misc />} />

        <Route path="/norms/tax-details" element={<TaxDetails />} />

        <Route path="/norms/tax-create" element={<TaxNew />} />

        <Route path="/norms/tax-form-view/:id" element={<TaxView />} />

        <Route
          path="/accountmaster/account-details"
          element={<AccountDetail />}
        />

        <Route path="/accountmaster/create-account" element={<AccountNew />} />
        <Route
          path="/accountmaster/acc-form-view/:id"
          element={<AccMasterView />}
        />
        <Route path="/transaction/salesForm" element={<ContractDetail />} />
        <Route
          path="/salescontract/create-sales-contract"
          element={<ContractNew />}
        />
        <Route
          path="/salescontract/contract-form-view/:id"
          element={<SalesContractView />}
        />
        <Route path="/norms/gauge-detail" element={<GaugeDetail />} />

        <Route path="/norms/create-gauge" element={<GaugeNew />} />
        <Route path="/norms/gauge-form-view/:id" element={<GaugeView />} />

        <Route path="/transaction/salesOrder" element={<SalesDetails />} />
        <Route path="/transaction/sales-create" element={<SalesNew />} />
        <Route
          path="/transaction/salesOrder-form-view/:id"
          element={<SalesView />}
        />

        <Route
          path="/transaction/salesOrder-form-vie/:id"
          element={<SalesVieww />}
        />

        <Route path="/transaction/salesInvoice" element={<InvoiceDetail />} />

        <Route path="/transaction/invoice-create" element={<InvoiceNew />} />
        <Route
          path="/transaction/salesInvoice-form-view/:id"
          element={<InvoiceView />}
        />

        <Route path="/transaction/voucher" element={<VoucherDetails />} />
        <Route path="/transaction/Voucher-create" element={<VoucherNew />} />
        <Route
          path="/transaction/voucher-form-view/:id"
          element={<VoucherView />}
        />
      </Routes>
    </div>
  );
};

export default FieldDataS;
