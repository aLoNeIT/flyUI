/**
 * 用于弹出层置顶
 * @type {number}
 */
avalon.zIndex=10000;
avalon.readyon = function (callback) {
	///兼容FF,Google
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', function () {
			document.removeEventListener('DOMContentLoaded', arguments.callee, false);
			callback();
		}, false)
	}
	//兼容IE
	else if (document.attachEvent) {
		document.attachEvent('onreadytstatechange', function () {
			if (document.readyState == "complete") {
				document.detachEvent("onreadystatechange", arguments.callee);
				callback();
			}
		})
	}
	else if (document.lastChild == document.body) {
		callback();
	}
};
//需要fetch-pollyfill组件支持
avalon.ajax=function(sUrl,oData,options){
	var fnSuccess=options.fnSuccess||null;
	var fnError=options.fnError||null;
	var sType=options.sType||"json";
	var sMethod=options.sMethod||"GET";
	var oHeaders=options.oHeaders||{};//请求头信息
	var sCredentials=options.sCredentials||"";//是否携带cookie，include表示携带
	fetch(sUrl,{
		method:sMethod,
		headers:oHeaders,
		credentials:sCredentials,
		body:oData
	}).then(function(oResponse){
		switch(sType){
			case "text":
			case "html":return oResponse.text();
			case "json":return oResponse.json();
			default:return oResponse.blob();
		}
	}).then(function(oResult){
		if(fnSuccess) fnSuccess(oResult);
	}).catch(function(ex){
		if(fnError) fnError(ex);
	});
};

avalon.post=function(sUrl,oData,fnSuccess,fnError){
	var options={
		sMethod:"post",
		fnSuccess:fnSuccess,
		fnError:fnError
	};
	if(avalon.isString(oData)) options.oHeaders={"Content-Type":"application/json"};
	avalon.ajax(sUrl,oData,options);
};

avalon.get=function(sUrl,fnSuccess,fnError){
	var options={
		sMethod:"get",
		fnSuccess:fnSuccess,
		fnError:fnError
	};
	avalon.ajax(sUrl,null,options);
};

avalon.put=function(sUrl,oData,fnSuccess,fnError){
	var options={
		sMethod:"put",
		fnSuccess:fnSuccess,
		fnError:fnError
	};
	if(avalon.isString(oData)) options.oHeaders={"Content-Type":"application/json"};
	avalon.ajax(sUrl,oData,options);
};

avalon.delete=function(sUrl,oData,fnSuccess,fnError){
	var options={
		sMethod:"delete",
		fnSuccess:fnSuccess,
		fnError:fnError
	};
	avalon.ajax(sUrl,oData,options);
};

avalon.del=function(iId,sUrl,jumpUrl){
	fyAlert("确定删除数据","数据删除后无法恢复",function(){
		avalon.get(sUrl+iId,function(oResult){
			if(oResult.state==0){
				fyAlert("删除成功","正在跳转...",function(){
					window.location.href=jumpUrl;
				});
				setTimeout(function(){
					window.location.href=jumpUrl;
				},1000);
			}else{
				fyAlert("删除失败",oResult.mess,null,"error");
			}
		});
	},"warning",function(){});
};

avalon.delex=function(sUrl,fnSuccess){
	var oAlert=avalon.getAlert(1);
	if(!oAlert){console.log("创建组件失败!");return;}
	oAlert.warn("确定删除数据","数据删除后无法恢复",function(){
		avalon.get(sUrl,function(oResult){
			if(oResult.state==0){
				oAlert.open({
					title:"删除成功",
					showtime:1000,
					_onConfirm:fnSuccess||avalon.noop
				});
			}else{
				oAlert.error("删除失败",oResult.mess);
			}
		});
	});
};
/*
	upload 上传文件
	@param  sUrl 链接
			oFile 文件
			fuSuccess fnError 回调函数
*/
avalon.upload=function(sUrl,oDom,sField,oFile,fnSuccess,fnError){
	var oData=new FormData();
	oData.append(sField,oFile);
	var sName=oDom.value;
	oDom.value="上传中...";
	oDom.setAttribute("disabled","");
	avalon.post(sUrl,oData,function(oResult){
		oDom.value=sName;
		oDom.removeAttribute("disabled");
		if(avalon.isFunction(fnSuccess)) fnSuccess(oResult);
	},function(sError){
		oDom.value=sName;
		oDom.removeAttribute("disabled");
		if(avalon.isFunction(fnError)) fnError(sError);
	});
};

