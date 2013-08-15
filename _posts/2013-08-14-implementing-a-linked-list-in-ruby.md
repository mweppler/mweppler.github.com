---
layout: post
meta-description: Implementing a Linked List in Ruby
meta-keywords: algorithms, linked list, objects, recursion, ruby
preview: |
  I am learning… actually relearning since I used these things in another life. So let me take a shot at a brief explanition. You should definitly take a look at the Wikipedia - Linked List article, though as they do a much better job of describing it than I do.
syntax-highlighting: true
title: Implementing a Linked List in Ruby
---

# Implementing a Linked List in Ruby

I am learning... actually relearning since I used these things in another life. So let me take a shot at a brief explanition. You should definitly take a look at the <a href="http://en.wikipedia.org/wiki/Linked_list" target="_blank" title="Wikipedia - Linked List">Wikipedia - Linked List</a> article, though as they do a much better job of describing it than I do.

For one, a linked list is one of many ways of storing and organizing data. If you have been writing code for anything longer than a few months you probably already know a couple of data structures: Array, Dictionary & Hash to name a few. A linked list (at least a basic instance, and the instance I will demonstrate) is a class with two attributes: node and next. Node is just a generic type and can actually be a Ruby class like: String or Integer. Next is really a link to the next node.


{% highlight ruby %}
class Node
  attr_accessor :node, :next

  def initialize(node)
    @node = node
  end
end
{% endhighlight %}

Simple enough huh? Lets instantiate a few. I am going to use `irb` here so if you want to follow along now is the time to open your terminal and launch `irb` from the command prompt.

{% highlight ruby %}
irb(main):001:0> require './linked-list.rb'

irb(main):002:0> node = Node.new("Oh Hai")
=> #<Node:0x007fcfd1314360 @node="Oh Hai">

irb(main):003:0> node.node
=> "Oh Hai"
irb(main):004:0> node.node.class
=> String

irb(main):005:0> node_2 = Node.new("How are you?")
=> #<Node:0x007fcfd13160c0 @node="How are you?">

irb(main):006:0> node.next = node_2
=> #<Node:0x007fcfd13160c0 @node="How are you?">

irb(main):007:0> node.next
=> #<Node:0x007fcfd13160c0 @node="How are you?">

irb(main):008:0> node.next.node
=> "How are you?"
irb(main):009:0> node.next.node.class
=> String

irb(main):010:0> node.next.next
=> nil
{% endhighlight %}

So what happened there? First I required the ruby file that contained the node class. Next I instantiated a node object called node with the node property "Oh Hai" (a String). I created a second node called node_2 with a node property of "How are you?". Here is where the actual linking takes place. I set node's next property to node_2. Then I just check the node's and their links as well as the type of class that the node property is an instance of.

This is all well and fine, but it would be nice if we could see some type of visual representation of the structure. So lets implement a node_list method that will accept a starting node and return a string that should help make sense of this a bit more.

{% highlight ruby %}
class Node
  ...

  def self.node_list(node, msg = nil)
    msg ||= ""
    return msg[0..-4] if node.nil?
    node_list(node.next, msg << "#{node.node} -> ")
  end

  ...
end
{% endhighlight %}

I forgot to mention that it will be a recursive method (see my article on the topic of <a href="http://matt.weppler.me/2011/01/30/recursion.html" target="_blank" title="Previous post on Recursion">Recursion</a>). You'll need to quit `irb` and require the ruby script again. Then create a few node instances and link them together via the nodes next property. Once you've completed that go ahead and call the Node class method node_list.

{% highlight ruby %}
irb(main):009:0> puts Node.node_list node
Oh Hai -> How are you? -> ...good, glad to hear it!
=> nil
{% endhighlight %}

You should see _node_ followed `->` followed by another _node_. Great so we have a linked list in Ruby. Now what? Well I actually was working on a code challenge where I had to reverse a linked list in Ruby. Honestly, I had a hard time with this. So much so that I started tearing tiny pieces of paper, labeling them and organizing them to figure out an algorithm.

![Paper Data Structures](/img/for-posts/implementing-a-linked-list-in-ruby/paper-data-structures.jpg "Paper Data Structures")

Finally I figured one out, and while there is definitely a better solution I am burnt out and giving it a rest. That said I do want to walk through it with you. So here is the code:

{% highlight ruby %}
class Node
  ...

  def self.reverse(node)
    return node if node.next.nil?

    head, swap, node.next = node.next, node, nil
    link = head.next

    while link != nil
      head.next = swap
      swap = head
      head = link
      link = link.next
    end

    head.next = swap
    head
  end

  ...
end
{% endhighlight %}

