---
layout: post
meta-description:
meta-keywords:
preview: |
  What most people think about when they hear HTML5 are rainbows and fairy dust, the ability to sprinkle a little jQuery on your page and magically transform it into a time machine.
title: What is HTML 5?
---
# What is HTML 5?

<img title="HTML5 Powered with Connectivity / Realtime, CSS3 / Styling, Device Access, Graphics, 3D &amp; Effects, Multimedia, Performance &amp; Integration, Semantics, and Offline &amp; Storage" src="http://www.w3.org/html/logo/badge/html5-badge-h-connectivity-css3-device-graphics-multimedia-performance-semantics-storage.png" alt="HTML5 Powered with Connectivity / Realtime, CSS3 / Styling, Device Access, Graphics, 3D &amp; Effects, Multimedia, Performance &amp; Integration, Semantics, and Offline &amp; Storage" width="357" height="64" style="float: left; margin: 0 25px;" />

What most people think about when they hear HTML5 are rainbows and fairy dust, the ability to sprinkle a little jQuery on your page and magically transform it into a time machine. HTML 5 is the new specification for web designers, developers alike. It includes new API’s that provide geolocation aware sites, new graphics capabilities, media playback, offline storage, &amp; more. HTML 5 has heavy separation of Functionality (Javascript), Presentation (CSS), &amp; Structure (HTML).

Some new elements include: audio, canvas, video  
* canvas is used for rendering dynamic bitmap graphics on the fly, such as graphs or games.
* video and audio for multimedia content. Both provide an API so application authors can script their own user interface, but there is also a way to trigger a user interface provided by the user agent. source elements are used together with these elements if there are multiple streams available of different types.

Some new attributes: html:manifest, script:async  
* The html element has a new attribute called manifest that points to an application cache manifest used in conjunction with the API for offline Web applications.
* The script element has a new attribute called async that influences script loading and execution.

Some attribute changes: draggable, dropzone, onevent-name, script, style  
* The draggable and dropzone attributes can be used together with the new drag &amp; drop API.

HTML5 also makes all event handler attributes from HTML4, which take the form onevent-name, global attributes and adds several new event handler attributes for new events it defines. E.g. the play event which is used by the API for the media elements (video and audio).

The type attribute on script and style is no longer required if the scripting language is ECMAScript and the styling language is CSS respectively.

## API's

HTML5 introduces a number of APIs that help in creating Web applications. These can be used together with the new elements introduced for applications:

* API for playing of video and audio which can be used with the new elements:  
{% highlight html %}
<audio></audio>
<video></video>
{% endhighlight %}
* An API that enables offline Web applications.
* An API that allows a Web application to register itself for certain protocols or media types.
* Editing API in combination with a new global attribute:  
{% highlight html %}
<p contenteditable="true">Some text here.</p>
{% endhighlight %}
* Drag &amp; drop API in combination with an attribute:  
{% highlight html %}
<div draggable="true">Some dragable content.</div>
{% endhighlight %}
* API that exposes the history and allows pages to add to it to prevent breaking the back button.

If you have some extra time see it in action <a href="http://slides.html5rocks.com" target="_blank">HTML 5 Rocks</a>.

<a href="http://www.1stwebdesigner.com/inspiration/ultra-modern-websites-html5/" target="_blank">Check out some sample sites that implement many of the HTML 5 features mentioned</a>
