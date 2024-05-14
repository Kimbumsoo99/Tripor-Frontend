<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const planInfo = ref({});
const tripList = ref([]);

const getPlanInfo = async function () {
    const response = await axios.get(`http://localhost/trip/plan/${route.params.id}`);
    planInfo.value = response.data.items;
    tripList.value = response.data.tripList;
    console.log(tripList.value);
};

onMounted(() => {
    getPlanInfo();
});
</script>

<template>
    <div class="position-relative">
        <div class="p-5 mb-3" style="position: absolute; left: 400px; top: 75px">
            <span class="text-primary" onclick="window.history.back();" style="cursor: pointer">&lt; 뒤로가기</span>
            <h3 class="d-flex justify-content-center mb-3" style="overflow: hidden; white-space: nowrap; font-weight: bold">{{ planInfo.planName }}</h3>
            <h6 class="d-flex justify-content-center mb-3">{{ planInfo.planRegisterDate }}</h6>

            <div class="d-flex flex-row">
                <div>
                    <div id="plan-map" style="width: 800px; height: 600px">
                        <KaKaoMap v-if="tripList.length > 0" :tourData="tripList" :planDetailFlag="true" />
                    </div>

                    <div id="plan-distance"></div>
                    <div id="plan-shortest-path"><button type="button" class="btn btn-outline-primary" onclick="planMapLoading(1);">최적 경로 찾기</button></div>
                    <div id="plan-div-id" style="display: none">${plan.planId}</div>
                </div>
                <div style="width: 20px"></div>
                <div>
                    <div v-for="(trip, index) in tripList" :key="trip.contentId">
                        <h5 style="cursor: pointer">{{ index + 1 }}&#41; {{ trip.title }}</h5>
                        <div><i class="bi bi-geo-alt"></i>&nbsp;{{ trip.addr }}</div>
                        <!-- <div><img style="width: 300px" src="${trip.firstImage}"/></div> -->
                        <div style="height: 20px"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
