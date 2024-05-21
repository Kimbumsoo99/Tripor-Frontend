<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailArticle } from "@/api/article.js";
const { VITE_UPLOAD_FILE_PATH } = import.meta.env;
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";

const memberStore = useMemberStore();

const { userInfo } = storeToRefs(memberStore);

const route = useRoute();
const router = useRouter();

const { id } = route.params;
const imagesPath = ref([]);

const imageSliderVisible = ref(true);
const board = ref({});
const currentUserWriter = ref(false);

const getBoard = async function () {
    detailArticle(
        id,
        (res) => {
            board.value = res.data.item;
            if (board.value.memberId == userInfo.value.memberId) currentUserWriter.value = true;
            for (const image of board.value.fileInfos) {
                imagesPath.value.push(VITE_UPLOAD_FILE_PATH + "/" + image.saveFolder + "/" + image.saveFile);
            }
            if (imagesPath.value.length === 0) imageSliderVisible.value = false;
            getComments();
            getMemberProfile();
        },
        (err) => console.log(err)
    );
};

const writerProfileImg = ref("");

const getMemberProfile = async function () {
    const response = await axios.get(`http://localhost/member/${board.value.memberId}/profile`);
    writerProfileImg.value = response.data.profile;
};

const boardRemove = async function () {
    const response = await axios.delete(`http://localhost/article/${route.params.id}`);
    let msg = "글 삭제 시 문제 발생했습니다.";
    if (response.status == 200) msg = "글 삭제가 완료되었습니다.";
    alert(msg);
    router.push({ name: "board" });
};

const updateHit = async function () {
    await axios.put(`http://localhost/article/hit/${route.params.id}`, {
        articleId: board.value.articleId,
    });
};

