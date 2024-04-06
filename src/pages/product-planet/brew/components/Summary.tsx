import React, { useState } from "react";
import { Row, Col, Button, Card, Avatar, Dropdown, Table, Menu, Tag } from 'antd';

import {
    VisitorChartData,
    AnnualStatisticData,
    ActiveMembersData,
    NewMembersData,
    RecentTransactionData
} from '@/components/views/app-views/dashboards/default/DefaultDashboardData';
import {
    UserAddOutlined,
    FileExcelOutlined,
    PrinterOutlined,
    PlusOutlined,
    EllipsisOutlined,
    StopOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import utils from '@/components/utils';
import { useSelector } from 'react-redux';
import StatisticWidget from "@/components/shared-components/StatisticWidget";
import GoalWidget from "@/components/shared-components/GoalWidget";
import AvatarStatus from "@/components/shared-components/AvatarStatus";
import BrewLogChart from "@/pages/product-planet/brew/components/BrewLogChart";
import RadialBarChartComponent from "@/pages/product-planet/brew/components/RadiaBar";
import mapRatingDataToChart from "@/pages/product-planet/brew/util/dataMapping";

// const MembersChart = props => (
//     <ApexChart {...props}/>
// )

const newJoinMemberOption = (
    <Menu>
        <Menu.Item key="0">
      <span>
        <div className="d-flex align-items-center">
          <PlusOutlined />
          <span className="ml-2">Add all</span>
        </div>
      </span>
        </Menu.Item>
        <Menu.Item key="1">
      <span>
        <div className="d-flex align-items-center">
          <StopOutlined />
          <span className="ml-2">Disable all</span>
        </div>
      </span>
        </Menu.Item>
    </Menu>
)

const latestTransactionOption = (
    <Menu>
        <Menu.Item key="0">
      <span>
        <div className="d-flex align-items-center">
          <ReloadOutlined />
          <span className="ml-2">Refresh</span>
        </div>
      </span>
        </Menu.Item>
        <Menu.Item key="1">
      <span>
        <div className="d-flex align-items-center">
          <PrinterOutlined />
          <span className="ml-2">Print</span>
        </div>
      </span>
        </Menu.Item>
        <Menu.Item key="12">
      <span>
        <div className="d-flex align-items-center">
          <FileExcelOutlined />
          <span className="ml-2">Export</span>
        </div>
      </span>
        </Menu.Item>
    </Menu>
);

const cardDropdown = (menu) => (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
            <EllipsisOutlined />
        </a>
    </Dropdown>
)

const tableColumns = [
    {
        title: 'Customer',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
            <div className="d-flex align-items-center">
                <Avatar size={30} className="font-size-sm" style={{backgroundColor: record.avatarColor}}>
                    {utils.getNameInitial(text)}
                </Avatar>
                <span className="ml-2">{text}</span>
            </div>
        ),
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: () => <div className="text-right">Status</div>,
        key: 'status',
        render: (_, record) => (
            <div className="text-right">
                <Tag className="mr-0" color={record.status === 'Approved' ? 'cyan' : record.status === 'Pending' ? 'blue' : 'volcano'}>{record.status}</Tag>
            </div>
        ),
    },
];

const fieldTranslations = {
    acidityQuality: '酸(质量)',
    sweetnessQuality: '甜(质量)',
    flavorQuality: '风味(质量)',
    acidityIntensity: '酸(强度)',
    sweetnessIntensity: '甜(强度)',
    bitternessIntensity: '苦(强度)',
    flavorIntensity: '风味(强度)',
    mouthfeel: '触感',
    aftertaste: '余韵',
    richness: '醇厚度'
};

export const DefaultDashboard = ({brewLogChartData, ratingData, brewJson}) => {
    const [annualStatisticData] = useState(AnnualStatisticData);
    const [newMembersData] = useState(NewMembersData)
    const [recentTransactionData] = useState(RecentTransactionData)
    const radiaBarData = mapRatingDataToChart(ratingData);
    radiaBarData.map((item) => {
        item.attributeName = fieldTranslations[item.attributeName] || item.attributeName;
        item.value = item.value;
        return item;
    });
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={18}>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"冲煮时间"}
                                value={brewJson.totalDuration + 's' }
                                status={''}
                                subtitle={'闷蒸时间 ' + brewJson.beanBoilDuration + 's'}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"粉水信息"}
                                value={brewJson.totalWaterInjection + 'g'}
                                status={' ' + brewJson.singleBean.weight + 'g 咖啡粉'}
                                subtitle={'粉水比 ' +brewJson.waterPowderRatio}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                            <StatisticWidget
                                title={"研磨信息"}
                                value={brewJson.beanMoDouJi}
                                status={ ' #' + brewJson.beanKeDu}
                                subtitle={'研磨程度 ' + brewJson.beanCuXi}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Card>
                                <BrewLogChart data={brewLogChartData} name={""}></BrewLogChart>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6}>
                    <Card>
                        <RadialBarChartComponent data={radiaBarData}></RadialBarChartComponent>
                    </Card>
                    <StatisticWidget
                        value='17,329'
                        status={3.7}
                        subtitle="Active members"
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={7}>
                    <Card title="New Join Member" extra={cardDropdown(newJoinMemberOption)}>
                        <div className="mt-3">
                            {
                                newMembersData.map((elm, i) => (
                                    <div key={i} className={`d-flex align-items-center justify-content-between mb-4`}>
                                        <AvatarStatus id={i} src={elm.img} name={elm.name} subTitle={elm.title} />
                                        <div>
                                            <Button icon={<UserAddOutlined />} type="default" size="small">Add</Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={17}>
                    <Card title="Latest Transactions" extra={cardDropdown(latestTransactionOption)}>
                        <Table
                            className="no-border-last"
                            columns={tableColumns}
                            dataSource={recentTransactionData}
                            rowKey='id'
                            pagination={false}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}


export default DefaultDashboard;
