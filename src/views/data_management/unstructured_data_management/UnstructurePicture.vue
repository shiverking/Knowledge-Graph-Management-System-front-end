<template>
  <div>
    <!-- 顶部菜单 ref:组件对象，获取高度 horizontal:横向导航栏-->
    <el-menu :default-active="activeIndex" ref="top_menu" mode="horizontal" @select="handleSelect"
             background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"  :style="displayTopMenu" >
<!--    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->

      <el-menu-item index="all">全 部 图 片</el-menu-item>
      <el-submenu index="type" >
        <template slot="title">{{ typeTitle }}</template>
        <el-menu-item v-for="(item, index) in imageTypes " :key="index" :index="item">{{ item }}</el-menu-item>
      </el-submenu>
      <el-submenu index="time" >
        <template slot="title">{{ timeTitle }}</template>
        <el-menu-item v-for="(item, index) in imageTimes" :key="index" :index="item">{{ item }}</el-menu-item>
      </el-submenu>

      <el-menu-item index="search">
        <el-select style="padding: 0px 20px" v-model="value" multiple filterable remote reserve-keyword
                   :placeholder="placeholder" :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-menu-item>

      <el-menu-item >搜 索</el-menu-item>
    </el-menu>

    <!-- 选中菜单 -->
    <div id="check_menu" :style="displayCheckedMenu">
      <div class="check_menu_item"> <a @click="handleCheckAllChange(false)">
        <svg-icon icon-file-name="chacha" />
      </a></div>
      <div class="check_menu_item check_menu_txt">已选择{{ checkedCount }}张图片</div>
      <div class="check_menu_feature">
        <a title="全选图片" @click="handleCheckAllChange(!checkedStatus)">
<!--          <svg-icon icon-file-name="all">-->
<!--          </svg-icon>-->
          <i class="el-icon-s-operation" style="color: white"></i>
        </a>
        <a title="更改类别" @click="openAlbum()">
<!--          <svg-icon icon-file-name="add" />-->
          <i class="el-icon-s-marketing" style="color: white"></i>
        </a>
        <a title="下载图片" @click="downloadImage()">
<!--          <svg-icon icon-file-name="download" />-->
          <i class="el-icon-download" style="color: white"></i>
        </a>
        <a title="删除图片" @click="deleteImage()">
