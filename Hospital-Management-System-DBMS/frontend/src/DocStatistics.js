import React, { Component } from "react";
import {
  Box,
  Heading,
  Grommet,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  Grid,
  ResponsiveContext
} from "grommet";
import { FormPreviousLink } from 'grommet-icons';

// ==========================================
// 1. 样式与动画定义
// ==========================================
const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000',
      "neutral-gray": "#cccccc",
      "light-background": "#f8f9fa",
      "chart-line": "#2563eb",
      "chart-bar": "#10b981"
    },
    font: {
      family: 'Lato, sans-serif',
      size: {
        xsmall: '11px',
        small: '12px',
        medium: '14px',
        large: '16px',
        xlarge: '18px'
      }
    },
  },
  card: {
    elevation: "small",
    container: {
      round: "small"
    }
  }
};

const CHART_COLORS = {
  primary: "#2563eb",   // 蓝色
  secondary: "#10b981", // 绿色
  tertiary: "#8b5cf6",  // 紫色
  grid: "#e2e8f0",
  text: "#64748b"
};

// 注入动态 CSS 动画
const AnimationStyles = () => (
  <style>{`
    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes growBar {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chart-line-path {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawLine 2s ease-out forwards;
    }
    .chart-bar {
      transform-origin: bottom;
      animation: growBar 1s ease-out forwards;
    }
    .chart-point:hover {
      r: 6;
      stroke-width: 3;
      cursor: pointer;
    }
    .fade-in-up {
      animation: fadeIn 0.8s ease-out forwards;
    }
    /* 紧凑卡片样式 */
    .compact-card {
      padding: 10px 12px !important;
      min-height: 70px !important;
    }
    .compact-card h2 {
      font-size: 1.4rem !important;
      margin: 2px 0 !important;
    }
    .compact-card p {
      margin: 1px 0 !important;
      font-size: 10px !important;
    }
    /* 图表容器 */
    .chart-container {
      min-width: 0; /* 防止flex溢出 */
    }
    /* 新增：优化条形图悬停效果 */
    .bar-hover:hover {
      opacity: 0.8;
      transform: translateY(-2px);
      transition: all 0.2s ease;
    }
    /* 新增：饼图悬停效果 */
    .pie-segment:hover {
      filter: brightness(1.1);
      transform: scale(1.02);
      transform-origin: center;
      transition: all 0.3s ease;
    }
  `}</style>
);

// ==========================================
// 2. 图表组件
// ==========================================

// 更紧凑的统计卡片
const CompactStatCard = ({ title, value, subtitle, color = "brand" }) => (
  <Card background="white" pad="xsmall" elevation="small" className="fade-in-up compact-card" justify="center">
    <Box>
      <Text size="xsmall" color="dark-4" weight="bold" style={{ fontSize: '10px' }}>{title}</Text>
      <Heading level="2" margin={{ vertical: "xxsmall" }} color={color} style={{ fontSize: '1.4rem', lineHeight: '1.2' }}>{value}</Heading>
      <Text size="xsmall" color="dark-5" style={{ fontSize: '9px' }}>{subtitle}</Text>
    </Box>
  </Card>
);

