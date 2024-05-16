<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import PageNavigation from "@/components/common/PageNavigation.vue";
import VSelect from "@/components/common/VSelect.vue";
import { listArticle } from "@/api/article";
import { useRouter } from "vue-router";
const { VITE_ARTICLE_LIST_SIZE, VITE_ARTICLE_NAVIGATION_SIZE } = import.meta.env;

const router = useRouter();
router.beforeRouteLeave = (to, from, next) => {
    console.log(to);
    console.log(from);
};

const articleList = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const totalCount = ref(0);

const param = ref({
    pgno: currentPage.value,
    spp: VITE_ARTICLE_LIST_SIZE,
    nav: VITE_ARTICLE_NAVIGATION_SIZE,
    key: "",
    word: "",
});

// const selectOption = ref([
//     { text: "검색조건", value: "" },
//     { text: "글번호", value: "article_id" },
//     { text: "제목", value: "subject" },
//     { text: "작성자아이디", value: "member_id" },
// ]);

// const changeKey = (val) => {
//     console.log("BoarList에서 선택한 조건 : " + val);
//     param.value.key = val;
// };

const onPageChange = (val) => {
    console.log(val + "번 페이지로 이동 준비 끝!!!");
    currentPage.value = val;
    param.value.pgno = val;
    getArticleList();
};

const getArticleList = function () {
    listArticle(
        param.value,
        (res) => {
            console.log(res);
            articleList.value = res.data.items.articles;
            currentPage.value = res.data.meta.currentPage;
            totalPage.value = res.data.meta.totalPageCount;
            totalCount.value = res.data.meta.totalCount;
        },
        (err) => console.log(err)
    );
    // axios("http://localhost/article", { params: param.value })
    //     .then((response) => {
    //         console.log(response);
    //         articleList.value = response.data.items.articles;
    //         currentPage.value = response.data.meta.currentPage;
    //         totalPage.value = response.data.meta.totalPageCount;
    //         totalCount.value = response.data.meta.totalCount;
    //     })
    //     .catch((error) => {
    //         console.log("에러발생");
    //         console.error(error);
    //     });
};

const computedIndex = computed(() => {
    return articleList.value.map((article, index) => {
        console.log(totalCount.value, index, currentPage.value);
        return totalCount.value - index - (currentPage.value - 1) * VITE_ARTICLE_LIST_SIZE;
    });
});

const onKeySelect = (value) => {
    param.value.key = value;
};

const searchArticle = () => {
    listArticle(
        param.value,
        (res) => {
            console.log(res);
            articleList.value = res.data.items.articles;
            currentPage.value = res.data.meta.currentPage;
            totalPage.value = res.data.meta.totalPageCount;
            totalCount.value = res.data.meta.totalCount;
        },
        (err) => console.log(err)
    );
};

onMounted(() => {
    getArticleList();
});
</script>

<template>
    <div>
        <div class="position-relative">
            <div style="height: 280px"></div>
            <div class="mb-3 position-absolute top-50 start-50 translate-middle-x" id="board_div">
                <h4 class="d-flex justify-content-center" style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>

                <!-- board list area -->
                <div id="board-list" style="overflow: hidden; white-space: nowrap">
                    <div class="board__container" id="board-container">
                        <RouterLink :to="{ name: 'write' }" style="text-decoration: none; color: #332d2d">
                            <button class="btn btn-primary ms-auto me-3 d-flex justify-content-end mb-3" style="overflow: hidden; white-space: nowrap" type="button" onclick="">글쓰기</button>
                        </RouterLink>
                        <!--  PAGE 및 검색으로 인해 추가 한 부분 -->
                        <form id="form-search" class="d-flex" action="">
                            <input type="hidden" name="action" value="list" />
                            <input type="hidden" name="pgno" value="1" />
                            <VSelect @on-key-select="onKeySelect" />
                            <div class="input-group input-group-sm me-3">
                                <input v-model="param.word" type="text" class="form-control" placeholder="검색어..." />
                                <button id="btn-search" class="btn btn-dark" type="button" @click.prevent="searchArticle">검색</button>
                            </div>
                        </form>
                        <div style="height: 10px"></div>
                        <!--  PAGE 및 검색으로 인해 추가 한 부분 -->
                        <table class="board-table">
                            <thead class="board__table-head">
                                <tr class="board__titles">
                                    <th class="board__column th-num col-2 col-sm-2">번호</th>
                                    <th class="board__column th-title col-4 col-sm-5">제목</th>
                                    <th class="board__column th-author col-2 col-sm-3">작성자</th>
                                    <!-- <th class="board__column th-date col-3 d-none d-md-block">작성일</th> -->
                                    <th class="board__column th-views col-1 col-sm-2">조회</th>
                                </tr>
                            </thead>
                            <tbody class="board__contents" id="board-body">
                                <tr v-for="(article, index) in articleList" :key="article.articleId">
                                    <td class="board__column col-2 col-sm-2">
                                        {{ computedIndex[index] }}
                                    </td>
                                    <th class="board__column col-4 col-sm-5">
                                        <div id="title_data">
                                            <RouterLink
                                                :to="{
                                                    name: 'detail',
                                                    params: { id: article.articleId },
                                                }"
                                                >{{ article.subject }}</RouterLink
                                            >
                                        </div>
                                    </th>
                                    <td class="board__column col-2 col-sm-3">
                                        {{ article.memberId }}
                                    </td>
                                    <!-- <td class="board__column col-3 d-none d-md-block">
                                        {{ article.registerDate }}
                                    </td> -->
                                    <td class="board__column col-1 col-sm-2">{{ article.hit }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 
                    <div class="p-5" id="contents_container" style="display: none">
                        <button class="btn mb-3" id="back_btn" onclick="javascript:post()">
                            < 뒤로가기</button>
                        <div class="contents__container p-5"></div>
                        -->
                    <!--  페이지 추가  -->
                    <div class="row mt-2">
                        <PageNavigation :current-page="currentPage" :total-page="totalPage" @pageChange="onPageChange" />
                    </div>
                    <!--  페이지 추가  -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1199px) {
    #board_div {
        position: relative;
        top: 130px;
        width: 49%;
        margin-left: 100px;
    }
}
@media (max-width: 1199px) {
    #board_div {
        position: relative;
        top: 130px;
        width: 80%;
    }
}
.board-table {
    font-size: 13px;
    width: 100%;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}

.board-table a {
    color: #333;
    display: inline-block;
    line-height: 1.4;
    word-break: break-all;
    vertical-align: middle;
}
.board-table a:hover {
    text-decoration: underline;
}
.board-table th {
    text-align: center;
}

.board-table .th-num {
    width: 100px;
    text-align: center;
}

.board-table .th-date {
    width: 200px;
}

.board-table th,
.board-table td {
    padding: 14px 0;
}

.board-table tbody tr {
    border-top: 1px solid #e7e7e7;
    text-align: center;
}

.board-table tbody th {
    padding-left: 28px;
    padding-right: 14px;
    border-top: 1px solid #e7e7e7;
    text-align: left;
}

.board-table tbody th p {
    display: none;
}

#board_div a {
    text-decoration: none;
    font-size: 16px;
}
#title_data {
    width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
