<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import SideMenu from "@/components/layout/SideMenu.vue";

const route = useRoute()

const isExpanded = ref(false)
const sideFlag= ref(false)

const toggle = () => {
    if (isExpanded.value === false) {
        isExpanded.value = true
    } else {
        isExpanded.value = false
    }
}

function openMobileMenu() {
	sideFlag.value = true;
}

function closeCallback() {
	sideFlag.value = false;
}

</script>

<template>
	<div>
		<SideMenu v-if="sideFlag" @close-side="closeCallback"/>
		<div id="header_div" class="fixed-top" :class="[route.name === 'home'?'home-style':'']">
			<div class="navbar navbar-expand-md bg-white navbar-light">
				<div id="mobile_menu" class="d-block d-md-none">
					<i class="bi bi-list" style="font-size: 24px; cursor:pointer" @click="openMobileMenu"></i>
					
				</div>
				<div class="container-fluid justify-content-center">
						
					<RouterLink :to="{ name: 'home' }" class="col-lg-2 d-flex justify-content-center" id="header_title">Tripːor</RouterLink>
					
					<div
						class="col-lg-2 d-none d-lg-block collapse navbar-collapse d-flex flex-row justify-content-end"
						id="header_join_login"
						style="display: block; overflow: hidden; white-space: nowrap;">

							<RouterLink :to="{ name: 'join' }" style="text-decoration: none; color: #0077CC"><button id="joinButton" class="btn btn-outline-primary m-1">회원가입</button></RouterLink>
							<RouterLink :to="{ name: 'login' }" style="text-decoration: none; color: white"><button id="logInButton" class="btn text-white btn-primary m-1">로그인</button></RouterLink>
							<div style="display:none">
								<span>{} 님 로그인 중</span>
								<button id="logOutButton" class="btn text-white btn-primary m-1" onclick="">로그아웃</button>
							</div>
					</div>
				</div>
			</div>
			<div id="contour"></div>
		</div>
	</div>
</template>

<style scoped>
@media (min-width: 768px){
	.home-style .navbar{
		padding-left: 20px; padding-right: 60px;
		padding-top: 10px; padding-bottom: 10px;
	}
}
@media (max-width: 768px) {
    .home-style .navbar{
		height: 138px;
		padding-left: 60px; padding-right: 60px;
		padding-top: 0px; padding-bottom: 0px;
	}
}
.navbar{
	padding-left: 20px; padding-right: 60px;
	padding-top: 10px; padding-bottom: 10px;
}
#header_div{
	z-index: 10000;
}
#header_div .router-link-active {
  text-decoration: none;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  color: #0077CC;
}
#header_title {
    color: #0077CC;
	font-size: 40px;
    font-family: "GangwonEduPowerExtraBoldA";
	text-decoration: none;
}
#contour{
    margin: 0;
    border: 0;
    width: 100%;
    height: 2px;
    background-color: #0077CC;
}
#mobile_menu{
	position: fixed;
	top: 20px;
	left: 20px;
}
</style>