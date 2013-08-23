---
layout: post
meta-description: Code Reviews with Exercism
meta-keywords: code reviews, ruby
preview: |
  I think code reviews can be great. I love learning from my mistakes as well as being challenged for my technical decisions. Code reviews provide this. Unfortunately it doesn't happen nearly as much as I'd like.
syntax-highlighting: true
title: Code Reviews with Exercism
---

# Code Reviews with Exercism

I think code reviews can be great. I love learning from my mistakes as well as being challenged for my technical decisions. Code reviews provide this. Unfortunately it doesn't happen nearly as much as I'd like. With high profile projects and deadlines always right around the corner, who has the time?  

...and then I stumbled on <a href="http://exercism.io/" target="_blank">http://exercism.io/</a>. _"Crowd-sourced code reviews on daily practice problems."_  

I highly recommend you sign up and give it a shot. Whether you're new to coding or enjoy the social aspect, this site has it. So here is the first challenge:  

    Bob is a lackadaisical teenager. In conversation, his responses are very limited.

    Bob answers 'Sure.' if you ask him a question.

    He answers 'Woah, chill out!' if you yell at him (ALL CAPS).

    He says 'Fine. Be that way!' if you address him without actually saying anything.

    He answers 'Whatever.' to anything else.

## Instructions

    Run the test file, and fix each of the errors in turn. When you get the first test to pass, go to the first pending or skipped test, and make that pass as well. When all of the tests are passing, feel free to submit.

    Remember that passing code is just the first step. The goal is to work towards a solution that is as readable and expressive as you can make it.

    Have fun!

## Code Revision 1
{% highlight ruby %}
class Bob
  def hey(arg)
    if arg =~ /^\s*$/
      'Fine. Be that way!'
    elsif arg.upcase === arg
      'Woah, chill out!'
    elsif arg =~ /.*\?$/
      'Sure.'
    else
      'Whatever.'
    end
  end
end
{% endhighlight %}

## Nitpicks
Your class Bob is giving me undefined method `'upcase'` for `nil:NilClass` when running the tests.  
Also, your code may be more readable by using ruby methods such as `String#empty?` and `String#end_with?` to check for empty strings and strings that end with a question mark.  
Lastly, you may also wish to separate these string methods into it's own module or class.  
_-an anonymous nitpicker_  

I guess I should've read the feedback cycle before jumping in and coding, but thanks for the feedback you provided. Not only should I have caught nil but really anything that is not a `String`.  
On your second point though, I have to say I don't totally agree.  

{% highlight ruby %}
irb(main):007:0> '     '.empty?
=> false
irb(main):008:0> ''.empty?
=> true
{% endhighlight %}

So while `String#empty?` May catch the empty case it wouldn't catch the other, whereas the regexp does. I could go either way on  

{% highlight ruby %}
arg.end_with?
arg =~  /.*\?$/
{% endhighlight %}

Both read fine, but the end_with? method would totally be clear to someone not as comfortable with regular expressions.  
_-mweppler_  

Forgot to mention... Chaining `String#strip` with `String#empty?` will do the trick. Also, using `Object#to_s` can make sure your `nil` messages get turned into strings. Regex does a perfect job, but I've noticed most nitpickers will nitpick in favor of ruby methods.  
_-an anonymous nitpicker_  

## Code Revision 2
{% highlight ruby %}
class Bob
  def hey(arg)
    return 'Whatever.' if arg.class != String

    if arg =~ /^\s*$/
      'Fine. Be that way!'
    elsif arg.upcase === arg
      'Woah, chill out!'
    elsif arg.end_with?('?')
      'Sure.'
    else
      'Whatever.'
    end
  end
end
{% endhighlight %}

## Code Revision 3
{% highlight ruby %}
class Bob
  def hey(statement)
    respond_with statement.to_s.strip
  end

  private

  def respond_with statement
    if statement.empty?
      return 'Fine. Be that way!'
    elsif statement.upcase === statement
      return 'Woah, chill out!'
    elsif statement.end_with?('?')
      return 'Sure.'
    else
      return 'Whatever.'
    end
  end
end
{% endhighlight %}

## Nitpicks

I like!!! One thing.. the `to_s.strip` can be added to line 9 to stream line. That way, line 3 becomes `respond_with statement` and all your string manipulation is below.  
_-an anonymous nitpicker_  

What I am finding is that I need to return `'Whatever.'` if `statement` is not a `String` (catches `nil`, `Arrays`, `Hashes`, etc...). Than if `statement.strip.empty?`.  
_-mweppler_  

Read the Readme, the point if nothing was said, this means, `empty`, `nil`, `white space` cause there are not words.  
so `statement.to_s.strip.empty?` would work in this case. these functions stack, so `to_s` will turn any `nil` to `empty` the `strip` will take out any `white space` and turn the string to empty of nothing `else` exists perhaps if you had methods like `silence?` `question?` and `yelling?` it might make it more clear why the conditional statements exist.  
_-an anonymous nitpicker_  

