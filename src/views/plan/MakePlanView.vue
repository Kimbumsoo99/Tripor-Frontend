<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import MakePlan from "@/components/plan/MakePlan.vue";
import axios from "axios";
import { ref } from "vue";

const tourData = ref([]);

const planFlag = ref(true);
const planList = ref([]);

const makePlanPolylines = (plans) => {
    planList.value = plans;
};

const searchTrip = async (searchKeyword) => {
    if (searchKeyword === "") {
        return;
    }

    const params = { keyword: searchKeyword };
    await axios
        .get(`http://localhost:8080/trip/search`, { params })
        .then((res) => {
            tourData.value = res.data.items;
        })
        .catch((err) => console.error(err));
};

const currentTour = ref({});

const markerClickEvent = (tour) => {
    currentTour.value = tour;
};
</script>

<template>
    <div id="map_view">
        <KaKaoMap :tourData="tourData" :planList="planList" :planFlag="planFlag" @marker-click-event="markerClickEvent" />
    </div>
    <MakePlan @search-trip="searchTrip" :currentTour="currentTour" @make-plan-polylines="makePlanPolylines" />
</template>

<style scoped>
#map_view {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
</style>
