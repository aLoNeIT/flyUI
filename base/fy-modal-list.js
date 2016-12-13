/*
	avalon组件，bootstrap引入,modal弹框,插槽插入表格或者其他内容
	需要传递表格title,和数据字段内容
 */
avalon.component('fy-modal-list', {
	template:(function(){
		// 内容表格部分
		var sHtml=	'<div class="fly-listbox-overlay" ms-click1="@hide" ms-visible="@isShow">'+
						'<div class="fly-listbox-dialog" ms-css="{width:@width}">'+
							'<div class="fly-listbox-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="fly-listbox-title" ms-text="@title"></h2>'+
								'<div class="input-group">'+
									'<input type="text" placeholder="搜索list" class="form-control" ms-duplex="@searchText | debounce(200)">'+
									'<span class="input-group-btn">'+
									'<button type="button" class="btn btn btn-primary"> <i class="fa fa-search"></i>搜索</button>'+
									'</span>'+
								'</div>'+
							'</div>'+
							'<div class="fly-listbox-body">'+
								'<ul class="list-group">'+
									'<li class="list-group-item" ms-for="($index,value) in @data" ms-text="value" ms-click="@selectData($event,$index,value)" ms-class="@selectedData[$index]?\'selectRow\':\'\'">'+
									'</li>'+
								'</ul>'+
							'</div>'+
							'<div class="fly-listbox-footer">'+
								'<button type="button" class="btn btn-primary m-r-xs" ms-click="@ok">确定</button>'+
								'<button type="button" class="btn btn-primary" ms-click="@hide">关闭</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		width:"300px",
		isShow: true,//是否显示界面
		title:"ListBox",//标题部分内容
		data:[],//纯数组
		$source:[],//原数组
		selectedData:{},
		searchText:"",
		show:function(sTitle,aData){
			sTitle=sTitle||this.title;
			this.title=sTitle;
			if(aData) this.data=aData;
			this.isShow=true;
		},
		hide:function(){
			this.isShow=false;
		},
		ok:function(){
			this.onSelected(this.selectedData);
			this.hide();
		},
		// currRow:-1,//选中行
		getSelectedClass:function(iIndex){
			if(this.selectedData[iIndex]) return "selectRow";
			else return "";
			// if(this.selectedData.length>iIndex) return "selectRow";
			for(var i=0;i<this.selectedData.length;i++){
				if(iIndex==this.selectedData[i]) return "selectRow";
			}
			return "";
		},
		multiSelect:true,//多选
		selectData:function($event,iIndex,sValue){
			if(this.multiSelect){
				var bResult=false;
				//var bResult=avalon.Array.remove(this.selectedData,iIndex);
				if(!bResult){
					this.selectedData[iIndex]=sValue;
					//this.selectedData.push(iIndex);// 多选
				}
			}else{
				// this.currRow=iIndex;
				this.selectedData=[iIndex];	
			}
		},
		onSelected:avalon.noop,
		onReady:function(){
			this.$watch("searchText",function(sValue){
				if(this.$source.length==0) this.$source=avalon.mix(this.data.$model,[]);
				//进行数据过滤
				var aData=[];
				avalon.each(this.$source,function(iIndex,oItem){
					if(oItem.indexOf(sValue)>=0) aData.push(oItem);
				});
				this.data=aData;
				avalon.log(sValue);
			})
		}
	}
});