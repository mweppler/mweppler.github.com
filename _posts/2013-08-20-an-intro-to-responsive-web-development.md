---
layout: post
meta-description: An Intro to Responsive Web Development
meta-keywords: responsive web design, responsive web development, fixed layout, fluid layout, adaptive layout, responsive layout
preview: |
  Ok, lets recap. We created a grid composed of fixed values to serve as our baseline. This made it easier to convert to a fluid grid using the target / context rule.
syntax-highlighting: true
title: An Intro to Responsive Web Development
---

# An Intro to Responsive Web Development

## _What should I know before beginning?_  

Experience with some of the following technologies will be helpful, but you should still be able to follow along:  

* HTML (structural)  
* CSS (presentation)  
* JavaScript (behavioral)  

## _Recommended reading before beginning:_  
<!--

_Creating Structure:_  

_Styling Content:_  
-->

<a href="http://matt.weppler.me/2013/07/31/the-box-model.html" target="_blank" title="The Box Model">The Box Model</a>

## _What is Responsive Web Design? and how does it differ from fixed, fluid & adaptive?_  

### A Fixed Layout  

With a fixed layout the page is built to look good at fixed or static dimensions. So you might create a container for your content and set its width in pixels, and you might set your font sizes using pixels as well. This allows you some control over layout of your page, _provided the user hasn't changed a bunch of the browsers default settings_. If the user is viewing the site at a narrower width than your container, the browser will introduce scroll bars. If the user is viewing on a modern smart phone/mobile device, the browser will try to fit the width of the page to the viewport's width. This is how a great deal of sites have been built in the past. It does not offer much in regards to flexibility.


{% highlight css %}
.container {
  font-size: 16px;
  margin: 0 auto;
  width: 960px;
}
{% endhighlight %}

### A Fluid Layout  

A fluid layout is another approach to building a web page but instead of using static values you would use relative values. With a fluid layout your browser scales the layout depending on the width of the device you're viewing it on. So that same container for your main content would have a width of say 90% instead of 960 pixels. Your fonts might use percentages as well, or em's to allow flexibility of your typography. When taking this approach, you are assured the container will always be at most 90% of the page width. While this can be a great first step toward a responsive design, it is not the best solution.

{% highlight css %}
.container {
  font-size: 1em;
  margin: 0 auto;
  width: 90%;
}
{% endhighlight %}

### An Adaptive Layout  

An adaptive layout is a more modern layout, and it uses CSS3 media queries. With an adaptive layout you might still take the approach of static css values, but change these values to fit comfortably in the viewport. So if the user is visiting your site with a desktop browser you might style the container at 960 pixels, but if they are on a mobile phone in portrait view (320px in most cases), your container might be 300 pixels. You would add a line similar to: @media screen and (max-width: 320px). This is what we call a "breakpoint", the point at which the browser responds with the CSS specified in that block.

{% highlight css %}
.container {
  margin: 0 auto;
  width: 960px;
}

@media screen and (max-width: 1024px) and (min-width: 641px) {
  .container {
    margin: 0 auto;
    width: 586px;
  }
}

@media screen and (max-width: 640px) and (min-width: 320px) {
  .container {
    margin: 0 auto;
    width: 90%;
  }
}
{% endhighlight %}

### A Responsive Layout  

...and finally the moment you've all been waiting for! A responsive layout responds to the device it is being viewed on and adapts to that screen's size. How do you accomplish this? With a combination of fluid and adaptive layout techniques. I think a demo is worth a thousand words so lets take a look at one.

Take a look at the following codepen: <a href="http://codepen.io/mweppler/pen/dwIin" target="_blank" title="Layout Differences">Layout Differences</a>. Change the class on the body from 'fixed', to 'fluid', to 'adaptive' and to 'responsive'  

## CSS Distance Units, or Ems and Percents and Pixels oh my...

There are quite a few Distance Units, but I am going to focus on some of the more common ones. We will start with _Relative_ length units. With relative length units, the length specified is relative to another length. Relative lengths include:  

* em: relative to the calculated font size of the element, unless used on the font-size property, in which case it is the inherited font-size of the element.  
* rem: relative to the font size of the root element (the html tag, unless used on the font-size of the html element, in which case it is the initial value, this unit is not supported by IE8 and lower)  
* vh: relative to 1% of the viewport's height (* this unit is not supported by IE8 and lower)  
* vw: relative to 1% of the viewport's width (* this unit is not supported by IE8 and lower)  
* vmax: relative to 1% of the viewport's larger dimension (* this unit is not supported by IE10 and lower)  
* vmin: relative to 1% of the viewport's smaller dimension (* this unit is not supported by IE9 and lower)  

