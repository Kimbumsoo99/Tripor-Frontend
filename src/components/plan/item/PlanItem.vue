<script setup>
const props = defineProps({ item: Object });
const emit = defineEmits(["removeFromPlanList"]);
import { imageStore } from "@/stores/image.js";
const imgStore = imageStore();
const { noImageLogoUrl } = imgStore;

const removeFromPlanList = (item) => {
    emit("removeFromPlanList", item);
};
</script>

<template>
    <li>
        <div class="list-group-item">
            <h5 class="mb-1">{{ props.item.title }}</h5>
            <p class="mb-1">{{ props.item.addr || "주소 정보 없음" }}</p>
            <p class="mb-1">{{ props.item.tel || "전화번호 정보 없음" }}</p>
            <div class="d-flex flex-row">
                <img :src="props.item.firstImage ? props.item.firstImage : noImageLogoUrl" width="80" height="80" class="rounded float-right" />
                <div style="width: 10px"></div>
                <button @click.prevent="removeFromPlanList(item)" class="btn btn-danger btn-sm" style="width: 35px; height: 35px">X</button>
            </div>
            <hr />
        </div>
    </li>
</template>

<style scoped></style>
