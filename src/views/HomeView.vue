<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import AttractionLocate from "@/components/map/AttractionLocate.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { localAxios } from "@/util/http-commons";
const memberStore = useMemberStore();
const local = localAxios();

onMounted(async () => {
    const { isValidToken } = storeToRefs(memberStore);
    const { getUserInfo } = memberStore;
    console.log("Home onMounted", isValidToken.value);
    let token = sessionStorage.getItem("accessToken");
    if (token) {
        await getUserInfo(token);
    }
});
const tourData = ref([]);

const changeLocation = async (sido, gugun, type = false) => {
    tourData.value = [];
    const params = { sido, gugun };
    if (type !== false) {
        params.type = type;
    }
    console.log(params);
    let tourList;
    await local.get(`/trip/option`, { params }).then((res) => {
        tourList = res.data.items;
    });
    tourData.value = tourList;
};

const region = ref("");

const setSido = (name) => {
    region.value = name;
};
</script>

<template>
    <div id="map_view">
        <KaKaoMap :tourData="tourData" :region="region" />
    </div>
    <div style="display: flex; justify-content: center">
        <AttractionLocate @get-locate="changeLocation" @set-sido="setSido" />
    </div>
</template>

<style scoped>
#map_view {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
