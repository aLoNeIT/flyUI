/*
author:aLoNe.Adams.K 小风风
createDate:2017-07-26
description:flyui配合datagrid的筛选组件
 */
avalon.component("fy-filter", {
	template: (function () {
		// 内容表格部分
		var sContent = '<div class="row m-b-xs" ms-visible="@isShow">' +
			'<div ms-for="($key,el) in @fields" ms-class="@getFieldCss($key,el)">' +
			'<div class="input-group" ms-html="@getFieldHtml($key,el)">'
			// +'<span class="input-group-addon" ms-html="@getNameHtml($key,el)"></span>'
			// +'<span ms-html="@getFieldHtml($key,el)"></span>'
			+
			'</div>' +
			'</div>' +
			'<div class="col-sm-3 m-t-xs">' +
			'<button type="button" class="btn btn-primary" ms-click="@seachClick($event)">查询</button>' +
			'<button type="button" class="btn btn-default m-l-xs" ms-click="@reset(true)">重置</button>'
			// +'<button type="button" class="btn btn-primary btn-outline pull-right" ms-click="@printbtn">打印</button>'
			+
			'</div>' +
			'<wbr ms-widget="{is:\'fy-datepicker\',$id:@$datePickerId,autoClose:true}" />' +
			'</div>'
		return sContent;
	}).call(this),
	defaults: {
		$datePickerId: 'datePicker_' + Math.random(),
		title: "", //标题部分内容
		$defaultField: { //默认字段内容
			name: "", //必填
			fieldname: "", // 必填
			type: 6,
			subtype: 0, //6为密码字段
			showwidth: 10,
			max: 20,
			min: 1,
			pk: false,
			auto: true,
			unit: "", //单位
			keyid: 0,
			keytable: "",
			keyfield: "",
			keyshow: "",
			default: "",
			null: true, //1可为空，0不能为空
			readonly: false, //只读
			noinput: false, //不需要输入框
			inputwidth: 0,
			select: "",
			tooltip: "" //placeholder提示语
		},
		fields: {},
		/* fields范例
		{
			ep_name:{
				name:"场站",
				fieldname:"ep_name"
			},
			st_name:{
				name:"日期",
				fieldname:"st_name",
				type:5
			},
			at_type:{
				name:"管辖机构",
				fieldname:"at_type",
				keyid:106,
				fakefield:{
					key:"at_type",
					value:"so_name"
				},
				extend:{
					action:function($event){
						var oSelf=this;
						avalon.getEx("/governor/securityorg",function(oResult){
							if(oResult.state==0){
								var oList=avalon.vmodels["typelist"];
								var arr=[];
								oList.onSelected=function(el){
									arr=el.split("-");
									if(arr.length>0) oSelf.data["at_type"]=arr[0];
									oSelf.data["fakefield_at_type"]=el;
								};
								var oData=[];
								avalon.each(oResult.table,function($index,oItem){
									oData.push(oItem.so_code+"-"+oItem.so_name);
								});
								oList.show("选择货品类型",oData);
							}
						});
					}
				}
			},
		},
		*/
		data: {},
		createtime: "createtime",
		/*
		{
			st_code:"0001",
			st_name:"一号店",
			st_is_checked:1
		},//查询到的数据
		*/
		isShow: false,
		// $prefix:"",//字段前缀
		$alertId: "form-alert_" + (Math.random() + "").substr(3, 6), //对话框id
		$alert: {}, //对话框对象
		onReady: function () {
			this.$alert = avalon.vmodels[this.$alertId];
		},
		// seachClick: function($event) {
		// 	if (avalon.isFunction(this.onFilter)) {
		// 		this.onFilter(this.data.$model);
		// 	}
		// },
		seachClick: function ($event) {
			if (avalon.isFunction(this.onFilter)) {
				var oField = {},
					oData = {},
					oSelf = this,
					sSign = "",
					tempData = {};
				avalon.each(this.data, function (key, value) {
					if (key.indexOf("fakefield_") == 0) {
						tempData[key] = value;
						return true;
					}
					oField = oSelf.fields[key];
					if (oField.keyid > 0 && value != "") { //拆分字符串 前半部分id
						oData[key] = avalon.keyValue(value);
					} else if (value != "" || value != 0) {
						oData[key] = value;
					}
					if (value != "" || value != 0) {
						switch (oField.matchtype) {
							case 1:
								oData[key] = [">=", oData[key]];
								break;
							case 2:
								oData[key] = ["<", oData[key]];
								break;
							case 3:
								oData[key] = ["<>", oData[key]];
								break;
							case 4:
								oData[key] = ["like", "%" + oData[key] + "%"];
								break;
							case 5:
								oData[key] = ["like", "%" + oData[key]];
								break;
							case 6:
								oData[key] = ["like", +oData[key] + "%"];
								break;
						}
					}
				});
				if (oData["start_time"]) {
					var oData0 = [];
					oData[this.createtime] = oData[this.createtime] || [];
					oData0.push('egt');
					oData0.push(oData["start_time"]);
					oData[this.createtime].push(oData0);
					delete oData["start_time"];
				}
				if (oData["end_time"]) {
					var oData1 = [];
					oData[this.createtime] = oData[this.createtime] || [];
					oData1.push('lt');
					oData1.push(oData["end_time"]);
					oData[this.createtime].push(oData1);
					delete oData["end_time"];
				}
				if (oData[this.createtime] && oData[this.createtime].length == 1)
					oData[this.createtime] = oData[this.createtime][0];
				this.onFilter(oData, tempData);
			}
		},
		onFilter: avalon.noop,
		actionProxy: function ($event, field, action) { //自定义函数代理
			if (this.fields[field] && this.fields[field].extend &&
				this.fields[field].extend.action &&
				this.fields[field].extend.action[action])
				this.fields[field].extend.action[action].call(this, $event);
		},
		procFields: function (fields) {
			var oSelf = this;
			var oFields = {},
				oItem = {},
				oData = {},
				uValue = 0;
			avalon.each(fields, function (key, item) {
				oItem = avalon.mix({}, oSelf.$defaultField, item);
				oFields[key] = oItem;
				//处理默认数据
				switch (oItem.type) {
					case 1:
						uValue = 0;
						break;
					case 2:
						uValue = 0.00;
						break;
					case 3:
					case 4:
					case 5:
						uValue = 0;
						break;
					case 6:
						if (oItem.select == "") uValue = "";
						else {
							var oOptions = oItem.select.split(";");
							if (oOptions.length > 0) uValue = avalon.keyValue(oOptions[0]);
						}
						break;
					case 7:
						uValue = 1;
						break;
					default:
						uValue = "";
						break;
				}
				oData[oItem.fieldname] = oItem.default !== "" ? oItem.default : uValue;
				if (oItem.fakefield !== "") {
					//存在虚假字段
					oData["fakefield_" + oItem.fieldname] = oItem.default !== "" ? oItem.default : uValue;
				}
			});
			return {
				fields: oFields,
				data: oData
			};
		},
		show: function (fields) {
			if (!fields) return;
			var result = this.procFields(fields);
			this.fields = result.fields;
			this.data = result.data;
			this.isShow = !(JSON.stringify(this.fields.$model) == "{}");
		},
		getNameHtml: function (key, item) { //获取字段名的html
			var sHtml = item.name + '：' +
				(item.null == 1 ? '' : '<span class="text-danger"> * </span>');
			return sHtml;
		},
		getFieldCss: function (key, item) { //获取每个字段项的样式
			if ((item.type == 9) //文件上传
				||
				(item.type == 8) //大文本
				||
				(item.type == 10) //二进制文件上传
			)
				return "col-sm-6";
			else return "col-sm-3 m-t-xs";
		},
		getFieldHtml: function (key, item) {
			//开始处理字段
			var sHtml = "";
			if (item.extend && item.extend.html) {
				sHtml = item.extend.html;
			} else {
				switch (item.type) {
					case 3: //日期
					case 4: //时间
					case 5: //日期时间
						var dateId = "date_" + (Math.random() + "").substr(3, 6);
						sHtml += '<span class="input-group-addon" ms-html="@getNameHtml($key,el)"></span>' +
							'<span class="form-control" ms-text="@getDatetime(data[\'' + item.fieldname + '\'],' + item.type + ')" ms-dblclick="@reset(\'' + item.fieldname + '\')" id="' + dateId + '" style="overflow:auto;"></span>' +
							'<span class="input-group-btn">' +
							'<input type="button" value="选择" ms-click="@openDatePicker($event,\'' + item.fieldname + '\')" class="btn btn-primary" target="' + dateId + '"/>' +
							'</span>'
						break;
					case 1: //整型
					case 2: //浮点型
					case 6: //字符串
						if (item.select == "") {
							if (item.keyid > 0 //外键关联数据
								||
								(item.extend && item.extend.action)
							) {
								var inputId = "input_" + (Math.random() + "").substr(3, 6);
								sHtml += '<span class="input-group-addon" ms-html="@getNameHtml($key,el)"></span>' +
									// '<input type="text" class="form-control" readonly="" ms-attr="{id:\'' + inputId + '\'}" ms-duplex="@data[\'' + item.fieldname + '\']" ms-dblclick="@reset(\'' + item.fieldname + '\')" ms-attr="{placeholder:\'' + item.tooltip + '\'}"/>' +
									'<input type="text" class="form-control" readonly="" ms-attr="{id:\'' + inputId + '\'}" ms-duplex="@data[\'fakefield_' + item.fieldname + '\']" />' +
									'<input type="hidden" class="form-control" readonly="" ms-duplex="@data[\'' + item.fieldname + '\']" />' +
									'<span class="input-group-btn">' +
									'<input type="button" value="选择" ms-click="@openKeyData($event,\'' + item.fieldname + '\')" class="btn btn-primary" ms-attr="{target:\'' + inputId + '\'}"/>' +
									'</span>';
							} else {
								sHtml += '<span class="input-group-addon" ms-html="@getNameHtml($key,el)"></span>' +
									'<input ' + (item.readonly ? 'readonly="true"' : '') + ' type="text" class="form-control" ms-duplex="@data[\'' + item.fieldname + '\']"/>';
							}
						} else {
							//当select有内容的时候，需要生成select组件
							sHtml += '<span class="input-group-addon" ms-html="@getNameHtml($key,el)"></span>' +
								'<select class="form-control" ms-duplex="@data[\'' + item.fieldname + '\']">';
							sHtml += '<select class="form-control" ms-duplex="@data[\'' + item.fieldname + '\']">';
							//select值是分号分割
							var aOptions = item.select.split(";");
							avalon.each(aOptions, function ($index, value) {
								sHtml += '<option value="' + avalon.keyValue(value) + '">' + value + '</option>';
							});
							sHtml += '</select>';
						}
						break;
					case 7: //布尔
						sHtml += '<div class="switch" style="margin-top: 6px;">' +
							'<div class="onoffswitch">' +
							'<input ' + (item.readonly ? 'disabled="true"' : '') + ' type="checkbox" class="onoffswitch-checkbox" ms-attr="{checked:@getSwitchState(\'' + item.fieldname + '\')}">' +
							'<label class="onoffswitch-label" ms-click="@changeState($event,\'' + item.fieldname + '\')">' +
							'<span class="onoffswitch-inner"></span>' +
							'<span class="onoffswitch-switch"></span>' +
							'</label>' +
							'</div>' +
							'</div>';
						break;
				}
			}
			return sHtml;
		},
		//以下是该组件内部的函数
		openKeyData: function ($event, fieldName) { //打开外键数据
			var oField = this.fields[fieldName];
			if (oField.extend && oField.extend.action) {
				//优先执行用户自定义数据
				oField.extend.action.call(this, $event, oField);
			} else {
				//获取第三方数据
				alert("暂不支持dict相关方法!<keyid:" + oField.keyid + ">");
			}
		},
		openDatePicker: function ($event, fieldName) { //打开日期选择界面
			var oDatePicker = avalon.vmodels[this.$datePickerId];
			var oDom = document.querySelector("#" + avalon($event.target).attr("target"));
			var oSelf = this;
			oDatePicker.show({
				dom: oDom,
				onSelected: function (oDate) {
					oSelf.data[fieldName] = oDate.getTime() / 1000;
				}
			});
		},
		getDatetime: function (timestamp, type) {
			if (timestamp) {
				switch (type) {
					case 3:
						return avalon.filters.unixdate(timestamp);
					case 4:
						return avalon.filters.unixdate(timestamp, 'HH:mm:ss');
					case 5:
						return avalon.filters.unixdateEx(timestamp);
				}
			}
			return '';
		},
		reset: function (fieldname) {
			if (fieldname === true) {
				//清理所有数据
				var oSelf = this;
				avalon.each(this.fields, function (key, item) {
					var uValue = "";
					switch (item.type) {
						case 1:
							uValue = 0;
							break;
						case 2:
							uValue = 0.00;
							break;
						case 3:
						case 4:
						case 5:
							uValue = 0;
							break;
						case 6:
							uValue = "";
							break;
						case 7:
							uValue = 1;
							break;
						default:
							uValue = "";
							break;
					}
					oSelf.data[item.fieldname] = uValue;
				});
			} else if (this.data[fieldname]) {
				var item = this.fields[fieldname],
					uValue = "";
				if (item) {
					switch (item.type) {
						case 1:
							uValue = 0;
							break;
						case 2:
							uValue = 0.00;
							break;
						case 3:
						case 4:
						case 5:
							uValue = 0;
							break;
						case 6:
							uValue = "";
							break;
						case 7:
							uValue = 1;
							break;
						default:
							uValue = "";
							break;
					}
					this.data[fieldname] = uValue;
				}

			}
		}

	}
});