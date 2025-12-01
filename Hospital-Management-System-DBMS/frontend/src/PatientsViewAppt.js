import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Button
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

export class PatientsViewAppointments extends Component {
    state = { appointmentsState: [] }
    componentDidMount() {
        this.getNames("");
    }
    getNames(value) {
        let patName = value;
        console.log(patName);
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                var string_json = JSON.stringify(res);
                var email_json = JSON.parse(string_json);
                let email_in_use = email_json.email;
                fetch('http://localhost:3001/patientViewAppt?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ appointmentsState: res.data });
                    });
            });
    }
    render() {
        const { appointmentsState } = this.state;
        const Body = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>预约日期</th>
                                <th>开始时间</th>
                                <th>结束时间</th>
                                <th>就诊原因</th>
                                <th>症状</th>
                                <th>状态</th>
                                <th>诊断</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentsState.map(patient =>
                                <tr key={patient.user}>
                                    <td align="center" >
                                        {new Date(patient.theDate).toLocaleDateString().substring(0, 10)}
                                    </td>
                                    <td align="center" >{patient.theStart.substring(0, 5)}</td>
                                    <td align="center" >{patient.theEnd.substring(0, 5)}</td>
                                    <td align="center">{patient.theConcerns} </td>
                                    <td align="center">{patient.theSymptoms}</td>
                                    <td align="center">{patient.status === 'NotDone' ? '未就诊' : '已就诊'}</td>
                                    <td>
                                        <Button label="查看诊断"
                                        href={`/showDiagnoses/${patient.ID}`}
                                        ></Button>     
                                    </td> 
                                    <td>
                                    {   patient.status==="NotDone"?
                                    //1:未就诊，cancel
                                        <Button label="取消预约"
                                        onClick = {() => {
                                            if(window.confirm("确定要取消这个预约吗？")) {
                                                fetch('http://localhost:3001/deleteAppt?uid='+ patient.ID)
                                                window.location.reload()
                                            }
                                        }}
                                        ></Button>
                                        :
                                       //已就诊
                                      <span style={{color: "gray", padding: "10px"}}>已完成</span>
                                    }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        return (
            <Grommet theme={theme} full>
                <Box >
                    <AppBar>
                    <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>医院管理系统</Heading></a>
                    </AppBar>
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default PatientsViewAppointments;