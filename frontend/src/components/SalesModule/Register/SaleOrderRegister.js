import classes from '../Pages.module.css';
import {Row,Col, Skeleton} from 'antd';
import { useState, useEffect, useContext} from 'react';
import ToolRow from './ToolRow';
import axios from 'axios';
import DataContext from '../../../Context/dataContext';
import SalesTable from './SalesTable';

const SaleOrderRegister = (props) => {

    const employeeData = useContext(DataContext)
    const [columns, setColumns] = useState([])
    const [allRows, setAllRows] = useState(null)
    const [pendingRows, setPendingRows] = useState(null)
    const [completedRows, setCompletedRows] = useState(null)
    const [type, setType] = useState('pending');
    const [ft, setFT] = useState(false)
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [dFilter, setDFilter] = useState("all")
    const [typeChanged, setTypeChanged] = useState(true)


    const months = { "01": "JAN", "02": "FEB", "03": "MAR", "04": "APR", "05": "MAY", "06": "JUN", "07": "JUL", "08": "AUG", "09": "SEP", "10": "OCT", "11": "NOV", "12": "DEC"}
  
  
    useEffect(() => {

        if(dFilter !== "all"){
            if(dFilter !== "fromTo" && dFilter !== "week")
            {
                setFT(false)
                setToDate("")
                setFromDate("")
                setColumns([])
                setAllRows(null)
                setCompletedRows(null)
                setPendingRows(null)
                axios
                .get(employeeData.URL + '/api/v1/salesOrder/get-all-order/',{
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

                        const newNewCols = [{name: "SNO", title: "SNo"}, ...newCols]
                        return newNewCols;
                    })

                    // this is for month filter


                    var date= new Date(); 
                    console.log(date)                  
                    var month = date.getMonth() + 1;
                    //adding 1 because getMonth returns the index of the month
                    var mnt= ('0'+ month).slice(-2) ; // Output: 01, 02, ..., 11, 12
                     
                    // this is for today filter


                    var dateObject = new Date(date);

                   var date1 = 
                    dateObject.getDate().toString().padStart(2, 0) +
                        "-" +
                   (dateObject.getMonth() + 1).toString().padStart(2, 0) + 
                          "-" + 
                    dateObject.getFullYear();
                     console.log(date1)

                     // this is for Yesterday filter 


                       let dateObj = new Date();
 
                        // Subtract one day from current time                       
                         dateObj.setDate(dateObj.getDate() - 1);

                        const yesterdayDate = 
                          dateObj.getDate().toString().padStart(2, 0) +
                                   "-" +
                       (dateObj.getMonth() + 1).toString().padStart(2, 0) +
                                  "-" +
                              dateObj.getFullYear();
                              
                        console.log(yesterdayDate)

                        // this is for finYear filter
                        var today = new Date();
                        var currentYear = new Date().getFullYear();

                        // for week filter

                        var beginOfWeek1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
var endOfWeek1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
var beginOfWeek1String =`${(beginOfWeek1.getDate().toString().padStart(2,'0') + "-" + (beginOfWeek1.getMonth() + 1).toString().padStart(2, '0') + "-" + beginOfWeek1.getFullYear().toString())}`;
var endOfWeek1String =`${( endOfWeek1.getDate().toString().padStart(2,'0') + "-" + (endOfWeek1.getMonth() + 1).toString().padStart(2, '0') + "-" + endOfWeek1.getFullYear().toString())}`;

console.log(beginOfWeek1String);
console.log(endOfWeek1String);


                    setAllRows(rows => {

                        let newRows = []
                        return newRows;
                    })

                    setCompletedRows(rows => {
                        let newRows = []
                        return newRows;
                    })

                    if(dFilter == "month"){
                    setPendingRows(rows => {
                        
                        let newRows = response.data.data.dat1.filter((row,index) => {return(
                           row.so_date.split('-')[1] == mnt
                        );})
                        return newRows;
                    })
                }
                else if (dFilter=="today")
                {
                    setPendingRows(rows => {
                        
                        let newRows = response.data.data.dat1.filter((row,index) => {return(
                           row.so_date == date1
                        );})
                        return newRows;
                    })  
                }
                else if(dFilter=="yesterday")
                {
                    setPendingRows(rows => {
                        
                        let newRows = response.data.data.dat1.filter((row,index) => {return(
                           row.so_date == yesterdayDate
                        );})
                        return newRows;
                    })  
                }
                else if (dFilter == "finYear")
                {
                    setPendingRows(rows => {
                        
                        let newRows = response.data.data.dat1.filter((row,index) => {return(
                           row.so_date.split("-")[2] == currentYear
                        );})
                        return newRows;
                    })  
                }
                // else if (dFilter == "week")
                // {
                //     setPendingRows(rows => {
                        
                //         let newRows = response.data.data.dat1.filter((row,index) => {return(
                //            row.so_date>=beginOfWeek1String && row.so_date<=endOfWeek1String
                //         );})
                //         return newRows;
                //     })
                // }
                })
                
                
            
                .catch((error) => {
                    console.log(error);
                })
            
            }
        else if(dFilter !== "fromTo"|| dFilter=="week"){
            setPendingRows(null)
            axios
            .get(employeeData.URL + '/api/v1/salesOrder/get-all-order-by-week',{
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                console.log(response);
                        setColumns((columns) => {
                            let newCols =  response.data.data.order.fields.map((col) => {
                                return({
                                    name: col.name,
                                    title: col.name.split("_").join(" ").toLowerCase()
                                });
                            })

                            const newNewCols = [{name: "SNO", title: "SNo"}, ...newCols]
                            return newNewCols;
                        })

                        setPendingRows(rows => {
                            let newRows = response.data.data.dat1.map((row,index) => {return(
                                {
                                    "SNO": index + 1,
                                    ...row
                                }
                            );})
                            return newRows;
                        })


            })
        }
    

            else{
                setFT(true)
                if(fromDate !== "" && toDate !== ""){
                    setPendingRows(null)
                  //  setOB(0)

                    let from = fromDate.split("-")[0] + "-" + months[fromDate.split("-")[1]] + "-" + fromDate.split("-")[2]
                    let to = toDate.split("-")[0] + "-" + months[toDate.split("-")[1]] + "-" + toDate.split("-")[2]
                  console.log(from)
                  console.log(to)
                    axios
                    .get(employeeData.URL + '/api/v1/salesOrder/get-all-order/?from=' + from + "&to=" + to,{
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

                            const newNewCols = [{name: "SNO", title: "SNo"}, ...newCols]
                            return newNewCols;
                        })

                        setPendingRows(rows => {
                            let newRows = response.data.data.dat1.map((row,index) => {return(
                                {
                                    "SNO": index + 1,
                                    ...row
                                }
                            );})
                            return newRows;
                        })

                        // setOB(ob => {
                        //     const newob = response.data.data.openingBalance
                        //     return newob
                        // })

                    })
                    .catch((error) => {
                        console.log(error);
                    })
                
            
                }
            }
        }
        
    }, [dFilter, fromDate, toDate])

    useEffect(() => {  

        if(dFilter === "all"){

            setFT(false);
            setToDate("")
            setFromDate("")
            setColumns([])
            setAllRows(null)
            setCompletedRows(null)
            setPendingRows(null)
            axios
            .get(employeeData.URL + '/api/v1/salesOrder/get-all-order/',{
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

                    const newNewCols = [{name: "SNO", title: "SNo"}, ...newCols]
                    return newNewCols;
                })

                setAllRows(rows => {
                    let newRows = response.data.data.dat1.map((row,index) => {return(
                        {
                            "SNO": index + 1,
                            ...row
                        }
                    );})
                    return newRows;
                })

                setPendingRows(rows => {
                    let newRows = response.data.data.dat1.map((row,index) => {return(
                        {
                            "SNO": index + 1,
                            ...row
                        }
                    );})
                    return newRows;
                })

                setCompletedRows(rows => {
                    let newRows = response.data.data.dat1.map((row,index) => {return(
                        {
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
        }      
        
    }, [dFilter])

    const handleClick = (event, val) => {
        setTypeChanged(false)
        setType(val)
        setTypeChanged(true)
    }

    const onDChange = (value, param) => {

        setDFilter(value)
    }

    const onDateChange = (date, dateString) => {
        
        setFromDate(dateString[0])
        setToDate(dateString[1])

    }

    return(
        <>            
            <Row className = {classes['Row']}>
               {/* // {console.log(classes['Title'])} */}
                <Col md = {14}><p className = {classes['Title']}>Sales Order Register</p></Col>
                <Col className = {classes['Col']} md = {10}>
                    <Row>
                        <Col md = {8}><button onClick = {(event) => handleClick(event, "all")} className = {type === "all" ? classes['PageButton'] : classes['PageButton2']}></button></Col>
                        {/* <Col md = {8}><button onClick = {(event) => handleClick(event, "pending")} className = {type === "pending" ? classes['PageButton'] : classes['PageButton2']}></button></Col> */}
                        <Col md = {8}><button onClick = {(event) => handleClick(event, "completed")} className = {type === "completed" ? classes['PageButton'] : classes['PageButton2']}></button></Col>
                    </Row>
                </Col>
            </Row>
            <p></p>
            <ToolRow ft = {ft} fromDate = {fromDate} toDate = {toDate} onDateChange = {onDateChange} dFilter = {dFilter} onDChange = {onDChange}/>
            <p></p>
            {
                typeChanged && allRows && completedRows && pendingRows && columns.length > 0
                ?
                <>
                    {type === "all" && <SalesTable data = {allRows} columns = {columns} />}
                    {type === "pending" && <SalesTable data = {pendingRows} columns = {columns} />}
                    {type === "completed" && <SalesTable data = {completedRows} columns = {columns} />}
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
    );
}

export default SaleOrderRegister