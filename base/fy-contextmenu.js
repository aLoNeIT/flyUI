/*
authro:小风风
createDate:2017-01-09
description:flyui的右键菜单的基础组件
 */
avalon.component("fy-contextmenu", {
	template:(function(){
		var sHtml=	'<ul ms-visible="@isShow" ms-css="{top:@menuPosition.y,left:@menuPosition.x}" class="dropdown-menu" ms-mouseleave="@autoClose?@hide():avalon.noop()">'+
						'<li ms-visible="@title==\'\'?false:true"><a href="javascript:void(0);">{{title}}</a></li>'+
						'<li ms-visible="@title==\'\'?false:true" class="divider"></li>'+
						'<li ms-for="($index,el) in @aInput">'+
							'<a href="javascript:void(0);" ms-click="@el.onClick(el)">{{el.text}}</a>'+
						'</li>'+
					'</ul>';
		return sHtml;
	}).call(this),
	defaults: {
		menuPosition:{
			x:10,y:10
		},
		offsetPosition:{
			x:0,y:0
		},
		isShow:false,//是否显示界面
		autoClose:false,//鼠标移出时自动关闭
		autoShow:true,//替换浏览器默认右键菜单
		title:"",//标题部分内容
		aInput:[],
		// aInput[传入aInput
		// {text:"",text
		// onClick:avalon.noop,传选择按钮的方法]
		show:function(sTitle,oOffsetPosition){
			var oPosition=this.getPosition();
			// offsetPosition={x:100,y:200};传入偏移量+计算
			oOffsetPosition=oOffsetPosition||this.offsetPosition;
			oPosition.x+=oOffsetPosition.x-10;
			oPosition.y+=oOffsetPosition.y-10;
			this.menuPosition=oPosition;
			this.title=sTitle||this.title;
			this.isShow=true;
		},
		hide:function(){
			this.isShow=false;
		},
		// 鼠标位置测量, 返回对象{x:10,y:20}
		getPosition:function(){
			var ev=window.event;
			if(ev.pageX || ev.pageY){
				return {x:ev.pageX, y:ev.pageY};
			}
			return {
				x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
				y:ev.clientY + document.body.scrollTop - document.body.clientTop
			};
		},
		onReady:function(){
			var oSelf=this;
			document.oncontextmenu = function(e){
				e.preventDefault();
				if(oSelf.autoShow) oSelf.show();
			};
		}
	}
});