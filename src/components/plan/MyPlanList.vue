<script setup>
import MyPlanListItem from "@/components/plan/item/MyPlanListItem.vue";

const props = defineProps({ myPlans: Array });
</script>

<template>
    <div class="p-5 mb-3 d-flex flex-row flex-wrap">
        <MyPlanListItem v-for="plan in myPlans" :key="plan.planId" :plan="plan" />
    </div>
</template>

<style scoped></style>
