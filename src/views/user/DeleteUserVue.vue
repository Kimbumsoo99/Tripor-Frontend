<script setup>
import axios from "axios";
import { useMemberStore } from "@/stores/member";
import { useRouter } from "vue-router";

const router = useRouter();

const memberStore = useMemberStore();

const { userInfo } = memberStore;

const userRemove = async function () {
    await axios.delete(`http://localhost:8080/member/${userInfo.memberId}`);
    alert("회원탈퇴가 완료되었습니다.");
    router.push({ name: "home" });
};
</script>

<template>
    <div class="p-5 mb-3 position-absolute start-50 translate-middle-x" id="delete_user_div">
        <img src="/src/assets/image/no_image_logo.png" style="height: 380px" />
        <div style="height: 20px"></div>
        <h4>정말로 탈퇴하시겠어요?</h4>
        <p>탈퇴 버튼 클릭 시, 계정은 삭제되며 복구되지 않습니다.</p>
        <div style="height: 10px"></div>
        <button class="btn btn-primary mb-3" style="width: 100px" @click="userRemove">탈퇴하기</button>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #delete_user_div {
        white-space: nowrap;
        text-align: center;
        position: absolute;
        top: 130px;
        width: 55%;
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #delete_user_div {
        white-space: nowrap;
        text-align: center;
        position: absolute;
        top: 130px;
        width: 100%;
    }
}
</style>
