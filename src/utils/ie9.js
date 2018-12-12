
(function(global, placeholderColor, unPlaceholderColor) {
  if (window.attachEvent) { // 判断是否支持IE浏览器
    // 颜色处理
    global.placeholderColor = placeholderColor === undefined ? '#949494' : placeholderColor;
    global.unPlaceholderColor = unPlaceholderColor === undefined ? '#3C3F41' : unPlaceholderColor;
    // 注册加载事件
    console.log(window.attachEvent, 'window.attachEvent')
    window.attachEvent('onload', function() {
      console.log('123')
      var inputs = document.getElementsByTagName('input');
      console.log(inputs.length, 'inputs')
      // 判断文本框空白字符
      var reg = /^\s*$/;
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        console.log(input, 'input')
        var type = input.type.toLowerCase();
        // 获取属性 placeholder的值
        var placeholder = input.getAttribute('placeholder');
        if (type === 'text' && placeholder) {
          input.value = placeholder;
          input.style.color = global.placeholderColor;// 默认字体颜色为灰色
          (function(txt) {
            // 获取焦点事件处理
            input.onfocus = function() {
              var val = this.value;
              console.log(val, 'focus')
              if (txt === val) { // 相等则清空
                this.value = '';
              }
            };
            // 失去焦点事件处理
            input.onblur = function() {
              var val = this.value;
              console.log(val, 'blur')
              if (reg.test(val)) { // 为空白符号
                this.value = txt;// 用placeholder取代
                input.style.color = global.placeholderColor;
              }
            };
            // 内容输入事件处理
            input.onkeyup = function() {
              var val = this.value;
              if (txt === val) { // 相等则清空
                if (input.style.color !== global.placeholderColor) {
                  input.style.color = global.placeholderColor;
                }
              } else {
                if (input.style.color !== global.unPlaceholderColor) {
                  input.style.color = global.unPlaceholderColor;// 暗黑色
                }
              }
            }
          })(placeholder);
        }
      }
    });
  }
}(typeof window !== 'undefined' ? window : this));

// const placeholderIe={
//   main(){
//     // if(!this.placeholderSupport()){   // 判断浏览器是否支持 placeholder
//     document.querySelectorAll('[placeholder]').addEventListener('focus', function (e) {
//       console.log("123")
//       console.log(e,"e")

//     });
//     document.querySelectorAll('[placeholder]').addEventListener('blur', function (e) {
//       console.log("345")
//       console.log(e, "e")
//     });
//       // document.querySelectorAll('[placeholder]').onfocus=function() {
//       //   // var input = $(this);
//       //   // if (input.val() == input.attr('placeholder')) {
//       //   //   input.val('');
//       //   //   input.removeClass('placeholder');
//       //   // }
//       // }
//       // document.querySelectorAll('[placeholder]').onblur=function() {
//       //   console.log("123")
//         // var input = $(this);
//         // if (input.val() == '' || input.val() == input.attr('placeholder')) {
//         //   input.addClass('placeholder');
//         //   input.val(input.attr('placeholder'));
//         // }
//       // };
//       for (let i = 0; i < document.querySelectorAll('[placeholder]').length; i++) {
//         console.log(document.querySelectorAll('[placeholder]')[i])
//         console.log("blur")
//         document.querySelectorAll('[placeholder]')[i].blur()
//       }
//     // };
//   },
//   placeholderSupport() {
//     return 'placeholder' in document.createElement('input');
//   }
// }
// export default placeholderIe;
