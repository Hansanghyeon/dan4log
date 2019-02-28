(function($){
    //show-more close btn
    //더보기 닫기버튼 복제
    if($('.wpsm-hide').length !== -1){
        $('.wpsm-hide')
        .parent()
        .prepend(`<p class="wpsm-hide" style="color: #666;font-size: 100%;text-align: left;"> CLOSE</p>`);
    }
    $('p.wpsm-hide').html('<i class="fas fa-times"></i>');

    //poster thumnail
    //스크롤 썸네일 에니매이션
    $(window).scroll(function() {
        var scroll = $(this).scrollTop();
        $('.fallex').css('background-position-y',-scroll);
    });
})(jQuery);
