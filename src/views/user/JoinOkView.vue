<script setup>

</script>

<template>
    <div class="p-5 mb-3 position-absolute start-50 translate-middle-x" id="join_ok_div">
        <img src="../../assets/image/success_logo.png" style="height: 380px">
        <div style="height: 20px"></div>
        <h4>회원가입이 성공적으로 완료되었습니다.</h4>
        <div>
            로그인하러 가기 &gt;&gt;
            <RouterLink :to="{ name: 'login' }" style="text-decoration: none">GO!</RouterLink>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #join_ok_div{
        white-space : nowrap;
        text-align: center;
        position: absolute;
        top: 130px;
        width: 55%;  
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #join_ok_div{
        white-space : nowrap;
        text-align: center;
        position: absolute;
        top: 130px;
        width: 100%;  
    }
}
</style>