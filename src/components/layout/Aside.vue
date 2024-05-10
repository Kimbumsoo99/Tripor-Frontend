<script setup>
import { ref } from 'vue';

const isExpanded = ref(false)

const toggle = () => {
    if (isExpanded.value === false) {
        isExpanded.value = true
    } else {
        isExpanded.value = false
    }
}
</script>

<template>
        <div
            id="aside_div"
            class="d-none d-xl-block shadow-sm position-fixed ps-2 pt-4 pe-2 container bg-white">
            <div style="height: 90px"></div>
            <div style="cursor: pointer" class="p-3 m-1 rounded menu_button row">
                <RouterLink :to="{ name: 'home' }" style="text-decoration: none; color:#332D2D">
                    <div class="col-12" onclick="">
                        <i class="bi bi-house-door-fill me-3"></i>
                        <span>홈</span>
                    </div>
                </RouterLink>
            </div>
            <div style="cursor: pointer" class="p-3 m-1 rounded menu_button row">
                <RouterLink :to="{ name: 'makeplan' }" style="text-decoration: none; color:#332D2D">
                <div class="col-12" onclick="">
                    <i class="bi bi-search me-3"></i>
                    <span>여행 계획 만들기</span>
                </div>
                </RouterLink>
            </div>
            <div style="cursor: pointer" class="p-3 m-1 rounded menu_button row">
                <div class="col-12" onclick="">
                    <i class="bi bi-pencil-square me-3"></i>
                    <span>여행 정보 공유하기</span>
                </div>
            </div>
            <div>
                <div style="cursor: pointer" id="expandDiv" class="p-3 m-1 rounded menu_button row" @click="toggle">
                    <div
                        class="col-10"
                        id="myPageDiv"                  
                        style="padding: 0 12px">
                        <i class="bi bi-person-circle me-3"></i>
                        <span>마이페이지</span>
                    </div>
                    <i v-if="!isExpanded" class="bi bi-caret-up-fill col-2" id="expandIcon"></i>
                    <i v-if="isExpanded"
                        class="bi bi-caret-down-fill col-2"
                        id="foldIcon"></i>
                </div>
                <div class="ps-5 pt-1" id="myPageExpand" v-if="isExpanded">
                     <div>
                        <RouterLink :to="{ name: 'myplan' }" style="text-decoration: none; color:#332D2D"><a style="cursor: pointer" onclick="">-&nbsp;&nbsp;&nbsp;나의 여행 계획</a></RouterLink>
                    </div>
                    <div style="height: 10px"></div>
                    <div>
                        <RouterLink :to="{ name: 'profile' }" style="text-decoration: none; color:#332D2D"><a style="cursor: pointer" onclick="">-&nbsp;&nbsp;&nbsp;회원정보 수정</a></RouterLink>
                    </div>
                    <div style="height: 10px"></div>
                    <div>
                        <a style="cursor: pointer" onclick="">-&nbsp;&nbsp;&nbsp;회원탈퇴</a>
                    </div>
                    
                </div>
            </div>
        </div>
</template>

<style scoped>
#aside_div{
    width: 380px; 
    height: 100%; 
    z-index: 9; 
    padding-right: 0; 
    z-index:9999
}
.menu_button:hover{
    background-color: #bfeaff;
}
.menu_button:hover span{
    font-weight: bold;
}
#myPageExpand a:hover{
    font-weight: bold;
    cursor: pointer;
}
</style>