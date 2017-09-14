/*
	avalon组件，bootstrap引入,modal弹框,插槽插入表格或者其他内容
	需要传递表格title,和数据字段内容
 */
avalon.component('fy-modal-list', {
	template:(function(){
		// 内容表格部分
		var sHtml='<div class="fly-modal" ms-visible="@isShow">'+
						'<div class="fly-modal-overlay" ms-click="@hide"></div>'+
						'<div class="fly-modal-dialog modal-lg animated" ms-class=\"@animateCss\" ms-css="{width:@width}">'+
							'<div class="fly-modal-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="fly-modal-title" ms-text="@title"></h2>'+
								'<div class="input-group">'+
									'<input type="text" placeholder="搜索列表" class="form-control" ms-duplex="@searchText | debounce(200)">'+
									'<span class="input-group-btn">'+
									'<button type="button" class="btn btn btn-primary"> <i class="fa fa-search"></i>搜索</button>'+
									'</span>'+
								'</div>'+
							'</div>'+
							'<div class="fly-modal-body" ms-css="{height:@height}">'+
								'<ul class="list-group">'+
									'<li class="list-group-item" ms-for="($index,value) in @data | filterBy(@search)" ' +
										'ms-text="value" ms-click="@selectData($event,$index,value) | stop" ' +
										'ms-dblclick="@selectData($event,$index,value,true) | stop" '+
										'ms-class="getSelectedClass($index)">'+
									'</li>'+
								'</ul>'+
							'</div>'+
							'<div class="fly-modal-footer">'+
								'<button type="button" class="btn btn-primary m-r-xs" ms-click="@confirm">确定</button>'+
								'<button type="button" class="btn btn-primary" ms-click="@hide">关闭</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		height:"300px",
		autoHeight:false,
		width:"300px",//list宽度
		isShow: false,//是否显示界面
		title:"listbox",//标题部分内容
		data:[],//纯数组
		$source:[],//原数组
		selectedData:[],//选中的数据
		searchText:"",//查询的文本
		animateCss:"",
		animate:{
			show:"fadeInUp",
			hide:"fadeOutDown",
			time:500
		},
		search:function(oItem,iIndex){//查询过滤器，不过暂时无效果
			var sText=this.searchText||"";
			return oItem.indexOf(sText)>=0;
		},
		reset:function(){
			this.title="listbox";
			this.data=[];
			this.$source=[];
			this.searchText="";
			this.selectedData=[];
		},
		show:function(sTitle,aData){
			this.reset();
			this.title=sTitle||this.title;
			this.title=sTitle;
			if(aData) this.data=aData;
			this.animateCss=this.animate.show;
			this.isShow=true;
			if(this.autoHeight===true){
				//自动计算高度，上下预留20px;
				this.height=(avalon(document.body).outerHeight()-270)+"px";
			}
		},
		hide:function(){
			var oSelf=this;
			this.animateCss=this.animate.hide;
			this.data=[];
			if(this.animate.time>0){
				setTimeout(function(){
					oSelf.isShow=false;
				},this.animate.time);
			}else{
				this.isShow=false;
			}
		},
		confirm:function(){
			var uData=null;
			if(this.multiSelect){
				//多选情况，返回的是一个数组
				uData=[];
				avalon.each(this.selectedData.$model,function(iIndex,oItem){
					uData.push(oItem.value);
				});
			}else{
				uData=this.selectedData.length>0?this.selectedData[0].value:"";
			}
			this.onSelected(uData);
			this.hide();
		},
		// currRow:-1,//选中行
		getSelectedClass:function(iIndex){
			var sCss="";
			if(this.multiSelect){
				//多选
				avalon.each(this.selectedData,function($index,oItem){
					if(iIndex==oItem.index){
						sCss="selectedRow";
						return false;
					}
				});
			}else{
				if(this.selectedData.length>0&&iIndex==this.selectedData[0].index)
					sCss="selectedRow";
			}
			return sCss;
		},
		multiSelect:false,//多选
		selectData:function($event,iIndex,sValue,bDbclick){
			bDbclick=bDbclick===true;
			if(this.multiSelect){
				var bFind=false;
				for(var i=0;i<this.selectedData.length;i++){
					if(this.selectedData[i].index==iIndex){
						bFind=true;
						avalon.Array.removeAt(this.selectedData,i);
						break;
					}
				}
				if(!bFind){
					this.selectedData.push({
						index:iIndex,
						value:sValue
					});
				}
			}else{
				this.selectedData=[{
					index:iIndex,
					value:sValue
				}];
			}
			if(bDbclick) this.confirm();
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
				this.selectedData=[];
				this.data=aData;
			})
		}
	}
});