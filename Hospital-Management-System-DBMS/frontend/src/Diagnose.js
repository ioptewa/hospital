import React, { useState } from 'react';
import { 
  Grommet, Box, Button, Heading, TextArea, Layer, Card, CardBody 
} from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#228BE6',
      background: '#f5f7fa'
    },
    font: {
      family: 'Roboto',
      size: '15px'
    }
  }
};

const drugData = {
  "感冒类": ["对乙酰氨基酚片（泰诺）", "氨咖黄敏胶囊（感康）", "伪麻黄碱缓释片"],
  "发烧退烧": ["布洛芬 200mg", "对乙酰氨基酚 500mg"],
  "肠胃药": ["蒙脱石散（思密达）", "奥美拉唑 20mg", "黄连素片"],
  "外伤/跌倒": ["云南白药喷雾", "碘伏消毒液", "布洛芬止痛片"]
};

const Diagnose = (props) => {

  const id = props.match.params.id;


  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");

  const [showDrugs, setShowDrugs] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const insertDrug = (drug) => {
    const newVal = prescription + (prescription ? "\n" : "") + drug;
    setPrescription(newVal);
  };

  return (
    <Grommet theme={theme} full>
      <Box fill pad="large" gap="medium">

        <Box direction="row" justify="between" align="center">
          <Heading level="2" margin="none" color="brand">
            🧑‍⚕️ Diagnose Patient
          </Heading>

          {/* 返回按钮 */}
          <Button 
            label="返回" 
            onClick={() => props.history.push("/ApptList")}
          />
        </Box>

        {/* ---------------- 两栏布局：等宽 + 等高 ---------------- */}
        <Box direction="row" gap="medium" height="60vh">

          {/* 左侧：Diagnosis */}
          <Box flex="1">
            <Card background="white" elevation="small" round="small" height="100%">
              <CardBody pad="medium" gap="small">
                <Heading level="3" margin="small">确诊 Diagnosis</Heading>

                <Box flex overflow="auto">
                  <TextArea
                    placeholder="请输入确诊内容…"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    fill
                  />
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* 右侧：Prescription */}
          <Box flex="1">
            <Card background="white" elevation="small" round="small" height="100%">
              <CardBody pad="medium" gap="small">

                <Box direction="row" justify="between" align="center">
                  <Heading level="3" margin="small">处方 Prescription</Heading>

                  <Button 
                    label="🩺 常用药物" 
                    primary 
                    onClick={() => setShowDrugs(true)}
                  />
                </Box>

                <Box flex overflow="auto">
                  <TextArea
                    placeholder="请输入或选择药物…"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    fill
                  />
                </Box>

              </CardBody>
            </Card>
          </Box>

        </Box>

        {/* ---- 提交按钮 ---- */}
        <Button 
          label="提交诊断与处方" 
          primary 
          size="large"
          onClick={() => {
            fetch(
              "http://localhost:3001/diagnose?diagnosis=" +
              diagnosis +
              "&prescription=" +
              prescription +
              "&id=" +
              id
            )
            .then(() => {
              window.alert("Diagnosis Submitted!");
              props.history.push("/ApptList"); // 提交后跳转
            })
            .catch(() => {
              window.alert("Failed to submit");
            });
          }}
        />

      </Box>

      {/* ---------------- 药物选择弹窗 ---------------- */}
      {showDrugs && (
        <Layer
          onEsc={() => setShowDrugs(false)}
          onClickOutside={() => {
            setSelectedCategory("");
            setShowDrugs(false);
          }}
        >
          <Box pad="medium" gap="small" width="medium">
            <Heading level="3">选择药物类别</Heading>

            {!selectedCategory && (
              <Box gap="small">
                {Object.keys(drugData).map(cat => (
                  <Button 
                    key={cat}
                    label={cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                ))}
              </Box>
            )}

            {selectedCategory && (
              <Box gap="small">
                <Heading level="4">{selectedCategory}</Heading>

                {drugData[selectedCategory].map(drug => (
                  <Button 
                    key={drug}
                    label={drug}
                    onClick={() => insertDrug(drug)}
                  />
                ))}

                <Button 
                  label="返回分类"
                  onClick={() => setSelectedCategory("")}
                  margin={{ top: "medium" }}
                />
              </Box>
            )}

            <Button 
              label="关闭"
              onClick={() => {
                setSelectedCategory("");
                setShowDrugs(false);
              }}
              margin={{ top: "medium" }}
            />
          </Box>
        </Layer>
      )}
    </Grommet>
  );
};

export default Diagnose;
