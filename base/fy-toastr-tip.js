/*
	author:小风风
	createDate:2016-12-14
	description:flyui tip提示框组件
	toastr.css引入,tip弹框提示
	4种样式success,info,waring,error
	有6种位置:左上,左下,右上,右下,中间上,中间下,默认选右上
	自动关闭时间,有读条显示,控制对应的.toast-progress的宽度,用transition样式控制,默认2s
	传入标题和内容,简单设置默认值
	鼠标移入时透明度1,默认0.7
 */
avalon.component('fy-toastr-tip', {
	template:(function(){
		var modal='<div id="toast-container" class="toast-top-right animated" ms-class="@animateCss" role="alert" ms-visible="@isShow" ms-mouseenter="@mouseOn" ms-mouseleave="@mouseOut">'+
						'<div class="toast" ms-class="[\'toast-\'+@tipType]">'+
							'<div class="toast-progress" ms-class="@progressEnd"></div>'+
							'<button type="button" class="toast-close-button" role="button" ms-visible="@closeBtn">×</button>'+
							'<div class="toast-title" ms-text="@title"></div>'+
							'<div class="toast-message" ms-text="@message"></div>'+
						'</div>'+
					'</div>';
		return modal;
	}).call(this),
	defaults: {
		$timeId:0,//用于定时器的回调,加入样式需要延迟关闭
		title:"成功",
		message:"请稍等......",
		tipType:"success",
		isShow:false,//是否显示界面
		closeBtn:true,//关闭按钮,暂留
		autoClose:true,//选中后自动关闭
		closeTime:2000,
		animate:{
			show:"fadeInDown",
			hide:"fadeOutDown",
			time:1000
		},
		animateCss:"",
		progressEnd:"",
		mouseOn:function(){
			this.progressEnd="";
			clearTimeout(this.$timeId);
		},
		mouseOut:function(){
			this.progressEnd="toast-progress-begin toast-progress-end";
			this.$timeId=0;
			this.show();
		},
		show:function(sTitle,sMessage,sType){
			if(this.$timeId>0) return;
			this.title=sTitle||this.title;
			this.message=sMessage||this.message;
			this.tipType=sType||this.tipType;
			this.isShow=true;
			this.animateCss=this.animate.show;
			this.progressEnd="toast-progress-begin toast-progress-end";
			var oSelf=this;
			this.$timeId=setTimeout(function(){
				oSelf.$timeId=0;
				oSelf.hide();
			},this.closeTime);
		},
		hide:function(){
			if(this.$timeId>0) return;
			this.animateCss=this.animate.hide;
			if(this.animate.time>0){
				var oSelf=this;
				this.$timeId=setTimeout(function(){
					oSelf.$timeId=0;
					oSelf.isShow=false;
					oSelf.progressEnd="";
					oSelf.message="请稍等......";
				},this.animate.time);
			}else{
				this.isShow=false;
			}
		},
		onReady:function(){

		}
	}
});