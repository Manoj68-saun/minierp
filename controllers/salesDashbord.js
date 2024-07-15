const { Client } = require("pg");
const fs = require("fs");
const wrapper = require("../utils/wrapper");
const { query } = require("express");

exports.getDashboard = wrapper(async (req, res, next) => {
  console.log("manoj");
  const client = req.dbConnection;
  const allSalesOrder = await client.query(
    `select count(*) from sl_trans_booking_hdr where marked is null`
  );
  const totalSalesOrder = allSalesOrder.rows[0].count;

  const totalQty = await client.query(
    `select sum(qty) from sl_trans_booking_size_detail where marked is null`
  );
  const totalQtyOfOrder = totalQty.rows[0].sum;

  const customerWithSale = await client.query(`select sum(total_qty)quantity,
  get_distributor(distributor_code) from sl_trans_invoice_hdr where marked is null group by distributor_code
  order BY sum(total_qty) DESC 
  LIMIT 5;`);

  const userColors = ["#ff0000", "#00ff00", "#0000ff", "#9FE2BF", "#FF7F50"];
  const randomColor = () => {
    return userColors[Math.floor(Math.random() * userColors.length)];
  };

  // const customerWithSale = data.map((customer) => ({
  // ...customer,
  //   color: randomColor()
  // }));

  const data = customerWithSale.rows.map((row) => ({
    ...row,
    quantity: parseFloat(row.quantity),
    color: randomColor(),
  }));
  // console.log(data,  "afterconvert ooooonummmmmmber")
  //how assign for each let userColors = ['#ff0000', '#00ff00', '#0000ff', '#9FE2BF', '#FF7F50']; in data
  const itemQty =
    await client.query(`select get_item(item_code)item , sum(qty)qty from sl_trans_inv_size_detail where marked is null 
    group by item_code`);
  const itemQtyOfOrder = itemQty.rows.map((row) => ({
    ...row,

    qty: parseFloat(row.qty),
  }));

  const AllInvoice = await client.query(
    `select count(*) from sl_trans_invoice_hdr where marked is null`
  );
  const AllInvoices = AllInvoice.rows[0].count;

  const AllInvoiceQty = await client.query(
    `select sum(qty)qty1 from sl_trans_inv_size_detail where marked is null`
  );

  const AllInvoiceQtys = AllInvoiceQty.rows[0].qty1;
  console.log(AllInvoiceQtys, "AllInvoiceQtys");
  const PendingSales = await client.query(`select count(*) from 
    (SELECT h.booking_code,
        sum(d.qty) AS order_qty,
        sum(si.inv_qty) AS invoice_qty,
        COALESCE(sum(d.qty), 0::numeric) - COALESCE(sum(si.inv_qty), 0::numeric) AS balance_qty,
        h.booking_status
       FROM sl_trans_booking_size_detail d,
        sl_trans_booking_hdr h
        left JOIN ( SELECT idt.booking_no,
                ih.unit_code,
                sum(idt.qty) AS inv_qty
               FROM sl_trans_invoice_hdr ih,
                sl_trans_inv_size_detail idt
              WHERE ih.marked IS NULL AND idt.marked IS NULL AND ih.invoice_no::text = idt.invoice_no::text
              GROUP BY idt.booking_no, ih.unit_code) si ON si.booking_no::text = h.booking_code::text
      WHERE d.booking_code::text = h.booking_code::text AND h.booking_status IS NULL AND h.marked IS NULL AND d.marked IS NULL 
      group by h.booking_code) as t 
      `);
  const PendingSales1 = PendingSales.rows[0].count;
  console.log(PendingSales1, "AllInvoiceQtys1");
  const PendingSalesQty = await client.query(` select sum(balance_qty) from
         (SELECT h.booking_code,
           sum(d.qty) AS order_qty,
           sum(si.inv_qty) AS invoice_qty,
           COALESCE(sum(d.qty), 0::numeric) - COALESCE(sum(si.inv_qty), 0::numeric) AS balance_qty,
           h.booking_status
          FROM sl_trans_booking_size_detail d,
           sl_trans_booking_hdr h
           left JOIN ( SELECT idt.booking_no,
                   ih.unit_code,
                   sum(idt.qty) AS inv_qty
                  FROM sl_trans_invoice_hdr ih,
                   sl_trans_inv_size_detail idt
                 WHERE ih.marked IS NULL AND idt.marked IS NULL AND ih.invoice_no::text = idt.invoice_no::text
                 GROUP BY idt.booking_no, ih.unit_code) si ON si.booking_no::text = h.booking_code::text
         WHERE d.booking_code::text = h.booking_code::text AND h.booking_status IS NULL AND h.marked IS NULL AND d.marked IS NULL 
         group by h.booking_code) as t `);
  const PendingSalesQtys = PendingSalesQty.rows[0].sum;
  console.log(PendingSalesQtys, "AllInvoiceQtys2");
  const LedgerAmount = await client.query(`SELECT
    sum(amt) AS amount,
    CASE
        WHEN COALESCE(sum(amt), 0) < 0 THEN 'Dr'
        WHEN COALESCE(sum(amt), 0) >= 0 THEN 'Cr'
    END AS TYPE
FROM (
    SELECT
        d.distributor_code,
        d.distributor_name,
        d.account_code AS ACC_CODE,
        (
            SELECT COALESCE(SUM(ROUND(D_TOT_AMT)), 0) - COALESCE(SUM(ROUND(C_TOT_AMT)), 0) AS amount
            FROM (
                SELECT
                    CASE l.entry_type
                        WHEN 'Credit' THEN l.amount * -1
                        ELSE l.amount
                    END AS C_TOT_AMT,
                    CASE l.entry_type
                        WHEN 'Debit' THEN l.amount * -1
                        ELSE l.amount
                    END AS D_TOT_AMT
                FROM
                    FIN_MST_T_VOUCHER_HDR f
                    JOIN FIN_MST_T_VOUCHER_DET l ON (f.voucher_code = l.voucher_code)
                WHERE
                    f.marked IS NULL
                    AND l.marked IS NULL
                  AND (f.voucher_date::date + COALESCE(CAST(l.no_days AS INTEGER), 0)) <= CURRENT_DATE
                    AND (l.account_code = d.account_code)
            ) AS y
        ) AS amt
    FROM
        sl_mst_distributor d
    WHERE
        d.marked IS NULL
) AS T`);
  const LedgerAmounts = LedgerAmount.rows[0].amount;
  console.log(LedgerAmounts, "AllInvoiceQtys3");
  let LedgerAmountType = LedgerAmount.rows[0].type;
  if (LedgerAmountType === "Dr") {
    LedgerAmountType = "Debit";
  } else {
    LedgerAmountType = "Credit";
  }
  // console.log(itemQtyOfOrder, "itemQtyOfOrder")
  //   console.log(customerWithSale)
  // customerWithSale.rows.forEach(customer => {
  //   customer.total_qty = customer.quantity;
  //   customer.distributor_name = customer.distributor_code;
  // });
  // const topCustomerWithSale = customerWithSale.rows;
  // res.status(200).json({
  //   status:'success',
  //   data: {
  //     totalSalesOrder,
  //     totalQtyOfOrder,
  //     topCustomerWithSale
  //     },
  //   });

  res.status(200).json({
    status: "success",
    data: {
      totalSalesOrder,
      totalQtyOfOrder,
      customerWithSale,
      data,
      itemQtyOfOrder,
      AllInvoices,
      AllInvoiceQtys,
      PendingSales1,
      PendingSalesQtys,
      LedgerAmounts,
      LedgerAmountType,
    },
  });
});
