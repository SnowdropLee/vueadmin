<template>
  <div class="item-group">
    <div class='card-panel'>
      <div class="item-header" v-text="name"></div>
      <div class="item-body">
        <div>
          <label>设备总数：</label>
          <span v-text="devNum"></span>
        </div>
        <div>
          <label>正常运行：</label>
          <span v-text="normalNum"></span>
        </div>
        <div>
          <label>交易笔数：</label>
          <span v-text="tranNum"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  name: 'ItemGroup',
  components: { countTo },
  props: {
    option: Object
  },
  data() {
    return {
      oldTotal: 0,
      newTotal: 3333
    }
  },
  created() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.getNewVal();
  },
  computed: {
    name() {
      return this.option.name
    },
    devNum() {
      return this.option.devNum
    },
    tranNum() {
      return this.option.tranNum
    },
    normalNum() {
      return this.option.normalNum
    }
  },
  methods: {
    getNewVal() {
      let _this = this;
      let newTotal = this.newTotal;
      let oldTotal = this.oldTotal;
      this.timeOut = setTimeout(() => {
        _this.newTotal = _this.newTotal + 19;
        _this.oldTotal = newTotal;
        _this.getNewVal();
      }, 5000);
    }
  }

}
</script>

<style lang="scss" scoped>
.item-group {
  .card-panel {
    height: 125px;
    position: relative;
    overflow: hidden;
    // background: #6170a0;
    background:#131b3f;
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
    border:1px solid #394056;
  }
  .item-header{
    color: #81C2FF;
    font-size: 16px;
    padding: 10px;
    border-bottom: 1px solid #8193d0;
  }
  .item-body{
    color:#f8feff;
    font-size: 14px;
    padding: 10px;
    div{
      margin-bottom: 10px; 
    }
  }
}
</style>
