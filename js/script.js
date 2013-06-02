(function() {
  $(document).ready(function() {
    var $container, H, K, cols, config, doClose, doOpen, user, validateEmail;

    doOpen = function() {
      $(this).addClass("hover");
      return $('ul:first', this).slideDown(200, 'swing');
    };
    doClose = function() {
      return $('ul:first', this).slideUp(200, 'swing', function() {
        return $(this).parent('li').removeClass("hover");
      });
    };
    config = {
      over: doOpen,
      sensitivity: 10,
      interval: 0,
      timeout: 100,
      out: doClose
    };
    $("nav.menu ul li:has(ul)").hoverIntent(config);
    $('#slider').nivoSlider();
    $.scrollUp({
      'location': 'right',
      'image_src': '/img/arrow_up.png',
      'wait': 100,
      'time': 300
    });
    $(".portfolio .item a.lightbox, .gallery-icon a").fancybox({
      overlayOpacity: 0.6,
      overlayColor: '#000',
      titlePosition: 'inside'
    });
    $('a[rel=tipsy]').tipsy({
      fade: true,
      gravity: 's'
    });
    $container = $('#portfolio-filter');
    cols = $container.data('cols');
    $container.isotope({
      itemSelector: '.item',
      resizable: false,
      masonry: {
        columnWidth: $container.width() / cols
      }
    });
    $(window).smartresize(function() {
      return $container.isotope({
        masonry: {
          columnWidth: $container.width() / cols
        }
      });
    });
    $('#filters a').click(function() {
      var selector;

      selector = $(this).attr('data-filter');
      $('#filters a').removeClass('active');
      $(this).addClass('active');
      $container.isotope({
        filter: selector
      });
      return false;
    });
    $("nav.menu > ul").tinyNav({
      active: 'current-menu-item'
    });
    K = function() {
      var a;

      a = navigator.userAgent;
      return {
        ie: a.match(/MSIE\s([^;]*)/)
      };
    };
    H = function(a) {
      var b, c, d, day, e, hour, minute, week;

      b = new Date();
      c = new Date(a);
      if (K.ie) {
        c = Date.parse(a.replace(/( \+)/, " UTC$1"));
      }
      d = b - c;
      e = 1000;
      minute = e * 60;
      hour = minute * 60;
      day = hour * 24;
      week = day * 7;
      if (isNaN(d) || d < 0) {
        return "";
      }
      if (d < e * 7) {
        return "right now";
      }
      if (d < minute) {
        return Math.floor(d / e) + " seconds ago";
      }
      if (d < minute * 2) {
        return "about 1 minute ago";
      }
      if (d < hour) {
        return Math.floor(d / minute) + " minutes ago";
      }
      if (d < hour * 2) {
        return "about 1 hour ago";
      }
      if (d < day) {
        return Math.floor(d / hour) + " hours ago";
      }
      if (d > day && d < day * 2) {
        return "yesterday";
      }
      if (d < day * 365) {
        return Math.floor(d / day) + " days ago";
      } else {
        return "over a year ago";
      }
    };
    user = 'mattweppler';
    $.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + user + '&include_rts=true&include_entities=true&count=2&callback=?', function(data) {
      var tweet;

      tweet = data[0].text;
      $.each(data, function() {
        var className;

        if ($(this)[0].retweeted_status) {
          className = 'retweet';
        } else {
          className = '';
        }
        tweet = $(this)[0].text;
        tweet = tweet.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, function(url) {
          return '<a href="' + url + '">' + url + '</a>';
        }).replace(/B@([_a-z0-9]+)/ig, function(reply) {
          return reply.charAt(0) + '<a href="http://twitter.com/' + reply.substring(1) + '">' + reply.substring(1) + '</a>';
        });
        return $('#tweets').append('<li class="' + className + '">' + tweet + '<span><a href="http://twitter.com/' + $(this)[0].user.screen_name + '/status/' + $(this)[0].id + '" terget="_blank">' + H($(this)[0].created_at) + '</a></span></li>');
      });
      return $('#tweets').fadeIn(300);
    });
    $('.header-notice a.close').click(function() {
      $('.header-notice').slideUp(200);
      return false;
    });
    $('.alert .close').live('click', function() {
      $(this).parent('.alert').fadeOut(200);
      return false;
    });
    validateEmail = function(email) {
      var re;

      re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\.+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
    return $('#contact_form').submit(function() {
      var email, message, name;

      $('.alert', this).remove();
      $('input[type=submit]').attr('disabled', 'disabled');
      name = $('#name', this).val();
      email = $('#email', this).val();
      message = $('#message', this).val();
      if ((name === '') || (email === '') || (message === '')) {
        $('#contact_form').prepend("<div class=\"alert alert-warning\">\n      <p><strong>Notice:</strong> No fields can be blank.</p>\n      <a href=\"#\" class=\"close\">X</a>\n    </div>");
        $('input[type=submit]').removeAttr('disabled');
        return false;
      }
      if (!validateEmail(email)) {
        $('#contact_form').prepend("<div class=\"alert alert-warning\">\n        <p><strong>Notice:</strong> Your email is not valid.</p>\n        <a href=\"#\" class=\"close\">X</a>\n    </div>");
        $('input[type=submit]').removeAttr('disabled');
        return false;
      }
      $.post("mailer.php", {
        name: name,
        email: email,
        message: message
      }, function(data) {
        if (data === '') {
          $('#contact_form').prepend("<div class=\"alert alert-error\">\n        <p><strong>Sorry:</strong> Something went wrong, try later.</p>\n        <a href=\"#\" class=\"close\">X</a>\n      </div>");
        }
        if (data === 'success') {
          $('#contact_form').prepend("<div class=\"alert alert-success\">\n        <p><strong>Success:</strong> Your message was sent!</p>\n        <a href=\"#\" class=\"close\">X</a>\n      </div>");
          $('#contact_form input[type=text], #contact_form input[type=email], #contact_form textarea').val('');
          return $('input[type=submit]').removeAttr('disabled');
        }
      });
      return false;
    });
    /*$('body').append """
    <div class="styleSwitch">
      <ul>
        <li><a href="#" data-color="red" class="red"></a></li>
        <li><a href="#" data-color="blue" class="blue"></a></li>
        <li><a href="#" data-color="dark" class="dark"></a></li>
        <li><a href="#" data-color="green" class="green"></a></li>
        <li><a href="#" data-color="yellow" class="yellow"></a></li>
        <li><a href="#" data-color="pink" class="pink"></a></li>
        <li><a href="#" data-color="purple" class="purple"></a></li>
      </ul>
    </div>"""
    
    
    $('.styleSwitch a').click ->
      color = $(this).data('color')
    
      $('head link').first().attr('href', 'css/' + color + '.css')
    
      return false
    */

  });

}).call(this);
