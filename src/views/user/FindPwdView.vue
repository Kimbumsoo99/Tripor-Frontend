<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia"; 

const memberStore = useMemberStore();

const { userInfo } = memberStore;

const id = ref('');
const email = ref('');
const name = ref('');
const pw = ref('');

const find = ref(false);
const noexist = ref(false);


const findPassword = async function () {
	try {
		find.value = false;
		noexist.value = false;

		const response = await axios.get(`http://localhost/member/${id.value}`);

		if (response.data.member === null) {
			noexist.value = true;
			return;
		}

		const memberEmail = response.data.member.emailId + '@' + response.data.member.emailDomain;

		if (email.value === memberEmail && name.value === response.data.member.memberName) {
			pw.value = response.data.member.memberPw;
			find.value = true;
		} else {
			noexist.value = true;
		}
	} catch (error) {
		console.log(error)
	}
}

</script>

<template>
		<div class="shadow-sm rounded border p-5 mb-3 position-absolute start-50 translate-middle-x"
            id="findPwd_div">
		<form method="POST" action="" @submit.prevent="findPassword">
			<input type="hidden" name="action" value="findpwd"/>
	
				<h4 class="mb-4">비밀번호 찾기</h4>
				<div class="form_group">
					<div class="d-flex flex-row mb-3">
						<label style="width: 90px">아이디</label> <input
							class="p-1 mb-3 ms-3" type="text" id="findPwd_id"
							style="width: 100%" name="userid" v-model="id" required />
					</div>
					<div class="d-flex flex-row mb-3">
						<label style="width: 90px">이메일</label> <input
							class="p-1 mb-3 ms-3" type="email" id="findPwd_email"
							style="width: 100%" name="useremail" v-model="email" required />
					</div>
					<div class="d-flex flex-row mb-3">
						<label style="width: 90px">이름</label> <input class="p-1 mb-3 ms-3"
							type="text" id="findPwd_name" name="username" style="width: 100%" v-model="name"
							required />
					</div>
					<button class="col-12 btn btn-primary mb-3">
						비밀번호 찾기</button>
					<p id="pwd_ans" v-if="find" class="d-flex justify-content-center">비밀번호는 {{ pw }} 입니다.</p>
					<p id="pwd_no" v-if="noexist">해당 회원 정보가 없습니다.</p>
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
#pwd_no{
	text-align: center; 
	font-size: 16px;
	color: rgb(220, 0, 0);
}
</style>