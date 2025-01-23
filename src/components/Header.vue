<template>
    <header class="bg-italia-red text-white p-2">
        <h1 class="text-center text-lg font-bold">{{ title }} </h1>
    </header>
</template>
<script setup>

const props = defineProps({
    title: { type: String, required: true }
});

</script>