<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { shortestPathByPlanList } from "@/api/trip";
import { saveMemoAPI } from "@/api/trip";
import OpenAI from "openai";
import draggable from "vuedraggable";
import PlanDetailTitle from "@/components/plan/item/PlanDetailTitle.vue";
import { localAxios } from "@/util/http-commons";
const local = localAxios();
const route = useRoute();
const router = useRouter();

const planInfo = ref({});
const tripList = ref([]);

const shortList = ref(null);
const originList = ref(null);

const shortFlag = ref(false);

const planId = ref("");

window.onload = async () => {
    setTimeout(getPlanInfo, 500);
};

const getPlanInfo = async function () {
    planId.value = route.params.id;
    const response = await local.get(`/trip/plan/${planId.value}`);
    planInfo.value = response.data.items;
    tripList.value = response.data.tripList;
    originList.value = tripList.value;
    loadMemo.value = planInfo.value.memo;
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
    const walkkTime = (distance / 67) | 0;

    if (walkkTime > 60) {
        walkHour.value = Math.floor(walkkTime / 60);
    }
    walkMin.value = walkkTime % 60;

    const bycicleTime = (distance / 227) | 0;
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

const memoSelected = ref(false);

const memoOpen = () => {
    memoSelected.value = true;
};

const scheduleOpen = () => {
    memoSelected.value = false;
};

const aiExpanded = ref(false);

const aiExpand = () => {
    aiExpanded.value = !aiExpanded.value;
};

const q1 = ref("");
const q2 = ref("");
const q3 = ref("");
const q4 = ref("");

const memo = ref("");
const memoField = ref("");

// chatGPT description
const getGPTResponse = async () => {
    try {
        showLoadingSpinner();

        const openai = new OpenAI({
            apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
            dangerouslyAllowBrowser: true,
        });

        let places = "";
        for (let i = 0; i < tripList.value.length; i++) {
            places +=
                `${i + 1}` +
                ")" +
                `${tripList.value[i].title}

            `;
        }

        const prompt = `다음 정보를 바탕으로 여행 계획을 자세하게 날짜와 시간 별로 작성해줘.

        여행 인원: ${q1.value}
        여행 기간: ${q2.value}
        이동 수단: ${q3.value}
        기타 활동: ${q4.value}

        여행지: ${places}

        양식은 다음과 같이해줘.
        <div>
            <h3>{몇 일차}</h3>
            <ul>
                <li>{시간}: {일정}<li/>
            </ul>
            <p>예상 비용 : {00,000원}</p>
        </div>

        <div>{총 예상 비용}</div>
        `;

        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "gpt-3.5-turbo",
        });

        loadMemo.value = response.choices[0].message.content;
        memoField.value = response.choices[0].message.content;

        hideLoadingSpinner();
    } catch (error) {
        console.log("chatGPT: 🚨 에러가 발생했습니다.");
        console.log(error);
    }
};

const spinnerVisible = ref(false);

const showLoadingSpinner = () => {
    spinnerVisible.value = true;
};

const hideLoadingSpinner = () => {
    spinnerVisible.value = false;
};

const loadMemo = ref("");

const memoChange = (e) => {
    memoField.value = e.target.innerHTML;
};

const saveMemo = () => {
    planInfo.value.memo = memoField.value;
    loadMemo.value = memoField.value;
    saveMemoAPI(
        planInfo.value,
        (res) => {
            saveMemoSuccess.value = res.data;
            setTimeout(() => {
                saveMemoSuccess.value.result = "";
            }, 3000);
        },
        (err) => console.log(err)
    );
};

const saveMemoSuccess = ref({
    result: "",
    msg: "",
});

onMounted(() => {
    getPlanInfo();
});
</script>

