---
layout: post
meta-description: A simple xor in ruby using a test driven approach
meta-keywords: crypto, cryptography, rspec, ruby, ruby command line application, tdd, test driven development, xor
preview: |
  XOR works on bits. So what is a bit? Put simply, it is a 0 or a 1. The XOR operation compares 2 bits and if they are the same it returns a 0. If they are different it returns a 1.
syntax-highlighting: true
tags: [crypto, ruby, tdd, xor]
title: "Simple XOR: In ruby using a test driven approach"
---

# Simple XOR: In ruby using a test driven approach  

<a href="http://en.wikipedia.org/wiki/Exclusive_or" target="_blank">XOR</a> works on bits. So what is a bit? Put simply, it is a `0` or a `1`. The `XOR` operation compares 2 bits and if they are the same it returns a `0`. If they are different it returns a `1`. Take a look at this this figure below to get a better idea:

{% highlight bash %}
0 ^ 0 = 0
0 ^ 1 = 1
1 ^ 0 = 1
1 ^ 1 = 0
{% endhighlight %}

I decided to arm my brain with some cryptography knowledge, and `XOR` is one of the first methods I am learning about. I should mention that it is noted XOR is not the best way to encipher your data. Not even close actually. So please don't use anything you read here for anything more than an experiment.

With that disclaimer out of the way I am comfortable focusing on using a test driven approach to learn.


At any point if you are stuck are not able to follow along, take a look at the <a href="https://github.com/mweppler/simple-xorer" target="_blank">source code</a> hosted on github. I will be implementing the methods in `ruby`, and testing with `rspec`.  We start by creating a file `xorer.rb` and adding a <a href="https://www.relishapp.com/rspec/rspec-core/docs/example-groups/basic-structure-describe-it" target="_blank">`describe` block</a>:

{% highlight ruby %}
describe Xorer do
end
{% endhighlight %}

When we run rspec we see the following error:

{% highlight bash %}
$ rspec xorer.rb
/Users/mattweppler/developer/projects/xorer/xorer.rb:1:in `<top (required)>': uninitialized constant Xorer (NameError)
...
{% endhighlight %}

This is because we have not yet defined an `Xorer` module. So above the `describe` block let's define it:

{% highlight ruby %}
module Xorer
end
{% endhighlight %}

When we run rspec this time, we see the following:

{% highlight bash %}
$ rspec xorer.rb
No examples found.

Finished in 0.00003 seconds
0 examples, 0 failures
{% endhighlight %}

It is time to add our next test, but what should it be? Basically, I want to take a key and XOR against some plain text. So given these two strings I need to start by converting them into there binary representation. We will need to take it character by character, first turning the character into a byte or character code.

So given the character `a`, the byte should be `97`. That will be our first test.

{% highlight ruby %}
describe Xorer do
  it 'converts a character to a byte' do
    expect(Xorer.char_to_byte('a')).to be(97)
  end
end
{% endhighlight %}

Running rspec now we should see the following:

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte (FAILED - 1)

Failures:

  1) Xorer converts a character to a byte
     Failure/Error: expect(Xorer.char_to_byte('a')).to be(97)
     NoMethodError:
       undefined method `char_to_byte' for Xorer:Module
     # ./xorer.rb:6:in `block (2 levels) in <top (required)>'

Finished in 0.00036 seconds
1 example, 1 failure

Failed examples:

rspec ./xorer.rb:5 # Xorer converts a character to a byte
{% endhighlight %}

The key to this error is the `undefined method 'char_to_byte' for Xorer:Module`. Which points out the obvious, we are missing a method named `char_to_byte` in our `Xorer` module. So let's add this:

{% highlight ruby %}
module Xorer
  def self.char_to_byte(char)
  end
end
{% endhighlight %}

When we run rspec this time, it fails with:

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte (FAILED - 1)

Failures:

  1) Xorer converts a character to a byte
     Failure/Error: expect(Xorer.char_to_byte('a')).to be(97)

       expected #<Fixnum:195> => 97
            got #<NilClass:8> => nil

       Compared using equal?, which compares object identity,
       but expected and actual are not the same object. Use
       `expect(actual).to eq(expected)` if you don't care about
       object identity in this example.
     # ./xorer.rb:8:in `block (2 levels) in <top (required)>'

Finished in 0.00125 seconds
1 example, 1 failure

Failed examples:

rspec ./xorer.rb:7 # Xorer converts a character to a byte
{% endhighlight %}

Basically, that it was expecting the `char_to_byte` method to return `97` but instead nothing or `nil` was returned. So let's fulfill our expectation and return `97`.

{% highlight ruby %}
module Xorer
  ...
  def self.char_to_byte(char)
    97
  end
  ...
end
{% endhighlight %}

...and when we run our test, it passes!

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte

