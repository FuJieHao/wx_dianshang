import { request } from "../../request/index"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  //接口的返回数据
  Cats:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 0 web中本地存储和小程序中的本地存储的区别
        1.写代码的方式不一样
        web:localStorage.setItem("key", "value")
          localStorage.getItem("key")
        小程序：wx.setStorageSync('cates', {time:Date.now(),data: this.Cats});
          wx.getStorageSync("cates")
        2.存储的时候有没有做类型转换
        web:不管存入的是什么类型的数据。最终都会调用toString方法
        小程序：没有进行类型转换
     * 1.先判断一下本地存储中有没有旧数据
     * 2.没有旧数据 直接发送新请求
     * 3.有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据
     */

     //1获取本地存储中的数据 （小程序也存在本地存储）
     const Cates = wx.getStorageSync("cates");
     //2判断
     if(!Cates) {
      this.getCates();
     } else {
       //有旧的数据 定义过期时间
       if(Date.now()-Cates.time>1000*10) {
         //重新发送请求
         this.getCates();
       } else {
          //可以使用旧的数据
          this.Cats=Cates.data;
          //构造左侧的大菜单数据
          let leftMenuList=this.Cats.map(v=>v.cat_name);
          //构造右侧的商品数据
          let rightContent=this.Cats[0].children;
          this.setData({
            leftMenuList,
            rightContent
          })
       }
     }
  },

  //获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res=>{
    //   this.Cats=res.data.message;

    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync('cates', 
    //   {time:Date.now(),
    //   data: this.Cats});

    //   //构造左侧的大菜单数据
    //   let leftMenuList=this.Cats.map(v=>v.cat_name);
    //   //构造右侧的商品数据
    //   let rightContent=this.Cats[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1使用es7的async await来发送异步请求
    const res = await request({url: "/categories"});
    this.Cats=res;

    //把接口的数据存入到本地存储中
    wx.setStorageSync('cates', 
    {time:Date.now(),
    data: this.Cats});

    //构造左侧的大菜单数据
    let leftMenuList=this.Cats.map(v=>v.cat_name);
    //构造右侧的商品数据
    let rightContent=this.Cats[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单的点击事件
  /**
   * 1.获取被点击的标题身上的索引
   * 2.给data中的currentIndex赋值就可以了
   * 3.根据不同的索引渲染右侧的内容
   */
  handleItemTap(e) {
    const {index} = e.currentTarget.dataset;
    //构造右侧的商品数据
    let rightContent=this.Cats[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop: 0
    })
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