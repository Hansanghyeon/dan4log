(function($){
    // [ 포스트 | Taxonomy ]기본 (섬네일off, 사이드바 on)
    // set nextpage
    function post_taxonomy_default_thumbX_sideX(){
        var nexPenSlugs = [
            'page/2/',
            'page/3/',
            'page/4/',
            'page/5/'
        ];

        var url = $(location).attr('protocol')+"//"+$(location).attr('host')+""+$(location).attr('pathname');
        function getPenPath(){
            var slug = nexPenSlugs[ this.loadCount ];
            if( slug ){
                return url + slug;
            }
        }

        $container = $('#infiniti').infiniteScroll({
            path: getPenPath,
            append: '.thumbX_default',
            history: 'false',
            status: '.page-load-status',
        });

        $container.infiniteScroll('loadNextPage');

        $container.on( 'append.infiniteScroll', function(){
            $container.infiniteScroll('loadNextPage');
        });
    }
    post_taxonomy_default_thumbX_sideX();
})(jQuery);
