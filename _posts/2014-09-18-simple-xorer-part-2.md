---
layout: post
meta-description: Building on our simple xor application
meta-keywords: crypto, cryptography, rspec, ruby, ruby command line application, tdd, test driven development, xor
preview: |
  In this post we're going to pick up our simple xorer application where we left off. We wanted to add the ability to read in a key and a file containing plain text from the command line. Then xor the key against the plain text and output the resulting cipher text to a file.
syntax-highlighting: true
tags: [crypto, ruby, tdd, xor]
title: "Building on our Simple XOR application"
---

# Building on our Simple XOR application

In this post we're going to pick up our <a href="http://matt.weppler.me/2014/09/17/simple-xorer.html" target="_blank">simple xorer</a> application where we left off. We wanted to add the ability to read in a _'key'_ (string of characters) and a file containing _'plain text'_ from the command line. Then `xor` the _'key'_ against the _'plain text'_ and output the resulting _'cipher text'_ to a file. If you do not have the <a href="https://github.com/mweppler/simple-xorer" target="_blank">previous code</a>, it's hosted on github.

To start let's reorganize our project a bit. Create a `spec` directory for our tests. Create a `lib` directory for our `xorer` module. Create a `bin` directory for our executable.

{% highlight bash %}
cd simple-xorer
mkdir {bin,lib,spec}
{% endhighlight %}

Now let's separate our test code from our implementation code. Create a new file `spec/xorer_spec.rb` move the following code from xorer.rb into it:

{% highlight ruby %}
require './lib/xorer'

describe Xorer do
  it 'converts a character to a byte' do
    expect(Xorer.char_to_byte('a')).to be(97)
  end

  it 'converts a byte to a binary string' do
    expect(Xorer.byte_to_binary_string(97)).to eql('1100001')
  end

  it 'xors two binary values' do
    expect(Xorer.xor(0, 0)).to eql('0')
  end

  it 'xors two binary strings' do
    expect(Xorer.xor('1100001', '1100010')).to eql('0000011')
  end

  it 'converts a binary string to a byte' do
    expect(Xorer.binary_string_to_byte('1100001')).to eql(97)
  end

  it 'converts a byte to a character' do
    expect(Xorer.byte_to_char(97)).to eql('a')
  end
end
{% endhighlight %}

Notice the `require './lib/xorer'` at the top of the file. This is important since our next step is to move `xorer.rb` to `lib/xorer.rb`. This tells `rspec` where to find our implementation code.

{% highlight bash %}
mv xorer.rb lib/xorer.rb
{% endhighlight %}

Let's run our tests and make sure everything is still passing.

{% highlight bash %}
$ rspec

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character

Finished in 0.00141 seconds
6 examples, 0 failures
{% endhighlight %}

Great, with that clean up out of the way we can focus on adding more functionality to our application. I imagine running our application from the command line with the following syntax:

{% highlight bash %}
bin/xorer mykey test.txt ciphertext.txt
{% endhighlight %}

So the user must pass in the _'key_' as the first argument, followed by the input or _'plain text'_ file, and lastly the output or _'cipher text'_ file.

Then to reverse the _'cipher text'_ the user would simply run:

{% highlight bash %}
bin/xorer mykey ciphertext.txt plaintext.txt
{% endhighlight %}

So let's create a test.txt file to work with:

{% highlight bash %}
$ cat > test.txt
This is a test...
^D
{% endhighlight %}

We are piping in input from the terminal to a new file that we are naming `test.txt` all in one  step. The `^D` _(press `control+d`)_ tells the terminal we want to stop inputing text and return to the the prompt.

Now let's create our `bin/xorer` file. This will be a ruby file. To make it executable we need to do a few things.

{% highlight bash %}
touch bin/xorer
chmod +x bin/xorer
{% endhighlight %}

Now add the shebang line to the very top of the file and output a simple `Hello World!`:

{% highlight ruby %}
#!/usr/bin/env ruby

puts "Hello World!"
{% endhighlight %}

If we run it we should see the following output:

{% highlight bash %}
$ bin/xorer
Hello World!
{% endhighlight %}

Now let's make sure the user passes the right amount of arguments onto the command line. Remove the 'hello world' line, and add the following:

{% highlight ruby %}
require './lib/xorer'

if ARGV[0].nil? || ARGV[0].empty?
  puts "need a key"
  exit 1
else
  key = ARGV[0]
end

if ARGV[1].nil? || ARGV[1].empty?
  puts "need an input file"
  exit 1
else
  input_file = ARGV[1]
end

if ARGV[2].nil? || ARGV[2].empty?
  puts "need an output file"
  exit 1
else
  output_file = ARGV[2]
end
{% endhighlight %}

Now if you try to pass in the wrong arguments you will get an error message and the application with quit.

{% highlight bash %}
$ bin/xorer
need a key

$ bin/xorer mykey
need an input file

$ bin/xorer mykey test.txt
need an output file

