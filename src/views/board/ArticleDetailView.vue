<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailArticle } from "@/api/article.js";
const { VITE_UPLOAD_FILE_PATH } = import.meta.env;

const route = useRoute();
const router = useRouter();

const { id } = route.params;
const imagesPath = ref([]);

const board = ref({});

const getBoard = async function () {
    detailArticle(
        id,
        (res) => {
            board.value = res.data.item;
            for (const image of board.value.fileInfos) {
                imagesPath.value.push(VITE_UPLOAD_FILE_PATH + "/" + image.saveFolder + "/" + image.saveFile);
            }
        },
        (err) => console.log(err)
    );
};

const boardRemove = async function () {
    await axios.delete(`http://localhost/article/${route.params.id}`);
    router.push({ name: "board" });
};

const updateHit = async function () {
    const response = await axios.put(`http://localhost/article/hit/${route.params.id}`, {
        articleId: board.value.articleId,
    });
};

onMounted(() => {
    getBoard();
    updateHit();
});
</script>

<template>
    <div class="position-relative">
        <div style="height: 280px"></div>
        <div id="article_div" class="mb-3 position-absolute top-50 start-50 translate-middle-x">
            <RouterLink :to="{ name: 'board' }" style="text-decoration: none"><span class="mb-3 text-primary" style="cursor: pointer">&lt; 뒤로가기</span></RouterLink>

            <h3 class="mt-3" id="title_data">{{ board.subject }}</h3>
            <span style="font-size: medium"> {{ board.memberId }} | {{ board.registerDate }} | 조회수 {{ board.hit }}</span>

            <hr />
            <div id="content_data">{{ board.content }}</div>

            <div v-for="(image, idx) in imagesPath" :key="idx">
                <img :src="image" width="800px" style="border: solid 1px black" />
            </div>
            <hr />
            <div class="d-flex justify-content-center">
                <RouterLink :to="{ name: 'update', params: { id: board.articleId } }" style="text-decoration: none"><input type="button" class="btn text-white btn-outline-primary m-1" onclick="" value="수정하기" /></RouterLink>
                <input id="article-delete" type="button" class="btn text-white btn-outline-primary m-1" @click="boardRemove" value="삭제하기" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #article_div {
        position: relative;
        top: 130px;
        width: 49%;
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #article_div {
        position: relative;
        top: 130px;
        width: 80%;
    }
}
#title_data,
#content_data {
    width: 100%;
    white-space: normal;
    word-break: break-word;
}
</style>
