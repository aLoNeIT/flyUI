/*
authro:aLoNe.Adams.K
createDate:2016-12-14
description:flyui的带对话框的基础组件
 */
avalon.component("fy-modal", {
	template:(function(){
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
	}).call(this),
	defaults: {
		width:"600px",
		height:"auto",
		isShow: false,//是否显示界面
		autoClose:false,//自动关闭
		title:"Modal",//标题部分内容
		content:"",//主要内容区
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
		show:function(sTitle,sContent,fnConfirm,fnClose){
			sTitle=sTitle||this.title;
			sContent=sContent||this.content;
			if(avalon.isFunction(fnConfirm)) this.buttons.onConfirm=fnConfirm;
			if(avalon.isFunction(fnClose)) this.buttons.onClose=fnClose;
			this.title=sTitle;
			this.content=sContent;
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
			this.hide();
			this.buttons.onConfirm();
		}
	}
});
(function(){
	var oModal=avalon.components["fy-modal"];
	if(oModal){
		oModal.extend({
			displayName:"fy-modal-grid",
			defaults:{
				content:(function(){
					return  '<div ms-css="{height:@height,width:auto,overflow:\'auto\'}">'+
								'<table class="table table-striped table-hover dataTables-example">'+
									'<thead>'+
										'<tr>'+
											'<th ms-for="(key,value) in @fields">{{value}}</th>'+
											'<th>操作</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
										'<tr ms-for="($index,el) in @data">'+
											'<td ms-for="value in el | selectBy(@selectFields)">{{value}}</td>'+
											'<td>'+
												'<a class="btn btn-primary" ms-click="@selectData(el)">选择</a>'+
											'</td>'+
										'</tr>'+
									'</tbody>'+
								'</table>'+
							'</div>';
				})(),
				data:[],//grid数据源
				fields:[{
					id:"序号",
					name:"名称",
				}],//需要显示的字段
				selectFields:[],
				getFields:function(){//根据fields获取显示的字段
					var aFields=[];
					avalon.each(this.fields,function(key,value){
						aFields.push(key);
					});
					this.selectFields=aFields;
				},
				selectData:function(el){
					this.onSelect(el);
					if(this.autoClose==true) this.hide();
				},
				onSelect:avalon.noop,//onSelect(el)
				show:function(sTitle,aData){
					sTitle=sTitle||this.title;
					aData=aData||[];
					this.title=sTitle;
					this.data=aData;
					this.isShow=true;
				},
				onReady:function(){
					this.getFields();
				}
			}
		});
	}
})();