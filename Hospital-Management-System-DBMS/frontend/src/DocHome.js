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
    Calendar,
    User,
    SettingsOption,
    Logout
} from 'grommet-icons';

// 头像图片
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

export class DocHome extends Component {

    state = {
        doctorInfo: {
            name: "加载中...",
            email: "加载中...",
            gender: "",
            age: "",
            address: ""
        },
        showSidebar: true
    }

    componentDidMount() {
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                var email_json = JSON.parse(JSON.stringify(res));
                let email_in_use = email_json.email;

                fetch('http://localhost:3001/checkIfDocExists?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        if (res.data && res.data.length > 0) {
                            this.setState({ doctorInfo: res.data[0] });
                        } else {
                            this.setState({
                                doctorInfo: {
                                    name: "未找到医生",
                                    email: email_in_use,
                                    gender: "未知",
                                    age: "未知",
                                    address: "未知"
                                }
                            });
                        }
                    })
                    .catch(err => console.error("Fetch error:", err));
            });
    }

    render() {
        const { doctorInfo, showSidebar } = this.state;

        let rawGender = (doctorInfo.gender || "").toString();
        const genderStr = rawGender.toLowerCase().trim();

        // 性别显示头像
        let avatarContent;
        const imgStyle = {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '15px'
        };

        if (["male", "man", "boy", "m"].includes(genderStr)) {
            avatarContent = <img src={maleIcon} alt="Male Avatar" style={imgStyle} />;
        }
        else if (["female", "woman", "girl", "f"].includes(genderStr)) {
            avatarContent = <img src={femaleIcon} alt="Female Avatar" style={imgStyle} />;
        }
        else {
            avatarContent = (
                <Box width="150px" height="150px" background="light-4" round="full" align="center" justify="center" margin={{ bottom: 'small' }}>
                    <User size="large" color="white" />
                </Box>
            );
        }

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
                            <Heading level='3' margin='none' color="white">医院管理系统</Heading>
                        </Button>
                        <Heading level='4' margin='none' color="white">医生仪表板</Heading>
                    </AppBar>

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        {/* 侧边栏 */}
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box flex width='medium' background='brand' elevation='small' align='start' justify='start'>
                                <Box fill pad={{ vertical: 'small' }}>
                                    <MenuButton label="预约" icon={<Calendar />} href="/ApptList" />
                                    <MenuButton label="查看患者" icon={<User />} href="/MedHistView" />
                                    <MenuButton label="统计" icon={<Calendar />} href="/DocStatistics" />
                                    <MenuButton label="设置" icon={<SettingsOption />} href="/DocSettings" />
                                    <Box border={{ side: 'top', color: 'dark-2' }} margin={{ top: 'small' }}>
                                        <MenuButton label="退出登录" icon={<Logout />} onClick={() => {
                                            fetch('http://localhost:3001/endSession');
                                            window.location.href = "/";
                                        }} />
                                    </Box>
                                </Box>
                            </Box>
                        </Collapsible>

                        {/* 主体内容 */}
                        <Box flex align="center" justify="center" background="light-1" pad="medium">
                            <Card width="large" background="white" elevation="medium" round="small" pad="medium">
                                <CardBody direction="row-responsive" gap="medium" pad="medium">

                                    {/* 左侧：头像 + 名字 */}
                                    <Box width="medium" align="center" justify="start" pad={{ right: "medium" }}>
                                        {avatarContent}
                                        <Heading level="2" margin="none" textAlign="center">
                                            {doctorInfo.name}
                                        </Heading>
                                        <Text size="small" color="gray" margin={{ top: "xsmall" }}>医生档案</Text>
                                    </Box>

                                    {/* 右侧：详细信息 */}
                                    <Box flex justify="center" gap="none">
                                        <InfoRow label="电子邮箱" value={doctorInfo.email || "未知"} />
                                        <InfoRow label="性别" value={doctorInfo.gender || "未知"} />
                                        <InfoRow label="年龄" value={doctorInfo.age || "未知"} />
                                        <InfoRow label="地址" value={doctorInfo.address || "未知"} />
                                    </Box>

                                </CardBody>
                                <CardFooter background="light-2" pad="medium" justify="end">
                                    <Button label="查看预约" primary href="/ApptList" />
                                </CardFooter>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default DocHome;
