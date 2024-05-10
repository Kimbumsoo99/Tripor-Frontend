<script setup>
import { onMounted, ref, watch } from "vue";
const { VITE_KAKAOMAP_KEY_JS } = import.meta.env;

// 메타 정보
const locationMap = {
    서울: { lat: 37.566535, lng: 126.977969 },
    인천: { lat: 37.4562557, lng: 126.7052062 },
    대전: { lat: 36.350412, lng: 127.384548 },
    대구: { lat: 35.8714354, lng: 128.601445 },
    광주: { lat: 35.1595454, lng: 126.8526012 },
    울산: { lat: 35.5383773, lng: 129.3113596 },
    세종특별자치시: { lat: 36.4801328, lng: 127.2891958 },
    경기도: { lat: 37.28101111, lng: 127.05 },
    강원도: { lat: 37.885352, lng: 127.729829 },
};

// 카카오 맵
const map = ref(null);
const container = ref(null);
const kakaoMapStatus = ref(false); // 카카오 맵 로드 확인

// 지도 표시
onMounted(() => {
    if (window.kakao && window.kakao.maps) {
        initMap();
    } else {
        const script = document.createElement("script");
        /* global kakao */
        script.onload = () => kakao.maps.load(initMap);
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${VITE_KAKAOMAP_KEY_JS}`;
        document.head.appendChild(script);
    }
});

// 카카오 맵 초기화
const initMap = () => {
    container.value = document.getElementById("map");
    const options = {
        center: new window.kakao.maps.LatLng(locationMap.서울.lat, locationMap.서울.lng),
        level: 5,
    };
    map.value = new kakao.maps.Map(container.value, options);
    kakaoMapStatus.value = true;
    // initKakaoObj();
};

// 마커 이미지
</script>

<template>
    <div id="map"></div>
</template>

<style>
#map {
    width: 2000px;
    height: 1000px;
    display: flex;
}

.customoverlay {
    position: relative;
    bottom: 85px;
    border-radius: 6px;
    border: 1px solid #ccc;
    border-bottom: 2px solid #ddd;
    float: left;
}
.customoverlay:nth-of-type(n) {
    border: 0;
    box-shadow: 0px 1px 2px #888;
}
.customoverlay a {
    display: block;
    text-decoration: none;
    color: #000;
    text-align: center;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    background: #d95050;
    background: #d95050
        url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat
        right 14px center;
}
.customoverlay .title {
    display: block;
    text-align: center;
    background: #fff;
    margin-right: 35px;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
}
.customoverlay:after {
    content: "";
    position: absolute;
    margin-left: -12px;
    left: 50%;
    bottom: -12px;
    width: 22px;
    height: 12px;
    background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
</style>
