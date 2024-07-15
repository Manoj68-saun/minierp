import { Card, Avatar } from 'antd';
import classes from './Dashboard.module.css';
import {MdEmail} from 'react-icons/md';
import {HiReceiptTax} from 'react-icons/hi';
import {AiFillPhone} from 'react-icons/ai';
import { Link } from 'react-router-dom';

const ProfileCard = (props) => {
    return(
        <Card className = {classes['PCard']}>
            <Avatar
                size={{
                xs: 24,
                sm: 32,
                md: 80,
                lg: 84,
                xl: 100,
                xxl: 100,
                }}
                style={{ color: 'white', backgroundColor: '#A2C4C6' }}
            >C</Avatar> 
            <p></p>
            <p className = {classes['Name']} >CHANDAN</p>
            {/* <p style = {{whiteSpace: "nowrap"}}><AiFillPhone className = {classes['Icon']}/> <MdEmail className = {classes['Icon']}/> <FaReceipt className = {classes['Icon']}/></p> */}
            <p><AiFillPhone className = {classes['Icon']}/><br></br>6370523340</p>
            <p></p>
            <p><MdEmail className = {classes['Icon']}/><br></br>chandan@imax.co.in</p>
            <p><HiReceiptTax className = {classes['Icon']}/><br></br>GST12346</p>
            <p></p>
            <Link to = "/customer-portal/profile"><button className = {classes['ProfileButton']}>My Profile</button></Link>
        </Card>
    );
}

export default ProfileCard