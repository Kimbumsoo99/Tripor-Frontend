<script setup></script>

<template>
    <div class="position-absolute top-50 start-50 translate-middle-x" style="text-align:center">
        <div style="height: 100px"></div>
        <img src="../../assets/image/no_image_logo.png" style="height: 380px">
        <div style="height: 20px"></div>
        <h4>아직 여행 계획이 없어요</h4>
        <div>
            여행 계획 만들러 가기 &gt;&gt;
            <RouterLink :to="{ name: 'makeplan' }" style="text-decoration: none">GO!</RouterLink>
        </div>
    </div>
</template>

<style scoped></style>