*** explain *** Child elements do not inherit the relative values as specified for their parent; they inherit the computed values.  

*** explain *** Font-relative lengths: em & rem  

An em is an em is an em, except if the font-size for that element has been set. In that case an em is the calculated font-size. So if the elements font-size is calculated at 16px (the default) 1em is equal to 16px. If the calculated font-size is 24px, well 1em now becomes 24px. So what happens if we have an h1's calculated value at 24px but its font-size is set to 2em? The font-size of that h1 is now 100% greater than the computed font-size inherited by h1 elements.

Take the following example for instance:

{% highlight html %}
<div>
  <h1>Oh hai!</h1>
</div>
{% endhighlight %}

{% highlight css %}
div {
  font-size: 24px;
}

h1 {
  font-size: 2em; /* 48px */
}
{% endhighlight %}

The div has a font-size of 24px, h1 is a child of this div so the h1's computed font-size is 24px. We are than applying a font-size of 2em to the h1. Since its context is 24px and 2em is 100% greater than 1em, the h1's font-size in pixels is actually 48px.

For fun, add the following to a codepen:

{% highlight html %}
<p class="ems ems-1">MMMM</p>
<p class="ems ems-2">MM</p>
<p class="ems ems-4">M</p>
{% endhighlight %}

{% highlight css %}
.ems { background-color: lightblue; padding: 10px; margin: 0; }
.ems-1 { font-size: 1em; width: 4em; }
.ems-2 { font-size: 2em; width: 2em; }
.ems-4 { font-size: 4em; width: 1em; }
{% endhighlight %}

![Ems](/img/for-posts/an-intro-to-responsive-web-development/ems.png "Ems")  
_(Ems)_  

Viewport-percentage lengths: vw, vh, vmax, vmin  

Not all browsers support the following viewport-percentage lengths. For this reason I will not dive deep on them.

* vh unit: Equal to 1% of the height of the initial containing block.  
* vmin unit: Equal to the smaller of vw or vh.  
* vmax unit: Equal to the larger of vw or vh.  

I couldn't get this example to work on codepen for some reason so lets just open the following site: <a href="http://matt.weppler.me" target="_blank" title="Matt Weppler Blog">http://matt.weppler.me</a>. Using the development tools for your browser add the following html to the DOM. Open the javascript console and paste the follwing:

{% highlight javascript %}
var my_h1_element = document.createElement('h1');
my_h1_element.id = 'my-h1-element';
my_h1_element.appendChild(document.createTextNode('Oh Hai!'));
document.body.insertBefore(my_h1_element, document.body.firstChild);
{% endhighlight %}

You should now see the newly created h1 element at the top of the page. Lets get the computed css font-size for this element.

{% highlight javascript %}
window.getComputedStyle(my_h1_element).fontSize;
{% endhighlight %}

I don't know about you but for me it looks like the computed font size is '32px'. Since we're going to work 'vw' which is a relative value no worries if you didn't get 32px use substitute based on what you got. In this example, we'll make the browser viewport 400 pixels. You'll have to do this without the help of javascript. Now with the width of the viewport at 400px, lets set our h1's font size to 8vw. 

{% highlight javascript %}
my_h1_element.style.fontSize = '8vw';
{% endhighlight %}

Go ahead and resize the window, notice how the font size of the h1 element becomes larger and smaller based on the viewports width.

Absolute lengths: px  

Pixels are typically considered relative to the viewing device, one device pixel (dot) of the display.  

{% highlight html %}
<div class="outer">
  <div class="inner red"></div>
  <div class="inner green"></div>
</div>
{% endhighlight %}

{% highlight css %}
.outer {
  border: 5px solid black;
  height: 300px;
  width: 300px;
}

.inner {
  height: 150px;
  width: 150px;
}

.red {
  background-color: red;
}

.green {
  background-color: green;
  margin-left: 150px;
}
{% endhighlight %}

Percentage lengths: %

Percentage lengths depend on the size of their parent elements. So if you have a div with a width of 500px and 2 child divs at 50% each, the child divs widths are actually 250 pixels.  

