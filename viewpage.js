void function ($) {
	$.event.props.push('touches', 'changedTouches');


	var Viewpage = function (ele, options) {
		options = this.options = $.extend({}, Viewpage.DEFAULT, options);

		this.$viewpage = $(ele);
		this.$pages = this.$viewpage.find(options.pages);
		this.now = options.initPage;

		this._bind();
	};
	Viewpage.DEFAULT = {
		pages: '> .viewpage',
		initPage: 0,
	};
	Viewpage.prototype.prev = function () {
		console.log('prev');
	};
	Viewpage.prototype.next = function () {
		console.log('next');
	};
	Viewpage.prototype.go = function () {

	};
	Viewpage.prototype.recover = function () {

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
		console.log('start', e.pageX);
	};
	Viewpage.prototype._move = function (e) {
		// e = e.touches[0];
		// console.log('move', e.pageX - this.x);
		// $(e.target).css('left', e.pageX - this.x);
	};
	Viewpage.prototype._end = function (e) {
		e = e.changedTouches[0];
		this.range = e.pageX - this.x;
		if (this.range > 35)
			this.prev();
		else if (this.range < -35)
			this.next();
		else
			this.recover();
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
