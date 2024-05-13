<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";

const props = defineProps({ plan: Object });
const tripList = ref([]);

onMounted(async () => {
    console.log(props.plan);
    await axios
        .get(`http://localhost/trip/plan/${props.plan.planId}/trip`)
        .then((res) => {
            console.log(res);
            tripList.value = res.data.items;
            console.log(tripList.value);
        })
        .catch((err) => console.log(err));
});

const planDetail = () => {
    console.log("자세히 보기");
};
const planDelete = () => {
    console.log("플랜 삭제");
};

const findThumbnail = computed(() => {
    let thumbnail = "src/assets/image/no_image_logo.png";

    tripList.value.forEach((item) => {
        if (item.firstImage) {
            thumbnail = item.firstImage.trim();
            return thumbnail;
        }
    });
    return thumbnail;
});
</script>

<template>
    <div class="card m-1" style="width: 24rem" v-if="tripList.length > 0">
        <img class="card-img-top" style="height: 200px; object-fit: cover" :src="findThumbnail" alt="Card image cap" />

        <div class="card-body">
            <h5 class="card-title">{{ plan.planName }}</h5>
            <p class="card-text h6">{{ tripList[0].title }} ~ {{ tripList[tripList.length - 1].title }}</p>
            <a class="btn btn-primary" href="#" @click.prevent="planDetail">자세히보기</a>
            <a class="btn btn-outline-danger" href="#" @click.prevent="planDelete">삭제하기</a>
        </div>
    </div>
</template>

<style scoped></style>
