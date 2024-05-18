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

const imageSliderVisible = ref(true);

const board = ref({});

const getBoard = async function () {
    detailArticle(
        id,
        (res) => {
            board.value = res.data.item;
            for (const image of board.value.fileInfos) {
                imagesPath.value.push(VITE_UPLOAD_FILE_PATH + "/" + image.saveFolder + "/" + image.saveFile);
            }
            if(imagesPath.value.length === 0) imageSliderVisible.value = false;
        },
        (err) => console.log(err)
    );
};

const boardRemove = async function () {
    await axios.delete(`http://localhost/article/${route.params.id}`);
    router.push({ name: "board" });
};

const updateHit = async function () {
    await axios.put(`http://localhost/article/hit/${route.params.id}`, {
        articleId: board.value.articleId,
    });
};

onMounted(() => {
    getBoard();
    console.log(board.value);
    updateHit();
});

const currentIndex = ref(0);

const prevImage = () => {
    if (currentIndex.value == 0) return;
    currentIndex.value = (currentIndex.value - 1 + board.value.fileInfos.length) % board.value.fileInfos.length;
};

const nextImage = () => {
    if (currentIndex.value == board.value.fileInfos.length - 1) return;
    currentIndex.value = (currentIndex.value + 1) % board.value.fileInfos.length;
};
</script>

<template>
    <div class="position-relative">
        <div style="height: 280px"></div>
        <div id="article_div" class="mb-3 position-absolute top-50 start-50 translate-middle-x">
            <RouterLink :to="{ name: 'board' }" style="text-decoration: none"><span class="mb-3 text-primary" style="cursor: pointer">&lt; 뒤로가기</span></RouterLink>

            <h3 class="mt-3" id="title_data">{{ board.subject }}</h3>
            <span style="font-size: medium"> {{ board.memberId }} | {{ board.registerDate }} | 조회수 {{ board.hit }}</span>
            <hr />

            <div class="image-slider" v-if="imageSliderVisible">
                <button @click.prevent="prevImage" class="nav-btn prev-btn">&lt;</button>
                <div class="image-list">
                    <div v-for="(file, index) in imagesPath" :key="file.imageId" class="image-div" :class="{ active: index === currentIndex }">
                        <img :src="file" />
                    </div>
                </div>
                <button @click.prevent="nextImage" class="nav-btn next-btn">&gt;</button>
            </div>

            <div id="content_data">{{ board.content }}</div>
            <div style="height: 15px"></div>

            <!-- <div v-for="(image, idx) in imagesPath" :key="idx">
                <img :src="image" width="100%" style="border: solid 1px black" />
            </div> -->
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
.prev-btn {
    margin-right: 20px;
}
.next-btn {
    margin-left: 20px;
}
.image-slider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    max-width: 1000px;
    height: 460px;
    margin: 0 auto;
}

.image-list {
    display: flex;
    overflow: hidden;
    width: 100%;
}

.image-div {
    position: relative;
    flex: 0 0 100%;
    height: 400px;
    border: solid 1px black;
    margin: 5px;
    display: none;
}

.image-div img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.image-div.active {
    display: block;
}

.nav-btn {
    background-color: transparent;
    border: none;
    font-size: 2em;
    cursor: pointer;
}

#title_data,
#content_data {
    width: 100%;
    white-space: normal;
    word-break: break-word;
}
</style>
