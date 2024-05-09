<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const selectSido = ref("");
const selectGugun = ref("");

const sidoList = ref([]);
const gugunList = ref([]);

const getSido = async function () {
    await axios.get("http://localhost/trip/sido").then((response) => {
        sidoList.value = response.data.items;
    });
};

onMounted(() => {
    getSido();
});

watch(selectSido, (newVal) => {
    // 지도 위치 이동하기
    getGugun(newVal);
});

watch(selectGugun, (gCode) => {
    const sidoCode = selectSido.value;
    const gugunCode = gCode;
    console.log(sidoCode, gugunCode);
    // 지역에 맞는 관광 정보 가져오기
});

const getGugun = async function (sido) {
    await axios.get(`http://localhost/trip/${sido}/gugun`).then((response) => {
        gugunList.value = response.data.items;
    });
};
</script>

<template>
    <div>
        <span>관광지를 선택하세요!</span>
        <select name="sido" v-model="selectSido">
            <option selected value="">도 선택</option>
            <option v-for="(sido, idx) in sidoList" :key="idx" :value="sido.sidoCode">
                {{ sido.sidoName }}
            </option>
        </select>
        <select name="gugun" v-model="selectGugun">
            <option selected value="">시/구 선택</option>
            <option v-for="(gugun, idx) in gugunList" :key="idx" :value="gugun.gugunCode">
                {{ gugun.gugunName }}
            </option>
        </select>
        <select name="content">
            <option selected>관광 타입 선택</option>
            <!-- <option v-for="gugun in gugunList">{{ gugun.gugunName }}</option> -->
        </select>
    </div>
</template>

<style scoped></style>
