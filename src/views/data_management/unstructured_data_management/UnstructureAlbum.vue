<template>
  <div >

    <!-- 隐藏菜单 -->
    <div id="check_menu" :style="displayCheckedMenu">
      <div class="check_menu_item"> <a @click="handleCheckAllChange(false)">
        <!--        <svg-icon icon-file-name="chacha" />-->
      </a></div>
      <div class="check_menu_item check_menu_txt">已选择{{ checkedCount }}张相册</div>
      <div class="check_menu_feature">
        <a title="全选图片" @click="handleCheckAllChange(!checkedStatus)">
          <!--          <svg-icon icon-file-name="all">-->
          <!--          </svg-icon>-->
          <i class="el-icon-s-operation"></i>
        </a>
        <a title="删除相册" @click="deleteAlbums()">
          <!--          <svg-icon icon-file-name="delete" />-->
          <i class="el-icon-delete"></i>
        </a>
      </div>
    </div>
    <!--    &lt;!&ndash; 标题 &ndash;&gt;-->
    <!--    <div id="title" :style="displayTopMenu">-->
    <!--      <h1>相册集</h1>-->
    <!--    </div>-->
    <!--    <div>-->

    <el-row class="album">
      <!--添加相册(个体)  -->
<!--      <el-col class="album-el-col" :span="3" :offset="1">-->
<!--        <a @click="buildAblum()">-->
<!--          <el-card :body-style="{ padding: '10px', }" shadow="hover">-->
<!--            <div style="text-align:center;height:10em;">-->
<!--              &lt;!&ndash;                <svg-icon icon-file-name="addAlbum" style="font-size:3em;margin-top: 1em;" />&ndash;&gt;-->
<!--              <i class="el-icon-plus" style="font-size:3em;margin-top: 1em;"></i>-->
<!--            </div>-->
<!--            <div class="album-el-txt">-->
<!--              <div style="text-align:center;font-size:21px;height:42px;"><a>新建相册</a>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-card>-->
<!--        </a>-->
<!--      </el-col>-->

      <!-- 相册内容(循环) -->
      <el-col class="album-el-col" v-for="(item, index) in albumData" :key="index" :span="3" :offset="1">

          <!-- 相册外边距 -->
          <el-card :body-style="{ padding: '10px', }" shadow="hover" class="card">
            <el-checkbox-group v-model="checkedImgIndex" @change="handleCheckedImgChange"
                               class="check-box" :style="displayCheckedMenu">
              <el-checkbox :label="index">
              </el-checkbox>
            </el-checkbox-group>
            <img class="album-el-img" :src="crawlpicture" @click="openAblum(item.cid)">
            <div class="album-el-txt">
              <span>{{ item.name }}</span>
              <div v-if="item.imagecount!=null">图片数量:<a > {{item.imagecount }}张</a>
              </div>
              <div v-else>暂无图片
              </div>
            </div>
          </el-card>
      </el-col>

    </el-row>
  </div>

