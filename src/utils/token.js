// 处理token 

//持久化存储token
export const setToken = (token) =>{
    localStorage.setItem('TOKEN',token);
};

//获取token
export const getToken = () =>{
    return localStorage.getItem('TOKEN');
};

//退出登录 清除本地存储的token
export const removeToken = () =>{
    localStorage.removeItem('TOKEN');
}