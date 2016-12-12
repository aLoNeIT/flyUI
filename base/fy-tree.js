/*
	avalon组件，bootstrap引入,modal弹框,
	规范化数据格式
	{
		id:1,text:'hello',title:'world',subtree:{}
	}
 */
//树组件
var treeID=0;
avalon.component('fy-tree', {
	template:(function(){
		// 组件部分
		return '<ul>'+
					'<li ms-for="(index,el) in @tree | get(0)" ms-class="@getIconClass(el,@tree)">'+
						'<i class="jstree-icon jstree-ocl" ms-click="@openSubTree(el)"></i>'+
						'<a ms-class="[\'jstree-anchor\',@getSelectedClass(el)]" ms-click="@selectNode(el)">' +
							'<i ms-class="el.subtree&&el.subtree.length>0?@parentIcon:@childIcon"></i>' +
							'{{el.text}}' +
						'</a>'+
						'<div ms-visible="el.open" ms-html="@renderSubTree(el)">'+

						'</div>'+
					'</li>'+
				'</ul>'
	}).call(this),
	defaults: {
		text:"",
		currSelected:{},
		treeID:0,
		openIcon:"jstree-node jstree-open",
		closeIcon:"jstree-node jstree-closed",
		childIcon:"jstree-icon jstree-themeicon none jstree-themeicon-custom",
		parentIcon:"jstree-icon jstree-themeicon",
		emptyIcon:"jstree-node jstree-leaf",
		lastIcon:"jstree-last",
		selectedClass:"subject-style",
		tree:[],
		selectNode:function(el){//选择节点
			this.text=el.text;
			this.currSelected=avalon.mix(true,this.currSelected,el);
		},
		renderSubTree:function(el,sParent){//渲染子节点，使用递归方法
			sParent=sParent||"el";
			sParent+=".subtree";
			//使用递归的方式来解决该问题
			var sHtml="";
			var sId=(++treeID);
			var sIndex = "index"+sId;
			var sElSub="el"+sId;
			if(el.subtree&&el.subtree.length>0){
				//有子节点
				sHtml='<ul>'+
					'<li ms-for="('+sIndex+','+sElSub+') in '+sParent+' | get(0)" ms-class="@getIconClass('+sElSub+','+sParent+')">'+
					'<i class="jstree-icon jstree-ocl" ms-click="@openSubTree('+sElSub+')"></i>'+
					'<a ms-class="[\'jstree-anchor\',@getSelectedClass('+sElSub+')]" ms-click="@selectNode('+sElSub+')">' +
					'<i ms-class="'+sElSub+'.subtree&&'+sElSub+'.subtree.length>0?@parentIcon:@childIcon"></i>' +
					'{{'+sElSub+'.text}}' +
					'</a>'+
					'<div ms-visible="'+sElSub+'.open" ms-html="@renderSubTree('+sElSub+',\''+sElSub+'\')">'+
					'</div>'+
					'</li>'+
					'</ul>';
			}
			return sHtml;
		},
		openSubTree:function(el){//打开/关闭子节点
			el.open = !el.open;
		},
		getSelectedClass:function(el){//获取选中的样式
			if(this.text===el.text) return this.selectedClass;
			else return "";
		},
		getIconClass:function(el,oParent){//获取图标样式
			var sClass=(el==oParent[oParent.length-1])?" jstree-last":"";
			if(!el.subtree||el.subtree.length==0) return this.emptyIcon+sClass;
			else if(el.open) return this.openIcon+sClass;
			else return this.closeIcon+sClass;
		}
	}
});