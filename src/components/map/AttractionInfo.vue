<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const place = ref("");

watch(
    () => route.params.contentId,
    (newVal) => {
        axios.get(`http://localhost/trip/${newVal}`).then((res) => {
            place.value = res.data.item;
        });
    }
);

const getAttractionInfo = async () => {
    try {
        const response = await axios.get(`http://localhost/trip/${route.params.contentId}`);
        console.log(response.data.item);
        place.value = response.data.item;
    } catch (error) {
        console.error(error);
    }

    console.log(place);
};

const closeOverlay = () => {
    router.replace({ name: "home" });
};

onMounted(() => {
    getAttractionInfo();
});
</script>

<template>
    <div
        id="placeDetail"
        class="bg-light p-3"
        style="
            width: 19%;
            height: 83%;
            right: 20px;
            position: absolute;
            overflow-y: auto;
            background-color: rgba(255, 255, 255, 0.8) !important;
            z-index: 1000;
            margin-top: 130px;
            margin-right: 30px;
            border-radius: 30px;
        "
    >
        <h4>{{ place.title }} <button @click="closeOverlay">닫기</button></h4>
        <div style="font-weight: 500; font-size: 17px">
            {{ place.overview ? place.overview : "" }}
        </div>
        <div style="height: 10px"></div>
        <img
            :src="place.firstImage ? place.firstImage : 'src/assets/image/no_image.jpg'"
            width="100%"
        />
        <div style="height: 10px"></div>
        <div v-if="place.addr !== null" style="font-weight: bold">
            주소: {{ place.addr ? place.addr : "정보 없음" }}
        </div>
        <div v-if="place.tel !== null" style="font-weight: bold">
            전화번호: {{ place.tel ? place.tel : "정보 없음" }}
        </div>
        <template v-if="place.description !== null">
            <hr />
            <div>{{ place.description }}</div>
        </template>
        <hr />
        <div style="font-weight: bold; color: gray; font-size: 24px">주변 관광지 추천</div>
    </div>
</template>

<style scoped></style>
