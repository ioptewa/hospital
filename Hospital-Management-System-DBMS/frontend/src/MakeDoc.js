import React, { Component} from 'react';

import {
    Box,
    Button,
    Heading,
    Grommet,
    FormField,
    Form,
    Text,

} from 'grommet';

import './App.css';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            focus: "#000000",
            active: "#000000",
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

export class MakeDoc extends Component {
    constuctor() {
    }
    render() {
        return (
            <Grommet theme={theme} full>
                <AppBar>
                <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>医院管理系统</Heading></a>
                </AppBar>
                <Box fill align="center" justify="top">
                    <Box width="medium">
                    <Text color = "#AAAAAA">医生注册表单：</Text>
                        <Form
                            onReset={event => console.log(event)}
                            method="post"
                            onSubmit={({ value }) => {
                                console.log("提交", value);
                                console.log(value.email)
                                fetch("http://localhost:3001/checkIfDocExists?email=" + value.email)
                                    .then(res => res.json())
                                    .then(res => {
                                        console.log(res.data[0]);
                                        if ((res.data[0])) {
                                            // 保持 window.alert，但汉化内容
                                            window.alert("该电子邮件已关联医生账户。");
                                            console.log("未找到用户");
                                        } else {
                                            fetch("http://localhost:3001/makeDocAccount?name=" + value.firstName + "&lastname=" + value.lastName + "&email=" + value.email
                                                + "&password=" + value.password + "&gender=" + value.gender + "&schedule=" + value.schedule);
                                            window.location = "/DocHome";
                                        }
                                    });
                            }} >
                            <FormField
                                label="名字"
                                name="firstName"
                                required
                                placeholder="请输入您的名字"
                                validate={{ regexp: /^[a-z]/i, message: "名字开头必须是字母" }} />
                            <FormField
                                label="姓氏"
                                name="lastName"
                                required
                                placeholder="请输入您的姓氏"
                                validate={{ regexp: /^[a-z]/i, message: "姓氏开头必须是字母" }} />
                            <FormField
                                label="电子邮箱"
                                name="email"
                                type="email"
                                placeholder="请输入您的电子邮箱"
                                required />
                            <FormField
                                label="排班编号"
                                name="schedule"
                                placeholder="请输入排班编号"
                                required />
                            <FormField
                                label="性别"
                                name="gender"
                                placeholder="女性或男性"
                                required />
                            <FormField
                                label="密码"
                                name="password"
                                required
                                placeholder="请输入您的密码"
                                validate={{ regexp: /^(?=.{8,})(?=.*[0-9]{2})/, message: "密码长度至少8个字符，且包含至少2位数字" }} />
                            <Box direction="row" align="center" >
                                <Button
                                    style={{ textAlign: 'center' }}
                                    label="取消"
                                    fill="horizontal"
                                    href="/" />
                                <Button
                                    label="注册"
                                    fill="horizontal"
                                    type="submit"
                                    primary />
                            </Box>

                        </Form>
                    </Box>
                </Box>

            </Grommet>
        );
    }
}

export default MakeDoc;
