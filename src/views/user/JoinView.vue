<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { insertImage } from "@/api/article.js";
const { VITE_UPLOAD_FILE_PATH } = import.meta.env;

const router = useRouter();

const sidoList = ref([]);
const gugunList = ref([]);
const memberName = ref("");
const memberId = ref("");
const memberPw = ref("");
const memberPwCheck = ref("");
const emailId = ref("");
const emailDomain = ref("");
const selectedSido = ref("");
const gugun = ref("");
const profile = ref(null);

const duplicatedId = ref(false);
const incorrectPw = ref(false);

const getSido = async function () {
    await axios.get("http://localhost:8080/trip/sido").then((response) => {
        sidoList.value = response.data.items;
    });
};

onMounted(() => {
    getSido();
});

watch(selectedSido, (newVal) => {
    getGugun(newVal);
});

const getGugun = async function (sido) {
    await axios.get(`http://localhost:8080/trip/${sido}/gugun`).then((response) => {
        gugunList.value = response.data.items;
    });
};

const joinUser = async function () {
    if (memberPw.value === memberPwCheck.value) {
        incorrectPw.value = false;
        try {
            const response = await axios.post("http://localhost:8080/member", {
                memberId: memberId.value,
                memberPw: memberPw.value,
                memberName: memberName.value,
                emailId: emailId.value,
                emailDomain: emailDomain.value,
                sido: selectedSido.value,
                gugun: gugun.value,
                profile: profile.value,
            });
            router.push({ name: "join_ok" });
        } catch (error) {
            if (error.response.status == 500) {
                // 아이디 중복
                duplicatedId.value = true;
            } else {
                duplicatedId.value = false;
            }
        }
    } else {
        incorrectPw.value = true;
    }
};

const images = ref([]);

const upload = async () => {
    console.log(images.value.files[0]);
    await insertImage(
        images.value.files[0],
        (res) => {
            console.log(res);
            profile.value = `${VITE_UPLOAD_FILE_PATH}/${res.data.fileInfo.saveFolder}/${res.data.fileInfo.saveFile}`;
        },
        (err) => console.log(err)
    );
};
</script>

<template>
    <div class="shadow-sm rounded border p-5 mb-3 position-absolute start-50 translate-middle-x" id="join_div">
        <h4>회원가입</h4>
        <p class="mb-5">환영해요! 여행을 떠나볼까요?</p>
        <form id="form-join" method="POST" action="" @submit.prevent="joinUser">
            <input type="hidden" name="action" value="join" />
            <div class="form_group">
                <label>이름</label><br />
                <input class="p-1 mb-3" type="text" id="username" name="username" style="width: 100%" placeholder="이름을 입력해주세요." v-model="memberName" required />
                <label>아이디</label><br />
                <input class="p-1 mb-3" type="text" id="userid" name="userid" style="width: 100%" placeholder="아이디를 입력해주세요." v-model="memberId" required />

                <label>비밀번호</label><br />
                <input class="p-1 mb-3" type="password" id="userpwd" name="userpwd" style="width: 100%" placeholder="비밀번호를 입력해주세요." v-model="memberPw" required />
                <label>비밀번호 확인</label><br />
                <input class="p-1 mb-3" type="password" id="userpwdcheck" name="userpwdcheck" style="width: 100%" placeholder="비밀번호를 한 번 더 입력해주세요." v-model="memberPwCheck" required />
                <label>이메일</label><br />
                <div class="d-flex flex-row">
                    <input type="text" class="p-1 mb-3 me-1" id="emailid" name="emailid" placeholder="이메일 아이디를 입력해주세요." style="width: 46%" v-model="emailId" required />
                    <span>@</span>
                    <select class="p-1 ms-2 mb-3" id="emaildomain" style="width: 50%" name="emaildomain" aria-label="이메일 도메인 선택" v-model="emailDomain">
                        <option selected value="">선택</option>
                        <option value="ssafy.com">ssafy.com</option>
                        <option value="gmail.com">gmail.com</option>
                        <option value="naver.com">naver.com</option>
                        <option value="kakao.com">kakao.com</option>
                    </select>
                </div>
                <label>지역</label><br />
                <div class="d-flex flex-row">
                    <select class="p-1 mb-3" id="join-sido" name="sido" style="width: 50%" aria-label="시도 선택" v-model="selectedSido">
                        <option selected value="">선택</option>
                        <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">{{ sido.sidoName }}</option>
                    </select>
                    <select class="p-1 ms-1 mb-3" id="join-gugun" style="width: 50%" name="gugun" aria-label="구군 선택" v-model="gugun">
                        <option selected value="">선택</option>
                        <option v-for="gugun in gugunList" :key="gugun.gugunCode" :value="gugun.gugunCode">{{ gugun.gugunName }}</option>
                    </select>
                    <br />
                </div>
                <div class="col-12" id="msg">
                    <p v-if="duplicatedId">{{ memberId }}은(는) 중복된 아이디입니다.</p>
                    <p v-if="incorrectPw">비밀번호가 일치하지 않습니다.</p>
                </div>
                <button type="submit" id="regist" class="col-12 btn btn-primary mb-3 mt-2">회원가입</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #join_div {
        position: relative;
        top: 130px;
        width: 45%;
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #join_div {
        position: relative;
        top: 130px;
        width: 80%;
    }
}
#msg {
    text-align: center;
    font-size: 16px;
    color: rgb(220, 0, 0);
}
</style>
