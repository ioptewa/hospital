import React, { Component } from "react";
import {
  Box,
  Heading,
  Grommet,
  Card,
  Text,
  Button,
  Grid
} from "grommet";

// 主题配置
const theme = {
  global: {
    colors: { 
      brand: "#2563eb",
      accent: "#10b981",
      neutral: "#6b7280",
      background: "#f8fafc"
    },
    font: { 
      family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
    }
  },
  card: {
    elevation: "medium",
    hover: {
      elevation: "large"
    }
  }
};

// 图表颜色配置
const CHART_COLORS = {
  primary: "#2563eb",
  secondary: "#10b981",
  tertiary: "#8b5cf6",
  grid: "#e2e8f0",
  background: "#ffffff"
};

// 加载状态组件
const LoadingSpinner = () => (
  <Box align="center" justify="center" pad="large">
    <Text>Loading statistics...</Text>
  </Box>
);

// 空状态组件
const EmptyState = ({ message }) => (
  <Box align="center" justify="center" pad="large" background="light-2" round="small">
    <Text color="dark-4">{message}</Text>
  </Box>
);

// 纯CSS图表组件
const BarChart = ({ data, labels, height = 200, color = CHART_COLORS.primary }) => {
  if (!data || data.length === 0) {
    return <EmptyState message="No data available for bar chart" />;
  }

  const maxValue = Math.max(...data);
  
  return (
    <Box direction="row" align="end" justify="around" height={`${height}px`} border={{ side: 'bottom', color: CHART_COLORS.grid }}>
      {data.map((value, index) => (
        <Box 
          key={index} 
          align="center" 
          justify="end" 
          fill="horizontal" 
          margin={{ horizontal: "xsmall" }}
          flex="grow"
        >
          <Box
            background={color}
            width="60%"
            height={`${(value / maxValue) * 85}%`}
            style={{ minHeight: "4px" }}
            round={{ corner: "top", size: "xsmall" }}
          />
          <Text size="small" margin={{ top: "xsmall" }} textAlign="center">
            {labels[index]}
          </Text>
          <Text size="small" weight="bold" margin={{ top: "xxsmall" }}>
            {value}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

const LineChart = ({ data, labels, height = 200, color = CHART_COLORS.primary }) => {
  if (!data || data.length === 0) {
    return <EmptyState message="No data available for line chart" />;
  }

  const maxValue = Math.max(...data);
  const points = data.map((value, index) => 
    `${(index / (data.length - 1)) * 100},${100 - (value / maxValue) * 90}`
  ).join(" ");

  return (
    <Box height={`${height}px`} justify="center">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {/* 网格线 */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke={CHART_COLORS.grid}
            strokeWidth="0.5"
          />
        ))}
        
        {/* 数据线 */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* 数据点 */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (value / maxValue) * 90;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              stroke={CHART_COLORS.background}
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* X轴标签 */}
      <Box direction="row" justify="between" margin={{ top: "small" }}>
        {labels.map((label, index) => (
          <Text 
            key={index} 
            size="small" 
            style={{ 
              transform: 'rotate(-45deg)',
              transformOrigin: 'center'
            }}
            textAlign="center"
          >
            {label}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

const PieChart = ({ data, labels, colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary] }) => {
  if (!data || data.length === 0) {
    return <EmptyState message="No data available for pie chart" />;
  }

  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = 0;
  
  const segments = data.map((value, index) => {
    const percentage = (value / total) * 100;
    const angle = (value / total) * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const startX = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
    const startY = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
    
    const endAngle = currentAngle + angle;
    const endX = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
    const endY = 50 + 40 * Math.sin(endAngle * Math.PI / 180);
    
    const pathData = [
      `M 50 50`,
      `L ${startX} ${startY}`,
      `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(" ");
    
    const segment = {
      path: pathData,
      color: colors[index % colors.length],
      percentage: percentage.toFixed(1),
      label: labels[index],
      value: value
    };
    
    currentAngle = endAngle;
    return segment;
  });

  return (
    <Box direction="row" align="center" justify="center" gap="medium" wrap>
      <Box width={{ min: "200px" }} height="200px" flex="shrink">
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill={segment.color}
              stroke={CHART_COLORS.background}
              strokeWidth="2"
            />
          ))}
        </svg>
      </Box>
      
      <Box flex="grow">
        {segments.map((segment, index) => (
          <Box 
            key={index} 
            direction="row" 
            align="center" 
            gap="small" 
            margin={{ bottom: "small" }}
            pad="small"
            background="light-1"
            round="small"
          >
            <Box
              width="16px"
              height="16px"
              background={segment.color}
              round="xsmall"
            />
            <Box flex="grow">
              <Text size="small" weight="bold">{segment.label}</Text>
              <Text size="small" color="dark-4">
                {segment.value} ({segment.percentage}%)
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// 统计卡片组件
const StatCard = ({ title, value, subtitle, color = "brand" }) => (
  <Card 
    background="white" 
    pad="medium" 
    flex="grow" 
    elevation="small"
  >
    <Box>
      <Text size="small" color="dark-4" weight="500">{title}</Text>
      <Heading level="2" margin={{ vertical: "xsmall" }} color={color}>
        {value}
      </Heading>
      <Text size="small" color="dark-4">{subtitle}</Text>
    </Box>
  </Card>
);

// API配置
const API_CONFIG = {
  baseURL: "http://localhost:3001",
  endpoints: {
    statistics: "/doctorStatistics"
  },
  fallbackData: {
    apptStats: [
      { month: "Jan", count: 45, newPatients: 18 },
      { month: "Feb", count: 52, newPatients: 22 },
      { month: "Mar", count: 68, newPatients: 29 },
      { month: "Apr", count: 58, newPatients: 24 },
      { month: "May", count: 72, newPatients: 31 },
      { month: "Jun", count: 65, newPatients: 27 },
    ],
    genderStats: [
      { gender: "Male", value: 95 },
      { gender: "Female", value: 110 },
      { gender: "Other", value: 25 },
    ]
  }
};

export default class DocStatistics extends Component {
  state = {
    apptStats: [],
    genderStats: [],
    loading: true,
    error: null
  };

  async componentDidMount() {
    await this.fetchStatistics();
  }

  fetchStatistics = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.statistics}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.setState({
        apptStats: data.apptStats || API_CONFIG.fallbackData.apptStats,
        genderStats: data.genderStats || API_CONFIG.fallbackData.genderStats,
        loading: false
      });
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      this.setState({
        apptStats: API_CONFIG.fallbackData.apptStats,
        genderStats: API_CONFIG.fallbackData.genderStats,
        loading: false,
        error: error.message
      });
    }
  };

  render() {
    const { apptStats, genderStats, loading, error } = this.state;
    
    // 计算统计数据
    const totalAppointments = apptStats.reduce((sum, item) => sum + item.count, 0);
    const totalNewPatients = apptStats.reduce((sum, item) => sum + item.newPatients, 0);
    const avgAppointments = apptStats.length > 0 ? Math.round(totalAppointments / apptStats.length) : 0;

    return (
      <Grommet theme={theme} full>
        <Box fill pad="medium" background="background">
          {/* 页面标题：增加底部margin，避免被下方卡片遮挡 */}
          <Box margin={{ bottom: "xlarge" }}>
            <Heading level="2" margin="none" color="brand">
              📊 Doctor Statistics
            </Heading>
            <Text size="large" margin={{ top: "xsmall" }} color="dark-4">
              Overview of appointments & patient demographics
            </Text>
          </Box>

          {/* 错误提示 */}
          {error && (
            <Card background="status-critical" pad="medium" margin={{ bottom: "medium" }}>
              <Box direction="row" align="center" gap="small">
                <Text weight="bold">Error:</Text>
                <Text>{error}</Text>
                <Button 
                  label="Retry" 
                  onClick={this.fetchStatistics}
                  size="small"
                />
              </Box>
            </Card>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* 统计概览卡片：用Grid均分三列，确保响应式 */}
              <Grid 
                columns={["1fr", "1fr", "1fr"]} 
                gap="medium" 
                margin={{ bottom: "medium" }}
              >
                <StatCard 
                  title="Total Appointments" 
                  value={totalAppointments.toLocaleString()} 
                  subtitle="All time"
                  color="brand"
                />
                <StatCard 
                  title="New Patients" 
                  value={totalNewPatients.toLocaleString()} 
                  subtitle="This period"
                  color="accent"
                />
                <StatCard 
                  title="Monthly Average" 
                  value={avgAppointments.toLocaleString()} 
                  subtitle="Appointments per month"
                  color="neutral"
                />
              </Grid>

              {/* 图表区域：用Box的flex布局，让每个Card自适应高度 */}
              <Box gap="medium" flex="grow">
                {/* 折线图 - 月度预约 */}
                <Card background="white" pad="medium" elevation="small" flex="grow">
                  <Heading level="3" margin="none" color="dark-1">
                    Monthly Appointments Trend
                  </Heading>
                  <Box pad={{ top: "medium" }} flex="grow">
                    <LineChart 
                      data={apptStats.map(item => item.count)}
                      labels={apptStats.map(item => item.month)}
                      height={300}
                    />
                  </Box>
                </Card>

                {/* 柱状图 - 新患者 */}
                <Card background="white" pad="medium" elevation="small" flex="grow">
                  <Heading level="3" margin="none" color="dark-1">
                    New Patients per Month
                  </Heading>
                  <Box pad={{ top: "medium" }} flex="grow">
                    <BarChart 
                      data={apptStats.map(item => item.newPatients)}
                      labels={apptStats.map(item => item.month)}
                      height={300}
                      color={CHART_COLORS.secondary}
                    />
                  </Box>
                </Card>

                {/* 饼图 - 性别比例 */}
                <Card background="white" pad="medium" elevation="small" flex="grow">
                  <Heading level="3" margin="none" color="dark-1">
                    Patient Gender Distribution
                  </Heading>
                  <Box pad="medium" flex="grow">
                    <PieChart 
                      data={genderStats.map(item => item.value)}
                      labels={genderStats.map(item => item.gender)}
                    />
                  </Box>
                </Card>
              </Box>
            </>
          )}

          {/* 底部操作按钮 */}
          <Box direction="row" justify="between" align="center" margin={{ top: "large" }}>
            <Text size="small" color="dark-4">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
            <Button 
              label="Back to Dashboard" 
              href="/DocHome" 
              primary 
            />
          </Box>
        </Box>
      </Grommet>
    );
  }
}