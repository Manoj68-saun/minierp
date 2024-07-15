import {Row,Col,Skeleton, Tooltip} from 'antd'
import axios from 'axios';
import classes from './Pages.module.css';
import { useState, useEffect, useContext} from 'react';
import DataContext from './DataContext';
import EmployeeTable from './EmployeeTable';
import {RiUserSearchFill} from 'react-icons/ri'
import{BsFillArrowRightSquareFill} from 'react-icons/bs'
import { Link } from 'react-router-dom';

const Lov = (props) => {

    const employeeData = useContext(DataContext)
    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState(null)
    const [drows, setDRows] = useState(null)

    useEffect(() => {

        setDRows(null)
        setRows(null)
        setColumns([])

        axios
            .get('http://localhost:8000' + '/api/v1/salesOrder',{
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                setColumns((columns) => {
                    let newCols =  response.data.data.order.fields.map((col) => {
                        return({
                            name: col.name,
                            title: col.name.split("_").join(" ").toLowerCase()
                        });
                    })

                    const newNewCols = [ {name: "SNO", title: "SNo"}, {name: "Select", title: "Select"}, ...newCols]
                    return newNewCols;
                })
                const deleteHandler = (event,index,code) => {
                    console.log(index);
                    console.log(code);
                    window.close();
                    axios
                    .get('http://localhost:8000' + '/api/v1/salesOrder/additional-data/' + code,{
                        withCredentials: true
                    })
                    .then((response) => {
        
                        console.log(response);
                    })
                }
               

                setRows(rows => {
                    let newRows = response.data.data.order.rows.map((row,index) => {return(
                        {
                         
                            "SNO": index + 1,
                            "Select": <Tooltip placement="bottom" title = "Select Order Here" color = "#1777C4">
                            <Link  to = { "/sales/transaction/invoice-create"} style = {{color: "#1777C4", fontWeight: "bolder"}} >
                                <BsFillArrowRightSquareFill  onClick = {(event) => deleteHandler(event,index,row['booking_code'])} style = {{color: "red", fontWeight: "bolder", fontSize : "0.8rem" ,id:"hhh"}}/>
                            </Link>
                        </Tooltip>,
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

   

    return(
        <>            
            <Row className = {classes['Row']}>
                
                <Col className = {classes['Col']} md = {10}>
                  
                </Col>
            </Row>
            <p></p>
            <Row className = {classes['Row']}>
                <Col lg = {19} md = {17}>
                    
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
export default (Lov)
