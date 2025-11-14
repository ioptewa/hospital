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
                HMS
              </Heading>
            </a>
          </AppBar>

          {/* 主体区域 */}
          <Box pad='large' align='center'>
            <Heading level='2' margin='small'>
              Doctor Settings
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
                  <Text size='large' weight='bold'>Change Password</Text>
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
                                window.alert('Incorrect old password.');
                              } else {
                                window.alert('Password reset successful!');
                              }
                            });
                        });
                    }}
                  >
                    <FormField
                      label='Old Password'
                      name='oldPassword'
                      type='password'
                      required
                    />
                    <FormField
                      label='New Password'
                      name='newPassword'
                      type='password'
                      required
                    />
                    <Box align='center' pad={{ top: 'medium' }}>
                      <Button type='submit' label='Change Password' primary />
                    </Box>
                  </Form>
                </CardBody>
              </Card>

              {/* 修改邮箱卡片 */}
              <Card elevation='medium' background='white' pad='medium' round='medium'>
                <CardHeader pad={{ bottom: 'small' }}>
                  <Text size='large' weight='bold'>Change Email</Text>
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
                                window.alert('Incorrect password or email already exists.');
                              } else {
                                window.alert('Email reset successful!');
                              }
                            });
                        });
                    }}
                  >
                    <FormField
                      label='Password (for verification)'
                      name='password'
                      type='password'
                      required
                    />
                    <FormField
                      label='New Email'
                      name='newEmail'
                      type='email'
                      required
                    />
                    <Box align='center' pad={{ top: 'medium' }}>
                      <Button type='submit' label='Change Email' primary />
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
