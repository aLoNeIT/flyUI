/*
author:aLoNe.Adams.K 小风风
createDate:2017-11-01
description:报表组件,其实就是个没分页的列表,还有些自定义的数据,自带打印功能按钮
 */
avalon.component("fy-report", {
	template:(function(){
		var sContent='<div>'
						+'<div class="row wrapper white-bg page-heading">'
							+'<div class="col-lg-10">'
							+'<h2>{{@title}}</h2>'
							+'</div>'
						+'</div>'
						+'<div class="wrapper wrapper-content">'
							+'<wbr ms-widget="{is:\'fy-filter\',$id:@filterId,onFilter:@onFilter}"/>'
							+'<div class="row">'
								+'<div class="col-md-12">'
									+'<div class="ibox">'
										+'<div class="ibox-title">'
											+'<a href="javascript:void(0);" class="btn btn-primary btn-outline" ms-click="@back">返回</a>'
											+'<a href="javascript:void(0);" class="btn btn-primary btn-outline m-l-xs" ms-for="($index,el) in @buttons" ms-class="@el.class" ms-click="@buttonClick(el)">{{el.title}}</a>'
											+'<a href="javascript:void(0);" class="btn btn-primary btn-outline m-l-xs" ms-click="@print(1)">打印</a>'
										+'</div>'
										+'<!--startprint1-->'
										+'<div class="ibox-content">'
											+'<div class="row">'
												+'<div class="col-lg-2 col-md-3 col-xs-4" ms-for="($index,el) in @count">'
													+'<div class="col-xs-12 text-left m-b-xs">{{el.name}}：<b class="m-l">{{el.value}}</b></div>'
												+'</div>'
											+'</div>'
											+'<div class="table-responsive">'
												+'<table class="table table-hover dataTables-example">'
													+'<thead>'
														+'<tr>'
															+'<th ms-for="($key,el) in @fields" ms-css="{width:el.showwidth+\'%\'}" ms-visible="el.showwidth>0">{{el.name}}</th>'
														+'</tr>'
													+'</thead>'
													+'<tbody>'
														+'<tr ms-for="($index,el) in @data">'
															+'<td ms-for="(key,value) in el | selectGridData(el)" ms-html="@procValue(key,value,el)"></td>'
														+'</tr>'
													+'</tbody>'
												+'</table>'
											+'</div>'
										+'</div>'
										+'<!--endprint1-->'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>';
		return sContent;
	}).call(this),
	defaults: {
		title:"报表",//标题部分内容
		buttons:[],
		/*[{
			title:"返回",
			action:"",
			class:"btn-primary"
			onClick:function(wbr){avalon.log(wbr.buttons.$model);}
		}],
		*/
		fields:{},
		/* fields范例
		{
			st_code: {
				name: "门店编码",
				fieldname: "st_code",
				showwidth: 20
			},
			st_name: {
				name: "门店名称",
				fieldname: "st_name",
				showwidth: 20
			},
			st_is_checked:{
				name:"审核状态",
				fieldname:"st_is_checked",
				showwidth:10,
				process:function(value){
					switch (value){
						case 0:return "未审核";
						case 1:return "已审核";
						default:return "未审核";
					}
				}
			}
		},
		*/
		filterId:'filter_'+Math.random(),
		filterFields:{},
		showFilter:false,
		onFilter:avalon.noop,
		$selectedField:[],
		selectDataBy:function(el){//过滤需要显示的字段
			if(this.$selectedField.length==0){
				//在$selectedField内保存需要展示的字段
				var oSelf=this;
				avalon.each(this.fields, function ($index, oItem) {
					if (oItem.showwidth && oItem.showwidth > 0)
						oSelf.$selectedField.push(oItem.fieldname);
				});
			}
			var result = {};
			var i=0;
			for(;i<this.$selectedField.length;i++){
				result[this.$selectedField[i]]=el[this.$selectedField[i]];
			}
			return result;
			/*
			if(this.selectedField!=null){
				return this.selectedField;
			}else{
				var result = {};
				avalon.each(this.fields, function ($index, oItem) {
					if (oItem.showwidth && oItem.showwidth > 0) result[oItem.fieldname]=el[oItem.fieldname];
				});
				this.selectedField = result;
				return result;
			}
			*/
		},
		data:[],
		/* 数据范例
		[{
			st_code:"0101",
			st_name:"fuck",
			st_is_checked:0
		},{
			st_code:"0102",
			st_name:"you",
			st_is_checked:1
		}],
		*/
		count:[],
		// count:[
			// {name:"订单总数",value:32},
			// {name:"起始日期",value:1000004488},
			// {name:"结束日期",value:2002004488}
		// ],
		onButtonClick:avalon.noop,
		buttonClick:function(el){
			if(avalon.isFunction(el.onClick)){
				el.onClick.call(this,el);
			}
		},
		selectedRow:[],//选中的行数据
		procValue:function(key,value,el){//使用特殊方法处理字段内容
			var oItem=this.fields[key];
			if(!oItem||!oItem.process) return value;
			else if(oItem.process) return oItem.process(value,key,el);
		},
		extendAction:function(key,funcname,$event,el){
			var oItem=this.fields[key];
			if(oItem&&oItem.extend&&avalon.isFunction(oItem.extend[funcname])){
				oItem.extend[funcname].call(this,$event,el);
			}
		},
		back:function(){
			location.href=document.referrer;
			//history.back();
		},
		print:function(oper){
			if(oper<10){
				bdhtml=window.document.body.innerHTML;//获取当前页的html代码
				sprnstr="<!--startprint"+oper+"-->";//设置打印开始区域
				eprnstr="<!--endprint"+oper+"-->";//设置打印结束区域
				prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+18); //从开始代码向后取html
				prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));//从结束代码向前取html
				var oPrint = window.open("","报表","location=no,width=830,height=891");
				var str='<p class="noprint" align="center">';//自定义的打印页面展示
				str+='<style media=print type="text/css">.noprint{visibility:hidden;display:none;}{</style>';
				str+='<style type="text/css">.col-xs-4{float:left;width:25%;margin-bottom:5px;}table>tbody>tr>td{text-align:center;}table{border-collapse:collapse;}table,tr,td{border:1px solid black;}.table-responsive{float:left;}</style>';
				// str+='<button type="button" onclick="window.open(\'http://\')">导出</button>';
				str+='<button type="button" onclick="window.print();">打印</button>';
				str+='<button type="button" onclick=" window.close();">关闭</button></p>';
				str+='<h2 style="display:block;text-align:center;">'+this.title+'</h2>';
				str+=prnhtml;
				oPrint.document.body.innerHTML=str;
				// window.document.body.innerHTML=prnhtml;
				// window.print();
				// window.document.body.innerHTML=bdhtml;
				// 导致avalon的所有绑定都失效了
			}else{
				window.print();
			}
		},
		onReady:function(){
			var oFilter=avalon.vmodels[this.filterId];
			oFilter.show(this.filterFields);
			avalon.filters.selectGridData=this.selectDataBy;
			var oSelf=this;
			this.$watch("data",function(){
				oSelf.selectedRow=[];
			});
		}
	}
});