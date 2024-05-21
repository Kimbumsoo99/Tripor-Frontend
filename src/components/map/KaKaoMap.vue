<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AttractionInfo from "./AttractionInfo.vue";

const route = useRoute();
const router = useRouter();

const { VITE_KAKAOMAP_KEY_JS } = import.meta.env;
const props = defineProps({ tourData: Array, region: String, planFlag: Boolean, planList: Array, planDetailFlag: Boolean });
const emit = defineEmits(["markerClickEvent", "getTimeFromDistance"]);

const markers = ref([]);

window.onload = () => {
    if (props.planDetailFlag && props.tourData.length == 0) {
        return;
    }
    if (route.params && route.params.contentId) {
        router.push({ name: "home" });
        return;
    }
    console.log(props.tourData);
    // MyPlanDetailView.vue에서 새로고침하는경우 새롭게 마커 업데이트
    if (props.planDetailFlag) setTimeout(() => updateMapMarkers(props.tourData), 300);
    else updateMapMarkers(props.tourData);
};

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

const currentContent = ref("");
const contentList = ref([]);

//커스텀 오버레이 추적 변수
const currentOverlay = ref(null);
const currentMarker = ref(null);
const currentMarkerOverlay = ref(null);
const closeOverlay = async (item = null) => {
    // 아이템 정보가 제공되었고, planItems 배열에서 아이템 검사
    // if (item && planItems.some((planItem) => planItem.title === item.title)) {
    //     // 아이템이 planItems 배열에 있다면 함수 종료
    //     return;
    // }

    if (currentMarker.value) {
        const index = currentMarker.value;

        markers.value[index].marker.setMap(map.value);
        markers.value[index].selectedMarker.setMap(null);

        currentMarker.value = null;
    }

    // 아이템이 planItems 배열에 없거나, 아이템 정보가 제공되지 않았다면 기존 오버레이 숨김 로직 수행
    if (currentOverlay.value) {
        currentOverlay.value = null; // 참조 제거
    }
    if (currentMarkerOverlay.value) {
        currentMarkerOverlay.value.setMap(null); // 현재 오버레이 숨김
        currentMarkerOverlay.value = null;
    }
};

// 지도 표시
onMounted(async () => {
    if (window.kakao && window.kakao.maps) {
        initMap();
        if (props.planDetailFlag) setTimeout(() => updateMapMarkers(props.tourData), 300);
    } else {
        const script = document.createElement("script");
        /* global kakao */
        script.onload = () => kakao.maps.load(initMap);
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${VITE_KAKAOMAP_KEY_JS}`;
        document.head.appendChild(script);
    }
});

const toggleMarkers = (tour) => {
    if (currentMarkerOverlay.value) {
        closeOverlay();
        return;
    }
    movedMarkers(tour);
};

defineExpose({ toggleMarkers });

const findIndexByContentId = (contentId) => {
    return props.tourData.findIndex((item) => item.contentId === contentId);
};

const movedMarkers = (tour) => {
    if (props.planDetailFlag) {
        const position = new kakao.maps.LatLng(tour.latitude, tour.longitude);
        const content = `<div class="wrap">
                                <div class="info">
                                    <div class="title">
                                        ${tour.title}
                                    </div>
                                    <div class="body">
                                        <div class="img">
                                            <img src="${tour.firstImage ? tour.firstImage : "/src/assets/image/no_image_logo.png"}" width="80px" height="80px">
                                        </div>
                                        <div class="desc">
                                            <div class="ellipsis">주소: ${tour.addr ? tour.addr : "정보 없음"}</div>
                                            <div class="jibun ellipsis">전화번호: ${tour.tel ? tour.tel : "정보 없음"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        const overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: null,
            position: position,
        });

        currentMarkerOverlay.value = overlay;
        overlay.setMap(map.value);

        map.value.setCenter(position);

        return;
    }
    currentContent.value = tour;
    markers.value[currentMarker.value].selectedMarker.setMap(null);
    closeOverlay();

    const index = findIndexByContentId(tour.contentId);
    console.log(index);

    currentMarker.value = index;
    markers.value[index].selectedMarker.setMap(map.value);

    childRef.value.show(tour);
};

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

// 선분 관련
const currentPolyLine = ref(null);

const makePolyLine = (tourList) => {
    // 모든 선분 제거
    if (currentPolyLine.value) {
        currentPolyLine.value.setMap(null);
    }
    if (tourList.length > 1) {
        console.log();
        let polyPath = [];
        // 선분 다시 그리기
        const polyline = new kakao.maps.Polyline({
            // path: [new kakao.maps.LatLng(startItem.latitude, startItem.longitude), new kakao.maps.LatLng(endItem.latitude, endItem.longitude)],
            // 선분 스타일 설정
            strokeWeight: 3,
            strokeColor: "#db4040",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
        });
        for (let i = 0; i < tourList.length; i++) {
            polyPath.push(new kakao.maps.LatLng(tourList[i].latitude, tourList[i].longitude));
        }
        polyline.setPath(polyPath);
        polyline.setMap(map.value);
        currentPolyLine.value = polyline;
        emit("getTimeFromDistance", polyline.getLength().toFixed(2));
    }
};
// 선분 관련

watch(
    () => props.planList,
    (planItems) => {
        console.log(planItems);
        makePolyLine(planItems);
    },
    { deep: true }
);

