import React from 'react'
import { connect } from "dva"
import { Card, Table, Button, Modal, Form, Input } from "antd"

const FormItem = Form.Item
const createFormField = Form.createFormField

class ModalForm extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props)
        const { getFieldDecorator } = this.props.form
        let formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        }
        return (
            <Form>
                <FormItem label="应用名称" {...formItemLayout}>
                    {getFieldDecorator("name", {})(
                        <Input placeholder="应用名称"></Input>
                    )}
                </FormItem>
            </Form>
        )
    }

}

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
        console.log(record)
        this.setState({
            modal: true,
            edit: "update",
            item: record
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
                    <a href="javascript:;" onClick={() => this.onEdit(record)}>编辑</a>
                )
            }
        }]
        let extra = <a href="javascript:;" onClick={() => this.onAdd()}>添加</a>
        let dataSource = this.props.applist
        //modal
        let WrapperModalForm = Form.create({
            mapPropsToFields: (props) => {
                return {
                    name: createFormField({
                        value: props.fields.name.value
                    })
                }
            },
            onFieldsChange: (props, fields) => {
                console.log(props)
                console.log(fields)
            }
        })(ModalForm)
        let fields = {
            name: {
                value: this.state.item.name
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
                    <WrapperModalForm fields={fields} ></WrapperModalForm>
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