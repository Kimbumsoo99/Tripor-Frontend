<script setup>
import { ref, watch } from "vue";
import PlanItem from "./item/PlanItem.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

import draggable from "vuedraggable";

const memberStore = useMemberStore();

const { userInfo } = storeToRefs(memberStore);

const router = useRouter();

const emit = defineEmits(["searchTrip", "makePlanPolylines"]);
const props = defineProps({ currentTour: Object });

const planList = ref([]);
const userPlanName = ref(userInfo.value.memberName + "의 여행계획");

const searchKeyword = ref("");

watch(
    () => props.currentTour,
    (tour) => {
        // tourDiv 하나 만들어서 추가하기 누를시 planAdd 호출로 변경
        planAdd(tour);
    }
);

watch(
    () => planList.value,
    (plans) => {
        emit("makePlanPolylines", plans);
    },
    { deep: true }
);

const makePlan = async () => {
    if (planList.value.length === 0) return;
    const makeFlag = confirm("이대로 여행 계획을 세우시겠습니까?");
    if (!makeFlag) {
        return;
    }
    const tripList = planList.value.map((item) => item.contentId);
    const memberId = userInfo.value.memberId;
    const planName = userPlanName.value;

    const params = { tripList, memberId, planName };

    await axios
        .post("http://localhost/trip/plan", params)
        .then(() => {
            planList.value = [];
            const flag = confirm("여행 계획 확인하러가기");
            if (flag) {
                router.push({ name: "myplan" });
            }
        })
        .catch((err) => console.error(err));
};

const initPlan = () => {
    if (planList.value.length === 0) return;
    const flag = confirm("정말 초기화 하시겠습니까?\n현재까지 작성된 내용은 모두 사라집니다.");
    if (flag) {
        planList.value = [];
        searchKeyword.value = "";
    }
};

const planAdd = (tour) => {
    if (planList.value.some((planItem) => planItem.title === tour.title)) {
        alert("이미 추가된 항목입니다.");
        return;
    }
    planList.value.push(tour);
};

const removeFromPlanList = (tour) => {
    planList.value = planList.value.filter((planItem) => planItem.title !== tour.title);
};

const searchTrip = () => {
    emit("searchTrip", searchKeyword.value);
};
</script>

<template>
    <form id="planListForm" action="" style="width: 100%; height: 100%">
        <div id="upper_div">
            <div style="height: 80px"></div>
            <div class="d-flex flex-row">
                <div id="blank_div" class="d-none d-xl-block"></div>
                <div id="makeplan_div" class="d-flex flex-column p-3" style="width: 300px">
                    <span class="mb-3 ms-2" id="planNameGroup">
                        <i class="bi bi-pen-fill me-1"></i>
                        <input v-model="userPlanName" name="planname" id="planName" />
                    </span>

                    <div class="d-flex flex-row" id="makePlace">
                        <input class="form-control mr-sm-2 w-75 shadow-sm" type="search" placeholder="여행지를 검색하세요!" v-model="searchKeyword" aria-label="Search" @keydown.enter.prevent="searchTrip" id="searchInput" />
                        <div style="width: 5px"></div>
                        <button class="btn text-white btn-primary" type="button" style="overflow: hiddlen; white-space: nowrap" id="searchButton" @click.prevent="searchTrip">검색</button>
                    </div>
                    <div style="height: 20px"></div>
                    <draggable v-model="planList" item-key="planId" tag="ul" id="planItems" class="list-unstyled">
                        <template #item="{ element: plan }">
                            <PlanItem :item="plan" @remove-from-plan-list="removeFromPlanList" />
                        </template>
                    </draggable>
                    <!-- <ul id="planItems" class="list-unstyled">
                        <PlanItem v-for="item in planList" :key="item.contentId" :item="item" @remove-from-plan-list="removeFromPlanList" />
                    </ul> -->
                    <button type="button" id="savePlanButton" class="btn btn-outline-primary mt-auto" @click="makePlan">일정 등록하기</button>
                    <div style="height: 5px"></div>
                    <button type="button" id="canclePlanButton" class="btn btn-outline-danger mt-auto" @click="initPlan">일정 초기화</button>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped>
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
#blank_div {
    width: 350px;
    height: 100%;
    padding: 10px;
}
#makeplan_div {
    width: 300px;
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
