<script setup>
import BoardFormItem from "@/components/board/item/BoardFormItem.vue";
import { ref } from "vue";

const type = ref("write");
</script>

<template>
    <div class="position-relative">
        <div style="height: 280px"></div>
        <BoardFormItem :type="type" />
    </div>
</template>

<style scoped></style>
