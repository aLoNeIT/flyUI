/*
authro:aLoNe.Adams.K
createDate:2016-12-14
description:flyui的带对话框的基础组件
 */
avalon.component("fy-modal-pwdreset", {
	template:(function(){
		// 内容表格部分
		var sHtml=	'<div class="fy-modal" ms-visible="@isShow">'+
						'<div class="modal-overlay" ms-click="@hide"></div>'+
						'<div class="modal-dialog animated" ms-class=\"@animateCss\" ms-css="{width:@width}">'+
							'<div class="modal-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="modal-title" ms-text="@title"></h2>'+
							'</div>'+
							'<div class="modal-body" ms-css="{height:@height,overflow:\'auto\'}">'+
								'<div class="row">'+
									'<div class="col-md-12 text-left">'+
										'<label>新的密码</label>'+
										'<input class="form-control" type="password" name="" ms-duplex="@pwd" />'+
										'<label class="m-t">确认密码</label>'+
										'<input class="form-control" type="password" name="" ms-duplex="@pwdConfirm" />'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="modal-footer">'+
								'<button type="button" class="btn btn-danger pull-left" ms-click="@_OnConfirm">确认重置</button>'+
								'<button type="button" class="btn btn-white" ms-click="@_OnClose">关闭</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		width:"400px",
		height:"auto",
		isShow: false,//是否显示界面
		autoClose:false,//自动关闭
		title:"修改密码",//标题部分内容
		pwd:"",
		pwdConfirm:"",
		formdata:[],
		animateCss:"",
		animate:{
			show:"fadeInUp",
			hide:"fadeOutDown",
			time:500
		},
		buttons:{
			onConfirm:avalon.noop,
			onClose:avalon.noop,
		},
		show:function(sTitle,fnConfirm,fnClose){
			this.pwd=this.pwdConfirm="",
			sTitle=sTitle||this.title;
			if(avalon.isFunction(fnConfirm)) this.buttons.onConfirm=fnConfirm;
			if(avalon.isFunction(fnClose)) this.buttons.onClose=fnClose;
			this.title=sTitle;
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
		_OnClose:function(){
			this.hide();
			this.buttons.onClose();
		},
		_OnConfirm:function(){
			// this.hide();
			this.buttons.onConfirm();
		}
	}
});