<template>
	<div>
		<el-dialog title='查看详情' :visible.sync='isShow'  width="760px"
			:close-on-click-modal=false
			@open="menuItemDetail"
			@close="closeDetail">
			<el-card>
				<el-form ref='menuItemAdd' :model='menuItemAdd' size="mini"  label-width="80px" label-position="left">
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="交易名称:" prop='menuItemTitle'>
								<span >{{menuItemAdd.menuItemTitle?menuItemAdd.menuItemTitle:"暂无交易名称"}}</span>
								<!-- <el-input v-model="menuItemAdd.menuItemTitle" disabled placeholder="暂无交易名称"></el-input> -->
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="大小:" prop='menuItemSize'>
								<span >{{menuItemAdd.menuItemSize}}</span>								
								<!-- <el-input v-model="menuItemAdd.menuItemSize" disabled placeholder="请输入菜单项标题"></el-input> -->
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12" >	
							<el-form-item label="宽度:" prop='menuItemWidth'>
								<span >{{menuItemAdd.menuItemWidth?menuItemAdd.menuItemWidth:"暂无宽度"}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItemWidth" :disabled="isDisabledSize" placeholder="暂无宽度"></el-input> -->
							</el-form-item>
						</el-col>
						<el-col :span="12">
								<el-form-item label="高度:" prop='menuItemHeight'>
									<span >{{menuItemAdd.menuItemHeight?menuItemAdd.menuItemHeight:"暂无高度"}}</span>																	
									<!-- <el-input v-model="menuItemAdd.menuItemHeight" :disabled="isDisabledSize" placeholder="暂无高度"></el-input> -->
								</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="图标:" prop='menuItemIcon'>
								<img v-if="menuItemAdd.menuItemIcon" :src="menuItemAdd.menuItemIcon" :title="menuItemAdd.menuItemIcon">
								<span v-else>{{menuItemAdd.menuItemIcon?menuItemAdd.menuItemIcon:"暂无图标"}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItemIcon" disabled placeholder="暂无图标"></el-input>										 -->
							</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="背景图片:" prop='menuItemBaclgrround'>
								  <img v-if="menuItemAdd.menuItemBaclgrround" :src="menuItemAdd.menuItemBaclgrround" :title="menuItemAdd.menuItemBaclgrround">									
									<span v-else>{{menuItemAdd.menuItemBaclgrround?menuItemAdd.menuItemBaclgrround:"暂无背景图片"}}</span>																	
									<!-- <el-input v-model="menuItemAdd.menuItemBaclgrround" disabled placeholder="暂无背景图片"></el-input>									 -->
								</el-form-item>
							</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="是否启用:" prop='menuItemIsUse'>
								<span >{{menuItemAdd.menuItemIsUse}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItemIsUse" disabled placeholder="暂无是否启用"></el-input> -->
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="点击效果:" prop='menuItemClickEffact'>
								<span >{{menuItemAdd.menuItemClickEffact?menuItemAdd.menuItemClickEffact:"暂无点击效果"}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItemClickEffact" disabled placeholder="暂无点击效果"></el-input> -->
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="二级菜单:" prop='menuItemsIs'>
								<span >{{menuItemAdd.menuItemsIs}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItemsIs" disabled placeholder="暂无"></el-input> -->
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="二级菜单:" prop='menuItems'>
								<span >{{menuItemAdd.menuItems?menuItemAdd.menuItems:"暂无二级菜单"}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItems" disabled placeholder="暂无二级菜单"></el-input>									 -->
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="步骤条:" prop='menuItemStep'>
								<span >{{menuItemAdd.menuItemStep}}</span>																
								<!-- <el-input v-model="menuItemAdd.menuItemStep" disabled placeholder="暂无步骤条"></el-input> -->
							</el-form-item>
						</el-col>
						<!-- <el-col :span='12'>
							<el-form-item label="交易路径:" prop='menuItemPath'>
											<el-cascader :options='menuItemsIs' :disabled="!isDisabledMenus" v-model='menuItemAdd.menuItemPath'></el-cascader>
							</el-form-item>
						</el-col> -->
					</el-row>
				</el-form>
			</el-card>
			<el-row style="margin:10px 0;text-align:right">
				<el-button type='primary' size='mini' @click="isShow=false">返回</el-button>                    
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import menuSecond from "@/message/resourceManage/menu/menuItem/menu-item-second";

export default {
  props: { option: Object },
  data() {
    return {
			menuItems:[],
      menuItemAdd: {
        menuItemTitle: "",
        menuItemSize: "",
        menuItemWidth: "",
        menuItemHeight: "",
        menuItemIcon: "",
        menuItemClickEffact: "",
        menuItemIsUse: "",
        menuItemsIs: "",
        menuItems: "",
        menuItemStep: "",
        menuItemPath: "",
        menuItemBaclgrround: ""
      },
      fileIcon: [],
      fileBackground: [],
      menuItemClickEffact: [],
      isDisabledSize: true,
      isDisabledMenus: true
    };
  },
  methods: {
    initSecondMenu() {  //调用二级菜单，并实现有二级菜单时回显二级菜单
      let resBody = new menuSecond();
      request(resBody)
			.then(response => {
				if (response.SYS_HEAD.ReturnCode === "000000") {
					this.menuItems = response.RSP_BODY.resultSet;
					for (let i = 0; i < this.menuItems.length; i++) {
						const element =this.menuItems[i];
						if (element.group_Id==this.option.currentRow.childrenArr) {
							this.menuItemAdd.menuItems=element.categoryName
						}
					}
				}
			})
			.catch(error => {
				console.log(error);
			});
    },
    closeDetail() {
      //关闭详情时，清空数据
      this.menuItemAdd = {
        menuItemTitle: "",
        menuItemSize: "",
        menuItemWidth: "",
        menuItemHeight: "",
        menuItemIcon: "",
        menuItemClickEffact: "",
        menuItemIsUse: "",
        menuItemsIs: "",
        menuItems: "",
        menuItemStep: "",
        menuItemPath: "",
        menuItemBaclgrround: ""
      };
    },
    menuItemDetail() {
      //打开弹窗时，数据回显
      this.menuItemAdd.menuItemTitle = this.option.currentRow.tradeName;
      switch (this.option.currentRow.menuSize) {
        case "normal":
          this.menuItemAdd.menuItemSize = "正常";
          break;
        case "smallWide":
          this.menuItemAdd.menuItemSize = "小宽";
          break;
        case "small":
          this.menuItemAdd.menuItemSize = "小";
          break;
        case "wide":
          this.menuItemAdd.menuItemSize = "宽";
          break;
        default:
          this.menuItemAdd.menuItemSize = "自定义";
          this.menuItemAdd.menuItemWidth = this.option.currentRow.menuSize.split(
            ","
          )[0];
          this.menuItemAdd.menuItemHeight = this.option.currentRow.menuSize.split(
            ","
          )[1];
          break;
      }

      this.menuItemAdd.menuItemIcon = this.option.currentRow.icon;
      this.menuItemAdd.menuItemBaclgrround = this.option.currentRow.bg;
      this.option.currentRow.isEnabled == "0"
        ? (this.menuItemAdd.menuItemIsUse = "否")
        : (this.menuItemAdd.menuItemIsUse = "是");
      if(this.option.currentRow.isHasChild == "0"){
				this.menuItemAdd.menuItemsIs = "是"
				this.initSecondMenu()
			}else{
				this.menuItemAdd.menuItemsIs = "否"
			}
      (this.menuItemAdd.menuItemClickEffact = this.option.currentRow.activeClass),
        // this.menuItemUpdate.menuItems=this.option.,
        this.option.currentRow.navigationMode == "step"
          ? (this.menuItemAdd.menuItemStep = "有")
          : (this.menuItemAdd.menuItemStep = "无");
      // this.menuItemUpdate.menuItemPath=this.option.
    },
    sizeChange(val) {
      val[0] === "4"
        ? (this.isDisabledSize = false)
        : (this.isDisabledSize = true);
    },
    isMenus(val) {
      val[0] === "1"
        ? (this.isDisabledMenus = false)
        : (this.isDisabledMenus = true);
    }
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(val) {
        this.option.isShow = val;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
