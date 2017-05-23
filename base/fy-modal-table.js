/*
author:小风风
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
								'<div class="input-group m-t" ms-visible="@searchBtn">'+
									'<input type="text" placeholder="搜索list" class="form-control" ms-duplex="@searchText | debounce(200)">'+
									'<span class="input-group-btn">'+
									'<button type="button" class="btn btn btn-primary" ms-click="@buttons.onSearch(@searchText)"> <i class="fa fa-search"></i>搜索</button>'+
									'</span>'+
								'</div>'+
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
											'<td ms-visible="@showBtn">'+
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
		showBtn:true,//选择按钮显示,默认true
		searchBtn:false,// 搜索按钮显示,传search函数时显示
		title:"标题",//标题部分内容
		//必须配置下面3项
		aTitle:[],//table的tr
		dataTable:[],//获得的数据,需要筛选
		$source:[],//原数组
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
			onSearch:avalon.noop
		},
		searchText:"",//查询的文本
		// search:function(oItem,iIndex){//查询过滤器，不过暂时无效果
		// 	var sText=this.searchText||"";
		// 	return oItem.indexOf(sText)>=0;
		// },
		show:function(sTitle,fnSelect,fnConfirm,fnClose,fnSearch){
			this.title=sTitle||this.title;
			//点击选择按钮的方法,回传所选数据
			if(avalon.isFunction(fnSelect)) this.buttons.onSelect=fnSelect;
			if(avalon.isFunction(fnConfirm)) this.buttons.onConfirm=fnConfirm;
			if(avalon.isFunction(fnClose)) this.buttons.onClose=fnClose;
			if(avalon.isFunction(fnSearch)){
				this.buttons.onSearch=fnSearch;
				this.searchBtn=true;
			}
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