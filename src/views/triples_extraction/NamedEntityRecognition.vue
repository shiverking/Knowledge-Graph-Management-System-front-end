<template>
  <el-tabs v-model="activeName" @tab-click="handleClick"  type="card" style="margin-top: 20px;">
    <el-tab-pane label="手动添加" name="first">
        <el-input
        type="textarea"
        :rows="5"
        placeholder="格式要求：句子之间用逗号隔开"
        v-model="textarea">
        </el-input>
          <el-button style="margin-top: 10px;" @click="next">输入完成</el-button>
        <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-top: 20px;">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="sentence"
              label="待抽取句子"
              width="800">
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
        </template>
          <el-button style="margin-top: 10px;" @click="next">筛选完毕</el-button>
    </el-tab-pane>
    <el-tab-pane label="文件导入" name="second">
        <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">选取文件</el-button>
        </el-upload>
        <p style="margin-top: 10px;"><font size="3">格式要求：待抽取语句以句号隔开，只接受.txt/.csv文件</font></p>
          <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-top: 20px;">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="sentence"
              label="待抽取句子"
              width="800">
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
        </template>
          <el-button style="margin-top: 10px;" @click="next">筛选完毕</el-button>
    </el-tab-pane>
    <el-tab-pane label="数据库导入" name="third">
        <el-select v-model="value1" multiple placeholder="选择数据库">
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
            style="margin-left: 20px;"
            placeholder="选择表">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button style="margin-left: 20px;">读取三元组</el-button> 
        <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-top: 20px;">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="sentence"
              label="待抽取句子"
              width="800">
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
        </template>
          <el-button style="margin-top: 10px;" @click="next">筛选完毕</el-button>
    </el-tab-pane>
    <el-tab-pane label="抽取实体" name="fourth">
               <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%; margin-top: 20px;">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              fixed
              prop="sentence"
              label="待抽取句子"
              width="800">
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
        </template>
          <el-button style="margin-top: 10px;" @click="next">开始抽取</el-button>
    <template>
    <el-table
        :data="tableData2"
        border
        style="width: 100%; margin-top: 20px;">
        <el-table-column
        label="日期"
        width="180">
        <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        </el-table-column>
        <el-table-column
        label="三元组"
        width="500">
        <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
            <p>头实体: {{ scope.row.head }}</p>
            <p>头实体类型: {{ scope.row.head_typ }}</p>
            <p>尾实体: {{ scope.row.tail }}</p>
            <p>尾实体类型: {{ scope.row.tail_typ }}</p>
            <p>关系: {{ scope.row.rel }}</p>
            <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.head }}</el-tag>
                <el-tag size="medium">{{ scope.row.head_typ }}</el-tag>
                <el-tag size="medium">{{ scope.row.tail }}</el-tag>
                <el-tag size="medium">{{ scope.row.tail_typ }}</el-tag>
            </div>
            </el-popover>
        </template>
        </el-table-column>
        <el-table-column
        label="所属类别"
        width="180">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.conflict_typ }}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    </template>
          <el-button style="margin-top: 10px;" @click="next">保存结果</el-button>
    </el-tab-pane>
      </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first',
        tableData: [{
          date: '2016-05-03',
          sentence: '近日，至少已拖期三次的美国“福特”号航母，即将正式入役美国海军。',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          sentence: '众所周知，现役的“尼米兹”级核动力航母装设有A4W核动力装置。',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },],
        tableData2: [{
          date: '2016-05-02',
          head: '“福特号”航母',
          head_typ: '航空母舰',
          tail: '美国海军',
          tail_typ: '机构',
          conflict_typ: '装备图谱'
        }, {
          date: '2016-05-02',
          head: '“尼米兹”级核动力航母',
          head_typ: '航空母舰',
          tail: 'A4W核动力装置',
          tail_typ: '装备',
          conflict_typ: '装备图谱'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    },

    methods: {
      next() {
        if (this.active++ > 2) this.active = 0;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    }
  }
</script>