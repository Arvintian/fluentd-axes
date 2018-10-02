import { fetchTargets, addTarget, updateTarget, deleteTarget } from "../../services/target"
import { message } from "antd"

export default {
    namespace: "dashboard",

    state: {
        applist: []
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    },

    effects: {

        *fetchData({ payload }, { put, call, select }) {
            let data = yield call(fetchTargets)
            if (data.result) {
                yield put({
                    type: "save",
                    payload: {
                        applist: data.result
                    }
                })
            }
        },

        *addApp({ payload: { item } }, { put, call, select }) {
            let data = yield call(addTarget, { ...item })
            if (data.status == "ok") {
                yield put({
                    type: "fetchData",
                    payload: {}
                })
                message.success("添加成功")
            } else {
                message.error(data.reason)
            }
        },

        *updateApp({ payload: { item } }, { put, call, select }) {
            let data = yield call(updateTarget, { ...item })
            if (data.status == "ok") {
                yield put({
                    type: "fetchData",
                    payload: {}
                })
                message.success("更新成功")
            } else {
                message.error(data.reason)
            }
        },

        *deleteApp({ payload: { id } }, { put, call, select }) {
            let data = yield call(deleteTarget, { id })
            if (data.status == "ok") {
                yield put({
                    type: "fetchData",
                    payload: {}
                })
                message.success("删除成功")
            } else {
                message.error(data.reason)
            }
        }

    }
}