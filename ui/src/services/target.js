import request from "../utils/request"

export async function fetchTargets() {
    return request("/v1/target/list")
}