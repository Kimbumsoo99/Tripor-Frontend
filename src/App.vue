<script setup>
import Header from '@/components/layout/Header.vue';
import Aside from '@/components/layout/Aside.vue';
</script>

<template>
  <Header/>
  <Aside/>
  <RouterView/>
</template>

<style scoped>

</style>
<style>
@font-face {
    font-family: 'GangwonEduPowerExtraBoldA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEduPowerExtraBoldA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'SUIT-Regular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}
*{
    font-family: 'SUIT-Regular';
    font-size: 18px;
}
h4{
    color:#0077CC;
    font-weight:900;
}
h5{
    color:#0077CC;
    font-weight:700;
}
.form_group input {
    font-size: 15px;
    color: #222222;
    width: 300px;
    border: none;
    border-bottom: solid #aaaaaa 1px;
    padding-bottom: 20px;
    padding-left: 20px;
    position: relative;
    background: none;
    z-index: 5;
}

.form_group input::placeholder { color: #aaaaaa; }
.form_group input:focus { outline: none; }
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
