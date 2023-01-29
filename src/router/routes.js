// 路由的配置信息 
// 引入一级路由组件
// import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail';
import AddCartSuccess from '@/pages/AddCartSuccess';
import ShopCart from '@/pages/ShopCart';
import Trade from '@/pages/Trade';
import Pay from '@/pages/Pay';
import PaySuccess from '@/pages/PaySuccess';
import Center from '@/pages/Center';
//引入二级路由组件
import myOrder from '@/pages/Center/myOrder';
import groupOrder from '@/pages/Center/groupOrder';

//使用路由懒加载 在需要使用的时候再加载相应的组件
// const foo = ()=>{
//     // console.log("访问home首页");
//     return import("@/pages/Home");
// }

//对外暴露一个数组
export default [
    // 这里path一般都是小写 大小写都可以
    {
        path:"/home",
        component:()=>import("@/pages/Home"),
        name:'home',
        meta:{show:true}
    },
    {
        // 路由传参占位 加?表示params参数可传可不传
        path:"/search/:keyword?",
        component:Search,
        meta:{show:true},
        // 对象形式传参 需要起名字
        name:"search",
        //布尔值的写法 将params参数当作路由组件的一个属性，但是只能传params参数
        // props:true,
        //对象写法 额外给路由组件传递一些props
        // props:{a:1,b:2}
        //函数写法
        props:($route)=>{
            return {keyword:$route.params.keyword,k:$route.query.k}
        }
    },
    {
        path:"/login",
        component:Login,
        name:"login",
        mate:{show:false}
    },
    {
        path:"/register",
        component:Register,
        meta:{show:false}
    },
    {
        // 传参 带着商品id
        path:"/detail/:skuid",
        component:Detail,
        mata:{
            show:false
        }
    },
    {
        path:"/addcartsuccess",
        component:AddCartSuccess,
        name:"addcartsuccess",
        meta:{
            show:false
        }
    },
    {
        path:"/shopcart",
        component:ShopCart,
        name:"shopcart",
        meta:{
            show:false
        }
    },
    {
        path:"/trade",
        component:Trade,
        name:'trade',
        meta:{
            show:false
        },
        // 路由独享守卫
        beforeEnter:(to,from,next) =>{
            if(from.path=='/shopcart'){
                next();
            }else{
                next(false);
            }
        }
    },
    {
        path:"/pay",
        component:Pay,
        name:"pay",
        meta:{
            show:false,
        },
        beforeEnter:(to,from,next) =>{
            if(from.path=='/trade'){
                next();
            }else{
                next(false);
            }
        }
    },
    {
        path:"/paysuccess",
        component:PaySuccess,
        name:"paysuccess",
        meta:{
            show:false,
        }
    },
    {
        path:"/center",
        component:Center,
        name:"center",
        meta:{
            show:false,
        },
        //二级路由组件
        children:[
            {
                // 这里不用带反斜杠 带反斜杠的是一级路由 二级路由要么写全 要么不写
                path:"myorder",
                component:myOrder
            },
            {
                path:"gruoporder",
                component:groupOrder
            },
            // 重定向 如果访问的是center，重定向到我的订单页面
            {
                path:"/center",
                redirect:'/center/myorder',
            }
        ]
    },
    // 重定向 在项目跑起来的时候 立即定向到首页
    {
        path:'*',
        redirect:"/home"
    }
]