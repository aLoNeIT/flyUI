/*
authro:aLoNe.Adams.K
createDate:2016-12-14
description:flyui的基础组件，所有组件都从这个组件派生
 */
avalon.component("fy-base", {
	template:"<div></div>",
	defaults: {
		$name:"fy-base",//组件名
		width:"600px",
		height:"400px",
		isShow: false,//是否显示界面
		show:function(){
			avalon.log("base show");
			this.isShow=true;
		},
		hide:function(){
			this.isShow=false;
		}
	}
});

//动画组件，所有需要动画特效的组件都可以从这里继承下去
avalon.extendComponent("fy-animate","fy-base",{
	$name:"fy-animate",
	animate:{//动画特效
		enterClass: 'animate-enter',
		enterActiveClass: 'animate-enter-active',
		leaveClass: 'animate-leave',
		leaveActiveClass: 'animate-leave-active', 
		onEnterDone:avalon.noop,
		onLeaveDone:avalon.noop
	},
	show:function(){
		avalon.log("animate show");
		this.inherited("show","fy-base").apply(this,arguments);
	}
});

//fy-modal组件
avalon.extendComponent("fy-modal","fy-animate",{
	$name:"fy-modal",
	content:"",
	autoClose:false,//自动关闭
	title:"Modal",//标题部分内容
	buttons:{
		onConfirm:avalon.noop,
		onClose:avalon.noop,
	},
	show:function(sTitle,sContent,fnConfirm,fnClose){
		sTitle=sTitle||this.title;
		sContent=sContent||this.content;
		if(avalon.isFunction(fnConfirm)) buttons.onConfirm=fnConfirm;
		if(avalon.isFunction(fnClose)) buttons.onClose=fnClose;
		this.title=sTitle;
		this.content=sContent;
		this.inherited("show","fy-animate").apply(this,arguments);
	},
	hide:function(){
		this.inherited("hide","fy-animate").apply(this,arguments);
	},
	_OnClose:function(){
		this.hide();
		this.buttons.onConfirm();
	},
	_OnConfirm:function(){
		this.hide();
		this.buttons.onClose();
	}
},(function(){
		// 内容表格部分
		var sHtml=	'<div class="fy-modal" ms-visible="@isShow">'+
						'<div class="modal-overlay" ms-click="@hide"></div>'+
						'<div class="modal-dialog animated" ms-class=\"@animateCss\" ms-css="{width:@width}">'+
							'<div class="modal-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="modal-title" ms-text="@title"></h2>'+
							'</div>'+
							'<div class="modal-body" ms-css="{height:@height,overflow:\'auto\'}" ms-html="@content">'+
							'</div>'+
							'<div class="modal-footer">'+
								'<button type="button" class="btn btn-white" ms-click="@_OnClose">关闭</button>'+
								'<button type="button" class="btn btn-primary" ms-click="@_OnConfirm" ms-visible="@buttons.onConfirm!=avalon.noop">确定</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
}).call(this));