</template>
<script>
import crawlpicture from "@/assets/unstructured_picture/crawl.png";
export default {
  data() {
    return {
      statistic:[],
      crawlpicture:crawlpicture,
      serviceurl:"http://localhost:8081/picture/",
      albumName: '好吃的汉堡',
      ImageNumber: 100,
      resizeTimer: null,
      // 服务器url
      token: '',
      serveUrL: this.$serveUrL,
      // 相册json数据
      albumData: [
        {
          albumName: '飞机',
          albumImg: 'http://images.huanqiu.com/sarons/2013/07/b92e5ef37fb04e97f388750cd905b29b.jpg',
          albumId: '',
          imageNumber: 100,
        },
        {
          albumName: '导弹',
          albumImg: 'https://www.chinanews.com/mil/hd2011/2013/05-29/U436P4T426D208368F16470DT20130529120504.jpg',
          albumId: '',
          imageNumber: 100,
        },
        {
          albumName: '舰船',
          albumImg: 'https://cnews.chinadaily.com.cn/img/attachement/jpg/site1/20140618/eca86bda374b150bc0241c.jpg',
          albumId: '',
          imageNumber: 100,
        },
        {
          albumName: '火炮',
          albumImg: 'https://bpic.588ku.com/element_origin_min_pic/16/08/01/22579f636d4bce1.jpg',
          albumId: '',
          imageNumber: 100,
        },
        {
          albumName: '爆炸物',
          albumImg: 'https://img1.baidu.com/it/u=238758713,3004920926&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1672678800&t=50fb67a4b691d470b041da4365759926',
          albumId: '',
          imageNumber: 100,
        },
        {
          albumName: '人员',
          albumImg: 'https://img1.baidu.com/it/u=3614713794,3140436460&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=342',
          albumId: '',
          imageNumber: 100,
        },
      ],

      //复选框
      checkAll: false,       //是否全选
      checkedImgIndex: [],   //图片索引数组
      checkedImgId: [],      //图片id数组
      isIndeterminate: false,

      //用户勾选图片，菜单的显示与隐藏
      checkedStatus: false,
      checkedCount: 0, //勾选数量
      displayTopMenu: 'true', //显示
      displayCheckedMenu: '',  //隐藏
    };
  },
  // mounted() {
  // this.selectAlbums();
  // let h = window.document.body.clientHeight;
  // this.mainStyle.height = (h * 0.75) + 'px';
  // window.onresize = () => {
  //   console.log()
  //   if (this.resizeTimer) {
  //     clearTimeout(this.resizeTimer)
  //   }
  //   this.resizeTimer = setTimeout(() => {
  //     let h = window.document.body.clientHeight;
  //     this.mainStyle.height = (h * 0.75) + 'px';
  //   }, 500)
  // };
// },
  created() {
    const _this = this
    _this.axios.get('/api/crawl/findAllnopage').then(function(resp){
      console.log(resp)
      _this.albumData = resp.data

    })
    _this.axios.get('/api/image/statistic').then(function(resp){
      console.log(resp)
      _this.statistic = resp.data

    })
  },
  methods: {

    //打开相册
    openAblum(id) {
      // let name = this.albumData[id].albumName;
      // this.currentAlbumId = this.albumData[id].albumId;
      console.log(id)
      this.$message({
        type: 'success',
        message: '打开成功 '
      });
      this.$router.push({ path: '/data/unstructure/UnstructurePicture', query: { cid:  id} });
    },
    // 查询所有相册
    selectAlbums() {
      var _this = this;
      this.axios({
        url:  "/api/album/findAllAlbum",
        method: "Get",
      }).then(function (resp) {
        console.log(resp)
        _this.albumData = resp.data;
      })
    },
    //新建相册
    buildAblum() {
      this.$prompt('请输入新的相册名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.handleCheckIndexToId();
        var _this = this;
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('albumName', value);
        this.axios({
          url: this.$serveUrL + "/album/addAlbum",
          method: "post",
          data: formData
        }).then(function (resp) {
          if (resp.data.status == "success") {
            _this.dialogTableVisible = false;
            _this.$message({
              type: 'success',
              message: '你的相册名字是: ' + value
            });
            _this.selectAlbums();
          }
          else {
            1;
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消新建相册'
        });
      });
    },
    // 删除相册
    deleteAlbums() {
      this.$confirm('此操作将删除所选相册, 是否继续?', '删除相册集', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(1)
        this.handleCheckIndexToId();
        var _this = this;
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('albumIds', this.checkedImgId);
        this.axios({
          url: this.$serveUrL + "/album/deleteAlbumByIds",
          method: "post",
          data: formData
        }).then(function (resp) {
          if (resp.data.status == "success") {
            _this.$message({
              message: '相册删除成功！',
              type: 'success'
            });
            _this.handleCheckAllChange(false);
            _this.selectAlbums();
          }
          else {
            1;
          }
        })
      })
    },
    SwitchDisplay(checkedCount) {
      if (checkedCount > 0) {
        // 获取顶部菜单高度，使选中菜单保持一致
        if (this.displayTopMenu != "display:none;" || this.displayTopMenu == '') {
          this.displayCheckedMenu = 'display:block'
          this.displayTopMenu = 'display:none;'
        }
      }
      else {
        this.displayCheckedMenu = '';
        this.displayTopMenu = '';
      }
    },
    //全选框
    handleCheckAllChange(val) {
      if (val) {
        let len = this.albumData.length;
        this.checkedCount = len;
        this.checkedImgIndex = new Array(len);
        for (var i = 0; i < len; i++) {
          this.checkedImgIndex[i] = i;
        }
      }
      else {
        this.checkedImgIndex = [];
        this.checkedCount = 0;
      }
      this.isIndeterminate = false;
      this.checkedStatus = val;
      this.SwitchDisplay(this.checkedCount);
    },
    //根据选中的索引转化为图片的id
    handleCheckIndexToId() {
      let len = this.checkedImgIndex.length;
      this.checkedImgId = new Array(len);
      for (let i = 0; i < len; i++) {
        this.checkedImgId[i] = this.albumData[this.checkedImgIndex[i]].albumId;
      }
    },
    // 部分被选中,当勾选时，上方显示操作菜单
    handleCheckedImgChange(value) {
      console.log(value.length)
      this.checkedCount = value.length;
      this.SwitchDisplay(this.checkedCount);
      this.checkAll = this.checkedCount === this.albumData.length;
      this.isIndeterminate = this.checkedCount > 0 && this.checkedCount < this.albumData.length;
    },
  },
}
</script>
<style scoped>

#main {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#title {
  height: 55px;
  text-align: center;
  font-size: 2em;
  color: transparent;

}

#check_menu {
  background-color: #3174ff;
  height: 55px;
  width: 100%;
  z-index: 10;
  display: none;
  position: relative;
}

.check_menu_txt {
  font-family: MiSans, MIUI, Helvetica Neue, Helvetica, Arial, PingFang SC, Microsoft Yahei, Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;
  color: #fff;
  font-size: 1.35em;
}

.check_menu_item {
  margin-left: 2em;
  margin-top: 1em;
  display: inline-block;

}

.check_menu_feature {
  float: right;
  margin-top: 1em;
  margin-right: 2.8em;
}

.check_menu_feature a {
  margin-right: 2em;
  font-size: 1.35em;
}


.check-box {
  margin: 5px;
  display: none;
  position: absolute;
}

/* 整体相册 */
.album {
  margin-left: 2em;
}

.album-el-col {
  margin: 0.9em;
  width: 12em;
}

.album-el-img {
  /* 消去label */
  position: relative;
  width: 100%;
  height: 10em;
}

.album-el-txt {
  margin-top: 0.8em
}

.card:hover .check-box {
  display: block;
}
</style>
<style>

.el-checkbox__inner {
  background-color: white;
  opacity: 0.9;
  border: #3174ff 1px solid;
  border-radius: 100px;
  width: 1.4em;
  height: 1.4em;
}

.el-checkbox__inner::after {
  height: 0.68em;
  left: 0.42em;
  width: 0.29em;
}

/* 增大点击区域，提高用户体验 */
.el-checkbox__inner::before {
  content: '';
  position: absolute;
  top: -0.625em;
  right: -2.5em;
  bottom: -1.875em;
  left: -0.75em;
}

/* 相册菜单 */
.el-menu--popup {
  max-height: 32em;
  overflow: auto;
  overflow-x: hidden;
}
</style>
