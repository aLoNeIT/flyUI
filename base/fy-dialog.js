/*
	avalon组件，bootstrap引入,modal弹框,插槽插入表格或者其他内容
	需要传递表格title,和数据字段内容
 */
avalon.component('fy-dialog', {
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
								'<button type="button" class="btn btn-white" ms-click="@hide">关闭</button>'+
								'<button type="button" class="btn btn-primary" ms-click="@hide" ms-visible="false">确定</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		width:"500px",
		isShow: true,//是否显示界面
		title:"数据浏览",//标题部分内容
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
		}
	}
});