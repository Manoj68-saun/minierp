import {Row, Col, Card} from 'antd';
import classes from './Dashboard.module.css';
import {FaHandsHelping, FaFileInvoice, FaReceipt} from 'react-icons/fa'
import {useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {GiSellCard} from 'react-icons/gi';
import DataContext from '../../../Context/dataContext';
const DataCards = (props) => {
    
   // console.log(props.employeeData.analysis)

   // console.log(employeeData.analysis)
   console.log(props.data)
    console.log(props.data.totalSalesOrder,'=====totalSalesOrder')
    return(
        <Row >
            <Col lg = {{span: 6, offset: 0}} md = {11} xs = {24} className = {classes['Col']}>
                <Card style = {{backgroundColor: "#A4CCE3", opacity: "0.9"}} bordered={false} className = {classes['Card']}>
                    <Row>
                        <Col md = {24} className = {classes['DataCol']}><div className = {classes['Data1']}>{props.data.totalSalesOrder!== null ? props.data.totalSalesOrder : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{fontWeight: "900"}}>Total Order</Col>
                        <Col md = {24} ><div className = {classes['Data1']} style = {{color: "white"}}>{props.data.totalQtyOfOrder!== null ? props.data.totalQtyOfOrder : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{color: "white", fontWeight: "900"}}>Total Quantity</Col>
                        <Col md = {24} className = {classes['DataCol']}><Link to = "/sales/order-register"><div className = {classes['Data2']}><FaHandsHelping /></div></Link></Col>
                    </Row>
                    {/* <Row>
                        <Col md = {12} className = {classes['DataCol']}><div className = {classes['Data1']}>12</div></Col>
                        <Col md = {12} ><div className = {classes['Data1']} style = {{color: "#79CBF3"}}>1.3</div></Col>
                    </Row>
                    <Row>
                        <Col md = {12} className = {classes['DataCol']} style = {{fontWeight: "500"}}>Pending</Col>
                        <Col md = {12} style = {{color: "#79CBF3", fontWeight: "500"}}>Avg. Rate</Col>
                    </Row> */}
                </Card>
            </Col>
            <Col lg = {{span: 6, offset: 0}} md = {11} xs = {24} className = {classes['Col']}>
                <Card style = {{backgroundColor: "#AAD9CD", opacity: "0.9"}} bordered={false} className = {classes['Card']}>
                    <Row>
                        <Col md = {24} className = {classes['DataCol']}><div className = {classes['Data1']}>{props.data.PendingSales1!== null ? props.data.PendingSales1 : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{fontWeight: "900"}}> Pending Sales</Col>
                        <Col md = {24} ><div className = {classes['Data1']} style = {{color: "white"}}>{props.data.PendingSalesQtys!== null ? props.data.PendingSalesQtys : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{color: "white", fontWeight: "900"}}>Pending Sales Qty</Col>
                        <Col md = {24} className = {classes['DataCol']}><Link to = "/sales/pending-sales-register"><div className = {classes['Data2']}><GiSellCard/></div></Link></Col>
                    </Row>   
                </Card>
            </Col>
            <Col lg = {{span: 6, offset: 0}} md = {11} xs = {24} className = {classes['Col']}>
                <Card style = {{backgroundColor: "#E7CBA9", opacity: "0.9"}} bordered={false} className = {classes['Card']}>
                    <Row>
                        <Col md = {24} className = {classes['DataCol']}><div className = {classes['Data1']}>{props.data.AllInvoices!== null ? props.data.AllInvoices : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{fontWeight: "900"}}>Total Invoice</Col>
                        <Col md = {24} ><div className = {classes['Data1']} style = {{color: "white"}}>{props.data.AllInvoiceQtys!== null ? props.data.AllInvoiceQtys : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{color: "white", fontWeight: "900"}}>Total Invoice Qty</Col>
                        <Col md = {24} className = {classes['DataCol']}><Link to = "/sales/invoices-register"><div className = {classes['Data2']}><FaFileInvoice /></div></Link></Col>
                    </Row>
                </Card>
            </Col>
            <Col lg = {{span: 6, offset: 0}} md = {11} xs = {24} className = {classes['Col']}>
                <Card style = {{backgroundColor: "#E9BBB5", opacity: "0.9"}} bordered={false} className = {classes['Card']}>
                    <Row>
                        <Col md = {24} className = {classes['DataCol']}><div className = {classes['Data1']}>{props.data.LedgerAmounts!== null ? props.data.LedgerAmounts : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{fontWeight: "900"}}>Ledger Balance</Col>
                        <Col md = {24} ><div className = {classes['Data1']} style = {{color: "white"}}>{props.data.LedgerAmountType!== null ? props.data.LedgerAmountType : null }</div></Col>
                        <Col md = {24} className = {classes['DataCol']} style = {{color: "white", fontWeight: "900"}}>Type</Col>
                        <Col md = {24} className = {classes['DataCol']}><Link to = "/sales/ledger"><div className = {classes['Data2']}><FaReceipt /></div></Link></Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
}

export default DataCards;