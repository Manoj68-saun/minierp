import {Row,Col,Skeleton, Tooltip} from 'antd'
import {RiUserSearchFill} from 'react-icons/ri'
import axios from 'axios';
import classes from '../Pages.module.css';
import { useState, useEffect, useContext} from 'react';
import DataContext from '../../../Context/dataContext';
import EmployeeTable from '../EmployeeTable/EmployeeTable';
import { AiFillDelete} from 'react-icons/ai';

import { Link } from 'react-router-dom';

const AccountDetail = (props) => {

    const employeeData = useContext(DataContext)
    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState(null)
    const [drows, setDRows] = useState(null)

    useEffect(() => {

        setDRows(null)
        setRows(null)
        setColumns([])

        axios
            .get(employeeData.URL + '/api/v1/account',{
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                
                setColumns((columns) => {
                    let newCols =  response.data.data.account.fields.map((col) => {
                        return({
                            name: col.name,
                            title: col.name.split("_").join(" ").toLowerCase()
                        });
                    })

                    const newNewCols = [{name: "D", title: "D"}, {name: "V", title: "V"}, {name: "SNO", title: "SNo"}, ...newCols]
                    return newNewCols;
                })

                setRows(rows => {
                    let newRows = response.data.data.account.rows.map((row,index) => {return(
                        {
                            "D": <Tooltip placement="bottom" title = "Delete" color = "red">
                                    <Link  to = "#" style = {{color: "red", fontWeight: "bolder"}} >
                                        <AiFillDelete  onClick = {(event) => deleteHandler(event,index,response.data.data.account.rows,row['account_code'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem"}}/>
                                    </Link>
                                </Tooltip>,
                            "V": <Tooltip placement="bottom" title = "View" color = "#1777C4">
                                <Link  to = { "/sales/accountmaster/acc-form-view/" + row['account_code']} style = {{color: "#1777C4", fontWeight: "bolder"}} >
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

    const deleteHandler = (event,index,newrows,code) => {
        console.log(index);
        console.log(code);
        
        setRows(null)
        axios
            .delete(employeeData.URL + '/api/v1/account/' + code.toString(),{
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                    const rowvals = newrows.filter(row => row['account_code'] !== code)
                    setRows( rows => {
                        let newDRows = rowvals.map((row,index) => {return(
                            {
                                "D": <Tooltip placement="bottom" title = "Delete" color = "red">
                                        <Link  to = "#" style = {{color: "red", fontWeight: "bolder"}} >
                                            <AiFillDelete  onClick = {(event) => deleteHandler(event,index,rowvals,row['account_code'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem"}}/>
                                        </Link>
                                    </Tooltip>,
                                "V": <Tooltip placement="bottom" title = "View" color = "#1777C4">
                                    <Link  to = {"/sales/accountmaster/acc-form-view/" + row['account_code']} style = {{color: "#1777C4", fontWeight: "bolder"}} >
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
                                        <AiFillDelete  onClick = {(event) => deleteHandler(event,index,newrows,row['account_code'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem"}}/>
                                    </Link>
                                </Tooltip>,
                            "V": <Tooltip placement="bottom" title = "View" color = "#1777C4">
                                <Link  to = { "/sales/accountmaster/acc-form-view/" + row['account_code']} style = {{color: "#1777C4", fontWeight: "bolder"}} >
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
            <Row className = {classes['Row']}>
                <Col md = {14}><p className = {classes['Title']}>Account Details</p></Col>
                <Col className = {classes['Col']} md = {10}>
                  
                </Col>
            </Row>
            <p></p>
            <Row className = {classes['Row']}>
                <Col lg = {19} md = {17}>
                    
                </Col>
                <Col className = {classes['Col']} lg = {5} md = {7}>
                    <Link to = "/sales/accountmaster/create-account"><button className = {classes['ProfileButton']}>Add an Account</button></Link>
                </Col>
            </Row>
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

export default AccountDetail