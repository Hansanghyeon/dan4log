<?php

include('code/secret/function_secret.php');

/********************************************************
	
				CONTENTS LIST
	
*********************************************************

    01.00 - Style & Script & CDN loaded
    02.00 - Theme bug repair

*********************************************************/

/*---------------------------------------------------

        01.00 - Style & Script & CDN loaded

---------------------------------------------------*/
//custom css or js for header
function themeslug_enqueue_style() {
	wp_enqueue_style( 'FontAwesome', 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', false );
	wp_enqueue_style( 'slick', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css', false ); 
    wp_enqueue_style( 'D2coding', '//cdn.jsdelivr.net/gh/joungkyun/font-d2coding/d2coding.css', false );
    wp_enqueue_style( 'Google Fonts', '//fonts.googleapis.com/css?family=Yeon+Sung', false );
    wp_enqueue_style( 'core Fullpage.js', get_stylesheet_directory_uri().'/code/node_modules/fullpage.js/dist/fullpage.min.css', false );
}
add_action( 'wp_enqueue_scripts', 'themeslug_enqueue_style' );

function themeslug_enqueue_script() {
	wp_enqueue_script( 'ScrollReveal', 'https://unpkg.com/scrollreveal', false);
	wp_enqueue_script( 'slick', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', false );
	wp_enqueue_script( 'jQuery cookie', '//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js', false );
    wp_enqueue_script('infiniti.js', '//unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.min.js', false );
    wp_enqueue_script('Vue', '//cdnjs.cloudflare.com/ajax/libs/vue/2.0.1/vue.min.js', false );
    wp_enqueue_script('core Fullpage.js', get_stylesheet_directory_uri().'/code/node_modules/fullpage.js/dist/fullpage.min.js', false );
}
add_action( 'wp_enqueue_scripts', 'themeslug_enqueue_script' );

//add header
function child_theme_head_script() {
	$theme_url = get_stylesheet_directory_uri();
?>
	<!-- Open Graph -->
	<meta property="og:image" content="<?php echo $theme_url ?>/seo/seoimg.jpg" />
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-112785015-4"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());

	gtag('config', 'UA-112785015-4');
	</script>
<?php
}
add_action( 'wp_head', 'child_theme_head_script' );

//add footer javascript
function add_this_script_footer(){ ?>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/plugin.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/ScrollReaval.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/color_ver_btn.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/slick-default.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/infinitiScroll.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/arrow_animation.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/Babel/ParallaxDepthCard.js"></script>
    <script defer type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/fullpage.js"></script>
<?php } 
add_action('wp_footer', 'add_this_script_footer');


/*---------------------------------------------------

        02.00 - Theme bug repair

---------------------------------------------------*/
// DIVI 기본 폰트 로드 제거 : DIVI 오류
function divi_child_theme_setup() {
	remove_action( 'wp_enqueue_scripts', 'et_divi_load_fonts' );
}
add_action('init', 'divi_child_theme_setup', 9999);
// Remove <p> Tag
function remove_empty_p( $content ){
	// clean up p tags around block elements
	$content = preg_replace( array(
		'#<p>\s*<(div|aside|section|article|header|footer)#',
		'#</(div|aside|section|article|header|footer)>\s*</p>#',
		'#</(div|aside|section|article|header|footer)>\s*<br ?/?>#',
		'#<(div|aside|section|article|header|footer)(.*?)>\s*</p>#',
		'#<p>\s*</(div|aside|section|article|header|footer)#',
	), array(
		'<$1',
		'</$1>',
		'</$1>',
		'<$1$2>',
		'</$1',
	), $content );
	return preg_replace('#<p>(\s|&nbsp;)*+(<br\s*/*>)*(\s|&nbsp;)*</p>#i', '', $content);
}
add_filter( 'the_content', 'remove_empty_p', 20, 1 );


//==================
//	body add class
//==================

//Page Slug Body Class
function add_slug_body_class( $classes ) {
	global $post;
	if ( isset( $post ) ) {
	$classes[] = $post->post_type . '-' . $post->post_name;
	}
	return $classes;
}
add_filter( 'body_class', 'add_slug_body_class' );

//desk-view shortcode 응용가능
function get_cpt($atts){
	$default_atts = array(
		'key'     	=> ''
	);
    extract( shortcode_atts( $default_atts, $atts ) );
    $term = get_the_terms(get_the_ID(),'desk');
    foreach($term as $terms){
        if($terms->name == 'starbucks'){
            $terms->name = '<img class="starbucks_logo" src="http://www.istarbucks.co.kr/common/img/common/logo.png">';
            $class_name_starbucks = 'starbucks';
        }
        $return_string = '<div class="region_badge '.$class_name_starbucks.'">'.$terms->name.get_post_meta( get_the_ID(), $atts['key'], true ).'</div>';
    };
	return $return_string;
}
add_shortcode("get_cpt","get_cpt");

// 포트스트의 이미지가 없다면 바디에 nothumbnail 클리스를 부여한다
function check_thumbnail_add_body_class( $classes ) {
	if (!has_post_thumbnail()) {
		$classes[] = 'no_thumbnail';
        return $classes;
    }
}
add_filter( 'body_class', 'check_thumbnail_add_body_class' );

// 포스트의 태그를 가져오기
function tag_list() {
	//taxonomy tag
	$terms = get_the_terms($post, 'post_tag');
	$tag_html = '';
	if(has_tag()){
	    $tag_html = '<i class="fas fa-tags"></i>';
        foreach($terms as $term) {
            $term_link = get_term_link($term);
            $tag_html .= '<div class="tag_item"><a class="'.$term->name.'" href="'.$term_link.'">'. $term->name . '</a></div>';
        };
    }

	
	return '<div class="grid_tag">'.$tag_html.'</div>';
}
add_shortcode('tag_list', 'tag_list');

// Docs Taxonomy list
function docs_list(){
    $args = array(
        'taxonomy' => 'library',
        'hide_empty' => false,
        'parent' => 0
    );
    $terms = get_terms($args);

    $output = '<ul>';
    foreach($terms as $term){
        $output .= '<li><a href ="'.get_term_link($term).'"><i class="fas fa-book"></i> '.$term->name.'</a></li>';
    }
    $output .= '</ul>';

    return $output;
}
add_shortcode('docs_list', 'docs_list');

//docs post list
function docs_post_list($atts, $content){
    // 이제 숏코드에서 정보를 불러오지않아도 알아서 찾게만들었다.
    // $atts = shortcode_atts(
    //     array(
    //         'name' => 0,
    //         'url' => 0,
    //         'docs_id' => 0
    //     ),
    //     $atts
    // );

    //  여기에만 사용할 폰트
    $output = '<link href="https://fonts.googleapis.com/css?family=Allerta+Stencil" rel="stylesheet">';

    // 카테고리 taxonomy 분류
    $custom_tax_name = 'library';
    // current 분류용 변수
    $current_tax = get_queried_object()->term_id;
    $current_filter_post = get_post()->ID;

    // 현제 term에서 최상위 부모카테고리 찾는 것
    $terms = wp_get_post_terms( $current_filter_post, array($custom_tax_name));
    if( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
        foreach($terms as $term){
            $custom_tax_id = $term->parent;
        }
    }
    $current_post_parent_term_info = get_term($custom_tax_id);

    //  title
    $output .= '<a href="/library/'.$current_post_parent_term_info->slug.'/"><div class="book_title"><i class="fas fa-book"></i> '.$current_post_parent_term_info->name.'</div></a>';
    // 리스트 그룹 박스
    $output .= '<div class="book_list_wrap">';

    $termchildren = get_term_children( $custom_tax_id, $custom_tax_name );
    foreach ( $termchildren as $child ) {
        $term = get_term_by( 'id', $child, $custom_tax_name );
        $output .= '<a class="term_id_'.$term->term_id;
        if(! empty(get_queried_object()->taxonomy)){
            if(get_queried_object()->term_id == $term->term_id){
                $output .= ' current';
            }
        };
        $output .='" href="' . get_term_link( $child, $custom_tax_name ) . '">' . $term->name . '</a>';

        // 해당 장의 post
        $args = array(
            'post_type' => 'docs',
            'order' => 'ASC',
            'posts_per_page' => 9999,
            'tax_query' => array(
                array(
                    'taxonomy' => $custom_tax_name,
                    'field' => 'slug',
                    'terms' => $term->slug,
                )
            )
        );
        $terms = get_posts($args);
        $output .= '<ul>';
        foreach($terms as $term){
            $order = get_field('order',$term->ID);
            $output .= '<li id="docs_'.$term->ID.'" class="';
            if(empty(get_queried_object()->taxonomy)){
                if($current_filter_post == $term->ID){
                    $output .= 'current';
                }
            }
            $output .= '"><a href ="/'.$term->post_name.'"><span class="order">'.$order.' <i class="fas fa-leaf"></i></span>'.$term->post_title.'</a></li>';
        }
        $output .= '</ul>';
    }
    $output .= '</div>';

    return  $output;
}
add_shortcode('docs_post_list', 'docs_post_list');

function docs_taxonomy_description(){
    $obejct = get_queried_object()->term_id;
    $output = do_shortcode(term_description($obejct));
    return $output;
}
add_shortcode('docs_taxonomy_description', 'docs_taxonomy_description');


//custom wp-login.php
include('template/login.php');

// Update CSS within in Admin
function admin_style() {
    // disable WP_list_table
    wp_enqueue_style('WP_list_table', get_stylesheet_directory_uri().'/code/css/admin_dashborad.css');
}
add_action('admin_enqueue_scripts', 'admin_style');

// Github hyperlink
function githubHpyerlink(){
    $githublink = get_field('github',$term->ID);
    $github = '<a href="'.$githublink.'">';
        $github .= '<article class="cc_box">';
            $github .= '<i class="fab fa-github"></i>';
        $github .= '</article>';
    $github .= '</a>';

    if($githublink !== '')
        return $github;
}
add_shortcode('github_link','githubHpyerlink');

// admin bashboard body class
function my_admin_body_class( $classes ) {
    return "$classes dan_admin_dashborad";
    // Or: return "$classes my_class_1 my_class_2 my_class_3";
}
add_filter( 'admin_body_class', 'my_admin_body_class' );


// admin filter sites body class
function print_user_classes() {
    if ( is_user_logged_in() ) {
        add_filter('body_class','class_to_body');
        add_filter('admin_body_class', 'class_to_body_admin');
    }
}
add_action('init', 'print_user_classes');

/// Add user role class to front-end body tag
function class_to_body($classes) {
    global $current_user;
    $user_role = array_shift($current_user->roles);
    $classes[] = $user_role.' ';
    return $classes;
}

/// Add user role class and user id to front-end body tag

// add 'class-name' to the $classes array
function class_to_body_admin($classes) {
    global $current_user;
    $user_role = array_shift($current_user->roles);
    /* Adds the user id to the admin body class array */
    $user_ID = $current_user->ID;
    $classes = $user_role.' '.'user-id-'.$user_ID ;
    return $classes;
    return 'user-id-'.$user_ID;
}
