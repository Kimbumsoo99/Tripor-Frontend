<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { shortestPathByPlanList } from "@/api/trip";

const route = useRoute();
const router = useRouter();

const planInfo = ref({});
const tripList = ref([]);

const shortList = ref(null);
const originList = ref(null);

const shortFlag = ref(false);

const planId = ref("");

const getPlanInfo = async function () {
    planId.value = route.params.id;
    const response = await axios.get(`http://localhost/trip/plan/${planId.value}`);
    planInfo.value = response.data.items;
    tripList.value = response.data.tripList;
    originList.value = tripList.value;
};

const kakaoMapRef = ref(null);

const onTitleClickHandler = (tour) => {
    kakaoMapRef.value.toggleMarkers(tour);
};

const totalDistance = ref(0);
const walkHour = ref(0);
const walkMin = ref(0);
const bycicleHour = ref(0);
const bycicleMin = ref(0);

const getTimeFromDistance = (distance) => {
    totalDistance.value = distance;
    // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
    const walkkTime = (distance / 67) | 0;

    // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
    if (walkkTime > 60) {
        walkHour.value = Math.floor(walkkTime / 60);
    }
    walkMin.value = walkkTime % 60;

    // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
    const bycicleTime = (distance / 227) | 0;
    // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
    if (bycicleTime > 60) {
        bycicleHour.value = Math.floor(bycicleTime / 60);
    }
    bycicleMin.value = bycicleTime % 60;
};

const findShortPath = () => {
    if (!shortList.value) {
        shortestPathByPlanList(
            planId.value,
            (res) => {
                shortList.value = res.data.items;
                shortFlag.value = true;
                tripList.value = shortList.value;
            },
            (err) => console.log(err)
        );
    } else {
        shortFlag.value = true;
        tripList.value = shortList.value;
    }
};

const getOriginPath = () => {
    tripList.value = originList.value;
    shortFlag.value = false;
};

onMounted(() => {
    getPlanInfo();
});
</script>

<template>
    <div class="position-relative">
        <div class="d-flex flex-row">
            <div style="width: 400px; height: 100%" class="d-none d-xl-block"></div>
            <div class="p-5 mb-3">
                <div style="height: 70px"></div>
                <span class="text-primary" @click="router.go(-1)" style="cursor: pointer">&lt; 뒤로가기</span>
                <h3 class="d-flex justify-content-center mb-3" style="overflow: hidden; white-space: nowrap; font-weight: bold">
                    {{ planInfo.planName }}
                </h3>
                <h6 class="d-flex justify-content-center mb-3">{{ planInfo.planRegisterDate }}</h6>

                <div id="plan_div">
                    <div id="plan-map" style="width: 800px; height: 600px; margin-bottom: 10px">
                        <KaKaoMap v-if="tripList.length > 0" :tourData="tripList" :planDetailFlag="true" ref="kakaoMapRef" @get-time-from-distance="getTimeFromDistance" />
                    </div>
                    <div style="width: 20px"></div>
                    <div class="border rounded p-3" style="margin-bottom: 10px; height: 600px; overflow-y: auto;">
                        <div v-for="(trip, index) in tripList" :key="trip.contentId">
                            <h5 style="cursor: pointer" id="title" @click="onTitleClickHandler(trip)">{{ index + 1 }}&#41; {{ trip.title }}</h5>
                            <div><i class="bi bi-geo-alt"></i>&nbsp;{{ trip.addr }}</div>
                            <!-- <div><img style="width: 300px" src="${trip.firstImage}"/></div> -->
                            <div style="height: 20px"></div>
                        </div>
                    </div>
                </div>
                <ul class="dotOverlay distanceInfo">
                    <li>
                        <span class="label">총 거리 {{ totalDistance }} M</span>
                    </li>
                    <li>
                        <span class="label">도보 {{ walkHour }}시간 {{ walkMin }}분</span>
                    </li>
                    <li>
                        <span class="label">자전거 {{ bycicleHour }}시간 {{ bycicleMin }}분</span>
                    </li>
                </ul>
                <div>
                    <div id="plan-distance"></div>
                    <div id="plan-shortest-path">
                        <button type="button" v-if="shortFlag" class="btn btn-outline-primary" @click="getOriginPath">되돌리기</button>
                        <button type="button" v-else class="btn btn-outline-primary" @click="findShortPath">최적 경로 찾기</button>
                    </div>
                    <div id="plan-div-id" style="display: none">${plan.planId}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#title {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
@media (min-width: 1199px) {
    #plan_div {
        display: flex;
        flex-direction: row;
    }
}
@media (max-width: 1199px) {
    #plan_div {
        display: flex;
        flex-direction: column;
    }
}
</style>
