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

export class Settings extends Component {
  render() {
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
              设置 (Settings)
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
                  <Text size='large' weight='bold'> 修改密码 </Text>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={({ value }) => {
                      let email_in_use = '';
                      fetch('http://localhost:3001/userInSession')
                        .then(res => res.json())
                        .then(res => {
                          email_in_use = res.email;
                          fetch(
                            `http://localhost:3001/resetPasswordPatient?email=${email_in_use}&oldPassword=${value.oldPassword}&newPassword=${value.newPassword}`,
                            { method: 'POST' }
                          )
                            .then(res => res.json())
                            .then(res => {
                              let didUpdate = res.data.affectedRows;
                              if (didUpdate === 0) {
                                window.alert('旧密码错误。');
                              } else {
                                window.alert('密码修改成功！');
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
                    <Box align='center' pad={{ top: 'medium' }}>
                      <Button type='submit' label='确认修改' primary />
                    </Box>
                  </Form>
                </CardBody>
              </Card>

              {/* 修改邮箱卡片 */}
              <Card elevation='medium' background='white' pad='medium' round='medium'>
                <CardHeader pad={{ bottom: 'small' }}>
                  <Text size='large' weight='bold'> 修改电子邮箱 </Text>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={({ value }) => {
                      fetch('http://localhost:3001/userInSession')
                        .then(res => res.json())
                        .then(res => {
                          const oldEmail = res.email;
                          const who = res.who;
                          const url =
                            who === 'pat'
                              ? `http://localhost:3001/resetEmailPatient?oldEmail=${oldEmail}&newEmail=${value.newEmail}&password=${value.password}`
                              : `http://localhost:3001/resetEmailDoctor?oldEmail=${oldEmail}&newEmail=${value.newEmail}&password=${value.password}`;

                          fetch(url, { method: 'POST' })
                            .then(res => res.json())
                            .then(res => {
                              let didUpdate = res.data.affectedRows;
                              if (didUpdate === 0) {
                                window.alert('密码错误或该邮箱已被占用。');
                              } else {
                                window.alert('邮箱修改成功！');
                              }
                            });
                        });
                    }}
                  >
                    <FormField
                      label='验证密码'
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
                    <Box align='center' pad={{ top: 'medium' }}>
                      <Button type='submit' label='确认修改' primary />
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

export default Settings;