/*
	点击按钮时执行upButton,做操作点击隐藏的input.
	上传图片的函数
	参数:
	el			avalon自带,self,
	sField		 ,
	sId			选择器名,用于获得vm,
	oVar		vm[oVar]成功回调时用于修改对应input的值
	sUrl			上传url,有默认值
	成功回调和失败回调函数,可以绑定一个avalon函数,vm.success:function(){}
*/
avalon.upButton=function(e){
	var btn=e.target.getAttribute("target");
	document.querySelector("#"+btn).click();
}
avalon.upImage=function(e,sField,sId,oVar,fnSuccess,fnError,sUrl){
	var oAlert=avalon.getAlert(1);
	if(!oAlert){console.log("创建组件失败!");return;}
	if(e.target.value==""){
		return;
	}else {
		var access_token=storeEx.get("access_token"),
		sUrl=sUrl||"./index/fileupload.html?access_token="+access_token;
		var btn=e.target.getAttribute("target");
		var oDom=document.querySelector("#"+btn);
		oDom.value="上传中...";
		oDom.setAttribute("disabled","");
		var isUp=true;
		var data = new FormData();
		data.append(sField, e.target.files[0]);
		var vm=avalon.vmodels[sId];
		avalon.postEx(sUrl,data,function(oResult){
			if(oResult.state==0){
				oDom.value="选择图片";
				oDom.removeAttribute("disabled");
				vm[oVar]=oResult.mess;
				if(avalon.isFunction(fnSuccess)) fnSuccess(oResult); 
			}else{
				oAlert.error(oResult.mess);
				oDom.value="选择图片";
				oDom.removeAttribute("disabled");
				if(avalon.isFunction(fnError)) fnError(oResult); 
			}
		},function(ex){
			oAlert.error(ex);
			oDom.value="选择图片";
			oDom.removeAttribute("disabled");
			if(avalon.isFunction(fnError)) fnError({
				state:1,
				mess:ex
			}); 
		});
	}
}

/*
	初始化图片预览
	依赖:blueimp-gallery
*/
avalon.imgPreview=function(sUrl){
	// var sUrl=$("#"+$(this).attr("target")).val();
	fyImgPreview(sUrl);
}
/*
	图片预览
	uUrl，图片的路径
*/
function fyImgPreview(uUrl){
	//先判断当前页面是否存在必要的dom元素
	if($(".lightBoxGallery").length==0){
		//创建元素
		var oBody=$("<div class=\"lightBoxGallery\">"
			+"<div id=\"blueimp-gallery\" class=\"blueimp-gallery\">"
			+"<div class=\"slides\"></div><h3 class=\"title\"></h3><a class=\"prev\">‹</a>"
			+"<a class=\"next\">›</a><a class=\"close\">×</a><a class=\"play-pause\"></a>"
			+"<ol class=\"indicator\"></ol>"
			+"</div></div>");
		$("body").append(oBody);
	}
	var aUrl=null;
	if(Object.prototype.toString.call(uUrl) === "[object Array]"){
		aUrl=uUrl;
	}else{
		aUrl=[uUrl];
	}
	var oGallery = blueimp.Gallery(aUrl);
	oGallery.slide(0, 500);
}
/*
	返回上一页
*/
avalon.backurl=function(){
	history.back();
}
/*
	判断是否字符串
	@param uObj 待判断的变量
	@return     返回判断结果
 */
avalon.isString=function(uObj){
	return avalon.type(uObj)=="string";
};

/*
	获取url里的参数
	用正则表达式获取地址栏参数
	@return     返回参数
	调用方法:
	alert(GetQueryString("参数名1"));
	alert(GetQueryString("参数名2"));
 */
avalon.getQueryString=function(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return "";
};
avalon.params=[];
avalon.currUrl="";//当前url
/**
 * 获取当前页面链接参数
 * @param sName  参数名
 * @returns {*}
 */
