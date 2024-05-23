import { localAxios, multipartAxios } from "@/util/http-commons";

const local = localAxios();
const multipart = multipartAxios();

function listArticle(param, success, fail) {
    local.get(`/article`, { params: param }).then(success).catch(fail);
}

async function insertImage(image, success, fail) {
    const formData = new FormData();
    formData.append("image", image);
    await multipart.post(`/article/image`, formData).then(success).catch(fail);
}

function deleteImage(image, success, fail) {
    local.delete(`/article/image/${image}`, image).then(success).catch(fail);
}

function detailArticle(articleId, success, fail) {
    local.get(`article/${articleId}`).then(success).catch(fail);
}

function registArticle(article, images, success, fail) {
    console.log("boardjs article", article);
    console.log("image", images);

    const articlePostDto = { articleDto: article, fileInfos: images };
    console.log(articlePostDto);
    local
        .post(`/article`, {
            articleDto: article,
            fileInfos: images,
        })
        .then(success)
        .catch(fail);
}

async function getModifyArticle(articleno, success, fail) {
    console.log("getModifyArticle");
    await local.get(`/article/${articleno}`).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
    console.log(article);
    local.put(`/article`, article).then(success).catch(fail);
}

// function deleteArticle(articleno, success, fail) {
//     local.delete(`/board/${articleno}`).then(success).catch(fail);
// }

export { insertImage, deleteImage, listArticle, detailArticle, registArticle, getModifyArticle, modifyArticle };
