<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { localAxios } from "@/util/http-commons";
import { imageStore } from "@/stores/image.js";
const imgStore = imageStore();
const { noImageLogoUrl } = imgStore;

const local = localAxios();
const props = defineProps({ plan: Object });
const tripList = ref([]);
const router = useRouter();

onMounted(async () => {
    await local
        .get(`/trip/plan/${props.plan.planId}/trip`)
        .then((res) => {
            tripList.value = res.data.items;
        })
        .catch((err) => console.log(err));
});

const planDetail = (id) => {
    router.push({ name: "myplandetail", params: { id: id } });
};
const planDelete = async () => {
    const flag = confirm("정말 삭제하시겠습니까?\n복구할 수 없습니다.");
    if (!flag) return;
    await local
        .delete(`/trip/plan/${props.plan.planId}`)
        .then(() => {
            router.go(0);
        })
        .catch((err) => console.error(err));
};

const findThumbnail = computed(() => {
    let thumbnail = noImageLogoUrl;

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
            <a class="btn btn-primary me-1" href="#" @click.prevent="planDetail(plan.planId)">자세히보기</a>
            <a class="btn btn-outline-danger" href="#" @click.prevent="planDelete">삭제하기</a>
        </div>
    </div>
</template>

<style scoped></style>
