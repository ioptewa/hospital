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

// 假设 App.css 提供了基础样式，但我们主要使用 Grommet 替代
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
        // 如果值是 undefined 或空字符串，则默认为 " "，假设后端将其解释为“获取所有”或通配符
        const patName = (value === undefined || value === "") ? " " : value;
            
        // 注意：原始代码使用 email 作为查询参数名，但用户输入的是 name，这里假设后端处理逻辑保持不变
        // 如果后端确实希望接收 name 参数，这里应该使用 name 而不是 email
        fetch('http://localhost:3001/MedHistView?name=' + encodeURIComponent(patName) + '&variable=words')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
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
                                // 使用 patient.email 作为 key，假设它是唯一的。如果不是，可能需要更健壮的 key 生成方式。
                                <tr key={patient.email || `patient-${patient.Name}-${Math.random()}`} style={{ borderBottom: '1px solid #eee' }}>
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
                     <Box pad="medium" align="center"> {/* 居中显示未找到信息文本 */}
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
                    <Box // 这个 Box 是搜索表单的白色卡片容器
                        background="white"
                        pad="large" // 增加内部填充，为内容提供更多空间
                        elevation="small"
                        round="small"
                        margin={{ bottom: 'medium' }} // 与下方列表保持距离
                        width="medium" // 固定搜索卡片的宽度，使其更具视觉焦点
                    >
                        <Form
                            onSubmit={({ value }) => {
                                // 搜索字段名为 searchName
                                this.getNames(value.searchName);
                            }}>
                            <Heading level="4" margin={{ top: "none", bottom: "medium" }} textAlign="center">按姓名搜索患者</Heading> {/* 增加标题下方的外边距 */}
                            <FormField name="searchName" htmlFor="search-name-input" margin={{ bottom: 'small' }}> {/* 增加输入框下方的外边距 */}
                                <TextInput
                                    id="search-name-input"
                                    name="searchName"
                                    placeholder="输入患者姓名"
                                    required
                                />
                            </FormField>
                            <Box align="center" margin={{ top: 'small' }}> {/* 增加按钮上方的外边距并居中 */}
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