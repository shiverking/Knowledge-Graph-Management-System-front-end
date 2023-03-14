<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body{
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  
}
</style>
