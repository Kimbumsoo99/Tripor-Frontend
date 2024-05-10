<script setup>
import KaKaoMap from "@/components/map/KaKaoMap.vue";
import AttractionLocate from "@/components/plan/AttractionLocate.vue";
</script>

<template>
    <div id="map_view" class="position-relative d-flex"><KaKaoMap /></div>
    <AttractionLocate />
</template>

<style scoped>
#map_view {
    width: 100%;
    height: 100%;
}
</style>
