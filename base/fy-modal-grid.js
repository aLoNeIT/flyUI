/*
	avalon组件，bootstrap引入,modal弹框,插槽插入表格或者其他内容
	需要传递表格title,和数据字段内容
 */
avalon.component('fy-modal-grid', {
	template:(function(){
		// 内容表格部分
		var sContent='<div ms-css="{height:@height,width:@width,overflow:\'auto\'}">'+
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
		// modal模板
		var modal= '<div class="fy-modal" ms-visible="@isShow">'+
						'<div class="modal-overlay" ms-click="@hide"></div>'+
						'<div class="modal-dialog modal-lg animated" ms-class=\"@animateCss\" ms-css="{width:@width}">'+
							'<div class="modal-content">'+
								'<div class="modal-header">'+
									'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" ms-click="@hide">&times;</span><span class="sr-only">Close</span></button>'+
									'<h4 class="modal-title" ms-text="@title"></h4>'+
								'</div>'+
								'<div class="modal-body">'+
									sContent+
								'</div>'+
								'<div class="modal-footer">'+
									'<button type="button" class="btn btn-primary" data-dismiss="modal" ms-click="@hide">关闭</button>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
		return modal;
	}).call(this),
	defaults: {
		height: "auto",
		width:"auto",
		isShow: true,//是否显示界面
		autoClose:true,//选中后自动关闭
		data:[],//grid数据源
		fields:[{
			id:"序号",
			name:"名称",
		}],//需要显示的字段
		selectFields:[],
		animateCss:"",
		animate:{
			show:"fadeInUp",
			hide:"fadeOutDown",
			time:500
		},
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
		title:"数据浏览",//标题部分内容
		show:function(sTitle,oData){
			sTitle=sTitle||this.title;
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
		onReady:function(){
			this.getFields();
		}
	}
});