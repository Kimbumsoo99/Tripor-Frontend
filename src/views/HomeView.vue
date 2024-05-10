<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import AttractionLocate from "@/components/plan/AttractionLocate.vue";
import axios from "axios";
import { ref } from "vue";

const tourData = ref([]);

const changeLocation = async (sido, gugun, type = false) => {
    tourData.value = [];
    const params = { sido, gugun };
    if (type !== false) {
        params.type = type;
    }
    console.log(params);
    let tourList;
    await axios.get(`http://localhost/trip/option`, { params }).then((res) => {
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
    <div id="map_view" class="position-relative d-flex">
        <KaKaoMap :tourData="tourData" :region="region" />
    </div>
    <AttractionLocate @get-locate="changeLocation" @set-sido="setSido" />
</template>

<style scoped>
#map_view {
    width: 100%;
    height: 100%;
}
</style>
