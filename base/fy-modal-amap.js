/*
authro:aLoNe.Adams.K
createDate:2016-12-01
description: 
	avalon2组件，使用高德地图组件
	目前依赖bootstrap的样式和js
 */
avalon.component("fy-modal-amap", {
	template: (function(){
		var sHtml='<div class="fy-modal" ms-visible="@isShow">'+
						'<div class="modal-overlay" ms-click="@hide"></div>'+
						'<div class="modal-dialog animated" ms-class=\"@animateCss\" ms-css="{width:@width}">'+
							'<div class="modal-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="modal-title">拖动箭头选择地址</h2>'+
							'</div>'+
							'<div ms-attr="{id:@$domId}" ms-css="{height:@height}" style="margin:auto;"></div>'+
							'<div><input type="text" ms-attr="{id:@$searchId}" name="keyword" placeholder="请输入关键字" style="position:absolute;top:80px;left:20px;width:25%;" /></div>'+
							'<div class="modal-footer">'+
								'<button type="button" class="btn btn-primary m-r-xs" ms-click="@confirm" ms-visible="@buttons.onConfirm!=avalon.noop">确定</button>'+
								'<button type="button" class="btn btn-white" ms-click="@hide">关闭</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
	}).call(this),
	defaults: {
		$domId:"amap-content",
		width:"90%",
		height:window.document.body.offsetHeight-220+"px",//计算窗体高度
		isShow: false,
		$amap: null,//高德map组件
		$amapConfig:{
			resizeEnable:true,
			zoom:13
		},//初始化地图组件配置
		$geolocation:null,//地理位置
		$geolocationConfig:{
			enableHighAccuracy:true,
			buttonPosition:"RB"
		},//地理位置配置
		$geocoder:null,//地理编码
		$geocoderConfig:{
			//city:"全国"
		},//地理编码配置
		$position:null,//经纬度对象
		$address:"",//编码后的地理位置
		$marker:null,//标记,
		$markerConfig:{
			draggable:true,
			cursor:"move",
			raiseOnDrag:true,
			title:"拖动箭头选择地址"
		},//标记配置
		$init:false,

		$citycode:null, //城市，默认全国
		$searchId:"search-input",

		animateCss:"",
		animate:{
			show:"fadeInUp",
			hide:"fadeOutDown",
			time:500
		},
		buttons:{
			onConfirm:avalon.noop
		},
		confirm:function(){
			this.hide();
			this.buttons.onConfirm();
		},
		cbProxy: function (sFunctionName,args) {
			if(this.hasOwnProperty(sFunctionName)) this[sFunctionName].apply(this,args);
		},
		cbAddress:function(position){
			var oSelf=this;
			this.$position=position;
			this.$geocoder.getAddress(position,function(status,result){
				if(status==="complete"&&result.info==="OK"){
					oSelf.$address=result.regeocode.formattedAddress;
					oSelf.cbProxy("onGetAddress",arguments);
					console.log(result);
					oSelf.$citycode=result.regeocode.addressComponent.citycode;// 地址信息城市
				}
			});
		},
		_onShow: function(){
			var oSelf=this;
			//这里写入载入完毕后初始化的代码
			this.$amap=new AMap.Map(this.$domId,this.$amapConfig);
			this.$geocoder=new AMap.Geocoder(this.$geocoderConfig);
			this.$amap.plugin("AMap.Geolocation",function(){
				oSelf.$geolocation=new AMap.Geolocation(oSelf.$geolocationConfig);
				oSelf.$geolocation.getCurrentPosition();
				AMap.event.addListener(oSelf.$geolocation,"complete",function(data){
					oSelf.$position=data.position;
					oSelf.cbProxy("onLocationComplete",arguments);
					oSelf.cbAddress(data.position);
					// oSelf.$geocoder.getAddress(data.position,function(status,result){
					// 	if(status==="complete"&&result.info==="OK"){
					// 		oSelf.cbProxy("onGetAddress",arguments);
					// 	}
					// });
				});
				AMap.event.addListener(oSelf.$geolocation,"error",function(){
					oSelf.cbProxy("onLocationError",arguments);
				});
			});
			this.$markerConfig.position=this.$amap.getCenter();
			this.$marker=new AMap.Marker(this.$markerConfig);
			this.$marker.setMap(this.$amap);
			AMap.event.addListener(this.$marker,"dragend",function(e){
				oSelf.cbProxy("onMarkerDragend",arguments);
				oSelf.cbAddress(e.lnglat);
			});
			// 搜索框(暂订实现功能)
			this.$amap.plugin(["AMap.Autocomplete","AMap.PlaceSearch"],function(){
				this.$autocomplete=new AMap.Autocomplete({
					city:oSelf.$citycode||"",
					input:oSelf.$searchId//使用联想输入的input的id
				});
				// 搜索插件
				/*var placeSearch=new AMap.PlaceSearch({
					city:oSelf.$citycode||"", //城市，默认全国
					map:oSelf.$amap
				});*/
				AMap.event.addListener($autocomplete,"select",function(e){
					console.log(e.poi);
					// placeSearch.setCity(e.poi.adcode);
					// placeSearch.search(e.poi.name);
					// 移动marker至当前位置
					oSelf.$marker.setPosition(e.poi.location);
					oSelf.$amap.setCenter(e.poi.location);
					oSelf.cbAddress(e.poi.location);
				});
			});
		},
		onLocation:avalon.noop,
		onLocationComplete:avalon.noop,
		onLocationError:avalon.noop,
		onGetAddress:avalon.noop,
		onMarkerDragend:avalon.noop,
		getLocation:function(){
			return this.$position;
		},
		getAddress:function(){
			return this.$address;
		},
		setCenter:function(oPosition){
			if(oPosition){
				this.$amap.setCenter(new AMap.LngLat(oPosition.lng,oPosition.lat));
				this.$marker.setPosition(new AMap.LngLat(oPosition.lng,oPosition.lat));
			}
		},
		// 显示地图
		// 第一个参数 传经纬度，
		//		oPosition:{lng:0,lat:0}
		// 第二个参数 为true时不显示弹框,初始化地图获得当前所在地
		show:function(oPosition,bInit){
			bInit=bInit||false;
			if (this.$init==false) {
				this.animateCss=this.animate.show;
				this._onShow();
				this.$init=true;
			}
			this.isShow=!bInit;
			if(oPosition){
				this.setCenter(oPosition);
			}
		},
		hide:function(){
			this.isShow=false;
		}
		// 下面这样写会有marker不能拖动的bug
		// onReady:function(){
		// 	this._onShow();
		// }
	}
});