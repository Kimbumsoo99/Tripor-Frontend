<script setup>
import { ref } from "vue";
const selectOption = ref([
    { text: "검색 조건", value: "" },
    { text: "제목", value: "subject" },
    { text: "작성자", value: "member_id" },
]);
const emit = defineEmits(["onKeySelect"]);

const key = ref("");

const onSelect = () => {
    emit("onKeySelect", key.value);
};
</script>

<template>
    <select v-model="key" class="form-select form-select-sm ms-5 me-1 w-50" @change="onSelect">
        <option v-for="option in selectOption" :key="option.value" :value="option.value" :disabled="option.value === '' ? true : false">
            {{ option.text }}
        </option>
    </select>
</template>

<style scoped></style>
