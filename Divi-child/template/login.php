<?php
function login_custom() {?>
    <title>dan4log | 로그인</title>
    <link href="https://fonts.googleapis.com/css?family=Muli:400" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Passion+One" rel="stylesheet">
    <link href="<?php echo get_stylesheet_directory_uri() ?>/style.min.css" rel="stylesheet">
    <div id="notfound">
        <div class="notfound-bg"></div>
        <div class="notfound">
            <div class="notfound-404">
                <h1>4log</h1>
            </div>
            <h2>Devlog</h2>
            <h2>Blog</h2>
            <a href="#"></a>
        </div>
    </div>
    <button class="btn">admin</button>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
        $('.btn').on('click', function(){
            $('#login').toggleClass('active');
        });
    </script>
    <?php
}
add_action( 'login_init', 'login_custom' );

// 워드프레스 기본 로그인 페이지 커스터마이징
function my_login_logo() { ?>

<?php }
add_action( 'login_enqueue_scripts', 'my_login_logo' );
