import { fetchTargets } from "../../services/target"

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
            console.log("fetch applist")
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
            console.log("add app")
            console.log(item)
        },

        *updateApp({ payload: { item } }, { put, call, select }) {
            console.log("update add")
            console.log(item)
        }

    }
}