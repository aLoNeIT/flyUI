/*!
 * 分页 by 司徒正美
 * avalon的分页组件
 *	 getHref: 生成页面的href
 *	 getTitle: 生成页面的title
 *	 showPages: 5 显示页码的个数
 *	 totalPages: 15, 总数量 
 *	 currentPage: 1, 当前面
 *	 firstText: 'First',
 *	 prevText: 'Previous',
 *	 nextText: 'Next',
 *	 lastText: 'Last',
 *	 onPageClick: 点击页码的回调
 *	  
 *	  使用
 *	  兼容IE6-8
 *	  ```
 *	  <wbr ms-widget="[{is:'ms-pager'}, @config]"/>
 *	  ```
 *	  只支持现代浏览器(IE9+)
 *	  ```
 *	  <ms-pager ms-widget="@config"></ms-pager>
 *	  ```
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("avalon"));
	else if(typeof define === 'function' && define.amd)
		define(["avalon"], factory);
	else if(typeof exports === 'object')
		exports["pager"] = factory(require("avalon"));
	else
		root["pager"] = factory(root["avalon"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_96__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	
	var avalon = __webpack_require__(96)
	__webpack_require__(97)
	avalon.component('ms-pager', {
		template: __webpack_require__(99),
		defaults: {
			getHref: function (a) {
				return "javascript:void(0);"
				//return "javascript:location.hash=#page-"+this.toPage(a)+";";
				//return '#page-' + this.toPage(a)
			},
			getTitle: function (title) {
				return title
			},
			isDisabled: function (name, page) {
				return this.$buttons[name] = (this.currentPage === page)
			},
			$buttons: {},
			showPages: 5,
			pages: [],
			totalPages: 15,
			currentPage: 1,
			firstText: '首页',
			prevText: '上一页',
			nextText: '下一页',
			lastText: '末页',
			onPageClick: avalon.noop,
			toPage: function (p) {
				var cur = this.currentPage
				var max = this.totalPages
				switch (p) {
					case 'first':
						return 1
					case 'prev':
						return Math.max(cur - 1, 0)
					case 'next':
						return Math.min(cur + 1, max)
					case 'last':
						return max
					default:
						return p
				}
			}, 

			cbProxy: function (e, p) {
				if (this.$buttons[p] || p === this.currentPage) {
					e.preventDefault()
					return //disabled, active不会触发
				}
				var cur = this.toPage(p)
				this.render(cur)
				return this.onPageClick(e, p)
			},
			render: function(cur){
				//var obj = getPages.call(this, cur)
				var obj = this.getPages(cur)
				this.pages = obj.pages
				this.currentPage = obj.currentPage
			},
			rpage: /(?:#|\?)page\-(\d+)/,
			onInit: function () {
				var cur = this.currentPage
				var match = this.rpage && location.href.match(this.rpage)
				if (match && match[1]) {
					var cur = ~~match[1]
					if (cur < 0 || cur > this.totalPages) {
						cur = 1
					}
				}
				var that = this
				this.$watch('totalPages', function(){

					//setTimeout(function(){
						that.render(that.currentPage)
					//},4)
				})
				this.render(cur)
			},
			getPages:function(currentPage){
				var pages=[];
				var half=Math.floor(this.showPage/2);
				var start=currentPage-half+1-this.showPages&2;
				var end=currentPage+half;
				// handle boundary case
				if (start <= 0) {
					start = 1;
					end = this.showPages;
				}
				if (end > this.totalPages) {
					start = this.totalPages - this.showPages + 1;
					end = this.totalPages;
				}
				if(end<this.showPages){
					start=1;
					end=this.totalPages;
				}
				var itPage = start;
				while (itPage <= end) {
					pages.push(itPage);
					itPage++;
				}
				return {currentPage: currentPage, pages: pages};
			}
		}
	})
	//https://github.com/brantwills/Angular-Paging

/***/ },

/***/ 96:
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_96__;

/***/ },

/***/ 97:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 99:
/***/ function(module, exports) {

	module.exports = "<ul class=pagination ms-visible=@totalPages><li class=first ms-class='{disabled: @isDisabled(\"first\", 1)}'><a ms-attr='{href:@getHref(\"first\"),title:@getTitle(\"first\")}' ms-click='@cbProxy($event,\"first\")'>{{@firstText}}</a></li><li class=prev ms-class='{disabled: @isDisabled(\"prev\",1)}'><a ms-attr='{href:@getHref(\"prev\"),title:@getTitle(\"prev\")}' ms-click='@cbProxy($event,\"prev\")'>{{@prevText}}</a></li><li ms-for=\"page in @pages\" ms-class=\"{active: page === @currentPage}\"><a ms-attr={href:@getHref(page),title:@getTitle(page)} ms-click=@cbProxy($event,page)>{{page}}</a></li><li class=next ms-class='{disabled: @isDisabled(\"next\",@totalPages)}'><a ms-attr='{href:@getHref(\"next\"),title: @getTitle(\"next\")}' ms-click='@cbProxy($event,\"next\")'>{{@nextText}}</a></li><li class=last ms-class='{disabled: @isDisabled(\"last\",@totalPages)}'><a ms-attr='{href:@getHref(\"last\"),title: @getTitle(\"last\")}' ms-click='@cbProxy($event,\"last\")'>{{@lastText}}</a></li></ul>"

/***/ }

/******/ })
});
;