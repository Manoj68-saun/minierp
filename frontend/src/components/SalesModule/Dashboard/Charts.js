import PieChart, {
    Connector,
  } from 'devextreme-react/pie-chart';
  import { BarSeries } from '@devexpress/dx-react-chart-material-ui';
  import { Chart, Series ,SeriesTemplate, CommonSeriesSettings, ArgumentAxis, Label, ValueAxis, Legend, Export, Tooltip, ZoomAndPan} from 'devextreme-react/chart';
import './style.css'
import {useState} from 'react'
import {Select} from 'antd'

const { Option } = Select;


function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

const Charts = (props) => {
   
    const [data1, setData] = useState([{
        
        "get_distributor":'',
        "quantity": ''
    }])
    const [type, setType] = useState("QUANTITY")
    const [type2, setType2] = useState("AMOUNT")
    const data3 = [
        { color: 'FF0000' },
        { color: '0000FF' },
        { color: '00FF00'},
        {color: 'FF0000' },
        {color: '0000FF'},
        {color: '00FF00' },
      ] 
    const onChange = (val) => {
        setType(val)
    }

    const onChange2 = (val) => {
        setType2(val)
    }

    if(props.chartType !== "line")
    return(
        <>
        {console.log({props})}
        {/* <Select
            value = {type}
            bordered = {false}
            dropdownStyle = {{textTransform: "capitalize"}}
            onChange = {(value) => onChange(value)}
            style={{ width: "20%" , float: "right", backgroundColor : "white",  textTransform: "capitalize", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
        >
            <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = "AMOUNT" value="AMOUNT">Amount</Option>
            <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = "QUANTITY" value="QUANTITY">Quantity</Option>
        </Select> */}
        <p></p>
        <Chart 
        
            className = "line"
            title= { "Top  Customer Wise Sales"}
            dataSource={props.chartType === "line" ? props.data1 : props.data}
            
                
          
          
             palette=  "Soft"
        >     

            <CommonSeriesSettings
            
            


                    label={{ visible: true }} //for value in top of bar
                argumentField="get_distributor"
                type={props.chartType}
                barPadding={0.1}
                hoverMode="allArgumentPoints"
                selectionMode="allArgumentPoints"
              
               
            >

            </CommonSeriesSettings>
            {/* <SeriesTemplate nameField="get_distributor" /> */}
            
            <ZoomAndPan
                valueAxis="both"
                argumentAxis="both"
                allowMouseWheel={true}
                panKey="shift" 
            />
            <Series
                key = {props.chartType}
                argumentField="get_distributor"
                valueField={"quantity"}
                name={props.data.quantity}
            />
            <ArgumentAxis>
                <Label
                    wordWrap="none"
                    overlappingBehavior="rotate"
                />
            </ArgumentAxis>
            <Legend 
                visible={false}
                horizontalAlignment="right"
                verticalAlignment="top">
            </Legend>
            <ValueAxis
                grid = {{visible: false}}
            />
            <Tooltip
                enabled={true}
            />
        </Chart>
        </>
    );

    else{

        return(
            <>  
                {/* <Select
                    value = {type2}
                    bordered = {false}
                    dropdownStyle = {{textTransform: "capitalize"}}
                    onChange = {(value) => onChange2(value)}
                    style={{ width: "20%" , float: "right", backgroundColor : "white",  textTransform: "capitalize", color: "#1777C4", fontWeight: "bold", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
                >
                    <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = "AMOUNT" value="AMOUNT">Amount</Option>
                    <Option style = {{textTransform: "capitalize", color: "#1777C4"}} key = "QUANTITY" value="QUANTITY">Quantity</Option>
                </Select> */}
                <Chart
                    className = "line"
                    type={props.chartType}
                    dataSource={props.data1}
                    palette="Pastel"
                    title= { "Item Wise Sales "}
                >
                    <Series
                    argumentField="item"
                    valueField={"qty"}
                    >
                    <Label visible={true}>
                        <Connector visible={true} width={1} />
                    </Label>
                    </Series>
                    <Tooltip
                        enabled={true}
                    />
                </Chart>          
            </>
            
        )
    }
}

export default Charts