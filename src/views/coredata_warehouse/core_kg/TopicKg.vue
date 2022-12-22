<template>
  <!--分类查找-->
  <div>
    <!--选择库 -->
    <el-select v-model="value" placeholder="请选择库" style="display: block">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>

    <!--主题选择-->
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
    </el-checkbox-group>
    <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
    ></el-autocomplete>
    <el-button @click="clearFilter">查找</el-button>
    <el-button type="primary" size="medium">生成新图谱</el-button>
    <el-button @click="resetDateFilter" style="display: inline-block;">清除日期过滤器</el-button>
    <el-button @click="clearFilter" style="margin-left: 0px;margin-top:5px;display: inline-block">清除所有过滤器</el-button>
    <el-table
        ref="filterTable"
        :data="tableData"
        style="width: 100%;margin-top: 10px;"
        border
        key="version_table"
    >
      <el-table-column
          prop="id"
          label="ID"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
      >
      </el-table-column>
      <el-table-column
          prop="tag"
          label="标签"

          :filters="[{ text: '单位', value: '家' }, { text: '公司', value: '公司' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.tag === '家' ? 'primary' : 'success'"
              disable-transitions>{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="date"
          label="最后修改时间"
          sortable
          column-key="date"
          :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
          :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="drawer=true">查看详情</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes=pageSizes
        :page-size=pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
    </el-pagination>
    <el-drawer
        title="简略信息"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">
      <div class="block" style="margin: 10px">
        <TwoDViewSmall></TwoDViewSmall>
      </div>
      <el-descriptions  direction="horizontal" :column="1" border style="margin: 10px;">
        <el-descriptions-item label="图谱名称">第十一舰队打击群</el-descriptions-item>
        <el-descriptions-item label="节点个数">1810</el-descriptions-item>
        <el-descriptions-item label="分类"><el-tag size="small">舰队</el-tag></el-descriptions-item>
      </el-descriptions>
      <el-button type="primary" style="margin: 10px;">查看详情</el-button>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "TopicKg",
  data:{
    return:{
      tableData: [{
        date: '2022-08-04',
        id: '52a75fce',
        name: '第十一航母打击群',
        tag: '打击群'
      }, {
        date: '2021-07-19',
        id:'6b1a790e',
        name: '第十二航母打击群',
        tag: '打击群'
      }, {
        date: '2022-10-3',
        id: 'fd4c1b89'  ,
        name: '第七舰载机联队',
        tag: '联队'
      }, {
        date: '2022-4-23',
        id: 'a2db27c3' ,
        name: '第五战斗机编队',
        tag: '编队'
      }],
    }
  }
}
</script>

<style scoped>

</style>