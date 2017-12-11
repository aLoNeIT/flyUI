/*
基于本项目的token处理机制，封装avalon请求和错误处理方式

token处理，获取 重新覆盖
token拼接url请求
没有token时，请求对应接口获取新token，没有refresh_token时跳转登陆，
登陆地址需要获取，没有地址挑首页

未登录时重新获取token
请求方式 post get
本地token超时。 
本地token有，但服务器token没有
*/
var logicAlert=avalon.getAlert("logic-alert");
avalon.request=function(oOptions){
	var sUrlJump=storeEx.get("login_url");// login_url获取
	var sUrl=oOptions.sUrl;
	var	oData=oOptions.oData||null;
	var bShowWait=(oOptions.bShowWait!=false);
	//var	sMethod=oOptions.sMethod||"get";
	var fnSuccess=oOptions.fnSuccess||null;
	if(bShowWait) avalon.showWait("正在执行请求","请稍等");
	oOptions.fnSuccess=function(oResult){
		if(parseInt(oResult.state)==10){
			// 服务器响应为 未登陆,跳转登陆,login_url
			//var oAlert=avalon.getAlert();
			//if(!oAlert){console.log("创建组件失败!");return;}
			logicAlert.error(oResult.mess,"跳转至登陆页面",function(){
				top.document.location.href=sUrlJump;
			});
		}else{
			if(fnSuccess) fnSuccess(oResult);
			if(bShowWait) avalon.closeWait();
		}
	};
	oOptions.fnError=function(ex){
		if(bShowWait) avalon.closeWait();
		logicAlert.error("请求异常",ex);
	};
	// 获取token
	var	sAccess_token=storeEx.get("access_token");// access_token
	var	sRefresh_token=storeEx.get("refresh_token");// refresh_token
	// 提交时 没有token 重新获取
	if(!sAccess_token){
		//var oAlert=avalon.getAlert();
		if(!sRefresh_token){
			logicAlert.error("授权失效","验证令牌已失效",function(){
				if(top=self)
					window.location.href=sUrlJump;
				else top.location.href=sUrlJump;
			});
		}else{
			// 传refresh_token
			var sUrlRefreshApi=storeEx.get("refresh_api_url");
			if(!sUrlRefreshApi){
				logicAlert.error("授权失效","验证令牌已失效",function(){
					window.location.href=sUrlJump;
				});
				return;
			}
			sUrlRefreshApi+="/"+sRefresh_token;
			avalon.get(sUrlRefreshApi,function(oResult){
				if(oResult.state==0){
					avalon.saveToken(oResult.table);
					// 重新执行 会获取到新的token
					avalon.request(oOptions);
				}else{
					logicAlert.error(oResult.mess,"返回登陆",function(){
						window.location.href=sUrlJump;
					});
				}
			});
		}
	// 请求接口时 url拼接token 判断前面是否有参数
	}else{
		if(sUrl.indexOf("?")>-1){
			sUrl+="&access_token="+sAccess_token;
		}else{
			sUrl+="?access_token="+sAccess_token;
		}
		avalon.ajax(sUrl,oData,oOptions);
	}
};
// post get delete put
avalon.postEx=function(sUrl,oData,fnSuccess,fnError){
	//if(avalon.is)
	var oOptions={
		sUrl:sUrl,
		oData:oData,
		sMethod:"post",
		fnSuccess:fnSuccess,
		fnError:fnError
		//oHeaders:{"Content-Type":"application/json"}
	};
	if(avalon.isString(oData)) oOptions.oHeaders={"Content-Type":"application/json"};
	avalon.request(oOptions);
};
avalon.getEx=function(sUrl,fnSuccess,fnError,bShowWait){
	var oOptions={
		sUrl:sUrl,
		sMethod:"get",
		fnSuccess:fnSuccess,
		fnError:fnError,
		bShowWait:(bShowWait!=false)
	};
	avalon.request(oOptions);
};
avalon.putEx=function(sUrl,oData,fnSuccess,fnError){
	if(avalon.isObject(oData)) oData=JSON.stringify(oData);
	var oOptions={
		sUrl:sUrl,
		oData:oData,
		sMethod:"put",
		fnSuccess:fnSuccess,
		fnError:fnError,
		oHeaders:{"Content-Type":"application/json"}
	};
	avalon.request(oOptions);
};
avalon.deleteEx=function(sUrl,fnSuccess,fnError){
	var oOptions={
		sUrl:sUrl,
		sMethod:"delete",
		fnSuccess:fnSuccess,
		fnError:fnError
	};
	avalon.request(oOptions);
};
// 删除函数应用
avalon.delEx=function(sUrl,fnSuccess){
	//var oAlert=avalon.getAlert(1);
	//if(!logicAlert){console.log("创建组件失败!");return;}
	logicAlert.warn("确定删除数据?","数据删除后无法恢复!",function(){
		avalon.deleteEx(sUrl,function(oResult){
			if(oResult.state==0){
				logicAlert.open({
					title:"删除成功",
					showtime:1000,
					_onConfirm:fnSuccess||avalon.noop
				});
			}else{
				logicAlert.error("删除失败",oResult.mess);
			}
		});
	});
};
// 密码重置为123456
avalon.resetPwd=function(sUrl,fnSuccess){
	fnSuccess=fnSuccess||avalon.noop;
	//var oAlert=avalon.getAlert(2);
	//if(!oAlert){console.log("创建组件失败!");return;}
	logicAlert.warn("确定重置密码？","重置后密码为123456",function(){
		avalon.getEx(sUrl,function(oResult){
			if(oResult.state==0){
				logicAlert.open({
					title:"重置成功",
					showtime:1000,
					_onConfirm:fnSuccess
				});
			}else{
				logicAlert.error("重置失败",oResult.mess);
			}
		});
	});
};
/**
 * 保存token信息
 * @param oData token信息存储对象
 * @param sUrlRefreshApi    刷新token的接口地址
 * @returns {*}
 */
