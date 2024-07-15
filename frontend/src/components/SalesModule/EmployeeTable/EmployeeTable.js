import classes from "./EmployeeTable.module.css";
import { Scrollbars } from "react-custom-scrollbars-2";

import Paper from "@material-ui/core/Paper";
import "./style.css";
import { StylesProvider, withStyles } from "@material-ui/core/styles";

import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider,
  GroupingState,
  IntegratedGrouping,
  SummaryState,
  IntegratedSummary,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel,
  TableColumnResizing,
  TableColumnReordering,
  DragDropProvider,
  TableGroupRow,
  TableSummaryRow,
} from "@devexpress/dx-react-grid-material-ui";
import { useState } from "react";
import { fade } from "@material-ui/core/styles/colorManipulator";
// import { useContext } from "react";
// import DataContext from "../../../Context/dataContext";

const styles = (theme) => ({
  tableStriped: {
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      zIndex: "-1000",
    },
    "& tbody tr:hover": {
      backgroundColor: "white",
      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
      color: "#1777C4",
    },
  },

  tableHead: {
    backgroundColor: "transparent",
  },

  tableContainer: {
    overflow: "visible",
  },

  headerCell: {
    color: "#355676ef",
    margin: "0.5rem 1rem",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    backgroundColor: "white",
    width: "17rem !important",

    "&:hover": {
      boxShadow: "-8px 8px 16px 0 rgba(0,0,0,0.2)",
    },
  },

  headerContent: {
    fontWeight: "bolder",
    padding: "0rem 1rem",
    lineHeight: "2rem",
    position: "sticky",
    top: "0",
    fontSize: "14px", // Adjust the font size as needed
    backgroundColor: "white", // Set the background color if needed
    zIndex: "100", // Set the z-index to ensure it stays above other elements
  },

  pagingContainer: {
    backgroundImage: "linear-gradient(to top, #dfe9f3 0%, white 100%)",
    backgroundColor: "white",
    boxShadow: "-8px 8px 16px 8px rgba(0,0,0,0.2)",
    position: "sticky",
    right: "0",
    bottom: "0",
    height: "3.7rem",
    color: "#355676ef",
    fontWeight: "900 !important",

    "&:hover": {
      boxShadow: "-8px 8px 16px 8px rgba(0,0,0,0.2)",
    },

    zIndex: "0",
  },

  groupContainer: {
    backgroundColor: "transparent !important",
    zIndex: "0",
    padding: "0px",
    margin: "0",
    overflow: "hidden",
  },

  groupCell: {
    // backgroundColor: "white",
    height: "fit-content",
    // boxShadow: "-8px 8px 16px 0 rgba(0,0,0,0.4)",
  },

  summRow: {
    backgroundColor: "white",
    boxShadow: "-8px 8px 16px 0 rgba(0,0,0,0.4)",
  },

  summInline: {
    // backgroundColor: "white",
    // boxShadow: "8px 8px 16px 0 rgba(0,0,0,0.4)",
  },

  groupRow: {
    boxShadow: "8px 8px 16px 0 rgba(0,0,0,0.1)",
  },
});

const CurrencyFormatter = ({ value }) => (
  <b className={classes["Cell"]}>{value}</b>
);

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped}></Table.Table>
);

const HeadComponentBase = ({ classes, ...restProps }) => (
  <Table.TableHead
    {...restProps}
    className={classes.tableHead}
  ></Table.TableHead>
);

const ContainerComponentBase = ({ classes, ...restProps }) => (
  <Table.Container
    {...restProps}
    className={classes.tableContainer}
  ></Table.Container>
);

const CellComponentBase = ({ classes, ...restProps }) => (
  <TableHeaderRow.Cell
    {...restProps}
    className={classes.headerCell}
  ></TableHeaderRow.Cell>
);

const ContentComponentBase = ({ classes, ...restProps }) => (
  <TableHeaderRow.Content
    {...restProps}
    className={classes.headerContent}
  ></TableHeaderRow.Content>
);

const PagingContainerBase = ({ classes, ...restProps }) => (
  <PagingPanel.Container
    {...restProps}
    className={classes.pagingContainer}
  ></PagingPanel.Container>
);

const GroupRowContainerBase = ({ classes, ...restProps }) => (
  <TableGroupRow.Container
    {...restProps}
    className={classes.groupContainer}
  ></TableGroupRow.Container>
);

const GroupCellBase = ({ classes, ...restProps }) => (
  <TableGroupRow.Cell
    {...restProps}
    className={classes.groupCell}
  ></TableGroupRow.Cell>
);

const SummaryRowBase = ({ classes, ...restProps }) => (
  <TableSummaryRow.TotalRow
    {...restProps}
    className={classes.summRow}
  ></TableSummaryRow.TotalRow>
);

const InlineSummaryBase = ({ classes, ...restProps }) => (
  <TableGroupRow.SummaryCell
    {...restProps}
    className={classes.summInline}
  ></TableGroupRow.SummaryCell>
);

const RowComponentBase = ({ classes, ...restProps }) => (
  <TableGroupRow.Row
    {...restProps}
    className={classes.groupRow}
  ></TableGroupRow.Row>
);

