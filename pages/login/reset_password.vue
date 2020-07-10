<template>
	<view class="aui-content zcbox p-l-1 p-r-1 bg-white">
		<form  @submit="formSubmit" @reset="">
			
			<view class="aui-list-item">
				<input class="in-put" name="mobile" v-model="mobile" placeholder="请输入手机号码" placeholder-style="font-size:20rpx"/>
			</view>
			<view class="aui-list-item" style="position: relative;">
				<input class="in-put"  placeholder="验证码" placeholder-style="font-size:20rpx"  type="text" name="mobile_code" style="width: 60%">
				<button class="getCode default" :disabled="disabled" @click="getCode" type="default" v-bind:class="{'default':test}">{{btnTitle}}</button>
			</view>
			<view class="aui-list-item">
				<input class="in-put"  name="new_pwd" password="true" placeholder="请输入新密码" placeholder-style="font-size:20rpx"/>
			</view>
			<view class="aui-list-item">
				<input class="in-put" name="re_new_pwd" password="true" placeholder="请再输一遍新密码" placeholder-style="font-size:20rpx"/>
			</view>
			<button type="primary" form-type="submit" style="font-size: 32rpx;margin-top: 40rpx;margin-bottom: 40rpx;">我要找回</button>
		</form>

	</view>
</template>

<script>
	export default{
		data(){
			return{
				disabled: false,
				btnTitle:'获取验证码',
				test:true,
				mobile:''
			}
			
		},
		methods:{
			getCode(e){
				if(this.mobile.length <= 0){
					uni.showToast({
						title:'请输入手机号!',
						icon:'none'
					})
					return;
				}
				if (!(/^1[356789]\d{9}$/.test(this.mobile))) {
					uni.showToast({
						title:'手机号码格式错误!',
						icon:'none'
					})
					return;
				}
				this.sendRequest({
					url:'Login&a=sendCode',
					method:'post',
					data:{phone:this.mobile}
				})
				
				this.test = false;
				let time = 120;
				let timer = setInterval(()=>{
					this.btnTitle = time + "秒后重试";
					this.disabled = true;
					time--;
					if (time == -1) {
						clearInterval(timer);
						this.btnTitle = "获取验证码";
						this.disabled = false;
					}
				},1000);
				
			},
			
			formSubmit(e){
				
				let formData = e.detail.value;
				

				if(formData['mobile'].length <= 0){
					this.toast('请输入手机号');
					return;
				}
				if(formData['mobile_code'].length <= 0){
					this.toast('请输入验证码');
					return;
				}

	
				if(formData['new_pwd'].length <= 0 || formData['re_new_pwd'].length <= 0){
					this.toast('请输入密码');
					return ;
				}
				if(formData['new_pwd'] != formData['re_new_pwd']){
					this.toast('两次密码输入不一致');
					return ;
				}
				let data = JSON.stringify(formData)
				// uni.showLoading({
				// 	title:"登录中..."
				// });
				this.sendRequest({
					url:'Login&a=resetPassword',
					method:'post',
					data:{data},
					show:true,
				},'login',2);
				
				
			},
			toast(message){
				uni.showToast({
					title:message,
					icon:'none'
				})
			}
		}
	}
</script>

<style>
	.default{
		background-color:#DD524D;
	}
	.in-put{
		border-bottom: 1px solid #eee;
	}
	.getCode{
		color: #FFFFFF;
		width: 38%;
		position: absolute;
		top: 30%;
		right: 0;
		font-size: 26rpx;
		line-height: 80rpx;
	}
</style>
