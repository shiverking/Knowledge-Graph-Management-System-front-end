<template>
  <div style="margin-top: 20px;">
    <el-select v-model="algoritm_value" placeholder="请选择算法,默认为Casrel">
      <el-option
          v-for="item in algoritm_options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" @click="triples_extraction" style="margin:5px;" plain>开始抽取</el-button>
    <el-button type="info" plain icon="el-icon-zoom-in" style="margin:5px;" @click="viewResult()">预览</el-button>
    <el-popover
        placement="top"
        v-model="confirmExportVisible">
      <p>要将抽取结果导出至候选三元组库吗？</p>
      <div style="text-align: right; margin: 5px;">
        <el-button size="mini" type="text" @click="confirmExportVisible = false">取消</el-button>
        <el-button type="success" size="mini" @click="confirmExportVisible = false;confirmExport()">确定</el-button>
      </div>
    <el-button  plain type="success" icon="el-icon-upload2" style="margin:10px;" slot="reference">结果导出</el-button>
    </el-popover>
    <el-button  plain type="danger"  style="margin:5px;" @click="isStop=true">停止抽取</el-button>
    <el-progress v-show="progressBarVisible" :percentage="progressBarValue" :format="format"></el-progress>
    <el-dialog
        title="抽取结果"
        :visible.sync="dialogVisible"
        width="70%">
      <el-card shadow="always"  class="triples_card_top_half">
        <h4 class="triples_label">抽取结果</h4>
        <el-table
            :data="extractTablePageList"
            style="width: 100%">
          <el-table-column
              prop="head"
              label="头实体"
          >
          </el-table-column>
          <el-table-column
              prop="rel"
              label="关系"
          >
          </el-table-column>
          <el-table-column
              prop="tail"
              label="尾实体"
          >
          </el-table-column>
        </el-table>
        <el-pagination
            small
            layout="prev, pager, next"
            @current-change="extractTableCurrentChange"
            :current-page.sync="extractTableCurrrentPage"
            :page-size="extractTablePageSize"
            :total="extract_table.length">
        </el-pagination>
      </el-card>
      <el-card shadow="always"  class="triples_card_bottom_half">
        <h4 class="triples_label">三元组预览</h4>
        <div id="triples_show" style="height: 500px;width: auto" >
          <el-empty description="暂无预览" :image="noData"></el-empty></div>
      </el-card>
    </el-dialog>
    <!--内容预览-->
    <el-dialog title="内容" :visible.sync="contentVisible" top="7vh" width="70%">
      <el-input :rows="20" v-model="content" type="textarea" style="width: 100%" :readonly="true" ></el-input>
    </el-dialog>
    <el-table
        ref="multipleTable"
        :data="unstructuredTextPageList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        v-loading="tableLoading"
        element-loading-text="结果导出中"
    >
      <el-table-column
          type="selection"
          :reserve-selection="true"
          :selectable="selectable"
          width="55">
      </el-table-column>
      <el-table-column
          label="标题"
          width="400"
          show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.title}}</template>
      </el-table-column>
      <el-table-column
          label="内容">
        <template slot-scope="scope">
          <el-button type="text" @click = "displayContent(scope.row.content)">查看</el-button></template>
      </el-table-column>
      <el-table-column
          label="状态"
          :filters="[{ text: '已抽取', value: '已抽取' }, { text: '未抽取', value: '未抽取' }]"
          :filter-method="filterStatus"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image v-if="scope.row.status=='未抽取'" style="width: 25px; height: 25px;overflow: initial"
                    :src="discard" ></el-image>
          <el-image v-if="scope.row.status=='已抽取'"style="width: 25px; height: 25px;overflow: initial"
                    :src="success" ></el-image>
          {{ scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.create_time!=null">{{scope.row.create_time}}</span>
          <span v-if="scope.row.create_time==null">暂无</span>
        </template>
      </el-table-column>
      <el-table-column
          label="来源" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.origin}}</template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="unstructuredTextHandleSizeChange"
        @current-change="unstructuredTextHandleCurrentChange"
        :current-page="unstructuredTextCurrentPage"
        :page-sizes="unstructuredTextPageSizes"
        :page-size="unstructuredTextPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="unstructuredTextTotal">
    </el-pagination>
  </div>
