<script setup>
import KaKaoMap from "@/components/trip/KaKaoMap.vue";
</script>

<template>
    <div id="map_view" class="position-relative d-flex"><KaKaoMap /></div>
</template>

<style scoped>
#map_view{
    width: 100%; 
    height: 100%;
}
</style>
