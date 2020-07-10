import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//backpage 跳转的路径
//backtype 跳转类型 1是navigateTo 2是redirectTo
Vue.prototype.sendRequest = function(param,backpage, backtype){
    var _self = this, 
        url = param.url,
        method = param.method,
        header = {},
        data = param.data || {}, 
        token = "",
		showMessage = param.show || false,
        hideLoading = param.hideLoading || false,
		checkToken = param.checkToken || false;
        
    //拼接完整请求地址
    var requestUrl = this.siteBaseUrl + url;
    //固定参数:仅仅在小程序绑定页面通过code获取token的接口默认传递了参数token = login
    if(checkToken){//其他业务接口传递过来的参数中无token
        token = uni.getStorageSync(this.sessionKey);//参数中无token时在本地缓存中获取
        console.log("当前token:" + token);
        if(!token){//本地无token需重新登录(退出时清缓存token)
			uni.navigateTo({
				url:'/pages/login/login'
			})
            return;
        }else{
            data.token = token;
        }
    }
    // var timestamp = Date.parse(new Date());//时间戳
    // data["timestamp"] = timestamp;
    
    //请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
    if(method){
        method = method.toUpperCase();//小写改为大写
        if(method=="POST"){
            header = {'content-type' : "application/x-www-form-urlencoded"};
        }else{
            header = {'content-type' : "application/x-www-form-urlencoded"};
        }
    }else{
        method = "GET";
        header = {'content-type' : "application/x-www-form-urlencoded"};
    }
	// console.log(header);
    //用户交互:加载圈
    if (!hideLoading) {
        uni.showLoading({title:'加载中...'});
    }
    // console.log("网络请求start");
    //网络请求
    uni.request({
        url: requestUrl,
        method: method,
        header: header,
        data: data,
        success: res => {
            // console.log("网络请求success:" + JSON.stringify(res));
            if (res.statusCode && res.statusCode != 200) {//api错误
                uni.showModal({
                    content:"" + res.errMsg
                });
                return;
            }
            if (res.data.code) {//返回结果码code判断:1成功,0错误,-1未登录(未绑定/失效/被解绑)
                if (res.data.code == "-1") {
					uni.navigateTo({
						url:'/pages/login/login'
					})
                    return;
                }
				if(showMessage){
					uni.showModal({
					    showCancel:false,
					    content:"" + res.data.msg,
						success:function(e){
							if(e.confirm && backpage && res.data.code == '1'){
								if(backtype == '1'){
									uni.navigateTo({
										url:backpage
									})
								}else if(backtype == '2'){
									uni.redirectTo({
										url:backpage
									})
								}
								
							}
						}
					});
					return;
				}else{
					if (res.data.code != "1") {
					    uni.showModal({
					        showCancel:false,
					        content:"" + res.data.msg
					    });
					    return;
					}
				}
                
            } else{
                uni.showModal({
                    showCancel:false,
                    content:"" + res.data.msg
                });
                return;
            }
            typeof param.success == "function" && param.success(res.data);
        },
        fail: (e) => {
            console.log("网络请求fail:" + JSON.stringify(e));
            uni.showModal({
                content:"" + e.errMsg
            });
            typeof param.fail == "function" && param.fail(e.data);
        },
        complete: () => {
            console.log("网络请求complete");
            if (!hideLoading) {
                uni.hideLoading();
            }
            typeof param.complete == "function" && param.complete();
            return;
        }
    });
}

Vue.prototype.login = function(mobile, password){
    var _self = this;
	var requestUrl = this.siteBaseUrl + 'Login&a=login';
	uni.showLoading({title:'加载中...'});
	var pages = getCurrentPages();
	let backpage = pages.length > 1 ? 1 :99999;
	// console.log(backpage);
	uni.request({
		url: requestUrl,
		method: 'POST',
		header: {'content-type' : "application/x-www-form-urlencoded"},
		data: {mobile:mobile,password:password},
		success: res => {
			// console.log("网络请求success:" + JSON.stringify(res));
			if (res.statusCode && res.statusCode != 200) {//api错误
			    uni.showModal({
			        content:"" + res.errMsg
			    });
			    return;
			}
			if (res.data.code) {//返回结果码code判断:1成功,0错误)

				uni.showModal({
					showCancel:false,
					content:"" + res.data.msg,
					success:function(e){
						
						if(e.confirm){
							if(res.data.code == '1'){
								//登录成功
								uni.setStorageSync(_self.sessionKey,res.data.token);
								if(backpage == 1){
									uni.navigateBack()
								}else{
									uni.switchTab({
										url:'/pages/index/index'
									})
								}
								
							}else{
								uni.showModal({
								    showCancel:false,
								    content:"" + res.data.msg
								});
							}
						}
					}
				});
				return;

			} else{
			    uni.showModal({
			        showCancel:false,
			        content:"" + res.data.msg
			    });
			    return;
			}
			// typeof param.success == "function" && param.success(res.data);
		},
		fail: (e) => {
			console.log("网络请求fail:" + JSON.stringify(e));
			uni.showModal({
			    content:"" + e.errMsg
			});
			// typeof param.fail == "function" && param.fail(e.data);
		},
		complete: () => {
			console.log("网络请求complete");

			uni.hideLoading();
			
			// typeof param.complete == "function" && param.complete();
			return;
		}
		
	})

    return;
}

Vue.prototype.siteBaseUrl = 'http://beijingweihai.wk199.cn/index.php?g=Lg&m=';

Vue.prototype.sessionKey = "session_wh";

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