Finished in 0.00071 seconds
1 example, 0 failures
{% endhighlight %}

The problem is that while it passes this test, what if we passed the character `b` to the `char_to_byte` method? Let's change our test to the following:

{% highlight ruby %}
describe Xorer do
  ...
  it 'converts a character to a byte' do
    expect(Xorer.char_to_byte('b')).to be(98)
  end
  ...
end
{% endhighlight %}

...and when we run our test, it passes! Oops... no, actually it doesn't. It fails with:

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte (FAILED - 1)

Failures:

  1) Xorer converts a character to a byte
     Failure/Error: expect(Xorer.char_to_byte('b')).to be(98)

       expected #<Fixnum:197> => 98
            got #<Fixnum:195> => 97

       Compared using equal?, which compares object identity,
       but expected and actual are not the same object. Use
       `expect(actual).to eq(expected)` if you don't care about
       object identity in this example.
     # ./xorer.rb:9:in `block (2 levels) in <top (required)>'

Finished in 0.00079 seconds
1 example, 1 failure

Failed examples:

rspec ./xorer.rb:8 # Xorer converts a character to a byte
{% endhighlight %}

So why did I waste your time? Well, I didn't really waste your time. This process of TDD begins with taking a small idea and asking yourself: _Do I have a test for that_? If the answer is _No_, well the next step is to _Write a test_. Once you have your test, the next question you ask is: _Does the test pass_? If the answer is _No_, well the next step is to _Write just enough code for the test to pass_.

Then you ask again: _Does the test pass_? At the time when our `code_to_byte` method was returning `97` and our test was expecting a `97`, we could answer yes to that question. We had written just enough code for the test to pass. So the next question would be: _Do you need to refactor_? Well since we know that hard coding `97` as a return value is not really changing the character to a byte, our answer is _Yes_.

So our next step is to _Refactor the code_. Let's change our test back to pass `a`, and expect the result to be `97`. Then we change the `char_to_byte` method to the following:

{% highlight ruby %}
module Xorer
  ...
  def def self.char_to_byte(char)
    char.ord
  end
  ...
end
{% endhighlight %}

We ask ourself _Does the test pass_? and to answer that question we run rspec and get the following:

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte

Finished in 0.00071 seconds
1 example, 0 failures
{% endhighlight %}

Great! It passes again. So what is the <a href="http://ruby-doc.org/core-1.9.3/Integer.html#method-i-ord" target="_blank">`ord`</a> method we're calling on `char`? From the ruby docs we see that `ord` returns the Integer ordinal of a one-character string. Which is exactly what we're trying to do. Or is it? Well, kind of, but not exactly.

We know that a `bit` is a `0` or a `1`. An `On` or `Off`. One of two possible values. A byte is 2 to the power of 8. Which gives us a possible 256 values, 0 to 255 (since computers start counting at 0). `97` is the ascii value of the character `a` and it does fall into this range.

The problem arrises if the plain text has unicode values. For instance, given `'六'.ord` (which is Chinese for "Six") will return the value: `20845`, which is two bytes long. To keep things simple I am assuming that we will only be dealing with English characters.

So we ask ourself again _Do you need to refactor_? I am happy with our implementation of this feature so the answer is _No_. Moving on it is now time to _Select a new feature to implement_.

We now need to turn the byte into a binary value to work so that we can XOR it. So let's add the following:

{% highlight ruby %}
describe Xorer do
  ...
  it 'converts a byte to a binary string' do
    expect(Xorer.byte_to_binary_string(97)).to eql('1100001')
  end
  ...
end
{% endhighlight %}

If you cannot count in binary you can take my word that the binary representation of `97` is `1100001`. Since we're learning an explanation would be better.

So computers only work with `0`'s and `1`'s and 97 is a byte (value between 0 and 255 or 2 to the power of 8). Take a look at the figure below:

{% highlight bash %}
--------------------------------------
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
--------------------------------------
|     |  1 |  1 |  0 | 0 | 0 | 0 | 1 |
--------------------------------------
{% endhighlight %}

A bit is considered `On` if it has a value of `1` and `Off` if it has a value of `0`. If it is `Off` we do not count it. With all the bits `Off` _(`00000000`)_ the value is `0`. With all the bits `On` _(`11111111`)_ the value is 255.

{% highlight bash %}
1 plus 2 equals 3.
3 plus 4 equals 7.
7 plus 8 equals 15.
15 plus 16 equals 31.
31 plus 32 equals 63.
63 plus 64 equals 127.
127 plus 128 equals 255.
{% endhighlight %}

In the case of '1100001' we only have 7 digits so the left most bit would be a `0`. So we have a `1` in the `1` column, a `1` in the `32` column, and a `1` in the `64` column.

{% highlight bash %}
1 plus 32 equals 33.
33 plus 64 equals 97.
{% endhighlight %}

