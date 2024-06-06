<template>
  <v-app class="container1">
    <v-main>
      <Navbar @changePage="setPage"></Navbar>
      <component :is="page" class="mx-4 md-4"></component>
    </v-main>
  </v-app>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import Navbar from './components/Navbar.vue';
import POS from './components/pos/Pos.vue';
import Payments from './components/payments/Pay.vue';

// Define the components
const page = ref('POS');
const components = {POS, Payments};

// Method to set the current page
const setPage = (newPage) => {
  page.value = newPage;
};

// Method to remove Frappe navigation
const removeFrappeNav = () => {
  // Simulate jQuery actions with vanilla JS
  document.querySelectorAll('.page-head, .navbar.navbar-default.navbar-fixed-top').forEach(el => el.remove());
};

// Lifecycle hooks
onMounted(() => {
  removeFrappeNav();
  setTimeout(removeFrappeNav, 1000);
});
</script>

<style scoped>
.container1 {
  margin-top: 0px;
}
</style>
