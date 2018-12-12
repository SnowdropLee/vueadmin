// 避免下载动作被阻止
// 避免没有资源时的页面跳转
// 存在问题 有可能无法使用ActiveXObject对象 （动作会被浏览器阻止）

// function downloadFile(strRemoteURL, strLocalURL) {
//   try {
//     var xmlHTTP = new ActiveXObject('Microsoft.XMLHTTP');
//     xmlHTTP.open('Get', strRemoteURL, false);
//     xmlHTTP.send();
//     var adodbStream = new ActiveXObject('ADODB.Stream');
//     adodbStream.Type = 1; // 1 = adTypeBinary
//     adodbStream.Open();
//     adodbStream.write(xmlHTTP.responseBody);
//     adodbStream.SaveToFile(strLocalURL, 2);
//     adodbStream.Close();
//     adodbStream = null;
//     xmlHTTP = null;
//   } catch (e) {
//     window.confirm('下载URL出错!');
//   }
// }

function downloadFile(strRemoteURL) {
  if (strRemoteURL) {
    try {
      window.location = strRemoteURL;
      console.log('请求成功 开始下载 请求地址:' + strRemoteURL)
    } catch (e) {
      console.log('下载URL出错!');
    }
  }
}
export default downloadFile
