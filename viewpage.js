/**
 * @author GilbertSun <szb4321@gmail.com>
 */

void function ($) {
	'use strict';

	$.event.props.push('touches', 'changedTouches');

	var Viewpage = function (ele, option) {
		var options = this.options = $.extend({}, Viewpage.DEFAULT, option);
		var $viewpage = this.$viewpage = $(ele);
		var $container = this.$container = $(options.container, $viewpage);
		var $pages = this.$pages = $(options.pages, $container);

		this._setWidth(options.width);
		this._initStyle();
	};
	Viewpage.DEFAULT = {
		width: '100%', // 1. percentage string 2. number > 0
		initPage: 0,
		activeClass: 'active',
		container: '.viewpage-container',
		pages: '> *',
		swipeRange: 35
	};
	Viewpage.prototype._setWidth = function(width) {
		if (typeof width === 'string' && /%$/.test(width)) {
			this.width = this.$viewpage.width();
		} else {
			this.width = Number(width);
		}
	};
	Viewpage.prototype._initStyle = function() {
		var width = this.width;
		this.$viewpage.width(width).css('overflow', 'hidden');
		this.$pages.width(width);
		this.$container.width(width * this.$pages.length);
	};
	Viewpage.prototype.prev = function () {
		var now = this.now;
		if (now === 0) return;

		this.go(now - 1);
	};
	Viewpage.prototype.next = function () {
		var now = this.now;
		if (now === this.$pages.length -1) return;

		this.go(now + 1);
	};
	Viewpage.prototype.go = function (index, withoutAnimation) {
		var activeClass = this.options.activeClass;
		this.now = index;

		this.$pages.removeClass(activeClass).eq(index).addClass(activeClass);
	};
	Viewpage.prototype._bind = function () {
		var $pages = this.$pages;
		$pages.on('touchstart', $.proxy(this._start, this));
		$pages.on('touchmove', $.proxy(this._move, this));
		$pages.on('touchend', $.proxy(this._end, this));
		$pages.on('touchcancel', $.proxy(this._end, this));
	};

	Viewpage.prototype._start = function (e) {
		e = e.touches[0];
		this.x = e.pageX;
	};
	Viewpage.prototype._move = function	(e) {
		return false;
	};
	Viewpage.prototype._end = function (e) {
		e = e.changedTouches[0];
		this.range = e.pageX - this.x;
		if (this.range > 35)
			this.prev();
		else if (this.range < -35)
			this.next();
	};

	$.fn.viewpage = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('qbt.viewpage');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('qbt.viewpage', (data = new Viewpage(this, options)));
		});
	};
}(jQuery);
