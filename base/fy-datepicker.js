/*
	avalon组件，需要使用date.css样式
 */
//日历组件
avalon.component('fy-datepicker', {
	template:(function(){
		// 组件部分
		var sDatePicker='<div ms-visible="@isShow" ms-css="@css" class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-top" style="display: block; top: 32px; left: 8px; z-index: 10;" ms-mouseleave="@autoClose?@hide():avalon.noop()">'+
							'<div ms-visible="@selectType==\'days\'" class="datepicker-days" style="display:block;">'+
								'<table class="table-condensed">'+
									'<thead>'+
										'<tr>'+
											'<th class="prev" style="visibility: visible;" ms-click="renderDays(@year,@month-1)">«</th>'+
											'<th colspan="5" class="datepicker-switch" ms-click="@changeView(\'months\')">{{@dayCaption}}</th>'+
											'<th class="next" style="visibility: visible;" ms-click="renderDays(@year,@month+1)">»</th>'+
										'</tr>'+
										'<tr>'+
											'<th class="dow" ms-for="($index,el) in @weekTitle">{{el}}</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
										'<tr ms-for="($index,el) in @days">'+
											'<td ms-for="oItem in el" ms-class="@dayClass(oItem)" ms-click="@selectDate(oItem)">{{oItem.day}}</td>'+
										'</tr>'+
									'</tbody>'+
									'<tfoot ms-visible="!@autoClose">'+
										'<tr>'+
											'<th colspan="7" class="today" ms-click="@selectToday">今天</th>'+
										'</tr>'+
										'<tr>'+
											'<th colspan="7" class="clear" style="display: none;">清除选中</th>'+
										'</tr>'+
									'</tfoot>'+
								'</table>'+
								//'<div>时间:<input type="text" style="width:30px;" />时<input type="text" style="width:30px;" />分<input type="text" style="width:30px;" />秒</div>'+
							'</div>'+
							'<div ms-visible="@selectType==\'months\'" class="datepicker-months" style="display: block;">'+
								'<table class="table-condensed">'+
									'<thead>'+
										'<tr>'+
											'<th class="prev" style="visibility: visible;" ms-click="@year--&&@monthCaption--">«</th>'+
											'<th colspan="5" class="datepicker-switch" ms-click="@changeView(\'years\')">{{@monthCaption}}年</th>'+
											'<th class="next" style="visibility: visible;" ms-click="@year++&&@monthCaption++">»</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
										'<tr><td colspan="7">'+
											'<span ms-for="($index,el) in @monthTitle" class="month" ms-click="@selectMonth($index)">{{el}}</span>'+
										'</td></tr>'+	
									'</tbody>'+
									'<tfoot>'+
										'<tr>'+
										'<th colspan="7" class="today" ms-click="@selectToday">今天</th>'+
										'</tr>'+
										'<tr>'+
										'<th colspan="7" class="clear" style="display: none;">清除选中</th>'+
										'</tr>'+
									'</tfoot>'+
								'</table>'+
							'</div>'+
							'<div ms-visible="@selectType==\'years\'" class="datepicker-years" style="display: block;">'+
								'<table class="table-condensed">'+
									'<thead>'+
										'<tr>'+
											'<th class="prev" style="visibility: visible;" ms-click="@renderYears(@year-10)">«</th>'+
											'<th colspan="5" class="datepicker-switch">{{@yearCaption}}</th>'+
											'<th class="next" style="visibility: visible;" ms-click="@renderYears(@year+10)">»</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody>'+
										'<tr><td colspan="7">'+
											'<span ms-for="($index,el) in @years" ms-class="yearClass($index,el)" ms-click="selectYear(el)">{{el}}</span>'+
										'</td></tr>'+
									'</tbody>'+
									'<tfoot>'+
										'<tr>'+
											'<th colspan="7" class="today" ms-click="@selectToday">今天</th>'+
										'</tr>'+
										'<tr>'+
											'<th colspan="7" class="clear" style="display: none;">Clear</th>'+
										'</tr>'+
									'</tfoot>'+
								'</table>'+
							'</div>'+
					'</div>';
		return sDatePicker;
	}).call(this),
	defaults: {
		selectType:"days",//days,months,years
		weekTitle:["日","一","二","三","四","五","六"],
		monthTitle:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
		dayCaption:"2016年12月",
		monthCaption:2016,
		yearCaption:"2010-2019",
		days:[],
		years:[],
		selectedDate:{},
		autoClose:false,//点击选中后自动关闭
		isShow:false,//显示
		year:2016,
		month:11,
		changeView:function(sType){
			this.selectType=sType;
			switch(sType){
				case "days":
					this.renderDays();
					break;
				case "month":
					break;
				case "years":
					this.renderYears();
					break;
			}
		},
		selectDate:function(oItem){
			this.selectedDate=oItem;
			this.title=avalon.filters.formatDate(oItem.date,"yyyy年MM月");
			this.onSelected(oItem.date);
			if(this.autoClose==true||this.autoClose=="true") this.isShow=false;
		},
		selectMonth:function(iMonth){
			this.renderDays(this.year,iMonth);
			this.selectType="days";
		},
		selectYear:function(iYear){//选择年份
			this.year=iYear;
			this.monthCaption=iYear;
			this.selectType="months";
		},
		dayClass:function(oItem){//日期单元格的样式
			var oDate=new Date();
			var aClass=["day"];
			var iMonth=oItem.date.getMonth();
			if(iMonth<this.month) aClass.push("old");
			else if(iMonth>this.month) aClass.push("new");
			if(avalon.filters.formatDate(oItem.date)==avalon.filters.formatDate(oDate)) aClass.push("today");
			if(oItem==this.selectedDate) aClass.push("active");
			return aClass;
		},
		yearClass:function(iIndex,iYear){//年份单元格样式
			var aClass=['year'];
			if(iIndex==0) aClass.push("old");
			else if(iIndex==11) aClass.push("new");
			return aClass;
		},
		selectToday:function(){
			var oDate=new Date();
			this.renderDays(oDate.getFullYear(),oDate.getMonth());
			this.selectType="days";
		},
		renderDays:function(iYear,iMonth){//渲染日期选择界面
			var dtNow=new Date();
			iYear=iYear||dtNow.getFullYear();
			if(avalon.isNumber(iMonth)){
				if(iMonth>11) iYear++;
				else if(iMonth<0){
					iYear--;
					iMonth+=12;
				}
				iMonth%=12;
			}else iMonth=dtNow.getMonth();
			this.year=iYear;
			this.month=iMonth;
			var iDay=dtNow.getDate();//天
			var iDayCount=avalon.filters.addDays(new Date(iYear,iMonth+1,1),-1).getDate();//本月的天数
			var dtFirst=new Date(iYear,iMonth,1);//本月第一天
			var iFirstDayOfWeek=dtFirst.getDay();//本月第一天所属周几
			var iRowCount=7;//固定7行显示
			var i=0;
			//循环处理当前所有日期
			var aDate=avalon.range(iRowCount);
			var oDate=avalon.filters.addDays(dtFirst,0-iFirstDayOfWeek);
			var dtDay=null;
			//将日期放到数组内，方便循环输出
			var iRow=0;
			for(i=0;i<42;i++){//固定每个月72天
				dtDay=avalon.filters.addDays(oDate,i);
				iRow=Math.floor(i/7);
				if(!avalon.isArray(aDate[iRow])) aDate[iRow]=[];
				aDate[iRow].push({
					month:dtDay.getMonth(),
					date:dtDay,
					day:dtDay.getDate()
				});
			}
			this.dayCaption=avalon.filters.formatDate(dtFirst,"yyyy年MM月");
			this.days=aDate;
		},
		renderYears:function(iYear){//渲染年份界面
			iYear=iYear?iYear:this.year;
			this.year=iYear;
			var iStartYear=Math.floor(iYear/10)*10-1;//起始年份
			var aYears=avalon.range(iStartYear,iStartYear+12);
			this.yearCaption=aYears[1]+"-"+aYears[10];
			this.years=aYears;
		},
		onReady:function(){
			this.changeView("days");
			this.$watch("isShow",function(uValue){
				if(uValue===true) this.selectType="days";
			});
		},
		css:{//容器样式
			left:"8px",
			top:"32px",
			zIndex:10,
			position:"fixed"
		},
		show:function(oOptions){//打开界面
			oOptions=oOptions||{left:"8px",top:"32px"};
			if(oOptions.dom){//传递过来了dom，则根据dom样式定位
				var oRect=avalon(oOptions.dom).offset();
				this.css=avalon.mix(this.css.$model,{
					left:(oRect.left+8)+"px",
					top:(oRect.top-document.body.scrollTop+avalon(oOptions.dom).innerHeight())+"px"
				});
			}else{
				var iLeft=oOptions.left||8;
				var iTop=oOptions.top||32;
				this.css=avalon.mix(this.css.$model,{left:iLeft+"px",top:iTop+"px"});
			}
			if(oOptions.onSelected){
				//如果传递了回调，则使用本次传递的回调
				this.onSelected=oOptions.onSelected;
			}
			this.isShow=true;
		},
		hide:function(){
			this.isShow=false;
		},
		onSelected:avalon.noop,//onSelect(oDate)
	}
});