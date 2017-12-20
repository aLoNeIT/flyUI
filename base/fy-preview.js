/*
	authro:小风风
	createDate:2017-06-07
	description:flyui的图片预览组件
	传入图片url或者img对象
	再次点击关闭预览
 */
avalon.component("fy-preview", {
	template: (function(){
		var sHtml='<div class="fy-modal" ms-visible="@isShow">'+
						'<div class="modal-overlay" ms-click="@hide"></div>'+
						'<div class="modal-dialog-img animated" ms-click="@hide" ms-class=\"@animateCss\" ms-css="{height:@height}">'+
							'<div class="modal-header" ms-visible="@title!=\'\'">'+
								// '<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="modal-title">{{@title}}</h2>'+
							'</div>'+
							'<img ms-attr="{src:@src,title:@title,id:@domId}" ms-on-load="@imgLoaded($event)" style="margin:auto;display:block" ms-css="{height:@imgHeight,width:@imgWidth}"  />'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		domId:"fy-preview_"+(Math.random()+"").substr(3,6),
		height:"",
		imgWidth:"",
		imgHeight:"",
		isShow:false,
		src:"",
		title:"",
		animateCss:"",
		animate:{
			show:"fadeIn",
			hide:"fadeOut",
			time:500
		},
		_onShow:function(sImg){
			this.src=sImg;
			this.isShow=true;
		},
		_onShowimg:function(oImg){
			this.src=oImg.src;
			this.title=oImg.title;
			this.isShow=true;
		},
		show:function(oImg){
			this.animateCss=this.animate.show;
			if(oImg){
				if(typeof oImg=="string"){
					this._onShow(oImg);
					return;
				}
				if(typeof oImg=="object"){
					this._onShowimg(oImg);
				}
			}
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
		imgLoaded:function($event){//图片载入完成
			var img=$event.target,
				height=document.body.clientHeight-(this.title!=""?68:0),
				width=document.body.clientWidth;
			//通过比较宽和高谁的值大，以此来决定以哪一边来缩放
			if(img.width>img.height){
				if(img.width>width) this.imgWidth=width;
			}else{
				if(img.height>height) this.imgHeight=height;
				else{
					//height>img.height
					//计算高度差，进行top设置
					img.style.marginTop=Math.floor((height-img.height)/2)+"px";
				}
			}
		},
		onReady:function(){
			this.height=document.body.clientHeight+"px";
		}
	}
});