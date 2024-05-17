<script setup>
import MyPlanList from "@/components/plan/MyPlanList.vue";
import NoPlan from "@/components/plan/NoPlan.vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();

const { userInfo } = storeToRefs(memberStore);

const myPlans = ref([]);
const memberId = ref("");

onMounted(() => {
    memberId.value = userInfo.value.memberId;;
    axios
        .get(`http://localhost/trip/plan/m/${memberId.value}`)
        .then((res) => {
            myPlans.value = res.data.items;
        })
        .catch((err) => console.log(err));
});
</script>

<template>
    <div class="position-relative">
        <div class="d-flex flex-row">
            <div style="width: 540px; height: 100%" class="d-none d-xl-block"></div>
            <div id="planListDiv" style="width: 100%">
                <div style="height: 90px"></div>
                <NoPlan v-if="myPlans.length == 0" />
                <MyPlanList v-else :myPlans="myPlans" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
