'use strict';

Vue.config.devtools = true;

Vue.component('card', {
	template: '\n\t\t<div class="card-wrap" @mousemove="handleMouseMove" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="card">\n\t\t\t<div class="card" :style="cardStyle">\n\t\t\t\t<div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>\n\t\t\t\t<div class="card-info">\n\t\t\t\t\t<slot name="header"></slot>\n\t\t\t\t\t<slot name="content"></slot>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t',
	mounted: function mounted() {
		this.width = this.$refs.card.offsetWidth;
		this.height = this.$refs.card.offsetHeight;
	},

	props: ['dataImage'],
	data: function data() {
		return {
			width: 0,
			height: 0,
			mouseX: 0,
			mouseY: 0,
			mouseLeaveDelay: null
		};
	},
	computed: {
		mousePX: function mousePX() {
			return this.mouseX / this.width;
		},
		mousePY: function mousePY() {
			return this.mouseY / this.height;
		},
		cardStyle: function cardStyle() {
			var rX = this.mousePX * 30;
			var rY = this.mousePY * -30;
			return {
				transform: 'rotateY(' + rX + 'deg) rotateX(' + rY + 'deg)'
			};
		},
		cardBgTransform: function cardBgTransform() {
			var tX = this.mousePX * -40;
			var tY = this.mousePY * -40;
			return {
				transform: 'translateX(' + tX + 'px) translateY(' + tY + 'px)'
			};
		},
		cardBgImage: function cardBgImage() {
			return {
				backgroundImage: 'url(' + this.dataImage + ')'
			};
		}
	},
	methods: {
		handleMouseMove: function handleMouseMove(e) {
			this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2;
			this.mouseX = this.mouseX - 225;
			this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2;
		},
		handleMouseEnter: function handleMouseEnter() {
			clearTimeout(this.mouseLeaveDelay);
		},
		handleMouseLeave: function handleMouseLeave() {
			var _this = this;

			this.mouseLeaveDelay = setTimeout(function () {
				_this.mouseX = 0;
				_this.mouseY = 0;
			}, 1000);
		}
	}
});

var app = new Vue({
	el: '#app'
});
//# sourceMappingURL=map/ParallaxDepthCard.js.map