{% highlight html %}
<div class="outer">
  <div class="inner red"></div>
  <div class="inner green"></div>
</div>
{% endhighlight %}

{% highlight css %}
.outer {
  border: 5px solid black;
  height: 500px;
  width: 500px;
}

.inner {
  height: 250px;
  width: 50%;
}

.red {
  background-color: red;
}

.green {
  background-color: green;
  margin-left: 50%;
}
{% endhighlight %}

Even when starting a new project from scratch with a mobile first mindset you'll still likely be working from a design comp. This will most likely be an Adobe Photoshop file. So you will no doubt be working with static units in some form. Here is a table that you can use to convert between px and em, or px and %. 

### Points to Pixels to Ems to Percent  

<table>
  <thead>
    <tr><th>Points</th><th>Pixels</th><th>Ems</th><th>Percent</th></tr>
  </thead>
  <tbody>
    <tr><td>6pt</td>    <td>8px</td>  <td>0.5em</td>   <td>50%</td></tr>
    <tr><td>7pt</td>    <td>9px</td>  <td>0.55em</td>  <td>55%</td></tr>
    <tr><td>7.5pt</td>  <td>10px</td> <td>0.625em</td> <td>62.5%</td></tr>
    <tr><td>8pt</td>    <td>11px</td> <td>0.7em</td>   <td>70%</td></tr>
    <tr><td>9pt</td>    <td>12px</td> <td>0.75em</td>  <td>75%</td></tr>
    <tr><td>10pt</td>   <td>13px</td> <td>0.8em</td>   <td>80%</td></tr>
    <tr><td>10.5pt</td> <td>14px</td> <td>0.875em</td> <td>87.5%</td></tr>
    <tr><td>11pt</td>   <td>15px</td> <td>0.95em</td>  <td>95%</td></tr>
    <tr><td>12pt</td>   <td>16px</td> <td>1em</td>     <td>100%</td></tr>
    <tr><td>13pt</td>   <td>17px</td> <td>1.05em</td>  <td>105%</td></tr>
    <tr><td>13.5pt</td> <td>18px</td> <td>1.125em</td> <td>112.5%</td></tr>
    <tr><td>14pt</td>   <td>19px</td> <td>1.2em</td>   <td>120%</td></tr>
    <tr><td>14.5pt</td> <td>20px</td> <td>1.25em</td>  <td>125%</td></tr>
    <tr><td>15pt</td>   <td>21px</td> <td>1.3em</td>   <td>130%</td></tr>
    <tr><td>16pt</td>   <td>22px</td> <td>1.4em</td>   <td>140%</td></tr>
    <tr><td>17pt</td>   <td>23px</td> <td>1.45em</td>  <td>145%</td></tr>
    <tr><td>18pt</td>   <td>24px</td> <td>1.5em</td>   <td>150%</td></tr>
    <tr><td>20pt</td>   <td>26px</td> <td>1.6em</td>   <td>160%</td></tr>
    <tr><td>22pt</td>   <td>29px</td> <td>1.8em</td>   <td>180%</td></tr>
    <tr><td>24pt</td>   <td>32px</td> <td>2em</td>     <td>200%</td></tr>
    <tr><td>26pt</td>   <td>35px</td> <td>2.2em</td>   <td>220%</td></tr>
    <tr><td>27pt</td>   <td>36px</td> <td>2.25em</td>  <td>225%</td></tr>
    <tr><td>28pt</td>   <td>37px</td> <td>2.3em</td>   <td>230%</td></tr>
    <tr><td>29pt</td>   <td>38px</td> <td>2.35em</td>  <td>235%</td></tr>
    <tr><td>30pt</td>   <td>40px</td> <td>2.45em</td>  <td>245%</td></tr>
    <tr><td>32pt</td>   <td>42px</td> <td>2.55em</td>  <td>255%</td></tr>
    <tr><td>34pt</td>   <td>45px</td> <td>2.75em</td>  <td>275%</td></tr>
    <tr><td>36pt</td>   <td>48px</td> <td>3em</td>     <td>300%</td></tr>
  </tbody>
</table>

### The Golden Rule: Target / Context = Result

Target divided by Context equals Result. Say it with me: "Target divided by Context equals Result". One more time...  

## So where do we begin? Why with a fluid foundation of course.  

### A Fluid Grid

