const xmlhttp = new XMLHttpRequest();
var globalParams;

xmlhttp.open('get', './static/globalParams.json', true)
xmlhttp.send();

// CustomEvent的polyfill
(function() {

  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState === 4) {
    if (xmlhttp.status === 200) {
      globalParams = JSON.parse(xmlhttp.responseText)
      const e = new CustomEvent('ready')
      document.dispatchEvent(e)
    } else {
      console.error(`未找到全局参数配置的文件`);
    }
  }
}

export default {
  get(key) {
    if (key) {
      if (globalParams[key]) {
        return globalParams[key]
      } else {
        console.error(`全局参数未配置'${key}'属性`)
      }
    } else {
      return globalParams
    }
  }
}