<!--          <svg-icon icon-file-name="delete" />-->
          <i class="el-icon-delete" style="color: white"></i>
        </a>
      </div>
    </div>

    <!-- 添加相册表格 -->
    <el-dialog title="更改类别" :visible.sync="dialogTableVisible" width="25%">

      <el-select v-model="value" placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" style="margin-left: 45%; margin-top: 10px;" @click="addAlbum()">更改
      </el-button>
    </el-dialog>

    <!-- 图片及复选框 -->
    <div id="image-content">
      <div class="image-item" v-for="(item, index) in typeimages" :key="index" :style="reactiveImage">
        <el-checkbox-group v-model="checkedImgIndex" @change="handleCheckedImgChange" class="check-box"
                           :style="displayCheckedMenu">
          <el-checkbox :label="index">
          </el-checkbox>
        </el-checkbox-group>

        <el-image :src="serviceurl+item.path" :preview-src-list="previewImageUrL" class="image">
          <div slot="placeholder" class="image-slot" element-loading-text="图片加载中..." v-loading="true"
               style="margin-top:40%">
          </div>
        </el-image>
      </div>
    </div>

    <!-- 分页条 -->
    <div id="pagination">
      <div id="pagination-son">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                       :page-sizes="page_size" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      typeimages:[],
      page_size: [10, 15, 20, 25, 30, 40],
      options: ['s', 's'],
      value: ['飞机'],
      list: [],
      states: ["风景", "动物"],
      loading: false,
      token: '',  //token凭证
      serveUrL: this.$serveUrL,
      serviceurl:"http://localhost:12345/picture/",
      // 顶部菜单
      activeIndex: 'all',
      timeTitle: '新 增 图 片',
      typeTitle: '图 片 类 别',
      arrPath: ['all'],   //存放当前菜单路径
      placeholder: '请输入关键词查询图片',
      isRouterAlive: true,

      // 后端查询的图片数据
      images: [
        {
          imageId: '',
          imageUrl: 'https://img2.baidu.com/it/u=4244886866,306641591&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1672678800&t=02c1b790ff5c840a2e263cec7b60264a',
          imageName: '',
        },
        {
          imageId: '',
          imageUrl: 'https://img2.baidu.com/it/u=4244886866,306641591&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1672678800&t=02c1b790ff5c840a2e263cec7b60264a',
          imageName: '',
        },
        {
          imageId: '',
          imageUrl: 'https://img2.baidu.com/it/u=4244886866,306641591&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1672678800&t=02c1b790ff5c840a2e263cec7b60264a',
          imageName: '',
        }
      ],
      previewImageUrL: [],

      //添加到相册
      dialogTableVisible: false,//菜单状态
      currentRowData: null, //当前行相册数据对象
      //相册数据
      albumData: [
        {
          albumName: '',
          albumImg: '',
          albumId: '',
        }
      ],

      // 响应式布局图片大小css
      reactiveImage: {
        margin: '0.3em',
        width: '11%',
        height: '29%',
      },
      imageTypes: ['战斗机', '舰载电子战斗机', '预警机','直升机','运输机'],//所有图片类型
      imageTimes: ['一周内', '一个月内', '三个月内'],  //所有图片时间

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

      //  分页模块
      pageSize: 20,// 每页显示的条数
      totalCount: 100, // 总记录数
      currentPage: 1, // 当前页码

    };
  },
  // created() {
  //
  //   var _this = this;
  //   this.axios.get('/api/album/findbyalbum/' + this.$route.query.albumId ).then(function (resp) {
  //     _this.images = resp.data;
  //     _this.typeimages = resp.data;
  //     for (var i =0;i<_this.images.length;i++){
  //       _this.previewImageUrL.push(_this.serviceurl+_this.images[i]['imageUrl'])
  //     }
  //
  //   })
  //   console.log(this.previewImageUrL)
  // },
  mounted() {
    const _this = this
    _this.axios.get('/api/image/getimage/0/24/'+this.$route.query.cid).then(function(resp){
      console.log(resp)
      _this.typeimages = resp.data.data
      _this.images=resp.data.data
      _this.totalCount=resp.data.count
      _this.pageSize=resp.data.data.length
    })
    _this.axios.get('/api/image/getimagetype/'+this.$route.query.cid).then(function(resp){
      console.log(resp)
      _this.imageTypes = resp.data
    })
    //
    // this.selectAllTimeType();
    // this.selectAllImage();
  },
  methods: {
    // 添加到相册表格方法
    handleTableCurrentChange(val) {
      this.currentRowData = val;
    },
    // 其中大图预览目前总是从第一张开始,简单处理下,就是构建一个以当前图片为起始的数组
    getSrcList(index) {
      return this.serviceurl+this.previewImageUrL.slice(index).concat(this.previewImageUrL.slice(0, index))
    },
    openAlbum() {
      this.selectAlbums();
      this.dialogTableVisible = true;
    },
    addAlbum() {
      this.handleCheckIndexToId();
      var _this = this;
      const formData = new FormData();
      formData.append('token', this.token);
      formData.append('imageId', this.checkedImgId);
      formData.append('albumId', this.currentRowData.albumId);
      this.axios({
        url: this.$serveUrL + "/album/addImageToAlbum",
        method: "post",
        data: formData
      }).then(function (resp) {
        if (resp.data.status == "success") {
          _this.$message({
            message: '添加相册成功！',
            type: 'success'
          });
          _this.dialogTableVisible = false;
        }
        else {
          1;
        }
      })
    },
    downloadImage() {
      var imgIndex = this.checkedImgIndex;
      for (let i = 0; i < imgIndex.length; i++) {
        let imgUrl = this.previewImageUrL[imgIndex[i]];
        let imgName = this.images[imgIndex[i]].imageName;
        this.downloadPicture(imgUrl, imgName);
      }
      this.handleCheckIndexToId();
      var _this = this;
      const formData = new FormData();
      formData.append('token', this.token);
      formData.append('number', this.checkedImgId.length);
      // this.axios({
      //   url: this.$serveUrL + "/record/recordDownload",
      //   method: "post",
      //   data: formData
      // }).then(function (resp) {
      //   if (resp.data.status == "success") {
      //     _this.$message({
      //       message: '图片下载成功！',
      //       type: 'success'
      //     });
      //     _this.dialogTableVisible = false;
      //   }
      //   else {
      //     1;
      //   }
      // })


    },
    downloadPicture(imgSrc, name) {
      // 根据url下载
      fetch(imgSrc).then((res) => {
        res.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = name
          a.click()
          window.URL.revokeObjectURL(url)
        })
      })
    },
    deleteImage() {
      this.$confirm('此操作将删除所选图片, 是否继续?', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleCheckIndexToId();
        var _this = this;
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('imageId', this.checkedImgId);
        this.axios({
          url: this.$serveUrL + "/image/delete",
          method: "post",
          data: formData
        }).then(function (resp) {
          if (resp.data.status == "success") {
            _this.$message({
              message: '图片删除成功！',
              type: 'success'
            });
            _this.handleCheckAllChange(false);
            _this.handleSelect('', _this.arrPath);
          }
          else {
            1;
          }
        })
      })
    },
    selectAlbums() {
      var _this = this;
      const formData = new FormData();
      formData.append('token', this.token);
      this.axios({
        url: this.$serveUrL + "/album/selectAlbumName",
        method: "post",
        data: formData
      }).then(function (resp) {
        if (resp.data.status == "success") {

          _this.albumData = resp.data.data;
        }
        else {
          1;
        }
      })
    },
    selectAllTimeType() {
      var _this = this;
      const formData = new FormData();
      let requestApi = '/image/selectTimeType';
      formData.append("token", this.token);
      this.axios({
        url: this.$serveUrL + requestApi,
        method: "post",
        data: formData
      }).then(function (resp) {

        if (resp.data.status == "success") {
          let data = resp.data.data;
          _this.imageTypes = data.imageType;
          _this.imageTimes = data.imageDate;
          _this.isRouterAlive = !_this.isRouterAlive;

        }
      })
    },
    handleSelect(value, path) {
      console.log(path)
      this.arrPath = path;
      // value
      switch (path[0]) {
        case "all": {
          this.selectAllImage('', '');
          this.timeTitle = '新 增 图 片';
          this.typeTitle = '图 片 类 别';
          break;
        }
        case "type": {
          this.typeTitle = path[1];
          this.timeTitle = '新 增 图 片';
          this.selectAllImage('type', path[1]);
          break;
        }
        case "time": {
          this.timeTitle = path[1];
          this.typeTitle = '图 片 类 别';
          this.selectAllImage('time', path[1]);
          break;
        }
        case "search": {
          break;
        }
        default: break;
      }
    },
    selectAllImage(mode, value) {
      var _this = this;
      const formData = new FormData();
      let requestApi = '/image/selectAll';
      formData.append("currentPage", this.currentPage);
      formData.append("pageSize", this.pageSize);
      formData.append("token", this.token);

      if (mode == "type") {
        const _this = this
        _this.axios.get('/api/image/getimagebytype/0/24/'+this.$route.query.cid+"/"+value).then(function(resp){
          console.log(resp)
          _this.typeimages = resp.data.data
          // _this.images=resp.data.data
          _this.totalCount=resp.data.count
          _this.pageSize=resp.data.data.length
        })
        // formData.append("imageType", value);
        // requestApi = '/image/selectAllByType';
        // if (value=="战斗机"){
        //   _this.typeimages=_this.images.slice(0,4)
        // }
        // if (value=="舰载电子战斗机"){
        //   _this.typeimages=_this.images.slice(4,8)
        // }
        // if (value=="预警机"){
        //   _this.typeimages=_this.images.slice(8,12)
        // }
        // if (value=="直升机"){
        //   _this.typeimages=_this.images.slice(12,16)
        // }
        // if (value=="运输机"){
        //   _this.typeimages=_this.images.slice(16,20)
        // }
      }
      else if (mode == "time") {
        // formData.append("imageDate", value);
        // requestApi = '/image/selectAllByTime';
        if (value=="2011年"){
          _this.typeimages=_this.images.slice(0,7)
        }
        if (value=="2013年"){
          _this.typeimages=_this.images.slice(7,10)
        }
        if (value=="2015年"){
          _this.typeimages=_this.images.slice(10,20)
        }
      }
      else{
        _this.typeimages=_this.images
      }
      this.axios({
        url: this.$serveUrL + requestApi,
        method: "post",
        data: formData
      }).then(function (resp) {
        if (resp.data.status == "success") {
          _this.images = resp.data.data.images;
          _this.previewImageUrL = resp.data.data.previewImageUrL;
          for (var i = 0; i < _this.previewImageUrL.length; i++) {
            _this.previewImageUrL[i] = _this.serveUrL + _this.previewImageUrL[i]
          }
          _this.totalCount = resp.data.data.totalCount;
          _this.isRouterAlive = !_this.isRouterAlive;

        }
      })
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },

    // 显示或隐藏顶部菜单和选中菜单
    SwitchDisplay(checkedCount) {
      if (checkedCount > 0) {
        // 获取顶部菜单高度，使选中菜单保持一致
        let h = this.$refs.top_menu.$el["offsetHeight"];
        if (this.displayTopMenu != "display:none;" || this.displayTopMenu == '') {
          this.displayCheckedMenu = 'display:block;height:' + h + 'px;';
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
        let len = this.images.length;
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
        this.checkedImgId[i] = this.images[this.checkedImgIndex[i]].imageId;
      }
    },
    // 部分被选中,当勾选时，上方显示操作菜单
    handleCheckedImgChange(value) {
      this.checkedCount = value.length;
      this.SwitchDisplay(this.checkedCount);
      this.checkAll = this.checkedCount === this.images.length;
      this.isIndeterminate = this.checkedCount > 0 && this.checkedCount < this.images.length;
    },
    //分页条
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      // 重新设置每页显示的条数
      let Wstr = ['10%', '10%', '9%', '9%', '9%', '9%', '9%'];
      let Hstr = ['29%', '29%', '29%', '29%', '26%', '27%', '21%'];
      this.reactiveImage.width = Wstr[val / 5 - 2];
      this.reactiveImage.height = Hstr[val / 5 - 2];

      this.pageSize = val;


      this.handleSelect('', this.arrPath);
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      // 重新设置当前页码
      this.currentPage = val;
      this.handleSelect('', this.arrPath);
    },

  },
}
</script>
<style scoped>
#main {
  width: 100%;
  height: 100%;
}

#check_menu {
  background-color: #3174ff;
  height: 8%;
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

#image-content {
  margin-left: 1.6em;
  margin-top: 2em;
  width: 100%;
  height: 100%;

}

.image-item {
  margin: 15px 15px;
  width: 12em;
  height: 12em;
  position: relative;
  float: left;
}

.image-item:hover .check-box {
  display: block;
}

.image {

  width: 100%;
  height: 100%;
}

.check-box {
  width: 100%;
  margin: 5px;
  display: none;
  position: absolute;
}



#pagination {
  height: 6%;
  width: 100%;
  position: relative;
}

#pagination-son {
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translate(-50%, -10%);
}
</style>
<style >
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