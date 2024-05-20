import { ref } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

import { userConfirm, findById, tokenRegeneration, logout } from "@/api/member";
import { httpStatusCode } from "@/util/http-status";

export const useMemberStore = defineStore(
  "memberStore",
  () => {
    const router = useRouter();

    const isLogin = ref(false);
    const isLoginError = ref(false);
    const userInfo = ref(null);
    const isValidToken = ref(false);

    const userLogin = async (loginUser) => {
      console.log(loginUser);
      let data = "";
      await userConfirm(
        loginUser,
        (response) => {
          console.log(loginUser);
          console.log(response);
          if (response.status === httpStatusCode.CREATE) {
            console.log("로그인 성공!!!!");
            let { data } = response;
            let accessToken = data["access-token"];
            let refreshToken = data["refresh-token"];
            isLogin.value = true;
            isLoginError.value = false;
            isValidToken.value = true;
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
          }
          data = response.data;
        },
        (error) => {
          isLogin.value = false;
          isLoginError.value = true;
          isValidToken.value = false;
          data = error.response.data;
        }
      );
      return data;
    };

    const getUserInfo = async (token) => {
      let decodeToken = jwtDecode(token);
      console.log(decodeToken.memberId);
      await findById(
        decodeToken.memberId,
        (response) => {
          console.log("getUserInfo");
          console.log(response);
          if (response.status === httpStatusCode.OK) {
            console.log("getUserInfo", response.data);
            userInfo.value = response.data.member;
          } else {
            console.log("유저 정보 없음!!!!");
          }
        },
        async (error) => {
          console.error(
            "g[토큰 만료되어 사용 불가능.] : ",
            error.response.status,
            error.response.statusText
          );
          isValidToken.value = false;

          await tokenRegenerate();
        }
      );
    };

    const tokenRegenerate = async () => {
      await tokenRegeneration(
        JSON.stringify(userInfo.value),
        (response) => {
          console.log("tokenRegenerate");
          console.log(response);
          if (response.status === httpStatusCode.CREATE) {
            let accessToken = response.data["access-token"];
            sessionStorage.setItem("accessToken", accessToken);
            isValidToken.value = true;
          }
        },
        async (error) => {
          // HttpStatus.UNAUTHORIZE(401) : RefreshToken 기간 만료 >> 다시 로그인!!!!
          if (error.response.status === httpStatusCode.UNAUTHORIZED) {
            // 다시 로그인 전 DB에 저장된 RefreshToken 제거.
            await logout(
              userInfo.value.memberId,
              (response) => {
                console.log("refresh 만료 후");
                console.log(response);
                if (response.status === httpStatusCode.OK) {
                  console.log("리프레시 토큰 제거 성공");
                } else {
                  console.log("리프레시 토큰 제거 실패");
                }
                alert("RefreshToken 기간 만료!!! 다시 로그인해 주세요.");
                isLogin.value = false;
                userInfo.value = null;
                isValidToken.value = false;
                router.push({ name: "user-login" });
              },
              (error) => {
                console.error(error);
                isLogin.value = false;
                userInfo.value = null;
              }
            );
          }
        }
      );
    };

    const userLogout = async () => {
      console.log("로그아웃 아이디 : " + userInfo.value.memberId);
      await logout(
        userInfo.value.memberId,
        (response) => {
          console.log("로그아웃");
          console.log(response);
          if (response.status === httpStatusCode.OK) {
            isLogin.value = false;
            userInfo.value = null;
            isValidToken.value = false;

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
          } else {
            console.error("유저 정보 없음!!!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    };

    return {
      isLogin,
      isLoginError,
      userInfo,
      isValidToken,
      userLogin,
      getUserInfo,
      tokenRegenerate,
      userLogout,
    };
  },
  { persist: { storage: sessionStorage } }
);
