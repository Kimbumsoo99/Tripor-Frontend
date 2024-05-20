<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SideMenu from "@/components/layout/SideMenu.vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const route = useRoute();
const memberStore = useMemberStore();

const { isLogin, userInfo } = storeToRefs(memberStore);
const { userLogout } = memberStore;

const sideFlag = ref(false);

const logout = () => {
    userLogout();
};

onMounted(async () => {
    const { getUserInfo } = memberStore;
    let token = sessionStorage.getItem("accessToken");
    if (token) {
        await getUserInfo(token);
    }
});

function openMobileMenu() {
    sideFlag.value = true;
}

function closeCallback() {
    sideFlag.value = false;
}
</script>

<template>
    <div>
        <SideMenu v-if="sideFlag" @close-side="closeCallback" />
        <div id="header_div" class="fixed-top" :class="[route.name === 'home' ? 'home-style' : '']">
            <div class="navbar navbar-expand-md bg-white navbar-light">
                <div id="mobile_menu" class="d-block d-md-none">
                    <i class="bi bi-list" style="font-size: 24px; cursor: pointer" @click="openMobileMenu"></i>
                </div>
                <div class="container-fluid justify-content-center ps-3 pe-3">
                    <RouterLink :to="{ name: 'home' }" class="col-lg-2 d-flex justify-content-center" id="header_title">Tripːor</RouterLink>

                    <div class="col-lg-2 d-none d-lg-block collapse navbar-collapse d-flex flex-row justify-content-end" id="header_join_login" style="display: block; overflow: hidden; white-space: nowrap">
                        <template v-if="userInfo == null">
                            <RouterLink :to="{ name: 'join' }" style="text-decoration: none; color: #0077cc"><button id="joinButton" class="btn btn-outline-primary m-1">회원가입</button></RouterLink>
                            <RouterLink :to="{ name: 'login' }" style="text-decoration: none; color: white"><button id="logInButton" class="btn text-white btn-primary m-1">로그인</button></RouterLink>
                        </template>
                        <template v-else>
                            <div class="d-flex flex-row align-items-center">
                                <!-- <div class="profile-image-area me-1">
									<img src="@/assets/image/default_profile_img.png" id="profileImage">
									
								</div> -->
                                <span class="me-1">{{ userInfo.memberName }}님 로그인 중</span>
                                <button id="logOutButton" class="btn text-white btn-primary m-1" @click="logout">로그아웃</button>
                            </div>
                        </template>
                    </div>
                    <div style="width: 60px" class="d-none d-lg-block"></div>
                </div>
            </div>
            <div id="contour"></div>
        </div>
    </div>
</template>

<style scoped>
.profile-image-area{
    width: 33px;
    height: 33px;
    border: 1px solid #ccc;
    border-radius: 50%;

    position: relative;

    overflow: hidden;
    display: flex;
    justify-content: center;
    align-content: center;
}
@media (min-width: 768px) {
    .home-style .navbar {
        padding-left: 20px;
        padding-right: 60px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
}
@media (max-width: 768px) {
    .home-style .navbar {
        height: 138px;
        padding-left: 60px;
        padding-right: 60px;
        padding-top: 0px;
        padding-bottom: 0px;
    }
}
#header_div {
    z-index: 10000;
}
#header_div .router-link-active {
    text-decoration: none;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    color: #0077cc;
}
#header_title {
    color: #0077cc;
    font-size: 40px;
    font-family: "GangwonEduPowerExtraBoldA";
    text-decoration: none;
}
#contour {
    margin: 0;
    border: 0;
    width: 100%;
    height: 2px;
    background-color: #0077cc;
}
#mobile_menu {
    position: fixed;
    top: 20px;
    left: 20px;
}
</style>