$ bin/xorer mykey test.txt ciphertext.txt
$
{% endhighlight %}

Let's create a `run` method in our `Xorer` module that accepts the 3 necessary parameters. Open `lib/xorer.rb` and add the following:

{% highlight ruby %}
module Xorer
  ...
  def self.run(key, input_file, output_file)
  end
  ...
end
{% endhighlight %}

In our `bin/xorer` file let's add a call to the `Xorer.run()`

{% highlight ruby %}
...
Xorer.run(key, input_file, output_file)
{% endhighlight %}

In order to work with the _'key'_ we need to convert the the string value to binary string.

{% highlight ruby %}
module Xorer
  ...
  def self.bytes_to_binary_array(bytes)
    bytes_binary_array = []
    bytes.each_byte do |b|
      bytes_binary_array << self.byte_to_binary_string(b)
    end
    bytes_binary_array
  end
  ...
  def self.run(key, input_file, output_file)
    key_binary_array = bytes_to_binary_array(key)
  end
  ...
end
{% endhighlight %}

We need to do the same thing for the _'plain text'_ file. Since in ruby a `String` and `File` both have the `each_byte` method available to them we do not have to change `bytes_to_binary_array`. We just need to get a file handle and pass that into the `bytes_to_binary_array` method.

{% highlight ruby %}
module Xorer
  ...
  def self.run(key, input_file, output_file)
    ...
    plaintext_file = File.open(input_file, 'rb')
    plaintext_binary_array = bytes_to_binary_array(plaintext_file)
    plaintext_file.close
  end
  ...
end
{% endhighlight %}

I am not going to write a test for `bytes_to_binary_array` this since we are already testing the underlying method `byte_to_binary_string` which produces the binary string from the byte.

Here is where we run into our first problem. Our _'key'_ needs to be the same amount of characters as our _'plain text'_. If they are not the same length we will not be able to `xor` the characters correctly. If we try to `xor` this it will result in an error similar to the following:

{% highlight bash %}
$ bin/xorer mykey test.txt ciphertext.txt
/Users/mattweppler/developer/projects/xorer/lib/xorer.rb:15:in `binary_string_to_byte': undefined method `*' for nil:NilClass (NoMethodError)
{% endhighlight %}

So let's make sure the _'key'_ is at least the same length. If it is not the remaining characters of the _'key'_ should just be ignored.

_Do you have a test for that?_

{% highlight ruby %}
describe Xorer do
  ...
  it 'adjusts the length of the key & input file to the same length' do
    key = 'mykey'
    input = "This is a test...\n"
    key_binary_array = Xorer.bytes_to_binary_array(key)
    input_binary_array = Xorer.bytes_to_binary_array(input)

    expected = ["1101101", "1111001", "1101011", "1100101", "1111001", "1101101", "1111001", "1101011", "1100101", "1111001", "1101101", "1111001", "1101011", "1100101", "1111001", "1101101", "1111001", "1101011"]

    expect(Xorer.adjust_key_length(key_binary_array, input_binary_array)).to eql(expected)
  end
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character
  adjusts the length of the key & input file to the same length (FAILED - 1)

Failures:

  1) Xorer adjusts the length of the key & input file to the same length
     Failure/Error: expect(Xorer.adjust_key_length(key_binary_array, input_binary_array)).to eql(expected)
     NoMethodError:
       undefined method `adjust_key_length' for Xorer:Module
     # ./spec/xorer_spec.rb:36:in `block (2 levels) in <top (required)>'

Finished in 0.00148 seconds
7 examples, 1 failure

Failed examples:

rspec ./spec/xorer_spec.rb:28 # Xorer adjusts the length of the key & input file to the same length
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def self.adjust_key_size(key_binary_array, input_binary_array)
    if key_binary_array.size != input_binary_array.size
      if key_binary_array.size < input_binary_array.size
        times = input_binary_array.size / key_binary_array.size
        key_binary_array *= times + 1
      end
      key_binary_array = key_binary_array[0...input_binary_array.size]
    end
  end
  ...
  def self.run(key, input_file, output_file)
    ...
    self.adjust_key_size(key_binary_array, input_binary_array)
    ...
  end
  ...
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character
  adjusts the length of the key & input file to the same length

Finished in 0.00167 seconds
7 examples, 0 failures
{% endhighlight %}

The next issue we will face is the possibility that the binary arrays will not be the same size. Take for instance the character `T` and `.` from our `test.txt` file. `T` becomes `...` and `.` becomes `...`. If we try to `xor` this it will result in an error similar to the following:

