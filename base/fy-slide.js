/*
	author:小风风
	createDate:2016-12-14
	description:flyui的slide幻灯片插件,淡入淡出的切换效果
	animate.css动画效果已加入css

	参数
	传入数组,链接地址和图片地址
				img:[{href:"2.html",imgurl:"pgbg02.jpg"},{href:"3.html",imgurl:"pgbg03.jpg"},]
	高宽
	切换时间	changeTIme

	变量current 控制切换第几张图,
		自动循环,
		移入圆点时修改对应的值,
		移入图片时停止自动循环,移除时开启执行循环,
		点击下一页时current+1,点击上一页current-1,
 */
 avalon.component('fy-slide', {
	template: (function(){
		var slideContent="<div class=\"slider_main\" ms-css=\"{height:@height,width:@width}\" ms-mouseenter=\"@changeState(false)\" ms-mouseleave=\"@changeState(true)\">"+
				"<ul class=\"slider_list\">"+
					"<li class=\"slider_item animated\" ms-for=\"(index,el) in @img\" ms-class=\"[@current==index? 'fadeIn' : 'fadeOut' ]\">"+
						"<a  ms-attr=\"{href:el.href}\" class=\"slider_item_lk\">"+
							"<img alt=\"image\" class=\"img slider_item_img\" ms-attr=\"{href:el.href,src:el.imgurl}\">"+
						"</a>"+
					"</li>"+
				"</ul>"+
				"<div class=\"slider_indicator\" ms-css=\"{'margin-left':@slideIndexLeft}\">"+
					"<i class=\"slider_indicator_btn\" ms-for=\"(index,el) in @img\" ms-class=\"[@current==index? 'slider_indicator_btn_active' : '' ]\" ms-mouseover=\"[@current=index]\"></i>"+
				"</div>"+
				"<a href=\"javascript:void(0)\" class=\"slider_control_item slider_control_prev\" ms-click=\"@prevImg\"><i class=\"iconfont\">&lt;</i></a>"+
				"<a href=\"javascript:void(0)\" class=\"slider_control_item slider_control_next\" ms-click=\"@nextImg\"><i class=\"iconfont\">&gt;</i></a>"+
			"</div>";
		return slideContent;
	}).call(this),
	defaults: {
		height:"400px",
		width:"700px",
		img:[],// 传入数组
		slideIndexLeft:"",
		current:0,// 循环变量 控制切换
		timeId:0,
		changeTime:2000,// 切换时间
		autoChange:function(){
			var oSelf=this;
			this.timeId=setTimeout(function(){
				oSelf.changeImg();
				oSelf.autoChange();
			},this.changeTime);
		},
		nextImg:function(){
			this.changeImg();
		},
		prevImg:function(){
			if(this.current<=0){
				this.current=this.img.length-1;
			}else{
				this.current--;
			}
		},
		changeState:function(bState){
			if(bState) this.autoChange();
			else{
				clearTimeout(this.timeId);
			}
		},
		onReady:function(){
			this.autoChange();
			this.slideIndexLeft=0-12*(this.img.length);//计算圆点的位置
		},
		changeImg:function(){
			if(this.current==this.img.length-1){
				this.current=0;
			}else{
				this.current++;
			}
		},
	},
});