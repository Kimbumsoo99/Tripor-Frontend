<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { insertImage, deleteImage, registArticle, getModifyArticle, modifyArticle } from "@/api/article.js";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
const { VITE_UPLOAD_FILE_PATH } = import.meta.env;
import axios from "axios";
import OpenAI from "openai";

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
    return `${VITE_UPLOAD_FILE_PATH}/${file.saveFolder}/${file.saveFile}`;
};

const moveDetail = () => {
    router.push({ name: "detail", params: { id: article.value.articleId } });
};

const aiExpanded = ref(false);

const aiExpand = () => {
    aiExpanded.value = !aiExpanded.value;
};

const q1 = ref("");
const q2 = ref("");
const q3 = ref("");
const q4 = ref("");
const q5 = ref("");
const q6 = ref("");
const q7 = ref("");
const q8 = ref("");
const q9 = ref("");

// chatGPT description
const getGPTResponse = async () => {
    try {
        showLoadingSpinner();

        const openai = new OpenAI({
            apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
            dangerouslyAllowBrowser: true,
        });

        const prompt = `다음 여행 정보를 바탕으로 여행 리뷰를 20줄 이내의 줄글로 작성해줘.

        여행지 이름과 위치: ${q1.value}
        방문 시기: ${q2.value}
        주요 관광 명소: ${q3.value}
        숙박 정보: ${q4.value}
        음식과 레스토랑: ${q5.value}
        교통수단: ${q6.value}
        가격대: ${q7.value}
        특별한 경험: ${q8.value}
        팁과 조언: ${q9.value}`;

        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "gpt-3.5-turbo",
        });

        article.value.content = response.choices[0].message.content;
        console.log("chatGPT 결과: ", response.choices[0].message.content);

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
</script>

<template>
    <form action="" method="POST" class="editor__form mb-3 position-absolute top-50 start-50 translate-middle-x" id="editor-form" @submit.prevent="submitHandler">
        <h4 class="d-flex justify-content-center" style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>
        <div style="height: 10px"></div>
        <div class="d-flex flex-row mb-1 mt-3"><label style="width: 90px">제목</label> <input class="editor__title-input p-1 mb-3 ms-3 border rounded" type="text" id="editor-title-input" name="subject" v-model="article.subject" style="width: 100%" value="" required /></div>
        <template v-if="input.image.length != 0" class="d-flex flex-row">
            <label style="width: 90px; height: 40px">사진 추가</label>
            <div class="image-slider">
                <button @click.prevent="prevImage" class="nav-btn prev-btn">&lt;</button>
                <div class="image-list">
                    <div v-for="(file, index) in input.image" :key="file.imageId" class="image-div" :class="{ active: index === currentIndex }">
                        <img :src="getImageSrc(file)" />
                        <button type="button" class="m-1 p-1 btn btn-outline-danger delete-btn" @click.prevent="deleteImageFile(file.imageId)">Delete</button>
                    </div>
                </div>
                <button @click.prevent="nextImage" class="nav-btn next-btn">&gt;</button>
                <div class="file-input-wrapper">
                    <input multiple @change="upload" ref="images" type="file" class="file-input" />
                </div>
            </div>
        </template>
        <template v-else>
            <div style="height: 120px" class="d-flex flex-row">
                <label style="width: 90px">사진 추가</label>
                <div class="file-none-input-wrapper">
                    <input multiple @change="upload" ref="images" type="file" class="file-input" />
                </div>
            </div>
        </template>
        <div class="d-flex flex-row mb-3">
            <label style="width: 90px">내용</label>
            <div class="d-flex flex-column mb-3 ms-3" style="width: 100%">
                <div class="border rounded p-1 mb-1" style="font-size: 16px; background-color: #daf0ff; cursor: pointer" @click="aiExpand">
                    <i class="bi bi-stars"></i>
                    AI의 도움을 받아 게시물을 작성해보세요!
                </div>
                <form class="border rounded p-1 mb-1 ai_form" v-if="aiExpanded" @submit.prevent="getGPTResponse">
                    <ul>
                        <li><label>여행지 이름과 위치</label> <input type="text" v-model="q1" placeholder="구체적인 도시와 국가를 포함해 주세요." /></li>
                        <li><label>방문 시기</label> <input type="text" v-model="q2" placeholder="계절이나 특정 이벤트와 같은 방문 시기를 알려주세요." /></li>
                        <li><label>주요 관광 명소</label> <input type="text" v-model="q3" placeholder="방문한 장소와 활동, 경험한 것들을 설명해 주세요." /></li>
                        <li><label>숙박 정보</label> <input type="text" v-model="q4" placeholder="머문 호텔, 리조트, 게스트하우스 등의 정보와 경험을 공유해 주세요." /></li>
                        <li><label>음식과 레스토랑</label> <input type="text" v-model="q5" placeholder="먹은 음식과 방문한 레스토랑에 대한 인상과 추천 메뉴를 포함해 주세요." /></li>
                        <li><label>교통수단</label> <input type="text" v-model="q6" placeholder="여행지까지 가는 방법과 현지에서 이용한 교통수단에 대해 알려주세요." /></li>
                        <li><label>가격대</label> <input type="text" v-model="q7" placeholder="여행 비용, 가성비 등에 대한 정보를 제공해 주세요." /></li>
                        <li><label>특별한 경험</label> <input type="text" v-model="q8" placeholder="인상 깊었던 활동이나 이벤트, 특별히 기억에 남는 순간을 이야기해 주세요." /></li>
                        <li><label>팁과 조언</label> <input type="text" v-model="q9" placeholder="여행을 계획하는 다른 사람들에게 유용한 팁이나 조언을 알려 주세요." /></li>
                    </ul>
                    <div class="d-flex flex-row-reverse m-1">
                        <button class="btn btn-outline-secondary" type="submit" style="font-size: 15px">게시물 생성</button>
                        <span class="loader" v-if="spinnerVisible"></span>
                    </div>
                </form>
                <textarea id="content" rows="10" class="border rounded input-group-lg" type="text" name="content" v-model="article.content" required></textarea>
            </div>
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
        <div style="height: 30px"></div>
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
    margin-bottom: 20px;
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
.ai_form {
    background-color: #f8f8f8;
}
.ai_form input {
    margin: 5px;
    font-size: 15px;
    color: #222222;
    width: 100%;
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
</style>
