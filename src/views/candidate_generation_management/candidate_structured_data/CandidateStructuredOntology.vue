<template>
  <body>
  <el-card class="box-card">
    <el-button type="primary">同步</el-button>
    <el-button type="primary">请求</el-button>
  </el-card>
  <el-card class="data-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="本体类" name="first">
        <el-table
            :data="classTableData"
            border
            style="width: 100%">
          <el-table-column
              prop="guid"
              label="GUID"
              width="180">
          </el-table-column>
          <el-table-column
              prop="id"
              label="原ID"
              width="60">
          </el-table-column>
          <el-table-column
              prop="classId"
              label="类别ID"
              width="140">
          </el-table-column>
          <el-table-column
              prop="name"
              label="类别名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="pName"
              label="父类名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="time"
              label="时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="comment"
              label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="关系" name="second">
        <el-table
            :data="relationTableData"
            border
            style="width: 100%">
          <el-table-column
              prop="guid"
              label="GUID"
              width="180">
          </el-table-column>
          <el-table-column
              prop="id"
              label="原ID"
              width="60">
          </el-table-column>
          <el-table-column
              prop="headClass"
              label="头类别名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="关系名"
              width="180">
          </el-table-column>
          <el-table-column
              prop="tailClass"
              label="尾类别名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="time"
              label="时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="comment"
              label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="属性" name="third">
        <el-table
            :data="propertiesTableData"
            border
            style="width: 100%">
          <el-table-column
              prop="guid"
              label="GUID"
              width="180">
          </el-table-column>
          <el-table-column
              prop="id"
              label="原ID"
              width="60">
          </el-table-column>
          <el-table-column
              prop="name"
              label="属性名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="className"
              label="所属类别名称"
              width="180">
          </el-table-column>
          <el-table-column
              prop="time"
              label="时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="comment"
              label="备注">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  </body>
</template>

<script>
export default {
  name: "CandidateStructuredOntology",
  data() {
    return {
      activeName: 'first',
      classTableData: [{
        guid: '6F9619FF-8B86-D011-B42D-00C04FC964FF',
        id: 'c001',
        classId: '00',
        name: 'Thing',
        pName: 'null',
        time: '2023-02-13',
        comment: '根节点'
      }, {
        guid: '0BB58752-3780-8FCE-AD57-DA4567EAF736',
        id: 'C002',
        classId: '0001',
        name: '装备',
        pName: 'Thing',
        time: '2023-02-15',
        comment: '这是关于装备的类'
      }, {
          guid: '525BD20B-DD11-5206-214B-76AFF05DE33D',
          id: 'C003',
        classId: '0002',
          name: '人员',
          pName: 'Thing',
          time: '2023-02-15',
          comment: '这是关于人员的类'
        },{
        guid: '83CE61DE-E4AA-2576-1F6C-FE7AFB467CBC',
        id: 'C004',
        classId: '000101',
        name: '飞机',
        pName: '装备',
        time: '2023-02-15',
        comment: '这个类是装备的子类'
      },{
        guid: 'A8DC3295-BD1F-133D-1F12-ADD14D418245',
        id: 'C005',
        classId: '00010101',
        name: '轰炸机',
        pName: '飞机',
        time: '2023-02-15',
        comment: '这是关于轰炸机的类'
      }],
      relationTableData: [{
        guid: 'DF33F221-42BE-6DA3-8E76-A87DB5BC45D2',
        id: 'r001',
        headClass: '人员',
        name: '携带',
        tailClass: '装备',
        time: '2023-02-15',
        comment: '人员会携带装备'
      },{
        guid: '7810BB30-05D5-1BEA-2CED-66F1A23DDCA6',
        id: 'r002',
        headClass: '人员',
        name: '乘坐',
        tailClass: '飞机',
        time: '2023-02-15',
        comment: '人员会乘坐飞机'
      },{
        guid: '2C4AF7C3-7524-27C5-D2E1-6DD126737819',
        id: 'r003',
        headClass: '人员',
        name: '驾驶',
        tailClass: '轰炸机',
        time: '2023-02-15',
        comment: '空军飞行员驾驶轰炸机进行作战'
      }],
      propertiesTableData: [{
        guid: '38097109-C451-1F47-A83B-C06AE84E5C81',
        id: 'p001',
        name: '长度',
        className: '轰炸机',
        time: '2023-02-15',
        comment: '轰炸机有长度'
      },{
        guid: '371BE3CA-9952-B3BD-1336-7E64A5C7AC87',
        id: 'p002',
        name: '飞行高度',
        className: '飞机',
        time: '2023-02-15',
        comment: '飞机有飞行高度'
      },{
        guid: 'FD6705CF-2828-18FA-F008-13899F48D68F',
        id: 'p003',
        name: '携带弹药数量',
        className: '轰炸机',
        time: '2023-02-15',
        comment: '轰炸机会携带一定的弹药'
      }]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>
  .box-card {
    width: 99%;
    height: 70px;
  }

  .data-card{
    width: 99%;
    height: 700px;
    margin-top: 20px;
  }
</style>