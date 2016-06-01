$(document).ready(function() {
     /* ----------------------------------------------------- 
        Bootstrap Components 
     -------------------------------------------------------- */
     (function(){
          /* Tooltips */
          $('.t-tips').tooltip();
          
          /* Tabs */
          $('.my-tab a').click(function (e) {
               e.preventDefault();
               $(this).tab('show');
          });
          
          /* Accordian */
          $('.accordion .accordion-toggle').append('<i class="icon-angle-right"></i>');
     })();
     /* ----------------------------------------------------- 
        Flex slider 
     -------------------------------------------------------- */
     (function(){
          $('.flexslider').flexslider({
               animation: "fade",             
               slideshow: true,               
               slideshowSpeed: 7000,          
               animationDuration: 500,        
               directionNav: true,            
               controlNav: true,              
               keyboardNav: true,              
               touchSwipe: true,              
               prevText: "Previous",          
               nextText: "Next",              
               randomize: false,                
               slideToStart: 0,                
               pauseOnAction: true,            
               pauseOnHover: false         
          });
          
          /* Add pixel-perfect icons for arrows */
          $('.flex-prev').html('<i class="icon-double-angle-left"></i>');
          $('.flex-next').html('<i class="icon-double-angle-right"></i>');
     })();
     
     /* --------------------------------------------------------------------- 
        Page Scrolling Animation
     ------------------------------------------------------------------------ */
     (function(){
          $('#navigation a').click(function(e){
               var href = $(this).attr("href"),
               offsetTop = href === "#" ? 0 : $(href).offset().top;
               $('html, body').stop().animate({ 
               scrollTop: offsetTop
          }, 1000);
               e.preventDefault();
          });
     })();
     
     /* --------------------------------------------------------------------- 
        Sticky Menu with active menu
     ------------------------------------------------------------------------ */
     (function() {
          var nav_container = $(".nav-container");
          var nav = $("nav");
          var waypoint_offset = 0;
          var secs = $('#team, #about-us, #testimonials, #portfolio, #contact');
          secs.prepend('<div class="v-space-sticky"></div>');
          
          nav_container.waypoint({
               handler: function(event, direction) {
                    if (direction == 'down') {
                         nav_container.css({ 'height':nav.outerHeight() });		
                         nav.stop().addClass("sticky");
                    } else {
                         nav_container.css({ 'height':'auto' });
                         nav.stop().removeClass("sticky").css("top",nav.outerHeight()+waypoint_offset).animate({"top":"0"});
                    }
               },
               offset: function() {
                    return -nav.outerHeight()-waypoint_offset;
               }
          });
     
          var sections = $("section");
          var navigation_links = $("nav a");
          
          sections.waypoint({
               handler: function(event, direction) {
                    var active_section;
                    active_section = $(this);
                    if (direction === "up") active_section = active_section.prev();
                        
                    var active_link = $('nav a[href="#' + active_section.attr("id") + '"]');
                    navigation_links.removeClass("active");
                    active_link.addClass("active");
                    if($('.navbar').hasClass('sticky')) {
                         if(active_section.hasClass('light')) {
                              active_link.closest('.sticky').removeClass('light');
                              active_link.closest('.sticky').addClass('dark');
                         }
                         else {
                              active_link.closest('.sticky').removeClass('dark');
                              active_link.closest('.sticky').addClass('light');
                              $()
                         }
                    }
                    else {
                         $('.navbar').removeClass('dark');
                         $('.nav li:first a').addClass('active');
                    }
               },
               offset: '25%'
          });
     })();
     
     /* --------------------------------------------------------------------- 
        Portfolio
     ------------------------------------------------------------------------ */
     (function() {
          $('.tp-grid').addClass('initial');
		var $grid = $( '#tp-grid' ),
		$name = $( '#p-name' ),
          $ptitle  = $('#p-name').html(),
		$close = $( '#close' ),
		$loader = $( '<div class="loader"><i></i><i></i><i></i><i></i><i></i><i></i><span>Loading...</span></div>' ).insertBefore( $grid ),
					
          stapel = $grid.stapel({
			onLoad : function() {
				$loader.remove();
			},
			onBeforeOpen : function( pileName ){
				$name.html( 'Works we have done for: ' + pileName );
                    $('.tp-grid').removeClass('initial');
                    
			},
			onAfterOpen : function( pileName ){
				$close.show();
			}, 
		});

		$close.on( 'click', function(){
			$close.hide();
			$name.html($ptitle);
			stapel.closePile();
               $('.tp-grid').addClass('initial');
		});
     })();
     
     /* --------------------------------------------------------------------- 
          Center align the span items
     ------------------------------------------------------------------------ */
     (function(){
          $(window).resize(function() {
               if($(this).width() < 1200) {
                    $('.l-projects').addClass('t-center');
               }
               else {
                    $('.l-projects').removeClass('t-center');
               }
          })
          .resize();
     })();
     
     /* --------------------------------------------------------------------- 
          Feeds Drawer
     ------------------------------------------------------------------------ */
     (function(){
          $('.feeds-toggle').toggle(function(){
               feeds = $('.feeds');
               feedDisplay = $('#feeds-display');
               screenHeight = $(window).height();
               
               feeds.animate({height: screenHeight},500).css('position','fixed');
               $(this).find('span').addClass('f-close');
               $(this).addClass('fd-clicked');
               feedDisplay.animate({opacity: '1'},300);
          },
          function(){
               feedDisplay.animate({opacity: '0'},300);
               feeds.animate({height: ''}, 500);
               $(this).find('span').removeClass('f-close');
               $(this).removeClass('fd-clicked');         
          });
     })();
     
     /* --------------------------------------------------------------------- 
          Socialist Feeds
     ------------------------------------------------------------------------ */
     $('.feeds-toggle').one('click',function(){
          $('.socialist-loader').html('<div class="loader"><i></i><i></i><i></i><i></i><i></i><i></i><span>Loading...</span></div>' );
          $('#feeds-display').socialist({
               networks: [
                    //{name:'pinterest',id:'rushenn'},
                    //{name:'twitter',id:'in1dotcom'},
                    {name:'facebook',id:'in1dotcom'},
                    //{name:'craigslist',id:'boo',areaName:'southcoast'},
                    {name:'youtube',id:'smosh'},
                    {name:'rss',id:'http://picsisee.blogspot.com/feeds/posts/default'},
                    {name:'rss',id:'http://samzmob.blogspot.com/feeds/posts/default'},
                    {name:'rss',id:'http://ppeoplez.blogspot.com/feeds/posts/default'},
               ],
               isotope:true,
               random:true,
               maxResults:'4', /* Number of feeds to show from each network */
               textLength:'80',
               fields:['source','heading','text','date','image','followers','likes']

          });
           $('.socialist-pinterest .foot .api a').html('<i class="icon-pinterest"></i>');
               $('.socialist-rss .foot .api a').html('<i class="icon-rss"></i>');
               $('.socialist-twitter .foot .api a').html('<i class="icon-twitter"></i>');
               $('.socialist-facebook .foot .api a').html('<i class="icon-facebook-sign"></i>');
          //Add Icons
     });
     
     /* --------------------------------------------------------------------- 
          Custom Scrollbar
     ------------------------------------------------------------------------ */
     (function(){
          var sHeight = ($(window).height())-120;
          $('.overflow').css('height',sHeight);
		$('.overflow').enscroll({
			showOnHover: true,
			verticalTrackClass: 'track3',
			verticalHandleClass: 'handle3'
		});
     })();
     
     /* --------------------------------------------------------------------- 
        Contact Form Sizing
     ------------------------------------------------------------------------ */
     (function(){
          $('.c-form').append('<div class="arr"></div>');
          $('.arr').toggle(function(){
               $(this).parent().css('height','55px');
               $(this).addClass('c-open');
          },
          function(){
               $(this).parent().css('height','100%');
               $(this).removeClass('c-open');
          });
     })();
     
     /* --------------------------------------------------------------------- 
     Image Popup [Pirobox]
     ------------------------------------------------------------------------ */
     (function() {
          $().piroBox_ext({
              piro_speed : 700,
              bg_alpha : 0.5,
              piro_scroll : true // pirobox always positioned at the center of the page
          });
     })();
     
     /* --------------------------------------------------------------------- 
        Contact Form Validation and Submission
     ------------------------------------------------------------------------ */
     $("#contact-form").submit(function(e){
          e.preventDefault();
        
          email = $("#email");
          var err = 0;  
          $('#name, #email, #message', this).each(function(){ 
               var val = $.trim(this.value); 
               $(this).toggleClass('form-error', !val );
               if (!val)
               err++; 
          })
          
          if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.val())) {
               $('#email').addClass('form-error');
               return false;
          }
          
          if ($("input").hasClass("form-error")) {
               return false;
          }
          
          else {
               var form = $(this);
               var post_url = form.attr('action');
               var post_data = form.serialize();
               $('#formSubmit', form).html('<i class="icon-spinner icon-spin"></i>&nbsp;&nbsp;Your form being submitted...');
               $.ajax({
                    type: 'POST',
                    url: post_url, 
                    data: post_data,
                    success: function(msg) {
                         $(form).fadeOut(500, function(){
                              form.html(msg).fadeIn();
                         });
                    }
               });
               return true;  
          }  
     });
     
     /* --------------------------------------------------------------------- 
        Adding Fontawsome icons as bullets
     ------------------------------------------------------------------------ */
     (function(){
          $('ul.uno-list-1 li').prepend('<i class="icon-angle-right"></i>');
          $('ul.uno-list-2 li').prepend('<i class="icon-double-angle-right"></i>');
          $('ul.uno-list-3 li').prepend('<i class="icon-circle-blank"></i>');
          $('ul.uno-list-4 li').prepend('<i class="icon-ok"></i>');
          $('ul.uno-list-5 li').prepend('<i class="icon-arrow-right"></i>');
          $('ul.uno-list-6 li').prepend('<i class="icon-check-empty"></i>');
     })();

     
});

$(window).bind('load', function(){
     /* --------------------------------------------------------------------- 
     Page loading animation
     ------------------------------------------------------------------------ */
     var page = $('#p-load');
     page.animate({opacity:'0'},1000, function(){
          page.hide();
     });
     
     /* --------------------------------------------------------------------- 
     Testimonials
     ------------------------------------------------------------------------ */
     $('#masonry').masonry({
          itemSelector: '.ts-items',
          columnWidth: 270,
          gutterWidth: 30,
          isAnimated: true
     });
     
});
