/*
author:aLoNe.Adams.K 小风风
createDate:2017-11-01
description:报表组件,其实就是个没分页的列表,还有些自定义的数据,自带打印功能按钮
			显示数据的列表渲染速度太慢改用原生写法。
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
											// +'<a href="javascript:void(0);" class="btn btn-primary btn-outline m-l-xs" ms-click="@derivation()">导出</a>'
										+'</div>'
										+'<!--startprint1-->'
										+'<div class="ibox-content" ms-attr="{id:@contentId}">'
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
		$defaultField:{//默认字段内容
			name: "",  //必填
			fieldname: "",// 必填
			type:6,
			subtype:0,//6为密码字段
			showwidth: 10,
			max:255,
			min:1,
			pk:false,
			auto:true,
			unit:"",//单位
			keyid:0,
			keytable:"",
			keyfield:"",
			keyshow:"",
			default:"",
			null:true,//1可为空，0不能为空
			readonly:false,//只读
			noinput:false,//不需要输入框
			inputwidth:0,
			select:"",
			tooltip:"",//placeholder提示语
			/*
			fakefield:{ //伪造字段，用于合成数据,存在这个字段，会将值写入fakefield_fieldname
				key:"field1",
				value:"field2"
			},
			*/
			fakefield:"",
			virtual:false//虚拟字段
		},
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
		back:function(){
			if(self==top) location.href=document.referrer;
			else history.back();
		},
		contentId:"report_content_"+Math.random(),//表格div的domid
		show:function(data,headerData,footerData){
			var headerHtml="",tableHtml="",headHtml="",bodyHtml="";
			var key="",item=null;
			headerHtml='<div class="row">';
			for(key in headerData){
				item=headerData[key];
				headerHtml+='<div class="col-lg-2 col-md-3 col-xs-4">'
							+'<div class="col-xs-12 text-left m-b-xs">'+item.name+'：<b class="m-l">'+item.value+'</b></div>'
						+'</div>';
			}
			headerHtml+='</div>';
			// footerHtml='<div class="row">';
			// for(key in footerData){
			// 	item=footerData[key];
			// 	footerHtml+='<div class="col-lg-2 col-md-3 col-xs-4">'
			// 				+'<div class="col-xs-12 text-left m-t-xs">'+item.name+'：<b class="m-l">'+item.value+'</b></div>'
			// 			+'</div>';
			// }
			// footerHtml+='</div>';
			footerHtml='';
			if(footerData){
				footerData.colspan==footerData.colspan||0;
				footerHtml+='<tr><td colspan="'+footerData.colspan+'">合计</td>';
				for(key in footerData.data){
					footerHtml+='<td>'+footerData.data[key]+'</td>';
				}
				footerHtml+='</tr>';
			}
			tableHtml='<div class="table-responsive">'
						+'<table class="table table-hover dataTables-example">'
							+'{headHtml}'
							+'{bodyHtml}'
							+'{footerHtml}'
						+'</table>'
					+'</div>';
			headHtml='<thead>'
					+'<tr><th style="width:5%;">序号</th>';
			for(key in this.fields){
				item=this.fields[key];
				headHtml+='<th style="width:'+item.showwidth+'%;'+(item.showwidth<=0?'display:none;':'')+'">'+item.name+'</th>';
			}
			headHtml+='</tr>'
					+'</thead>';
			bodyHtml='<tbody>';
			//进入循环，处理单元格内容
			var i=0,value="";
			for(i=0;i<data.length;i++){
				bodyHtml+='<tr><td>'+(i+1)+'</td>';
				for(key in this.fields){
					item=this.fields[key];//或得到该字段定义
					value=data[i][key];//或得到该字段当前记录行所对应的值
					//根据字段内的process函数来再加工内容
					if(item.process) value= item.process(value,key,item);
					// else{
					// 	switch(item.type){

					// 	}
					// }
					bodyHtml+="<td>"+value+"</td>";
				}
				bodyHtml+='</tr>';
			}
			bodyHtml+='</tbody>';
			tableHtml=tableHtml.replace("{headHtml}",headHtml).replace("{bodyHtml}",bodyHtml).replace("{footerHtml}",footerHtml);
			var dom=document.getElementById(this.contentId);
			if(dom) dom.innerHTML=headerHtml+tableHtml;
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
		derivation:avalon.noop,
		onReady:function(){
			var oFilter=avalon.vmodels[this.filterId];
			oFilter.show(this.filterFields);
		}
	}
});