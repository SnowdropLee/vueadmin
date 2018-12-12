<template>
  <div class="panel-group" >

    <div class='card-panel'>
      <div class="card-panel-icon-wrapper icon-people">
        <svg-icon icon-class="table" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">总交易数</div>
        <count-to class="card-panel-num" style="color:#40c9c6;"
        :startVal="oldTotal" :endVal="newTotal" :duration="3000"></count-to>
      </div>
    </div>

    <!-- <div class='card-panel'>
      <div class="card-panel-icon-wrapper icon-message">
        <svg-icon icon-class="line" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">昨日交易数</div>
        <count-to class="card-panel-num" style="color:#36a3f7;"
        :startVal="0" :endVal="81212" :duration="3000"></count-to>
      </div>
    </div> -->

    <div class="card-panel"  style="height:15vh">
      <div class="card-panel-icon-wrapper icon-money">
        <svg-icon icon-class="pie" class-name="card-panel-icon" />
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">成功率</div>
        <count-to class="card-panel-num" style="color:#F89E19;"
        :startVal="0" :endVal="endValPercent" :duration="3200" :decimals='2' :suffix="'%'"></count-to>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
export default {
  components: { countTo },
  props:{
    endVal:{type:Object},
  },
  data() {
    return {
      oldTotal: 0,
      newTotal: 0,
      endValPercent:0,
    }
  },
  created() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    // this.newTotal=this.endVal
    // this.getNewVal();
  },
  watch: {
    endVal: function (newQuestion, oldQuestion) {
      if (this.endVal.hasOwnProperty("tradeSuccessRate")) {
        this.endValPercent=Number(this.endVal.tradeSuccessRate.replace(/%/,''))
      }
      if (this.endVal.hasOwnProperty("totalTradeCount")) {
         this.newTotal= Number(this.endVal.totalTradeCount)
      }
      
    }
  },
  methods: {
    getNewVal() {
      let _this = this;
      let newTotal = this.newTotal;
      let oldTotal = this.oldTotal;
      this.timeOut = setTimeout(() => {
        // _this.newTotal = _this.newTotal + 19;
        _this.oldTotal = newTotal;
        _this.getNewVal();
      }, 5000);
    }
  }

}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel {
    height: 16vh;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    // background: #6170a0;
    background:#131b3f;
    margin-bottom: 1vh;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border:1px solid #394056;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #F89E19;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
      // background: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
      // background: #36a3f7;
    }
    .icon-money {
      color: #F89E19;
      // background: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3;
      // background: #34bfa3;
    }
    // .card-panel-icon-wrapper {
    //   // color: #fff;
    // }
    .card-panel-icon-wrapper {
      float: left;
      margin: 2vh 0 0 14px;
      padding: 13px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 4vh;
      text-align: right;
      margin-left: 0px;
      margin-right: 10px;
      .card-panel-text {
        // line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        color: #b1bee6;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        // color: #eeeeee
      }
    }
  }
}
</style>
