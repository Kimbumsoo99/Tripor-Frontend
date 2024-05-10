<script setup>
import KaKaoMap from "@/components/trip/KaKaoMap.vue";
import AttractionLocate from "@/components/trip/AttractionLocate.vue";
</script>

<template>
    <div id="map_view"><KaKaoMap /></div>
    <AttractionLocate />
</template>

<style scoped>
#map_view {
    width: 100%;
    height: 100%;
    position: absolute; 
    top: 0; 
    left:0; 
}
</style>
