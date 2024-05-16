import { localAxios } from "@/util/http-commons";
import axios from "axios";

const local = localAxios();

function listArticle(param, success, fail) {
    console.log("listArticle");
    console.log(param);
    local.get(`/board`, { params: param }).then(success).catch(fail);
}

function detailArticle(articleno, success, fail) {
    local.get(`/board/${articleno}`).then(success).catch(fail);
}

function registArticle(article, images, success, fail) {
    console.log("boardjs article", article);
    console.log("image", images);

    const formData = new FormData();

    // Add image file to FormData
    // formData.append("image", image);
    // Add images to FormData
    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]); // Note: using "images" to allow multiple files with the same key
        }
    }

    // Add BoardDto fields to FormData as JSON
    formData.append("article", new Blob([JSON.stringify(article)], { type: "application/json" }));

    axios
        .post(`http://localhost/article`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(success)
        .catch(fail);
}

function getModifyArticle(articleno, success, fail) {
    console.log("getModifyArticle");
    local.get(`/article/${articleno}`).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
    local.put(`/board`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteArticle(articleno, success, fail) {
    local.delete(`/board/${articleno}`).then(success).catch(fail);
}

export { listArticle, detailArticle, registArticle, getModifyArticle, modifyArticle, deleteArticle };
