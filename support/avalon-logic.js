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

avalon.request=function(oOptions){
	var sUrlJump=storeEx.get("login_url");// login_url获取
	var sUrl=oOptions.sUrl;
	var	oData=oOptions.oData||null;
	//var	sMethod=oOptions.sMethod||"get";
	var fnSuccess=oOptions.fnSuccess||null;
	oOptions.fnSuccess=function(oResult){
		if(parseInt(oResult.state)==10){
			// 服务器响应为 未登陆,跳转登陆,login_url
			var oAlert=avalon.getAlert();
			if(!oAlert){console.log("创建组件失败!");return;}
			oAlert.error(oResult.mess,"跳转至登陆页面",function(){
				window.location.href=sUrlJump;
			});
		// }else if(oResult.state==0){
		// 	if(fnSuccess) fnSuccess(oResult);
		}else{
			// oAlert.error("错误码"+oResult.state,oResult.mess);
			if(fnSuccess) fnSuccess(oResult);
		}
		// switch(oResult.state){
		// 	case 0:function(){};break;
		// 	case 10:function(){};break;
		// 	default:function(){};break;
		// }
	}
	//var	fnError=oOptions.fnError||null;
	// 获取token
	var	sAccess_token=storeEx.get("access_token");// access_token
	var	sRefresh_token=storeEx.get("refresh_token");// refresh_token
	var	sExpire_in=storeEx.get("expire_in");// 过期时间(秒)
	// 提交时 没有token 重新获取
	if(!sAccess_token){
		var oAlert=avalon.getAlert();
		if(!sRefresh_token){
			// access_token和refresh_token都没有时 跳转登陆,login_url
			oAlert.error("出错啦！","返回登陆",function(){
				window.location.href=sUrlJump;
			});
		}else{
			// 传refresh_token
			var sUrlToken="/v1/index/token/refresh_token/"+sRefresh_token;
			avalon.get(sUrlToken,function(oResult){
				if(oResult.state==0){
					var oToken=oResult.table.token;
					var sTime=oToken.expire_in*1000;
					var tempTime=sTime-200000;
					storeEx.set("adm_id",oResult.table.adm_id);
					storeEx.set("access_token",oToken.access_token,tempTime);
					storeEx.set("refresh_token",oToken.refresh_token,sTime);
					// 重新执行 会获取到新的token
					avalon.request(oOptions);
				}else{
					oAlert.error(oResult.mess,"返回登陆",function(){
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
}
// post get delete put
avalon.postEx=function(sUrl,oData,fnSuccess,fnError){
	var oOptions={
		sUrl:sUrl,
		oData:oData,
		sMethod:"post",
		fnSuccess:fnSuccess,
		fnError:fnError
	}
	avalon.request(oOptions);
}
avalon.getEx=function(sUrl,fnSuccess,fnError){
	var oOptions={
		sUrl:sUrl,
		sMethod:"get",
		fnSuccess:fnSuccess,
		fnError:fnError
	}
	avalon.request(oOptions);
}
avalon.putEx=function(sUrl,oData,fnSuccess,fnError){
	if(avalon.isObject(oData)) oData=JSON.stringify(oData);
	var oOptions={
		sUrl:sUrl,
		oData:oData,
		sMethod:"put",
		fnSuccess:fnSuccess,
		fnError:fnError,
		oHeaders:{"Content-Type":"application/json"}
	}
	avalon.request(oOptions);
}
avalon.deleteEx=function(sUrl,fnSuccess,fnError){
	var oOptions={
		sUrl:sUrl,
		sMethod:"delete",
		fnSuccess:fnSuccess,
		fnError:fnError
	}
	avalon.request(oOptions);
}
// 删除函数应用
avalon.delEx=function(sUrl,fnSuccess){
	var oAlert=avalon.getAlert(1);
	if(!oAlert){console.log("创建组件失败!");return;}
	oAlert.warn("确定删除数据?","数据删除后无法恢复!",function(){
		avalon.deleteEx(sUrl,function(oResult){
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
// 密码重置为123456
avalon.restPwd=function(sUrl,fnSuccess){
	var fnSuccess=fnSuccess||avalon.noop;
	var oAlert=avalon.getAlert(2);
	if(!oAlert){console.log("创建组件失败!");return;}
	oAlert.warn("确定重置密码？","重置后密码为123456",function(){
		avalon.getEx(sUrl,function(oResult){
			if(oResult.state==0){
				oAlert.open({
					title:"重置成功",
					showtime:1000,
					_onConfirm:fnSuccess
				});
			}else{
				oAlert.error("重置失败",oResult.mess);
			}
		});
	});
}