avalon.getParam=function(sName){
	var sUrl=encodeURI(window.location.href);
	if(avalon.currUrl!=sUrl){
		avalon.params=[];
		avalon.currUrl=sUrl;
	}
	if(avalon.params.length==0){
		//不存在参数，则重新获取
		if(sUrl.indexOf("?")<0) return;
		var aParams=sUrl.split("?");
		if(aParams.length<2) return;
		var sParam=aParams[1];
		aParams=sParam.split("&");
		for(var i=0;i<aParams.length;i++){
			var aTmp=aParams[i].split("=");
			avalon.params[aTmp[0]]=aTmp[1];
		}
	}
	return avalon.params[sName];
}
/*
 判断是否字符串
 @param uObj 待判断的变量
 @return     返回判断结果
 */
avalon.isArray=function(uObj){
	return avalon.type(uObj)=="array";
};

avalon.isNumber=function(uObj){
	return avalon.type(uObj)=="number";
}

/*
	modal-tip插件用 用于合并属性方法
	min()返回第一个参数
	avalon.mix(vm.config.tip,avalon.comConfig(sName,sproperty),{
		sproperty.name:""
	})
 */
avalon.comConfig=function(sName,sProperty){
	if(avalon.components[sName]&&avalon.components[sName].defaults.hasOwnProperty(sProperty))
		return avalon.components[sName].defaults[sProperty];
	else return null;
};

//对象转url参数
avalon.param=function(obj){
	if(avalon.isObject(obj)){
		var arr=[];
		for(var i in obj){
			var str=i+"="+obj[i];
			arr.push(str);
		}
		var sUrl=arr.join("&");
		return sUrl;
	}
}
/*
	生成url
	@param  sUrl    网址
	@param  uParam  请求参数，可以为string、object、array
	@param  sHost   服务器地址，可为空
	@return         返回处理生成好的完整url
 */
avalon.url=function(sUrl,uParam,sHost){
	sHost=sHost||"";
	var sParam="";
	if(avalon.isString(uParam)) sParam=uParam;
	else if(avalon.isArray(uParam)) sParam=uParam.join("&");
	else if(avalon.isObject(uParam)){
		avalon.each(uParam,function(k,v){
			if(sParam=="") sParam=k+"="+v;
			else sParam+="&"+k+"="+v;
		});
	}
	return sHost+sUrl+(avalon.config.suffix?avalon.config.suffix:".html")+(sParam==""?"":"?"+sParam);
};
/*
	获取字典数据
	@param  iId     字典编号
	@param  fnCallback(oDict)  获取到数据后的回调
	@depency    需要store.js支持
 */
avalon.getDict=function(iId,fnSuccess,fnError){
	var oObj=storeEx.get("dict_"+iId);
	if(oObj) fnSuccess(oObj);
	else {
		var sUrl="http://www.qbdongdong.com/v1/common/dict/"+iId+".json";
		//var sUrl = avalon.config.apiurl + iId + ".json";
		avalon.get(sUrl, function (oResult) {
			if (oResult.state == 0) {
				storeEx.set("dict_"+iId,oObj,7200);
				//将获取到的dict数据返回
				fnSuccess(oResult.table);
			}
		}, fnError);
	}
};
/*
 获取字典数据项
 @param  iId     字典编号
 @param  fnCallback(oDict)  获取到数据后的回调
 @depency    需要store.js支持
 */
avalon.getDictItem=function(iId,fnSuccess,fnError){
	var oObj=storeEx.get("dict_"+iId);
	if(oObj) fnSuccess(oObj);
	else {
		var sUrl="http://www.qbdongdong.com/v1/common/dict_item/"+iId+".json";
		//ar sUrl = avalon.config.apiurl + iId + ".json";
		avalon.get(sUrl, function (oResult) {
			if (oResult.state == 0) {
				storeEx.set("dict_"+iId,oResult.table,7200000);
				//将获取到的dict数据返回
				fnSuccess(oResult.table);
			}
		}, fnError);
	}
};

avalon.keyTable=function(iDict){
	var oData=document.getElementById("data_"+iDict);
	var oVm=avalon.vmodels["data_"+iDict];
	if(!oVm){
		//生成组件
		var oController=document.createElement("div");
		oController.setAttribute("ms-controller","data_"+iDict);
		oController.id="data_"+iDict;
		oController.innerHTML="<wbr ms-widget=\"[{is:'ms-data'},@config]\" />";
		document.body.appendChild(oController);
		avalon.define({
			$id:"data_"+iDict,
			isShow:true,
			config:{
				isShow:false
			}
		});
		avalon.scan(oController);
	}
	return oVm;
};

