import React, { Component, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  Grommet,
  Calendar,
  Select,
  Grid,
  Text,
  TextArea,
  Card,
  CardBody,
  CardHeader
} from 'grommet';
import { Schedule, Clock, UserExpert, FormCheckmark } from 'grommet-icons';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: "#00739D",
      active: "#00739D",
      "status-ok": "#00C781",
      "status-disabled": "#CCCCCC",
      "light-gray": "#F2F2F2"
    },
    font: {
      family: 'Lato',
    },
  },
};

var theDate;
var theTime;
var endTime;
var theConcerns;
var theSymptoms;
var theDoc;

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

function DoctorsDropdown({ onDocSelect }) {
  const [value, setValue] = useState();
  const [doctorsList, setList] = useState([]);
  
  useEffect(() => {    
    fetch("http://localhost:3001/docInfo")
    .then(res => res.json())
    .then(res => {
      let arr = []
      res.data.forEach(i => {
        let tmp = `${i.name} (${i.email})`;
        arr.push(tmp);
      });
      setList(arr);
    });
  }, []);

  const onChange = event => {
    setValue(event.value);
    let docEmail = event.value.match(/\((.*)\)/)[1];
    theDoc = docEmail; 
    onDocSelect(docEmail); 
  };

  return (
    <Select
      options={doctorsList}
      value={value}
      placeholder="请点击选择医生..."
      icon={<UserExpert />}
      onChange={onChange}
      required
    />
  );
}

const TimeSlotPicker = ({ selectedDoc, selectedDate, onTimeSelect }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTime, setActiveTime] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!selectedDoc || !selectedDate) {
      setSlots([]);
      return;
    }

    const dateObj = new Date(selectedDate);
    // 处理时区问题，直接用切片字符串，防止日期跳变
    const dateStr = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

    setLoading(true);
    setStatusMsg("");
    setSlots([]);

    fetch(`http://localhost:3001/getDocScheduleOnDate?email=${selectedDoc}&date=${dateStr}`)
      .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
      })
      .then(data => {
            setLoading(false);
            
            // 数据解析
            const startHour = parseInt(data.start.split(':')[0]);
            const endHour = parseInt(data.end.split(':')[0]);
            const breakHour = parseInt(data.break.split(':')[0]);
            const busyList = data.busy || []; 
    
            let generatedSlots = [];
            
            for (let h = startHour; h < endHour; h++) {
              const timeLabel = `${h.toString().padStart(2, '0')}:00`;
              const fullTimeStr = `${timeLabel}:00`; 
    
              let isBooked = busyList.includes(fullTimeStr);
              let isBreak = (h === breakHour);
              
              let status = 'available'; 
              if (isBreak) status = 'break';
              else if (isBooked) status = 'booked';
    
              generatedSlots.push({
                time: timeLabel,
                status: status
              });
            }
            setSlots(generatedSlots);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
          // 只有真的断网才会走这里，因为后端现在有保底策略了
          setStatusMsg("连接服务器失败，请检查后端是否启动。");
      });

  }, [selectedDoc, selectedDate]);

  if (loading) {
      return (
          <Box align="center" pad="large" gap="small">
              <Text color="brand" weight="bold">⏳ 正在加载时间表...</Text>
          </Box>
      );
  }

  if (statusMsg) {
      return (
          <Box align="center" pad="medium" background="light-gray" round="small">
              <Text color="status-critical">{statusMsg}</Text>
          </Box>
      );
  }

  return (
    <Box pad="small" width="large">
        <Grid columns="xsmall" gap="small">
          {slots.map((item, index) => {
            const isAvailable = item.status === 'available';
            const isSelected = activeTime === item.time;
            
            let bg = "white"; 
            let border = "1px solid #CCCCCC";
            let textColor = "#666666";
            let cursor = "not-allowed";
            let labelText = item.time;

            if (item.status === 'break') {
               bg = "#F2F2F2";
               labelText = "休息";
            } else if (item.status === 'booked') {
               bg = "#F2F2F2";
               labelText = "已满";
               textColor = "#AAAAAA";
            } else if (isAvailable) {
               cursor = "pointer";
               if (isSelected) {
                   bg = "#00739D"; 
                   border = "1px solid #00739D";
                   textColor = "white";
               } else {
                   bg = "white";
                   border = "1px solid #00739D"; 
                   textColor = "#00739D";
               }
            }

            return (
              <Box
                key={index}
                onClick={() => {
                  if (isAvailable) {
                      setActiveTime(item.time);
                      onTimeSelect(item.time);
                  }
                }}
                background={bg}
                round="4px"
                align="center"
                justify="center"
                pad="small"
                style={{ 
                    border: border, 
                    cursor: cursor,
                    transition: "all 0.1s ease"
                }}
              >
                  <Text size="small" weight="bold" color={textColor} style={{textDecoration: item.status === 'booked' ? 'line-through' : 'none'}}>
                      {labelText}
                  </Text>
              </Box>
            );
          })}
        </Grid>
    </Box>
  );
};

const ConcernsTextArea = () => {
  const [value, setValue] = React.useState("");
  return (
    <TextArea
      placeholder="请简单描述您的就诊原因..."
      value={value}
      onChange={event => {
        setValue(event.target.value);
        theConcerns = event.target.value;
      }}
      fill
      resize="vertical"
    />
  );
};

const SymptomsTextArea = () => {
  const [value, setValue] = React.useState("");
  return (
    <TextArea
      placeholder="请列出您的具体症状 (如: 头痛, 发烧)..."
      value={value}
      onChange={event => {
        setValue(event.target.value);
        theSymptoms = event.target.value;
      }}
      fill
      resize="vertical"
    />
  );
};

