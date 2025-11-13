import React, { Component } from 'react';
import {
    Box,
    Heading,
    Grommet,
    Button,
    Card,
    CardBody,
    CardFooter,
    Text,
    Collapsible
} from 'grommet';
import { 
    History, 
    ScheduleNew, 
    Clipboard, 
    SettingsOption, 
    Logout, 
    User 
} from 'grommet-icons';

// 引入图片
import maleIcon from './male.png';
import femaleIcon from './female.png';

import './App.css';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            focus: '#000000',
            "neutral-gray": "#cccccc"
        },
        font: {
            family: 'Lato',
        },
    },
};

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='brand'
        pad={{ left: 'medium', right: 'small', vertical: 'small' }}
        style={{ zIndex: '1' }}
        {...props} />
);

const MenuButton = ({ label, icon, href, onClick }) => (
    <Button hoverIndicator={{ color: "#333333" }} plain href={href} onClick={onClick}>
        <Box direction="row" pad="medium" gap="small" align="center">
            {React.cloneElement(icon, { color: "white" })}
            <Text color="white">{label}</Text>
        </Box>
    </Button>
);

export class Home extends Component {
    
    state = { 
        patientInfo: {
            name: "Loading...",
            email: "Loading...",
            gender: "",
            address: "",
            age: "",      
            height: "",   
            weight: ""    
        }, 
        showSidebar: true 
    }

    componentDidMount() {
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                var string_json = JSON.stringify(res);
                var email_json = JSON.parse(string_json);
                let email_in_use = email_json.email;
                
                fetch('http://localhost:3001/checkIfPatientExists?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data && res.data.length > 0) {
                            this.setState({ patientInfo: res.data[0] });
                        } else {
                            this.setState({ 
                                patientInfo: { 
                                    name: "User Not Found", 
                                    email: email_in_use,
                                    gender: "Unknown", 
                                    address: "Unknown",
                                    age: "Unknown",
                                    height: "Unknown",
                                    weight: "Unknown"
                                } 
                            });
                        }
                    })
                    .catch(err => console.error("Fetch error:", err));
            });
    }

    render() {
        const { patientInfo, showSidebar } = this.state;

        let rawGender = (patientInfo.gender || "").toString();
        const genderStr = rawGender.toLowerCase().trim(); 

        let avatarContent;

        // 头像样式
        const imgStyle = {
            width: '150px',  // 头像稍微改大了一点，更有气势
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px' // 头像和名字之间的距离
        };
        
        if (["male", "man", "boy", "m"].includes(genderStr)) {
            avatarContent = <img src={maleIcon} alt="Male Avatar" style={imgStyle} />;
        } 
        else if (["female", "woman", "girl", "f"].includes(genderStr)) {
            avatarContent = <img src={femaleIcon} alt="Female Avatar" style={imgStyle} />;
        } 
        else {
            avatarContent = (
                <Box width="150px" height="150px" background="light-4" round="full" align="center" justify="center" margin={{bottom: 'small'}}>
                     <User size="large" color="white" />
                </Box>
            );
        }

        // 定义一个显示信息的组件，方便复用，带下划线
        const InfoRow = ({ label, value }) => (
            <Box direction="row" justify="between" border={{ side: 'bottom', color: 'light-3' }} pad={{ vertical: 'small' }}>
                <Text weight="bold" color="dark-3">{label}:</Text>
                <Text color="dark-2">{value}</Text>
            </Box>
        );

        return (
            <Grommet theme={theme} full>
                <Box fill>
                    <AppBar>
                        <Button plain onClick={() => this.setState({ showSidebar: !showSidebar })}>
                            <Heading level='3' margin='none'>HMS</Heading>
                        </Button>
                        <Heading level='4' margin='none'>Patient Dashboard</Heading>
                    </AppBar>

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box flex width='medium' background='brand' elevation='small' align='start' justify='start'>
                                <Box fill pad={{ vertical: 'small' }}>
                                    <MenuButton label="Medical History" icon={<History />} href="/MedHistView" />
                                    <MenuButton label="Schedule Appointment" icon={<ScheduleNew />} href="/scheduleAppt" />
                                    <MenuButton label="Appointment Records" icon={<Clipboard />} href="/PatientsViewAppt" />
                                    <MenuButton label="Settings" icon={<SettingsOption />} href="/Settings" />
                                    <Box border={{ side: 'top', color: 'dark-2' }} margin={{ top: 'small' }}>
                                        <MenuButton label="Log Out" icon={<Logout />} onClick={() => {
                                                fetch('http://localhost:3001/endSession');
                                                window.location.href = "/";
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Collapsible>

                        {/* 内容区域 */}
                        <Box flex align="center" justify="center" background="light-1" pad="medium">
                            <Card width="large" background="white" elevation="medium" round="small" pad="medium">
                                <CardBody direction="row-responsive" gap="medium" pad="medium">
                                    
                                    {/* --- 左侧列：头像 + 名字 --- */}
                                    <Box width="medium" align="center" justify="start" pad={{ right: "medium" }}>
                                        {avatarContent}
                                        <Heading level="2" margin="none" textAlign="center">
                                            {patientInfo.name}
                                        </Heading>
                                        {/* 可以在名字下面加个小标签 */}
                                        <Text size="small" color="gray" margin={{top: "xsmall"}}>Patient Profile</Text>
                                    </Box>

                                    {/* --- 右侧列：详细信息列表 --- */}
                                    <Box flex justify="center" gap="none">
                                        <InfoRow label="Email" value={patientInfo.email} />
                                        <InfoRow label="Gender" value={patientInfo.gender || "Unknown"} />
                                        <InfoRow label="Age" value={patientInfo.age ? patientInfo.age : "Unknown"} />
                                        <InfoRow label="Height" value={patientInfo.height ? patientInfo.height : "Unknown"} />
                                        <InfoRow label="Weight" value={patientInfo.weight ? patientInfo.weight : "Unknown"} />
                                        <InfoRow label="Address" value={patientInfo.address || "Unknown"} />
                                    </Box>

                                </CardBody>
                                <CardFooter background="light-2" pad="medium" justify="end">
                                    <Button label="Check Appointments" primary href="/PatientsViewAppt" />
                                </CardFooter>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default Home;