const childRef = ref(null);
const contentId = ref(0);

const updateMapMarkers = async (tourList, oldTourList) => {
    if (tourList.length == 0) return;
    let bounds = new kakao.maps.LatLngBounds();
    let flag = false;

    for (let index = 0; index < tourList.length; index++) {
        const item = tourList[index];
        flag = true;
        const position = new kakao.maps.LatLng(item.latitude, item.longitude);

        const imageUrl = "src/assets/image/" + item.contentTypeId + ".png";
        const imageSize = new kakao.maps.Size(35, 35);
        const markerImage = new kakao.maps.MarkerImage(imageUrl, imageSize);
        const selectedMarkerImage = new kakao.maps.MarkerImage(imageUrl, new kakao.maps.Size(60, 60));
        const marker = new kakao.maps.Marker({
            position: position,
            image: markerImage,
        });
        const marker2 = new kakao.maps.Marker({
            position: position,
            image: selectedMarkerImage,
        });

        marker.setZIndex(-1);
        marker2.setZIndex(999999999);

        const content = `<div class="wrap">
                                <div class="info">
                                    <div class="title">
                                        ${item.title}
                                    </div>
                                    <div class="body">
                                        <div class="img">
                                            <img src="${item.firstImage ? item.firstImage : "src/assets/image/no_image_logo.png"}" width="80px" height="80px">
                                        </div>
                                        <div class="desc">
                                            <div class="ellipsis">주소: ${item.addr ? item.addr : "정보 없음"}</div>
                                            <div class="jibun ellipsis">전화번호: ${item.tel ? item.tel : "정보 없음"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

        const overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: null,
            position: position,
        });

        if (props.planFlag === true) {
            kakao.maps.event.addListener(marker, "click", () => {
                closeOverlay();

                currentOverlay.value = item;

                emit("markerClickEvent", item);
            });
            marker.setZIndex(-1);
            marker.setMap(map.value);
            markers.value.push(marker);
            console.log(markers.value);
        } else if (props.planDetailFlag === true) {
            const marker2 = new kakao.maps.Marker({
                position: position,
            });
            marker2.setMap(map.value);
            markers.value.push(marker2);
            kakao.maps.event.addListener(marker2, "click", () => {
                closeOverlay();
                currentMarkerOverlay.value = overlay;
                overlay.setMap(map.value);
                emit("markerClickEvent", item);
            });
            bounds.extend(position);
            continue;
        } else {
            kakao.maps.event.addListener(marker, "click", () => {
                closeOverlay();
                marker2.setMap(map.value);

                currentMarker.value = index;

                // setTimeout(() => {
                //     marker.setImage(markerImage);
                //     marker.setMap(map.value);
                //     marker.setZIndex(9999999999);
                // }, 100);

                // currentMarkerOverlay.value = overlay;
                // overlay.setMap(map.value);

                currentContent.value = item;

                currentOverlay.value = item;
                // map.value.setCenter(position);
                contentId.value = item.contentId;
                childRef.value.show(item);
                // router.replace({ name: "content", params: { contentId: item.contentId } });
            });
            kakao.maps.event.addListener(marker2, "click", () => {
                childRef.value.hide();
                closeOverlay();
            });
            marker.setZIndex(-1);
            marker.setMap(map.value);
            marker2.setMap(null);
            marker2.setZIndex(9999999999);
            markers.value.push({ marker, selectedMarker: marker2 });
        }

        bounds.extend(position);
    }

    if (props.planDetailFlag) {
        makePolyLine(tourList);
    }
    if (flag !== false) {
        // 모든 마커가 포함되도록 지도의 중심과 줌 레벨 조정
        map.value.setBounds(bounds);
    } else {
        alert("해당 관광 정보 지역이 없습니다.");
        updateMapMarkers(oldTourList);
    }
};

watch(
    () => props.tourData,
    async (tourList, oldTourList) => {
        if (tourList.length == 0) return;
        if (props.planFlag) {
            markers.value.forEach((marker) => {
                marker.setMap(null);
            });
        } else if (props.planDetailFlag) {
            markers.value.forEach((marker) => {
                marker.setMap(null);
            });
        } else {
            markers.value.forEach((marker) => {
                marker.marker.setMap(null);
                marker.selectedMarker.setMap(null);
            });
        }
        markers.value = [];
        await updateMapMarkers(tourList, oldTourList);
    }
    // { deep: true }
);

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

const mergeSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex].distance < right[rightIndex].distance) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

const sortList = computed(() => {
    return mergeSort(contentList.value).slice(1, 4);
});

watch(
    () => currentContent.value,
    () => {
        const placeSaveList = [];
        props.tourData.forEach((i, index) => {
            let distance = Math.sqrt(Math.pow(i.latitude - currentContent.value.latitude, 2) + Math.pow(i.longitude - currentContent.value.longitude, 2));

            let placeSave = i;
            placeSave.distance = distance;
            placeSave.index = index;

            placeSaveList.push(placeSave);
        });
        contentList.value = placeSaveList;
    },
    { immediate: true }
);
</script>

<template>
    <div id="map">
        <AttractionInfo ref="childRef" :sortList="sortList" :tourData="props.tourData" @close-overlay="closeOverlay" @moved-markers="movedMarkers" />
        <!-- <RouterView :tourData="props.tourData" @close-overlay="closeOverlay" @moved-markers="movedMarkers" /> -->
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
