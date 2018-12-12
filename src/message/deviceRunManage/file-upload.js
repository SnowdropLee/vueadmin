// 设备文件上传
export default class requestContent {
  constructor() {
    this.data = {
      clientIp: '',
      filePath: '',
      fileContent: ''
    }
    this.TransServiceCode = 'aums.v020.DeviceFilePut';
  }
}
