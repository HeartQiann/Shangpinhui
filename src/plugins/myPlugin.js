let myPlugin = {};
//vue插件一定是一个对象 且对外暴露一个install方法
myPlugin.install = function(){
    console.log("myPlugin被调用！");
}
export default myPlugin;