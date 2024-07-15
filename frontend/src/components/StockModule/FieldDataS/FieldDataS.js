import classes from "./FieldDataC.module.css";
import { Link, Route, Routes } from "react-router-dom";

import { useLocation } from "react-router-dom";
import OpeningDetails from "../OpeningBalance/OpeningDetails";
import OpeningNew from "../OpeningBalance/OpeningNew";
import OpeningView from "../OpeningBalance/OpeningView";
import RequisitionDetails from "../Requisition/RequisitionDetails";
import RequisitionNew from "../Requisition/RequisitionNew";
import RequisitionView from "../Requisition/RequisitionView";
import DailyIssueDetail from "../DailyIssue/DailyIssueDetail";
import DailyIssueNew from "../DailyIssue/DailyIssueNew";
import DailyIssueView from "../DailyIssue/DailyIssueView";
import StockAdjustment from "../StockAdjust/RequisitionDetails";
import StockAdjustNew from "../StockAdjust/RequisitionNew";
import StockAdjustView from "../StockAdjust/RequisitionView";
import DailyProduction from "../DailyProd/RequisitionDetails";
import DailyProductionNew from "../DailyProd/RequisitionNew";
import DailyProductionView from "../DailyProd/RequisitionView";
import PurchaseRequisationDetail from "../PurchaseRequisition/RequisitionDetails";
import PurchaseRequisationNew from "../PurchaseRequisition/RequisitionNew";
import PurchaseRequisationView from "../PurchaseRequisition/RequisitionView";
import PurchaseOrderDetail from "../PurchaseOrder/RequisitionDetails";
import PurchaseOrderNew from "../PurchaseOrder/RequisitionNew";
import PurchaseOrderView from "../PurchaseOrder/RequisitionView";

const FieldDataS = (fieldProps) => {
  const location = useLocation();

  console.log("Current path:", location.pathname);
  return (
    <div className={classes["Fields"]}>
      <Routes>
        <Route path="/dashboard" />

        <Route path="/invoices-register" />
        <Route path="/order-register" />
        <Route path="/pending-sales-register" />
        <Route path="/ledger" />
        <Route path="/itemMaster/item-details" />
        <Route path="/itemMaster/item-details-view/:id" />

        <Route path="/itemMaster/item-create" />

        <Route path="/customerMaster/customer-details" />

        <Route path="/customerMaster/customer-create" />

        <Route path="/customerMaster/customer-details-view/:id" />
        <Route path="/DealerMaster/dealer-details" />
        <Route path="/dealerMaster/dealer-create" />

        <Route path="/dealerMaster/dealer-form-view/:id" />
        <Route path="/chargedefMaster/charge-details" />

        <Route path="/misc/:id1" />

        <Route path="/norms/tax-details" />

        <Route path="/norms/tax-create" />

        <Route path="/norms/tax-form-view/:id" />

        <Route path="/accountmaster/account-details" />

        <Route path="/accountmaster/create-account" />
        <Route path="/accountmaster/acc-form-view/:id" />
        <Route path="/transaction/salesForm" />
        <Route path="/salescontract/create-sales-contract" />
        <Route path="/salescontract/contract-form-view/:id" />
        <Route path="/norms/gauge-detail" />

        <Route path="/norms/create-gauge" />
        <Route path="/norms/gauge-form-view/:id" />

        <Route path="/transaction/salesOrder" />
        <Route path="/transaction/sales-create" />
        <Route path="/transaction/salesOrder-form-view/:id" />

        <Route path="/transaction/salesOrder-form-vie/:id" />

        <Route path="/transaction/salesInvoice" />

        <Route path="/transaction/invoice-create" />
        <Route path="/transaction/salesInvoice-form-view/:id" />

        <Route path="/transaction/voucher" />
        <Route
          path="/transaction/opening-balance-create"
          element={<OpeningNew />}
        />
        <Route
          path="/transaction/opening-balance-view/:id"
          element={<OpeningView />}
        />
        <Route
          path="/transaction/opening-balance"
          element={<OpeningDetails />}
        />
        <Route
          path="/transaction/requisition"
          element={<RequisitionDetails />}
        />

        <Route
          path="/transaction/requisition-create"
          element={<RequisitionNew />}
        />
        <Route
          path="/transaction/requisition-view/:id"
          element={<RequisitionView />}
        />
        <Route path="/transaction/dailyIssue" element={<DailyIssueDetail />} />

        <Route
          path="/transaction/dailyIssue-create"
          element={<DailyIssueNew />}
        />
        <Route
          path="/transaction/dailyIssue-view/:id"
          element={<DailyIssueView />}
        />

        <Route path="/transaction/stock-adj" element={<StockAdjustment />} />

        <Route path="/transaction/stock-adj-new" element={<StockAdjustNew />} />
        <Route
          path="/transaction/stock-adj-view/:id"
          element={<StockAdjustView />}
        />

        <Route path="/transaction/daily-prod" element={<DailyProduction />} />

        <Route
          path="/transaction/daily-prod-new"
          element={<DailyProductionNew />}
        />
        <Route
          path="/transaction/daily_prod-view/:id"
          element={<DailyProductionView />}
        />

        <Route
          path="/transactions/purchase-indent"
          element={<PurchaseRequisationDetail />}
        />

        <Route
          path="/transaction/purchase-requisition-create"
          element={<PurchaseRequisationNew />}
        />

        <Route
          path="/transaction/purchase-indent-view/:id"
          element={<PurchaseRequisationView />}
        />
        <Route
          path="/transaction/purchase-order"
          element={<PurchaseOrderDetail />}
        />
        <Route
          path="/transaction/purchase-order-view/:id"
          element={<PurchaseOrderView />}
        />
        <Route
          path="/transaction/purchase-order-create"
          element={<PurchaseOrderNew />}
        />
      </Routes>
    </div>
  );
};

export default FieldDataS;
