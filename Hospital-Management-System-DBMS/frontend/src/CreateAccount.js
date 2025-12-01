import React, { Component} from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Text,
  Select 
} from 'grommet';

import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000'
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

export class CreateAccount extends Component {
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
          <Text color = "#AAAAAA">病人注册表单：</Text>
            <Form
              onReset={event => console.log(event)}
              method="post"
              onSubmit={({ value }) => {
                console.log("Submit", value);

                fetch("http://localhost:3001/checkIfPatientExists?email=" + value.email)
                  .then(res => res.json())
                  .then(res => {
                    console.log(res.data[0]);

                    if ((res.data[0])) {
                      window.alert("该邮箱已关联现有账户。");
                      console.log("no user found");
                    } else {
                      // --- 修改点：不再区分 firstname/lastname，只传 name ---
                      fetch("http://localhost:3001/makeAccount?name=" + value.name + 
                            "&email=" + value.email + 
                            "&password=" + value.password + 
                            "&address=" + value.address + 
                            "&gender=" + value.gender + 
                            "&age=" + value.age + 
                            "&height=" + value.height + 
                            "&weight=" + value.weight + 
                            "&conditions=" + value.conditions + 
                            "&medications=" + value.medications + 
                            "&surgeries=" + value.surgeries);
                      window.location = "/Home";
                    }
                  });
              }}>
              
              {/* --- 修改点：合并为一个姓名输入框 --- */}
              <FormField
                label="姓名"
                name="name"
                placeholder="请输入您的姓名"
                required
                validate={{ regexp: /^[\u4e00-\u9fa5a-zA-Z\s]+$/, message: "请输入中文或英文字符" }} 
              />
              {/* 删除了原来的 firstName 和 lastName 字段 */}
              
              <FormField label="性别" name="gender" required>
                <Select
                  options={['男', '女']}
                  name="gender"
                  placeholder="请选择性别"
                />
              </FormField>

              <FormField
                label="年龄"
                name="age"
                placeholder="例如：25"
                required 
                validate={{ regexp: /^[0-9]+$/, message: "仅限数字" }}
              />
              <FormField
                label="身高"
                name="height"
                placeholder="例如：175cm"
                required 
              />
              <FormField
                label="体重"
                name="weight"
                placeholder="例如：70kg"
                required 
              />
              
              <FormField
                label="病史 - 既往症"
                name="conditions"
                placeholder="无"
               />
              <FormField
                label="病史 - 手术史"
                name="surgeries"
                placeholder="无"
               />
              <FormField
                label="病史 - 药物使用"
                name="medications"
                placeholder="无"
               />
              <FormField
                label="家庭住址"
                name="address"
                placeholder="请输入地址"
                required />
              <FormField
                label="电子邮箱"
                name="email"
                type="email"
                placeholder="请输入邮箱"
                required />
              <FormField
                label="密码"
                name="password"
                placeholder="请输入密码"
                required
                validate={{ regexp: /^(?=.{8,})(?=.*[0-9]{2})/, message: "至少8位字符且包含2个数字" }} />
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
              <Box
                align="center" pad="small">
                <Text>您是医生吗？</Text>
                <Button
                  primary
                  label="我是医生"
                  href="/MakeDoc" />
              </Box>
            </Form>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default CreateAccount;