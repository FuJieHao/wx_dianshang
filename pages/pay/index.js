/**
 * 1页面加载的时候
 *  1从缓存中获取购物车数据 渲染到页面中
 *    checked=true
 * 2 微信支付
 *  1哪些账号可以实现微信支付
 *    1企业账号
 *    2企业账号的小程序后台中 必须 给开发者 添加上白名单
 *      1一个 appid可以同时绑定多个开发者
 *      2这些开发者可以共用这个appid和开发者权限
 */

import {getSetting, chooseAddress, openSetting, showModel, showToast} from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
 /**
  * 页面的初始数据
  */
 data: {
   address:{},
   cart:[],
   totalPrice:0,
   totalNum:0
 },

 onShow: function () {
   //1 获取缓存中的收货地址信息
   const address = wx.getStorageSync('address');
   // 1获取缓存中的购物车数据
   let cart = wx.getStorageSync('cart')||[];
   //过滤后的购物车数组
   cart = cart.filter(v=>v.checked);  
   this.setData({ address });
   //1 总价格 总数量
   let totalPrice = 0;
   let totalNum = 0;
   cart.forEach(v=>{
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
   })
   this.setData({
     cart,
     totalPrice,
     totalNum,
     address
   });
 },
})