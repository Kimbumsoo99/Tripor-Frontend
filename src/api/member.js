import { localAxios } from "@/util/http-commons";

const local = localAxios();

async function userConfirm(param, success, fail) {
    await local.post(`/member/login`, param).then(success).catch(fail);
}

async function findById(memberId, success, fail) {
    local.defaults.headers["Authorization"] = sessionStorage.getItem("accessToken");
    await local.get(`/member/info/${memberId}`).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
    local.defaults.headers["refreshToken"] = sessionStorage.getItem("refreshToken"); //axios header에 refresh-token 셋팅
    await local.post(`/member/refresh`, user).then(success).catch(fail);
}

async function logout(memberId, success, fail) {
    await local.get(`/member/logout/${memberId}`).then(success).catch(fail);
}

export { userConfirm, findById, tokenRegeneration, logout };