With that out of the way let's run our test:

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string (FAILED - 1)

Failures:

  1) Xorer converts a byte to a binary string
     Failure/Error: expect(Xorer.byte_to_binary_string(97)).to eql('1100001')
     NoMethodError:
       undefined method `byte_to_binary_string' for Xorer:Module
     # ./xorer.rb:13:in `block (2 levels) in <top (required)>'

Finished in 0.00084 seconds
2 examples, 1 failure

Failed examples:

rspec ./xorer.rb:12 # Xorer converts a byte to a binary string
{% endhighlight %}

We see that we have not yet defined the `byte_to_binary_string` method. So in our `Xorer` module let's add that:

{% highlight ruby %}
module Xorer
  ...
  def self.byte_to_binary_string(byte)
    byte.to_s 2
  end
  ...
end
{% endhighlight %}

The `Fixnum` class has a `to_s` method that takes a radix base between 2 and 36. If we run our test now its passing:

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string

Finished in 0.00139 seconds
2 examples, 0 failures
{% endhighlight %}

We don't need to refactor this so let's work on our XOR feature. We need a test for it. I'm going to pop the training wheels off and step it up a notch. Assume that after adding a test I run rspec and based on the error message, add the least amount of code to make it pass.

_Select a new feature to implement: xor_

_Do you have a test for that?_

{% highlight ruby %}
describe Xorer do
  ...
  it 'xors two binary values' do
    expect(Xorer.xor(0, 0)).to be(0)
  end
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values (FAILED - 1)

Failures:

  1) Xorer xors two binary values
     Failure/Error: expect(Xorer.xor(0, 0)).to be(0)
     NoMethodError:
       undefined method `xor' for Xorer:Module
     # ./xorer.rb:21:in `block (2 levels) in <top (required)>'

Finished in 0.00124 seconds
3 examples, 1 failure

Failed examples:

rspec ./xorer.rb:20 # Xorer xors two binary values
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def self.xor(val_1, val_2)
    val_1 ^ val_2
  end
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values

Finished in 0.00113 seconds
3 examples, 0 failures
{% endhighlight %}

_Do you need to refactor?_ Based on the requirements of this test `No`, we don't need to refactor. So let's work on our next feature.

Our `xor` method works fine when given binary values like `0` in this case. What happens if we pass in binary strings like '1100001' & '1100010'? Let's write another test for that, but first what is the value we're expecting supposed to be? Let's actually XOR this by hand:

{% highlight bash %}
1 ^ 1 = 0
1 ^ 1 = 0
0 ^ 0 = 0
0 ^ 0 = 0
0 ^ 0 = 0
0 ^ 1 = 1
1 ^ 0 = 1
{% endhighlight %}

So we're expecting the value: '0000011'.

{% highlight ruby %}
describe Xorer do
  ...
  it 'xors two binary strings' do
    expect(Xorer.xor('1100001', '1100010')).to eql('0000011')
  end
  ...
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings (FAILED - 1)

Failures:

  1) Xorer xors two binary strings
     Failure/Error: val_1 ^ val_2
     NoMethodError:
       undefined method `^' for "1100001":String
     # ./xorer.rb:11:in `xor'
     # ./xorer.rb:29:in `block (2 levels) in <top (required)>'

Finished in 0.00127 seconds
4 examples, 1 failure

Failed examples:

rspec ./xorer.rb:28 # Xorer xors two binary strings
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def self.xor(val_1, val_2)
    val_1 = val_1.to_s.scan(/./).map { |i| i.to_i }
    val_2 = val_2.to_s.scan(/./).map { |i| i.to_i }
    xord = []
    0.upto(val_1.size - 1) do |i|
      xord << (val_1[i] ^ val_2[i])
    end
    xord.join('')
  end
  ...
end
{% endhighlight %}

Ok, so that method just got a bit more complicated... So what are we doing here? First we need to handle either a string or a number. To do that we can just turn the values into strings with the `to_s` method. Next we are calling the `scan` method on the string and passing in the argument `/./`. This is a regular expression. Regular expressions are outside of what I want to cover, but in this case take a deep breath and accept this explanation.

The `/`'s use enclose the regular expression the way `'`'s enclose a string. So the heart of this particular regular expression is the `.`, which says `match any character`. 

The `scan` method iterates through the string, matching the given pattern. For each match, a result is generated and either added to the resulting array.

Next we call the `map` method on the array. `map` takes a block and transforms each value in the array. In this case we are taking each digit in the string and calling the `to_i` method on it. This allows us to do an `^` (XOR) on the values.

So now we create an array to hold the XOR results. We run a loop from 0 to `val_1`'s size, minus `1`, using `i` as the index. Finally we join the `xord` array and return the resulting string.

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values (FAILED - 1)
  xors two binary strings

Failures:

  1) Xorer xors two binary values
     Failure/Error: expect(Xorer.xor(0, 0)).to be(0)

       expected #<Fixnum:1> => 0
            got #<String:70312811550080> => "0"

       Compared using equal?, which compares object identity,
       but expected and actual are not the same object. Use
       `expect(actual).to eq(expected)` if you don't care about
       object identity in this example.
     # ./xorer.rb:31:in `block (2 levels) in <top (required)>'

