import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Text,
} from 'grommet';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#2B2B2B',
      focus: '#000000',
      background: '#F8F9FA',
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
    {...props}
  />
);

export class DocSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordMessage: '',
      emailMessage: '',
    };
  }

  // 统一处理消息显示的函数
  showMessage(type, message) {
    if (type === 'password') {
      this.setState({ passwordMessage: message });
      setTimeout(() => this.setState({ passwordMessage: '' }), 3000);
    } else if (type === 'email') {
      this.setState({ emailMessage: message });
      setTimeout(() => this.setState({ emailMessage: '' }), 3000);
    }
  }

  render() {
    const { passwordMessage, emailMessage } = this.state;
    return (
      <Grommet theme={theme} full>
        <Box fill>
          {/* 顶栏 */}
          <AppBar>
            <a
              style={{ color: 'white', textDecoration: 'none' }}
              href='/'
            >
              <Heading level='3' margin='none' color='white'>
                医院管理系统
              </Heading>
            </a>
          </AppBar>

          {/* 主体区域 */}
          <Box pad='large' align='center'>
            <Heading level='2' margin='small'>
              医生设置
            </Heading>

            <Grid
              columns={['medium', 'medium']}
              gap='large'
              pad='medium'
              responsive
            >
              {/* 修改密码卡片 */}
              <Card elevation='medium' background='white' pad='medium' round='medium'>
                <CardHeader pad={{ bottom: 'small' }}>
                  <Text size='large' weight='bold'>修改密码</Text>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={({ value }) => {
                      fetch('http://localhost:3001/userInSession')
                        .then(res => res.json())
                        .then(res => {
                          const email_in_use = res.email;
                          fetch(
                            `http://localhost:3001/resetPasswordDoctor?email=${email_in_use}&oldPassword=${value.oldPassword}&newPassword=${value.newPassword}`,
                            { method: 'POST' }
                          )
                            .then(res => res.json())
                            .then(res => {
                              let didUpdate = res.data.affectedRows;
                              if (didUpdate === 0) {
                                // 替换 window.alert
                                this.showMessage('password', '旧密码不正确。');
                              } else {
                                // 替换 window.alert
                                this.showMessage('password', '密码重置成功！');
                              }
                            });
                        });
                    }}
                  >
                    <FormField
                      label='旧密码'
                      name='oldPassword'
                      type='password'
                      required
                    />
                    <FormField
                      label='新密码'
                      name='newPassword'
                      type='password'
                      required
                    />
                    {passwordMessage && (
                      <Text size="small" color={passwordMessage.includes('成功') ? 'status-ok' : 'status-error'} margin={{ top: 'small', bottom: 'small' }}>
                        {passwordMessage}
                      </Text>
                    )}
                    <Box align='center' pad={{ top: 'medium' }}>
                      <Button type='submit' label='修改密码' primary />
                    </Box>
                  </Form>
                </CardBody>
              </Card>

              {/* 修改邮箱卡片 */}
              <Card elevation='medium' background='white' pad='medium' round='medium'>
                <CardHeader pad={{ bottom: 'small' }}>
                  <Text size='large' weight='bold'>修改电子邮箱</Text>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={({ value }) => {
                      fetch('http://localhost:3001/userInSession')
                        .then(res => res.json())
                        .then(res => {
                          const oldEmail = res.email;
                          // 调用医生邮箱修改接口（需要密码验证）
                          fetch(
                            `http://localhost:3001/resetEmailDoctor?oldEmail=${oldEmail}&newEmail=${value.newEmail}&password=${value.password}`,
                            { method: 'POST' }
                          )
                            .then(res => res.json())
                            .then(res => {
                              let didUpdate = res.data.affectedRows;
                              if (didUpdate === 0) {
                                // 替换 window.alert
                                this.showMessage('email', '密码不正确或新邮箱已被注册。');
                              } else {
                                // 替换 window.alert
                                this.showMessage('email', '电子邮箱重置成功！');
                              }
                            });
                        });
                    }}
                  >
                    <FormField
                      label='密码 (用于验证)'
                      name='password'
                      type='password'
                      required
                    />
                    <FormField
                      label='新电子邮箱'
                      name='newEmail'
                      type='email'
                      required
                    />
                    {emailMessage && (
                      <Text size="small" color={emailMessage.includes('成功') ? 'status-ok' : 'status-error'} margin={{ top: 'small', bottom: 'small' }}>
                        {emailMessage}
                      </Text>
                    )}
                    <Box align='center' pad={{ top: 'medium' }}>
                      <Button type='submit' label='修改电子邮箱' primary />
                    </Box>
                  </Form>
                </CardBody>
              </Card>
            </Grid>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default DocSettings;
