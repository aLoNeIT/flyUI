/*
authro:aLoNe.Adams.K
createDate:2016-12-14
description:flyui的基础组件，所有组件都从这个组件派生
 */
avalon.component("fy-base", {
	template:"",
	defaults: {
		width:"600px",
		height:"400px",
		isShow: true,//是否显示界面
		show:function(){
			this.isShow=true;
		},
		hide:function(){
			this.isShow=false;
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