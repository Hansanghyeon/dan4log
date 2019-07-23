let _diviLib_thumOff_sideOn = document.querySelector(".diviLib_thumOff_sideOn");
let cover = document.querySelector(".category-hero-section");
let cover_meta = document.querySelector(".category-hero-section meta");
let content_wrap_title = document.querySelector(".no-hero");

if (_diviLib_thumOff_sideOn) {
  let _open = () => {
    cover.classList += " open";
    cover.style.backgroundImage =
      "url('" + cover_meta.getAttribute("cover-bg-data") + "')";
    content_wrap_title.style.display = "none";
  };

  let _close = () => {
    content_wrap_title.style.display = "block";
  };

  cover_meta.getAttribute("cover") == "open" ? _open() : _close();
}

(function($) {
  $(".disqus_btn").on("click", function() {
    $("#disqus_thread").toggle();
    $(this).toggleClass("active");
  });
})(jQuery);
