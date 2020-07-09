/**
 * 1获取用户的收货地址
 *  1绑定点击事件
 *  2调用小程序内置 api 获取用户的收货地址
 *  2获取用户对小程序所授予获取地址的权限状态 scope
 *    1假设用户点击获取收货地址的提示框确定 authSetting scope.address
 *      scope 的值 true 直接调用 获取收货地址
 *    2假设用户点击取消
 *      scope 的值 false
 *      1 诱导用户 自己打开 授权设置页面 当用户重新给予 获取地址权限的时候
 *      2 获取收货地址
 *    3假设 用户从来没有调用过 收货地址api
 *      scope undefine 直接调用 获取收货地址
 *    4把获取到的收货地址存入到本地存储中
 * 
 * 2页面加载完毕
 *  1获取本地存储中的地址数据
 *  2把数据设置给data中的一个变量
 * 3 onShow
 *  0回到了商品详情页面 第一次添加商品的时候 手动添加了属性
 *    1 num=1
 *    2 checked=true
 *  1获取缓存中的购物车数组
 *  2把购物车数据填充到data中
 * 
 * 4全选的实现 数据的展示
 *  1 onShow获取缓存中的购物车数组
 *  2 根据购物车中的商品数据 所有的商品都被选中 全选被选中
 * 5 总价格和总数量
 *  1都需要商品被选中  才计算
 *  2获取购物车的数组
 *  3遍历
 *  4判断商品是否被选中
 *  5如果选中 总价格 += 商品的单价 * 商品的数量
 *  6 总数量
 * 
 * 6 商品的选中
 *  1绑定change事件
 *  2获取到被修改的商品对象
 *  3商品对象的选中状态 取反
 *  4重新填充回data和缓存中
 *  5重新计算全选，价格，数量
 * 
 * 7 全选和反选
 *  1全选的复选框绑定事件 change
 *  2获取data中的全选变量 allChecked
 *  3直接取反
 *  4遍历数组 让里面商品的选中状态改变
 *  5把购物车数组和allChecked重新设置回data
 * 8 商品数量的编辑
 *  1"+" "-" 绑定同一个点击事件 绑定自定义属性
 *  2传递被点击的商品id goods_id
 *  3获取data中的购物车数组 来获取需要被修改的商品对象
 *  4当购物车的数量=1同时用户点击"-" 弹窗提示是否要删除，如果取消，什么都不做
 *  5直接修改商品对象的数量 num
 *  6把cart数组 重新设置回缓存中和data中
 * 
 * 9 点击结算
 *  1判断有没有收货地址信息
 *  2判断用户有没有选购商品
 *  3经过以上的验证 跳转到支付页面！
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
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async handleChooseAddress() {
    try {
      // 1获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2判断 权限状态
      if(scopeAddress === false) {
        //4诱导用户打开授权页面
        await openSetting();
      }
      //5调用收货地址api
      const address = await chooseAddress();
      address.all = address.provinceName+address.cityName+
      address.countyName+address.detailInfo 
      //存入到缓存中
      wx.setStorageSync('address', address);
    } catch(err) {

    }

  },

  //商品的选中
  handelItemChange(e){
    //1获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //2获取购物车数组
    let {cart} = this.data;
    //3 找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    // 4选中状态去反
    cart[index].checked = !cart[index].checked;
    

    // 5 6 把 购物车数据重新设置回data和缓存中
    this.setCart(cart);
  },

  //商品的全选
  handleItemAllCheck(){
    //1获取data中的数据
    let{cart, allChecked} = this.data;
    //2修改值
    allChecked = !allChecked
    //3循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //4.把修改后的值填充回data或者缓存中
    this.setCart(cart);
  },

  //商品数量的编辑功能
  async handleItemNumEdit(e) {
    //1获取传递过来的参数  操作符 商品id
    const {operation, id} = e.currentTarget.dataset;
    //2获取购物车数组
    let { cart } = this.data;
    //3找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id);
    //判断是否执行删除
    if(cart[index].num===1&&operation===-1) {
      //弹窗提示
      const res = await showModel({content:"是否要删除该商品"});
      if(res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } 
    } else {
      //4进行修改数量
      cart[index].num += operation;
      //5设置回缓存
      this.setCart(cart);
    }
  },

  //设置购物车状态 同时重新计算底部数据
  setCart(cart) {
    let allChecked = true;
    //1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked=false;
      }
    })
    //判断一下数组是否为空
    allChecked = cart.length!=0?allChecked:false;
    //2 给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 1获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart')||[];

    this.setData({
      address
    });
    this.setCart(cart);
  },

  //点击结算的功能
  async handlePay(){
    //1判断收货地址
    const {address, totalNum} = this.data;
    if(!address.userName){
      await showToast({title: "还没有选择收货地址"});
      return;
    }
    // 2判断用户有没有选购商品
    if(totalNum === 0){
      await showToast({title: "还没有选购商品"});
      return;
    }

    //3跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})