Lets start with a fixed grid and work our way to a fluid one. The reason for this is that our designs will likely come from a Photoshop file or something similar. These will have been created using fixed value lengths (pixels).

Since we are not actually working from a design comp, I'll use gridulator as our base for our grid. Open <a href="http://gridulator.com" target="_blank" title="Gridulator">Gridulator</a> and set the overall width to 960 and the number of columns to 8. This should generate a few grid options (column width/gutter width pairs). Click the "Preview" button for the pair with a column width of 106 and a gutter width of 16. You can get an idea of our grid dimensions from the grid image that is displayed. Now click the "Make PNG" button, this should download an image named: 960px-8col-106w-16gut.png.  

![960 pixel, 8 column, 106 pixel width, 16 pixel gutter](/img/for-posts/an-intro-to-responsive-web-development/960px-8col-106w-16gut.png "960 pixel, 8 column, 106 pixel width, 16 pixel gutter")  
_(960 pixel, 8 column, 106 pixel width, 16 pixel gutter)_  

Lets start with our 'grid-container' class. What we'll want to do is constrain our container width to 960 pixels & center it in the page. To do this we add the following rules:  

{% highlight css %}
.grid-container {
  margin: 0 auto;
  width: 960px;
}
{% endhighlight %}

Next we create our 'grid' class. This will be applied to any elements that will act as a column in our grid. We will need our columns to float so we'll have to add the float left rule. We can also add the margin or gutter to this class:  

{% highlight css %}
.grid {
  float: left;
  margin-right: 16px;
}
{% endhighlight %}

Now lets start getting into the specific columns, we will name them 'grid-1' through 'grid-8' and give them the appropriate widths. To calculate the width we start with our column size of 106 pixels and add that to 'grid-1':  

{% highlight css %}
.grid-1 {
  width: 106px;
}
{% endhighlight %}

For 'grid-2' we need to take into account the base column width of 106 pixels, multiply that by 2 since 'grid-2' should take up the width of 2 columns, and add the first columns margin/gutter of 16px. So 'grid-2' should have a width of 228 pixels:  

{% highlight css %}
.grid-2 {
  width: 228px;
}
{% endhighlight %}

Moving on to 'grid-3' we follow the same approach of multiplying the base width with the number of columns, in this case 3, then we add the gutter base of 16 pixels multiplied by the number of columns minus 1. You can also just apply the following method. Take the previous grids width, so in this case that of 'grid-2' and add the base column width plus the gutter width. Either way we end up with grid-3's width being 350 pixels:  

{% highlight css %}
.grid-3 {
  width: 350px;
}
{% endhighlight %}

Go ahead and calculate the rest of the classes and check with those below:  

{% highlight css %}
.grid-4 {
  width: 472px;
}

.grid-5 {
  width: 594px;
}

.grid-6 {
  width: 716px;
}

.grid-7 {
  width: 838px;
}

.grid-8 {
  width: 960px;
}
{% endhighlight %}

Lets work with our grid to get familiar with it. In this example, we have a row of content with 2 columns, each column will take up half of the row. If you apply the following markup and styling notice what happens:  

{% highlight html %}
<div class="grid-container">
  <div class="grid grid-4">
    <img src="http://fpoimg.com/472x200?text=Column%20One" />
  </div>
  <div class="grid grid-4">
    <img src="http://fpoimg.com/472x200?text=Column%20Two" />
  </div>
</div>
{% endhighlight %}

The elements are stacking instead one on top of the other instead of inline side-by-side. Why? Well the 'grid' class has a gutter or right margin of 16 pixels. So when we take the width of the 'grid-4' class and multiply it by 2 we get 944. Now add the 2 right gutters which increase the width by 32 pixels and we're over the allowed width of the container's 960 pixels. We're over by 16 pixels to be exact. This is a common problem with this type of grid system and what we'll do to address it is add a new class 'omega'. This class will set the right margin to 0. We add this to the last column in each row.  

{% highlight css %}
.omega { margin-right: 0; }
{% endhighlight %}

...and we update our last column  

{% highlight html %}
<div class="grid-container">
  <div class="grid grid-4">
    <img src="http://fpoimg.com/472x200?text=Column%20One" />
  </div>
  <div class="grid grid-4 omega">
    <img src="http://fpoimg.com/472x200?text=Column%20Two" />
  </div>
</div>
{% endhighlight %}

