<script setup>

</script>

<template>
    <div class="fixed-top">
		<div class="navbar navbar-expand-md bg-white navbar-light">
			<div class="container-fluid justify-content-center">
				<RouterLink :to="{ name: 'home' }" style="text-decoration: none;"><a href="" class="navbar-brand fw-bold fs-1 col-lg-2" id="header_title">Tripor</a></RouterLink>
				

				<div
					class="col-lg-2 d-none d-md-none d-lg-none collapse navbar-collapse d-flex flex-row justify-content-end me-5 pe-5"
					id="header_join_login"
					style="display: block; overflow: hidden; white-space: nowrap;">

						<button id="joinButton" class="btn btn-outline-primary m-1"><RouterLink :to="{ name: 'join' }" style="text-decoration: none; color: #0077CC">회원가입</RouterLink></button>
						<button id="logInButton" class="btn text-white btn-primary m-1"><RouterLink :to="{ name: 'login' }" style="text-decoration: none; color: white">로그인</RouterLink></button>
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
.router-link-active {
  text-decoration: none;
  color: white;
}
.navbar{
    padding-left: 120px; padding-right: 120px;
    padding-top: 10px; padding-bottom: 10px;
}
#header_title {
    color: #0077CC;
    font-family: "Poetsen One", sans-serif;
}
#contour{
    margin: 0;
    border: 0;
    width: 100%;
    height: 2px;
    background-color: #0077CC;
}
</style>