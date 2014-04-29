---
layout: post
meta-description: Generate a Safari style random password with ruby
meta-keywords: ruby, ruby command line application
preview: |
  I like the passwords that the new versions of safari provide. One problem however, is not all sites allow it. Really?
syntax-highlighting: true
tags: [cli, ruby]
title: Generate a Safari style random password with ruby
---

# Generate a Safari style random password with ruby.

I like the passwords that the new versions of safari provide. One problem however, is not all sites allow it. Really? That's annoying. I decided to create a simple ruby script that I can run from the cli (since I basically live on the cli anyway). It would also allow me to use this type of password for other things (database passwords for use with rails, etc..). I took a quick and dirty approach at first:

{% highlight ruby %}
chars = %w[A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9]
rand_chars = []
1.upto(12) do
  rand_chars << chars.sample
  if rand_chars.select{ |el| el != '-' }.size % 3 == 0
    rand_chars << '-'
  end
end
rand_pass = rand_chars.join('')
puts rand_pass[0...-1]
{% endhighlight %}

That works, but I don't know, there is probably a nicer looking solution.

{% highlight ruby %}
chars = %w[A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9]
rand_chars = []
1.upto(12){ |i| rand_chars << chars.sample; rand_chars << '-' if i % 3 == 0 }
puts rand_chars.join('')[0...-1]
{% endhighlight %}

...better. Am I able to fit it within the viewable area of a Mou code block(96 characters wide)?

{% highlight ruby %}
chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.scan(/./)
puts chars.sample(12).join.scan(/.{3}/).join('-')
{% endhighlight %}

...why, yes I am. Am I able to get it down to one line?

{% highlight ruby %}
puts 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.scan(/./).sample(12).join.scan(/.{3}/).join('-')
{% endhighlight %}

...yes, but not without breaking the 96 character width limitation. Another approach perhaps?

{% highlight ruby %}
puts (('A'..'Z').to_a + ('a'..'z').to_a + (0..9).to_a).sample(12).join.scan(/.{3}/).join('-')
{% endhighlight %}

...that works for me! I enjoyed this little exercise. It wasn't a test driven approach, it was more like code golf and had me think about things slightly differently each time.

Can you do better?

## How I use it

_Shameless plug warning!_

I have my development environment setup a certain way. Since I work on different *nix machines, I needed a way to replicate it quick and easy. I am actually in the process of creating a ruby cli application. Its pretty bare right now, but I plan on creating a good readme, documentation, and more functionality soon. <a href="https://github.com/mweppler/env-config" target="_blank">Check it out and give me some feedback.</a>


Basically I make the script, which in my case lives in `~/developer/private/ruby` executable.

_Add a shebang `#!` line to the top of the file:_

{% highlight shell-session %}
#!/usr/bin/env ruby
{% endhighlight %}

_and chmod it:_

{% highlight shell-session %}
chmod u+x safari_style_random_password.rb
{% endhighlight %}

next I symlink the executable to somewhere in my path and shorten it:

{% highlight shell-session %}
ln -s ~/developer/private/ruby/safari_style_random_password.rb ~/developer/bin/safari-pass
{% endhighlight %}

lastly, since I don't want to have to copy from the terminal just to paste it where I need to use it I alias it to:

{% highlight shell-session %}
alias safari-pass="safari-pass | pbcopy"
{% endhighlight %}

Now I simply run `safari-pass` and the password is copied to my clipboard. I should I am on a Mac, to do this on linux you can probably just do:

{% highlight shell-session %}
alias safari-pass="safari-pass | xsel --clipboard --input"
{% endhighlight %}

...and I only say probably since I have not yet actually tried it myself.
