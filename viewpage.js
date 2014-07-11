void function ($) {
	$.event.props.push('touches', 'changedTouches');

	var Viewpage = function (ele, option) {
		var options = this.options = $.extend({}, Viewpage.DEFAULT, option);
		this.$viewpage = $(ele);
		this.$pages = this.$viewpage.find(options.pages);
		var now = this.now = options.initPage;
		var activeClass = options.activeClass;
		this.$pages.removeClass(activeClass)
			.eq(now).addClass(activeClass);

		this._bind();
	};
	Viewpage.DEFAULT = {
		pages: '> *',
		initPage: 0,
		activeClass: 'active',
		swipeRange: 35
	};
	Viewpage.prototype.prev = function () {
		var now = this.now;
		var prev = now - 1;

		if (prev < 0) return;

		this.now = prev;
		var $pages = this.$pages;
		var $nowPage = $pages.eq(now).removeClass('active');
		var $next = $pages.eq(prev).removeClass('left').addClass('active');
	};
	Viewpage.prototype.next = function () {
		var now = this.now;
		var next = now + 1;

		if (next > this.$pages.length - 1) return;

		this.now = next;
		var $pages = this.$pages;
		var $nowPage = $pages.eq(now).addClass('left');
		var $next = $pages.eq(next).addClass('active');
	};
	Viewpage.prototype._bind = function () {
		var $pages = this.$pages;
		$pages.on('touchstart', $.proxy(this._start, this));
		$pages.on('touchend', $.proxy(this._end, this));
		$pages.on('touchcancel', $.proxy(this._end, this));
		$pages.on('touchcancel', $.proxy(this._end, this));
	};

	Viewpage.prototype._start = function (e) {
		e = e.touches[0];
		this.x = e.pageX;
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
