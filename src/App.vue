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
* { 
    font-family: "Gowun Dodum", sans-serif;
    font-weight: 500;
    font-size: 18px;
    font-style: normal;
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
