<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { registArticle, getModifyArticle, modifyArticle } from "@/api/article.js";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
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
});

if (props.type === "modify") {
    let { id } = route.params;

    getModifyArticle(
        id,
        ({ data }) => {
            console.log("getModifyArticle 로딩", data);
            article.value = data.item;
            images.value.files = data.item.fileinfos;
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


const aiExpanded = ref(false);

const aiExpand = () => {
    aiExpanded.value = !aiExpanded.value;
}

const categoryItems = [
    { code: 12, name: "관광지" },
    { code: 14, name: "문화시설" },
    { code: 15, name: "축제공연행사" },
    { code: 25, name: "여행코스" },
    { code: 28, name: "레포츠" },
    { code: 32, name: "숙박" },
    { code: 38, name: "쇼핑" },
    { code: 39, name: "음식점" },
];

const q1 = ref('');
const q2 = ref('');
const q3 = ref('');
const q4 = ref('');
const q5 = ref('');
const q6 = ref('');
const q7 = ref('');
const q8 = ref('');
const q9 = ref('');


// chatGPT description
const getGPTResponse = async () => {
    try {
        showLoadingSpinner();

        const openai = new OpenAI({
        apiKey: `${import.meta.env.VITE_OPENAI_API_KEY}`,
        dangerouslyAllowBrowser: true,
        })

        const prompt = `다음 여행 정보를 바탕으로 여행 리뷰를 20줄 이내의 줄글로 작성해줘.

        여행지 이름과 위치: ${q1.value}
        방문 시기: ${q2.value}
        주요 관광 명소: ${q3.value}
        숙박 정보: ${q4.value}
        음식과 레스토랑: ${q5.value}
        교통수단: ${q6.value}
        가격대: ${q7.value}
        특별한 경험: ${q8.value}
        팁과 조언: ${q9.value}`

        const response = await openai.chat.completions.create({
        messages: [
            {
            role: 'user',
            content: prompt,
            },
        ],
        model: 'gpt-3.5-turbo',
        })

        article.value.content = response.choices[0].message.content;
        console.log('chatGPT 결과: ', response.choices[0].message.content);

        hideLoadingSpinner();
  } catch (error) {
      console.log('chatGPT: 🚨 에러가 발생했습니다.')
    console.log(error)
  }
}

const spinnerVisible = ref(false)

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
        <div class="d-flex flex-row mb-3 mt-3"><label style="width: 90px">제목</label> <input class="editor__title-input p-1 mb-3 ms-3 border rounded" type="text" id="editor-title-input" name="subject" v-model="article.subject" style="width: 100%" value="" required /></div>
        <div class="d-flex flex-row mb-3">
            <label style="width: 90px">내용</label>
            <div class="d-flex flex-column mb-3 ms-3 " style="width: 100%">
                <div class="border rounded p-1 mb-1" style="font-size: 16px; background-color:#daf0ff; cursor:pointer" @click="aiExpand">
                    <i class="bi bi-stars"></i>
                    AI의 도움을 받아 게시물을 작성해보세요!
                </div>
                <form class="border rounded p-1 mb-1 ai_form" v-if="aiExpanded" @submit.prevent="getGPTResponse">
                    <ul>
                        <li><label>여행지 이름과 위치</label> <input type="text" v-model="q1" placeholder="구체적인 도시와 국가를 포함해 주세요."></li>
                        <li><label>방문 시기</label> <input type="text" v-model="q2" placeholder="계절이나 특정 이벤트와 같은 방문 시기를 알려주세요."></li>
                        <li><label>주요 관광 명소</label> <input type="text" v-model="q3" placeholder="방문한 장소와 활동, 경험한 것들을 설명해 주세요."></li>
                        <li><label>숙박 정보</label> <input type="text" v-model="q4" placeholder="머문 호텔, 리조트, 게스트하우스 등의 정보와 경험을 공유해 주세요."></li>
                        <li><label>음식과 레스토랑</label> <input type="text" v-model="q5" placeholder="먹은 음식과 방문한 레스토랑에 대한 인상과 추천 메뉴를 포함해 주세요."></li>
                        <li><label>교통수단</label> <input type="text" v-model="q6" placeholder="여행지까지 가는 방법과 현지에서 이용한 교통수단에 대해 알려주세요."></li>
                        <li><label>가격대</label> <input type="text" v-model="q7" placeholder="여행 비용, 가성비 등에 대한 정보를 제공해 주세요."></li>
                        <li><label>특별한 경험</label> <input type="text" v-model="q8" placeholder="인상 깊었던 활동이나 이벤트, 특별히 기억에 남는 순간을 이야기해 주세요."></li>
                        <li><label>팁과 조언</label> <input type="text" v-model="q9" placeholder="여행을 계획하는 다른 사람들에게 유용한 팁이나 조언을 알려 주세요."></li>
                    </ul>
                    <div class="d-flex flex-row-reverse m-1">
                        <button class="btn btn-outline-secondary" type="submit" style="font-size: 15px">게시물 생성</button>
                        <span class="loader" v-if="spinnerVisible"></span>
                    </div>
                </form>
                <textarea id="content" rows="10" class="border rounded input-group-lg" type="text" name="content" v-model="article.content" required></textarea>
            </div>
        </div>
        <div class="d-flex flex-row mb-3 mt-3">
            <span style="width: 90px">첨부 파일</span>
            <input multiple @change="upload" ref="images" type="file" />
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
                <span class="mb-3 text-primary" style="cursor: pointer"> <button type="button" class="btn btn-outline-primary" @click="moveToList">수정 취소</button></span>
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
.ai_form{
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

.ai_form input::placeholder { color: #aaaaaa; }
.ai_form input:focus { outline: none; }

.ai_form label{
    margin: 5px;
    font-size: 15px;
}

.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  margin:15px auto;
  color: #70a3c7;
  box-sizing: border-box;
  animation: animloader 1s linear infinite alternate;
}

@keyframes animloader {
  0% {
    box-shadow: -38px -12px ,  -14px 0,  14px 0, 38px 0;
  }
  33% {
    box-shadow: -38px 0px, -14px -12px,  14px 0, 38px 0;
  }
  66% {
    box-shadow: -38px 0px , -14px 0, 14px -12px, 38px 0;
  }
  100% {
    box-shadow: -38px 0 , -14px 0, 14px 0 , 38px -12px;
  }
}

</style>