onMounted(() => {
    getBoard();
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

const newComment = ref("");

const writeComment = async function (parentId = null) {
    try {
        const response = await axios.post(`http://localhost/article/${board.value.articleId}/comment`, {
            memberId: userInfo.value.memberId,
            commentContent: newComment.value,
            parentCommentId: parentId,
        });
        console.log(response);
        router.go(0);
    } catch (error) {
        console.log(error);
    }
};

const comments = ref({});

const getComments = async function () {
    await axios.get(`http://localhost/article/${board.value.articleId}/comments`).then((resComments) => {
        comments.value = resComments.data.items;
        comments.value.map((comment) => {
            comment.replyMode = false;
            comment.updateCommentMode = false;
            axios.get(`http://localhost/member/${comment.memberId}/profile`).then((resProfile) => {
                if (resProfile.data.result == "ok") {
                    comment.profileImg = resProfile.data.profile;
                } else {
                    comment.profileImg = null;
                }
            });
            comment.childComments.map((child) => {
                axios.get(`http://localhost/member/${child.memberId}/profile`).then((resProfile) => {
                    child.updateCommentMode = false;
                    if (resProfile.data.result == "ok") {
                        child.profileImg = resProfile.data.profile;
                    } else {
                        child.profileImg = null;
                    }
                });
            });
        });
    });
    console.log(comments.value);
};

const fixedcomment = ref("");

const toggleCommentMode = (idx) => {
    comments.value[idx].updateCommentMode = !comments.value[idx].updateCommentMode;
    if (comments.value[idx].updateCommentMode) {
        fixedcomment.value = comments.value[idx].commentContent;
    }
};

const toggleChildCommentMode = (comment) => {
    fixedcomment.value = "";
    comment.updateCommentMode = !comment.updateCommentMode;
    if (comment.updateCommentMode) {
        fixedcomment.value = comment.commentContent;
    }
};

const updateComment = async function (id) {
    try {
        const response = await axios.put(`http://localhost/article/${board.value.articleId}/comments/${id}`, {
            memberId: userInfo.value.memberId,
            commentContent: fixedcomment.value,
        });
        router.go(0);
    } catch (error) {
        console.log(error);
    }
};

const deleteComment = async function (id) {
    try {
        const response = await axios.delete(`http://localhost/article/${board.value.articleId}/comments/${id}`);
        console.log(response);
        let msg = "댓글 삭제 시 문제 발생했습니다.";
        if (response.status == 200) msg = "댓글 삭제가 완료되었습니다.";
        alert(msg);
        router.go(0);
    } catch (error) {
        console.log(error);
    }
};

const toggleReply = (comment) => {
    comment.replyMode = !comment.replyMode;
};

const dateFormatting = (date) => {
    const [datePart, timePart] = date.split(" ");

    // 날짜 부분을 분리
    const [year, month, day] = datePart.split("-");

    // 시간 부분을 분리
    // const [hour, minute, second] = timePart.split(':');

    // 년-월-일 형식으로 변환
    const formattedDate = `${year}.${month}.${day}`;
    // 시간 부분도 원한다면 추가
    // const formattedTime = `${hour}:${minute}:${second}`;

    // 원하는 형식으로 반환
    return formattedDate;
};
</script>

<template>
    <div class="position-relative">
        <div style="height: 270px"></div>
        <div id="article_div" class="mb-3 position-absolute top-50 start-50 translate-middle-x">
            <RouterLink :to="{ name: 'board' }" style="text-decoration: none"><span class="mb-3 text-primary" style="cursor: pointer">&lt; 뒤로가기</span></RouterLink>

            <h3 class="mt-3" id="title_data">{{ board.subject }}</h3>
            <div style="font-size: medium" class="d-flex flex-row">
                <span class="writer-profile-img-area me-1">
                    <img :src="writerProfileImg != null ? writerProfileImg : '/src/assets/image/default_profile_img.png'" id="profileImage" />
                </span>
                {{ board.memberId }} | {{ board.registerDate }} | 조회수 {{ board.hit }}
            </div>
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

            <hr />
            <div class="d-flex justify-content-center" v-if="currentUserWriter">
                <RouterLink :to="{ name: 'update', params: { id: board.articleId } }" style="text-decoration: none"><input type="button" class="btn text-white btn-outline-primary m-1" onclick="" value="수정하기" /></RouterLink>
                <input id="article-delete" type="button" class="btn text-white btn-outline-primary m-1" @click="boardRemove" value="삭제하기" />
            </div>
            <div style="height: 30px"></div>

            <template v-for="(comment, index) in comments" :key="comment.commentId">
                <div id="comment_div" class="d-flex flex-row justify-content-between m-2">
                    <div class="profile-image-area m-2"><img :src="comment.profileImg != null ? comment.profileImg : '/src/assets/image/default_profile_img.png'" id="profileImage" /></div>

                    <div style="width: 87%">
                        <div class="d-flex justify-content-between m-2">
                            <div style="font-size: 15px; white-space: nowrap">
                                {{ comment.memberId }}&nbsp;
                                <p class="d-none d-sm-inline-block" style="font-size: 15px; margin: 0px">|&nbsp;{{ dateFormatting(comment.commentRegisterDate) }}</p>
                            </div>
                            <div class="d-flex flex-row">
                                <div style="font-size: 15px; margin-right: 10px; cursor: pointer" @click="toggleReply(comment)">답글 달기</div>
                                <div v-if="userInfo != null && comment.memberId == userInfo.memberId" style="font-size: 14px; cursor: pointer; white-space: nowrap" @click="toggleCommentMode(index)">수정/삭제</div>
                            </div>
                        </div>
                        <div v-if="comment.updateCommentMode" id="write_comment_div" class="m-2">
                            <textarea v-model="fixedcomment" style="width: 100%" id="content" rows="3" class="border rounded input-group-lg" type="text" name="content" required></textarea>
                            <button class="btn btn-outline-secondary btn-sm me-1" @click="updateComment(comment.commentId)">수정하기</button>
                            <button class="btn btn-outline-danger btn-sm" @click="deleteComment(comment.commentId)">삭제하기</button>
                        </div>
                        <div v-else-if="comment.replyMode" id="write_comment_div" class="m-2">
                            {{ comment.commentContent }}
                            <textarea v-model="newComment" style="width: 100%" id="content" rows="3" class="border rounded input-group-lg m3-t" type="text" name="content" required></textarea>
                            <button class="btn btn-outline-secondary btn-sm me-1" @click="writeComment(comment.commentId)">작성</button>
                            <button class="btn btn-outline-danger btn-sm" @click="toggleReply(comment)">닫기</button>
                        </div>
                        <div v-else class="m-2">
                            {{ comment.commentContent }}
                        </div>
                    </div>
                </div>
                <!-- 답글 -->
                <div v-for="child in comment.childComments" :key="child.commentId" class="d-flex flex-row">
                    <div class="p-1 ms-1"><i class="bi bi-arrow-return-right" style="font-size: 40px"></i></div>
                    <div id="comment_div" class="d-flex flex-row m-1" style="width: 100%">
                        <div class="profile-image-area"><img :src="child.profileImg != null ? child.profileImg : '/src/assets/image/default_profile_img.png'" id="profileImage" /></div>
                        <div style="width: 28px"></div>
                        <div>
                            <div style="font-size: 15px">{{ child.memberId }} &nbsp;|&nbsp;{{ dateFormatting(child.commentRegisterDate) }}</div>
                            <div>{{ child.commentContent }}</div>
                        </div>
                        <div class="d-flex flex-row">
                            <div v-if="userInfo != null && child.memberId == userInfo.memberId" style="font-size: 14px; cursor: pointer; white-space: nowrap" @click="toggleChildCommentMode(child)">수정/삭제</div>
                        </div>
                    </div>
                    <div v-if="child.updateCommentMode" id="write_comment_div" class="m-2">
                        <textarea v-model="fixedcomment" style="width: 100%" id="content" rows="3" class="border rounded input-group-lg" type="text" name="content" required></textarea>
                        <button class="btn btn-outline-secondary btn-sm me-1" @click="updateComment(child.commentId)">수정하기</button>
                        <button class="btn btn-outline-danger btn-sm" @click="deleteComment(child.commentId)">삭제하기</button>
                    </div>
                </div>
            </template>

            <div id="write_comment_div" class="m-2">
                <textarea v-model="newComment" style="width: 100%" id="content" rows="3" class="border rounded input-group-lg" type="text" name="content" required></textarea>
                <button class="btn btn-outline-secondary" @click="writeComment">댓글달기</button>
            </div>
            <div style="height: 30px"></div>
        </div>
    </div>
</template>

<style scoped>
#comment_div {
    background-color: #f8f9fa;
    padding: 8px;
    border-radius: 10px;
}
.writer-profile-img-area {
    width: 27px;
    height: 27px;
    border: 1px solid #ccc;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-content: center;
}
.writer-profile-img-area img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.profile-image-area {
    width: 58px;
    height: 58px;
    border: 1px solid #ccc;
    border-radius: 50%;

    position: relative;

    overflow: hidden;
    display: flex;
    justify-content: center;
    align-content: center;
}
.profile-img-area img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
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