// 柱状图 - 修复显示问题
const BarChart = ({ data, labels, height = 200, color = CHART_COLORS.primary }) => {
  if (!data || data.length === 0) return <Box pad="medium"><Text>暂无数据</Text></Box>;
  
  // 确保最小值为0，防止负数
  const minValue = 0;
  const maxValue = Math.max(...data, 1) * 1.3; // 确保最大值为正数

  return (
    <ResponsiveContext.Consumer>
      {size => {
        const isSmall = size === 'small';
        return (
          <Box height={`${height}px`} pad={{ bottom: "xsmall" }} justify="end" className="chart-container">
            {/* Y轴刻度 */}
            <Box style={{ position: 'absolute', left: 0, top: 0, bottom: 25, width: 30 }}>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const value = Math.round(maxValue * ratio);
                return (
                  <Box
                    key={index}
                    style={{
                      position: 'absolute',
                      bottom: `${ratio * 100}%`,
                      left: 0,
                      width: '100%',
                      textAlign: 'right'
                    }}
                  >
                    <Text size="xsmall" color="dark-4" style={{ fontSize: '9px' }}>{value}</Text>
                  </Box>
                );
              })}
            </Box>
            
            <Box 
              direction="row" 
              align="end" 
              justify="between" 
              height="100%" 
              border={{ side: 'bottom', color: CHART_COLORS.grid }}
              pad={{ left: '30px' }} // 为Y轴标签留出空间
            >
              {data.map((value, index) => {
                // 计算柱形高度百分比，确保最小高度为1%
                const heightPercent = Math.max((value / maxValue) * 100, 1);
                
                return (
                  <Box 
                    key={index} 
                    align="center" 
                    justify="end" 
                    flex="grow" 
                    margin={{ horizontal: "xxsmall" }}
                    style={{ position: 'relative', height: '100%' }}
                  >
                    {/* 柱形 */}
                    <Box 
                      className="chart-bar bar-hover" 
                      background={color}
                      width={isSmall ? '70%' : '75%'} 
                      maxWidth="40px"
                      height={`${heightPercent}%`}
                      round={{ corner: "top", size: "xsmall" }}
                      style={{ 
                        minHeight: "3px",
                        animationDelay: `${index * 0.1}s`,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.parentNode.querySelector('.value-tooltip');
                        if (tooltip) tooltip.style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.parentNode.querySelector('.value-tooltip');
                        if (tooltip) tooltip.style.opacity = 0;
                      }}
                    />
                    
                    {/* 悬停时显示的数值 */}
                    <Box
                      className="value-tooltip"
                      style={{
                        position: 'absolute',
                        top: `${100 - heightPercent - 10}%`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        zIndex: 10
                      }}
                    >
                      {value} 人
                    </Box>
                    
                    {/* 底部数值 */}
                    <Text 
                      size="xsmall" 
                      weight="bold" 
                      margin={{ top: "xxsmall" }} 
                      style={{ 
                        fontSize: '10px',
                        color: value === Math.max(...data) ? color : 'inherit'
                      }}
                    >
                      {value}
                    </Text>
                  </Box>
                );
              })}
            </Box>
            
            {/* X轴标签 */}
            <Box 
              direction="row" 
              justify="between" 
              margin={{ top: "xxsmall", left: '30px' }}
            >
              {labels.map((label, i) => (
                  <Box 
                    key={i} 
                    align="center" 
                    flex="grow"
                    pad={{ horizontal: 'xxsmall' }}
                  >
                    <Text 
                      size="xsmall" 
                      color={CHART_COLORS.text} 
                      style={{ 
                        fontSize: '9px',
                        fontWeight: data[i] === Math.max(...data) ? 'bold' : 'normal'
                      }}
                    >
                      {label}
                    </Text>
                  </Box>
              ))}
            </Box>
          </Box>
        );
      }}
    </ResponsiveContext.Consumer>
  );
};

