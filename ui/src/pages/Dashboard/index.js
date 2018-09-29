import React from 'react'
import Board from 'react-trello'
import { Card, Tag, List, Avatar, Modal, Form, Button } from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import moment, * as moments from 'moment';

const FormItem = Form.Item

const CustomCard = props => {
    let color = ''
    let backgroundColor = 'white'

    if (props.source.name === '京仓京配') {
        color = '#DB5461'
    } else if (props.source.name === '爆品高佣') {
        color = '#3891A6'
    }

    // 处理问题标示
    if (props.alert === true) {
        backgroundColor = '#FDFD97'
    }

    return (
        <div style={{ padding: '0px 10px', borderLeft: `5px solid ${color}`, backgroundColor }}>
            <List.Item key={props._id}>
                <List.Item.Meta
                    avatar={
                        <img
                            src={props.imgPath}
                            style={{ width: '64px', height: '64px' }}
                        />
                    }
                    title={
                        <div>
                            <h4 className='ant-list-item-meta-title'>{props.title}</h4>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#D70000' }}>{props.alertMessage}</span>
                        </div>
                    }
                    description={
                        <div>
                            <p className={styles.cardDescrption}>{props.source.name} / {props.category} / {props.categorySummary}</p>
                            {props.onlineTime && <p className={styles.cardDateTime}>{props.timelabel} {moment(props.onlineTime).format('HH:mm:ss')}</p>}
                        </div>
                    }
                />
            </List.Item>
        </div>
    )
};

function TrelloList() {
    const data = {
        lanes: [
            {
                cards: [{
                    alert: false,
                    alertMessage: null,
                    cardStyle: {
                        maxWidth: "300px"
                    },
                    category: "食品饮料",
                    categorySummary: "生鲜吃喝",
                    id: "5bacf2f21caf45001a888570",
                    imgPath: "http://static-pics.jingxiangbang.com/7ff590e0-c267-11e8-be45-45496a1deda5.jpg",
                    laneId: "online",
                    onlineTime: "2018-09-28T01:00:15.114Z",
                    source: {
                        name: "爆品高佣"
                    },
                    tilelabe: "上线时间",
                    title: "【申通包邮】同仁堂红豆薏仁粉，建议每天清晨5点到7点空腹食用一餐，睡前服用一餐，效果更佳！"

                }],
                currentPage: 1,
                droppable: false,
                id: "online",
                labels: "0 / 11",
                title: "今天已上线"
            }
        ]
    }


    const boardProps = {
        data,
        draggable: true,
        customCardLayout: true,
        laneDraggable: false,
        style: { background: '#f0f2f5' },
    }

    return (
        <div>
            <Board {...boardProps}>
                <CustomCard />
            </Board>
        </div >
    )
}


export default TrelloList