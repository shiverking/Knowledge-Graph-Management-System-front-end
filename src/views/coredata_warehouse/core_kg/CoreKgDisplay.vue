<template>
  <!--主图谱-->
<!--    <div class="area-left">-->
<!--      &lt;!&ndash;数据概览&ndash;&gt;-->
<!--      <el-card class="box-card card" style="height:200px;">-->
<!--        <h3 class="card_label">主要数据概览</h3>-->
<!--        <el-row :gutter="12" class="main_data_row">-->
<!--          <el-col :span="8">-->
<!--            <el-card shadow="hover">-->
<!--              节点数:-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-card shadow="hover">-->
<!--              边数:-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-card shadow="hover">-->
<!--              子图谱数:-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row :gutter="12" class="main_data_row">-->
<!--          <el-col :span="8">-->
<!--            <el-card shadow="hover">-->
<!--              实体个数:-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-card shadow="hover">-->
<!--              更新次数:-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="8">-->
<!--            <el-card shadow="hover">-->
<!--              最后更新时间:-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-card>-->
<!--      &lt;!&ndash;数据流&ndash;&gt;-->
<!--      <el-card class="box-card card" style="height:400px;" id="data_flow">-->
<!--      </el-card>-->
<!--      <div id = "limit_preview" style="height:600px;width: auto;">-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="area-right">-->
<!--      &lt;!&ndash;更新记录&ndash;&gt;-->
<!--      <el-card class="box-card card" style="height:500px;">-->
<!--        <h3 class="card_label">更新记录</h3>-->
<!--        <el-timeline style="padding: 10px;">-->
<!--          <el-timeline-item-->
<!--              v-for="(activity, index) in activities"-->
<!--              :key="index"-->
<!--              :timestamp="activity.timestamp">-->
<!--            {{activity.content}}-->
<!--          </el-timeline-item>-->
<!--        </el-timeline>-->
<!--      </el-card>-->
<!--      &lt;!&ndash;待更新版本&ndash;&gt;-->
<!--      <el-card class="box-card card" style="height:auto;">-->
<!--        <h3 class="card_label">待更新版本</h3>-->
<!--        <el-card shadow="never" class="to_update">-->
<!--          待更新版本1-->
<!--        </el-card>-->
<!--        <el-card shadow="never" class="to_update">-->
<!--          待更新版本2-->
<!--        </el-card>-->
<!--        <el-card shadow="never" class="to_update">-->
<!--          待更新版本3-->
<!--        </el-card>-->
<!--      </el-card>-->
<!--    </div>-->
</template>

<script>
export default {
  name: "core_kg_display"
}
</script>

<style scoped>

</style>