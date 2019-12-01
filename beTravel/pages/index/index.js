/**
 * Author : 丸子团队（波波、Chi、ONLINE.信）
 * Github 地址: https://github.com/dchijack/Travel-Mini-Program
 * GiTee 地址： https://gitee.com/izol/Travel-Mini-Program
 */
const API = require('../../utils/api')

Page({

  data: {
    posts: [],
    page:1,
    indicatorDots: !1,
    autoplay: !0,
    interval: 3e3,
    currentSwiper: 0,
    navBarHeight: swan.getSystemInfoSync().statusBarHeight,
    placeHolder: '输入你想知道的内容...',
    autoFocus: false,
    inputEnable: true,
  },

  onLoad: function () {
    let that=this;
    swan.getSystemInfo({
      success: function (a) {
        that.setData({
          isIphoneX: a.model.match(/iPhone X/gi)
        });
      }
    });
    this.getStickyPosts();
    this.getCategories();
    this.getAdvert();
    this.getPostList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getSiteInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  onClear:function(){
    this.setData({
      searchKey:'',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page:1,
      posts:[]
    })
    this.getPostList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isLastPage) {
      this.getPostList({
        page:this.data.page
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.siteInfo.name ,
      path: '/pages/index/index'
    }
  },

  getSiteInfo: function() {
    API.getSiteInfo().then(res => {
      this.setData({
        siteInfo: res
      })
      swan.setPageInfo({
				title:res.name,
				keywords:res.keywords,
				description:res.description,
				image: 'https://static.weitimes.com/uploads/colorui/macbook.jpg',
				success: function () {
					console.log('小程序 Web 化信息设置成功');
				},
				fail: function (err) {
					console.log('小程序 Web 化信息设置失败', err);
				}
			})
    })
    .catch(err => {
      console.log(err)
    })
  },

  onInput: function(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  currentChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },

  getStickyPosts: function() {
    API.getStickyPosts().then(res => {
      this.setData({
        stickyPost: res
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  getCategories: function() {
    API.getCategories().then(res => {
      this.setData({
        category: res
      })
    })
    .catch(err => {
      console.log(err)
    })
  },

  getPostList: function(data) {
    API.getPostsList(data).then(res => {
      let args = {}
      if (res.length < 10) {
        this.setData({
          isLastPage: true,
          loadtext: '到底啦',
          showloadmore: false
        })
      }
      if (this.data.isBottom) {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      } else {
        args.posts = [].concat(this.data.posts, res)
        args.page = this.data.page + 1
      }
      this.setData(args)
      swan.stopPullDownRefresh()
    })
    .catch(err => {
      console.log(err)
      swan.stopPullDownRefresh()
    })
  },

  getAdvert: function() {
    API.indexAdsense().then(res => {
      console.log(res)
      if(res.status === 200) {
        this.setData({
          advert: res.data
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  bindCateByID: function (e) {
    let id = e.currentTarget.id;
    swan.navigateTo({
      url: '/pages/list/list?id=' + id,
    })
  },

  bindCateList:function(){
    swan.switchTab({
      url: '/pages/category/category',
    })
  },

  bindDetail: function(e) {
    let id = e.currentTarget.id;
    swan.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },

  onConfirm:function(e){
    let s=e.detail.value;
    swan.navigateTo({
      url: '/pages/list/list?s='+s,
    })
  }

})
