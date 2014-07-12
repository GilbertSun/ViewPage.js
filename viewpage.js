/**
 * @author  GilbertSun <szb4321@gmail.com>
 * @url     https://github.com/GilbertSun/ViewPage.js
 * @version 0.0.1
 */

void function ($) {
	'use strict';

	$.event.props.push('touches', 'changedTouches');

	var Viewpage = function (ele, option) {
		var _this = this;
		var options = this.options = $.extend({}, Viewpage.DEFAULT, option);
		var $viewpage = this.$viewpage = $(ele);
		var $container = this.$container = $(options.container, $viewpage);
		var $pages = this.$pages = $(options.pages, $container);

		this.now = options.initPage;
		this.x = 0;
		this._setWidth(options.width);
		this._initStyle();
		this._bindEvent();
		setTimeout(function () {
			_this.go(_this.now);
		}, 0);
	};
	Viewpage.DEFAULT = {
		width: '100%', // 1. percentage string 2. number > 0
		initPage: 0,
		container: '.viewpage-container',
		pages: '> *',
		swipeRange: 35,
		duration: 300
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
	Viewpage.prototype.reset = function () {
		this.$container.css('transform', 'translate(-' + this.now * this.width + 'px)');
	};
	Viewpage.prototype.go = function (index) {
		var e = $.Event('change.viewpage', {
			pages: this.$pages,
			page: this.$pages.eq(index),
			index: index
		});
		(index === 0) && (e.isFirst = true);
		(index === this.$pages.length - 1) && (e.isLast = true);
		this.$viewpage.trigger(e);
		if (e.isDefaultPrevented()) {
			this.reset();
			return;
		}
		this.now = index;
		this.$container.css('transform', 'translate(-' + index * this.width + 'px)');
	};
	Viewpage.prototype._bindEvent = function () {
		this.$viewpage
			.on('touchstart', $.proxy(this._start, this))
			.on('touchmove', $.proxy(this._move, this))
			.on('touchend', $.proxy(this._end, this))
			.on('touchcancel', $.proxy(this._end, this));
	};

	Viewpage.prototype._start = function (e) {
		e = e.touches[0];
		this.$container.css('transition', '0ms');
		this.startX = e.pageX;
	};
	Viewpage.prototype._move = function	(e) {
		e = e.touches[0];
		var range = this.startX - e.pageX;
		this.$container.css('transform', 'translate(' + (this.now * this.width + range)*-1 + 'px)');
		return false;
	};
	Viewpage.prototype._end = function (e) {
		e = e.changedTouches[0];
		var range = e.pageX - this.startX;
		this.$container.css('transition', this.options.duration + 'ms');
		if (range > 35)
			this.now === 0 ? this.reset() : this.prev();
		else if (range < -35)
			this.now === this.$pages.length -1 ? this.reset() : this.next();
		else
			this.reset();
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