That does what we expect. Great! Now that we have our tried and tested grid system in place, lets go ahead and make it fluid. Lets start by changing our 'grid-container' length from pixels to percent. We're going to set its width to 90 percent, just because that seems to work well.  

{% highlight css %}
.grid-container {
  width: 90%;
}
{% endhighlight %}

For the rest of our grid elements we're going to apply the Golden Rule:  

Target / Context = Result  

Start with the 'grid-8' and work your way down to 'grid-1'. Lets apply the target / context rule, where both target is 960 pixels and the context is 960 pixels (the original size of our container in pixels). This gives us 1, or 100 percent really.

{% highlight css %}
.grid-container {
  width: 90%;
}

...

.grid-8 {
  width: 100%; /* width: 960px; */
}
{% endhighlight %}

That was easy. Now on to 'grid-7' Again we apply the target / context, but this time the target is 838 pixels and the context is the 960 pixels. This gives us 0.87291666666667. You may think that rounding here is a good idea, but its not. No lets just set our width to its percentage by multipling by 100:  

{% highlight css %}
.grid-7 {
  width: 87.291666666667%; /* width: 838px; */
}

...

.grid-8 { ... }
{% endhighlight %}

Go ahead and give the remaining grid classes a shot, check with the values below:  

{% highlight css %}
...

.grid-1 {
  width: 11.041666666667%; /* width: 106px; */
}

.grid-2 {
  width: 23.75%; /* width: 228px; */
}
.grid-3 {
  width: 36.458333333333%; /* width: 350px; */
}

.grid-4 {
  width: 49.166666666667%; /* width: 472px; */
}

.grid-5 {
  width: 61.875%; /* width: 594px; */
}

.grid-6 {
  width: 74.583333333333%; /* width: 716px; */
}

...
{% endhighlight %}

Great but we have one more class to convert the 'grid' class itself. In this case we have the gutter or right margin. This takes us to the topic of margin and padding.  

### Margin & Padding  

How do we convert margins and padding? We use the same target / context = result. The main differences is in the context. For margins its simple in this case we use the containers width of 960 pixels. 

{% highlight css %}
# Converting margin: 16 pixels (target) / 960 pixels (context) = 1.666666666667
.grid {
  margin-right: 1.666666666667%; /* margin-right: 16px; */
}
{% endhighlight %}

For padding however we would use the actual element's width as the context. Since we are not dealing with any padding just yet, we'll just have to use some mock values in order to drive the point home. Since I am going to use images to do this, we will transition into the next part of responsive design, scalable images.  

### Scalable Images

Lets swap-out the html in our codepen with the following:  

{% highlight css %}
<div class="grid-container">
  <div class="grid grid-4">
    <img class="full" src="http://fpoimg.com/472x200?text=Full" />
  </div>
  <div class="grid grid-4 omega">
    <img class="full" src="http://fpoimg.com/472x200?text=Full" />
  </div>
  <div class="grid grid-4">
    <img class="half" src="http://fpoimg.com/236x200?text=Half" /><img class="half omega" src="http://fpoimg.com/236x200?text=Half" />
  </div>
  <div class="grid grid-4 omega">
    <img class="full" src="http://fpoimg.com/472x200?text=Full" />
  </div>
</div>
{% endhighlight %}

We're adding another row of images. In the first column of the second row we have 2 images both with the class of 'half'. All the rest of the images have a class of 'full'. Notice that the images in the second row first column or the 'half' images, are on the same line with no space instead of say on another line with the same indentation. This is because images are inline-block and if we added the space, that space would be added to the width of the elements in this column.  

Lets update our CSS now, after the all the 'grid' classes and before the 'omega' class add the 'full' & 'half' classes like below:  

{% highlight css %}
...

.full { max-width: 100%; }
.half { max-width: 50%; }
.omega { margin-right: 0; }
{% endhighlight %}

As you can see the images in the second row, first column are butt up against each other with no padding or space separating them visually. Lets add some right padding to these 'half' images.  

{% highlight css %}
.half { max-width: 50%; padding-right: 1%; }
{% endhighlight %}

What is happening now is our 'half' class is actually taking up 102 percent of the width of its parent. Obviously this is what is causing the second image to be pushed to a new line. If we adjust the 'half' class' max width to 49 percent, were back in business.  

{% highlight css %}
.half { max-width: 49%; padding-right: 1%; }
{% endhighlight %}

