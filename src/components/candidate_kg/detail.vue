<template>
  <div>
    <h3>测试detail</h3>
    <p>{{this.myName}}</p>
  </div>
</template>

<script>
export default {
  name: "detail",
  props: ['myName'],
  data(){
    return {
      name:this.myName
    }
  },
  watch: {
    myName(newVal) {
      this.name = newVal //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    }
  },
}
</script>

<style scoped>

</style>