avalon.saveToken=function(oData,sUrlRefreshApi){
	// 过期时间
	var iTime=(oData.expire_in-200)*1000;
	var tempTime=iTime-200000;
	storeEx.set("access_token",oData.access_token,tempTime);
	storeEx.set("refresh_token",oData.refresh_token,iTime);
	storeEx.set("refresh_api_url",sUrlRefreshApi,iTime);
	// 存储login_url用于在更新token时的跳转的url
	var login_url=document.location.href;
	storeEx.set("login_url",login_url);
	return oData.access_token;
};
/**
 * 获取本地保存的token
 * @param fnCallback 获取到有效token后会通过回调函数传递
 * @returns {*}
 */
avalon.getToken=function(fnCallback){
	var sToken=storeEx.get("access_token");
	if(!sToken){
		logicAlert.error("授权失效","验证令牌已失效",function(){
			if(top==self)
				window.location.href=storeEx.get("login_url");
			else top.location.href=storeEx.get("login_url");
		});
		return false;
	}
	if(avalon.isFunction(fnCallback)){
		fnCallback.call(this,sToken);
	}
	return sToken;
};

//上传图片
avalon.upbtn=function($event){
	var sFile=avalon($event.target).attr("target");
	document.querySelector("#"+sFile).click();
};
avalon.upimg=function(sUrl,oDom,sField,oFile,fnSuccess,fnError){
	var sToken=storeEx.get("access_token");
	if(!sToken){
		//token失效，需要跳回登录页面
		logicAlert.error("上传失败","登录已失效",function(){
			location.href=storeEx.get("login_url");
		});
	}else{
		//为失效，则处理token，上传
		if(sUrl.indexOf("?")<0) sUrl+=("?access_token="+sToken);
		else sUrl+="&access_token="+sToken;
		avalon.upload(sUrl,oDom,sField,oFile,fnSuccess,fnError);
	}
};
/**
 * 获取选中的主键数据
 * @param oData 数据源
 * @param sField    字段名
 * @param fnCallback    回调函数，将获取到的有效数据回调
 * @returns {*}
 */
avalon.getSelected=function(oData,sField,fnCallback){
	if(!oData||!sField||(avalon.isArray(oData)&&oData.length==0)||!oData[sField]){
		logicAlert.warn("操作失败","请选择有效数据");
		return false;
	}else {
		if(avalon.isFunction(fnCallback)) fnCallback.call(this,oData[sField]);
		return oData[sField];
	}
};