How bout that... Now for the breakdown: well if we only have one node simply return it and were finished! Yay! That was the easy part. For the actual meat of this thing lets get a bit more visual. To set the stage I am going to create 4 nodes (numbers: 1, 2, 3 & 4) and link them together.

{% highlight ruby %}
node_1 = Node.new(1)
node_2 = Node.new(2)
node_3 = Node.new(3)
node_4 = Node.new(4)

node_1.next = node_2
node_2.next = node_3
node_3.next = node_4
{% endhighlight %}

![Simple Linked List](/img/for-posts/implementing-a-linked-list-in-ruby/simple-linked-list.png "Simple Linked List")

This is a kinda/sorta snapshot of what the memory might look like. Now we call the reverse method. Passing it node_1.

{% highlight ruby %}
puts Node.node_list Node.reverse(node_1)
{% endhighlight %}

![Call the reverse method](/img/for-posts/implementing-a-linked-list-in-ruby/call-the-reverse-method.png "Call the reverse method")

So inside the reverse method again we check to see if node.next is nil. Next we create three local variables swap, head & link. We set swap to node which is currently pointed at node_1, head to node.next which is currently pointing at node_2, node.next to nil this breaks the node_1 has to node_2 and points it at nil & link to head.next which is pointing at node_3.

{% highlight ruby %}
return node if node.next.nil?

head, swap, node.next = node.next, node, nil
link = head.next
{% endhighlight %}

![Reverse method setup](/img/for-posts/implementing-a-linked-list-in-ruby/reverse-method-setup.png "Reverse method setup")

...now in the while loop we begin actually reversing the linked list. We set head.next to swap which is pointing at node_1, swap to head which is pointing at node_2, head to link which is pointing at node_3 & link to link.next which is pointing at node_4.

{% highlight ruby %}
while link != nil
  head.next = swap
  swap = head
  head = link
  link = link.next
end
{% endhighlight %}

![First time through the loop](/img/for-posts/implementing-a-linked-list-in-ruby/first-time-through-the-loop.png "First time through the loop")

So if you printed the node listing it would look something like:

{% highlight ruby %}
irb(main):017:0> puts Node.node_list node_1
=> 1

irb(main):018:0> puts Node.node_list node_2
=> 2 -> 1

irb(main):018:0> puts Node.node_list node_3
=> 3 -> 4

irb(main):018:0> puts Node.node_list node_4
=> 4
{% endhighlight %}

In human words, node_1's link is broken/nil, node_2 links to node_1, node_3 links to node_4 & node_4's link is broken/nil. Lets loop again since link is not nil (its pointing to node_4). We set head.next to swap which is pointing at node_2, swap to head which is pointing at node_3, head to link which is pointing at node_4 & link to link.next which is pointing at nil.

{% highlight ruby %}
irb(main):017:0> puts Node.node_list node_1
=> 1

irb(main):018:0> puts Node.node_list node_2
=> 2 -> 1

irb(main):018:0> puts Node.node_list node_3
=> 3 -> 2 -> 1

irb(main):018:0> puts Node.node_list node_4
=> 4
{% endhighlight %}

![Second time through the loop](/img/for-posts/implementing-a-linked-list-in-ruby/second-time-through-the-loop.png "Second time through the loop")

Lets loop again? No, link is nil so instead we do our final swap and return head.

{% highlight ruby %}
head.next = swap
head
{% endhighlight %}

{% highlight ruby %}
irb(main):017:0> puts Node.node_list node_1
=> 1

irb(main):018:0> puts Node.node_list node_2
=> 2 -> 1

irb(main):018:0> puts Node.node_list node_3
=> 3 -> 2 -> 1

irb(main):018:0> puts Node.node_list node_4
=> 4 -> 3 -> 2 -> 1
{% endhighlight %}

![Final swap and return](/img/for-posts/implementing-a-linked-list-in-ruby/final-swap-and-return.png "Final swap and return")

Here is the complete code for my linked list implementation. If you have any improvments let me know.

{% highlight ruby %}
class Node
  attr_accessor :node, :next

  def self.last(node)
    return node if node.next.nil?
    node = last node.next
  end

  def self.reverse(node)
    return node if node.next.nil?

    head, swap, node.next = node.next, node, nil
    link = head.next

    while link != nil
      head.next = swap
      swap = head
      head = link
      link = link.next
    end

    head.next = swap
    head
  end

  def self.node_list(node, msg = nil)
    msg ||= ""
    return msg[0..-4] if node.nil?
    node_list(node.next, msg << "#{node.node} -> ")
  end

  def initialize(node)
    @node = node
  end
end

node = Node.new(1)
1.upto(99) do |i|
  eval("Node.last(node).next = Node.new(i + 1)")
end

puts Node.node_list node
puts Node.node_list Node.reverse(node)
{% endhighlight %}
