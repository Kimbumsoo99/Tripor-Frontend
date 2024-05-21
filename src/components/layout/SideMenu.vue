<script setup>
import { ref } from 'vue';
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
const memberStore = useMemberStore();

const { isLogin, userInfo } = storeToRefs(memberStore);
const { userLogout } = memberStore;
const emit = defineEmits(['closeSide'])

const logout = () => {
    userLogout();
};

const closeSide = () => {
    emit('closeSide')
}

const isExpanded = ref(false);

const toggle = () => {
    if (isExpanded.value === false) {
        isExpanded.value = true;
    } else {
        isExpanded.value = false;
    }
};
</script>

<template>
    <div id="side_menu">
				<div>
					<i class="bi bi-x-lg" style="font-size: 24px; cursor:pointer" @click="closeSide"></i>
					<div style="cursor: pointer" class="pt-3 pb-3 m-1 rounded menu_button row">
						<RouterLink :to="{ name: 'home' }" style="text-decoration: none; color:#332D2D">
							<div class="col-12" onclick="">
								<i class="bi bi-house-door-fill me-3"></i>
								<span>홈</span>
							</div>
						</RouterLink>
					</div>
					<div style="cursor: pointer" class="pt-3 pb-3 m-1 rounded menu_button row">
						<RouterLink :to="{ name: 'makeplan' }" style="text-decoration: none; color:#332D2D">
						<div class="col-12" onclick="">
							<i class="bi bi-search me-3"></i>
							<span>여행 계획 만들기</span>
						</div>
						</RouterLink>
					</div>
					<div style="cursor: pointer" class="pt-3 pb-3 m-1 rounded menu_button row">
						<RouterLink :to="{ name: 'board' }" style="text-decoration: none; color:#332D2D">
						<div class="col-12" onclick="">
							<i class="bi bi-pencil-square me-3"></i>
							<span>여행 정보 공유하기</span>
						</div>
						</RouterLink>
					</div>
					<div>
						<div style="cursor: pointer" id="expandDiv" class="pt-3 pb-3 m-1 rounded menu_button row" @click="toggle">
							<div
								class="col-10"
								id="myPageDiv"                  
								style="padding: 0 12px">
								<i class="bi bi-person-circle me-3"></i>
								<span>마이페이지</span>
							</div>
							<i v-if="!isExpanded" class="bi bi-caret-up-fill col-2" id="expandIcon"></i>
							<i v-if="isExpanded"
								class="bi bi-caret-down-fill col-2"
								id="foldIcon"></i>
						</div>
						<div class="ps-5 pt-1" id="myPageExpand" v-if="isExpanded">
							<div>
								<RouterLink :to="{ name: 'myplan' }" style="text-decoration: none; color:#332D2D"><a style="cursor: pointer" onclick="">-&nbsp;&nbsp;&nbsp;나의 여행 계획</a></RouterLink>
							</div>
							<div style="height: 10px"></div>
							<div>
								<RouterLink :to="{ name: 'profile' }" style="text-decoration: none; color:#332D2D"><a style="cursor: pointer" onclick="">-&nbsp;&nbsp;&nbsp;회원정보 수정</a></RouterLink>
							</div>
							
						</div>
					</div>
				</div>
				<div
					id="aside_join_login"
					style="display: block; overflow: hidden; white-space: nowrap;">
					<div v-if="userInfo == null">
						<RouterLink :to="{ name: 'join' }" style="text-decoration: none; color: #0077CC"><button id="joinButton" class="btn btn-outline-primary m-1">회원가입</button></RouterLink>
						<RouterLink :to="{ name: 'login' }" style="text-decoration: none; color: white"><button id="logInButton" class="btn text-white btn-primary m-1">로그인</button></RouterLink>
					</div>
					<div v-else>
						<span class="me-1">{{ userInfo.memberName }} 님 로그인 중</span>
						<button id="logOutButton" class="btn text-white btn-primary m-1" @click="logout">로그아웃</button>
					</div>
			</div>
		</div>
</template>

<style scoped>
@media (min-width: 1199px) {
	#side_menu{
		display: none;
	}
}
@media (max-width: 1199px) {
	#side_menu{
		width: 300px;
		height: 100%;
		background-color: white;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100000000;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}
#aside_div{
    width: 350px; 
    height: 100%; 
    z-index: 9; 
    padding-right: 0; 
    z-index:9999
}
#aside_login_join{
	position: absolute;
	left: 20px;
	bottom: 20px;
}
</style>