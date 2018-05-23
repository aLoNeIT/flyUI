/*
author:aLoNe.Adams.K
createDate:2017-05-29
description:flyui的包含顶部功能按钮，主题数据区，底部分页模块
 */
avalon.component("fy-datagrid", {
    template: (function() {
        // 内容表格部分
        var sContent = '<div>' +
            '<div class="row wrapper white-bg page-heading">' +
            '<div class="col-lg-10">' +
            '<h2>{{@title}}</h2>' +
            '</div>' +
            '</div>' +
            '<div class="wrapper wrapper-content">' +
            '<wbr ms-widget="{is:\'fy-filter\',$id:@filterId,fields:@filterFields,onFilter:@onFilter}"/>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<div class="ibox">' +
            '<div class="ibox-title">' +
            '<a href="javascript:void(0);" class="btn btn-primary btn-outline" ms-click="@back">返回</a>' +
            '<a href="javascript:void(0);" class="btn btn-primary btn-outline m-l-xs" ms-for="($index,el) in @buttons" ms-class="@el.class" ms-click="@buttonClick(el)" ms-visible="!(false===@el.visible)">{{el.title}}</a>' +
            '</div>' +
            '<div class="ibox-content">' +
            '<div class="table-responsive m-t">' +
            '<table class="table table-hover dataTables-example">' +
            '<thead>' +
            '<tr>' +
            '<th ms-for="($key,el) in @fields" ms-css="{width:el.showwidth+\'%\'}" ms-visible="el.showwidth>0">{{el.name}}</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr ms-for="($index,el) in @data" ms-click="@selectRow(el)" ms-dblclick="@doubleClick(el)" ms-class="@selectCss(el)">' +
            '<td ms-for="(key,value) in el | selectGridData(el)" ms-html="@procValue(key,value,el)"></td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '<div ms-visible="@toggle">' +
            '<wbr ms-widget="{is:\'fy-pager\',$id:@pagerId,onPageClick:@pageClick,totalPages:1,currentPage:1,showPages:5}" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        return sContent;
    }).call(this),
    defaults: {
        title: "Fly列表", //标题部分内容
        buttons: [],
        /*[{
        	title:"返回",
        	action:"",
        	class:"btn-primary",
        	visible:true,
        	onClick:function(wbr){avalon.log(wbr.buttons.$model);}
        }],
        */
        fields: {},
        /* fields范例
        {
        	st_code: {
        		name: "门店编码",
        		fieldname: "st_code",
        		showwidth: 20,
        		type:6
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
        		process:function(value){
        			switch (value){
        				case 0:return "未审核";
        				case 1:return "已审核";
        				default:return "未审核";
        			}
        		}
        	}
        },
        */
        filterId: 'filter_' + Math.random(),
        filterFields: {},
        showFilter: false,
        onFilter: avalon.noop,
        $selectedField: [],
        selectDataBy: function(el) { //过滤需要显示的字段
            if (this.$selectedField.length == 0) {
                //在$selectedField内保存需要展示的字段
                var oSelf = this;
                avalon.each(this.fields, function($index, oItem) {
                    if (oItem.showwidth && oItem.showwidth > 0)
                        oSelf.$selectedField.push(oItem.fieldname);
                });
            }
            var result = {};
            var i = 0;
            for (; i < this.$selectedField.length; i++) {
                result[this.$selectedField[i]] = el[this.$selectedField[i]];
            }
            return result;
        },
        data: [],
        /* 数据范例
        [{
        	st_code:"0101",
        	st_name:"fuck",
        	st_is_checked:0
        },{
        	st_code:"0102",
        	st_name:"you",
        	st_is_checked:1
        },{
        	st_code:"0103",
        	st_name:"all",
        	st_is_checked:1
        }],
        */
        onButtonClick: avalon.nooop,
        buttonClick: function(el) {
            if (avalon.isFunction(el.onClick)) {
                el.onClick.call(this, el);
            }
        },
        multiSelect: false, //多选
        selectedRow: [], //选中的行数据
        onSelectRow: avalon.noop, //选中行，onSelectRow(el)
        selectCss: function(el) { //选中行的样式
            //currData==el?\'selectRow\':\'\'
            var bFind = false;
            avalon.each(this.selectedRow, function($index, oItem) {
                if (oItem == el) {
                    bFind = true;
                    return false;
                }
            });
            if (bFind) return 'selectRow';
            else return '';
        },
        clearSelected: function() { //清理选中数据
            this.selectedRow = [];
        },
        currentData: {},
        selectRow: function(el) {
            if (this.multiSelect) {
                //判断是否存在于已选择的数组中
                var bFind = false;
                avalon.each(this.selectedRow, function($index, oItem) {
                    if (oItem == el) {
                        bFind = true;
                        return false;
                    }
                });
                if (bFind) avalon.Array.remove(this.selectedRow, el);
                else this.selectedRow.push(el);
            } else {
                this.selectedRow.removeAll();
                this.selectedRow.push(el);
            }
            this.currentData = el;
            this.onSelectRow(el);
        },
        onDoubleClick: avalon.noop, //数据行双击
        doubleClick: function(el) {
            this.selectRow(el);
            this.onDoubleClick(el);
        },
        getSelected: function(fieldname) { //获取选中项
            if (!fieldname) {
                if (this.multiSelect) return this.selectedRow;
                else if (this.selectedRow.length > -1) return this.selectedRow[0];
            } else {
                var result = [];
                avalon.each(this.selectedRow, function($index, oItem) {
                    //这里可能会存在某个字段值为空的时候不反悔该数据，目前从业务角度考虑影响不大
                    if (oItem[fieldname]) result.push(oItem[fieldname]);
                });
                return result.join(",");
            }
        },
        procValue: function(key, value, el) { //使用特殊方法处理字段内容
            var oItem = this.fields[key];
            if (!oItem) return value;
            else if (oItem.process) return oItem.process(value, key, el);
            else {
                //根据字段类型处理
                switch (oItem.type) {
                    case 3:
                        return avalon.unixToDate(value, false);
                        break;
                    case 4:
                        return avalon.filters.unixdate(value, "HH:mm:ss");
                        break;
                    case 5:
                        return avalon.unixToDate(value);
                        break;
                    case 7:
                        return true == value ? "是" : "否";
                        break;
                    default:
                        return value;
                        break;
                }
            }
        },
        extendAction: function(key, funcname, $event, el) {
            var oItem = this.fields[key];
            if (oItem && oItem.extend && avalon.isFunction(oItem.extend[funcname])) {
                oItem.extend[funcname].call(this, $event, el);
            }
        },
        onBack: avalon.noop, //后退
        back: function() {
            if (self == top) location.href = document.referrer;
            else history.back();
        },
        pagerId: 'pager_' + Math.random(),
        currentPage: 1,
        toggle: true,
        pageConfig: function(config) {
            var oPager = avalon.vmodels[this.pagerId];
            if (!oPager) return null;
            avalon.each(config, function(key, value) {
                if (key in oPager) oPager[key] = value;
            });
        },
        onPageClick: avalon.noop, //点击事件回调，onPageClick(curr);
        pageClick: function(e, curr) {
            this.currentPage = curr;
            this.onPageClick(curr);
        },
        onReady: function() {
            var oFilter = avalon.vmodels[this.filterId];
            oFilter.show(this.filterFields);
            avalon.filters.selectGridData = this.selectDataBy;
            var oSelf = this;
            this.$watch("data", function() {
                oSelf.selectedRow = [];
            });
        }
    }
});