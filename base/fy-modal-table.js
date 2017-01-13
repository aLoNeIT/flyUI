/*
authro:小风风
createDate:2017-01-10
description:flyui的带table的可选择对应一条的基础组件
 */
avalon.component("fy-modal-table", {
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
								'<table class="table table-striped table-hover">'+
									'<thead>'+
										'<tr>'+
											'<th ms-for="el in @aTitle">{{el}}</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
										'<tr ms-for="(index,el) in @dataTable">'+
											'<td ms-for="value in el | selectBy(@sort)">{{value}}</td>'+
											'<td>'+
												'<a class="btn btn-primary" ms-click="@buttons.onSelect(el)">选择</a>'+
											'</td>'+
										'</tr>'+
									'</tbody>'+
								'</table>'+
							'</div>'+
							'<div class="modal-footer">'+
								// '<button type="button" class="btn btn-primary pull-left" ms-click="@_OnConfirm">确认</button>'+
								'<button type="button" class="btn btn-white" ms-click="@_OnClose">关闭</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		width:"600px",
		height:"auto",
		isShow: false,//是否显示界面
		autoClose:false,//自动关闭
		title:"标题",//标题部分内容
		//必须配置下面3项
		aTitle:[],//table的tr
		dataTable:[],//获得的数据,需要筛选
		sort:[],//筛选项
		animateCss:"",
		animate:{
			show:"fadeInUp",
			hide:"fadeOutDown",
			time:500
		},
		buttons:{
			onConfirm:avalon.noop,
			onClose:avalon.noop,
			onSelect:avalon.noop,
		},
		show:function(sTitle,fnSelect,fnConfirm,fnClose){
			this.title=sTitle||this.title;
			//点击选择按钮的方法,回传所选数据
			if(avalon.isFunction(fnSelect)) this.buttons.onSelect=fnSelect;
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