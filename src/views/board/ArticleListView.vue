<script setup>

</script>

<template>
	<div>
        <div class="position-relative">
            <div style="height: 280px"></div>
            <div class="mb-3 position-absolute top-50 start-50 translate-middle-x"
                id="board_div" style="position: relative; top: 1.5rem; width: 47%">
                <h4 class="d-flex justify-content-center"
                    style="overflow: hidden; white-space: nowrap">여행 정보를 공유해요</h4>

                <!-- board list area -->
                <div id="board-list" style="overflow: hidden; white-space: nowrap">
                    <div class="board__container" id="board-container">
						<RouterLink :to="{ name: 'write' }" style="text-decoration: none; color:#332D2D">
                        <button
                            class="btn btn-primary ms-auto me-3 d-flex justify-content-end mb-3"
                            style="overflow: hidden; white-space: nowrap" type="button"
                            onclick=''>
                            글쓰기</button>
						</RouterLink>
                        <!--  PAGE 및 검색으로 인해 추가 한 부분 -->
                        <form id="form-search" class="d-flex mb-2" action="">
                            <input type="hidden" name="action" value="list" /> <input
                                type="hidden" name="pgno" value="1" /> <select id="key"
                                name="key" class="form-select form-select-sm ms-5 me-1 w-50"
                                aria-label="검색조건">
                                <option selected>검색조건</option>
                                <option value="subject">제목</option>
                                <option value="user_id">작성자</option>
                            </select>
                            <div class="input-group input-group-sm">
                                <input id="word" name="word" type="text" class="form-control"
                                    placeholder="검색어..." />
                                <button id="btn-search" class="btn btn-dark" type="button">검색</button>
                            </div>
                        </form>
                        <!--  PAGE 및 검색으로 인해 추가 한 부분 -->
                        <table class="board-table">
                            <thead class="board__table-head">
                                <tr class="board__titles">
                                    <th class="board__column th-num col-2 col-sm-2">번호</th>
                                    <th class="board__column th-title col-4 col-sm-5">제목</th>
                                    <th class="board__column th-author col-2 col-sm-3">작성자</th>
                                    <th class="board__column th-date col-3 d-none d-md-block">작성일</th>
                                    <th class="board__column th-views col-1 col-sm-2">조회</th>
                                </tr>
                            </thead>
                            <tbody class="board__contents" id="board-body">
                                <!-- <c:forEach var="board" varStatus="status" items="${boards}">
                                    <tr>
                                        <td class="board__column col-2 col-sm-2">${boards.size() - status.index}</td>
                                        <th class="board__column col-4 col-sm-5"><a
                                            href="">${board.subject}</a></th>
                                        <td class="board__column col-2 col-sm-3">${board.userId}</td>
                                        <td class="board__column col-3 d-none d-md-block">${board.registerDate}</td>
                                        <td class="board__column col-1 col-sm-2">${board.hit}</td>
                                    </tr>
                                </c:forEach> -->
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
                    <div class="row mt-2"></div>
                    <!--  페이지 추가  -->
                </div>
            </div>
        </div>
        <form id="form-param" method="get" action="">
        <input type="hidden" id="p-action" name="action" value="">
        <input type="hidden" id="p-pgno" name="pgno" value="">
        <input type="hidden" id="p-key" name="key" value="">
        <input type="hidden" id="p-word" name="word" value="">
        </form>
    </div>
</template>

<style scoped>

</style>