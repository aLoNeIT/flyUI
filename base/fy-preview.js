/*
authro:小风风
createDate:2017-06-07
description:flyui的图片预览组件
 */
avalon.component("fy-preview", {
	template: (function(){
		var sHtml='<div class="fy-modal" ms-visible="@isShow">'+
						'<div class="modal-overlay" ms-click="@hide"></div>'+
						'<div class="modal-dialog-img animated" ms-click="@hide" ms-class=\"@animateCss\" ms-css="{height:@height}">'+
							'<div class="modal-header">'+
								// '<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="modal-title">文件名内容</h2>'+
							'</div>'+
							'<img title="" alt="" ms-attr="{src:@src}" />'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		height:"",
		isShow:false,
		src:"",
		animateCss:"",
		animate:{
			show:"fadeIn",
			hide:"fadeOut",
			time:500
		},
		_onShow:function(sUrl){
			this.isShow=true;
			this.src=sUrl;
		},
		show:function(sUrl){
			this.animateCss=this.animate.show;
			if(sUrl) this._onShow(sUrl);
		},
		hide:function(){
			var oSelf=this;
			this.animateCss=this.animate.hide;
			if(this.animate.time>0){
				setTimeout(function(){
					oSelf.isShow=false;
				},this.animate.time);
			}else{
				this.isShow=false;
			}
		},
		onReady:function(){
			this.height=document.body.clientHeight+"px";
		}
	}
});