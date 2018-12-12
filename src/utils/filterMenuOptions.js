/**
 * @desc 异步过滤菜单中title、path，返回所有权限对应的键值数组
 * @param asyncOptionMap
 */
function filterAsyncOptions(asyncOptionMap = []) {
  let title, path, option, overPath;
  const states = [];
  if (!asyncOptionMap && !asyncOptionMap.length) {
    return false
  }

  function getOptionsList(route) {
    for (let i = 0; i < route.children.length; i++) {
      if (route.children[i].children) {
        getOptionsList(route.children[i])
        continue
      }
      overPath = route.path;
      title = route.children[i].meta.title;
      path = route.children[i].path;
      option = { value: overPath + '/' + path, label: title };
      states.push(option);
    }
  }
  asyncOptionMap.map(route => {
    if (route.children) {
      getOptionsList(route)
    }
  });
  return states;
}
export default filterAsyncOptions
