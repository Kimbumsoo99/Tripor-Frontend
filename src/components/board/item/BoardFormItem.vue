<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { registArticle, getModifyArticle, modifyArticle } from "@/api/article.js";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

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
});

if (props.type === "modify") {
    let { id } = route.params;

    getModifyArticle(
        id,
        ({ data }) => {
            article.value = data.item;
        },
        (err) => {
            console.log(err);
        }
    );
}

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
    modifyArticle(
        article.value,
        (res) => {
            let msg = "글수정 처리시 문제 발생했습니다.";
            if (res.status == 200) msg = "글정보 수정이 완료되었습니다.";
            alert(msg);
        },
        (err) => console.log(err)
    );
};

const moveToList = () => {
    router.push({ name: "board" });
};

const images = ref([]);

const input = ref({
    image: "",
});

const upload = () => {
    input.value.image = images.value.files;
    console.log(images.value.files);
    console.log(article.value);
};
</script>

<template>
    <form action="" method="POST" class="editor__form mb-3 position-absolute top-50 start-50 translate-middle-x" id="editor-form" style="width: 45%" @submit.prevent="submitHandler">
        <h4 class="d-flex justify-content-center" style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>
        <div style="height: 10px"></div>
        <div class="d-flex flex-row mb-3 mt-3"><label style="width: 90px">제목</label> <input class="editor__title-input p-1 mb-3 ms-3 border rounded" type="text" id="editor-title-input" name="subject" v-model="article.subject" style="width: 100%" value="" required /></div>
        <div class="d-flex flex-row mb-3">
            <label style="width: 90px">내용</label>
            <textarea rows="10" class="editor__content-input p-1 mb-3 ms-3 border rounded input-group-lg" type="text" name="content" style="width: 100%" v-model="article.content" required></textarea>
        </div>

        <input multiple @change="upload" ref="images" type="file" />
        <template v-if="type === 'write'">
            <div class="d-flex justify-content-center">
                <button class="editor__btn btn btn-outline-primary mb-3 me-1">작성 완료</button>
                <span class="mb-3 text-primary" style="cursor: pointer"> <button type="button" class="btn btn-outline-primary" @click="moveToList">작성 취소</button></span>
            </div>
        </template>
        <template v-else>
            <div class="d-flex justify-content-center">
                <button class="btn btn-outline-primary mb-3 me-1">수정 완료</button>
                <span class="mb-3 text-primary" style="cursor: pointer"> <button type="button" class="btn btn-outline-primary" @click="moveToList">수정 취소</button></span>
            </div>
        </template>
    </form>
</template>

<style scoped></style>
