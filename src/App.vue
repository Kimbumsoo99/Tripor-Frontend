<script setup>
import Header from '@/components/layout/Header.vue';
import Aside from '@/components/layout/Aside.vue';
</script>

<template>
  <Header/>
  <Aside/>
</template>

<style scoped>

</style>
<style>
* { 
    font-family: "Gowun Dodum", sans-serif;
    font-weight: 500;
    font-size: 18px;
    font-style: normal;
  }
.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
    background-color: #0077CC !important;
}
.btn-outline-primary, .btn-outline-primary:hover, .btn-outline-primary:active, .btn-outline-primary:visited{
    background-color: white !important;
    color: #0077CC !important;
}
.text-primary{
    color:#0077CC;
}
</style>
