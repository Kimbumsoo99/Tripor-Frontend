<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import axios from "axios";
import { ref } from "vue";

const tourData = ref([]);

const searchKeyword = ref("");
const planFlag = ref(true);

const searchTrip = async () => {
    console.log("gd");
    if (searchKeyword.value === "") {
        return;
    }

    const params = { keyword: searchKeyword.value };
    await axios.get(`http://localhost/trip/search`, { params }).then((res) => {
        tourData.value = res.data.items;
    });
};
</script>

<template>
    <div>
        <div id="map_view">
            <KaKaoMap :tourData="tourData" :planFlag="planFlag" />
        </div>

        <form id="planListForm" method="POST" action="" style="width: 100%; height: 100%">
            <input type="hidden" name="action" value="planAdd" />
            <input type="hidden" id="planIdList" name="planIdList" value="" />

            <div id="upper_div">
                <div style="height: 90px"></div>
                <div class="d-flex flex-row">
                    <div id="makeplan_div" class="d-none d-xl-block"></div>
                    <div class="d-flex flex-column p-3">
                        <span class="mb-3 ms-2" id="planNameGroup">
                            <i class="bi bi-pen-fill me-1"></i>
                            <input value="의 여행 계획" name="planname" id="planName" />
                        </span>

                        <div class="d-flex flex-row" id="makePlace">
                            <input class="form-control mr-sm-2 w-75 shadow-sm" type="search" placeholder="여행지를 검색하세요!" v-model="searchKeyword" aria-label="Search" id="searchInput" />
                            <div style="width: 5px"></div>
                            <button class="btn text-white btn-primary" type="button" style="overflow: hiddlen; white-space: nowrap" id="searchButton" @click.prevent="searchTrip">검색</button>
                        </div>
                        <ul id="planItems" class="list-unstyled"></ul>
                        <button type="button" id="savePlanButton" class="btn btn-outline-primary mt-auto">일정 등록하기</button>
                        <div style="height: 5px"></div>
                        <button type="button" id="canclePlanButton" class="btn btn-outline-danger mt-auto">일정 초기화</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
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
#upper_div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.7) !important;
    display: block;
    height: 100%;
}
#makeplan_div {
    width: 380px;
    height: 100%;
    padding: 30px;
}
#planNameGroup {
    border: none;
    border-bottom: 2px solid black;
}
#planName {
    appearance: none;
    border: none;
    outline: none;
    background-color: transparent;
    border-radius: 0.2em 0.2em 0 0;
    padding: 0.2em;
    color: black;
    font-weight: bold;
}
</style>
