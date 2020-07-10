<template>
	<view class="" >
		<view class="">
			<image style="width: 100%;" src="/static/zcbanner.png" mode="widthFix"></image>
		</view>
		<view class="aui-content zcbox p-l-1 p-r-1 bg-white">
			<form  @submit="formSubmit" @reset="">
				<view class="aui-list-item">
					<input class="in-put" name="mobile" placeholder="请输入手机号码" placeholder-style="font-size:20rpx"/>
				</view>
				<view class="aui-list-item">
					<input class="in-put" name="password" password="true" placeholder="请输入密码" placeholder-style="font-size:20rpx"/>
				</view>
				<button type="primary" form-type="submit" style="font-size: 32rpx;margin-top: 40rpx;margin-bottom: 40rpx;background-color: #ef0f44;">登录</button>
				<button type="default" @click="goToRegister"  style="font-size: 32rpx;background-color: #333333;color: #FFFFFF;margin-bottom: 40rpx;">没有账号？立即注册</button>
			</form>
			<navigator style="text-align: right;color: #e51c23;" url="/pages/login/reset_password">忘记密码或修改密码?</navigator>
		</view>
		
	</view>
</template>

<script>
	export default{
		methods:{
			goToRegister(e) {
				uni.navigateTo({
					url:'./register'
				})
			},
			
			
			formSubmit(e){
				
				let formData = e.detail.value;
				
				if(formData['mobile'].length <= 0){
					this.toast('请输入手机号');
					return;
				}
				
				if(formData['password'].length <= 0){
					this.toast('请输入密码');
					return ;
				}

				this.login(formData.mobile,formData.password);
			},
			
			toast(message){
				uni.showModal({
					content:message,
					showCancel:false,
				})
			}
		}
	}
	
</script>

<style>
	.in-put{
		border-bottom: 1px solid #eee;
	}
</style>
