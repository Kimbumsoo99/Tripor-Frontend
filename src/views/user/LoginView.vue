<script setup>

</script>

<template>
    <div class="shadow-sm rounded border p-5 position-absolute start-50 translate-middle-x" id="login_div">
                <h4>로그인</h4>
                <p class="mb-5">환영해요! 다시 오셨네요 :)</p>   
                <form id="form-login" method="POST" action="">
                    <input type="hidden" name="action" value="login">
                    <div class="form_group">
                    <div class="d-flex flex-row justify-content-between">
                        <label>아이디</label><br />
                        <span>
                        	<input style="width:15px; height:15px" class="m-1" type="checkbox" id="saveid" name="saveid" /> 아이디 저장 <br/>
                        </span>
                    </div>  
                        <input
                            class="form-contro p-1 mb-3"
                            type="text"
                            id="userid" 
                            name="userid"
                            value=""
                            style="width: 100%"
                            placeholder="아이디를 입력해주세요."
                            required
                        />
                        
                        <label>비밀번호</label><br />
                        <input
                            class="form-control p-1 mb-5"
                            type="password"
                            id="userpwd" 
                            name="userpwd"
                            style="width: 100%"
                            placeholder="비밀번호를 입력해주세요."
                            required
                        />
                        <p id="pwd_ans" style="color:red;" class="d-flex justify-content-center"></p>
                        <button
                       	 	type="submit"
                       	 	id="regist"
                            class="col-12 btn btn-primary mb-3">
                            로그인
                        </button>
                        <div class="d-flex justify-content-center">
                            <a href="#" class="text-decoration-none text-primary" onclick="">
                                <RouterLink :to="{ name: 'join' }" style="text-decoration: none;">회원가입</RouterLink>
                            </a>
                            <span class="ps-1 pe-1">|</span>
                            <a href="#" class="text-decoration-none text-primary" onclick="">
                                <RouterLink :to="{ name: 'findpwd' }" style="text-decoration: none;">비밀번호 찾기</RouterLink>
                            </a>
                    
                        </div>
                    </div>
                </form>          
    </div>
</template>

<style scoped>
#login_div{
    position: absolute;
    top: 130px;
    width: 45%;
}
</style>