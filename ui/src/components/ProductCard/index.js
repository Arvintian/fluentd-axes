import React from 'react'
import { Form, Input, Modal, Button, Upload, Icon, notification } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

function ProductCardForm({ form: { getFieldDecorator, validateFieldsAndScroll, resetFields }, productItem, isVisible, isUpdateProduct, isOfflineProduct, handleEdit, handleCancel, handleOffline, handleDelete, session }) {
    const doHandleEdit = () => {
        validateFieldsAndScroll((err, item) => {
            if (err) {
                return
            }

            handleEdit(productItem._id, item)
        })
    }

    const doHandleCancel = () => {
        resetFields()
        handleCancel()
    }

    const formProps = {
        itemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
                md: { span: 16 },
            },
        },
        submitFormLayout: {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 7 },
            },
        },
        formdata: [
            {
                label: 'SKUID',
                name: 'skuId',
                type: 'input',
                value: productItem.skuId,
                key: 'skuid',
            },
            {
                label: '名称',
                name: 'title',
                type: 'textarea',
                value: productItem.title,
                key: 'title',
            },
            {
                label: '原价',
                name: 'orgPrice',
                type: 'input',
                value: productItem.orgPrice,
                key: 'orgPrice',
            },
            {
                label: '原价 (数字) ',
                name: 'orgNumPrice',
                type: 'input',
                value: productItem.orgNumPrice,
                key: 'orgNumPrice',
            },
            {
                label: '券后价',
                name: 'discountPrice',
                type: 'input',
                value: productItem.discountPrice,
                key: 'discountPrice',
            },
            {
                label: '券后价 (数字) ',
                name: 'discountNumPrice',
                type: 'input',
                value: productItem.discountNumPrice,
                key: 'discountNumPrice',
            },
            {
                label: '佣金比例',
                name: 'commissionRate',
                type: 'input',
                value: productItem.commissionRate,
                key: 'commissionRate',
            },
            {
                label: '头部话术',
                name: 'skuContent',
                type: 'textarea',
                value: productItem.skuContent,
                key: 'skuContent',
            },
            {
                label: '尾部话术',
                name: 'skuContentExtra',
                type: 'textarea',
                value: productItem.skuContentExtra,
                key: 'skuContentExtra',
            },
            {
                type: 'upload',
                label: '视频素材',
                name: 'couponVideo',
                key: 'couponVideo',
            }
        ],
    }

    const modalProps = {
        title: '编辑',
        wrapClassName: 'vertical-center-modal',
        visible: isVisible,
        onCancel: doHandleCancel,
        destroyOnClose: true,
        footer: (
            <div>
                <Button onClick={doHandleCancel}>取消</Button>
                {(productItem.skuStatus === 'online') && <Button type='danger' onClick={handleOffline} loading={isOfflineProduct}>下线</Button>}
                {(productItem.skuStatus !== 'online') && <Button type='danger' onClick={handleDelete}>删除</Button>}
                <Button type='primary' onClick={doHandleEdit} loading={isUpdateProduct}>更新</Button>
            </div>
        )
    }

    let uploadProps = {
        name: 'couponVideo',
        action: `/wechat/media/video/upload?session_id=${session}`,
        onChange: (info) => {
            if (info.file.status === 'done') {
                if (info.file.response.error) {
                    notification.error({
                        message: "上传文件格式或大小有误",
                        description: `上传文件格式或大小有误: ${info.file.response.reason.errmsg}`

                    })
                } else {
                    validateFieldsAndScroll((err, item) => {
                        if (err) {
                            return
                        }

                        item.coverVideoID = info.file.response.result.media_id
                        handleEdit(productItem._id, item)
                        doHandleCancel()
                    })
                }
            }
        }
    }

    return (
        <div>
            <Modal {...modalProps}>
                <div>
                    <Form hideRequiredMark style={{ margin: 8 }}>
                        {formProps.formdata.map((item) => {
                            switch (item.type) {
                                case 'input':
                                    return (
                                        <FormItem {...formProps.itemLayout} key={item.key} label={<span>{item.label}</span>}>
                                            {getFieldDecorator(item.name, {
                                                initialValue: item.value,
                                            })(<Input />)}
                                        </FormItem>
                                    )
                                case 'textarea':
                                    return (
                                        <FormItem {...formProps.itemLayout} key={item.key} label={<span>{item.label}</span>}>
                                            {getFieldDecorator(item.name, {
                                                initialValue: item.value,
                                            })(<TextArea />)}
                                        </FormItem>
                                    )
                                case 'upload':
                                    return (
                                        <FormItem {...formProps.itemLayout} key={item.key} lable={<span>{item.label}></span>}>
                                            <Upload {...uploadProps}>
                                                <Button>
                                                    <Icon type="upload" />点击上传视频
                                                </Button>
                                            </Upload>
                                        </FormItem>
                                    )
                            }
                        })}
                    </Form>
                </div>
            </Modal>
        </div >
    )
}

export default Form.create()(ProductCardForm)
