<template>
    <div id="app">
        <img alt="MediaCube logo" src="./assets/logo.png" />
        <hello-world msg="Welcome to Your Vue.js App" />
        <mc-title variation-s="h1" variation="h4" color="purple" weight="bold" max-width="100%">
            <template #icon-prepend>icon</template>
        </mc-title>
    </div>
</template>

<script>
import HelloWorld from './service/HelloWorld.vue'
import McTitle from '../src/elements/McTitle/McTitle.vue'

export default {
    name: 'App',
    components: {
        McTitle,
        HelloWorld,
    },
}
</script>

<style lang="scss">
@import 'src/styles/global.scss';
@import 'src/styles/main.scss';
body,
html {
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    height: 100%;
}
</style>
