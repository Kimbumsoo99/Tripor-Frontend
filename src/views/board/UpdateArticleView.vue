<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const board = ref({});

const subject = ref("");
const content = ref("");

const getBoard = async function () {
    const response = await axios.get(`http://localhost/article/${route.params.id}`);
    console.log(response);
    board.value = response.data.item;
    subject.value = board.value.subject;
    content.value = board.value.content;
};

const contentUpdate = async function () {
    const response = await axios.put("http://localhost/article", {
        articleId: board.value.articleId,
        subject: subject.value,
        content: content.value,
    });
    console.log(response);
    router.push({ name: "board" });
};

onMounted(() => {
    getBoard();
});
</script>

<template>
    <div class="position-relative">
        <div style="height: 280px"></div>
        <form action="" method="POST" class="mb-3 position-absolute top-50 start-50 translate-middle-x" id="editor-form" @submit.prevent="contentUpdate">
            <h4 class="d-flex justify-content-center" style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>
            <div style="height: 10px"></div>
            <input type="hidden" name="action" value="modify" />

            <div class="d-flex flex-row mb-3 mt-3"><label style="width: 90px">제목</label> <input class="editor__title-input p-1 mb-3 ms-3 border rounded" type="text" id="editor-title-input" name="subject" style="width: 100%" v-model="subject" /></div>
            <div class="d-flex flex-row mb-3">
                <label style="width: 90px">내용</label>
                <textarea rows="10" class="editor__content-input p-1 mb-3 ms-3 border rounded input-group-lg" type="text" id="editor-content-input" name="content" style="width: 100%" v-model="content"></textarea>
            </div>

            <!-- <input type="hidden" name="boardno" value="${board.boardNo}"/>
			<input type="hidden" readonly name="userid" value="글쓴이: ${board.userId}"/> -->
            <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-outline-primary me-1">수정 완료</button>
                <RouterLink :to="{ name: 'board' }" style="text-decoration: none"
                    ><span class="mb-3 text-primary" style="cursor: pointer"> <button type="button" class="btn btn-outline-primary" onclick="">수정 취소</button></span>
                </RouterLink>
            </div>
        </form>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #editor-form{
		position: relative; 
		top: 130px; 
		width: 49%;
		margin-left: 100px;
	}
}
@media (max-width: 1199px) {
    #editor-form{
		position: relative; 
		top: 130px; 
		width: 80%;
	}
}
</style>
