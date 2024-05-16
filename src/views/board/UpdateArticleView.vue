<script setup>
import BoardFormItem from "@/components/board/item/BoardFormItem.vue";
import { ref } from "vue";

const type = ref("modify");
</script>

<template>
    <div class="position-relative">
        <div style="height: 280px"></div>
        <BoardFormItem :type="type" />
    </div>
</template>

<style scoped>
#editer_form {
    position: relative;
    top: 1.5rem;
    width: 47%;
}
</style>
