(function($){
    $('.arrow.right').addClass('click');

    $('.action_wrap .arrow').on('click touch', function(e) {

        e.preventDefault();

        //cutsom setting
        let t = $(this);
        setTimeout(function(){
            $('.arrow').removeClass('click');
            $('.arrow').removeClass('right');
            $('#main-header').toggleClass('click');
            $('.docs_menu').toggleClass('main_disable');
            $('#et-main-area').toggleClass('oneColum');

            t.toggleClass('click');
            $('.arrow').addClass('not_click');
            t.removeClass('not_click');
        }, 600);
        // end

        let arrow = $(this);

        if(!arrow.hasClass('animate')) {
            arrow.addClass('animate');
            setTimeout(() => {
                arrow.removeClass('animate');
            }, 600);
        }

    });
})(jQuery)