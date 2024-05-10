<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const board = ref({})

const getBoard = async function () {
    const response = await axios.get(`http://localhost/article/${route.params.id}`);
    board.value = response.data.item;
}

const boardRemove = async function () {
    await axios.delete(`http://localhost/article/${route.params.id}`);
    router.push({ name:'board' });
}

onMounted(() => {
    getBoard()
})
</script>

<template>
    <div class="position-relative">
		<div style="height:280px"></div>
		<div id="article_div" class="mb-3 position-absolute top-50 start-50 translate-middle-x">
			<RouterLink :to="{ name: 'board' }" style="text-decoration: none;"><span class="mb-3 text-primary" style="cursor: pointer">&lt; 뒤로가기</span></RouterLink>
			
			<h3 class="mt-3">{{ board.subject }}</h3>
			<span style="font-size: medium"> {{board.memberId}} | {{board.registerDate}} | 조회수 {{board.hit}}</span> 

			<hr>
			<div>{{board.content}}</div>
			<hr>
			<!-- <c:if test="${board.userId eq member.userId}">-->
				<div class="d-flex justify-content-center">
					<RouterLink :to="{ name: 'update', params: {id: board.articleId} }" style="text-decoration: none"><input type="button" class="btn text-white btn-outline-primary m-1" onclick='' value="수정하기"/></RouterLink> 
					<input id="article-delete" type="button" class="btn text-white btn-outline-primary m-1" @click="boardRemove" value = "삭제하기"/>
				</div> 

			<!-- </c:if>  -->
		</div>
	</div>
</template>

<style scoped>
#article_div{
    position: relative; 
	top: 1.5rem; 
	width: 47%;
}
</style>