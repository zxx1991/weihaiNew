<template>
	<view class="">
		<swiper>
			<swiper-item>
				<view class="swiper-item" v-for="(item,index) in bannel_image" :key="index">
					<image class="swiper-image" :src="item.images" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="pic01" style="display: flex;">
			<view class="fen" style="flex:1" v-for="(item,index) in pic_image" :key='index'>
				<image style="width: 100%;" :src="pic_image[index]" mode="widthFix"></image>
			</view>

		</view>
		<view class="prod aui-margin-t-10 bg-white" v-for="(item,index) in catgory" :key='index'>
			<view class="">
				<text class="categroy-title" style="vertical-align: text-top;">{{item.name}}</text>
				<navigator class="more" url="">查看更多</navigator>
			</view>
			<view class="prodnav" style="display: flex;flex-wrap: wrap; " >
				<view class="aui-row aui-row-padded" style="width: 50%;" v-for="(sons,son_index) in item.sons_good" :key='son_index'>

					<navigator class="aui-col-xs-6" url="">

						<image class="product-image" :src="sons.logourl"
						 mode="widthFix"></image>
						<div class="aui-ellipsis aui-font-size-16" style="height: 1rem;">{{sons.name}}</div>
						
							<div class="aui-text-danger aui-font-size-18" v-if="sons.is_guessing == 1 && sons.zhekou == '0'">¥*****</div>
						
							<div v-else-if="sons.is_guessing != 1 && sons.zhekou > 0" class="aui-text-danger aui-font-size-18"><span style="background-color: red;color: #ffffff !important; padding: 0 10px;margin-right: 10px;border-radius: 3px;margin-right: :15px; margin-right: 5%;">{{sons.zhekou}}折</span>¥{{sons.price}}</div>
						
						
							<text v-else class="product-font" style="color: red;font-size: 34rpx;">¥{{sons.price}}</text>
						
						<div class="flex2 aui-padded-t-10 show_c1bc" style="font-size: 12px">
							<div>
								<span class="text-g ">预售开始:<span style="font-size: 0.75rem;color: red;" id="timer1" class="times" data-time="1352434">{{sons.least_time}}</span></span>
							</div>
						</div>
					</navigator>

				</view>

			</view>
		</view>
	</view>


</template>



<script>
	export default {
		data() {
			return {
				moveMin: "",
				bannel_image: [],
				pic_image: [],
				catgory: [],
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			formatBit(val) {
				val = +val
				return val > 9 ? val : '0' + val
			},
			// 秒转时分秒，求模很重要，数字的下舍入
			formatSeconds(time) {
				let min = Math.floor(time % 3600)
				let val = this.formatBit(Math.floor(time / 86400)) + "天" + this.formatBit(Math.floor((time % 86400) / 3600)) + '时' +
					this.formatBit(Math.floor((time % 3600) / 60)) + '分' + this.formatBit(
						time % 60) + "秒"
				return val
			},
			// 定时器
			minReturn(item) {
				let time = item;
				let t = setInterval(() => {
					time--
					// this.moveMin = this.formatSeconds(time)
					// console.log( this.formatSeconds(time))
					return this.formatSeconds(time)
					if (time <= 0 ) {
						clearInterval(t)
						// this.moveMin = "活动已结束"
						return "活动已结束"
					}
				}, 1000)
			},

			getData() {
				let that = this;
				that.sendRequest({
					url: 'Api&a=index',
					success: function(e) {
						that.bannel_image = e.bannel_image
						that.pic_image = e.item
						that.catgory = e.data;
						// console.log(e.data)
						// console.log(e.data['sons_good'])
						e.data.forEach((item,index)=>{
							if(typeof item.sons_good == 'object'){
								item.sons_good.forEach((res,i)=>{
									// console.log(res.least_time);
									res.least_time =res.least_time ? that.minReturn(res.least_time):"";
									
								})
							}
							// console.log(typeof item.sons_good);
							
						})
					},
					fail: function(e) {
						return;
					}
				});
				
				// console.log(that.catgory)
			}
		}

	}
</script>

<style>
	.swiper-image {
		width: 100%;
	}

	.fen {
		margin-right: 2%;
	}

	.prod {
		position: relative;
	}

	.categroy-title {
		padding-top: 20rpx;
		position: relative;
		font-size: 38rpx;
		text-align: center;
		display: block;
		height: 2rem;
	}

	.categroy-title:before,
	.categroy-title:after {
		position: absolute;
		width: 1.8rem;
		height: 1rpx;
		background: #555;
		content: "";
		top: 48%;
	}

	.categroy-title:before {
		left: 50%;
		margin-left: -4rem;
	}

	.categroy-title:after {
		right: 50%;
		margin-right: -4rem;
	}

	.more {
		position: absolute;
		color: #757575;
		font-size: 15rpx;
		right: 20rpx;
		top: 28rpx;
	}

	.aui-col-xs-6 {
		padding: 0.125rem;
	}

	.product-image {
		width: 342rpx;
	}

	.product-font {
		display: block;
		font-size: 30rpx;
		color: #333;
	}

	.aui-ellipsis {
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		word-break: break-all;
		white-space: normal !important;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.aui-text-danger {
		color: #e51c23 !important;
		font-size: 0.9rem !important;
	}
</style>
