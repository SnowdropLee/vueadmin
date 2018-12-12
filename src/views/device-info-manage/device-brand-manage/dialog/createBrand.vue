<template>
   <div> 
     <el-dialog :visible.sync='isShow'  title='新增品牌' width="800px" @close="closeBrand" :close-on-click-modal=false>
      <div v-loading="loading">
        <el-card>
          <el-form :model="addBrand" ref="addBrand" size="mini" :rules="rules" label-position="left" 
                    label-width="125px">
              <el-row :gutter="20">
                <!-- <el-col :span="12">
                    <el-form-item label="品牌ID:" prop="BrandId">
                        <el-input v-model="addBrand.BrandId" name="BrandId"  placeholder="请输入品牌ID"></el-input>
                    </el-form-item>
                </el-col>  -->
                <el-col :span="12">
                    <el-form-item label="品牌名称:" prop="BrandName">
                        <el-input v-model="addBrand.BrandName" name="BrandName"  placeholder="请输入品牌名称"></el-input>
                    </el-form-item>
                </el-col>  
                <el-col :span="12">
                    <el-form-item label="品牌简称:"  prop="BrandShortName">
                        <el-input v-model="addBrand.BrandShortName" name="BrandShortName" placeholder="请输入品牌简称" ></el-input>
                        
                    </el-form-item>
                </el-col>  
              </el-row>
              <el-row :gutter="20">                
                <el-col :span="12">
                    <el-form-item label="品牌联系电话:"  prop="BrandPhone">
                        <el-input v-model="addBrand.BrandPhone" name="BrandPhone"  placeholder="请输入品牌联系电话"></el-input>                                
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item label="品牌地址:" prop="BrandAdress">
                        <el-input v-model="addBrand.BrandAdress" name="BrandAdress"  placeholder="请输入品牌地址"></el-input>                                
                    </el-form-item>
                </el-col> 
              </el-row>
              <el-row :gutter="20">     
                <el-col :span="12">
                    <el-form-item label="品牌联系人姓名:" prop="BrandContactsName">
                        <el-input v-model="addBrand.BrandContactsName" name="BrandContactsName" placeholder="请输入品牌联系人姓名"></el-input>                                
                    </el-form-item>
                </el-col>    
                <el-col :span="12">
                    <el-form-item label="品牌联系人电话:" prop="BrandContactsTelephone">
                        <el-input v-model="addBrand.BrandContactsTelephone" name="BrandContactsTelephone" placeholder="请输入品牌联系人电话"></el-input>                                
                    </el-form-item>
                </el-col>             
              </el-row>  
            </el-form> 
        </el-card>
        <el-row style="margin:20px 0;text-align:right">
            <el-button size="mini" @click="isShow=false">取消</el-button>                        
            <el-button type="primary" size="mini" @click="brandAdd">确认</el-button>
        </el-row>
      </div>
     </el-dialog>
   </div>
</template>
<script>
import request from "@/utils/request";
import addBrand from "@/message/deviceInfoManage/brand/brand-create";
export default {
  props: { createBrand: Object },
  data() {
    var validatorPhone = (rule, value, callback) => {
      let regtel = /(^[1][3,4,5,7,8][0-9]{9}$)|(^[0]\d{2}[-]\d{7,8}$)/;
      let regPhone = /^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/;
      if (regtel.test(value) || regPhone.test(value)) {
        callback();
      } else {
        callback(new Error("请输入11位正确的联系电话"));
      }
    };
    return {
      loading:false,
      addBrand: {
        BrandId: "",
        BrandName: "",
        BrandShortName: "",
        BrandPhone: "",
        BrandAdress: "",
        BrandContactsName: "",
        BrandContactsTelephone: ""
      },
      rules: {
        brandId: [{ required: true, message: "请输入品牌ID", trigger: "blur" }],
        BrandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ],
        BrandShortName: [
          { required: true, message: "请输入品牌简称", trigger: "blur" }
        ],
        BrandPhone: [
          { required: true, message: "请输入品牌联系电话", trigger: "blur" },
          { validator: validatorPhone, trigger: "blur" }
        ],
        BrandAdress: [
          { required: true, message: "请输入品牌地址", trigger: "blur" }
        ],
        BrandContactsName: [
          { required: true, message: "请输入品牌联系人姓名", trigger: "blur" }
        ],
        BrandContactsTelephone: [
          { required: true, message: "请输入品牌联系人电话", trigger: "blur" },
          { validator: validatorPhone, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.createBrand.isShow;
      },
      set: function(newValue) {
        this.createBrand.isShow = newValue;
      }
    }
  },
  methods: {
    closeBrand(){
      this.addBrand={
        BrandId: "",
        BrandName: "",
        BrandShortName: "",
        BrandPhone: "",
        BrandAdress: "",
        BrandContactsName: "",
        BrandContactsTelephone: ""
      }
      this.$refs["addBrand"].clearValidate()//清楚表单验证

    },
    brandAdd() {
      this.$refs["addBrand"].validate(valid => {
        if (valid) {
          this.loading=true;
          let resBody = new addBrand();
          (resBody.data.BrandName = this.addBrand.BrandName),
            (resBody.data.BrandShortName = this.addBrand.BrandShortName),
            (resBody.data.BrandPhone = this.addBrand.BrandPhone),
            (resBody.data.BrandAdress = this.addBrand.BrandAdress),
            (resBody.data.BrandContactsName = this.addBrand.BrandContactsName),
            (resBody.data.BrandContactsTelephone = this.addBrand.BrandContactsTelephone),
            request(resBody)
              .then(response => {
                if (response.SYS_HEAD.ReturnCode === "000000") {
                   this.loading=false;                  
                  this.$message({
                    type: "success",
                    message: "品牌程序创建成功!"
                  });
                  this.isShow = false;
                  this.$emit("refreshBrand");
                }else{
                  this.loading=false;                  
                }
              })
              .catch(error => {
                 this.loading=false;                
                console.log(error);
              });
        } else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });
    }
  }
};
</script>
<style lang="sass" scoped>

</style>
