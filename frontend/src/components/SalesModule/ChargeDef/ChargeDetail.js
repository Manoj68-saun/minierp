import {Row,Col,Skeleton,  message, Tooltip, Modal, Button} from 'antd'
import axios from 'axios';
import classes from '../Pages.module.css';
import { useState, useEffect, useContext} from 'react';
import DataContext from '../../../Context/dataContext';
import EmployeTable from '../EmployeeTable/EmployeeTable';
import EmployeeTable from '../EmployeeTable/EmployeeTable';
import Basic from './Basic';
import { AiFillDelete} from 'react-icons/ai';
import {RiUserSearchFill} from 'react-icons/ri'
import { Link } from 'react-router-dom';

const ChargeDetail = (props) => {
    const employeeData = useContext(DataContext)
    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState(null)
    const [drows, setDRows] = useState(null)
    const [ad, setAD] = useState(null)
    const [form, setForm] = useState({
        CHARGE_CATEGRY_DESC: null,
       
    })

    useEffect(() => {

        setDRows(null)
        setRows(null)
        setColumns([])
        setAD(null)
        axios
            .get(employeeData.URL + '/api/v1/salesOrderm',{
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                setColumns((columns) => {
                    let newCols =  response.data.data.category.fields.map((col) => {
                        return({
                            name: col.name,
                            title: col.name.split("_").join(" ").toLowerCase()
                        });
                    })

                    const newNewCols = [{name: "D", title: "D"}, {name: "V", title: "V"}, {name: "SNO", title: "SNo"}, ...newCols]
                    return newNewCols;
                })

                setRows(rows => {
                    let newRows = response.data.data.category.rows.map((row,index) => {return(
                        {
                            "D": <Tooltip placement="bottom" title = "Delete" color = "red">
                                    <Link  to = "#" style = {{color: "red", fontWeight: "bolder"}} >
                                        <AiFillDelete  onClick = {(event) => deleteHandler(event,index,response.data.data.category.rows,row['CHARGE_CATEGORY_CODE'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem"}}/>
                                    </Link>
                                </Tooltip>,
                            "V": <Tooltip placement="bottom" title = "View" color = "#1777C4">
                                <Link  to = { "/sales/transaction/salesOrder-form-view/" + row['CHARGE_CATEGORY_CODE']} style = {{color: "#1777C4", fontWeight: "bolder"}} >
                                    <RiUserSearchFill  style = {{color: "#1777C4", fontWeight: "bolder", fontSize : "0.9rem"}}/>
                                </Link>
                                 </Tooltip>,
                            
                            "SNO": index + 1,
                            ...row
                        }
                    );})
                    return newRows;
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const handleSave = (event) => {

        const postData = {
            CHARGE_CATEGRY_DESC: form.CHARGE_CATEGRY_DESC ? form.CHARGE_CATEGRY_DESC : '',
            
        }
    }
    const deleteHandler = (event,index,newrows,code) => {
        console.log(index);
        console.log(code);
        
        setRows(null)
        axios
            .delete(employeeData.URL + '/api/v1/salesOrder/' + code.toString(),{
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                    const rowvals = newrows.filter(row => row['booking_code'] !== code)
                    setRows( rows => {
                        let newDRows = rowvals.map((row,index) => {return(
                            {
                                "D": <Tooltip placement="bottom" title = "Delete" color = "red">
                                        <Link  to = "#" style = {{color: "red", fontWeight: "bolder"}} >
                                            <AiFillDelete  onClick = {(event) => deleteHandler(event,index,rowvals,row['booking_code'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem"}}/>
                                        </Link>
                                    </Tooltip>,
                                "V": <Tooltip placement="bottom" title = "View" color = "#1777C4">
                                    <Link  to = {"/sales/transaction/salesOrder-form-view/" + row['booking_code']} style = {{color: "#1777C4", fontWeight: "bolder"}} >
                                        <RiUserSearchFill  style = {{color: "#1777C4", fontWeight: "bolder", fontSize : "0.9rem"}}/>
                                    </Link>
                                    </Tooltip>,
                                   
                                "SNO": index + 1,
                                ...row
                            }
                        );})
                        return newDRows;
                    })
            })
            .catch(error => {
                setRows( rows => {
                    let newDRows = newrows.map((row,index) => {return(
                        {
                            "D": <Tooltip placement="bottom" title = "Delete" color = "red">
                                    <Link  to = "#" style = {{color: "red", fontWeight: "bolder"}} >
                                        <AiFillDelete  onClick = {(event) => deleteHandler(event,index,newrows,row['booking_code'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem"}}/>
                                    </Link>
                                </Tooltip>,
                            "V": <Tooltip placement="bottom" title = "View" color = "#1777C4">
                                <Link  to = { "/sales/transaction/salesOrder-form-view/" + row['booking_code']} style = {{color: "#1777C4", fontWeight: "bolder"}} >
                                    <RiUserSearchFill  style = {{color: "#1777C4", fontWeight: "bolder", fontSize : "0.9rem"}}/>
                                </Link>
                                </Tooltip>,
                          
                            "SNO": index + 1,
                            ...row
                        }
                    );})
                    return newDRows;
                })
                console.log(error);
            })
    }

   

    return(
        <>  
                
            {/* <Row className = {classes['Row']}>
                <Col md = {14}><p className = {classes['Title']}>Sales Order Details</p></Col>
                <Col className = {classes['Col']} md = {10}>
                  
                </Col>
            </Row>
            <p></p>
            <Row className = {classes['Row']}>
                <Col lg = {19} md = {17}>
                    
                </Col>
                <Col className = {classes['Col']} lg = {5} md = {7}>
                    <Link to = '/sales/transaction/sales-create'><button className = {classes['ProfileButton']}>Add Sales Order</button></Link>
                </Col>
            </Row> */}
            <Row className = {classes['Row']}>
                <Col md = {14}><p className = {classes['Title']}>Leave Entry</p></Col>
                <Col className = {classes['Col']} md = {10}>
                  
                </Col>
                <Col className = {classes['Col']} md = {24}>
                  
                </Col>
            </Row>
        
            {
               // form && ad
                
                
                form 
                ?
                <Basic ad = {ad} form = {form} setForm = {setForm} handleSave = {handleSave}/>
                :
                <>
                    <Skeleton active = {true} />
                    <Skeleton active = {true} />
                </>
                
               
            }
            <p></p>
            {
                rows && columns.length > 0
                ?
                <>
                    <EmployeeTable data = {rows} columns = {columns} val = {true}/>
                </>
                :
                <>
                    <Skeleton active = {true} />
                    <Skeleton active = {true} />
                    <Skeleton active = {true} />
                    <Skeleton active = {true} />
                </>
            }
        </>
    )
}

export default ChargeDetail