<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member.js";

const router = useRouter();

const memberStore = useMemberStore();

const { isLogin, isLoginError, userInfo } = storeToRefs(memberStore);
const { userLogin, getUserInfo } = memberStore;

const memberId = ref($cookies.get("id"));
const memberPw = ref("");
const saveid = ref($cookies.get("issave"));

const apiResult = ref({
    result: "",
    msg: "",
});

const login = async () => {
    const loginUser = {
        memberId: memberId.value,
        memberPw: memberPw.value,
    };
    const response = await userLogin(loginUser);
    apiResult.value = response;
    if (apiResult.value.result === "err") {
        setTimeout(() => (apiResult.value.result = ""), 3000);
        return;
    }
    let token = sessionStorage.getItem("accessToken");
    console.log(token);
    console.log("isLogin: " + isLogin.value);
    if (isLogin.value) {
        getUserInfo(token);
        console.log("userInfo : " + userInfo.value);

        if (saveid.value) {
            $cookies.set("id", memberId.value);
            $cookies.set("issave", true);
        } else {
            $cookies.set("id", "");
            $cookies.set("issave", false);
        }
        router.push({ name: "home" });
    }
};
</script>

<template>
    <div class="shadow-sm rounded border p-5 position-absolute start-50 translate-middle-x" id="login_div">
        <h4>로그인</h4>
        <p class="mb-5">환영해요! 다시 오셨네요 :)</p>
        <form id="form-login" method="POST" @submit.prevent="login">
            <input type="hidden" name="action" value="login" />
            <div class="form_group">
                <div class="d-flex flex-row justify-content-between">
                    <label>아이디</label><br />
                    <span> <input style="width: 15px; height: 15px" class="m-1" type="checkbox" id="saveid" name="saveid" v-model="saveid" /> 아이디 저장 <br /> </span>
                </div>
                <input class="form-contro p-1 mb-3" type="text" id="userid" v-model="memberId" value="" style="width: 100%" placeholder="아이디를 입력해주세요." required />

                <label>비밀번호</label><br />
                <input class="form-control p-1 mb-5" type="password" id="userpwd" @keyup.enter="login" v-model="memberPw" style="width: 100%" placeholder="비밀번호를 입력해주세요." required />
                <div class="alert alert-danger" role="alert" v-if="apiResult.result == 'err'">{{ apiResult.msg }}</div>
                <button type="submit" id="regist" class="col-12 btn btn-primary mb-3">로그인</button>
                <div class="d-flex justify-content-center">
                    <a href="#" class="text-decoration-none text-primary" onclick="">
                        <RouterLink :to="{ name: 'join' }" style="text-decoration: none">회원가입</RouterLink>
                    </a>
                    <span class="ps-1 pe-1">|</span>
                    <a href="#" class="text-decoration-none text-primary" onclick="">
                        <RouterLink :to="{ name: 'findpwd' }" style="text-decoration: none">비밀번호 찾기</RouterLink>
                    </a>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #login_div {
        position: relative;
        top: 130px;
        width: 45%;
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #login_div {
        position: relative;
        top: 130px;
        width: 80%;
    }
}
</style>
