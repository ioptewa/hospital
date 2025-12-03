import React, { Component} from 'react';

import {
    Box,
    Button,
    Heading,
    Grommet,
    FormField,
    Form,
    Text,
    TextInput
} from 'grommet';

// 假设 App.css 提供了基础样式，但我们主要使用 Grommet/Tailwind 替代
import './App.css'; 

const theme = {
    global: {
      colors: {
        brand: '#000000',
        focus: '#000000',
        background: '#F8F9FA'
      },
      font: {
        family: 'Lato',
      },
    },
  };
  
export class ViewMedHist extends Component {
    
    // 状态用于存储病历历史列表
    state = { medhiststate: [] }

    componentDidMount() {
        // 初始加载时获取所有患者
        this.getNames("");
    }

    // 获取患者姓名的函数，支持按姓名搜索
    getNames(value) {
        let patName = " ";
        if (value !== undefined)
            patName = value;
            
        // 注意：原始代码使用 email 作为查询参数名，但用户输入的是 name，这里假设后端处理逻辑保持不变
        // 如果后端确实希望接收 name 参数，这里应该使用 name 而不是 email
        fetch('http://localhost:3001/MedHistView?name=' + patName + '&variable=words')
        .then(res => res.json())
        .then(res => this.setState({ medhiststate: res.data }))
        .catch(error => console.error("Error fetching medical history:", error));
    }

    render() {
        const { medhiststate } = this.state;

        // 头部组件 (AppBar)
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
               <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none' color="white">医院管理系统</Heading></a>

            </Box>
        );

        // 主体内容组件（包含搜索结果表格）
        const Body = () => (
            <Box width="large" pad="none" align="center" background="white" elevation="small" round="small">
                {/* 表格容器 */}
                <Box overflow="auto" width="100%">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f5f5f5' }}>
                            <tr>
                                <th style={tableHeaderStyle}>姓名</th>
                                <th style={tableHeaderStyle}>档案</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {medhiststate.map(patient =>
                                <tr key={patient.email || patient.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tableCellStyle}>{patient.Name} </td>
                                    <td style={tableCellStyle}>
                                        <Button 
                                            label="查看病历档案" 
                                            href={'/ViewOneHistory/' + patient.email}
                                            primary
                                            size="small"
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box>
                {medhiststate.length === 0 && (
                     <Box pad="medium">
                         <Text>未找到患者信息。</Text>
                     </Box>
                )}
            </Box>
        );
        
        // 样式定义
        const tableHeaderStyle = { padding: '12px', textAlign: 'left', fontWeight: 'bold' };
        const tableCellStyle = { padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' };


        return (
            <Grommet full={true} theme={theme}>
                <Header />
                <Box fill={true} align="center" background="light-1" pad="medium">
                    {/* 搜索表单 */}
                    <Box background="white" pad="medium" elevation="small" round="small" margin={{ bottom: 'medium' }}>
                        <Form
                            onSubmit={({ value }) => {
                                // 搜索字段名为 email，但值可能是 patient name
                                this.getNames(value.searchName);
                            }}>
                            <Heading level="4" margin={{ top: "none", bottom: "small" }} textAlign="center">按姓名搜索患者</Heading>
                            <FormField name="searchName" htmlFor="search-name-input">
                                <TextInput
                                    id="search-name-input"
                                    name="searchName"
                                    placeholder="输入患者姓名"
                                    required
                                />
                            </FormField>
                            <Box align="center" pad={{ top: 'small' }}>
                                <Button type="submit" primary label="搜索" />
                            </Box>
                        </Form>
                    </Box>
                    
                    {/* 患者列表 */}
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default ViewMedHist;
