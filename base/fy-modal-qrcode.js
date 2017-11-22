/*
	avalon组件,fy-alert模态弹框.
	open() 用于自定义,传入整个对象,参数会有默认值.
	show() wiat() error() warn() 自带一些默认值,
	传入按钮的function 并且 没有showtime的时候 会显示按钮,
	传入showtime时候 会自动关闭alert.
 */
 avalon.component('fy-modal-qrcode', {
	template: (function(){
		var content="<div>"+
						"<div class='sweet-overlay' ms-visible='@isShow'></div>"+
						"<div class='sweet-alert showSweetAlert animated' ms-class='@animateCss' ms-visible='@isShow' ms-css='{zIndex:@zIndex}'>"+
							"<h2 ms-text='@title'></h2>"+
							"<img ms-attr='{src:@imgSrc}' ms-css='{width:@width,height:@height}' />"+
							"<div class='sa-button-container' >"+
								"<button type='button' class='cancel' ms-click='@_OnClose()'>关闭</button>"+
								"<button type='button' class='confirm' ms-click='@_OnConfirm()'>下载</button>"+
							"</div>"+
						"</div>"+
					"</div>";
		return content;
	}).call(this),
	defaults: {
		// 控制modal-tip的显示
		isShow:false,
		autoClose:false,
		zIndex:10000,
		$timeId:0,
		animateCss:"",
		title:"二维码",
		imgSrc:"",
		// imgWidth:"200px",
		animate:{
			show:"fadeInUp",
			hide:"fadeOutDown",
			time:500
		},
		show:function(title,imgSrc,fnConfirm,fnClose){
			this.title=title||this.title;
			this.imgSrc=imgSrc||this.imgSrc;
			if(avalon.isFunction(fnConfirm)) this.$buttons.onConfirm=fnConfirm;
			if(avalon.isFunction(fnClose)) this.$buttons.onClose=fnClose;
			this.animateCss=this.animate.show;
			this.isShow=true;
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
		$buttons:{
			onConfirm:avalon.noop,
			onClose:avalon.noop
		},
		_OnClose:function(){
			//返回值不为false，则自动关闭
			if(false!==this.$buttons.onClose()) this.hide();
		},
		_OnConfirm:function(){
			//返回值不为false，则自动关闭
			if(false!==this.$buttons.onConfirm()) this.hide();
		}
	}
});