<script setup>

</script>

<template>
		<div class="shadow-sm rounded border p-5 mb-3 position-absolute start-50 translate-middle-x"
            id="findPwd_div">
		<form method="POST" action="">
			<input type="hidden" name="action" value="findpwd"/>
	
				<h4 class="mb-4">비밀번호 찾기</h4>
				<div class="form_group">
					<div class="d-flex flex-row mb-3">
						<label style="width: 90px">아이디</label> <input
							class="p-1 mb-3 ms-3" type="text" id="findPwd_id"
							style="width: 100%" name="userid" value="" required />
					</div>
					<div class="d-flex flex-row mb-3">
						<label style="width: 90px">이메일</label> <input
							class="p-1 mb-3 ms-3" type="email" id="findPwd_email"
							style="width: 100%" name="useremail" value="" required />
					</div>
					<div class="d-flex flex-row mb-3">
						<label style="width: 90px">이름</label> <input class="p-1 mb-3 ms-3"
							type="text" id="findPwd_name" name="username" style="width: 100%" value=""
							required />
					</div>
					<button class="col-12 btn btn-primary mb-3">
						비밀번호 찾기</button>
					<p id="pwd_ans" class="d-flex justify-content-center"></p>
				</div>
	
		</form>
	</div>

</template>

<style scoped>
@media (min-width: 1199px) {
    #findPwd_div{
		position: relative; 
		top: 130px; 
		width: 45%;
		margin-left: 100px;
	}
}
@media (max-width: 1199px) {
    #findPwd_div{
		position: relative; 
		top: 130px; 
		width: 80%;
	}
}
</style>