Well except for the fact that now we have right padding on on the second 'half' image. So lets remove the right padding from the 'omega' class, and bump up the max width on the 'half' class to 49.5 percent.  

{% highlight css %}
.half { max-width: 49.5%; padding-right: 1%; }
.omega { margin-right: 0; padding-right: 0; }
{% endhighlight %}

Ok, lets recap. We created a grid composed of fixed values to serve as our baseline. This made it easier to convert to a fluid grid using the target / context rule. We worked with some margin and padding. Margin is based on the size of the parent and padding is based on the size of the element itself. Finally we worked with the max width property, applying it to images to make them scalable. Now we are going to switch gears for a moment. I want to get into adaptive layouts.  

## Lets talk about adaptive layouts a bit.  

With our responsive layout taking shape we can begin building our pages. What we may notice, and hopefully sooner rather than later, is that some of our design, while it fits, it could look better. Look at the layout differences demo and set the layout to fluid. Resize the browser window slowly and notice how the features ('feature' class elements) are fluid. Meaning as the window becomes more narrow, the row of three features shrinks and stays inline. Now change the layout to 'adaptive' and do the same thing. You can see how as you narrow the window the features go from three in a row, to two in a row, and finally to one per row. Wouldn't it be great if we could have the best of both worlds? Well the good news is we can! Change the layout to 'responsive' and resize the window. This is what we want.  

How do we accomplish this? It's all about the breakpoints. Breakpoints are the point at which your design starts to break down visually. An approach you can take to this is start with your fixed grid and resize the browser. Once you reach a point that it does not look as good. Take note of this break point. It's at this breakpoint that we will introduce our first CSS3 media query. You rememeber what a media query looks like don't you? Well if not, it looks something like this:  

{% highlight css %}
@media screen and (max-width: 1024px) {
  ...
}
{% endhighlight %}

So what does this even mean anyway? Lets break it into parts and have a go at it:  

{% highlight css %}
@media - This is the actual query  
screen - This is a media type  
and - This ties one rule to another rule (in this case max-width: 1024px)  
(max-width: 1024px) - This says if the viewport width is a maximum 1024 pixels  
{ ... } - Apply these styles  
{% endhighlight %}

See the <a href="http://www.w3.org/TR/CSS2/media.html" target="_blank" title="W3 Media Query Spec">spec</a> for more detailed information on the different media types.  

The preceeding was a simple rule so lets take a look at the media queries used in the layout differences demo:  


{% highlight css %}
/* In the following rule were targeting the media type of 'screen'
   and a viewport where the width is between 1024 pixels and 641 pixels */
@media screen and (max-width: 1024px) and (min-width: 641px) {
  ...
}

/* In the following rule were targeting the media type of 'screen'
   and a viewport where the width is at most 768 pixels */
@media screen and (max-width: 768px) {
  ...
}

/* In the following rule were targeting the media type of 'screen'
   and a viewport where the width is between 640 pixels and 320 pixels */
@media screen and (max-width: 640px) and (min-width: 320px) {
  ...
}

/* In the following rule were targeting the media type of 'screen'
   and a viewport where the width is at most 320 pixels */
@media screen and (max-width: 320px) {
  ...
}
{% endhighlight %}

For a more detailed information and examples see the <a href="http://www.w3.org/TR/css3-mediaqueries/" target="_blank" title="W3 Media Query">spec</a>   

## The viewport

When we talk about the 'viewport' we are basically talking about a device's display. One of the first things you should know about is a pixel. We've talked a bit about pixels as far as units of measurement. A pixel is a tiny dot that is colored red, green or blue. Your display, whether its a computer monitor or mobile phone screen is made up of many pixels. The pixels that make up your display and the pixel units we have been using in our CSS are not quite the same size however. For most of our daily tasks we are not really concerned by this but you should know a little bit about it. A great article that goes into depth on this is "A tale of two viewports" and I highly recommend reading it. I had to read it multiple times in fact.
http://www.quirksmode.org/mobile/viewports.html

When it comes to responsive design we need to consider how an actual mobile browser will render the page. Most modern mobile browsers will fake the devices viewport size. They then display the page in a zoomed out view, trying to fit the page into the viewport. In the past, designers & developers really didn't put all that much into "what will my page look like on a mobile device". We, however, are and we don't want the browser to take this default approach. So we need to override this behavior. Enter the viewport meta tag.