Finished in 0.00138 seconds
4 examples, 1 failure

Failed examples:

rspec ./xorer.rb:30 # Xorer xors two binary values
{% endhighlight %}

Unfortunately when we run this our previous test fails. This is because we are now returning a string instead of an integer. Since we changed the api we need to update the failing test. So update the failing test to:

{% highlight ruby %}
describe Xorer do
  ...
  it 'xors two binary values' do
    expect(Xorer.xor(0, 0)).to eql('0')
  end
  ...
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings

Finished in 0.00116 seconds
4 examples, 0 failures
{% endhighlight %}

_Do you need to refactor?_ No, this looks good. So, on to the next feature. Next we have to go the other way. From a binary string to a byte and from a byte to a char. Let's start with converting a binary string into a byte.

_Do you have a test for that?_

{% highlight ruby %}
describe Xorer do
  ...
  it 'converts a binary string to a byte' do
    expect(Xorer.binary_string_to_byte('1100001')).to eql(97)
  end
  ...
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte (FAILED - 1)

Failures:

  1) Xorer converts a binary string to a byte
     Failure/Error: expect(Xorer.binary_string_to_byte('1100001')).to eql(97)
     NoMethodError:
       undefined method `binary_string_to_byte' for Xorer:Module
     # ./xorer.rb:39:in `block (2 levels) in <top (required)>'

Finished in 0.00146 seconds
5 examples, 1 failure

Failed examples:

rspec ./xorer.rb:38 # Xorer converts a binary string to a byte
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def self.binary_string_to_byte(binary_string)
    binary_array = binary_string.reverse.scan(/./).map { |i| i.to_i }
    count = 1
    sum = binary_array[0] * count
    1.upto(binary_array.size - 1) do |i|
      count *= 2
      sum += binary_array[i] * count
    end
    sum
  end
  ...
end
{% endhighlight %}

So what is going on here? We have a binary string and start by calling `reverse` on it. So the name implies, it reverses the characters in the string. More on why we're doing that in a moment. Next we do the same `scan` & `map` that we used before to create an array of binary numbers.

Next we create a `count` variable and set it to `1`. Our algorithm is simple, we multiply the bit by `count` and add that value to `sum`. Then we multiply the value of `count` by `2` and that becomes the new value of `count`.

Since we're dealing with our binary string in reverse this makes perfect sense. `count` starts at `1`, then becomes `2`, then `4`, and so on...

Finally we return the `sum`, which is now our byte or character integer.

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte

Finished in 0.0013 seconds
5 examples, 0 failures
{% endhighlight %}

_Do you need to refactor?_ No, our test is passing and this works fine for now.

_Select a new feature to implement: convert a byte to a char_

_Do you have a test for that?_

{% highlight ruby %}
describe Xorer do
  ...
  it 'converts a byte to a character' do
    expect(Xorer.byte_to_char(97)).to eql('a')
  end
  ...
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character (FAILED - 1)

Failures:

  1) Xorer converts a byte to a character
     Failure/Error: expect(Xorer.byte_to_char(97)).to eql('a')
     NoMethodError:
       undefined method `byte_to_char' for Xorer:Module
     # ./xorer.rb:55:in `block (2 levels) in <top (required)>'

Finished in 0.00134 seconds
6 examples, 1 failure

Failed examples:

rspec ./xorer.rb:54 # Xorer converts a byte to a character
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def self.byte_to_char(byte)
    byte.chr
  end
  ...
end
{% endhighlight %}

Here we're using the <a href="http://ruby-doc.org/core-1.9.3/Integer.html#method-i-chr" target="_blank">`chr`</a> method which returns a string containing the character representation.

_Does the test pass?_

{% highlight bash %}
$ rspec xorer.rb

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character

Finished in 0.00146 seconds
6 examples, 0 failures
{% endhighlight %}

_Do you need to refactor?_ No, this is actually a good stopping point for now.

In my next post I will add the ability to read in a _'key'_ (string of characters) and a file containing _'plain text'_ from the command line. We will `XOR` the _'key'_ against the _'plain text'_ and output the resulting _'cipher text'_ to a file. We will run into some problems along the way and add some helper methods. Then we will look at `pack` and `unpack` as potential ways of working with the data.

Hope this was somewhat helpful, and if you have any comments or feedback please let me know. You can view the <a href="https://github.com/mweppler/simple-xorer" target="_blank">source code</a> hosted on github.

