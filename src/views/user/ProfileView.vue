<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { insertImage } from "@/api/article.js";
const { VITE_UPLOAD_FILE_PATH } = import.meta.env;
import { localAxios } from "@/util/http-commons";
const local = localAxios();
const memberStore = useMemberStore();

const { userInfo } = storeToRefs(memberStore);

onMounted(() => {
    console.log(userInfo.value);
    console.log(modifyProfile.value);
});

const name = ref(userInfo.value.memberName);
const pw = ref(userInfo.value.memberPw);
const email = ref(userInfo.value.emailId + "@" + userInfo.value.emailDomain);

const isComplete = ref(false);

const memberUpdate = async function () {
    await local
        .put("/member", {
            memberId: userInfo.value.memberId,
            memberPw: pw.value,
            memberName: name.value,
            emailId: email.value.split("@")[0],
            emailDomain: email.value.split("@")[1],
            profile: modifyProfile.value,
        })
        .then(() => {
            isComplete.value = true;
        });
};

const images = ref([]);
const modifyProfile = ref(userInfo.value.profile);

const handleImageUpload = async () => {
    images.value.click();
};

const handleImageRemove = () => {
    modifyProfile.value = null;
};

const upload = async () => {
    await insertImage(
        images.value.files[0],
        (res) => {
            modifyProfile.value = `${VITE_UPLOAD_FILE_PATH}/${res.data.fileInfo.saveFolder}/${res.data.fileInfo.saveFile}`;
        },
        (err) => console.log(err)
    );
};
</script>

<template>
    <div class="show_logIn shadow-sm rounded border p-5 mb-3 position-absolute start-50 translate-middle-x" id="myPage_div">
        <div>
            <form method="POST" action="" @submit.prevent="memberUpdate">
                <h5 class="mb-5">마이페이지</h5>
                <div class="d-flex flex-row justify-content-between">
                    <h4 class="mb-4">회원정보</h4>
                    <RouterLink :to="{ name: 'deleteuser' }" style="text-decoration: none; font-size: 14px">회원탈퇴&#8594;</RouterLink>
                </div>
                <input type="hidden" name="action" value="modify" />
                <div class="form_group">
                    <div id="profile_div">
                        <div class="d-flex flex-column align-items-center" id="profile_upper" style="position: relative">
                            <div class="profile-image-area">
                                <img :src="modifyProfile ? modifyProfile : '/src/assets/image/default_profile_img.png'" id="profileImage" />
                            </div>
                            <div class="profile-btn-area mt-3">
                                <button type="button" class="btn btn-outline-secondary btn-sm me-1" @click="handleImageUpload">이미지 선택</button>
                                <input type="file" name="profileImage" ref="images" @change="upload" id="imageInput" accept="image/*" />
                                <button type="button" class="btn btn-outline-danger btn-sm" @click="handleImageRemove">삭제</button>
                            </div>
                        </div>
                        <div style="width: 30px"></div>
                        <div class="mt-3" id="info_upper">
                            <div class="d-flex flex-row mb-3"><label style="width: 100px">이름</label> <input class="p-1 mb-3 ms-1" type="text" id="mypage_name" name="userName" style="width: 100%; text-align: right" v-model="name" required /></div>
                            <div class="d-flex flex-row mb-3"><label style="width: 100px">이메일</label> <input class="p-1 mb-3 ms-1" type="email" id="mypage_email" name="useremail" style="width: 100%; text-align: right" v-model="email" required /></div>
                            <div class="d-flex flex-row mb-5"><label style="width: 100px">비밀번호</label> <input class="p-1 mb-3 ms-1" type="password" id="mypage_pwd" name="userpwd" style="width: 100%; text-align: right" v-model="pw" required /></div>
                        </div>
                    </div>
                    <button class="col-12 btn btn-primary mb-3">정보수정</button>
                    <p id="complete_msg" v-if="isComplete">회원정보 수정이 완료되었습니다.</p>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #myPage_div {
        position: relative;
        top: 130px;
        width: 45%;
        margin-left: 100px;
    }
    #profile_div {
        display: flex;
        flex-direction: row;
        margin: 0px;
    }
    #profile_upper {
        width: 35%;
    }
    #info_upper {
        width: 65%;
    }
}
@media (max-width: 1199px) {
    #myPage_div {
        position: relative;
        top: 130px;
        width: 80%;
    }
    #profile_div {
        display: flex;
        flex-direction: column;
    }
    .profile-image-area {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
#complete_msg {
    text-align: center;
    font-size: 16px;
    color: rgb(220, 0, 0);
}
.profile-image-area {
    object-fit: cover;
    width: 150px;
    height: 150px;
    border: 1px solid #ccc;
    border-radius: 50%;

    position: relative;

    overflow: hidden;
    display: flex;
    justify-content: center;
    align-content: center;
}
#profileImage {
    height: 100%;
}
#deleteImage {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
}

/* .profile-btn-area > *{
    width: 100px;
    height: 33px;
    padding: 5px 10px;

    border: 1px solid black;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
} */

#imageInput {
    display: none;
}
</style>
