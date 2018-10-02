import request from "../utils/request"

export async function fetchTargets() {
    return request("/v1/target/list")
}

export async function addTarget(target) {
    let data = {}
    for (let k in target) {
        if (target[k]) {
            data[k] = target[k]
        }
    }
    return request("/v1/target/add", {
        method: "POST",
        body: data
    })
}

export async function updateTarget(target) {
    let data = {}
    for (let k in target) {
        if (target[k]) {
            data[k] = target[k]
        }
    }
    return request("/v1/target/update", {
        method: "POST",
        body: data
    })
}

export async function deleteTarget({ id }) {
    return request("/v1/target/delete", {
        method: "POST",
        body: {
            id: id
        }
    })
}