The viewport meta tag allows us to tell the browser that your viewport width should use its actual device width instead of any browser defaults. We also want to set the initial scale to 100%. The tag will look like:  

{% highlight html %}
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
{% endhighlight %}

One thing to note is that Microsoft is taking a different approach. Read more about <a href="http://dev.w3.org/csswg/css-device-adapt/" target="_blank" title="CSS Device Adaptation">CSS Device Adaptation</a>. The gist of it is to use a viewport rule in your css instead of (or in combination with to be safe) the viewport meta tag. The rule and the microsoft prefix look like:  

    @viewport {
      width: device-width;
    }

    @-ms-viewport {
      width: device-width;
    }

## Re-building the layout differences page:

We are now going to rebuild the responsive part of the layout differences demo we saw earlier. Open codepen and add the following boilerplate to the html section:  

{% highlight html %}
<!doctype html>
<html>
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
</head>
<body>
</body>
</html>
{% endhighlight %}

As we learned earlier, our mobile device is faking the viewport size for sites that are not mobile friendly or responsive. So lets add the viewport meta tag before we go any further.  

{% highlight html %}
<meta content="initial-scale=1.0, maximum-scale=1.0, width=device-width" name="viewport" />
{% endhighlight %}

Now we can start marking up our page. Looking at the layout differences as if it were a static comp, lets get semantic. We have two sections, each taking up the width of the container. So what does that look like:  

{% highlight html %}
<div class="grid-container">
  <div class="grid-8 row">
  </div>

  <div class="grid-8 row">
  </div>
</div>
{% endhighlight %}

Each section has a headline:  

{% highlight html %}
<div class="grid-container">
  <div class="grid-8 row">
    <h1>Lorem Ipsum</h1>
  </div>

  <div class="grid-8 row">
    <h2>Maecenas Mollis</h2>
  </div>
</div>
{% endhighlight %}

Lets focus on the first section now. It has some images with headlines & descriptions under them. Lets name these modules 'figure-with-caption'.

{% highlight html %}
<div class="grid-container">
  <div class="grid-8 row">
    <h1>Lorem Ipsum</h1>
    <div class="figure-with-caption first">
      <img src="http://fpoimg.com/360x202?text=Lorem%20Ipsum" />
      <h3>Lorem Ipsum</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In risus est, rhoncus ac leo et.</p>
    </div>

    <div class="figure-with-caption">
      <img src="http://fpoimg.com/360x202?text=Nam%20Ornare" />
      <h3>Nam Ornare</h3>
      <p>Nam ornare aliquam quam. Nulla fringilla sed metus ac vestibulum. Blandit feugiat lacus a.</p>
    </div>

    <div class="figure-with-caption">
      <img src="http://fpoimg.com/360x202?text=Nullam%20Et%20Massa" />
      <h3>Nullam Et Massa</h3>
      <p>Nullam et massa convallis, condimentum ante a, auctor purus. Fringilla condimentum libero.</p>
    </div>

    <div class="figure-with-caption">
      <img src="http://fpoimg.com/360x202?text=Praesent%20Non" />
      <h3>Praesent Non</h3>
      <p>Praesent non congue justo. Aliquam vitae eros vitae lectus elementum tincidunt id non nisi.</p>
    </div>

    <div class="figure-with-caption">
      <img src="http://fpoimg.com/360x202?text=Donec%20Ullamcorper" />
      <h3>Donec Ullamcorper</h3>
      <p>Donec ullamcorper ultricies ultricies. Mauris id quam quis leo vehicula congue. Nam est urna.</p>
    </div>

    <div class="figure-with-caption last">
      <img src="http://fpoimg.com/360x202?text=Vivamus%20At%20Erat" />
      <h3>Vivamus At Erat</h3>
      <p>Vivamus at erat malesuada est tincidunt pharetra. Quisque non leo ipsum. In hac habitasse platea dictumst.</p>
    </div>
  </div>

  <div class="grid-8 row">
    <h2>Maecenas Mollis</h2>
  </div>
</div>
{% endhighlight %}

Your codepen should look similiar to the following:  
![Figure w/Caption Checkpoint](/img/for-posts/an-intro-to-responsive-web-development/figure-with-caption-checkpoint.png "Figure w/Caption Checkpoint")  
_(Figure w/Caption Checkpoint)_  

