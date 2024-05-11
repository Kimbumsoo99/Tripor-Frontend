<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const subject = ref("");
const content = ref("");

const boardInsert = async function () {
    console.log("!!");
    await axios
        .post("http://localhost/article", {
            memberId: "show7441",
            subject: subject.value,
            content: content.value,
        })
        .then()
        .catch((err) => console.error(err));
    router.push({ name: "board" });
};
</script>

<template>
    <div class="position-relative">
        <div style="height: 280px"></div>
        <form action="" method="POST" class="editor__form mb-3 position-absolute top-50 start-50 translate-middle-x" id="editor-form" style="width: 45%" @submit.prevent="boardInsert">
            <h4 class="d-flex justify-content-center" style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>
            <div style="height: 10px"></div>
            <input type="hidden" name="action" value="write" />
            <div class="d-flex flex-row mb-3 mt-3"><label style="width: 90px">제목</label> <input class="editor__title-input p-1 mb-3 ms-3 border rounded" type="text" id="editor-title-input" name="subject" v-model="subject" style="width: 100%" value="" required /></div>
            <div class="d-flex flex-row mb-3">
                <label style="width: 90px">내용</label>
                <textarea rows="10" class="editor__content-input p-1 mb-3 ms-3 border rounded input-group-lg" type="text" id="editor-content-input" name="content" style="width: 100%" value="" v-model="content" required></textarea>
            </div>
            <div class="d-flex justify-content-center">
                <button class="editor__btn btn btn-outline-primary mb-3" id="editor-submit-btn">작성 완료</button>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
