<script setup>
import AttractionInfo from "./AttractionInfo.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const { VITE_KAKAOMAP_KEY_JS } = import.meta.env;
const props = defineProps({ tourData: Array, region: String, planFlag: Boolean });

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

//커스텀 오버레이 추적 변수
const currentOverlay = ref(null);
const closeOverlay = (item = null) => {
    // 아이템 정보가 제공되었고, planItems 배열에서 아이템 검사
    // if (item && planItems.some((planItem) => planItem.title === item.title)) {
    //     // 아이템이 planItems 배열에 있다면 함수 종료
    //     return;
    // }

    // 아이템이 planItems 배열에 없거나, 아이템 정보가 제공되지 않았다면 기존 오버레이 숨김 로직 수행
    if (currentOverlay.value) {
        // currentOverlay.value.setMap(null); // 현재 오버레이 숨김
        currentOverlay.value = null; // 참조 제거
    }
};

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
// 마커 오버레이 상세보기.
const showPlaceDetail = (e, p) => {
    console.log(e, p);
    console.log("하이");
    const place = JSON.parse(decodeURIComponent(p));
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

        // <a onclick="showPlaceDetail(event, '${encodeURIComponent(JSON.stringify(item))}');"  href="#">
        //                         상세보기
        //                         </a>

        if (props.planFlag === true) {
            kakao.maps.event.addListener(marker, "click", () => {
                closeOverlay();
                currentOverlay.value = item;
                map.value.setCenter(position);
            });
        } else {
            kakao.maps.event.addListener(marker, "click", () => {
                closeOverlay();
                currentOverlay.value = item;
                map.value.setCenter(position);
                router.replace({ name: "content", params: { contentId: item.contentId } });
            });
        }

        marker.setMap(map.value);
        markers.value.push(marker);
        bounds.extend(position);
    }

    // close 버튼에 이벤트 등록
    const closeButton = document.querySelectorAll(".close");
    console.log(closeButton);
    // closeButton.addEventListener("click", () => {
    //     closeOverlay();
    // });
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
        console.log("내가 문제임");
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
    <div id="map">
        <RouterView :tourData="props.tourData" />
    </div>
</template>

<style>
#map {
    width: 100%;
    height: 100%;
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
    background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;
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

.wrap * {
    padding: 0;
    margin: 0;
}
.wrap .info {
    width: 286px;
    height: 120px;
    border-radius: 5px;
    border-bottom: 2px solid #ccc;
    border-right: 1px solid #ccc;
    overflow: hidden;
    background: #fff;
}
.wrap .info:nth-child(1) {
    border: 0;
    box-shadow: 0px 1px 2px #888;
}
.info .title {
    padding: 5px 0 0 10px;
    height: 30px;
    background: #eee;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
    font-weight: bold;
}
.info .close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #888;
    width: 17px;
    height: 17px;
    background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png");
}
.info .close:hover {
    cursor: pointer;
}
.info .body {
    position: relative;
    overflow: hidden;
}
.info .desc {
    position: relative;
    margin: 13px 0 0 90px;
    height: 75px;
}
.desc .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.desc .jibun {
    font-size: 11px;
    color: #888;
    margin-top: -2px;
}
.info .img {
    position: absolute;
    top: 6px;
    left: 5px;
    width: 73px;
    height: 71px;
    border: 1px solid #ddd;
    color: #888;
    overflow: hidden;
}
.info:after {
    content: "";
    position: absolute;
    margin-left: -12px;
    left: 50%;
    bottom: 0;
    width: 22px;
    height: 12px;
    background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
.info .link {
    color: #5085bb;
}
</style>
