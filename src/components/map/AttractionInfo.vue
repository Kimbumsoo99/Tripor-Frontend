<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({ tourData: Array });

const tourList = ref([]);

const route = useRoute();
const router = useRouter();

const place = ref("");

const mergeSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].distance < right[rightIndex].distance) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

watch(
    () => props.tourData,
    (t) => {
        tourList.value = t;
    }
);

watch(
    () => route.params.contentId,
    (contentId) => {
        axios.get(`http://localhost/trip/${contentId}`).then((res) => {
            place.value = res.data.item;
        });

        const placeSaveList = [];
        props.tourData.forEach((i, index) => {
            let distance = Math.sqrt(
                Math.pow(i.latitude - place.value.latitude, 2) +
                    Math.pow(i.longitude - place.value.longitude, 2)
            );

            let placeSave = i;
            placeSave.distance = distance;
            placeSave.index = index;

            placeSaveList.push(placeSave);
        });
        tourList.value = placeSaveList;
    }
);

const sortList = computed(() => {
    return mergeSort(tourList.value).slice(0, 4);
});

const movePlace = (contentId) => {
    router.replace({ name: "content", params: { contentId: contentId } });
};

const getAttractionInfo = async () => {
    try {
        const response = await axios.get(`http://localhost/trip/${route.params.contentId}`);
        place.value = response.data.item;
    } catch (error) {
        console.error(error);
    }
};

const closeOverlay = () => {
    router.replace({ name: "home" });
};

onMounted(() => {
    getAttractionInfo();
});
</script>

<template>
    <div id="placeDetail" class="bg-light p-3">
        <div class="d-flex flex-row justify-content-between">
            <h4>{{ place.title }} </h4>
            <i class="bi bi-x-lg" style="cursor: pointer" @click="closeOverlay"></i>
        </div>
        <div style="font-weight: 500; font-size: 17px">
            {{ place.overview ? place.overview : "" }}
        </div>
        <div style="height: 10px"></div>
        <div id="placeInfo">
            <img
                :src="place.firstImage ? place.firstImage : 'src/assets/image/no_image.jpg'"
                id="placeImage"
            />
            <div style="height: 10px"></div>
            <div class="p-1">
                <div v-if="place.addr !== null" style="font-weight: bold">
                주소: {{ place.addr ? place.addr : "정보 없음" }}
                </div>
                <div v-if="place.tel !== null" style="font-weight: bold">
                    전화번호: {{ place.tel ? place.tel : "정보 없음" }}
                </div>

            </div>
            
        </div>



        
        <template v-if="place.description !== null">
            <hr />
            <div>{{ place.description }}</div>
        </template>
        <hr />
        <div style="font-weight: bold; color: gray; font-size: 24px">주변 관광지 추천</div>
        <div
            v-for="(p, idx) in sortList"
            :key="idx"
            class="text-primary"
            style="font-size: 20px; cursor: pointer"
            @click="movePlace(p.contentId)"
        >
            {{ p.title }}
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1200px) {
    #placeDetail{
        width: 19%;
        top: 140px;
        height: 82%;
        right: 20px;
        position: absolute;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8) !important;
        z-index: 1000;
        border-radius: 30px;
    }
    #placeImage{
        width: 100%;
    }
}
@media (max-width: 1200px){
    #placeDetail{
        width: 85%;
        bottom: 20px;
        height: 40%;
        left: 40px;
        position: absolute;
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8) !important;
        z-index: 1000;
        border-radius: 30px;
    }
    #placeInfo{
        display: flex;
        direction: column;
    }
    #placeImage{
        width: 30%;
    }
}

</style>
