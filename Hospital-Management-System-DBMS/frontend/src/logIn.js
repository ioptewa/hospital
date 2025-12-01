import React, { Component} from 'react';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  CheckBox,
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

class LogIn extends Component {
  state = { isDoctor: false }

  constuctor() {
    this.routeChange = this.routeChange.bind(this);
  }

  routeChange() {
    let path = '/Home';
    this.props.history.push(path);
  }

  render() {
    const { isDoctor } = this.state; // If doctor, will query from doctor table

    return (
      <Grommet theme={theme} full>
        <AppBar>
        <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>医院管理系统</Heading></a>
        </AppBar>

        <Box
          fill
          align="center"
          justify="top"
          pad="medium">
          <Box
            width="medium"
            pad="medium">
            <Form

              onReset={event => console.log(event)}
              onSubmit={({ value }) => {
                console.log("Submit", value);
                if (value.isDoc === true) {
                  fetch("http://localhost:3001/checkDoclogin?email=" + value.email +
                    "&password=" + value.password)
                    .then(res => res.json())
                    .then(res => {
                      if (res.data.length === 0) {
                        window.alert("登录信息有误");
                      } else {
                        window.location = "DocHome";
                        console.log(res.data);
                      }
                    });
                } else {
                  fetch("http://localhost:3001/checklogin?email=" + value.email +
                    "&password=" + value.password)
                    .then(res => res.json())
                    .then(res => {
                      if (res.data.length === 0) {
                        window.alert("登录信息有误");
                      } else {
                        window.location = "/Home";
                        console.log(res.data);
                      }
                    });
                }
              }
              }>
              <FormField
                color="#00739D"
                label="电子邮箱"
                name="email"
                type="email"
                placeholder = "请输入您的电子邮箱"
                required />
              <FormField
                color="#00739D"
                type='password'
                label="密码"
                name="password"
                placeholder = "请输入您的密码"
                required />
              <FormField
                component={CheckBox}
                checked={isDoctor}
                margin="large"
                label="我是医生"
                name="isDoc"
                onChange={(event) => {
                  this.setState({ isDoctor: event.target.checked })
                }}
              />
              <Box direction="column" align="center" >
                <Button style={{ textAlign: 'center' , margin:'1rem'}}
                 type="submit" label="登录" fill="horizontal" primary />
                <Button label="注册新账户"
                  style={{ textAlign: 'center' , margin:'0.5rem'}}
                  fill="horizontal"
                  href="/createAcc" />
              </Box>
            </Form>
          </Box>
        </Box>
      </Grommet>
    );
  }
}
export default withRouter(LogIn);