/*
author:aLoNe.Adams.K
createDate:2017-06-01
description:flyui的包含顶部功能按钮，主题数据区，底部分页模块
 */
avalon.component("fy-form", {
	template:(function(){
		// 内容表格部分
		var sContent='<div>'
						+'<div class="wrapper wrapper-content" ms-visible="@isShow">'
							+'<div class="row">'
								+'<div class="col-sm-12">'
									+'<div class="ibox">'
										+'<div class="ibox-title">'
											+'<h2>{{@title}}</h2>'
										+'</div>'
										+'<div class="ibox-content">'
											+'<div ms-html="@tips"></div>'
											+'<div class="row m-t">'
												+'<div class="col-sm-12">'
													+'<form class="form-horizontal" action="#" id="form" ms-validate="@validate">'
														+'<div class="form-group" ms-for="($key,el) in @fields" ms-visible="!el.noinput">'
															+'<label class="col-sm-2 control-label" ms-html="@getNameHtml($key,el)"></label>'
															+'<div ms-html="@getFieldHtml($key,el)" ms-class="@getFieldCss($key,el)">'

															+'</div>'
															+'<span class="help-block m-b-none text-danger"></span>'
														+'</div>'
														+'<div class="hr-line-dashed"></div>'
														+'<div class="col-sm-offset-2">'
															+'<button type="button" class="btn btn-primary" ms-attr="{disabled:@disabled}" ms-click="@confirm" ms-visible="!@readOnly">确认</button>'
															+'<button type="button" class="btn btn-white m-l-xs" ms-click="@back" ms-visible="@showBackButton">返回</button>'
															+'<button type="button" class="btn btn-primary m-l-xs" ms-for="($index,el) in @buttons" ms-class="@el.class" ms-click="@buttonClick(el)">{{el.title}}</button>'
														+'</div>'
														+'<div ms-html="@getWidgetHtml()"></div>'
													+'</form>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<wbr ms-widget="{is:\'fy-preview\',$id:@$previewId}" />'
						+'<wbr ms-widget="{is:\'fy-datepicker\',$id:@$datePickerId,autoClose:true}" />'
					+'</div>';
		return sContent;
	}).call(this),
	defaults: {
		$datePickerId:'fy-form_datePicker_'+(Math.random()+"").substr(3,6),
		$previewId:'fy-form_preview_'+(Math.random()+"").substr(3,6),
		title:"Fly表单",//标题部分内容
		tips:"",
		$defaultField:{//默认字段内容
			name: "",  //必填
			fieldname: "",// 必填
			type:6,
			subtype:0,//6为密码字段
			showwidth: 10,
			max:255,
			min:1,
			pk:false,
			auto:true,
			unit:"",//单位
			keyid:0,
			keytable:"",
			keyfield:"",
			keyshow:"",
			default:"",
			null:true,//1可为空，0不能为空
			readonly:false,//只读
			noinput:false,//不需要输入框
			inputwidth:0,
			select:"",
			tooltip:"",//placeholder提示语
			regex:null,
			/*
			fakefield:{ //伪造字段，用于合成数据,存在这个字段，会将值写入fakefield_fieldname
				key:"field1",
				value:"field2"
			},
			*/
			fakefield:"",
			virtual:false//虚拟字段
		},
		fields:{},
		/* fields范例
		{
			st_code: {
				name: "门店编码",
				fieldname: "st_code",
				showwidth:10,
				extend:{
					html:"",
					action:{
						
					}
				}
			},
			st_name: {
				name: "门店名称",
				fieldname: "st_name",
				showwidth: 20
			},
			st_is_checked:{
				name:"审核状态",
				fieldname:"st_is_checked",
				showwidth:10,
				select:"0-未审核;1-已审核;2-审核中"
			}
		},
		*/
		data:{},
		/*
		{
			st_code:"0001",
			st_name:"一号店",
			st_is_checked:1
		},//查询到的数据
		*/
		method:"post",
		saveUrl:"",
		updateUrl:"",
		uploadUrl:"",
		isShow:false,
		$prefix:"",//字段前缀
		$alertId:"form-alert_"+(Math.random()+"").substr(3,6),//对话框id
		$alert:{},//对话框对象
		onReady:function(){
			this.$alert=avalon.vmodels[this.$alertId];
			//avalon.log("form onReady");
		},
		onInit:function(){
			// this.$alert=avalon.vmodels[this.$alertId];
			// avalon.log("form onInit");
		},
		disabled:false, //confirm按钮可点击限制
		confirm:function(){
			//先进行数据校验
			var oField={},oSelf=this,sResult="";
			//var oData=new FormData();
			var oData={};
			avalon.each(this.data,function(key,value){
				if(key.indexOf("fakefield_")==0) {
					//将fakefield内保存的值写入到原始字段中
					delete oSelf.data[key];
					key=key.replace("fakefield_","");
					oSelf.data[key]=avalon.keyValue(value);
				}
			});
			avalon.each(this.data,function(key,value){
				
				oField=oSelf.fields[key];
				if(!oField) return true;//无字段则略过
				key=key.replace(oSelf.$prefix,"");
				//不进行验证,虚拟节点，无输入框
				if(oField.virtual
					||(oField.noinput&&value=="")
					||(oField.pk&&oField.auto)//自增主键
				) return true;
				//检查必填
				if(value===""){
					if(oField.null){
						//跳过检查
						return true;
					}else{
						sResult=oField.name+"内容必须填写";
						return false;
					}
				}
				//检查长度
				if(oField.type==6){
					if(oField.min<=oField.max){
						//min小于max，则必须校验
						if(value.length<oField.min){
							sResult=oField.name+"的长度小于规定的范围<"+oField.min+">";
							return false;
						}else if(value.length>oField.max){
							sResult=oField.name+"的长度大于规定的范围<"+oField.max+">";
							return false;
						}
					}
				}else if(oField.type==1||oField.type==2){
					if(oField.min<=oField.max){
						//min小于max，则必须校验
						if(value.length<oField.min){
							sResult=oField.name+"的值小于规定的范围<"+oField.min+">";
							return false;
						}else if(value.length>oField.max){
							sResult=oField.name+"的值大于规定的范围<"+oField.max+">";
							return false;
						}
					}
				}
				//自定验证规则(正则)
				if(oField.regex){
					if(!oField.regex.test(value)){
						sResult=oField.name+"不符合验证规则";
						return false;
					}
				}
				//处理无误，将数据写入
				if(oField.keyid>0&&value!=""){
					//oData.append(key,avalon.keyValue(value));
					oData[key]=avalon.keyValue(value);
				}else //oData.append(key,value);
					oData[key]=value;
			});
			//校验失败,sResult
			if(sResult!==""){
				this.$alert.error("校验失败",sResult);
				return;
			}
			var sUrl="";
			this.disabled=true;
			var fnSuccess=function(oResult){
				oSelf.disabled=false;
				if(oResult.state==0){
					oSelf.$alert.show("请求成功","",function(){
						oSelf.back();
					},null,1000);
				}else{
					oSelf.$alert.error("请求失败",oResult.mess);
				}
			};
			var fnError=function(ex){
				oSelf.disabled=false;
			};
			var sData=JSON.stringify(oData);
			switch (this.method.toLowerCase()){
				case "post"://创建
					sUrl=this.saveUrl;
					avalon.post(sUrl,sData,fnSuccess,fnError);
					break;
				case "put"://更新
					sUrl=this.updateUrl;
					avalon.put(sUrl,sData,fnSuccess,fnError);
					break;
			}
		},
		actionProxy:function($event,field,action){//自定义函数代理
			if(this.fields[field]&&this.fields[field].extend
				&&this.fields[field].extend.action
				&&this.fields[field].extend.action[action])
				this.fields[field].extend.action[action].call(this,$event);
		},
		procFields:function(fields){
			var oSelf=this;
			var oFields={},oItem={},oData={},uValue=0;
			avalon.each(fields,function(key,item){
				oItem=avalon.mix({},oSelf.$defaultField,item);
				oFields[key]=oItem;
				//处理默认数据
				switch (oItem.type){
					case 1:
						uValue=0;
						break;
					case 2:
						uValue=0.00;
						break;
					case 3:
					case 4:
					case 5:
						uValue=avalon.curTime();
						break;
					case 6:
						if(oItem.select=="") uValue="";
						else{
							var oOptions=oItem.select.split(";");
							if(oOptions.length>0) uValue=avalon.keyValue(oOptions[0]);
						}
						break;
					case 7:
						uValue=1;
						break;
					default:
						uValue="";
						break;
				}
				oData[oItem.fieldname]=oItem.default!==""?oItem.default:uValue;
				if(oItem.fakefield!==""){
					//存在虚假字段
					oData["fakefield_"+oItem.fieldname]=oItem.default!==""?oItem.default:uValue;
				}
			});
			return {
				fields:oFields,
				data:oData
			};
		},
		readOnly:false,
		showBackButton:true,
		read:function(fields,readUrl){ //只读界面
			this.readOnly=true;
			this.updateUrl=readUrl;
			var result=this.procFields(fields);
			this.fields=result.fields;
			this.data=result.data;
			//请求数据
			var oSelf=this;
			this.$alert.wait("请求数据中","请稍等...");
			avalon.get(readUrl,function(result){
				oSelf.$alert.hide();
				if(result.state!=0){
					oSelf.$alert.error("请求失败",result.mess,function(){
						oSelf.back();
					})
				}else{//查询成功，显示界面
					avalon.each(oSelf.fields,function(key,oItem){
						if(oItem.fakefield!==""){
							var sKey="",sValue="";
							if(oItem.fakefield.key){
								if(result.table[oItem.fakefield.key]) sKey=result.table[oItem.fakefield.key];
							}
							if(oItem.fakefield.value){
								if(result.table[oItem.fakefield.value]) sValue=result.table[oItem.fakefield.value];
							}
							result.table["fakefield_"+oItem.fieldname]=sKey+"-"+sValue;
						}
					});
					oSelf.onData(result.table);
					oSelf.data=result.table;
				}
			});
			this.isShow=true;
		},
		save:function(url,fields){//添加数据的窗口
			this.readOnly=false;
			this.saveUrl=url;
			var result=this.procFields(fields);
			this.fields=result.fields;
			this.onData(result.data);
			this.data=result.data;
			this.method="post";
			this.isShow=true;
		},
		update:function(url,fields,readUrl){//更新数据的窗口
			this.readOnly=false;
			this.updateUrl=url;
			var result=this.procFields(fields);
			this.fields=result.fields;
			this.data=result.data;
			this.method="put";
			//请求数据
			var oSelf=this;
			this.$alert.wait();
			//var oAlert=avalon.openAlertWait();
			avalon.get(readUrl,function(oResult){
				oSelf.$alert.hide();
				//oAlert.hide();
				if(oResult.state!=0){
					oSelf.$alert.error("请求失败",oResult.mess,function(){
						oSelf.back();
					})
				}else{//查询成功，显示界面
					avalon.each(oSelf.fields,function(key,oItem){
						if(oItem.fakefield!==""){
							var sKey="",sValue="",sName="";
							if(oItem.fakefield.key){
								if(oResult.table[oItem.fakefield.key]) sKey=oResult.table[oItem.fakefield.key];
							}
							if(oItem.fakefield.value){
								if(oResult.table[oItem.fakefield.value]) sValue=oResult.table[oItem.fakefield.value];
							}
							if(oItem.fakefield.name){
								if(oResult.table[oItem.fakefield.name]) sName=oResult.table[oItem.fakefield.name];
								oResult.table["fakefield_"+oItem.fieldname]=sKey+"-"+sName;
								return;
							}
							oResult.table["fakefield_"+oItem.fieldname]=sKey+"-"+sValue;
						}
					});
					oSelf.onData(oResult.table);
					oSelf.data=oResult.table;
				}
			});
			this.isShow=true;
		},
		onData:avalon.noop, //处理数据的回掉 onData()
		back:function(){
			if(self==top) location.href=document.referrer;
			else{
				if(top.document.location.href!=self.document.referrer)
					self.document.location.href=self.document.referrer;
			}
			//if(self==top) location.href=self.document.referrer;
			//else history.back();
		},
		getWidgetHtml:function(){
			var sHtml='<wbr ms-widget="{is:\'fy-alert\',$id:\''+this.$alertId+'\'}" />';
			return sHtml;
		},
		getNameHtml:function(key,item){//获取字段名的html
			var sHtml=item.name
					+(item.null==1?'':'<span class="text-danger"> * </span>');
			return sHtml;
		},
		getFieldCss:function(key,item) {//获取每个字段项的样式
			if ((item.type == 9 ) //文件上传
				|| (item.type == 8) //大文本
				|| (item.type == 10 ) //二进制文件上传
				)
				return "col-sm-6";
			else return "col-sm-3";
		},
		getFieldHtml:function(key,item){
			//开始处理字段
			var sHtml="";
			if(item.extend&&item.extend.html){
				sHtml=item.extend.html;
			}else if(this.readOnly){
				switch (item.type){
					//日期
					case 3:
						sHtml+='<span class="form-control" ms-text="@data[\''+item.fieldname+'\'] | unixdate(\'yyyy-MM-dd\')"></span>';
						break;
					case 4:
						sHtml+='<span class="form-control" ms-text="@data[\''+item.fieldname+'\'] | unixdate(\'HH:mm:ss\')"></span>';
						break;
					//日期时间
					case 5:
						sHtml+='<span class="form-control" ms-text="@data[\''+item.fieldname+'\'] | unixdate(\'yyyy-MM-dd HH:mm:ss\')"></span>';
						break;
					case 1:
					case 2:
					case 6:
						if(item.select=="") {
							if(item.unit==""){
								if(!item.fakefield) sHtml+='<span class="form-control" ms-text="@data[\''+item.fieldname+'\']"></span>';
								else sHtml+='<span class="form-control" ms-text="@data[\'fakefield_'+item.fieldname+'\']"></span>';
							}else{
								//有单位时候的样式
								sHtml+='<div class="input-group">'
										+'<span class="form-control" ms-text="@data[\''+item.fieldname+'\']"></span>'
										+'<span class="input-group-addon">'+item.unit+'</span>'
									+'</div>';
							}
						}
						else{
							//带有select选项的
							var aOptions=item.select.split(";");
							var oSelf=this,sValue="";
							avalon.each(aOptions,function($index,oItem){
								//判断该值是否存在于内
								if(oItem.indexOf(oSelf.data[item.fieldname]+"-")>=0){
									sValue=oItem;
									return false;
								}
							});
							if(sValue=="") sValue=this.data[item.fieldname];
							sHtml+='<span class="form-control">'+sValue+'</span>';
						}
						break;
					case 7:
						if(item.select==""){
							sHtml+='<div class="switch" style="margin-top: 6px;">'
										+'<div class="onoffswitch">'
											+'<input type="checkbox" class="onoffswitch-checkbox" ms-attr="{checked:@getSwitchState(\''+item.fieldname+'\')}">'
											+'<label class="onoffswitch-label" >'
												+'<span class="onoffswitch-inner"></span>'
												+'<span class="onoffswitch-switch"></span>'
											+'</label>'
										+'</div>'
									+'</div>';
						}else{
							sHtml+='<div style="padding:10px 0px;" ms-html="@getBooleanSelect(@data[\''+item.fieldname+'\'],\''+item.select+'\')"></div>';
							//sHtml+='<span class="form-control" ms-text="@getBooleanSelect(@data[\''+item.fieldname+'\'],\''+item.select+'\')"></span>';
						}
						break;
					case 8:
						sHtml+='<textarea readonly="true" ms-text="@data[\''+item.fieldname+'\']" class="form-control" ></textarea>';
						break;
					case 9: //图像，要考虑多张图的情况
						sHtml+='<div class="input-group" ms-for="($index,$value) in @getSplitResult(@data[\''+item.fieldname+'\'],\',\')">'
									+'<span class="input-group-btn">'
										+'<button target="'+fileId+'" type="button" class="btn btn-white" title="预览图片" ms-click="@previewImage($event,$value)">预览图片</button>'
									+'</span>'
									+'<input type="text" class="form-control" readonly="" ms-attr="{value:$value}" />'
								+'</div>';
						break;
				}
			}else{
				switch(item.type){
					case 3://日期
						var dateId="date_"+(Math.random()+"").substr(3,6);
						sHtml+='<div class="input-group">'
									+'<span class="input-group-btn">'
										+'<input type="button" value="选择" ms-click="@openDatePicker($event,\''+item.fieldname+'\')" class="btn btn-primary" target="'+dateId+'"/>'
									+'</span>'
									+'<span class="form-control" ms-text="@data[\''+item.fieldname+'\'] | unixdate(\'yyyy-MM-dd\')" id="'+dateId+'" ></span>'
									+'<input type="hidden" class="form-control" ms-duplex="@data[\''+item.fieldname+'\']" />'
								+'</div>';
						break;
					case 4://时间
						var dateId="date_"+(Math.random()+"").substr(3,6);
						sHtml+='<div class="input-group">'
									+'<span class="input-group-btn">'
										+'<input type="button" value="选择" ms-click="@openDatePicker($event,\''+item.fieldname+'\')" class="btn btn-primary" target="'+dateId+'"/>'
									+'</span>'
									+'<span class="form-control" ms-text="@data[\''+item.fieldname+'\'] | unixdate(\'HH:mm:ss\')" id="'+dateId+'" ></span>'
									+'<input type="hidden" class="form-control" ms-duplex="@data[\''+item.fieldname+'\']" />'
								+'</div>';
						break;
					case 5://日期时间
						var dateId="date_"+(Math.random()+"").substr(3,6);
						sHtml+='<div class="input-group">'
									+'<span class="input-group-btn">'
										+'<input type="button" value="选择" ms-click="@openDatePicker($event,\''+item.fieldname+'\')" class="btn btn-primary" target="'+dateId+'"/>'
									+'</span>'
									+'<span class="form-control" ms-text="@data[\''+item.fieldname+'\'] | unixdate(\'yyyy-MM-dd HH:mm:ss\')" id="'+dateId+'" ></span>'
									+'<input type="hidden" class="form-control" ms-duplex="@data[\''+item.fieldname+'\']" />'
								+'</div>';
						break;
					case 1://整型
					case 2://浮点型
					case 6://字符串
						if(item.select==""){
							if(item.keyid>0){
								var inputId="input_"+(Math.random()+"").substr(3,6);
								sHtml+='<div class="input-group">'
											+'<span class="input-group-btn">'
												+'<input type="button" value="选择" ms-click="@openKeyData($event,\''+item.fieldname+'\')" class="btn btn-primary" ms-attr="{placeholder:\''+item.tooltip+'\',target:\''+inputId+'\'}"/>'
											+'</span>'
											+'<input type="text" class="form-control" readonly="" ms-attr="{id:\''+inputId+'\'}" ms-duplex="@data[\'fakefield_'+item.fieldname+'\']" />'
											+'<input type="hidden" class="form-control" readonly="" ms-duplex="@data[\''+item.fieldname+'\']" />'
										+'</div>';
							}else if(item.extend&&item.extend.action){
								sHtml+='<div class="input-group">'
											+'<span class="input-group-btn">'
												+'<input type="button" value="选择" ms-click="@openAction($event,\''+item.fieldname+'\')" class="btn btn-primary" ms-attr="{placeholder:\''+item.tooltip+'\'}"/>'
											+'</span>'
											+'<input type="text" class="form-control" readonly="" ms-duplex="@data[\''+item.fieldname+'\']" />'
										+'</div>';
							}
							else{
								if(item.unit==""){
									if(!item.fakefield) sHtml+='<input '+(item.readonly?'readonly="true"':'')+' type="text" class="form-control" ms-duplex="@data[\''+item.fieldname+'\']"/>';
									else sHtml+='<input '+(item.readonly?'readonly="true"':'')+' class="form-control" ms-duplex="@data[\'fakefield_'+item.fieldname+'\']" />';
								}else{//有单位时候的样式
									sHtml+='<div class="input-group">'
											+'<input type="text" class="form-control" ms-duplex="@data[\''+item.fieldname+'\']"/>'
											+'<span class="input-group-addon">'+item.unit+'</span>'
										+'</div>';
								}
							}
						}else {
							//当select有内容的时候，需要生成select组件
							sHtml+='<select class="form-control" ms-duplex="@data[\''+item.fieldname+'\']">';
							//select值是分号分割
							var aOptions=item.select.split(";");
							avalon.each(aOptions,function($index,value){
								sHtml+='<option value="'+avalon.keyValue(value)+'">'+value+'</option>';
							});
							sHtml+='</select>';
						}
						break;
					case 7://布尔
						sHtml+='<div class="switch" style="margin-top: 6px;">'
									+'<div class="onoffswitch">'
										+'<input '+(item.readonly?'disabled="true"':'')+' type="checkbox" class="onoffswitch-checkbox" ms-attr="{checked:@getSwitchState(\''+item.fieldname+'\')}">'
										+'<label class="onoffswitch-label" ms-click="@changeState($event,\''+item.fieldname+'\')">'
											+'<span class="onoffswitch-inner"></span>'
											+'<span class="onoffswitch-switch"></span>'
										+'</label>'
									+'</div>'
								+'</div>';
						break;
					case 8://长字符串
						sHtml+='<textarea '+(item.readonly?'readonly="true"':'')+' ms-duplex="@data[\''+item.fieldname+'\']" class="form-control" ></textarea>';
						break;
					case 9://图像数据
						var fileId="file_"+(Math.random()+"").substr(3,6);
						var buttonId="btn_"+(Math.random()+"").substr(3,6);
						sHtml+='<div class="input-group">'
									+'<span class="input-group-btn">'
										+'<input target="'+fileId+'" type="button" value="选择图片" ms-click="@chooseImage($event,\''+item.fieldname+'\')" class="btn btn-primary" id="'+buttonId+'" />'
										+'<button target="'+fileId+'" type="button" class="btn btn-white" title="预览图片" ms-click="@previewImage($event,\''+item.fieldname+'\')">预览图片</button>'
										+'<input target="'+buttonId+'" type="file" id="'+fileId+'" style="display:none" ms-change="@changeFile($event,\''+item.fieldname+'\')" />'
									+'</span>'
									+'<input type="text" class="form-control" readonly="" ms-duplex="@data[\''+item.fieldname+'\']" />'
								+'</div>';
						break;
					case 10://上传文件
						var fileId="file_"+(Math.random()+"").substr(3,6);
						var buttonId="btn_"+(Math.random()+"").substr(3,6);
						sHtml+='<div class="input-group">'
									+'<span class="input-group-btn">'
										+'<input target="'+fileId+'" type="button" value="选择文件" ms-click="@chooseImage($event,\''+item.fieldname+'\')" class="btn btn-primary" id="'+buttonId+'" />'
										+'<input target="'+buttonId+'" type="file" id="'+fileId+'" style="display:none" ms-change="@changeFile($event,\''+item.fieldname+'\')" />'
									+'</span>'
									+'<input type="text" class="form-control" readonly="" ms-duplex="@data[\''+item.fieldname+'\']" />'
								+'</div>';
						break;
					case 11://添加多个组件
						sHtml+='<wbr ms-widget="{is:\'fy-upload\',$id:\'upload\',fieldName:'+item.fieldname+'}" />';
						break;
				}
			}
			return sHtml;
		},
		//以下是该组件内部的函数
		chooseImage:function($event,fieldName){
			var oFile=document.querySelector("#"+avalon($event.target).attr("target"));
			oFile.click();
		},
		chooseFile:function($event,fieldName){
			var oFile=document.querySelector("#"+avalon($event.target).attr("target"));
			oFile.click();
		},
		previewImage:function($event,fieldName){
			var preview=avalon.vmodels[this.$previewId];
			preview.show(this.data[fieldName]);
		},
		changeFile:function($event,fieldName){
			var oFile=document.querySelector("#"+avalon($event.target).attr("target"));
			oFile.value="正在上传文件…";
			oFile.setAttribute("disabled", true);
			if($event.target.value=="") return;
			//开始上传文件
			var oData=new FormData();
			var oSelf=this;
			oData.append(fieldName,$event.target.files[0]);
			avalon.post(this.uploadUrl,oData,function(oResult){
				oFile.value="选择文件";
				oFile.removeAttribute("disabled");
				if(oResult.state==0){
					oSelf.data[fieldName]=oResult.mess;
				}else{
					oSelf.$alert.error("上传失败",oResult.mess);
				}
			});
		},
		getSwitchState:function(fieldName){//switch状态
			return this.data[fieldName]?true:false;
		},
		getSplitResult:function(value,sp){ //获取分隔符分割的结果
			value=value||"";
			if(avalon.isString(value)) return value.split(sp);
			else return [value];
		},
		getBooleanSelect:function(value,select){//获取真假值对应的select文本
			var aSelect=select.split(";");
			if(1===value||true===value) return '<span class="label label-info">'+aSelect[1]+'</span>';
			else return '<span class="label label-danger">'+aSelect[0]+'</span>';
		},
		changeState:function($event,fieldName){
			var oField=this.fields[fieldName];
			if(!oField.readonly)
				this.data[fieldName]=!this.data[fieldName];
		},
		openKeyData:function($event,fieldName){//打开外键数据
			var oField=this.fields[fieldName];
			if(oField.extend&&oField.extend.action){
				//优先执行用户自定义数据
				oField.extend.action.call(this,$event,oField);
			}else{
				//获取第三方数据
				alert("暂不支持dict相关方法!<keyid:"+oField.keyid+">");
			}
		},
		openAction:function($event,fieldName){
			var oField=this.fields[fieldName];
			if(oField.extend&&oField.extend.action){
				//优先执行用户自定义数据
				oField.extend.action.call(this,$event,oField);
			}else{
				//获取第三方数据
				alert("未配置有效的Action节点!");
			}
		},
		openDatePicker:function($event,fieldName){//打开日期选择界面
			var oDatePicker=avalon.vmodels[this.$datePickerId];
			var oDom=document.querySelector("#"+avalon($event.target).attr("target"));
			var oSelf=this;
			oDatePicker.show({
				dom:oDom,
				onSelected:function(oDate){
					oSelf.data[fieldName]=oDate.getTime()/1000;
				}
			});
		}
	}
});