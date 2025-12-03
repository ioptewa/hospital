import React, { Component} from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
    Text, // Add Text for table content if needed, although mostly using raw HTML structure
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

export class DocViewAppt extends Component {
    // 状态用于存储预约列表
    state = { apptlist: [] }

    componentDidMount() {
        this.getNames();
    }

    // 获取预约信息的函数
    getNames() {
        fetch('http://localhost:3001/doctorViewAppt')
        .then(res => res.json())
        .then(res => this.setState({ apptlist: res.data }))
        .catch(error => console.error("Error fetching appointments:", error));
    }

    render() {
        const { apptlist } = this.state;
        
        // 头部组件
        const Header = () => (
            <Box
                tag='header'
                background='brand'
                pad='small'
                elevation='small'
                justify='between'
                direction='row'
                align='center'
                flex={false}
            >
                {/* 医院管理系统标题和首页链接 */}
                <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none' color="white">医院管理系统</Heading></a>
            </Box>
        );

        // 主体内容组件
        const Body = () => (
            <Box align="center" pad="medium">
                <Heading level="2" margin={{ top: 'none', bottom: 'medium' }}>我的预约列表</Heading>
                
                {/* 仅使用 Box 作为容器，保持原始的 HTML table 结构 */}
                <Box width="xlarge" background="white" pad="medium" elevation="small" round="small">
                    {apptlist.length > 0 ? (
                        <table className="table table-hover" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f5f5f5' }}>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>编号</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>患者姓名</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>日期</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>开始时间</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>主诉</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>症状</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>状态</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {apptlist.map(appt =>
                                    <tr key={appt.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{appt.id}</td>
                                        <td style={{ padding: '12px' }}>{appt.name}</td>
                                        <td style={{ padding: '12px' }}>{new Date(appt.date).toLocaleDateString()} </td>
                                        <td style={{ padding: '12px' }}>{appt.starttime}</td>
                                        <td style={{ padding: '12px' }}>{appt.concerns}</td>
                                        <td style={{ padding: '12px' }}>{appt.symptoms}</td>
                                        <td style={{ padding: '12px' }}>{appt.status === "NotDone" ? "未完成" : appt.status}</td>
                                        <td style={{ padding: '12px' }}>
                                            <Button label="诊断"
                                            href={`/Diagnose/${appt.id}`}
                                            primary
                                            size="small"
                                            ></Button> 
                                        </td> 
                                        <td style={{ padding: '12px' }}>
                                            {appt.status === "NotDone"?
                                                <Button label="取消"
                                                color="status-critical"
                                                size="small"
                                                onClick = {() => {
                                                    fetch('http://localhost:3001/deleteAppt?uid='+ appt.id, { method: 'DELETE' })
                                                    .then(() => {
                                                        // 成功取消后，重新获取列表数据
                                                        this.getNames();
                                                    })
                                                    .catch(error => console.error("Error canceling appointment:", error));
                                                }}
                                                ></Button>
                                            : <Text size="small" color="dark-3">已处理</Text>}
                                        </td> 
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <Box pad="large" align="center">
                            <Text size="large">暂无预约信息。</Text>
                        </Box>
                    )}
                </Box>
            </Box>

        );
        
        return (
            <Grommet full={true} theme={theme}>
                <Header />
                <Box fill={true} background="light-1">
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default DocViewAppt;
