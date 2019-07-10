<?php

include('function_secret.php');

/********************************************************
	
				CONTENTS LIST
	
*********************************************************

    01.00 - Style & Script & CDN loaded
    02.00 - Theme bug repair

*********************************************************/

/*---------------------------------------------------

        01.00 - Style & Script & CDN loaded

---------------------------------------------------*/

function themeslug_enqueue() {
    // 변수
    $CDN = 'https://cdnjs.cloudflare.com/ajax/libs';
    $Static = 'https://static4log.s3.ap-northeast-2.amazonaws.com/dan4log';
    $current_user = new WP_User(get_current_user_id());
    $user_role = array_shift($current_user->roles);

    // CDN
    // ------------------
    // style
    wp_enqueue_style( 'Font: FontAwesome        ', 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', array(), null, false);
    wp_enqueue_style( 'Font: D2coding           ', '//cdn.jsdelivr.net/gh/joungkyun/font-d2coding/d2coding.css', array(), null, false);
    wp_enqueue_style( 'Font: Google Fonts       ', '//fonts.googleapis.com/css?family=Yeon+Sung', array(), null, false);
    wp_enqueue_style( 'CSS : Slick              ', $CDN.'/slick-carousel/1.9.0/slick.min.css', array(), null, false); 
    wp_enqueue_style( 'Font: Material icon      ', 'https://fonts.googleapis.com/icon?family=Material+Icons', array(), null, false);
    // script
    wp_enqueue_script( 'JS : ScrollReveal       ', $CDN.'/scrollReveal.js/4.0.5/scrollreveal.min.js', array(), null, false);
    wp_enqueue_script( 'JS : Slick              ', $CDN.'/slick-carousel/1.9.0/slick.min.js', array(), null, false);
    wp_enqueue_script( 'JS : jQuery cookie      ', $CDN.'/jquery-cookie/1.4.1/jquery.cookie.min.js', array(), null, false);
    wp_enqueue_script( 'JS : Infinitie          ', $CDN.'/jquery-infinitescroll/3.0.6/infinite-scroll.pkgd.min.js', array(), null, false);
    wp_enqueue_script( 'JS : Vue                ', $CDN.'/vue/2.0.1/vue.min.js', array(), null, false);

    // Static
    // ------------------
    // style
    // script
    wp_enqueue_script( 'DEV: Plugin             ', $Static.'/js/plugin.js', array(), null, true);
    wp_enqueue_script( 'DEV: ScrollReaval       ', $Static.'/js/ScrollReaval.js', array(), null, true);
    wp_enqueue_script( 'DEV: Color ver btn      ', $Static.'/js/color_ver_btn.js', array(), null, true);
    wp_enqueue_script( 'DEV: SlickSlider        ', $Static.'/js/slick-default.js', array(), null, true);
    wp_enqueue_script( 'DEV: InfinitiScroll     ', $Static.'/js/infinitiScroll.js', array(), null, true);
    wp_enqueue_script( 'DEV: Arrow animation    ', $Static.'/js/arrow_animation.js', array(), null, true);
    wp_enqueue_script( 'DEV: ParallaxDepthCard  ', $Static.'/js/ParallaxDepthCard.js', array(), null, true);
    wp_enqueue_script( 'DEV: index              ', $Static.'/js/index.js', array(), null, true);

    // 특정페이지에서만 불러오기
    // ------------------
    // 메인페이지
    // is_page('page slug')
    if ( is_page( 'resume' ) ){
        wp_enqueue_script( 'DEV: Resume green   ', $Static.'/js/resume-green-ani.js', array(), null, true);
    }

    // 특정유저에게만 불러오기
    // -----------------
    // 관리자
    // role active css
    if($user_role == 'administrator'){
        wp_enqueue_style( 'Developer            ', $Static.'/css/style.min.dev.css', false );
    }else{
        wp_enqueue_style( 'End User             ', $Static.'/css/style.min.css', false );
    }

}
add_action( 'wp_enqueue_scripts', 'themeslug_enqueue' );

//add header
function child_theme_head_script() {
	$theme_url = get_stylesheet_directory_uri();
?>
	<!-- Open Graph -->
	<meta property="og:image" content="https://static4log.s3.ap-northeast-2.amazonaws.com/images/seoimg.jpg"/>
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
    // 변수
    $CDN = '';
    $Static = 'https://static4log.s3.ap-northeast-2.amazonaws.com/dan4log';
    wp_enqueue_style('WP_list_table', $Static.'/css/admin_dashborad.css');
    wp_register_script( 'my_script', $Static.'/js/copy_btn.js', array('jquery'), '1', true);
    wp_register_style( 'FontAwesome', 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', false );

    // 실제 사용 여부 결정 ( 컨디셔널 테그 이용하면 특정 페이지에만 적용할 수도 있음)
    wp_enqueue_script( 'my_script' );
    wp_enqueue_style( 'FontAwesome' );
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

include('template/depth_card.php');
function depth_card(){
    $output=depth_card_template();
    return $output;
}
add_shortcode('depth_card','depth_card');

// 해당글에 관련된글 가져오기
// 같은 태그가있는 글을 가져와서 뿌려준다.
function relatedposts(){
    $output = '<div class="relatedposts">';

    $orig_post = $post;
    global $post;
    $tags = wp_get_post_tags($post->ID);


    $output .= '<div class="relatedthumb"><ul>';
    if ($tags) {
        $tag_ids = array();
        foreach($tags as $individual_tag) $tag_ids[] = $individual_tag->term_id;
        $args=array(
            'tag__in' => $tag_ids,
            'post__not_in' => array($post->ID),
            'posts_per_page'=>2, // Number of related posts to display.
            'caller_get_posts'=>1
        );

        $my_query = new wp_query( $args );
        while( $my_query->have_posts() ) {
            $my_query->the_post();
            $output .= '<li><a href="'.get_the_permalink().'">'.get_the_title().'</a></li>';
        }
    }
    $output .= '</ul></div>';
    $output .= '</div>';

    return $output;
}
add_shortcode('relatedposts', 'relatedposts');


// TODO: github Markdown url 자동붙여넣기
// ACF폼에 깃헙.md 불러오는 폼이 제작되어있는데 이거를 활용해서
// 포스트의 컨텐츠에서 깃헙.md 숏코드만 불러와도 전부다 불러올수있도록
// 이것을 왜 만드냐?
// 깃헙.md 주소를 복사붙여넣기할때 2번씩이나 움직여서 붙여넣는 프로세스가 불편하다.
function github_md_Refactoring($atts){
    $default_atts = array(
        'token' => ''
    );
    extract( shortcode_atts( $default_atts, $atts ) );
    $githublink = get_field('github',$term->ID);
    //$output = '[md_github token='.$atts->token.' url='.$githublink.']';
    $output = '<div class="git_test">[md_github token='.$atts['token'].' url='.$githublink.']</div>';
    return $output;
}
add_shortcode('gitmd_re','github_md_Refactoring');

function category_notion_style(){
    $term = get_queried_object();
    $notion_style = get_field('notion-style', $term);
    $how_to_use_icon = get_field('fontawesome__material', $term);
    if($notion_style == true){
        $output = '<meta class="diviLib_thumOff_sideOn" cover="open" cover-bg-data="'.get_field('taxonomy-bg',$term).'"></meta>';
        $output .= '<div class="taxonomy_wrapper"><a href="'.get_category_link($term).'"><h1>';

        switch($how_to_use_icon){
            case 'fa':
                $output .= '<i class="taxonomy_logo '.get_field('notion-fontawesome-icon', $term).'"></i>';
                $output .= '</h1></a><h1>'.$term->name.'</h1></div>';
                return $output;
            case 'mdi':
                $output .= '<i class="material-icons taxonomy_logo">'.get_field('notion-material-icon', $term).'</i>';
                $output .= '</h1></a><h1>'.$term->name.'</h1></div>';
                return $output;
            default:
                $output .= 'not chose';
                return $output; 
        }
    }else{
        $output = '<meta class="diviLib_thumOff_sideOn" corver="close" corver-bg-data="'.get_field('taxonomy-bg',$term).'"></meta>';
        return $output;
    }
}
add_shortcode('cns', 'category_notion_style');