<template>
  <div style="margin-top: 20px;">
    <el-card class="box-card" shadow="never">
      <p><b>训练模型</b></p>
      <el-select v-model="value1" multiple placeholder="选择模型" style="margin-top">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="value2"
        multiple
        collapse-tags
        style="margin-right:10px;"
        placeholder="选择候补数据集">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary">训练新模型</el-button>
      <el-progress :percentage="100" :format="format" :width="50" style="margin-top:10px"></el-progress>
    </el-card>
    <el-card class="box-card" shadow="never" style="margin-top:10px">
      <div class="block">
        <p><b>补全模型</b></p>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%;">
        <el-table-column
          fixed
          prop="date"
          label="训练时间"
          width="150">
        </el-table-column>
        <el-table-column
          fixed
          prop="model_name"
          label="补全模型名称"
          width>
        </el-table-column>
        <el-table-column
          fixed
          prop="num_of_triple"
          label="三元组数目"
          width>
        </el-table-column>
        <el-table-column
          fixed
          prop="hits"
          label="Hits@10评估"
          width>
        </el-table-column>
        <el-table-column
          label="操作"
          width>
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      background
      layout="prev, pager, next"
      style="margin-top:10px"
      :total="1000">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        message: ' model2_TransE_2022_10_7_21_45.h5',
        options: [{
          value: '选项1',
          label: '全部'
        }, {
          value: '选项2',
          label: '补全成功'
        }, {
          value: '选项3',
          label: '补全失败'
        }],
        tableData: [{
        date: '2016-05-03',
        model_name: 'model2_TransE_2022_10_7_21_45.h5',
        num_of_triple: '12131',
        hits: '0.2332',
      }, {
        date: '2015-05-03',
        model_name: 'model2_TransE_2022_10_1_21_45.h5',
        num_of_triple: '8756',
        hits: '0.2432',
      }, {
        date: '2015-01-03',
        model_name: 'model2_TransE_2022_9_1_21_45.h5',
        num_of_triple: '4756',
        hits: '0.3432',
      },],
        tableData2: [{
          date: '2016-05-02',
          head: '约翰·保罗·琼斯号导弹驱逐舰',
          head_typ: '驱逐舰',
          tail: '台湾',
          tail_typ: '国家',
          rel: '产国',
          conflict_typ: '0.38767',
          result: '补全失败'
        }, {
          date: '2016-05-04',
          head: '普林斯顿号导弹巡洋舰',
          head_typ: '巡洋舰',
          tail: '英格尔斯造船',
          tail_typ: '制造厂',
          rel: '制造厂',
          conflict_typ: '0.88767',
          result: '补全成功'
        }, {
          date: '2016-05-01',
          head: '约书亚·温克',
          head_typ: '人物',
          tail: '尼米兹号航空母舰',
          tail_typ: '航空母舰',
          rel: '指挥军舰',
          conflict_typ: '0.83767',
          result: '补全成功'
        },]
      }
    },
    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
    }
  }
</script>