<template>
    <div class="position-relative">
        <div class="d-flex flex-row">
            <div style="width: 400px; height: 100%" class="d-none d-xl-block"></div>
            <div class="p-5 mb-3" id="upperdiv">
                <div style="height: 70px"></div>
                <span class="text-primary" @click="router.go(-1)" style="cursor: pointer">&lt; 뒤로가기</span>
                <h3 class="d-flex justify-content-center mb-3" style="overflow: hidden; white-space: nowrap; font-weight: bold">
                    {{ planInfo.planName }}
                </h3>
                <h6 class="d-flex justify-content-center mb-3">{{ planInfo.planRegisterDate }}</h6>

                <div id="plan_div">
                    <div id="plan-map" style="width: 100%; height: 600px; margin-bottom: 10px">
                        <KaKaoMap v-if="tripList.length > 0" :tourData="tripList" :planDetailFlag="true" ref="kakaoMapRef" @get-time-from-distance="getTimeFromDistance" />
                    </div>
                    <div style="width: 20px"></div>
                    <div id="schedule_memo">
                        <div class="d-flex flex-row justify-content-around" style="height: 40px">
                            <span style="cursor: pointer" @click="scheduleOpen" :class="{ boldmenu: !memoSelected }">schedule</span>
                            <span>|</span>
                            <span style="cursor: pointer" @click="memoOpen" :class="{ boldmenu: memoSelected }">memo</span>
                        </div>

                        <div v-if="memoSelected" class="p-1 mb-1" style="width: 100%; height: 560px; overflow-y: auto; display: flex; flex-direction: column">
                            <div class="border rounded mb-1 p-1" style="font-size: 16px; background-color: #daf0ff; cursor: pointer" @click="aiExpand">
                                <i class="bi bi-stars"></i>
                                AI의 도움을 받아 여행 예산과 일정을 세워보세요!
                            </div>
                            <form class="border rounded p-1 mb-1 ai_form" v-if="aiExpanded" @submit.prevent="getGPTResponse">
                                <ul>
                                    <li><label>여행 인원</label> <input type="text" v-model="q1" placeholder="몇 명이 함께 여행하나요?" /></li>
                                    <li><label>여행 기간</label> <input type="text" v-model="q2" placeholder="몇 일 동안 여행할 계획인가요?" /></li>
                                    <li><label>이동 수단</label> <input type="text" v-model="q3" placeholder="어떤 이동 수단을 사용할 계획인가요 (자가용, 대중교통 등)?" /></li>
                                    <li><label>기타 활동</label> <input type="text" v-model="q4" placeholder="계획된 장소 외에 추가로 방문하고 싶은 곳이 있나요?" /></li>
                                </ul>
                                <div class="d-flex flex-row-reverse m-1">
                                    <button class="btn btn-outline-secondary" type="submit" style="font-size: 15px">메모 생성</button>
                                    <span class="loader" v-if="spinnerVisible"></span>
                                </div>
                            </form>
                            <div contenteditable="true" id="memo" ref="memo" style="flex: 1; margin-bottom: 5px" v-html="loadMemo" @input="memoChange"></div>
                            <div class="alert alert-info" role="alert" v-if="saveMemoSuccess.result == 'ok'">{{ saveMemoSuccess.msg }}</div>
                            <div class="alert alert-danger" role="alert" v-else-if="saveMemoSuccess.result == 'err'">{{ saveMemoSuccess.msg }}</div>
                            <div class="d-flex flex-row-reverse">
                                <button class="btn btn-primary" @click.prevent="saveMemo">저장</button>
                            </div>
                        </div>

                        <div v-else class="border rounded p-3" style="margin-bottom: 10px; width: 100%; height: 560px; overflow-y: auto">
                            <draggable v-model="tripList" item-key="contentId" tag="ul" class="list-unstyled">
                                <template #item="{ element: trip, index }">
                                    <PlanDetailTitle :trip="trip" :index="index + 1" @onTitleClickHandler="onTitleClickHandler" />
                                </template>
                            </draggable>
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
                        <button type="button" v-else class="btn btn-outline-primary" @click="findShortPath" style="font-size: 15px">최적 경로 찾기</button>
                    </div>
                    <div id="plan-div-id" style="display: none">${plan.planId}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.boldmenu {
    font-weight: bold;
}
#title {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
#memo {
    color: #222222;
    border: solid #aaaaaa 1px;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    background: none;
    margin-bottom: 10px;
    overflow-y: auto;
}
.ai_form {
    background-color: #f8f8f8;
}
.ai_form input {
    margin: 5px;
    font-size: 15px;
    color: #222222;
    width: 90%;
    border: none;
    border-bottom: solid #aaaaaa 1px;
    position: relative;
    background: none;
    z-index: 5;
}

.ai_form input::placeholder {
    color: #aaaaaa;
}
.ai_form input:focus {
    outline: none;
}

.ai_form label {
    margin: 5px;
    font-size: 15px;
}

.loader {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: block;
    margin: 15px auto;
    color: #70a3c7;
    box-sizing: border-box;
    animation: animloader 1s linear infinite alternate;
}

@keyframes animloader {
    0% {
        box-shadow: -38px -12px, -14px 0, 14px 0, 38px 0;
    }
    33% {
        box-shadow: -38px 0px, -14px -12px, 14px 0, 38px 0;
    }
    66% {
        box-shadow: -38px 0px, -14px 0, 14px -12px, 38px 0;
    }
    100% {
        box-shadow: -38px 0, -14px 0, 14px 0, 38px -12px;
    }
}
@media (min-width: 1199px) {
    #plan_div {
        display: flex;
        flex-direction: row;
    }
    #plan_map {
        width: 660px;
        margin-bottom: 10px;
    }
    #upperdiv {
        width: 70%;
    }
    #schedule_memo {
        width: 700px;
        height: 540px;
    }
}
@media (max-width: 1199px) {
    #plan_div {
        display: flex;
        flex-direction: column;
    }
    #plan_map {
        width: 1300px;
        margin-bottom: 10px;
    }
    #upperdiv {
        width: 100%;
    }
    #schedule_memo {
        width: 100%;
        height: 650px;
    }
}
</style>
