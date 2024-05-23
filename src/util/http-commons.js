import axios from "axios";

const { VITE_VUE_API_URL } = import.meta.env;

function multipartAxios() {
    const instance = axios.create({
        baseURL: VITE_VUE_API_URL,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    instance.defaults.headers.common["Authorization"] = "";
    instance.defaults.headers.post["Content-Type"] = "application/json";
    instance.defaults.headers.put["Content-Type"] = "application/json";
    return instance;
}

// local vue api axios instance
function localAxios() {
    const instance = axios.create({
        baseURL: VITE_VUE_API_URL,
    });
    instance.defaults.headers.common["Authorization"] = "";
    instance.defaults.headers.post["Content-Type"] = "application/json";
    instance.defaults.headers.put["Content-Type"] = "application/json";

    return instance;
}

export { localAxios, multipartAxios };
