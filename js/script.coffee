$(document).ready ->


	# Dropdown menu ----------

	doOpen = ->
		$(this).addClass("hover")
		$('ul:first', this).slideDown(200, 'swing')
   
 
	doClose = ->
		$('ul:first', this).slideUp(200, 'swing', ->
			$(this).parent('li').removeClass("hover")
		)

	config =
		over: doOpen
		sensitivity: 10
		interval: 0
		timeout: 100
		out: doClose


	$("nav.menu ul li:has(ul)").hoverIntent(config)

	# Slider -----------------

	$('#slider').nivoSlider()


	# ScrollUp ---------------

	$.scrollUp
		'location': 'right'
		'image_src': 'img/arrow_up.png'
		'wait': 100
		'time': 300


	# Fancybox ---------------
	$(".portfolio .item a.lightbox, .gallery-icon a").fancybox
		overlayOpacity: 0.6
		overlayColor: '#000'
		titlePosition: 'inside'


	# Tooltip ---------------

	 $('a[rel=tipsy]').tipsy
	 	fade: true
	 	gravity: 's'


	# Isotope ---------------

	$container = $('#portfolio-filter')
	cols = $container.data('cols')

	$container.isotope
		itemSelector : '.item'
		resizable: false
		masonry: 
			columnWidth: $container.width() / cols

	$(window).smartresize ->
  		$container.isotope
    		masonry:
    			columnWidth: $container.width() / cols


	$('#filters a').click ->
		selector = $(this).attr('data-filter')
		$('#filters a').removeClass('active')
		$(this).addClass('active')
		$container.isotope
			filter: selector
		
		return false


	# Responsive menu ---------------

	$("nav.menu > ul").tinyNav
		active: 'current-menu-item'



	# Twitter feed ---------------

	K = ->
		a = navigator.userAgent
		ie: a.match(/MSIE\s([^;]*)/)

	H = (a) ->
		b = new Date()
		c = new Date(a)
		c = Date.parse(a.replace(/( \+)/, " UTC$1"))  if K.ie
		d = b - c
		e = 1000
		minute = e * 60
		hour = minute * 60
		day = hour * 24
		week = day * 7
		return ""  if isNaN(d) or d < 0
		return "right now"  if d < e * 7
		return Math.floor(d / e) + " seconds ago"  if d < minute
		return "about 1 minute ago"  if d < minute * 2
		return Math.floor(d / minute) + " minutes ago"  if d < hour
		return "about 1 hour ago"  if d < hour * 2
		return Math.floor(d / hour) + " hours ago"  if d < day
		return "yesterday"  if d > day and d < day * 2
		if d < day * 365
			Math.floor(d / day) + " days ago"
		else
			"over a year ago"


	# set your twitter id
	user = 'envato'
	  
	# using jquery built in get json method with twitter api, return only one result
	$.getJSON('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + user + '&include_rts=true&include_entities=true&count=2&callback=?', (data)->
		  
		# result returned
		tweet = data[0].text

		$.each(data, ->
			if $(this)[0].retweeted_status
				className = 'retweet'
			else
				className = ''

			tweet = $(this)[0].text
			tweet = tweet.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, (url)->
				return '<a href="'+url+'">'+url+'</a>'
			).replace(/B@([_a-z0-9]+)/ig, (reply)->
				return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
			)
			$('#tweets').append('<li class="' + className + '">' + tweet + '<span><a href="http://twitter.com/' + $(this)[0].user.screen_name + '/status/' + $(this)[0].id + '" terget="_blank">' + H($(this)[0].created_at) + '</a></span></li>')
		)

		$('#tweets').fadeIn(300)
	)


	# Close header notice ---------------

	$('.header-notice a.close').click ->
		$('.header-notice').slideUp(200)

		return false


	# Remove alerts ---------------

	$('.alert .close').live('click', ->
		$(this).parent('.alert').fadeOut(200)
		return false
	)



	# Contact form ---------------

	validateEmail = (email)->
    	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\.+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email)

	$('#contact_form').submit ->

		$('.alert', this).remove()

		$('input[type=submit]').attr('disabled', 'disabled')

		name = $('#name', this).val()
		email = $('#email', this).val()
		message = $('#message', this).val()
		#data = 'name='+ name + '&email=' + email + '&message=' + message

		if (name is '') or (email is '') or (message is '')
			$('#contact_form').prepend """
			<div class="alert alert-warning">
	          <p><strong>Notice:</strong> No fields can be blank.</p>
	          <a href="#" class="close">X</a>
	        </div>
			"""

			$('input[type=submit]').removeAttr('disabled')

			return false


		# Validate email
		if !validateEmail(email)
			$('#contact_form').prepend """
			<div class="alert alert-warning">
	            <p><strong>Notice:</strong> Your email is not valid.</p>
	            <a href="#" class="close">X</a>
	        </div>
			"""
			$('input[type=submit]').removeAttr('disabled')

			return false


		$.post("mailer.php", { name: name, email: email, message: message }, (data)->
			if data is ''
				$('#contact_form').prepend """
				<div class="alert alert-error">
	              <p><strong>Sorry:</strong> Something went wrong, try later.</p>
	              <a href="#" class="close">X</a>
	            </div>
				"""
			
			if data is 'success'
				$('#contact_form').prepend """
				<div class="alert alert-success">
	              <p><strong>Success:</strong> Your message was sent!</p>
	              <a href="#" class="close">X</a>
	            </div>
				"""

				$('#contact_form input[type=text], #contact_form input[type=email], #contact_form textarea').val('')

				$('input[type=submit]').removeAttr('disabled')
		)

		
		

		return false

	# Style switch ---------------

	## Style switcher 
	###$('body').append """
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

	###



