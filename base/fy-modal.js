/*
authro:aLoNe.Adams.K
createDate:2016-12-14
description:flyui的带对话框的基础组件
 */
avalon.component("fy-modal", {
	template:(function(){
		// 内容表格部分
		var sHtml=	'<div class="fly-modal-overlay animate fadeIn" ms-click="@hide" ms-visible="@isShow">'+
						'<div class="fly-modal-dialog" ms-class="{width:@width}">'+
							'<div class="fly-modal-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="fly-modal-title" ms-text="@title"></h2>'+
							'</div>'+
							'<div class="fly-modal-body" ms-html="@content">'+
							'</div>'+
							'<div class="fly-modal-footer">'+
								'<button type="button" class="btn btn-white" ms-click="@_OnClose">关闭</button>'+
								'<button type="button" class="btn btn-primary" ms-click="@_OnConfirm" ms-visible="@onConfirm!=avalon.noop">确定</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		width:"600px",
		height:"400px",
		isShow: true,//是否显示界面
		autoClose:false,//自动关闭
		title:"Modal",//标题部分内容
		content:"",//主要内容区
		show:function(sTitle,sContent){
			sTitle=sTitle||this.title;
			sContent=sContent||this.content;
			this.title=sTitle;
			this.content=sContent;
			this.isShow=true;
		},
		hide:function(){
			this.isShow=false;
		},
		onConfirm:avalon.noop,
		onClose:avalon.noop,
		_OnClose:function(){
			if(this.onClose()!==false) this.hide();
		},
		_OnConfirm:function(){
			if(this.onConfirm()!==false) this.hide();
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
					return  '<div ms-css="{height:@height,width:@width,overflow:\'auto\'}">'+
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
												'<a class="btn btn-primary" data-dismiss="modal" ms-click="@selectData(el)">选择</a>'+
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
					})
					this.selectFields=aFields;
				},
				selectData:function(el){
					this.onSelect(el);
					if(this.autoClose==true) this.hide();
				},
				onSelect:avalon.noop,//onSelect(el)
				show:function(sTitle,oData){
					sTitle=sTitle||this.title;
					this.title=sTitle;
					this.isShow=true;
				},
				onClose:function(){
					alert("ddd");
				},
				onReady:function(){
					this.getFields();
				}
			}
		});
	}
})();