I have read the readme and believe I understand the point. Lets think about your original statement "One thing.. the `to_s.strip` can be added to line 9 to stream line". Having it on line 3 guarantees what goes into the `respond_with` method is a `string`. Having it on line 9, sure if you pass `nil` or an empty string it will return whats on line 10 as expected. Again, what about a case where you have an `array`, `hash` or some other object:
_-mweppler_  

{% highlight ruby %}
statement = %w{i am an array}
=> ["i", "am", "an", "array"]

statement.to_s.strip.empty?
=> false

# so this fails and moves on to:

statement.upcase
NoMethodError: undefined method `upcase' for ["i", "am", "an", "array"]:Array
{% endhighlight %}

I do like the single responsibility principle you demonstrated  
_-mweppler_  

## Code Revision 4
{% highlight ruby %}
class Bob
  def hey(statement)
    respond_with statement
  end

  private

  def respond_with statement
    return 'Whatever.' if statement.class != String

    if statement.strip.empty?
      return 'Fine. Be that way!'
    elsif statement.upcase === statement
      return 'Woah, chill out!'
    elsif statement.end_with?('?')
      return 'Sure.'
    else
      return 'Whatever.'
    end
  end
end
{% endhighlight %}

## Nitpicks

I hate to have return 'Whatever.' twice, but I am finding it makes the most sense to me. Taking into account nil, and other non string object.  
_-mweppler_  

This doesn't seem to pass the tests; I get two failures when I try it. I agree with you on not liking the duplication, but I believe one of the nitpicks on your previous version showed you a way to do this.  
Also, in Ruby it's generally better to check for capability than for class, so `statement.respond_to?(:strip)` may be better than `statement.class == String`, though I don't think you need either here.  
_-an anonymous nitpicker_  

It would help to know what is not passing for you, since everything is passing on my end.  

{% highlight ruby %}
# Running tests:

..............

Finished tests in 0.001479s, 9465.8553 tests/s, 9465.8553 assertions/s.

14 tests, 14 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

Also, the problem I see with `respond_to? :strip` has to do with the ability to override or alias methods. Take the following for example:  

{% highlight ruby %}
class Array
  def strip
    self.map { |element| element.to_s.strip }
  end
end

%w{review my code}.strip.empty?
=> false

# this will pass the first case and fail on the very next.

%w{review my code}.upcase
NoMethodError: undefined method `upcase' for ["review", "my", "code"]:Array
{% endhighlight %}

or:  

{% highlight ruby %}
class Array
  alias_method :strip, :pop
end

[].strip.empty?
NoMethodError: undefined method `empty?' for nil:NilClass
{% endhighlight %}

Ducktyping at its finest!  
So unless you can guarantee your input won't respond to strip you have edge cases to take care of.  
_-mweppler_  

This is what I get when I run your code:  

{% highlight ruby %}
Run options: --seed 12637

# Running tests:

...F...........F

Finished tests in 0.026744s, 598.2650 tests/s, 598.2650 assertions/s.

  1) Failure:
TeenagerTest#test_more_silence [bob_test.rb:70]:
Expected: "Fine. Be that way!"
  Actual: "Whatever."

  2) Failure:
TeenagerTest#test_numeric_question [bob_test.rb:30]:
Expected: "Sure."
  Actual: "Woah, chill out!"

16 tests, 16 assertions, 2 failures, 0 errors, 0 skips
{% endhighlight %}

And just to sanity check:  

{% highlight ruby %}
MD5 (bob.mweppler.rb) = f4e54ae3e6c430aaea977ba6dbea042a
MD5 (bob_test.rb) = 658134623cbee8ecb6f842fb4af52d4f
{% endhighlight %}

I agree that duck typing can lead to absurd things happening, but you can't be too defensive without incurring a readability, performance, and sometimes functionality cost. What if there was another class that duck typed perfectly like a `String` but was disallowed by your hey method? This can happen easily with `String` vs `IO`, for example.  

However, I maintain that checking of the class or checking for methods is not needed in this case ;)  
_-an anonymous nitpicker_  

Odd that its failing for you... In any event I certain agree on not needing to resort to class checking, and have moved on to revision 5. Great feedback btw.  
_-mweppler_  

## Code Revision 5
{% highlight ruby %}
class Bob
  def hey(she_said)
    respond_with she_said
  end

  private

  def respond_with she_said
    begin
      return 'Fine. Be that way!' if silent? she_said
      return 'Woah, chill out!' if yelling? she_said
      return 'Sure.' if question? she_said
      raise
    rescue
      return 'Whatever.'
    end
  end

  def question? she_said
    she_said.end_with?('?')
  end

  def silent? she_said
    she_said.strip.empty?
  end

  def yelling? she_said
    she_said.upcase === she_said
  end
end
{% endhighlight %}

This looks great, but I would remove that `begin` ... `rescue`, as Whatever is a valid response, it isn't some kind of error situation.  
_-an anonymous nitpicker_  

...as you can see this can go on and on and on. Thats the fun part though (at least for me). This was only the first challenge but I feel like I am thinking more completely about solutions to the problem now that I have someone else checking my work ;)
