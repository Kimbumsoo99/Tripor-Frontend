<script setup></script>

<template>
    <div class="position-absolute top-50 start-50 translate-middle-x">
        <h4>아직 여행 계획이 없어요</h4>
        <div>
            여행 계획 만들러 가기 &gt;&gt;
            <RouterLink :to="{ name: 'makeplan' }">GO!</RouterLink>
        </div>
    </div>
</template>

<style scoped></style>