export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);
export const HeadComponent = withStyles(styles, { name: "HeadComponent" })(
  HeadComponentBase
);
export const ContainerComponent = withStyles(styles, {
  name: "ContainerComponent",
})(ContainerComponentBase);
export const CellComponent = withStyles(styles, { name: "CellComponent" })(
  CellComponentBase
);
export const ContentComponent = withStyles(styles, {
  name: "ContentComponent",
})(ContentComponentBase);
export const PagingContainer = withStyles(styles, { name: "PagingContainer" })(
  PagingContainerBase
);
export const GroupRowContainer = withStyles(styles, {
  name: "GroupRowContainer",
})(GroupRowContainerBase);
export const GroupCell = withStyles(styles, { name: "GroupCell" })(
  GroupCellBase
);
export const SummaryRow = withStyles(styles, { name: "SummaryRow" })(
  SummaryRowBase
);
export const InlineSummary = withStyles(styles, { name: "InlineSummary" })(
  InlineSummaryBase
);
export const RowComponent = withStyles(styles, { name: "RowComponent" })(
  RowComponentBase
);

const TableRenderer = (props) => {
  //   const customerData = useContext(DataContext);
  const [columns] = useState(props.columns);
  const [tableColumnExtensions] = useState([]);
  const [rows, setRows] = useState(props.data);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(rows.length > 10 ? 10 : 0);
  const [pageSizes] = useState(
    rows.length > 100
      ? [10, 50, 100, 0]
      : rows.length > 50
      ? [10, 50, 0]
      : rows.length > 10
      ? [10, 0]
      : [0]
  );
  const getRowId = (row) => row.id;
  const [defaultColumnWidths] = useState(
    props.columns.map((col) => {
      if (col.name === "D" || col.name === "E" || col.name === "V")
        return { columnName: col.name, width: 60 };
      else if (col.name === "SNO") return { columnName: col.name, width: 110 };
      else if (col.name === "ATTEND_CODE" || col.name === "EMP_CODE")
        return { columnName: col.name, width: 0 };
      else return { columnName: col.name, width: 180 };
    })
  );
  const [currencyColumns] = useState(
    props.columns.map((col) => {
      return col.name;
    })
  );
  const [leaveColumns] = useState(["LEAVE_TYPE", "LEAVE_TYPE2"]);
  const [periodColumns] = useState(["LEAVE_PERIOD", "LEAVE_PERIOD2"]);
  const [columnOrder, setColumnOrder] = useState(
    props.columns.map((col) => {
      return col.name;
    })
  );
  const [filters, setFilters] = useState([]);
  const [grouping, setGrouping] = useState([]);
  const [totalSummaryItems] = useState([]);
  const [groupSummaryItems] = useState([]);

  const LeaveFormatter = ({ value }) => {
    const findIndex = props.leaveTypes.rows.findIndex(
      (element) => element.LEAVETYPE_CODE === value
    );
    return (
      <b className={classes["Cell"]}>
        {findIndex === -1
          ? null
          : props.leaveTypes.rows[findIndex]["LEAVETYPE_DESC"]}
      </b>
    );
  };

  const LeaveTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={LeaveFormatter} {...props} />
  );

  const PeriodFormatter = ({ value }) => {
    const findIndex = props.periodList.rows.findIndex(
      (element) => element.KEY === value
    );
    return (
      <b className={classes["Cell"]}>
        {findIndex === -1 ? null : props.periodList.rows[findIndex]["VALUE"]}
      </b>
    );
  };

  const PeriodTypeProvider = (props) => (
    <DataTypeProvider formatterComponent={PeriodFormatter} {...props} />
  );

  return (
    <>
      <StylesProvider injectFirst>
        <div className={classes["TableView"]} id="styledTable">
          <Paper square elevation={0} className={classes["Paper"]}>
            <Scrollbars
              autoHeight
              autoHeightMax={
                props.val
                  ? window.innerHeight * 0.75
                  : window.innerHeight * 0.65
              }
            >
              <Grid
                rows={rows}
                columns={columns}
                // getRowId={getRowId}
                getRowId={getRowId}
              >
                <CurrencyTypeProvider for={currencyColumns} />

                <LeaveTypeProvider for={leaveColumns} />

                <PeriodTypeProvider for={periodColumns} />

                <DragDropProvider />
                <SortingState defaultSorting={[]} />
                <FilteringState
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                <SummaryState
                  totalItems={totalSummaryItems}
                  groupItems={groupSummaryItems}
                />
                <GroupingState
                  grouping={grouping}
                  onGroupingChange={setGrouping}
                />
                <PagingState
                  currentPage={currentPage}
                  onCurrentPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
                <IntegratedGrouping />
                <IntegratedSummary />
                <IntegratedFiltering />
                <IntegratedSorting />
                <IntegratedPaging />

                <Table
                  columnExtensions={tableColumnExtensions}
                  tableComponent={TableComponent}
                  headComponent={HeadComponent}
                  containerComponent={ContainerComponent}
                />
                <TableColumnResizing
                  defaultColumnWidths={defaultColumnWidths}
                />
                <TableHeaderRow
                  showSortingControls
                  cellComponent={CellComponent}
                  contentComponent={ContentComponent}
                />
                <TableGroupRow
                  showColumnsWhenGrouped={true}
                  rowComponent={RowComponent}
                  summaryCellComponent={InlineSummary}
                  cellComponent={GroupCell}
                  containerComponent={GroupRowContainer}
                />
                <TableFilterRow />

                <PagingPanel
                  pageSizes={pageSizes}
                  containerComponent={PagingContainer}
                />
                <TableSummaryRow totalRowComponent={SummaryRow} />
                <TableColumnReordering
                  order={columnOrder}
                  onOrderChange={setColumnOrder}
                />
              </Grid>
            </Scrollbars>
          </Paper>
        </div>
      </StylesProvider>
    </>
  );
};

export default TableRenderer;
