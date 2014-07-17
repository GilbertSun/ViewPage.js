/**
 * @author  GilbertSun <szb4321@gmail.com>
 * @url     https://github.com/GilbertSun/ViewPage.js
 * @version 0.0.2
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

		if (typeof options.offOverscroll === 'boolean') {
			options.offOverscroll = {
				start: options.offOverscroll,
				end: options.offOverscroll
			};
		}
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
		duration: 300,
		offOverscroll: false // when true trun off overscroll also can be {start: true, end: true}
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
		this.$container.css('transform', 'translate3d(-' + index * this.width + 'px, 0px, 0px)');
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
		return false;
	};
	Viewpage.prototype._move = function	(e) {
		e = e.touches[0];
		var range = this.startX - e.pageX;
		if (this.now === 0 && range < 0) {
			this._overscroll(range, 'start');
			return false;
		}
		if (this.now === this.$pages.length - 1 && range > 0) {
			this._overscroll(range, 'end');
			return false;
		}

		this.$container.css('transform', 'translate3d(' + (this.now * this.width + range)*-1 + 'px, 0px, 0px)');
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
	Viewpage.prototype._overscroll = function (range ,direction) {
		var evt = $.Event('overscroll.viewpage', {
			direction: direction
		});
		if (direction === 'start' && !this.options.offOverscroll.start) {
			this.$container.css('transform', 'translate3d(' + (range / 2)*-1 + 'px, 0px, 0px)');
		}
		if (direction === 'end' && !this.options.offOverscroll.end) {
			this.$container.css('transform', 'translate3d(' + (this.now * this.width + range / 2)*-1 + 'px, 0px, 0px)');
		}
		this.$viewpage.trigger(evt);
	};

	$.fn.viewpage = function (option) {
		var _arguments = arguments;
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('qbt.viewpage');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('qbt.viewpage', (data = new Viewpage(this, options)));
			if (typeof option === 'string') data[option].apply(data, [].slice.call(_arguments, 1));
		});
	};
}(jQuery);