export class SchedulingAppt extends Component {
  state = {
    selectedDoc: null,
    date: undefined, 
    time: null
  };

  onDateChange = (nextDate) => {
    this.setState({ date: nextDate, time: null }); 
    theDate = nextDate; 
    theTime = null;
  };

  onTimeSelect = (timeStr) => {
    this.setState({ time: timeStr });
    theTime = timeStr;
    let startHour = parseInt(timeStr.split(":")[0], 10);
    let endHour = startHour + 1;
    endTime = `${endHour}:00`;
  }

  render() {
    const { date, selectedDoc, time } = this.state;

    return (
      <Grommet theme={theme} full>
        <AppBar>
          <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/"><Heading level='3' margin='none'>医院管理系统</Heading></a>
        </AppBar>
        
        <Box align="center" pad="medium" background="light-2" style={{minHeight: "100vh"}}>
          <Box width="large" gap="medium">
            <Heading level="2" textAlign="center" margin={{bottom:"medium"}}>预约挂号</Heading>
            
            <Form
                onSubmit={({ value }) => {
                    if (!theDoc || !theDate || !theTime) {
                        window.alert("请完整填写所有信息！");
                        return;
                    }
                    
                    fetch("http://localhost:3001/userInSession")
                    .then(res => res.json())
                    .then(res => {
                    let email_in_use = res.email;
                    
                    fetch(`http://localhost:3001/checkIfApptExists?email=${email_in_use}&startTime=${theTime}&date=${theDate}&docEmail=${theDoc}`)
                        .then(res => res.json())
                        .then(res => {
                        if (res.data[0]) {
                            window.alert("哎呀！手慢了，该时间段刚刚被抢走了。");
                            this.setState({ time: null });
                        } else {
                            fetch("http://localhost:3001/genApptUID")
                            .then(res => res.json())
                            .then(uidRes => {
                                let gen_uid = uidRes.id;
                                fetch(`http://localhost:3001/schedule?time=${theTime}&endTime=${endTime}&date=${theDate}&concerns=${theConcerns}&symptoms=${theSymptoms}&id=${gen_uid}&doc=${theDoc}`)
                                .then(() => {
                                    fetch(`http://localhost:3001/addToPatientSeeAppt?email=${email_in_use}&id=${gen_uid}&concerns=${theConcerns}&symptoms=${theSymptoms}`)
                                    .then(() => {
                                        window.alert("🎉 预约成功！");
                                        window.location.href = "/Home";
                                    });
                                });
                            });
                        }
                        });
                    });
                }}
            >
                {/* 1. 选择医生 */}
                <Card background="white" margin={{bottom: "medium"}} elevation="small">
                    <CardHeader pad="medium" background="light-1">
                        <Box direction="row" gap="small" align="center">
                            <UserExpert color="brand"/>
                            <Text weight="bold">1. 选择医生</Text>
                        </Box>
                    </CardHeader>
                    <CardBody pad="medium">
                        <DoctorsDropdown onDocSelect={(doc) => this.setState({ selectedDoc: doc, time: null })} />
                    </CardBody>
                </Card>

                {/* 2. 日期与时间 */}
                {selectedDoc && (
                    <Box direction="row-responsive" gap="medium" margin={{bottom: "medium"}}>
                        <Card background="white" elevation="small" basis="1/2">
                            <CardHeader pad="medium" background="light-1">
                                <Box direction="row" gap="small" align="center">
                                    <Schedule color="brand"/>
                                    <Text weight="bold">2. 选择日期</Text>
                                </Box>
                            </CardHeader>
                            <CardBody pad="medium" align="center">
                                <Calendar
                                    date={date}
                                    onSelect={this.onDateChange}
                                    size="small"
                                    locale="zh-CN"
                                    bounds={[new Date().toISOString(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()]}
                                />
                            </CardBody>
                        </Card>

                        <Card background="white" elevation="small" basis="1/2">
                            <CardHeader pad="medium" background="light-1">
                                <Box direction="row" gap="small" align="center">
                                    <Clock color="brand"/>
                                    <Text weight="bold">3. 选择时间</Text>
                                </Box>
                            </CardHeader>
                            <CardBody pad="medium" align="center" justify="center">
                                {date ? (
                                    <TimeSlotPicker 
                                        selectedDoc={selectedDoc} 
                                        selectedDate={date} 
                                        onTimeSelect={this.onTimeSelect}
                                    />
                                ) : (
                                    <Text color="dark-4" margin="medium">⬅️ 请先在左侧选择日期</Text>
                                )}
                            </CardBody>
                        </Card>
                    </Box>
                )}

                {/* 3. 提交 */}
                {time && (
                    <Card background="white" elevation="small" animation="fadeIn">
                         <CardHeader pad="medium" background="light-1">
                            <Box direction="row" gap="small" align="center">
                                <FormCheckmark color="brand"/>
                                <Text weight="bold">4. 确认信息</Text>
                            </Box>
                        </CardHeader>
                        <CardBody pad="medium" gap="small">
                            <Box direction="row" gap="medium" margin={{bottom:"small"}}>
                                <Text><strong>已选时间：</strong> {new Date(date).toLocaleDateString()} {time}</Text>
                            </Box>
                            
                            <Text size="small" weight="bold">就诊原因</Text>
                            <ConcernsTextArea />
                            <Text size="small" weight="bold" margin={{top:"small"}}>具体症状</Text>
                            <SymptomsTextArea />
                            
                            <Box align="center" margin={{ top: 'medium' }}>
                                <Button
                                    label="提交预约"
                                    type="submit"
                                    primary
                                    size="large"
                                    fill="horizontal"
                                />
                            </Box>
                        </CardBody>
                    </Card>
                )}
            </Form>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default SchedulingAppt;