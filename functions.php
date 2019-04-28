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
}
add_action( 'wp_enqueue_scripts', 'themeslug_enqueue_style' );

function themeslug_enqueue_script() {
	wp_enqueue_script( 'ScrollReveal', 'https://unpkg.com/scrollreveal', false);
	wp_enqueue_script( 'slick', 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js', false );
	wp_enqueue_script( 'jQuery cookie', '//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js', false );
    wp_enqueue_script('infiniti.js', '//unpkg.com/infinite-scroll@3/dist/infinite-scroll.pkgd.min.js', false );
    wp_enqueue_script('Vue', '//cdnjs.cloudflare.com/ajax/libs/vue/2.0.1/vue.min.js', false );
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
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/plugin.js"></script>
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/ScrollReaval.js"></script>
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/color_ver_btn.js"></script>
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/slick-default.js"></script>
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/infinitiScroll.js"></script>
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/arrow_animation.js"></script>
    <script type="text/javascript" src="<?php echo get_stylesheet_directory_uri() ?>/code/js/Babel/ParallaxDepthCard.js"></script>
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
    $atts = shortcode_atts(
        array(
            'name' => 0,
            'url' => 0,
            'docs_id' => 0
        ),
        $atts
    );

    //  여기에만 사용할 폰트
    $output = '<link href="https://fonts.googleapis.com/css?family=Allerta+Stencil" rel="stylesheet">';
    //  title
    $output .= '<a href="'.$atts[url].'"><div class="book_title"><i class="fas fa-book"></i> '.$atts[name].'</div></a>';

    $output .= '<div class="book_list_wrap">';

    // current 분류용 변수
    $current_tax = get_queried_object()->term_id;
    $current_filter_post = get_post()->ID;
    // 중간 장
    $custom_tax_name = 'library';
    // 책 카테고리의 ID값 넣기
    $custom_tax_id = $atts[docs_id]; //99 -> python
    $termchildren = get_term_children( $custom_tax_id, $custom_tax_name );
    foreach ( $termchildren as $child ) {
        $term = get_term_by( 'id', $child, $custom_tax_name );
        $output .= '<a href="' . get_term_link( $child, $custom_tax_name ) . '">' . $term->name . '</a>';

        // 해당 장의 post
        $args = array(
            'post_type' => 'docs',
            'order' => 'ASC',
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
            // TODO
            // 부모 카테고리 자동으로 찾는 방법
            if($current_tax !== 99 && $current_tax !== 101){
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
