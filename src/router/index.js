import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/user/LoginView.vue";
import JoinView from "@/views/user/JoinView.vue";
import JoinOkView from "@/views/user/JoinOkView.vue";
import FindPwdView from "@/views/user/FindPwdView.vue";
import ProfileView from "@/views/user/ProfileView.vue";
import DeleteUserVue from "@/views/user/DeleteUserVue.vue";
import MakePlanView from "@/views/plan/MakePlanView.vue";
import MyPlanView from "@/views/plan/MyPlanView.vue";
import MyPlanDetailView from "@/views/plan/MyPlanDetailView.vue";
import ArticleListView from "@/views/board/ArticleListView.vue";
import ArticleDetailView from "@/views/board/ArticleDetailView.vue";
import WriteArticleView from "@/views/board/WriteArticleView.vue";
import AttractionInfo from "@/components/map/AttractionInfo.vue";
import UpdateArticleView from "@/views/board/UpdateArticleView.vue";

import { storeToRefs } from "pinia";

import { useMemberStore } from "@/stores/member";

const onlyAuthUser = async (to, from, next) => {
    const memberStore = useMemberStore();
    const { userInfo, isValidToken } = storeToRefs(memberStore);
    const { getUserInfo } = memberStore;
    console.log("onlyAuthUser", isValidToken.value);

    let token = sessionStorage.getItem("accessToken");

    if (userInfo.value != null && token) {
        await getUserInfo(token);
    }
    if (!isValidToken.value || userInfo.value === null) {
        next({ name: "login" });
    } else {
        next();
    }
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            children: [
                {
                    path: ":contentId",
                    name: "content",
                    component: AttractionInfo,
                },
            ],
        },
        {
            path: "/user/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/user/join",
            name: "join",
            component: JoinView,
        },
        {
            path: "/user/join_ok",
            name: "join_ok",
            component: JoinOkView,
        },
        {
            path: "/user/findpwd",
            name: "findpwd",
            beforeEnter: onlyAuthUser,
            component: FindPwdView,
        },
        {
            path: "/user/profile",
            name: "profile",
            beforeEnter: onlyAuthUser,
            component: ProfileView,
        },
        {
            path: "/user/delete",
            name: "deleteuser",
            beforeEnter: onlyAuthUser,
            component: DeleteUserVue,
        },
        {
            path: "/makeplan",
            name: "makeplan",
            beforeEnter: onlyAuthUser,
            component: MakePlanView,
        },
        {
            path: "/myplan",
            name: "myplan",
            beforeEnter: onlyAuthUser,
            component: MyPlanView,
        },
        {
            path: "/myplan/:id",
            name: "myplandetail",
            beforeEnter: onlyAuthUser,
            component: MyPlanDetailView,
        },
        {
            path: "/board",
            name: "board",
            component: ArticleListView,
        },
        {
            path: "/board/:id",
            name: "detail",
            beforeEnter: onlyAuthUser,
            component: ArticleDetailView,
        },
        {
            path: "/board/write",
            name: "write",
            beforeEnter: onlyAuthUser,
            component: WriteArticleView,
        },
        {
            path: "/bord/update/:id",
            name: "update",
            beforeEnter: onlyAuthUser,
            component: UpdateArticleView,
        },
    ],
});

export default router;
