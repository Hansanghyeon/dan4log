<?php

include('code/php/unctions_secret.php');

//custom css or js for header
function themeslug_enqueue_style() {
	wp_enqueue_style( 'FontAwesome', 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', false );
	wp_enqueue_style( 'slick', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css', false ); 
	wp_enqueue_style( 'D2coding', '//cdn.jsdelivr.net/gh/joungkyun/font-d2coding/d2coding.css', false );
}
add_action( 'wp_enqueue_scripts', 'themeslug_enqueue_style' );

function themeslug_enqueue_script() {
	wp_enqueue_script( 'ScrollReveal', 'https://unpkg.com/scrollreveal', false);
	wp_enqueue_script( 'slick', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', false );
	wp_enqueue_script( 'jQuery cookie', '//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js', false );
    wp_enqueue_script('infiniti.js', '//unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.min.js', false );
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
<script type="text/javascript" src="/wp-content/themes/Divi-child/code/js/plugin.js"></script>
<script type="text/javascript" src="/wp-content/themes/Divi-child/code/js/ScrollReaval.js"></script>
<script type="text/javascript" src="/wp-content/themes/Divi-child/code/js/color_ver_btn.js"></script>
<script type="text/javascript" src="/wp-content/themes/Divi-child/code/js/slick-default.js"></script>
    <script type="text/javascript" src="/wp-content/themes/Divi-child/code/js/infinitiScroll.js"></script>
<?php } 
add_action('wp_footer', 'add_this_script_footer');


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
	$return_string = '<div class="region_badge">'.get_post_meta( get_the_ID(), $atts['key'], true ).'</div>';
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

