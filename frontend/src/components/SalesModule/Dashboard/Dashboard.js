import {Row, Col, Card, Space, Statistic} from 'antd';
import classes from './Dashboard.module.css';
import DataCards from './DataCards';
import ProfileCard from './ProfileCard';
import {useEffect, useContext} from 'react';
import DataContext from '../../../Context/dataContext';
import Charts from './Charts'
import {ShoppingCartOutlined, UserOutlined, ShoppingOutlined,DollarCircleOutlined} from '@ant-design/icons';
const Dashboard = () => {
    const employeeData = useContext(DataContext)
     console.log(employeeData)
    console.log(employeeData.analysis)
    // how acess data from context
    
    return(
        <>
            <Row gutter = {16} className = {classes['SiteLayoutBackground']}>
            <Col xl = {24} lg = {24} md = {24}>
                    <DataCards data={employeeData.analysis}/>
                    <Row>
                        <Col lg = {{span: 24, offset: 0}} md = {24} xs = {24} className = {classes['ColC']}>
                            <Card className = {classes['Card']}>
                                <Charts chartType = "bar" data = {employeeData.analysis.data}  />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <p></p>
                <Col lg = {{span: 24, offset: 0}} md = {24} xs = {24} className = {classes['ColC']}>
                    <Card className = {classes['Card']}>
                        <Charts chartType = "line" data1 = {employeeData.analysis.itemQtyOfOrder} />
                    </Card>
                </Col>
            </Row>
            <p></p>
            {/* <Row gutter = {16} className = {classes['SiteLayoutBackground']}>
                <Col lg = {8} md = {8} className = {classes['ColX']}>
                    <Card className = {classes['Card']} >
                  
                    </Card>
                </Col>
                <Col lg = {8} md = {8} className = {classes['ColX']}>
                    <Card className = {classes['Card']} >

                    </Card>
                </Col>
                <Col lg = {8} md = {8} className = {classes['ColX']}>
                    <Card className = {classes['Card']} >

                    </Card>
                </Col>
            </Row> */}
            <p></p>
            {/* <Row gutter = {16} className = {classes['SiteLayoutBackground']}>
                <Col lg = {16} md = {24} className = {classes['ColC']}>
                    <Card className = {classes['Card']} >

                    </Card>
                </Col>
                <Col lg = {8} md = {24} className = {classes['ColC']}>
                    <Card className = {classes['Card']} >

                    </Card>
                </Col>
            </Row> */}
            <p></p>
        </>
















































    //     <>
    
    // <Row gutter = {16} className = {classes['SiteLayoutBackground']}>  
    // {/* <Space direction="horizontal"> */}
    // <DashboardCard icon={<ShoppingCartOutlined style={{color:"green", backgroundColor:'rgba(0,255,0,0.25)',borderRadius:20,fontSize:24,padding:8, flexDirection: 'row', alignItems: 'center'}}/> } title={"Orders"} value={123}/>
    // <DashboardCard icon={<ShoppingOutlined/>} title={"Invoice"} value={50}/>
    // <DashboardCard icon={<UserOutlined/>} title={"Customer"} value={12}/>
    // <DashboardCard icon={<DollarCircleOutlined/>} title={"All Sauda"} value={20}/>
    // {/* </Space> */}
    // </Row> 
    
    //    </>
    );
}

// const DashboardCard = ({title,value, icon}) => {
//     return(
        
//             <Col lg = {6} md = {6} className = {classes['ColC']}>
//     <Card className = {classes['Card']}>
//     {/* <Space direction="horizontal"> */}
//         {icon}
//         <Statistic  title={title} value={value}/>
    
//     {/* </Space> */}
//     </Card>
//     </Col>
     
     
//     );
// }
export default Dashboard