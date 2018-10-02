import React from 'react'
import { connect } from "dva"
import { Card, Table, Popconfirm, Modal, Form, Input } from "antd"

const FormItem = Form.Item
const createFormField = Form.createFormField

class ModalForm extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }
        return (
            <Form>
                <h3>应用设置</h3>
                <FormItem label="应用名称" {...formItemLayout}>
                    {getFieldDecorator("name", {})(<Input></Input>)}
                </FormItem>
                <FormItem label="Fluentd" {...formItemLayout}>
                    {getFieldDecorator("target", {})(<Input></Input>)}
                </FormItem>
                <h3>kafka设置</h3>
                <FormItem label="Brokers" {...formItemLayout}>
                    {getFieldDecorator("brokers", {})(<Input></Input>)}
                </FormItem>
                <FormItem label="Topic" {...formItemLayout}>
                    {getFieldDecorator("topic", {})(<Input></Input>)}
                </FormItem>
                <h3>sls设置</h3>
                <FormItem label="Access id" {...formItemLayout}>
                    {getFieldDecorator("sls_access_key_id", {})(<Input></Input>)}
                </FormItem>
                <FormItem label="Access secret" {...formItemLayout}>
                    {getFieldDecorator("sls_access_key_secret", {})(<Input></Input>)}
                </FormItem>
                <FormItem label="Project" {...formItemLayout}>
                    {getFieldDecorator("sls_project", {})(<Input></Input>)}
                </FormItem>
                <FormItem label="Region endpoint" {...formItemLayout}>
                    {getFieldDecorator("sls_region_endpoint", {})(<Input></Input>)}
                </FormItem>
                <FormItem label="Logstore" {...formItemLayout}>
                    {getFieldDecorator("sls_logstore", {})(<Input></Input>)}
                </FormItem>
            </Form>
        )
    }

}

const WrapperModalForm = Form.create({
    mapPropsToFields: (props) => {
        let fields = {}
        for (let k in props.fields) {
            fields[k] = createFormField({
                value: props.fields[k].value
            })
        }
        return fields
    },
    onFieldsChange: (props, fields) => {
        props.onFormChange(fields)
    }
})(ModalForm)

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            edit: "update",
            item: {}
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: "dashboard/fetchData",
            payload: {}
        })
    }

    onAdd() {
        this.setState({
            modal: true,
            edit: "add",
            item: {}
        })
    }

    onEdit(record) {
        this.setState({
            modal: true,
            edit: "update",
            item: record
        })
    }

    onDelete(record) {
        this.props.dispatch({
            type: "dashboard/deleteApp",
            payload: {
                id: record.id
            }
        })
    }

    onModalCancel() {
        this.setState({
            modal: false
        })
    }

    onModalOk() {
        if (this.state.edit == "add") {
            this.props.dispatch({
                type: "dashboard/addApp",
                payload: {
                    item: this.state.item
                }
            })
        } else if (this.state.edit == "update") {
            this.props.dispatch({
                type: "dashboard/updateApp",
                payload: {
                    item: this.state.item
                }
            })
        }
        this.setState({
            modal: false
        })
    }

    onFormChange(fields) {
        let change = {}
        for (let k in fields) {
            change[k] = fields[k].value
        }
        this.setState({
            item: {
                ...this.state.item,
                ...change
            }
        })
    }

    render() {
        let colums = [{
            title: "应用ID",
            dataIndex: "id",
            key: "id",
        }, {
            title: "应用名称",
            dataIndex: "name",
            key: "name"
        }, {
            title: "Fluentd规则",
            dataIndex: "target",
            key: "target"
        }, {
            title: "操作",
            key: "edit",
            render: (text, record) => {
                return (
                    <div>
                        <a href="javascript:;" onClick={() => this.onEdit(record)}>编辑</a>|
                        <Popconfirm title="确认删除吗？" onConfirm={() => this.onDelete(record)} okText="好" cancelText="取消">
                            <a href="javascript:;" style={{ color: "red" }}>删除</a>
                        </Popconfirm>
                    </div >
                )
            }
        }]
        let extra = <a href="javascript:;" onClick={() => this.onAdd()}>添加</a>
        let dataSource = this.props.applist
        //console.log(dataSource)
        //modal
        let fields = {}
        for (let k in this.state.item) {
            fields[k] = {
                value: this.state.item[k]
            }
        }
        return (
            <div>
                <Card title="应用列表" extra={extra}>
                    <Table bordered={true} rowKey="id" dataSource={dataSource} columns={colums}></Table>
                </Card>
                <Modal
                    title={this.state.edit == "add" ? "添加" : "更新"}
                    visible={this.state.modal}
                    onCancel={() => this.onModalCancel()}
                    onOk={() => this.onModalOk()}
                    closable={false}
                >
                    <WrapperModalForm
                        fields={fields}
                        onFormChange={(fields) => this.onFormChange(fields)}
                    >
                    </WrapperModalForm>
                </Modal>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        applist: state.dashboard.applist
    }
}

export default connect(mapStateToProps)(Dashboard)