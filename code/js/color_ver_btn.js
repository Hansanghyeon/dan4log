(function ($) {
    var clickCount = 1;
    var ver = $.cookie('ver');
    if(ver == undefined){
        $.cookie('ver', 'light', {path: "/", domain: ".dan4log.com"});
        $('body').toggleClass('light');
    }else if(ver == 'light'){
        $.cookie('ver', 'light', {path: "/", domain: ".dan4log.com"});
        $('body').toggleClass('light');
    }else if(ver == 'dark'){
        $.cookie('ver', 'dark', {path: "/", domain: ".dan4log.com"});
        $('body').toggleClass('dark');
    }
    

    if($.cookie('ver') == 'light'){
        $('.toggle-handle').addClass('toggle-handle-day');
        $('body').addClass('light');
        $('.toggle-container').addClass('toggle-container-day');
        $('.star').addClass('star-day');
        $('.crater').addClass('crater-day');
        $('.mini-cloud').addClass('cloud-day');
    }

    $('.toggle-container').on('click', function () {
        $('.toggle-handle').toggleClass('toggle-handle-day');
        $('body').toggleClass('light');
        $('body').toggleClass('dark');
        $('.toggle-container').toggleClass('toggle-container-day');
        $('.star').toggleClass('star-day');
        $('.crater').toggleClass('crater-day');
        $('.mini-cloud').toggleClass('cloud-day');
        if($.cookie('ver') == 'light'){
            $.cookie('ver', 'dark', {path: "/", domain: ".dan4log.com"});
        }else if($.cookie('ver') == 'dark'){
            $.cookie('ver', 'light', {path: "/", domain: ".dan4log.com"});
        }
        if (clickCount === 0) {
            clickCount++;
        } else if (clickCount === 1) {
            clickCount--;
        }
    });
})(jQuery);
