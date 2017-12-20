/*
 author:aLoNe.Adams.K
 createDate:2017-05-29
 description:分页功能
 */
avalon.component("fy-pager",{
	template:(function(){
		var sContent='<ul class="pagination" ms-visible="@totalPages>1">'
						+'<li class="first" ms-class="{disabled: @isDisabled(\'first\', 1)}">'
							+'<a ms-attr="{title:@getTitle(\'first\')}" ms-click="@cbProxy($event,\'first\')" class="icon-double-angle-left">'
								+'{{@firstText}}'
							+'</a>'
						+'</li>'
						+'<li class="prev" ms-class="{disabled: @isDisabled(\'prev\',1)}">'
							+'<a ms-attr="{title:@getTitle(\'prev\')}" ms-click="@cbProxy($event,\'prev\')" class="icon-angle-left">'
								+'{{@prevText}}'
							+'</a>'
						+'</li>'
						+'<li ms-for="page in @pages" ms-class="{active: page === @currentPage}" >'
							+'<a ms-attr="{title:@getTitle(page)}" ms-click="@cbProxy($event,page)">'
								+'{{page}}'
							+'</a>'
						+'</li>'
						+'<li class="next" ms-class="{disabled: @isDisabled(\'next\',@totalPages)}">'
							+'<a ms-attr="{title: @getTitle(\'next\')}" ms-click="@cbProxy($event,\'next\')" class="icon-angle-right">'
								+'{{@nextText}}'
							+'</a>'
						+'</li>'
						+'<li class="last" ms-class="{disabled: @isDisabled(\'last\',@totalPages)}">'
							+'<a ms-attr="{title: @getTitle(\'last\')}" ms-click="@cbProxy($event,\'last\')" class="icon-double-angle-right" >'
								+'{{@lastText}}'
							+'</a>'
						+'</li>'
						+'<li>'
							+'<input type="text" ms1-duplex-number="@jumpPage" value="" class="icon-double-angle-right" ms-attr="{placeholder:@jumpPage,id:@$jumpId}"/>'
							+'<a ms-attr="{title: @getTitle(\'jump\')}" ms-click="@cbProxy($event,\'jump\')" class="icon-double-angle-right" >'
								+'{{@jumpText}}'
							+'</a>'
						+'</li>'
						+'<li>'
							+'<span class="info">'
								+' 共 <b>{{@pageText}}</b> 页 / 每页 <b>{{@numText}}</b> 条 / 总计 <b>{{@countText}}</b> 条 '
							+'</span>'
						+'</li>'
					+'</ul>';
		return sContent;
	}).call(this),
	defaults:{
		$id: 'fy-pager',
		$jumpId:'fy-pager-'+Math.random(),
		/**
		 * 是否开启低版本兼容模式
		 * 开启，将无法开启浏览器回退功能
		 * */
		is_ie      : !!window.addEventListener,
		/**
		 * 配置复杂型单页
		 * 默认为false
		 * 如#/page=2
		 * hash配置子页，后面还需配置分页信息时启用
		 * 如#/game?page=2
		 * 表示单页应用进入子页面game页,当前页为2
		 * */
		is_more    : false,
		hash       : '',
		getHref    : function (a) {
			if (this.is_more) {
				if (location.hash) {
					var search = location.hash,
						page   = getHashStr('page');
					if (page) { // 存在就替换
						search = search.replace('page=' + page, 'page=' + this.toPage(a));
						return search;
					}
					else { // 不存在就叠加
						return location.hash + '?page=' + this.toPage(a)
					}
				}
				else {
					return '#?page=' + this.toPage(a)
				}
			}
			else {
				return '#page-' + this.toPage(a)
			}
		},
		getTitle   : function (title) {
			switch(title){
				case "first":
					return "首页";
				case "prev":
					return "上一页";
				case "next":
					return "下一页";
				case "last":
					return "末页";
				case "jump":
					return "跳转";
				default :
					return title;
			}
		},
		isDisabled : function (name, page) {
			return this.$buttons[name] = (this.currentPage === page)
		},
		$buttons   : {},
		showPages  : 5,
		pages      : [],
		totalPages : 15,
		currentPage: 1,
		jumpPage:1,
		firstText  : '首页',
		prevText   : '上一页',
		nextText   : '下一页',
		lastText   : '末页',
		jumpText   : '跳转',
		numText    : '0',
		countText  : '0',
		pageText   : '0',
		onPageClick: avalon.noop,
		toPage     : function (p) {
			var cur = this.currentPage
			var max = this.totalPages
			switch (p) {
				case 'first':
					return 1
				case 'prev':
					return Math.max(cur - 1, 1)/*从第一页开始*/
				case 'next':
					return Math.min(cur + 1, max)
				case 'last':
					return max
				case 'jump':
					var jumpPage=avalon(document.getElementById(this.$jumpId)).val();
					return parseInt(jumpPage)?parseInt(jumpPage):1
				default:
					return p
			}
		},
		cbProxy    : function (e, p) {
			var cur = this.toPage(p);
			if (this.$buttons[p] || p === this.currentPage) {
				if (cur !== 1&&cur!==this.totalPages) {
					return this.onPageClick(e, cur);
				}
				e.preventDefault()
				return //disabled, active不会触发
			}
			/*替换链接改变hash的形式*/
			window.location.hash = this.getHref(p);
			this.render(cur);
			return this.onPageClick(e, cur);
		},
		render     : function (cur) {/*更新页码*/
			var obj = this.getPages.call(this, cur);
			this.currentPage = obj.currentPage;
			this.pages = obj.pages;
		},
		/*此处供正常单页应用*/
		rpage      : function () {
			return this.is_more ? /(?:#|\?)page\=(\d+)/ : /(?:#|\?)page\-(\d+)/;
		},
		cur        : function () { /*正确获取匹配页码*/
			var cur = this.currentPage;
			var match = this.rpage && location.href.match(this.rpage());
			if (match && match[1]) {
				var cur = ~~match[1]
				if (cur < 0 || cur > this.totalPages) {
					cur = 1
				}
			}
			return cur;
		},
		onInit     : function () {
			var that = this;
			/**复杂单页应用，切换选项卡，重置页码
			 * 但切换选项卡或者数据页数变化时，重置页码
			 * */
			this.$watch('totalPages', function () {
				that.render(that.cur())
			});
			this.$watch('currentPage', function () {
				that.render(that.cur());
			});
			if (!that.is_ie && !that.is_more) {
				/**
				 * 完美支持单页一分页组件（仅支持现代浏览器）
				 * 浏览器回退键功能启动
				 * */
				window.addEventListener("hashchange", function () {
					that.cbProxy(window.event, that.cur());
				}, false);
			}
			else if (!that.is_ie && that.is_more) {
				/**
				 * 支持单页多分页组件（仅支持现代浏览器）
				 * 此功能适用于单页多分页情景，开启此功能，可配合路由。
				 * 监听location.hash触发特定的onPageClick
				 * */
				window.addEventListener("hashchange", function () {
					that.render(that.cur());
				}, false);
			}
			/*进入页面预载入页码*/
			that.render(that.cur());
		},
		getPages:function(currentPage){
			var pages=[];
			var half=Math.floor(this.showPages/2);
			var start=currentPage-half+1-this.showPages%2;
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
});