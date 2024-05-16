<script setup>
import axios from "axios";
import { ref, computed } from 'vue';
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();

const { userInfo } = storeToRefs(memberStore);

const name = ref(userInfo.value.memberName);
const pw = ref(userInfo.value.memberPw);
const email = ref(userInfo.value.emailId + '@' + userInfo.value.emailDomain);

const isComplete = ref(false)

const memberUpdate = async function () {
    const response = await axios.put("http://localhost/member", {
        "memberId": userInfo.value.memberId,
  		"memberPw": pw.value,
  		"memberName": name.value,
  		"emailId": email.value.split('@')[0],
  		"emailDomain": email.value.split('@')[1]
	})
		.then(() => {
			isComplete.value = true;
		})
	
};
</script>

<template>
    <div
			class="show_logIn shadow-sm rounded border p-5 mb-3 position-absolute start-50 translate-middle-x" id="myPage_div">
			<div>
				<form method="POST" action="" @submit.prevent="memberUpdate">
					<h5 class="mb-5">마이페이지</h5>
					<div class="d-flex flex-row justify-content-between">
							<h4 class="mb-4">회원정보</h4>
							<RouterLink :to="{ name: 'deleteuser' }" style="text-decoration: none; font-size: 14px">회원탈퇴&#8594;</RouterLink>
					</div>
					<input type="hidden" name="action" value="modify"/>
					<div class="form_group">
						<div class="d-flex flex-row mb-3">
							<label style="width: 90px">이름</label> <input
								class="p-1 mb-3 ms-3" type="text" id="mypage_name"
								name="userName"
								style="width: 100%; text-align: right" 
								v-model="name"
								required />
						</div>
						<div class="d-flex flex-row mb-3">
							<label style="width: 90px">이메일</label> <input
								class="p-1 mb-3 ms-3" type="email" id="mypage_email"
								name="useremail"
								style="width: 100%; text-align: right"
								v-model="email"
								required />
						</div>
						<div class="d-flex flex-row mb-5">
							<label style="width: 90px">비밀번호</label> <input
								class="p-1 mb-3 ms-3" type="password" id="mypage_pwd"
								name="userpwd"
								style="width: 100%; text-align: right"
								v-model="pw"
								required />
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
    #myPage_div{
		position: relative; 
		top: 130px; 
		width: 45%;
		margin-left: 100px;
	}
}
@media (max-width: 1199px) {
    #myPage_div{
		position: relative; 
		top: 130px; 
		width: 80%;
	}
}
#complete_msg{
	text-align: center; 
	font-size: 16px;
	color: rgb(220, 0, 0);
}
</style>