{% highlight bash %}
$ bin/xorer mykey test.txt ciphertext.txt
/Users/mattweppler/developer/projects/xorer/lib/xorer.rb:98:in `^': nil can't be coerced into Fixnum (TypeError)
{% endhighlight %}

So we need to pad the binary array with `0`'s. First we need to find out the length of the largest binary array.

_Do you have a test for that?_

{% highlight ruby %}
describe Xorer do
  ...
  it 'returns the length of the largest array element' do
    input = "This is a test...\n"
    input_binary_array = Xorer.bytes_to_binary_array(input)
    expected = 7
    expect(Xorer.largest_length(input_binary_array)).to eql(expected)
  end
  ...
end
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def self.largest_length(binary_strings)
    largest = 0
    binary_strings.each do |string|
      largest = (largest > string.size) ? largest : string.size
    end
    largest
  end
  ...
  def self.run(key, input_file, output_file)
    ...
    key_largest = self.largest_length(key_binary_array)
    input_largest = self.largest_length(input_binary_array)
    largest = (key_largest > input_largest) ? key_largest : input_largest
    ...
  end
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character
  adjusts the length of the key & input file to the same length
  returns the length of the largest array element

Finished in 0.00174 seconds
8 examples, 0 failures
{% endhighlight %}

Next we pad with zeros:

_Do you have a test for that?_

{% highlight ruby %}
describe Xorer do
  ...
  it 'pads a binary string with zeros for the given length' do
    actual = "1010"
    expected = "00001010"
    expect(Xorer.pad_with_zeros(8, actual)).to eql(expected)
  end
  ...
end
{% endhighlight %}

_Write just enough code for the test to pass_

{% highlight ruby %}
module Xorer
  ...
  def pad_with_zeros(length, binary_string)
    if binary_string.size < length
      zeros = length - binary_string.size
      binary_string = (binary_string.reverse << ('0' * zeros)).reverse
    end
    binary_string
  end
  ...
  def self.run(key, input_file, output_file)
    ...
    key_binary_array.map! do |value|
      self.pad_with_zeros(largest, value)
    end

    plaintext_binary_array.map! do |value|
      self.pad_with_zeros(largest, value)
    end
    ...
  end
end
{% endhighlight %}

_Does the test pass?_

{% highlight bash %}
$ rspec

Xorer
  converts a character to a byte
  converts a byte to a binary string
  xors two binary values
  xors two binary strings
  converts a binary string to a byte
  converts a byte to a character
  adjusts the length of the key & input file to the same length
  returns the length of the largest array element
  pads a binary string with zeros for the given length

Finished in 0.00187 seconds
9 examples, 0 failures
{% endhighlight %}

Now that all our tests are passing and we have all of the functionality in place, it's time to put the finishing touch on the application. Let's open a file to write to, and `xor` each element in the binary array, then convert the binary string to a byte, and convert the byte to a character, and lastly write the value to a file.

{% highlight ruby %}
module Xorer
  ...
  def self.run(key, input_file, output_file)
    ...
    self.write_xord_to_file(output_file, plaintext_binary_array, key_binary_array)
  end
  ...
  def self.write_xord_to_file(output_file, key_binary_array, input_binary_array)
    File.open(output_file, 'wb') do |f|
      0.upto(input_binary_array.size - 1) do |idx|
        xord = xor(key_binary_array[idx], input_binary_array[idx])
        byte = self.binary_string_to_byte(xord)
        char = self.byte_to_char(byte)
        f.write char
      end
    end
  ...
end
{% endhighlight %}

Let's see the fruits of our labor:

{% highlight bash %}
$ bin/xorer mykey test.txt ciphertext.txt
$ cat ciphertext.txt
9Y
KYWCWa
$ bin/xorer mykey ciphertext.txt plaintext.txt
$ cat plaintext.txt
This is a test...
{% endhighlight %}


So as you can see the cipher text looks nothing like our plain text. I am going to stop here. I had initially wanted to refactor some of the methods by using the ruby built in `pack` and `unpack` methods. Here are a few examples of how to use `unpack`:

{% highlight ruby %}
irb> "This is a test...\n".unpack('B*')
=> ["010101000110100001101001011100110010000001101001011100110010000001100001001000000111010001100101011100110111010000101110001011100010111000001010"]

irb> "This is a test...\n".unpack('C*')
=> [84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 116, 101, 115, 116, 46, 46, 46, 10]

irb> "This is a test...\n".unpack('C*').map {|e| e.to_s 2}
=> ["1010100", "1101000", "1101001", "1110011", "100000", "1101001", "1110011", "100000", "1100001", "100000", "1110100", "1100101", "1110011", "1110100", "101110", "101110", "101110", "1010"]
{% endhighlight %}

<a href="http://github.com" target="_blank">github</a>
Check the ruby documentation and if you feel like experimenting a little further, you can refactor some of the methods we've created to use `pack` and `unpack` instead of our implementation. Also take a look at benchmarking in ruby and benchmark any changes you make.


<a href="http://github.com" target="_blank">github</a>
Ruby benchmark example...

{% highlight ruby %}
...
{% endhighlight %}


Hope this was somewhat helpful, and if you have any comments or feedback please let me know. You can view the <a href="https://github.com/mweppler/simple-xorer" target="_blank">source code</a> hosted on github.