avalon.keyValue=function(str,pattern){
	if(typeof(str)=="number") str=String(str);
	pattern=pattern||"-";
	if(str.indexOf(pattern)>=0){
		var result=str.split("-");
		return result[0];
	}else return str;
};

avalon.keyShow=function(str,pattern){
	pattern=pattern||"-";
	if(str.indexOf(pattern)>=0){
		var result=str.split("-");
		if(result.length>1) return result[1];
		else return result[0];
	}else return str;
};

avalon.formatDateTime=function(oDate,sFormat){
	var o = {
		"M+" : oDate.getMonth()+1,				 //月份
		"d+" : oDate.getDate(),					//日
		"H+" : oDate.getHours(),				   //小时
		"m+" : oDate.getMinutes(),				 //分
		"s+" : oDate.getSeconds(),				 //秒
		"q+" : Math.floor((oDate.getMonth()+3)/3), //季度
		"S"  : oDate.getMilliseconds()			 //毫秒
	};
	if(/(y+)/.test(sFormat)) {
		sFormat=sFormat.replace(RegExp.$1, (oDate.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(sFormat)){
			sFormat = sFormat.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return sFormat;
};

/*
*日期格式化
*/
avalon.filters.unixdate = function(iSecond,sFormat){
	if(0==iSecond) return "";
	iSecond=iSecond||avalon.curTime();
	sFormat = sFormat || "yyyy-MM-dd";
	return avalon.filters.date(iSecond*1000,sFormat);
}
avalon.filters.unixdateEx=function(iSecond,sFormat){
	iSecond=iSecond||avalon.curTime();
	sFormat=sFormat||"yyyy-MM-dd HH:mm:ss";
	return avalon.filters.date(iSecond*1000,sFormat);
};
avalon.filters.addDays=function(oDate,iDay){
	var dtResult=new Date(oDate);
	dtResult.setDate(oDate.getDate() + iDay);
	return dtResult;
};
avalon.filters.formatDate=function(oDate,sFormat){
	sFormat=sFormat||"yyyy-MM-dd HH:mm:ss";
	sFormat = avalon.filters.replace(sFormat, "yyyy", oDate.getFullYear());
	sFormat = avalon.filters.replace(sFormat, "MM", avalon.filters.getFullMonth(oDate));
	sFormat = avalon.filters.replace(sFormat, "dd", avalon.filters.getFullDate(oDate));
	sFormat = avalon.filters.replace(sFormat, "HH", avalon.filters.getFullHour(oDate));
	return sFormat;
};
avalon.filters.getFullMonth=function(oDate){
	var v = oDate.getMonth() + 1;
	if (v > 9) return v.toString();
	return "0" + v;
};

avalon.filters.getFullDate=function(oDate){
	var v = oDate.getDate();
	if (v > 9) return v.toString();
	return "0" + v;
};

avalon.filters.getFullHour=function(oDate){
	var v = oDate.getHours();
	if (v > 9) return v.toString();
	return "0" + v;
};

avalon.filters.replace=function(sSrc, sOld, sNew) {
	return sSrc.split(sOld).join(sNew);
};

avalon.filters.contains=function(oValue,aData){
	for(var i=0;i<aData.length;i++){
		if(oValue==aData[i]) return true;
	}
	return false;
}

/*
 *	avalon 时间日期处理函数
*/
avalon.dateToUnix=function(uDate){
	var f = uDate.split(' ', 2);
	var d = (f[0] ? f[0] : '').split('-', 3);
	var t = (f[1] ? f[1] : '').split(':', 3);
	return (new Date(
		parseInt(d[0], 10) || null,
		(parseInt(d[1], 10) || 1) - 1,
		parseInt(d[2], 10) || null,
		parseInt(t[0], 10) || null,
		parseInt(t[1], 10) || null,
		parseInt(t[2], 10) || null
		)).getTime() / 1000;
};

avalon.curTime=function(){
	return Date.parse(new Date())/1000;
};

avalon.unixToDate=function(unixTime, isFull, timeZone) {
	unixTime=unixTime||avalon.curTime();
	isFull=isFull!==false;
	if(avalon.isNumber(timeZone)){
		unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
	}else{
		unixTime = parseInt(unixTime) - parseInt((new Date()).getTimezoneOffset()) * 60;//1482769095
	}
	var time = new Date(unixTime * 1000);
	var ymdhis = "";
	ymdhis += time.getUTCFullYear() + "-";
	ymdhis += (time.getUTCMonth()+1) + "-";
	ymdhis += time.getUTCDate();
	if (isFull === true){
		ymdhis += " " + time.getUTCHours() + ":";
		ymdhis += time.getUTCMinutes() + ":";
		ymdhis += time.getUTCSeconds();
	}
	return ymdhis;
};

avalon.showWait=function(sTitle,sText){
	if(!avalon.fyWait){
		avalon.fyWait=avalon.getAlert("fy-alert","fyWait");
	}
	avalon.fyWait.wait(sTitle,sText);
};

avalon.closeWait=function(){
	if(avalon.fyWait) avalon.fyWait.hide();
};

/*
  组件继承
  sComName,组件名称
  sComParentName,父组件名称
  sTemplate,组件模板
  oDefaults,配置对象
*/
avalon.extendComponent=function(sComName,sComParentName,oDefaults,sTemplate){
	var oParent=avalon.components[sComParentName];
	if(!oParent) return;//不存在组件则直接退出
	sTemplate=sTemplate||null;
	oDefaults.$parents={};
	avalon.each(oParent.defaults,function(k,v){
		oDefaults.$parents[sComParentName+"_"+k]=v;
	});
	oDefaults.inherited=function(sPropertyName,sParentName,oParams){
		if(avalon.isString(sPropertyName)&&avalon.isString(sParentName)&&this.$parents[sParentName + "_" +sPropertyName]) return  this.$parents[sParentName + "_" +sPropertyName];
		else return null;
	}
	var oConfig={//子组件配置项
		displayName:sComName,
		parentName:sComParentName,
		defaults:oDefaults
	};
	if(sTemplate) oConfig.template=sTemplate;
	oParent.extend(oConfig);
};

//参数:组件名称,
//avalon.fyComponentId={};
avalon.createComponent=function(sComName,sComId,oConfig){
	var oComponent=avalon.vmodels[sComId]||avalon.vmodels[sComName+"_"+sComId];
	if(!oComponent){
		//检查是否创建过controller对象
		var oVm=document.getElementById("fy_component");
		if(!oVm){
			//不存在则新建controller对象
			oVm=document.createElement("div");
			avalon(oVm).attr("id","fy_component");
			avalon(oVm).attr("ms-controller","fy_component");
			document.body.appendChild(oVm);
			avalon.define({
				$id:"fy_component"
			});
		}
		//从组件池中获取该对象最新的id
		var iId=1;
		if(!avalon.componentPool[sComName]){
			avalon.componentPool[sComName]={
				id:1,
				components:{}
			}
		}else{
			iId=avalon.componentPool[sComName].id;
		}
		//var iId=avalon.fyComponentId[sComName]?avalon.fyComponentId[sComName]:1;
		sComId=sComName+"_"+(iId++);
		//avalon.fyComponentId[sComName]=iId;
		var oDiv=document.createElement("div");
		avalon(oDiv).attr("id",sComId);
		oDiv.innerHTML='<wbr ms-widget="{is:\''+sComName+'\',$id:\''+sComId+'\'}" />';
		oVm.appendChild(oDiv);
		avalon.scan(oVm);
		oComponent=avalon.vmodels[sComId];
		//合并配置项
		if(oConfig) oComponent=avalon.mix(oComponent.$model,oConfig);
		//创建成功，则将新创建的组件写入到对象池中
		avalon.componentPool[sComName].id=iId;
		avalon.componentPool[sComName].components[iId]={
			state:1,//可用
			obj:oComponent
		}
	}
	return oComponent;
};
/*组件对象池
{
	"fy-alert":{
		id:1,//当前可用id序号，自增
		max:0,//最大数量，0代表不限制
		components:{//对象集合
			1:{//对象序号值
				state:1,//对象当前状态
				obj:{}//具体的对象引用
			}
		}
	},
	"fy-grid":{
		id:2,//当前可用id序号，自增
		components:{//对象集合
			1:{//对象序号值
				state:1,//对象当前状态
				obj:{}//具体的对象引用
			},
			2:{//对象序号值
				state:0,//对象当前状态，不可用
				obj:{}//具体的对象引用
			}
		}
	}
}
*/
avalon.componentPool={};
/*
  创建新组件
*/
avalon.addComponent=function(sComName,sComId){
	var iId=0;
	avalon.resetComponent(sComName,true);
	if(avalon.componentPool[sComName].max==0||avalon.componentPool[sComName].components.length<avalon.componentPool[sComName].max){
		//判断组件池已生成是否达到上限
		//检查是否创建过controller对象
		var oVm=document.getElementById("fy_component");
		if(!oVm){
			//不存在则新建controller对象
			oVm=document.createElement("div");
			avalon(oVm).attr("id","fy_component");
			avalon(oVm).attr("ms-controller","fy_component");
			document.body.appendChild(oVm);
			avalon.define({
				$id:"fy_component"
			});
		}
		//从组件池中获取该对象最新的id
		var iId=avalon.componentPool[sComName].id;
		sComId=sComId||sComName+"_"+(iId++);
		var oDiv=document.createElement("div");
		avalon(oDiv).attr("id",sComId);
		oDiv.innerHTML='<wbr cache="true" ms-widget="{is:\''+sComName+'\',$id:\''+sComId+'\'}" />';
		oVm.appendChild(oDiv);
		avalon.scan(oVm);
		var oComponent=avalon.vmodels[sComId];
		if(!oComponent) return 0;//生成组件失败
		//创建成功，则将新创建的组件写入到对象池中
		avalon.componentPool[sComName].id=iId;
		avalon.componentPool[sComName].components[iId]={
			state:1,
			obj:oComponent
		}
	}
	return iId;
};
/*
  从对象池获取对象
*/
avalon.getComponent=function(sComName,uComId){
	var oComponent=null;
	if(avalon.isString(uComId)){//根据名字获取
		oComponent = avalon.vmodels[uComId]||null;
		if(!oComponent){
			//组件未获取到，创建新组件
			var iId=avalon.addComponent(sComName,uComId);
			oComponent=iId>0?avalon.getComponent(sComName,iId):null;
		}
	}else{
		//这里需要先检查池中是否有对应的对象资源
		avalon.resetComponent(sComName,true);
		if(avalon.isNumber(uComId)){
			if(avalon.componentPool[sComName].components[uComId]&&avalon.componentPool[sComName].components[uComId].state==1){
				oComponent=avalon.componentPool[sComName].components[uComId].obj;
				avalon.componentPool[sComName].components[uComId].state=0;
			}
		}else if(true===uComId||!uComId){//从对象池获取一个可用对象
			//遍历该组件
			avalon.each(avalon.componentPool[sComName].components,function(k,v){
				if(v.state==1) {
					oComponent=v.obj;
					v.state=0;
					return false;
				}
			});
			if(!oComponent){
				//组件未获取到，创建新组件
				var iId=avalon.addComponent(sComName);
				oComponent=iId>0?avalon.getComponent(sComName,iId):null;
			}
		}
	}
	return oComponent;
};

/*
  归还借出的对象
*/
avalon.returnComponent=function(sComName,oComponent){
	if(!oComponent) return;
	if(!avalon.componentPool[sComName]) return;
	avalon.each(avalon.componentPool[sComName].components,function(k,v){
		if(v.obj===oComponent){
			v.state=1;//归还借出的对象
			return false;//终止
		}
	});
};

/*
  清理某个类型的组件
*/
avalon.clearComponent=function(sComName){
	
};
/*
  重置组件
  uInit为true的时候，初始化该类型组件
  可以考虑每个组件提供重置函数
*/
avalon.resetComponent=function(sComName,uInit,iMax){
	if(true===uInit){
		//当对象池没有该组件时候，只进行初始化
		if(!avalon.componentPool[sComName]){
			avalon.componentPool[sComName]={
				id:1,
				max:iMax||0,
				components:{}
			}
		}
		return;
	}else{
		//对象池该该类型组件进行状态复位
		if(!avalon.componentPool[sComName]) return;
		var oItem=null;
		if(avalon.isNumber(uInit)){
			//如果是数字，根据数字获取
			oItem=avalon.componentPool[sComName].components[uInit];
			if(oItem) oItem.state=1;
		}else{
			//将对象池该类型所有对象状态重置
			avalon.each(avalon.componentPool[sComname],function(k,v){
				v.state=1;
			});
		}
	}
}
