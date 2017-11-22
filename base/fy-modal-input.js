/*
authro:aLoNe.Adams.K
createDate:2017-01-01
description:flyui的带input框的基础组件
 */
avalon.component("fy-modal-input", {
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
									'<div class="col-md-12 text-left" ms-for="($index,el) in @aInput" ms-visible="@el.type!=\'hidden\'">'+
										'<label ms-text="el.label">新的密码</label>'+
										'<div class="m-b-sm" ms-class="el.onClick?\'input-group\':\'\'">'+
											'<span class="input-group-btn">'+
												'<button type="button" class="btn btn-primary" ms-click="@el.onClick(el)" ms-text="el.btnText||\'选择\'" ms-visible="@el.onClick"></button>'+
											'</span>'+
											'<input class="form-control" ms-attr="{type:el.type||\'text\',disabled:el.disabled||false}" ms-duplex="el.value" />'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="modal-footer">'+
								'<button type="button" class="btn btn-primary pull-left" ms-click="@_OnConfirm">确认</button>'+
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
		title:"标题",//标题部分内容
		aInput:[],
		// aInput[传入aInput
		// {name:"",key
		// value:"",value
		// label:"label",label text
		// type:"text",input type
		// onClick:avalon.noop,传选择按钮的方法
		// btnText:"",按钮text
		// disabled:false}]
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
			this.title=sTitle||this.title;
			if(avalon.isFunction(fnConfirm)) this.buttons.onConfirm=fnConfirm;
			if(avalon.isFunction(fnClose)) this.buttons.onClose=fnClose;
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