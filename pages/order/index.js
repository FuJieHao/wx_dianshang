/**
 * 1 页面被打开的时候 onShow
 *  0 onshow不同于onload，无法在形参上接受options参数
 *  0.5判断缓存中有没有token
 *    1 没有 直接跳转到授权页面
 *    2 有 直接往下进行
 *  1 获取url上的参数type
 *  2 根据type去发送请求获取订单数据
 *  3 渲染页面
 * 2 点击不同的标题 重新发送请求来获取和渲染数据
 */
import { request } from "../../request/index"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
  },

  onShow(options){
    const token = wx.getStorageSync('token');
    if(!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }

    //1获取当前的小程序的页面栈 数组 长度最大是10页面
    let pages = getCurrentPages();
    //2数组中索引最大的页面就是当前页面
    let { type } = pages[pages.length - 1].options;
    this.getOrders(type);
  },

  //获取订单列表的方法
  async getOrders(type) {
    const res = await request({url:"my/orders/all", data:{type}});
  },

  //标题点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    //1 获取被点击的标题索引
    const {index} = e.detail;
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
})