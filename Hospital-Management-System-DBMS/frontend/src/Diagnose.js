import React, { useState } from 'react';
import { 
  Grommet, Box, Button, Heading, TextArea, Layer, Card, CardBody, Text 
} from 'grommet';

// ⚫️⚪️ 纯黑白极简主题配置
const theme = {
  global: {
    colors: {
      brand: '#000000',      // 主色调：纯黑
      background: '#ffffff', // 全局背景：纯白
      focus: 'transparent',  // 移除蓝色聚焦圈
      control: '#000000',    // 输入框边框等
      text: '#000000',       // 全局文字
      'accent-1': '#333333', 
      'status-critical': '#000000',
      'light-2': '#fafafa',  // 极浅灰背景
      'light-3': '#eeeeee',
      border: '#000000',
    },
    font: {
      family: 'sans-serif',
      size: '15px'
    }
  },
  button: {
    border: {
      radius: '0px', // 采用直角风格更显极简
      width: '1px',
    },
    primary: {
      color: '#ffffff', // 黑底白字
    }
  },
  textArea: {
    extend: 'border-radius: 0px;'
  }
};

const drugData = {
  "感冒类": ["对乙酰氨基酚片", "氨咖黄敏胶囊", "伪麻黄碱缓释片"],
  "发烧退烧": ["布洛芬 200mg", "对乙酰氨基酚 500mg"],
  "肠胃药": ["蒙脱石散", "奥美拉唑 20mg", "黄连素片"],
  "外伤处理": ["云南白药喷雾", "碘伏消毒液", "布洛芬止痛片"]
};

const patientInfo = {
    "age": 32,
    "gender": "女",
    "pregnant": false,
    "pregnant_weeks": 0
};

const Diagnose = (props) => {
  const id = props.match?.params?.id;

  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  const [showDrugs, setShowDrugs] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const insertDrug = (drug) => {
    const newVal = prescription + (prescription ? "\n" : "") + drug;
    setPrescription(newVal);
  };

  const runAudit = () => {
    if (!prescription.trim()) {
      alert("请先填写处方内容");
      return;
    }

    setAuditLoading(true);
    setAuditResult(null);

    fetch("http://localhost:8000/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient: patientInfo,
        diagnosis: diagnosis,
        prescription: prescription
      })
    })
      .then(res => res.json())
      .then(data => {
        setAuditResult(data.result || "未发现明显异常");
        setAuditLoading(false);
      })
      .catch(() => {
        alert("审计连接失败，请检查后端服务");
        setAuditLoading(false);
      });
  };

  return (
    <Grommet theme={theme} full>
      <Box fill pad="large" gap="medium" background="white">

        {/* 顶部标题栏 */}
        <Box direction="row" justify="between" align="center" border={{ side: 'bottom', color: 'black', size: 'small' }} pb="small">
          <Heading level="2" margin="none" weight="bold">
             患者诊断系统
          </Heading>

          <Button 
            label="返回列表" 
            onClick={() => props.history.push("/ApptList")}
            plain
            style={{ textDecoration: 'underline' }}
          />
        </Box>

        {/* ---------------- 两栏布局 ---------------- */}
        <Box direction="row" gap="medium" height="50vh">

          {/* 左侧：诊断内容 */}
          <Box flex="1">
            <Card background="white" elevation="none" height="100%" border={{ color: 'black' }}>
              <CardBody pad="medium">
                <Heading level="4" margin={{ bottom: "small", top: "none" }}>【 诊断结果 】</Heading>
                <TextArea
                  placeholder="请输入患者的临床诊断信息..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  fill
                  style={{ border: 'none' }}
                />
              </CardBody>
            </Card>
          </Box>

          {/* 右侧：处方开具 */}
          <Box flex="1">
            <Card background="white" elevation="none" height="100%" border={{ color: 'black' }}>
              <CardBody pad="medium">
                <Box direction="row" justify="between" align="center" margin={{ bottom: "small" }}>
                  <Heading level="4" margin="none">【 处方内容 】</Heading>
                  <Button 
                    label="+ 常用药品库" 
                    onClick={() => setShowDrugs(true)} 
                    size="small"
                  />
                </Box>
                <TextArea
                  placeholder="请输入或从药库选择药品组合..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  fill
                  style={{ border: 'none' }}
                />
              </CardBody>
            </Card>
          </Box>
        </Box>

        {/* ✅ AI 处方审计模块 - 修复显示不全问题 */}
        <Card background="light-2" elevation="none" border={{ color: 'black', style: 'dashed' }}>
          <CardBody pad="medium" gap="small">
            <Box direction="row" align="center" gap="small">
              <Heading level="4" margin="none">AI 处方审计</Heading>
              <Button
                label={auditLoading ? "正在分析..." : "运行审计"}
                onClick={runAudit}
                disabled={auditLoading}
                primary
                size="small"
              />
            </Box>

            {auditResult && (
              <Box 
                margin={{ top: "xsmall" }} 
                pad="medium" 
                background="white" 
                border={{ color: 'black' }}
                style={{ minHeight: '60px' }} // 确保有最小高度
              >
                <Text size="small" weight="bold" margin={{ bottom: "xsmall" }}>审计详情：</Text>
                <Text size="small" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: '1.6' }}>
                  {auditResult}
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* ---- 底部提交 ---- */}
        <Box margin={{ top: "small" }}>
          <Button 
            label="确认并提交诊断报告" 
            primary
            size="large"
            onClick={() => {
              // 提交逻辑保持不变
              alert("诊断已提交");
            }}
          />
        </Box>

      </Box>

      {/* ---------------- 药品选择弹窗 ---------------- */}
      {showDrugs && (
        <Layer
          onEsc={() => setShowDrugs(false)}
          onClickOutside={() => setShowDrugs(false)}
        >
          <Box pad="large" gap="medium" width="450px" background="white" border={{ color: 'black', size: 'medium' }}>
            <Heading level="3" margin="none" textAlign="center">
              {selectedCategory ? `分类：${selectedCategory}` : "选择药品分类"}
            </Heading>

            <Box gap="small" overflow={{ vertical: "auto" }} height={{ max: "400px" }}>
              {!selectedCategory ? (
                Object.keys(drugData).map((cat) => (
                  <Button
                    key={cat}
                    label={cat}
                    onClick={() => setSelectedCategory(cat)}
                    hoverIndicator={{ color: 'light-3' }}
                    style={{ textAlign: 'left', padding: '10px' }}
                  />
                ))
              ) : (
                drugData[selectedCategory].map((drug) => (
                  <Button
                    key={drug}
                    label={`+ ${drug}`}
                    onClick={() => insertDrug(drug)}
                    plain
                    style={{ padding: '8px', borderBottom: '1px solid #eee' }}
                  />
                ))
              )}
            </Box>

            <Box direction="row" justify="between" margin={{ top: "medium" }}>
              {selectedCategory && (
                <Button
                  label="返回分类"
                  onClick={() => setSelectedCategory("")}
                  plain
                />
              )}
              <Button
                label="关闭退出"
                onClick={() => {
                  setShowDrugs(false);
                  setSelectedCategory("");
                }}
                primary
              />
            </Box>
          </Box>
        </Layer>
      )}
    </Grommet>
  );
};

export default Diagnose;