</template>
<style>
.triples_label{
  margin: 0px;
}
.triples_card{
  margin-top: 10px;
  margin-bottom: 10px;
}
.triples_card_top_half{
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}
.triples_card_bottom_half{
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
.triples_result{
  word-break: normal;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
<script>
  import * as echarts from 'echarts';
  import noData from "@/assets/icon/no_data.png"
  import discard from "@/assets/icon/discard.png"
  import success from "@/assets/icon/success.png"
  export default {
    data() {
      return {
        success:success,
        discard:discard,
        noData:noData,
        //加载
        loading:false,
        activeName: 'first',
        fileList: [],
        //三元组抽取数据
        extract_table:[],
        extract_ids:[],
        dialogVisible:false,
        //非结构文本分页
        unstructuredTextPageList: [],
        unstructuredTextCurrentPage: 1,
        unstructuredTextTotal: 1,
        unstructuredTextPageSize: 10,
        unstructuredTextPageSizes: [10, 50, 100, 200],
        //查看内容
        contentVisible:false,
        content:"",
        //多选框
        multipleSelection: [],
        //进度条数值
        progressBarValue:0,
        algoritm_options: [{
          value: 'Casrel',
          label: 'Casrel'
        }],
        algoritm_value:'',
        progressBarVisible:false,
        //前端分页
        extractTableCurrrentPage:1,
        extractTablePageSize:10,
        extractTablePageList:[],
        //确认导出
        confirmExportVisible:false,
        //表格加载
        tableLoading:false,
        //是否停止抽取
        isStop:false,
      };
    },
    methods: {
      // 三元组抽取
      async triples_extraction(){
        if(this.multipleSelection.length==0){
          this.$message({
            message: '请选择文本进行抽取',
            type: 'warning'
          });
          return;
        }
        this.extract_table = [];
        this.extract_ids = [];
        this.progressBarVisible = true;
        this.progressBarValue = 0;
        var ids = [];
        var sum = this.multipleSelection.length;
        var counter  = 0;
        for (const ele of this.multipleSelection) {
          if(this.isStop==true){
             break;
          }
          const index = this.multipleSelection.indexOf(ele);
          var id = ele._id;
          //axios请求
          await axios.post('/pythonApi/triple_extraction', {
            // data: this.extract_data,
            data: id,
          })
              .then((response) => {
                if (response.status == 200) {
                  counter++;
                  this.progressBarValue = Math.floor((counter/sum)*100);
                  //赋值给表格
                  response.data.data.tuples.forEach((item,i)=>{
                    this.extract_table.push(item);
                  })
                  this.extract_ids.push(response.data.data._id);
                }
              })
              .catch(function (error) {
                console.log(error)
              })
            if(this.progressBarValue==100){
              this.$notify({
                title: 'SUCCESS',
                message: '抽取完成!',
                type: 'success'
              });
            }
        }
        if(this.isStop==true){
          this.isStop = false;
          this.$notify.error({
            title: '抽取中止',
            message: '已停止抽取'
          });
          this.progressBarValue=0;
          return;
        }
        this.getExtractTablePageList();
        setTimeout(()=>{this.progressBarVisible = false;},2000);
      },
      //三元组展示
      show_triples(arr){
        var chartDom = document.getElementById('triples_show');
        var myChart = echarts.init(chartDom);
        myChart.hideLoading();
        var webkitDep = this.genrateData(arr);
        var option = {
          legend: {
            x: 'left',//图例位置
            //图例的名称
            //此处的数据必须和关系网类别中name相对应
            data: webkitDep.categories.map(function (a) {
              return a.name;
            })
          },
          series: [{
            type: 'graph',
            layout: 'force',
            symbolSize: 20,
            roam: true,
            // animation: false,
            label: {
              normal: {
                show:true,
                position: 'right'
              }
            },
            //展示边数据
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            edgeSymbol: ["circle", "arrow"],
            draggable: true,
            force: {
              layoutAnimation:true,
              // xAxisIndex : 0, //x轴坐标 有多种坐标系轴坐标选项
              // yAxisIndex : 0, //y轴坐标
              gravity:0.03,  //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
              edgeLength: 55,  //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
              repulsion: 150  //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
            },
            data: webkitDep.nodes.map(function (node, idx) {  //node数据
              node.id = idx;
              return node;
            }),
            categories: webkitDep.categories,  //关系网类别，可以写多组
            edges: webkitDep.links  //link数据
          }]
        };
        myChart.setOption(option);
      },
      //生成三元组展示图所需数据
      genrateData(arr){
        var data = {};
        var map=new Map;
        data['categories'] = [];
        var nodes = [];
        var links= [];
        var counter = 0;
        var dic = {};
        var cate_counter = 0;
        for(var i=0;i<arr.length;i++){
          if(!(arr[i].head_typ in dic)){
            dic[arr[i].head_typ] = cate_counter
            var new_cate = {};
            new_cate.name = arr[i].head_typ;
            cate_counter+=1;
            data['categories'].push(new_cate);
          }
          if(!(arr[i].tail_typ in dic)){
            dic[arr[i].tail_typ] = cate_counter
            var new_cate = {};
            new_cate.name = arr[i].tail_typ;
            cate_counter+=1;
            data['categories'].push(new_cate);
          }
        }
        for(var i=0;i<arr.length;i++){
            //已有该实体
            if(!map.has(arr[i].head)){
              map.set(arr[i].head,counter);
              var new_node1 = {};
              new_node1.name = arr[i].head;
              new_node1.category = dic[arr[i].head_typ];
              new_node1.id = counter;
              counter+=1;
              nodes.push(new_node1);
            }
            //已有该实体,不需增加新的节点
            if(!map.has(arr[i].tail)) {
              map.set(arr[i].tail, counter);
              var new_node2 = {};
              new_node2.name = arr[i].tail;
              new_node2.category = dic[arr[i].tail_typ];
              new_node2.id = counter;
              counter += 1;
              nodes.push(new_node2);
            }
        }
        for(var i=0;i<arr.length;i++){
            var link = {};
            link.source = map.get(arr[i].head);
            link.name = arr[i].rel;
            link.target = map.get(arr[i].tail);
            links.push(link)
        }
        data['nodes'] = nodes;
        data['links'] = links;
        return data;
      },
      //编辑进度条的显示内容
      format(percentage) {
        return percentage === 100 ? '抽取完成' : `${percentage}%`;
      },
      //处理候选三元组分页事件
      unstructuredTextHandleSizeChange(val) {
        //修改当前分页大小
        this.unstructuredTextPageSize = val;
        //重新请求数据
        this.get_unstructured_text(this.unstructuredTextCurrentPage,val)
      },
      //翻页动作
      unstructuredTextHandleCurrentChange(val) {
        this.unstructuredTextCurrentPage = val;
        this.get_unstructured_text(val,this.unstructuredTextPageSize)
      },
      //向后端请求存储的非结构文本数据
      get_unstructured_text(num, limit) {
        //axios请求
        axios.request({
          method:"POST",
          url:'/api/unstructure/getAllTextByPage',
          params:{page:num,limit:limit}
        })
        .then((response) => {
          if (response.status == 200) {
            //修改数据
            console.log(response)
            this.unstructuredTextPageList = response.data.data
            this.unstructuredTextTotal = response.data.count
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //显示内容详情
      displayContent(content){
        this.contentVisible = true;
        this.content = content;
      },
      //处理多选结果
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //获取每一页的key
      getRowKeys(row) {
        return row._id
      },
      //查看预览结果
      viewResult(){
        this.dialogVisible=true;
        // this.getExtractTablePageList();
        setTimeout(()=>{this.show_triples(this.extract_table);},500);
      },
      //前端结果分页
      getExtractTablePageList(){
        //allData为全部数据
        this.extractTablePageList = this.extract_table.slice(
            (this.extractTableCurrrentPage - 1) * this.extractTablePageSize,
            this.extractTableCurrrentPage * this.extractTablePageSize
        );
        this.extractTablePageList_total = this.triplesBeforeInsert.length
      },
      //前端页面改变动作
      extractTableCurrentChange(val){
        this.extractTableCurrrentPage = val
        this.getExtractTablePageList()
      },
      //筛选不同状态
      filterStatus(value, row) {
        return row.status === value;
      },
      //确定导出至三元组库
      confirmExport(){
        if(this.extract_ids.length==0){
          this.$message({
            message: '当前没有抽取结果',
            type: 'warning'
          });
          return;
        }
        //传给后端
        this.tableLoading = true;
        axios.post('/api/candidate/saveExtraction', {
          // data: this.extract_data,
          data:this.extract_table,
          ids :this.extract_ids,
        })
        .then((response) => {
          if (response.status == 200) {
            this.tableLoading = false;
            this.$message({
              message: '导出成功',
              type: 'success'
            });
            //清空选项
            this.$refs.multipleTable.clearSelection();
            //重新加载数据
            this.get_unstructured_text(this.unstructuredTextCurrentPage,this.unstructuredTextPageSize);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //条件禁用多选框
      selectable(row, index) {
        if(row.status=="已抽取"){
          return false;
        }
        else {
          return true;
        }
      },
    },
    mounted() {
      this.get_unstructured_text(this.unstructuredTextCurrentPage,this.unstructuredTextPageSize);
    }
  }
</script>
<style>
  .comment{
      white-space:pre-wrap;
  }
  .el-dialog{
    margin-top: 5vh !important;
  }
</style>