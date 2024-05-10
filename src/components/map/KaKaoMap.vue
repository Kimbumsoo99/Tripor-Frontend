<script setup>
import { onMounted, ref, watch } from "vue";
const { VITE_KAKAOMAP_KEY_JS } = import.meta.env;
const props = defineProps({ tourData: Array, region: String });

const markers = ref([]);

watch(
    () => props.tourData,
    async (tourList, oldTourList) => {
        console.log(tourList);
        if (tourList.length == 0) return;
        markers.value.forEach((marker) => {
            marker.setMap(null);
        });
        markers.value = [];
        await updateMapMarkers(tourList, oldTourList);
    }
);
// 메타 정보
const locationMap = {
    서울: { lat: 37.5666103, lng: 126.9783882 },
    인천: { lat: 37.4559418, lng: 126.7051505 },
    대전: { lat: 36.3504396, lng: 127.3849508 },
    대구: { lat: 35.87139, lng: 128.601763 },
    광주: { lat: 35.160032, lng: 126.851338 },
    부산: { lat: 35.179816, lng: 129.0750223 },
    울산: { lat: 35.5394773, lng: 129.3112994 },
    세종특별자치시: { lat: 36.4803512, lng: 127.2894325 },
    경기도: { lat: 37.4363177, lng: 127.550802 },
    강원특별자치도: { lat: 37.8603672, lng: 128.3115261 },
    충청북도: { lat: 36.7853718, lng: 127.6551404 },
    충청남도: { lat: 36.6173379, lng: 126.8453965 },
    경상북도: { lat: 36.6308397, lng: 128.962578 },
    경상남도: { lat: 35.4414209, lng: 128.2417453 },
    전북특별자치도: { lat: 35.6910153, lng: 127.2368291 },
    전라남도: { lat: 34.9007274, lng: 126.9571667 },
    제주도: { lat: 33.4273366, lng: 126.5758344 },
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

const updateMapMarkers = async (tourList, oldTourList) => {
    let bounds = new kakao.maps.LatLngBounds();
    let flag = false;

    for (const item of tourList) {
        flag = true;
        const position = new kakao.maps.LatLng(item.latitude, item.longitude);

        const imageUrl = "src/assets/image/" + item.contentTypeId + ".png";
        const imageSize = new kakao.maps.Size(45, 45);
        const markerImage = new kakao.maps.MarkerImage(imageUrl, imageSize);
        const marker = new kakao.maps.Marker({
            position: position,
            image: markerImage,
        });

        const content = `<div class="wrap">
                                <div class="info">
                                    <div class="title">
                                        ${item.title}
                                        <div class="close" onclick="currentOverlay.setMap(null);" title="닫기"></div>
                                    </div>
                                    <div class="body">
                                        <div class="img">
                                            <img src="${
                                                item.firstImage
                                                    ? item.firstImage
                                                    : "@/assets/image/no_image.jpg"
                                            }" width="80px" height="80px">
                                        </div>
                                        <div class="desc">
                                            <div class="ellipsis">주소: ${
                                                item.addr ? item.addr : "정보 없음"
                                            }</div>
                                            <div class="jibun ellipsis">전화번호: ${
                                                item.tel ? item.tel : "정보 없음"
                                            }</div>
                                            <div>
                                                상세보기
                                                    </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        // <a onclick="showPlaceDetail(event, '${encodeURIComponent(JSON.stringify(item))}');"  href="#">
        //                         상세보기
        //                         </a>

        const overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: null,
            position: position,
        });
        // kakao.maps.event.addListener(marker, "click", () => {
        //     closeOverlay();
        //     overlay.setMap(map);
        //     currentOverlay = overlay;
        //     map.setCenter(position);
        // });

        marker.setMap(map.value);
        markers.value.push(marker);
        bounds.extend(position);
    }
    // 모든 마커가 포함되도록 지도의 중심과 줌 레벨 조정
    if (flag !== false) {
        map.value.setBounds(bounds);
    } else {
        alert("해당 관광 정보 지역이 없습니다.");
        updateMapMarkers(oldTourList);
    }
};

// 마커 이미지

// 시도 변화 확인
watch(
    () => props.region,
    (name) => {
        setMapCenter(name);
    }
);

// 맵 중간 좌표 이동 함수
const setMapCenter = (sido) => {
    const moveLatLon = new kakao.maps.LatLng(locationMap[sido].lat, locationMap[sido].lng);
    map.value.setCenter(moveLatLon);
    if (sido == "경기도") {
        map.value.setLevel(11);
    } else {
        map.value.setLevel(8);
    }
};
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
