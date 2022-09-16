<template>
  <div class="block" style="margin: 10px;">
    <el-timeline>
      <el-timeline-item timestamp="2022/4/12" placement="top">
        <el-card>
          <h4>军事图谱融合</h4>
          <p>张三 提交于 2022/4/12 20:46</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2022/4/3" placement="top">
        <el-card>
          <h4>军事图谱补充</h4>
          <p>李四提交于 2018/4/3 20:46</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2022/4/2" placement="top">
        <el-card>
          <h4>第三舰队图谱补充</h4>
          <p>王五 提交于 2022/4/2 20:46</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
export default {
  name: "MergeHistory"
}
</script>

<style scoped>

</style>