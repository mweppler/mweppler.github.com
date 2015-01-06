---
layout: post
meta-description: The Box Model - An introduction to CSS
meta-keywords: html, css, the box model
preview: |
  When the browser renders a page, it creates a rectangular box for each DOM element. This box is made up of the content (image, text, video, etc...)
syntax-highlighting: true
tags: [html, css, the box model]
title: The Box Model
---

# The Box Model

__Before we begin, please open a browser window and navigate to the [Code Pen Site](http://codepen.io/pen/ "Code Pen Site").__  

<!--
  What is a browser?
  What does render mean?
  What is the DOM?
-->

When the browser renders a page, it creates a rectangular box for each DOM element. This box is made up of the content (image, text, video, etc...), and optional padding, borders & margin. These boxes are than laidout on the page according to the styling rules that govern the DOM element. DOM elements are displayed as either block or inline.  

![Box Model as seen in chrome devtools](/img/for-posts/the-box-model/chrome-box.png "Box Model (Box Model as seen in chrome devtools)")  
_(Box Model as seen in chrome devtools)_  

{% highlight css %}
element.style {
  border: 5px solid;
  height: 300px;
  margin: 5px;
  padding: 5px;
  width: 300px;
}
{% endhighlight %}

---

## DOM Elements

Lets talk about the types of DOM elements, and how they relate to the Box model.  

### Block Elements

A block element will take up the full width available for the line its on based on the width of its parent element. DOM elements before and after it are pushed to separate lines. Take a look at this codepen for some examples of blocks: [http://codepen.io/mweppler/pen/psqhF](http://codepen.io/mweppler/pen/psqhF)  

{% highlight html %}
divs:
  <div>Division</div>

headings:
  <h1>Header 1</h1>
  <h2>Header 2</h2>
  <h3>Header 3</h3>
  <h4>Header 4</h4>
  <h5>Header 5</h5>
  <h6>Header 6</h6>

lists:
  <ol>
    <li>List Item 1</li>
    <li>List Item 2</li>
    <li>List Item 3</li>
  </ol>

  <ul>
    <li>List Item</li>
    <li>List Item</li>
    <li>List Item</li>
  </ul>

paragraphs:
  <p>Bacon ipsum dolor sit amet ham chuck bresaola...</p>
{% endhighlight %}

![Block Elements](/img/for-posts/the-box-model/block-elements.png "Block Elements")  
_(Block Elements)_  

### Inline Elements

Inline elements take up as much width as they need and nothing more. They do not create any newlines and they stay in line with the rest of the DOM elements on that line. Take a look at this codepen for some examples of inline elements: [http://codepen.io/mweppler/pen/Gqtky](http://codepen.io/mweppler/pen/Gqtky)  

{% highlight html %}
anchors:
  <a href="#">Anchor</a>

images:
  <img src="#" />

spans:
  <span>Span</span>
{% endhighlight %}

![Inline Elements](/img/for-posts/the-box-model/inline-elements.png "Inline Elements")  
_(Inline Elements)_  

---

## Padding, Borders & Margin

Padding, borders & margin are added around the DOM elements content. The padding property creates space on the inside of the box, around the content. The border property creates a border around the box. The margin property creates space on the outside of the box. Something to note is that you can apply a pixel or percentage value but it cannot be a negative value (except with margin).

### Padding

{% highlight css %}
element.style {
  padding: 5px; /* shorthand for: */

  padding-top: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
  padding-left: 5px

  /* you can add more than one value to the padding property, they are applied in the order above: */
  padding: 5px; /* applies to top, right, bottom, left */
  padding: 5px 5px; /* applies to top & bottom, right & left */
  padding: 5px 5px 5px; /* applies to top, right, bottom */
  padding: 5px 5px 5px 5px; /* applies to top, right, bottom, left */
}
{% endhighlight %}

### Border

{% highlight css %}
element.style {
  border: 5px solid #000; /* shorthand */

  border-width: 5px;
  border-width: 5px 5px 5px 5px;
  border-style: dashed; /* styles include: dashed, dotted, none & solid */
  border-color: #000;

  border-width: 5px 10px 15px 20px;
  border-top-color: green;
  border-right-color: yellow;
  border-bottom-color: blue;
  border-left-color: red;
  border-top-style: dashed;
  border-right-style: dotted;
  border-bottom-style: solid;
  border-left-style: none;
}
{% endhighlight %}

### Margin

{% highlight css %}
element.style {
  margin: 5px; /* shorthand for: */

  margin-top: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  margin-left: 5px

  /* you can add more than one value to the margin property, they are applied in the order above: */
  margin: 5px; /* applies to top, right, bottom, left */
  margin: 5px 5px; /* applies to top & bottom, right & left */
  margin: 5px 5px 5px; /* applies to top, right, bottom */
  margin: 5px 5px 5px 5px; /* applies to top, right, bottom, left */
  margin: auto; /* allows the browser to calculate the margins */
}
{% endhighlight %}

#### Figures

Lets take a look at some examples, open a new code pen and add the following:

##### HTML
{% highlight html %}
<span class="box">1</span>
<span class="box">2</span>
<span class="box">3</span>
<br />
<span class="box">4</span>
<span class="box">5</span>
<span class="box">6</span>
<br />
<span class="box">7</span>
<span class="box">8</span>
<span class="box">9</span>
{% endhighlight %}

##### CSS
{% highlight css %}
body { margin: 0; margin: 5px; padding: 0; }
.box {
  background: #76b900;
  border: 1px solid black;
  display: inline-block;
  font-family: monospace, sans-serif;
  font-size: 5em;
  margin: -2px;
  padding: 0;
  text-align: center;
  width: 92px;
}
.border-10 { border: 10px solid black; margin-top: 1px; }
.padding-10 { margin-top: 1px; padding: 10px; }
.margin-10 { margin: 10px; }
{% endhighlight %}

You should see something that looks similar to the follow:  

![No margin, padding, borders](/img/for-posts/the-box-model/no-margin-padding-border.png "No margin, padding, borders")  
_(No margin, padding, borders)_  

Now lets add the class 'margin-10' to the 5th span element:

![10 Pixels of Margin](/img/for-posts/the-box-model/margin-10.png "10 Pixels of Margin")  
_(10 Pixels of Margin)_  

Remove the 'margin-10' class and add the class 'padding-10':

![10 Pixels of Padding](/img/for-posts/the-box-model/padding-10.png "10 Pixels of Padding")  
_(10 Pixels of Padding)_  

Remove the 'padding-10' class and add the class 'border-10':

![10 Pixel Border](/img/for-posts/the-box-model/border-10.png "10 Pixel Border")  
_(10 Pixel Border)_  

Lets see how margin and padding work with each other, remove the 'border-10' class and add 'margin-10 padding-10':

![10 Pixels of Margin & 10 Pixels of Padding](/img/for-posts/the-box-model/margin-10-padding-10.png "10 Pixels of Margin & 10 Pixels of Padding")  
_(10 Pixels of Margin & 10 Pixels of Padding)_  

Remove the 'padding-10' class and add 'border-10':

![10 Pixels of Margin & a 10 Pixel Border](/img/for-posts/the-box-model/margin-10-border-10.png "10 Pixels of Margin & a 10 Pixel Border")  
_(10 Pixels of Margin & a 10 Pixel Border)_  

Remove the 'margin-10' class and add 'padding-10':

![10 Pixels of Padding & a 10 Pixel Border](/img/for-posts/the-box-model/padding-10-border-10.png "10 Pixels of Padding & a 10 Pixel Border")  
_(10 Pixels of Padding & a 10 Pixel Border)_  

Lastly, lets add all three classes 'margin-10 padding-10 border-10':

![10 Pixels of Padding & a 10 Pixel Border](/img/for-posts/the-box-model/margin-10-padding-10-border-10.png "10 Pixels of Padding & a 10 Pixel Border")  
_(10 Pixels of Margin, 10 Pixels of Padding & a 10 Pixel Border)_  

---

## Display, Visibility, Height & Width

### Display Property:

The display property allows you to override the default display settings of an element. 

{% highlight css %}
element.style {
  display: none;
}
{% endhighlight %}

Display property values include:

* block: if the default for block elements and creates a block around the element adding a newline before and after it
* inline: if the default for inline elements and places the element in the flow of the line
* inline-block: generates a box that is a block element flowed with surrounding content as if it were an inline element
* none: removes the element from the page layout (not the DOM)

Update the code pen and add the following css:

{% highlight css %}
.display-none { display: none; }
{% endhighlight %}

Now remove the 'margin-10 padding-10 border-10' classes from the 5th span element and add the 'display-none' class. You should see something similiar:  

![Display None](/img/for-posts/the-box-model/display-none.png "Display None")  
_(Display None)_  

In order for width and margin properties to have an effect we need to add a display of inline-block to the element (note that negative values cannot be applied).

{% highlight css %}
element.style {
  display: inline-block;
  margin: 5px;
  width: 300px;
}
{% endhighlight %}

### Visibility Property:

The visibility property allows you to hide the elements content, but does not remove the box from the layout/flow.

{% highlight css %}
element.style {
  visibility: hidden; /* the default value is visible */
}
{% endhighlight %}

Update the code pen and add the following css:

{% highlight css %}
.visible-hidden { visibility: hidden; }
{% endhighlight %}

Now remove the display-none' class from the 5th span and add 'visible-hidden'. You should see something similiar to the following:  

![Visible Hidden](/img/for-posts/the-box-model/visible-hidden.png "Visible Hidden")  
_(Visible Hidden)_  

### Height & Width Properties:

The height and width properties allow us to set the dimensions of the content area. You can set height & width using ems, percentages or pixels to name a few. Em values make the size the box relative to the current font size. Percentages make the size relative to its containing box. Pixels allow precise control over the box.

Lets wrap our spans in a div with a class of 'container':

{% highlight html %}
<div class="container">
  <span class="box">1</span>
  ...
</div>
{% endhighlight %}

Next add the following css:

{% highlight css %}
.container { background-color: yellow; padding: 25px; }
{% endhighlight %}

You should see something similiar to the following:  

![Span Container](/img/for-posts/the-box-model/span-container.png "Span Container")  
_(Span Container)_  

Notice how the yellow background takes up the entire width since a div is a block element. Lets give it a width of: 280px and a height of 100%

{% highlight css %}
.container { background-color: yellow; height: 100%; padding: 25px; width: 280px; }
{% endhighlight %}

The div is not taking up 100 percent is it. In regards to the height property you cannot give an element a height that fills the parent element unless the parent element is given an explicit height itself. So we cannot, for example give a div a height of 100%, I mean we can but it will not have the effect you hope it will. What you need to do is give the containing element a height, in this case the body tag. So we add:

{% highlight css %}
body { height: 100%; }
{% endhighlight %}

If we refresh the page we still don't see the result we were hoping to see. That is because we also need to give the element that contains the body element a height as well. The html element, so we add:

{% highlight css %}
html { height: 100%; }
{% endhighlight %}

Finally we see what we had hoped we'd see along.

As stated earlier, padding, borders & margin are applied on top of the content. This means if you want to get the elements actual width and/or height we need to add the content width and any padding, borders & margins. Or we can use a new CSS3 property box-sizing. 

---

## Overflow:

If a containing element has a smaller width or height than the contained elements width or height, the content of the containing element will overflow. The overflow property gives us the ability to control the presentation of the overflowing content.

{% highlight css %}
element.style {
  overflow: visible; /* this is the default, other values include: auto, hidden & scroll */
  overflow-x: hidden;
  overflow-y: hidden;
}
{% endhighlight %}

Update the code pen and add the following css:

{% highlight css %}
.container { background-color: yellow; height: 280px; padding: 25px; width: 185px; }
{% endhighlight %}

![Overflow](/img/for-posts/the-box-model/overflow.png "Overflow")  
_(Overflow)_  

Notice how the boxes are now overflowing. Add an 'overflow' property with a value of 'hidden' to the 'container' class.

{% highlight css %}
.container { background-color: yellow; height: 280px; overflow: hidden; padding: 25px; width: 185px; }
{% endhighlight %}

![Overflow Hidden](/img/for-posts/the-box-model/overflow-hidden.png "Overflow Hidden")  
_(Overflow Hidden)_  

---

## Floats:

W3 states: A float is a box that is shifted to the left or right on the current line. The most interesting characteristic of a float (or a "floated" or "floating" box) is that content may flow along its side (or be prohibited from doing so by the 'clear' property). Content flows down the right side of a left-floated box and down the left side of a right-floated box.

{% highlight css %}
element.style {
  float: none; /* values include left, none & right with none being the default. */
}
{% endhighlight %}

Lets change our boxes implementation up a bit. Replace the html & css from the code pen with the following:

### HTML
{% highlight html %}
<div class="container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
  <div class="box">4</div>
  <div class="box">5</div>
  <div class="box">6</div>
  <div class="box">7</div>
  <div class="box">8</div>
  <div class="box">9</div>
</div>
{% endhighlight %}

### CSS
{% highlight css %}
body { margin: 0; margin: 5px; padding: 0; }
.box {
  background: #76b900;
  border: 1px solid black;
  font-family: monospace, sans-serif;
  font-size: 5em;
  margin: 0 -2px;
  padding: 0;
  text-align: center;
  width: 92px;
}
.container { background-color: yellow; padding: 25px; width: 280px; }
{% endhighlight %}

At first what you'll see is something similar to the follow:

![Div Boxes](/img/for-posts/the-box-model/div-boxes.png "Div Boxes")  
_(Div Boxes)_  

Since a div is a block element, each individual box is on its own line. Next, add the 'float' property with a value of 'left' to the 'box' class. You should see something similar to the following:

![Float Left](/img/for-posts/the-box-model/float-left.png "Float Left")  
_(Float Left)_  

So what is happening here? Since a float is not in the flow of the document, and the container div does not have a specific height, the container is acting as if it does not have any children. What we need to do here is 'clear the floats'.

### Clearing Floats:

Its common to have to clear floats. This is accomplished by using the clear property. You can use left, none or right. Left doesn't allow floats on the left side of the clear element, right doens't allow floats on the right side of the clear element.

{% highlight css %}
element.style {
  clear: none; /* values include: both, left, none & right with none being the default. */
}
{% endhighlight %}

#### ClearFix Hack
{% highlight css %}
.contain-floats:before,
.contain-floats:after {
  content: "";
  display: table;
}

.contain-floats:after {
  clear: both;
}

/* ie6&7 */
.contain-floats {
  *zoom: 1;
}
{% endhighlight %}

Lets break the clearfix hack down. Add the following css to the codepen:

{% highlight css %}
.container:before,
.container:after {
  content: "";
  display: table;
}

.container:after {
  clear: left;
}
{% endhighlight %}

This is inserting empty text before and after the content inside the 'container' div. Setting its 'display' property to 'table', causing it to act as a table element. Because were using this with the ':before' pseudo element we use 'table' instead of 'block' to contain the top-margins of child elements. Since we are floating the boxes left I am adding a 'clear: left;' to the containers ':after' content. This doesn't allow floats on the left of it.

![Float Left/Clear Fix](/img/for-posts/the-box-model/float-left-clear-fix.png "Float Left/Clear Fix")  
_(Float Left/Clear Fix)_  

---

## Positions Properties:

The position property positions an element in the layout based on an offset value.

{% highlight css %}
element.style {
  bottom: 0;
  left: 0;
  position: static;
  right: 0;
  top: 0;
}
{% endhighlight %}

Position property values include:  
_* absolute: takes the element out of the page flow. Positions it based on the specified offset values_  
_* fixed: like absolute, it is taken out of the page flow. It is positioned based on the offset values relative to the viewport. The element doesn't move when the page is scrolled_  
_* relative: does not take the element out of the page flow just the visual layer. It lays out the element relative to where it would normally be laid out_  
_* static: default value, element has normal behavior and offsets have no effect._  

The offset properties include:  
_* top: from the top, accepts: em, px, %_  
_* right: from the right, accepts: em, px, %_  
_* bottom: from the bottom, accepts: em, px, %_  
_* left: from the left, accepts: em, px, %_  
_* If offset value is a percentage, its based on its parent container._  

Lets see them in action. Add the following to a code pen:

### HTML
{% highlight html %}
<div class="container">
  <div class="box box-1">1</div>
  <div class="box box-2">2</div>
  <div class="box box-3">3</div>
  <div class="box box-4">4</div>
  <div class="box box-5">5</div>
  <div class="box box-6">6</div>
  <div class="box box-7">7</div>
  <div class="box box-8">8</div>
  <div class="box box-9">9</div>
</div>
{% endhighlight %}

### CSS
{% highlight css %}
body { margin: 0; margin: 5px; padding: 0; }
.box {
  background: #76b900;
  border: 1px solid black;
  font-family: monospace, sans-serif;
  font-size: 5em;
  margin: 0 -2px;
  padding: 0;
  text-align: center;
  width: 92px;
}
.container { background-color: yellow; padding: 25px; width: 280px; height: 285px; }
{% endhighlight %}

![Position Static](/img/for-posts/the-box-model/position-static.png "Position Static")  
_(Position Static)_  

If we add a position of 'static' to the 'box' class we can see that nothing actually changes. This is because static is the default. Lets change that now from 'static' to 'absolute'. They are not stacked one on top of the other. We can add a z-index to the 'box-1' class and will see that 'box-1' is now on the top of the stack.

![Position Absolute](/img/for-posts/the-box-model/position-absolute.png "Position Absolute")  
_(Position Absolute)_  

![Position Absolute Z-Index](/img/for-posts/the-box-model/position-absolute-z-index.png "Position Absolute Z-Index")  
_(Position Absolute Z-Index)_  

{% highlight css %}
.box-1 { z-index: 1; }
{% endhighlight %}

![Position Relative](/img/for-posts/the-box-model/position-relative.png "Position Relative")  
_(Position Relative)_  

![Position Fixed](/img/for-posts/the-box-model/position-fixed.png "Position Fixed")  
_(Position Fixed)_  

![Position Fixed Scrolled](/img/for-posts/the-box-model/position-fixed-scrolled.png "Position Fixed Scrolled")  
_(Position Fixed Scrolled)_  

Lets position the boxes manually:

{% highlight css %}
.container { position: relative; }
.box-1 { position: static; }
.box-2 { left: 119px; position: absolute; top: 25px; }
.box-3 { left: 213px; position: absolute; top: 25px; }
.box-4 { position: absolute; top: 119px; }
.box-5 { left: 119px; position: absolute; top: 119px; }
.box-6 { left: 213px; position: absolute; top: 119px; }
.box-7 { position: absolute; top: 213px; }
.box-8 { left: 119px; position: absolute; top: 213px; }
.box-9 { left: 213px; position: absolute; top: 213px; }
{% endhighlight %}

![Position Absolute Manually Stacked](/img/for-posts/the-box-model/position-absolute-manually-stacked.png "Position Absolute Manually Stacked")  
_(Position Absolute Manually Stacked)_  

---

## The Pork Store

![Bacon Element](/img/for-posts/the-box-model/bacon-element.png "Bacon Element")  
_(Bacon Element)_  

### HTML
{% highlight html %}
<div>
  <img src="http://baconmockup.com/100/100" />
  <h1>Bacon Ipsum</h1>
  <p>Bacon ipsum dolor sit amet shankle drumstick pork short ribs, tongue biltong tail sirloin jerky tenderloin pork chop turducken. Fatback strip steak short ribs, ground round leberkas shankle rump ball tip frankfurter chuck pork beef meatball filet mignon.</p>
</div>
{% endhighlight %}

![Bacon Element Styled](/img/for-posts/the-box-model/bacon-element-styled.png "Bacon Element Styled")  
_(Bacon Element Styled)_  

### CSS
{% highlight css %}
div { background-color: pink; padding: 5px; }
div:before, div:after { content: ""; display: table; }
div:after { clear: both; }
img { float: left; margin-right: 10px; }
h1 { float: left; margin: 0; }
p { float: left; margin-top: 0; width: 350px; }
{% endhighlight %}

---

## Footnotes:

_* For a complete description of the Box model, please see the W3C CSS2 Spec [http://www.w3.org/TR/CSS2/box.html](http://www.w3.org/TR/CSS2/box.html "W3C CSS2 Spec")._  
_* Code Pen Site [http://codepen.io/pen/](http://codepen.io/pen/ "Code Pen Site")._  
_* ClearFix Hack [http://nicolasgallagher.com/micro-clearfix-hack/](http://nicolasgallagher.com/micro-clearfix-hack/)_  
