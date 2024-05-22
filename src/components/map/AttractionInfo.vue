<script setup>
import { computed, onMounted, ref, watch, defineExpose } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { localAxios } from "@/util/http-commons";
import { imageStore } from "@/stores/image.js";
const imgStore = imageStore();
const { noImageLogoUrl } = imgStore;

const local = localAxios();

const props = defineProps({ sortList: Array, contentId: Number });
const emit = defineEmits(["closeOverlay", "movedMarkers"]);

const tourList = ref([]);

const place = ref({});

const movePlace = async (content) => {
    emit("movedMarkers", content);
};

const getAttractionInfo = async (contentId) => {
    try {
        const response = await local.get(`/trip/${contentId}`);
        place.value = response.data.item;
    } catch (error) {
        console.error(error);
    }
};

let detailVisible = ref(false);

const closeOverlay = () => {
    detailVisible.value = false;
    place.value = null;
};

const hide = () => {
    detailVisible.value = false;
    place.value = null;
};

const show = (content) => {
    detailVisible.value = true;
    place.value = content;
    // getAttractionInfo(content.contentId);
};

defineExpose({ show, hide });
</script>

<template>
    <div id="placeDetail" class="bg-light p-3" v-if="detailVisible">
        <div class="d-flex flex-row justify-content-between">
            <h4>{{ place.title }}</h4>
            <i class="bi bi-x-lg" style="cursor: pointer" @click="closeOverlay"></i>
        </div>
        <div style="font-weight: 500; font-size: 17px">
            {{ place.overview ? place.overview : "" }}
        </div>
        <div style="height: 10px"></div>
        <div id="placeInfo">
            <img loading="lazy" :src="place.firstImage ? place.firstImage : noImageLogoUrl" id="placeImage" />
            <div style="height: 10px"></div>
            <div class="p-1">
                <div v-if="place.addr !== null" style="font-weight: bold">주소: {{ place.addr ? place.addr : "정보 없음" }}</div>
                <div v-if="place.tel !== null" style="font-weight: bold">전화번호: {{ place.tel ? place.tel : "정보 없음" }}</div>
            </div>
        </div>

        <template v-if="place.description !== null">
            <hr />
            <div>{{ place.description }}</div>
        </template>
        <hr />
        <div style="font-weight: bold; color: gray; font-size: 24px">주변 관광지 추천</div>
        <div v-for="p in sortList" :key="p.contentId" class="text-primary" style="font-size: 20px; cursor: pointer" @click="movePlace(p)">
            {{ p.title }}
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1200px) {
    #placeDetail {
        width: 19%;
        top: 140px;
        height: 80%;
        right: 20px;
        position: absolute;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8) !important;
        z-index: 1000;
        border-radius: 30px;
    }
    #placeImage {
        width: 100%;
    }
}
@media (max-width: 1200px) {
    #placeDetail {
        width: 85%;
        bottom: 20px;
        height: 30%;
        left: 40px;
        position: absolute;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8) !important;
        z-index: 1000;
        border-radius: 30px;
    }
    #placeInfo {
        display: flex;
        direction: column;
    }
    #placeImage {
        width: 30%;
    }
}
</style>
