<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { insertImage, deleteImage, registArticle, getModifyArticle, modifyArticle } from "@/api/article.js";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const memberStore = useMemberStore();

const { userInfo } = storeToRefs(memberStore);

const props = defineProps({ type: String });

const article = ref({
    articleId: 0,
    subject: "",
    content: "",
    memberId: userInfo.value.memberId,
    hit: 0,
    registerDat: "",
    fileInfos: [],
});

const input = ref({
    image: [],
});

onMounted(() => {
    if (props.type === "modify") {
        let { id } = route.params;

        getModifyArticle(
            id,
            ({ data }) => {
                console.log("getModifyArticle 로딩", data);
                article.value = data.item;
                input.value.image = data.item.fileInfos;
                // images.value.files = data.item.fileinfos;
            },
            (err) => {
                console.log(err);
            }
        );
    }
});

const submitHandler = () => {
    props.type === "write" ? writeArticle() : updateArticle();
};

const writeArticle = () => {
    console.log("write");

    registArticle(
        article.value,
        input.value.image,
        (response) => {
            let msg = "글등록 처리시 문제 발생했습니다.";
            if (response.status == 201) msg = "글등록이 완료되었습니다.";
            alert(msg);
            // console.log(response.data.data);
            router.push({ name: "detail", params: { id: response.data.data } });
        },
        (err) => console.log(err)
    );
};

const updateArticle = () => {
    article.value.fileInfos = input.value.image;
    modifyArticle(
        article.value,
        (res) => {
            let msg = "글수정 처리시 문제 발생했습니다.";
            if (res.status == 200) msg = "글정보 수정이 완료되었습니다.";
            alert(msg);
            router.push({ name: "detail", params: { id: article.value.articleId } });
        },
        (err) => console.log(err)
    );
};

const moveToList = () => {
    router.push({ name: "board" });
};

const images = ref([]);

const upload = async () => {
    console.log(images.value.files);
    for (const file of images.value.files) {
        await insertImage(
            file,
            (res) => {
                console.log(res);
                input.value.image.push(res.data.fileInfo);
            },
            (err) => console.log(err)
        );
        console.log("file");
        console.log(file);
    }
    console.log(input.value.image);
    // console.log(images.value.files);
    // console.log(article.value);
};

const currentIndex = ref(0);

const deleteImageFile = (imageId) => {
    console.log(imageId);
    if (confirm("삭제하시겠습니까?")) {
        input.value.image = input.value.image.filter((image) => image.imageId !== imageId);
        if (currentIndex.value > 0) {
            currentIndex.value -= 1;
        }

        if (props.type === "write") {
            deleteImage(
                imageId,
                (res) => {
                    console.log("삭제 완료");
                    console.log(res);
                },
                (err) => console.log(err)
            );
        }
    }
};

const prevImage = () => {
    console.log(input.value.image);
    if (currentIndex.value == 0) return;
    currentIndex.value = (currentIndex.value - 1 + input.value.image.length) % input.value.image.length;
};

const nextImage = () => {
    console.log(input.value.image);
    if (currentIndex.value == input.value.image.length - 1) return;
    currentIndex.value = (currentIndex.value + 1) % input.value.image.length;
};

const getImageSrc = (file) => {
    return `/public/upload/${file.saveFolder}/${file.saveFile}`;
};

const moveDetail = () => {
    router.push({ name: "detail", params: { id: article.value.articleId } });
};
</script>

<template>
    <form action="" method="POST" class="editor__form mb-3 position-absolute top-50 start-50 translate-middle-x" id="editor-form" @submit.prevent="submitHandler">
        <h4 class="d-flex justify-content-center" style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>
        <div style="height: 10px"></div>
        <div class="d-flex flex-row mb-3 mt-3"><label style="width: 90px">제목</label> <input class="editor__title-input p-1 mb-3 ms-3 border rounded" type="text" id="editor-title-input" name="subject" v-model="article.subject" style="width: 100%" value="" required /></div>
        <template v-if="input.image.length != 0">
            <h4 style="text-align: center">이미지</h4>
            <div class="image-slider">
                <button @click.prevent="prevImage" class="nav-btn prev-btn">&lt;</button>
                <div class="image-list">
                    <div v-for="(file, index) in input.image" :key="file.imageId" class="image-div" :class="{ active: index === currentIndex }">
                        <img :src="getImageSrc(file)" />
                        <button type="button" class="btn btn-outline-danger delete-btn" @click.prevent="deleteImageFile(file.imageId)">Delete</button>
                    </div>
                </div>
                <button @click.prevent="nextImage" class="nav-btn next-btn">&gt;</button>
                <div class="file-input-wrapper">
                    <input multiple @change="upload" ref="images" type="file" class="file-input" />
                </div>
            </div>
        </template>
        <template v-else>
            <div style="height: 150px">
                <h4 style="text-align: center">이미지 추가하기</h4>
                <div class="file-none-input-wrapper">
                    <input multiple @change="upload" ref="images" type="file" class="file-input" />
                </div>
            </div>
        </template>
        <div class="d-flex flex-row mb-3">
            <label style="width: 90px">내용</label>
            <textarea rows="10" class="editor__content-input p-1 mb-3 ms-3 border rounded input-group-lg" type="text" name="content" style="width: 100%" v-model="article.content" required></textarea>
        </div>
        <template v-if="type === 'write'">
            <div class="d-flex justify-content-center">
                <button class="editor__btn btn btn-outline-primary mb-3 me-1">작성 완료</button>
                <span class="mb-3 text-primary" style="cursor: pointer"> <button type="button" class="btn btn-outline-primary" @click="moveToList">작성 취소</button></span>
            </div>
        </template>
        <template v-else>
            <div class="d-flex justify-content-center">
                <button class="btn btn-outline-primary mb-3 me-1">수정 완료</button>
                <span class="mb-3 text-primary" style="cursor: pointer"> <button type="button" class="btn btn-outline-primary" @click="moveDetail">수정 취소</button></span>
            </div>
        </template>
    </form>
</template>

<style scoped>
@media (min-width: 1199px) {
    #editor-form {
        position: relative;
        top: 130px;
        width: 49%;
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #editor-form {
        position: relative;
        top: 130px;
        width: 80%;
    }
}
.delete-btn {
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
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
    height: 600px;
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

.file-none-input-wrapper {
    position: absolute;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px dashed #ccc;
}

.file-none-input-wrapper::after {
    content: "+";
    font-size: 2em;
    color: #333;
}

.file-none-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

/* Remove default file input styling */
.file-none-input::-webkit-file-upload-button {
    visibility: hidden;
}
.file-none-input::before {
    content: " ";
    display: inline-block;
    width: 100%;
    height: 100%;
}

.file-input-wrapper {
    position: absolute;
    top: 50px;
    right: 50px;
    text-align: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px dashed #ccc;
}

.file-input-wrapper::after {
    content: "+";
    font-size: 2em;
    color: #333;
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

/* Remove default file input styling */
.file-input::-webkit-file-upload-button {
    visibility: hidden;
}
.file-input::before {
    content: " ";
    display: inline-block;
    width: 100%;
    height: 100%;
}
</style>
