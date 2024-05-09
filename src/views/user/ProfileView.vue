<script setup>

</script>

<template>
    <div
			class="show_logIn shadow-sm rounded border p-5 mb-3 position-absolute start-50 translate-middle-x" id="myPage_div">
			<div>
				<form method="POST" action="">
					<h5 class="mb-5">마이페이지</h5>
					<h4 class="mb-4">회원정보</h4>
					<input type="hidden" name="action" value="modify"/>
					<div class="form_group">
						<div class="d-flex flex-row mb-3">
							<label style="width: 90px">이름</label> <input
								class="p-1 mb-3 ms-3" type="text" id="mypage_name"
								name="userName"
								style="width: 100%; text-align: right" value=""
								required />
						</div>
						<div class="d-flex flex-row mb-3">
							<label style="width: 90px">이메일</label> <input
								class="p-1 mb-3 ms-3" type="email" id="mypage_email"
								name="useremail"
								style="width: 100%; text-align: right"
								value="" required />
						</div>
						<div class="d-flex flex-row mb-5">
							<label style="width: 90px">비밀번호</label> <input
								class="p-1 mb-3 ms-3" type="password" id="mypage_pwd"
								name="userpwd"
								style="width: 100%; text-align: right" value=""
								required />
						</div>
						<button class="col-12 btn btn-primary mb-3">정보수정</button>
					</div>
				</form>
			</div>
		</div>
</template>

<style scoped>
#myPage_div{
    position: relative; 
    top: 130px; 
    width: 45%;
}
</style>