Now we can move on to the second section. It is basically just table data. Possibly related to our figures. Lets name these modules 'figures-and-specifics-table'.  

{% highlight html %}
<div class="grid-container">
  <div class="grid-8 row">
    <h1>Lorem Ipsum</h1>

    ...

  </div>

  <div class="grid-8 row">
    <h2>Maecenas Mollis</h2>

    <table class="figures-and-specifics-table">
      <tr>
        <td class="figure-data std">Pellentesque</td>
        <td class="specifics-data std">Pellentesque ut velit lectus</td>
      </tr>

      <tr>
        <td class="figure-data alt">Donec</td>
        <td class="specifics-data alt">Donec sollicitudin est dui</td>
      </tr>

      <tr>
        <td class="figure-data std">Donec ac risus</td>
        <td class="specifics-data std">
          Donec ac risus placerat<br />
          Commodo orci a, dictum tortor<br />
          Sed ut porta eros<br />
          Aenean sit amet quam est
        </td>
      </tr>

      <tr>
        <td class="figure-data alt">Pellentesque hendrerit</td>
        <td class="specifics-data alt">
          Pellentesque hendrerit convallis lacus<br />
          Nunc tristique facilisis sapien<br />
        </td>
      </tr>

      <tr>
        <td class="figure-data std">Sed quis luctus</td>
        <td class="specifics-data std">
          Sed quis luctus libero<br />
          Sed laoreet ligula non felis aliquet<br />
          In tristique tortor sollicitudin
      </tr>

      <tr>
        <td class="figure-data alt">Nunc commodo pretium</td>
        <td class="specifics-data alt">Nunc commodo pretium nisl</td>
      </tr>

    </table>
  </div>
</div>
{% endhighlight %}

Your codepen should now look similiar to the following:  
![Figures & Specifics Checkpoint](/img/for-posts/an-intro-to-responsive-web-development/figures-and-specifics-checkpoint.png "Figures & Specifics Checkpoint")  
_(Figures & Specifics Checkpoint)_  

Pretty basic and pretty semantic. Lets add some style to the page.  

{% highlight css %}
body {
  background-color: #262626;
  color: #9a9a9a;
  font-family: Arial, sans-serif;
  font-size: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

h1, h2, h3 {
  text-transform: uppercase;
}

h1, h2 {
  color: #76b900;
}

h3 {
  color: #fff;
}

table {
  border-spacing: 0;
  width: 100%;
}

.figure-data, .specifics-data {
  border: 1px solid #414141;
  padding: 5px;
  width: 50%;
}

.figure-data {
  color: #fff;
}

.std {
  background: #1e1e1e;
}

.grid-container {
  margin: 0 auto;
  max-width: 960px;
  width: 90%;
}

/* remaining grid classes */

.row { clear: both; }

...
{% endhighlight %}

Thats looking better already. Lets work on the 'figure-with-caption'. We need to float them left, center align the text, give them a margin of 1 percent and a width of 31.5 percent:  

{% highlight css %}
.figure-with-caption {
  float: left;
  margin: 1%;
  text-align: center;
  width: 31%;
}
{% endhighlight %}

Getting better, we just need to make the images take up 100 percent width:  

{% highlight css %}
.figure-with-caption img {
  width: 100%;
}
{% endhighlight %}

I am happy with the look of the page now. Its time to introduce our first breakpoint. I think a comfortable point is at 1024 pixels.

{% highlight css %}
@media screen and (max-width: 1024px) and (min-width: 641px) {
  .figure-with-caption {
    width: 46%;
  }
}
{% endhighlight %}

And our last breakpoint will be at 640 pixels  

    @media screen and (max-width: 640px) and (min-width: 320px) {
      .grid-1, .grid-2, .grid-3, .grid-4, .grid-5, .grid-6, .grid-7, .grid-8 {
        width: 100%;
      }

      .figure-with-caption {
        float: none;
        margin: 0;
        width: 100%;
      }

      .figure-data, .specifics-data {
        float: left;
        width: 100%;
      }

      .figure-data {
        background: #1e1e1e;
      }

      .specifics-data {
        background: #262626;
      }
    }

Looks good. Now at this point we have some minor touching up to do. For the most part the page will look great on any modern phones, tablets, desktops etc...  

I hope you've found this useful and if you build anything cool using these techniques I'd love to see it. So shoot me an email. Thanks!
