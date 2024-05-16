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
@media (min-width: 1199px) {
    #editor-form{
		position: relative; 
		top: 130px; 
		width: 49%;
		margin-left: 100px;
	}
}
@media (max-width: 1199px) {
    #editor-form{
		position: relative; 
		top: 130px; 
		width: 80%;
	}
}
</style>
