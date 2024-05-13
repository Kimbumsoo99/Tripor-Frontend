<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const emit = defineEmits(["getLocate", "setSido"]);

const selectSido = ref("");
const selectGugun = ref("");
const selectContentType = ref("");

const sidoList = ref([]);
const gugunList = ref([]);

// 관광 테마 카테고리 선택 12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점
const categoryItems = [
    { code: 12, name: "관광지" },
    { code: 14, name: "문화시설" },
    { code: 15, name: "축제공연행사" },
    { code: 25, name: "여행코스" },
    { code: 28, name: "레포츠" },
    { code: 32, name: "숙박" },
    { code: 38, name: "쇼핑" },
    { code: 39, name: "음식점" },
];

const getSido = async function () {
    await axios.get("http://localhost/trip/sido").then((response) => {
        sidoList.value = response.data.items;
    });
};

onMounted(() => {
    getSido();
});

watch(selectSido, (newVal) => {
    selectGugun.value = "";
    const sidoName = sidoList.value.find((sido) => sido.sidoCode == newVal).sidoName;
    emit("setSido", sidoName);
    // 지도 위치 이동하기
    getGugun(newVal);
});

watch(selectGugun, (gCode) => {
    const sidoCode = selectSido.value;
    const gugunCode = gCode;
    const type = selectContentType.value;

    // 지역에 맞는 관광 정보 가져오기
    if (type) emit("getLocate", sidoCode, gugunCode, type);
    else emit("getLocate", sidoCode, gugunCode);
});

watch(selectContentType, (type) => {
    if (selectGugun.value) {
        emit("getLocate", selectSido.value, selectGugun.value, type);
    }
});

const getGugun = async function (sido) {
    await axios.get(`http://localhost/trip/${sido}/gugun`).then((response) => {
        gugunList.value = response.data.items;
    });
};
</script>

<template>
    <div class="d-flex flex-column">
        <div style="height: 70px; width: 100%" class="d-block d-md-none"></div>
        <div style="width: 100%; height: 25px"></div>
        <div id="test" class="d-flex flex-row">
            <span class="d-none d-lg-block">관광지를 선택하세요!</span>
            <div style="width: 10px"></div>
            <select name="sido" v-model="selectSido">
                <option value="">도 선택</option>
                <option v-for="sido in sidoList" :key="sido.sidoCode" :value="sido.sidoCode">
                    {{ sido.sidoName }}
                </option>
            </select>
            <div style="width: 5px"></div>
            <select name="gugun" v-model="selectGugun">
                <option value="">시/구 선택</option>
                <option v-for="gugun in gugunList" :key="gugun.gugunCode" :value="gugun.gugunCode">
                    {{ gugun.gugunName }}
                </option>
            </select>
            <div style="width: 5px"></div>
            <select name="content" v-model="selectContentType">
                <option value="">관광 타입 선택</option>
                <option v-for="category in categoryItems" :key="category.code" :value="category.code">
                    {{ category.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<style scoped>
#test {
    z-index: 1000000;
    display: flex;
    justify-content: center;
    align-items: center;
    display: inline;
}
</style>
