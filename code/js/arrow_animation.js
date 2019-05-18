(function($){
    $('.arrow.right').addClass('click');

    $('.action_wrap .arrow').on('click touch', function(e) {

        e.preventDefault();

        //cutsom setting
        let t = $(this);
        setTimeout(function(){
            $('#main-header').toggleClass('click');
            $('.docs_menu').toggleClass('main_disable');
            $('#et-main-area').toggleClass('oneColum');

            $('.arrow').removeClass('click');
            $('.arrow').removeClass('right');
            t.toggleClass('click');
            t.siblings('.arrow').addClass('not_click');
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

    // Resume arrwo
    // normal left = bottom
    function resume_arrow(com){
        $(`.arrow_wrap .normal.${com} .arrow:nth-child(1)`).on('click touch', function(){
            $(`.innerProject.${com}`).show('slow');
        });
        $(`.arrow_wrap .normal.${com} .arrow:nth-child(2)`).on('click touch', function(){
            $(`.innerProject.${com}`).hide('slow');
        });
    }
	resume_arrow('kinsdayz');
	resume_arrow('peterosea_controller');
})(jQuery)
