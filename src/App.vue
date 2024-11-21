<template>
  <div class="min-h-screen bg-italia-red">
    <ConnectionAlert />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import ConnectionAlert from './components/ConnectionAlert.vue'
</script>
