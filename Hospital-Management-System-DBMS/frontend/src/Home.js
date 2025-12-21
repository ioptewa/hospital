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
            name: "加载中...",
            email: "加载中...",
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
                                    name: "未找到用户", 
                                    email: email_in_use,
                                    gender: "未知", 
                                    address: "未知",
                                    age: "未知",
                                    height: "未知",
                                    weight: "未知"
                                } 
                            });
                        }
                    })
                    .catch(err => console.error("Fetch error:", err));
            });
    }

    render() {
        const { patientInfo, showSidebar } = this.state;

        // 1. 获取性别字符串并清理空格
        let rawGender = (patientInfo.gender || "").toString();
        const genderStr = rawGender.toLowerCase().trim(); 

        let avatarContent;

        // 头像样式
        const imgStyle = {
            width: '150px',  
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px' 
        };
        
        // ==========================================
        // 修改重点：这里加入了中文 "男" 和 "女" 的识别
        // ==========================================
        if (["male", "man", "boy", "m", "男"].includes(genderStr)) {
            avatarContent = <img src={maleIcon} alt="Male Avatar" style={imgStyle} />;
        } 
        else if (["female", "woman", "girl", "f", "女"].includes(genderStr)) {
            avatarContent = <img src={femaleIcon} alt="Female Avatar" style={imgStyle} />;
        } 
        else {
            // 默认头像
            avatarContent = (
                <Box width="150px" height="150px" background="light-4" round="full" align="center" justify="center" margin={{bottom: 'small'}}>
                     <User size="large" color="white" />
                </Box>
            );
        }

        // --- InfoRow 组件：标签不换行，数值右对齐 ---
        const InfoRow = ({ label, value }) => (
            <Box direction="row" justify="between" border={{ side: 'bottom', color: 'light-3' }} pad={{ vertical: 'small' }}>
                <Text weight="bold" color="dark-3" style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>{label}:</Text>
                <Text color="dark-2" style={{ textAlign: 'right', wordBreak: 'break-all' }}>{value}</Text>
            </Box>
        );

        return (
            <Grommet theme={theme} full>
                <Box fill>
                    <AppBar>
                        <Button plain onClick={() => this.setState({ showSidebar: !showSidebar })}>
                            <Heading level='3' margin='none'>医院管理系统</Heading>
                        </Button>
                        <Heading level='4' margin='none'>病人工作台</Heading>
                    </AppBar>

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box flex width='medium' background='brand' elevation='small' align='start' justify='start'>
                                <Box fill pad={{ vertical: 'small' }}>
                                    <MenuButton 
                                       label="查看病史" 
                                       icon={<History />} 
                                       onClick={() => {
                                         const email = this.state.patientInfo.email;
                                         if (email && email !== "Loading..." && email !== "未找到用户") {
                                           window.location.href = "/ViewOneHistory/" + email;
                                         } else {
                                            window.alert("正在加载用户信息，请稍后再试...");
                                         }
                                      }}
                                    />
                                    <MenuButton label="预约挂号" icon={<ScheduleNew />} href="/scheduleAppt" />
                                    <MenuButton label="预约记录" icon={<Clipboard />} href="/PatientsViewAppt" />
                                    <MenuButton label="设置" icon={<SettingsOption />} href="/Settings" />
                                    <Box border={{ side: 'top', color: 'dark-2' }} margin={{ top: 'small' }}>
                                        <MenuButton label="退出登录" icon={<Logout />} onClick={() => {
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
                                <CardBody direction="row-responsive" gap="small" pad="medium">
                                    
                                    {/* --- 左侧列：头像和名字 --- */}
                                    <Box width="small" align="center" justify="start" pad={{ right: "small" }}>
                                        {avatarContent}
                                        <Heading level="2" margin="none" textAlign="center">
                                            {patientInfo.name}
                                        </Heading>
                                        <Text size="small" color="gray" margin={{top: "xsmall"}}>病人档案</Text>
                                    </Box>

                                    {/* --- 右侧列：详细信息列表 --- */}
                                    <Box flex justify="center" gap="none">
                                        <InfoRow label="电子邮箱" value={patientInfo.email} />
                                        <InfoRow label="性别" value={patientInfo.gender || "未知"} />
                                        <InfoRow label="年龄" value={patientInfo.age ? patientInfo.age : "未知"} />
                                        <InfoRow label="身高" value={patientInfo.height ? patientInfo.height : "未知"} />
                                        <InfoRow label="体重" value={patientInfo.weight ? patientInfo.weight : "未知"} />
                                        <InfoRow label="地址" value={patientInfo.address || "未知"} />
                                    </Box>

                                </CardBody>
                                <CardFooter background="light-2" pad="medium" justify="end">
                                    <Button label="查看预约" primary href="/PatientsViewAppt" />
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