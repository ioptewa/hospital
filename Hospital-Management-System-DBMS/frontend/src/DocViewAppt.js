import React, { Component } from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
    Text,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody
} from 'grommet';
import { FormPreviousLink, FormSchedule, Validate } from 'grommet-icons'; // 移除了 Trash 图标，因为不再使用

import './App.css';

const theme = {
    global: {
        colors: {
            brand: '#000000',
            focus: '#000000',
            "status-ok": "#10B981",    // 绿色
            "status-warning": "#FFB020", // 橙色
            "status-error": "#FF4040",   // 红色
            "light-1": "#F8F9FA",
        },
        font: {
            family: 'Lato',
        },
    },
    table: {
        header: {
            extend: `font-weight: bold; color: #444;`
        }
    }
};

export class DocViewAppt extends Component {
    state = { apptlist: [], loading: true }

    componentDidMount() {
        this.getNames();
    }

    getNames() {
        // 这里的 fetch 保持你原有的逻辑
        // 如果后端支持，建议把 http://localhost:3001 写在配置文件里
        fetch('http://localhost:3001/doctorViewAppt?email=' + this.props.email) // 注意：如果你需要传参确保这里正确
            .then(res => res.json())
            .then(res => this.setState({ apptlist: res.data, loading: false }))
            .catch(error => {
                console.error("Error fetching appointments:", error);
                this.setState({ loading: false });
            });
    }

    render() {
        const { apptlist, loading } = this.state;

        // 辅助函数：渲染状态徽章
        const StatusBadge = ({ status }) => {
            const isDone = status !== "NotDone";
            return (
                <Box
                    background={isDone ? "status-ok" : "status-warning"}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    align="center"
                    width={{ min: "80px" }}
                >
                    <Text size="small" color="white" weight="bold">
                        {isDone ? "已完成" : "待处理"}
                    </Text>
                </Box>
            );
        };

        const Header = () => (
            <Box
                tag='header'
                background='brand'
                pad={{ vertical: 'small', horizontal: 'medium' }}
                elevation='medium'
                justify='between'
                direction='row'
                align='center'
                flex={false}
            >
                <Box direction="row" align="center" gap="small">
                    <Button 
                        icon={<FormPreviousLink color="white" />} 
                        href="/DocHome" // 假设你有一个医生主页，如果没有可以改回 "/"
                        hoverIndicator 
                    />
                    <Heading level='3' margin='none' color="white">医院管理系统</Heading>
                </Box>
            </Box>
        );

        const Body = () => (
            <Box align="center" pad="medium" width="100%">
                <Heading level="2" margin={{ top: 'none', bottom: 'medium' }}>我的预约列表</Heading>

                {/* 使用 Card 包裹表格，增加卡片质感 */}
                <Card background="white" elevation="small" round="small" width="large" style={{ maxWidth: '1400px', width: '100%' }}>
                    <CardBody pad="none">
                        
                        {/* --- 核心修改：滚动容器 --- */}
                        {/* Box overflow="auto" 允许内容超出时出现滚动条 */}
                        <Box overflow="auto" height={{ max: "70vh" }}> 
                            
                            {apptlist.length > 0 ? (
                                <Table stickyHeader>
                                    <TableHeader background="light-2">
                                        <TableRow>
                                            {/* whiteSpace: 'nowrap' 防止表头换行 */}
                                            <TableCell scope="col" border="bottom" style={{ whiteSpace: 'nowrap' }}><strong>编号</strong></TableCell>
                                            <TableCell scope="col" border="bottom" style={{ whiteSpace: 'nowrap' }}><strong>患者姓名</strong></TableCell>
                                            <TableCell scope="col" border="bottom" style={{ whiteSpace: 'nowrap' }}><strong>日期</strong></TableCell>
                                            <TableCell scope="col" border="bottom" style={{ whiteSpace: 'nowrap' }}><strong>时间</strong></TableCell>
                                            {/* 主诉和症状允许换行，但设置最小宽度以免太窄 */}
                                            <TableCell scope="col" border="bottom" style={{ minWidth: '150px' }}><strong>主诉</strong></TableCell>
                                            <TableCell scope="col" border="bottom" style={{ minWidth: '150px' }}><strong>症状</strong></TableCell>
                                            <TableCell scope="col" border="bottom" style={{ whiteSpace: 'nowrap' }}><strong>状态</strong></TableCell>
                                            <TableCell scope="col" border="bottom" style={{ whiteSpace: 'nowrap' }}><strong>诊断</strong></TableCell>
                                            {/* 已删除：管理列的表头 */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {apptlist.map(appt => (
                                            <TableRow key={appt.id}>
                                                <TableCell>
                                                    <Text weight="bold">{appt.id}</Text>
                                                </TableCell>
                                                <TableCell>{appt.name}</TableCell>
                                                <TableCell style={{ whiteSpace: 'nowrap' }}>
                                                    {new Date(appt.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>{appt.starttime}</TableCell>
                                                <TableCell>
                                                    <Text size="small" color="dark-2">{appt.concerns}</Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text size="small" color="dark-2">{appt.symptoms}</Text>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={appt.status} />
                                                </TableCell>
                                                <TableCell>
                                                    {/* 诊断按钮 */}
                                                    <Button
                                                        label="去诊断"
                                                        icon={<Validate size="small" />}
                                                        href={`/Diagnose/${appt.id}`}
                                                        primary
                                                        size="small"
                                                        color="brand"
                                                        style={{ whiteSpace: 'nowrap' }}
                                                    />
                                                </TableCell>
                                                {/* 已删除：管理列的内容（取消按钮/不可操作文本） */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Box pad="large" align="center" justify="center" gap="small">
                                    {!loading && (
                                        <>
                                            <FormSchedule size="large" color="neutral-gray" />
                                            <Text size="medium" color="dark-4">暂无预约记录</Text>
                                        </>
                                    )}
                                    {loading && <Text>加载中...</Text>}
                                </Box>
                            )}
                        </Box>
                    </CardBody>
                </Card>
            </Box>
        );

        return (
            <Grommet full={true} theme={theme}>
                <Box fill={true} background="light-1">
                    <Header />
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default DocViewAppt;