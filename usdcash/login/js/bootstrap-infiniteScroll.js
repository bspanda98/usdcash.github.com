/* ============================================
 * bootstrap-infiniteScroll.js
 * ============================================ */

!function ($) {
    'use strict';
    var InfiniteScroll = function (el, options) {
        this.$element = $(el);
        this.$data = $(el).data();
        this.$options = options;
 
        this.executing = false;
        this.endOfResults = false;
        this.currentPage = 1;
 
        var that = this;
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 50) {
                that.loadMore();
            }
        });
    };
 
    InfiniteScroll.prototype = {
        constructor: InfiniteScroll,
 
        loadMore: function () {
            var $this = this;
            if ($this.executing || $this.endOfResults) return;
 
            $('#loading-indicator').removeClass('hidden');
 
            $this.executing = true;
            $this.currentPage += 1;
 
 
            $.ajax({
                contentType: 'application/json; charset=UTF-8',
                url: $this.$options.url,
                type: 'GET',
                success: function (resultsUrl) {
                    return function (rawRetVal) {
                        if ($this.$options.url != resultsUrl) {
                            return;
                        }

                        var retVal = JSON.parse(rawRetVal);
                        $this.$options.processResults(retVal);
     
                        if (retVal.Value.length == 0) {
                            $this.endOfResults = true;
                            $this.$element.find('#end-of-results').removeClass('hide');
                        }
     
                        $this.$element.find('.spinner').addClass('hide');
                        $this.executing = false;
                    }
                } ($this.$options.url)
            });
        }
    };
 
    $.fn.infiniteScroll = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('infinite-search'),
                options = $.extend({}, $.fn.infiniteScroll.defaults, typeof option == 'object' && option);
            if (!data) $this.data('infinite-search', (data = new InfiniteScroll(this, options)));
            if (typeof options == 'string') data[options]();
        });
    };
 
    $.fn.infiniteScroll.defaults = {
        calculateBottom: function () { },
        getData: function () { },
        processResults: function () { },
        url: ''
    };
 
    $.fn.infiniteScroll.Constructor = InfiniteScroll;
} (window.jQuery);
