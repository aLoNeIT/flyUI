/*
 avalon2组件，使用高德地图组件
 目前依赖bootstrap的样式和js
 使用方法：
 <div ms-controller="test">
 <wbr ms-widget="[{is:'ms-form'},@config]" />
 </div>

 avalon.define({
	 $id:"test",
	 config:{
		 dict:1,
		 mycontent:"fuck everywhere!"
	 }
 });
 */

avalon.component("fy-modal-amap", {
	template: (function(){
		// return '<div ms-attr="{id:@$domId}" ms-css="{width:@width,height:@height}" style="margin:auto;"></div>';
		var sHtml='<div ms-visible="@isShow">'+
		// var sHtml='<div>'+
						'<div class="fly-modal-overlay" ms-click="@hide"></div>'+
						'<div class="fly-modal-dialog" ms-css="{width:@width}">'+
							'<div class="fly-modal-header">'+
								'<button type="button" class="close" ms-click="@hide"><span>×</span><span class="sr-only">Close</span></button>'+
								'<h2 class="fly-modal-title">拖动箭头选择地址</h2>'+
							'</div>'+
							'<div ms-attr="{id:@$domId}" ms-css="{width:@width,height:@height}" style="margin:auto;"></div>'+
							'<div class="fly-modal-footer">'+
								'<button type="button" class="btn btn-primary m-r-xs" ms-click="@confirm">确定</button>'+
								'<button type="button" class="btn btn-primary" ms-click="@hide">关闭</button>'+
							'</div>'+
						'</div>'+
					'</div>';
		return sHtml;
		// var sHtml = '<div class="modal-dialog modal-lg" ms-visible="@isShow">'+
		// 				'<div class="modal-content">'+
		// 					'<div class="modal-header">'+
		// 						'<button type="button" class="close" data-dismiss="modal" ms-click="@hide"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
		// 						'<h4 class="modal-title">拖动箭头选择地址</h4>'+
		// 					'</div>'+
		// 					'<div class="modal-body">'+
		// 						'<div ms-attr="{id:@$domId}" ms-css="{width:@width,height:@height}" style="margin:auto;"></div>'+
		// 					'</div>'+
		// 					'<div class="modal-footer">'+
		// 						'<button type="button" class="btn btn-primary" data-dismiss="modal" ms-click="@hide">确定</button>'+
		// 					'</div>'+
		// 				'</div>'+
		// 			'</div>';
		// return sHtml;
	}).call(this),
	defaults: {
		$domId:"amap-content",
		width:"100%",
		height:"500px",
		isShow: false,
		$amap: null,//高德map组件
		$amapConfig:{
			resizeEnable:true,
			zoom:15
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
			raiseOnDrag:true
		},//标记配置
		$init:false,
		onConfirm:avalon.noop,
		confirm:function(){
			this.hide();
			this.onConfirm();
		}
		cbProxy: function (sFunctionName,args) {
			if(this.hasOwnProperty(sFunctionName)) this[sFunctionName].apply(this,args);
		},
		cbAddress:function(position){
			var oSelf=this;
			this.$geocoder.getAddress(position,function(status,result){
				if(status==="complete"&&result.info==="OK"){
					oSelf.$address=result.regeocode.formattedAddress;
					oSelf.cbProxy("onGetAddress",arguments);
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
					oSelf.$geocoder.getAddress(data.position,function(status,result){
						if(status==="complete"&&result.info==="OK"){
							oSelf.cbProxy("onGetAddress",arguments);
						}
					});
				});
				AMap.event.addListener(oSelf.$geolocation,"error",function(){
					oSelf.cbProxy("onLocationError",arguments);
				});
			});
			this.$markerConfig.position=this.$amap.getCenter();
			var $marker=new AMap.Marker({
				position: this.$amap.getCenter(),
				draggable: true,
				cursor: 'move',
				raiseOnDrag: true,
				title:"fuck"
			});
			$marker.setMap(this.$amap);
			AMap.event.addListener($marker,"dragend",function(e){
				oSelf.cbProxy("onMarkerDragend",arguments);
				oSelf.cbAddress(e.lnglat);
			});
			return;
			this.$marker=new AMap.Marker(this.$markerConfig);
			this.$marker.setMap(this.$amap);
			AMap.event.addListener(this.$marker,"dragend",function(e){
				oSelf.cbProxy("onMarkerDragend",arguments);
				oSelf.cbAddress(e.lnglat);
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
		show:function(){
			this.isShow=true;
			if (this.$init==false) {
				this._onShow();
				this.$init=true;
			}
		},
		hide:function(){
			this.isShow=false;
		}
	}
});