<script setup>

</script>

<template>
    <div class="p-5 mb-3 position-absolute start-50 translate-middle-x" id="delete_user_div">
        <img src="../../assets/image/no_image_logo.png" style="height: 380px">
        <div style="height: 20px"></div>
        <h4>정말로 탈퇴하시겠어요?</h4>
        <p>탈퇴 버튼 클릭 시, 계정은 삭제되며 복구되지 않습니다.</p>
        <div style="height: 10px"></div>
        <button class="col-3 btn btn-primary mb-3">탈퇴하기</button>
    </div>
</template>

<style scoped>
#delete_user_div{
    text-align:center;
    position: absolute;
    top: 130px;
    width: 45%;  
}
</style>