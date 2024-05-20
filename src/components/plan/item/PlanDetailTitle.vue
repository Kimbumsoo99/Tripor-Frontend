<script setup>
const emit = defineEmits(["onTitleClickHandler"]);

const props = defineProps({ trip: Object, index: Number });
const onTitleClickHandler = (trip) => {
    emit("onTitleClickHandler", trip);
};
</script>

<template>
    <li>
        <div style="cursor: pointer; font-weight: bold; font-size: 21px; color: #0077cc" id="title" @click="onTitleClickHandler(trip)">{{ index }}&#41; {{ trip.title }}</div>
        <div style="font-size: 15px"><i class="bi bi-geo-alt"></i>&nbsp;{{ trip.addr }}</div>

        <div style="height: 20px"></div>
    </li>
</template>

<style scoped></style>