// 折线图 - 优化间距
// 折线图 - 优化间距（月份标签完全对齐版本）
const LineChart = ({ data, labels, height = 220 }) => {
  if (!data || data.length === 0)
    return (
      <Box pad="medium">
        <Text>暂无数据</Text>
      </Box>
    );

  const svgWidth = 800;
  const svgHeight = height;
  const padding = { left: 40, right: 40, top: 20, bottom: 40 };

  const maxValue = Math.max(...data) * 1.2;
  const minValue = 0;

  const getX = (index) => {
    return padding.left + (index / (data.length - 1)) * (svgWidth - padding.left - padding.right);
  };

  const getY = (value) => {
    return (
      svgHeight -
      padding.bottom -
      ((value - minValue) / (maxValue - minValue)) * (svgHeight - padding.top - padding.bottom)
    );
  };

  const points = data.map((v, i) => ({ x: getX(i), y: getY(v), value: v }));

  const generateBezierPath = () => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const c1 = { x: (p0.x + p1.x) / 2, y: p0.y };
      const c2 = { x: (p0.x + p1.x) / 2, y: p1.y };
      d += ` C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const yTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];

  return (
    <Box height={`${height}px`} style={{ position: "relative" }} className="chart-container">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        {/* Y轴刻度标签 */}
        {yTicks.map((value, i) => {
          const y = getY(value);
          return (
            <g key={`y-label-${i}`}>
              <text
                x={padding.left - 10}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="#64748b"
                fontFamily="Lato, sans-serif"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* 背景横线 */}
        {yTicks.map((_, i) => {
          const y = getY(yTicks[i]);
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4,4"
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity="0.2" />
            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 填充区域 */}
        <path
          d={`${generateBezierPath()} L ${points[points.length - 1].x},${svgHeight - padding.bottom} L ${
            points[0].x
          },${svgHeight - padding.bottom} Z`}
          fill="url(#gradientArea)"
          className="fade-in-up"
        />

        {/* 折线 */}
        <path
          d={generateBezierPath()}
          fill="none"
          stroke={CHART_COLORS.primary}
          strokeWidth="2"
          strokeLinecap="round"
          className="chart-line-path"
        />

        {/* 数据点 */}
        {points.map((p, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              fill="white"
              stroke={CHART_COLORS.primary}
              strokeWidth="2"
              className="chart-point"
              style={{ transition: "all 0.2s ease" }}
            >
              <title>{p.value} 人</title>
            </circle>

            {/* 数据点数值 */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#2563eb"
              fontWeight="bold"
              style={{ pointerEvents: "none" }}
            >
              {p.value}
            </text>
          </g>
        ))}

        {/* X轴标签（SVG 内，与数据点完全对齐） */}
        {points.map((p, i) => (
          <text
            key={`x-label-${i}`}
            x={p.x}
            y={svgHeight - 5}
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
            fontFamily="Lato, sans-serif"
            style={{ whiteSpace: "nowrap" }}
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </Box>
  );
};


// 饼图 - 增大尺寸，优化显示
const PieChart = ({ data, labels, colors }) => {
    const total = data.reduce((sum, value) => sum + value, 0) || 1;
    let currentAngle = 0;
    
    const segments = data.map((value, index) => {
      const angle = (value / total) * 360;
      const largeArcFlag = angle > 180 ? 1 : 0;
      // 增大饼图半径从30到40
      const radius = 40;
      const startX = 50 + radius * Math.cos(currentAngle * Math.PI / 180);
      const startY = 50 + radius * Math.sin(currentAngle * Math.PI / 180);
      const endAngle = currentAngle + angle;
      const endX = 50 + radius * Math.cos(endAngle * Math.PI / 180);
      const endY = 50 + radius * Math.sin(endAngle * Math.PI / 180);
      const path = `M 50 50 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
      currentAngle = endAngle;
      return { 
        path, 
        color: colors[index % colors.length], 
        label: labels[index], 
        value, 
        percentage: ((value/total)*100).toFixed(1),
        startAngle: currentAngle - angle,
        endAngle: currentAngle
      };
    });
  
    return (
      <ResponsiveContext.Consumer>
        {size => {
          const isSmall = size === 'small';
          return (
            <Box 
              direction={isSmall ? 'column' : 'row'} 
              align="center" 
              justify="center" 
              gap={isSmall ? 'small' : 'medium'} 
              wrap={isSmall ? true : false}
              className="fade-in-up chart-container"
            >
              <Box 
                width={isSmall ? '180px' : '200px'} // 增大饼图容器尺寸
                height={isSmall ? '180px' : '200px'}
                flex={false}
                align="center"
                justify="center"
              >
                <svg 
                  viewBox="0 0 100 100" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    transform: 'rotate(-90deg)'
                  }}
                >
                  {/* 饼图中心显示总数 */}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#64748b"
                    fontFamily="Lato, sans-serif"
                  >
                    总计
                  </text>
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#000000"
                    fontWeight="bold"
                    fontFamily="Lato, sans-serif"
                  >
                    {total}
                  </text>
                  
                  {segments.map((s, i) => (
                    <path 
                      key={i} 
                      d={s.path} 
                      fill={s.color} 
                      stroke="white" 
                      strokeWidth="2" // 增加边框宽度
                      className="pie-segment"
                      style={{ 
                        transition: "all 0.3s",
                        cursor: "pointer"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.opacity = 0.9;
                      }}
                      onMouseOut={(e) => {
                        e.target.style.opacity = 1;
                      }}
                    />
                  ))}
                </svg>
              </Box>
              
              <Box 
                flex={false} 
                align={isSmall ? 'center' : 'start'}
                width={isSmall ? '100%' : 'auto'}
              >
                <Box 
                  background="light-2" 
                  pad="xsmall" 
                  round="xsmall" 
                  margin={{ bottom: 'xsmall' }}
                  width={isSmall ? '100%' : 'auto'}
                >
                  <Text 
                    size="xsmall" 
                    color="dark-4" 
                    weight="bold"
                    style={{ fontSize: '10px' }}
                  >
                    详细分布
                  </Text>
                </Box>
                
                {segments.map((s, i) => (
                  <Box 
                    key={i} 
                    direction="row" 
                    align="center" 
                    gap="small" 
                    margin={{ bottom: "xxsmall" }}
                    width={isSmall ? '100%' : 'auto'}
                    justify={isSmall ? 'between' : 'start'}
                    pad={{ horizontal: 'xsmall' }}
                  >
                    <Box direction="row" align="center" gap="xsmall">
                      <Box 
                        width="12px" 
                        height="12px" 
                        background={s.color} 
                        round="xs" 
                      />
                      <Text 
                        size="small" 
                        weight="bold" 
                        style={{ 
                          fontSize: isSmall ? '12px' : '13px',
                          minWidth: isSmall ? '30px' : 'auto'
                        }}
                      >
                        {s.label}
                      </Text>
                    </Box>
                    <Box direction="row" gap="xsmall" align="center">
                      <Text 
                        size="small" 
                        weight="bold" 
                        color="dark-6"
                        style={{ fontSize: isSmall ? '11px' : '12px' }}
                      >
                        {s.value}
                      </Text>
                      <Text 
                        size="small" 
                        color="dark-4" 
                        style={{ 
                          fontSize: isSmall ? '10px' : '11px',
                          minWidth: '45px'
                        }}
                      >
                        ({s.percentage}%)
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        }}
      </ResponsiveContext.Consumer>
    );
  };

// ==========================================
// 3. 主页面逻辑
// ==========================================
export default class DocStatistics extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    setTimeout(() => {
        this.setState({ loading: false });
    }, 800); 
  }

  getMockData() {
      return {
        apptStats: [
            { month: "1月", count: 25, newPatients: 18 },
            { month: "2月", count: 42, newPatients: 22 },
            { month: "3月", count: 38, newPatients: 15 },
            { month: "4月", count: 65, newPatients: 34 },
            { month: "5月", count: 52, newPatients: 28 },
            { month: "6月", count: 85, newPatients: 45 },
        ],
        genderStats: [
            { gender: "男性", value: 120 },
            { gender: "女性", value: 160 },
            { gender: "其他", value: 15 },
        ]
      }
  }

  render() {
    const { loading } = this.state;
    const { apptStats, genderStats } = this.getMockData();
    
    const totalAppointments = apptStats.reduce((sum, item) => sum + item.count, 0);
    const totalNewPatients = apptStats.reduce((sum, item) => sum + item.newPatients, 0);
    const avgAppointments = Math.round(totalAppointments / apptStats.length);

    return (
      <Grommet theme={theme} full>
        <AnimationStyles />
        
        <Box fill background="light-background">
          {/* 1. 顶部栏 */}
          <Box 
            tag='header'
            direction='row'
            align='center'
            background='brand'
            pad={{ left: 'medium', right: 'medium', vertical: 'xsmall' }}
            elevation="small"
            style={{ zIndex: '10' }}
            flex={false} 
          >
            <Button 
                icon={<FormPreviousLink color="white" />} 
                label={<Text color="white"></Text>}
                href="/DocHome" 
                plain
                hoverIndicator={{ color: "#333" }}
            />
            <Heading level='4' margin='none' color="white" style={{ fontSize: '1.2rem' }}>数据统计中心</Heading>
          </Box>

          {/* 2. 主内容区域 */}
          <ResponsiveContext.Consumer>
            {size => {
              const isSmall = size === 'small';
              return (
                <Box 
                  flex 
                  pad={{ 
                    horizontal: isSmall ? 'xsmall' : 'small',
                    vertical: 'xsmall'
                  }} 
                  overflow={{ vertical: "auto", horizontal: "hidden" }} 
                >
                  <Box 
                    width="100%" 
                    gap="xsmall"
                    margin="auto"
                    style={{ maxWidth: '1200px' }}
                  > 
                    
                    <Box margin={{ bottom: "xxsmall" }} className="fade-in-up">
                      <Heading level="3" margin="none" style={{ fontSize: '1.3rem' }}>医院运营概览</Heading>
                      <Text color="dark-4" size="small" style={{ fontSize: '11px' }}>实时更新的诊疗数据与趋势分析</Text>
                    </Box>

                    {/* 超紧凑统计卡片 */}
                    <Box 
                      direction="row" 
                      gap="xsmall" 
                      margin={{ bottom: "small" }}
                      wrap={true}
                      justify="between"
                    >
                      <Box flex basis="32%" style={{ minWidth: '100px' }}>
                        <CompactStatCard 
                          title="总预约数" 
                          value={totalAppointments} 
                          subtitle="2024年度累计" 
                        />
                      </Box>
                      <Box flex basis="32%" style={{ minWidth: '100px' }}>
                        <CompactStatCard 
                          title="新增患者" 
                          value={totalNewPatients} 
                          subtitle="本季度新增"
                          color={CHART_COLORS.secondary}
                        />
                      </Box>
                      <Box flex basis="32%" style={{ minWidth: '100px' }}>
                        <CompactStatCard 
                          title="月均接诊" 
                          value={avgAppointments} 
                          subtitle="平均工作负荷"
                          color={CHART_COLORS.tertiary}
                        />
                      </Box>
                    </Box>

                    {loading ? (
                        <Box align="center" justify="center" height="medium">
                          <Text>数据加载中...</Text>
                        </Box>
                    ) : (
                      <Box gap="small">
                        
                        {/* 折线图 - 预约趋势 */}
                        <Card background="white" elevation="small" className="fade-in-up">
                          <CardHeader 
                            pad={{ horizontal: "small", vertical: "xsmall" }} 
                            border={{ side: "bottom", color: "light-2" }}
                          >
                            <Box>
                              <Text weight="bold" size="medium" style={{ fontSize: '14px' }}>每月预约趋势</Text>
                              <Text size="xsmall" color="dark-4" style={{ fontSize: '10px' }}>过去6个月的接诊量变化 (单位: 人)</Text>
                            </Box>
                          </CardHeader>
                          <CardBody 
                            pad={{ horizontal: "xsmall", vertical: "xsmall" }}
                            style={{ overflow: 'visible' }}
                          >
                            <Box style={{ minHeight: '240px', overflow: 'visible' }}>
                              <LineChart 
                                data={apptStats.map(i => i.count)} 
                                labels={apptStats.map(i => i.month)} 
                                height={200}
                              />
                            </Box>
                          </CardBody>
                        </Card>

                        {/* 两个小图表并排 */}
                        <Box direction={isSmall ? 'column' : 'row'} gap="small">
                          
                          {/* 柱状图 - 新增患者 */}
                          <Card 
                            background="white" 
                            elevation="small" 
                            className="fade-in-up"
                            flex={isSmall ? false : true}
                          >
                            <CardHeader 
                              pad={{ horizontal: "small", vertical: "xsmall" }} 
                              border={{ side: "bottom", color: "light-2" }}
                            >
                              <Box>
                                <Text weight="bold" size="medium" style={{ fontSize: '14px' }}>新增患者统计</Text>
                                <Text size="xsmall" color="dark-4" style={{ fontSize: '10px' }}>按月统计的新建档案数量 (单位: 人)</Text>
                              </Box>
                            </CardHeader>
                            <CardBody pad={{ horizontal: "xsmall", vertical: "xsmall" }}>
                              <Box style={{ position: 'relative', height: '220px' }}>
                                <BarChart 
                                  data={apptStats.map(i => i.newPatients)} 
                                  labels={apptStats.map(i => i.month)} 
                                  color={CHART_COLORS.secondary}
                                  height={200}
                                />
                              </Box>
                            </CardBody>
                          </Card>

                          {/* 饼图 - 患者性别分布 */}
                          <Card 
                            background="white" 
                            elevation="small" 
                            className="fade-in-up"
                            flex={isSmall ? false : true}
                          >
                            <CardHeader 
                              pad={{ horizontal: "small", vertical: "xsmall" }} 
                              border={{ side: "bottom", color: "light-2" }}
                            >
                              <Text weight="bold" size="medium" style={{ fontSize: '14px' }}>患者性别分布</Text>
                            </CardHeader>
                            <CardBody pad={{ 
                              horizontal: isSmall ? 'xsmall' : 'small', 
                              vertical: 'small'
                            }}>
                              <PieChart 
                                data={genderStats.map(i => i.value)} 
                                labels={genderStats.map(i => i.gender)}
                                colors={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary]}
                              />
                            </CardBody>
                          </Card>

                        </Box>

                      </Box>
                    )}
                  </Box>
                </Box>
              );
            }}
          </ResponsiveContext.Consumer>
        </Box>
      </Grommet>
    );
  }
}