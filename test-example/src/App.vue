<template>
  <div id="app">
    <VueSearchbox />
  </div>
</template>

<script>
import VueSearchbox from "vue-searchbox";

export default {
  name: "app",
  components: {
    VueSearchbox
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
