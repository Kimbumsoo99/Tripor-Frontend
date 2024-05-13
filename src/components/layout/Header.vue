<script setup>
</script>

<template>
    <div id="header_div" class="fixed-top">
		<div class="navbar navbar-expand-md bg-white navbar-light">
			<div class="container-fluid">
					
				<RouterLink :to="{ name: 'home' }" style="text-decoration: none; height: 60px" class="navbar-brand fw-bold fs-1 col-lg-2 d-flex justify-content-center" id="header_title">Tripːor</RouterLink>
	
				<div
					class="col-lg-2 d-none d-md-none d-lg-none collapse navbar-collapse d-flex flex-row justify-content-end"
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
</template>

<style scoped>
#header_div{
	z-index: 10000;
}
.router-link-active {
  text-decoration: none;
  color: white;
  height: 55px;
  text-align: center;
}
.navbar{
	height: 80px;
    padding-left: 110px; padding-right: 110px;
    padding-top: 10px; padding-bottom: 10px;
}
#header_title {
    color: #0077CC;
	font-size: 32px;
    font-family: "GangwonEduPowerExtraBoldA";
}
#contour{
    margin: 0;
    border: 0;
    width: 100%;
    height: 2px;
    background-color: #0077CC;
}
</style>