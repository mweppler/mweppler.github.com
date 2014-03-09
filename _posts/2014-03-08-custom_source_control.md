---
layout: post
meta-description: Custom Source Control
meta-keywords: git, ruby command line application, custom source control, fossil, mercurial, minitest, perforce, ruby, scm, subversion, tdd, test driven development
preview: |
  I, like a lot of developers these days, really enjoy working with Git. It just makes sense to me. However, not every shop has bought in. Some use Subversion, Perforce, Mercurial, and/or Fossil to name a few.
syntax-highlighting: true
tags: [cli, ruby, source-control, tdd]
title: Custom Source Control
---

# Custom Source Control

I, like a lot of developers these days, really enjoy working with Git. It just makes sense to me. However, not every shop has bought in. Some use Subversion, Perforce, Mercurial, and/or Fossil to name a few. That is just to mention a few, as there are even more that I have not worked with. Git though, I have used enough to appreciate. While working with other SCM's I've faced issues where I find myself wishing for one (or many) of Git's features.

Working with Perforce the other day, I started editing a file. It was an unfamiliar codebase and I just wanted to get an idea of the flow of the application. When I hit save however I get a 'readonly' message. So I could do `p4 open`, or ignore the message and save anyway. Now, I may have to do this several times and its more than likely that none of the edits I made have saved to code. This is quite a hindrance. So I continue ignoring the readonly message and keep saving files and deleting the changes.

The thing I like about Git is that it stays out of your way for the most part, until it’s time to commit. So I can edit to my heart’s content and do a `git status` to see if I left anything in the code that shouldn't be there, and quickly.

That being said, I wanted to build a little tool to abstract some of the differences of other SCM's away. Things like a `git status` amongst others. The problem however, is that I have a hard time finding the time to build such a tool. Also, I haven't really figured out all of the functionality I would like this tool to have.

Then I came across a video <a href="http://pragprog.com/screencasts/v-jwsceasy/source-control-made-easy" target="_blank">"Source Control Made Easy"</a> by Jim Weirich, a man well known in the Ruby community, who recently passed away. I liked his teaching style and feel I've learned a lot from his talks. One of my personal favorites is on testing called <a href="https://www.youtube.com/watch?v=983zk0eqYLY" target="_blank">"Roman Numerals Kata"</a>.  I didn't know him Jim, but it seems like he would have been a fun person to be friends with.

"Source Control Made Easy", is kind of a talk about Git, but not directly. Or at least it doesn't seem that way at first. The following is part of the description for this video:

> "In this 49-minute screencast, Jim Weirich takes you on a journey of how you might design and build a source control system from scratch. Along the way you'll gain a deeper understanding of the first principles behind systems like Git, so things begin to make more sense."

I highly recommend this video to anyone interested in learning about not only Git, but understanding the principles of source control in general. Also, note that the great people over at the Pragmatic Programmers are donating 100% of the purchase price to Jim's family.

So, as a tribute to Jim Weirich, I decided to take a shot at implementing the source control system he talks about in ruby and to incorporate some test driven development as well.

---

__Initial Stories:__

I'll start by writing out some quick user stories.

{% highlight cucumber %}
Initialize a new repository
  As a user
  I want the ability to initialize a repository
  So that I can begin adding snapshots to it
{% endhighlight %}

{% highlight cucumber %}
Create snapshots of my work
  As a user
  I want to create snapshots
  So that I can save snapshots of my work
{% endhighlight %}

{% highlight cucumber %}
Checkout previous snapshots
  As a user
  I want to checkout a previous snapshot
  So that I can fix issues or get back to a working state
{% endhighlight %}

With those stories in place to drive my development, I wanted to take a few minutes up front to think about or pseudo code a quick possible implementation. I don't really have much in terms of expectations here. I just want to get some of the ideas into focus.

__initialize__

* calling initialize from within a directory should:
  * create new hidden directory .esc
  * create new sqlite database to store what?
  * create HEAD file which contains hash (manifest filename) of the latest snapshot (empty initially) (maybe a db entry)

__snapshot__

* create metadata file (__metadata__) which will contain the manifest hash, snapshot author (name, email), timestamp, comments, current head (parent to this snapshot)
* create manifest file (__manifest__) which will contain hashes of the files in the snapshot, maps the hashes to original filenames and directories
* get a list of all files with paths in the working directory
* iterate through the list, calculate the file hash
* search the repository for a file with the calculated hash
  * if found, just add the hash and the filename with pathname to the manifest file
  * if not found
      * check if we need to create a directory for the file (create hash directories: a..z maybe)
      * copy the file to the repository directory
      * add the hash and the original filename with pathname to the manifest file
* calculate the hash of the manifest file rename it from __manifest__ to hash
* calculate the hash of the metadata file and rename it from __metadata__ to hash update metadata file with snapshot hash
* update HEAD to point to this snapshot (metadata filename)

__checkout(version number)__

* check .esc for the metadata file (version number/hash)
  * if metadata file is not found, fail and inform the user
  * if found, get the manifest hash
    * print the metadata info out to the console
    * open the manifest
    * scan the file line by line,
    * get the actual path/filename for an entry and see if it exists in the working directory
      * if it doesn't, just copy the file changing the hash to the filename and placing it in the correct directory
      * if it does, calculate the hash for the file in the working directory
        * if the hash is the same, don't do anything with that file
        * if the hash is different, overwrite the existing file with the file from the repository

One more thing before we get on with the actual coding. I am trying to keep this simple. That being said, I may not adhere to any strict standards or practices. I will try to point them out as I go. This will free me up to:

* Write code as fast as possible since it's been hard enough to find the time to write these days.
* Refactoring would be a great exercise for any reader who would like to continue this project. Ideally, I will do a follow up post where I refactor. I want to code this almost raw, and think about things as I go almost like the Roman Numeral Kata.

---

## Initialize

...but before we actually start writing the application code, let’s get our initial testing in place. Create a directory, and call it whatever you want. I am calling mine: `custom_source_control`.

{% highlight shell-session %}
mkdir custom_source_control
cd custom_source_control
{% endhighlight %}

Now open your favorite editor, create a new file named `custom_source_control.rb` and add the following to it.

{% highlight ruby %}
#!/usr/bin/env ruby

require 'minitest/autorun'

describe CustomSourceControl do
  before do
    @csc = CustomSourceControl.new
  end

  describe 'when a repository is initialized' do
    it 'must create a new hidden directory named .esc' do
      @csc.repository_exists?.must_equal true
    end
  end
end
{% endhighlight %}

So if you aren't familiar with `minitest` you should continue reading the post.  If you like what you've seen checkout the README over on github. Basically, we just described the first thing we'd like to test. The DSL's that people write using Ruby are great and this almost reads like English (or some weird robot form of it). Let’s just look at the words between the quotes:

_'when a repository is initialized', 'must create a new hidden directory named .esc'_

Another thing to point out is the `before` block. We can pretty much infer that the `before` block will run _before_ any of our tests. Then there is that `require 'minitest/autorun'` thing at the top. That just makes the tests run when we execute the ruby file. Let’s make the ruby file executable, and execute it.

{% highlight shell-session %}
chmod u+x custom_source_control.rb
./custom_source_control.rb
{% endhighlight %}

_(test)_

{% highlight text %}
./custom_source_control.rb:5:in `<main>': uninitialized constant CustomSourceControl (NameError)
{% endhighlight %}

Here we gave the script the ability to be executed as a command. It ran the script... and failed, kind of.

Actually, this is ruby telling us that we don't have a constant `CustomSourceControl` in our script, but were acting as if we did. `CustomSourceControl` is going to be our class. So we'll need to add it. We are going to write our actual implementation code above our tests and everything else, but below the shebang. Wait, what’s a 'shebang'? It’s that little #!/usr/bin/env ruby at the top of our file. Remember the `chmod u+x custom_source_control.rb` we just did. Well `chmod u+x custom_source_control.rb` tells the operating system the file is executable, and `#!/usr/bin/env ruby` tells it to use ruby to execute it.

{% highlight ruby %}
#!/usr/bin/env ruby

class CustomSourceControl
end

require 'minitest/autorun'
...
{% endhighlight %}

Note the use of `...`, do not type it in the editor. This is just me saying "more text may come before or after".

_(retest)_

{% highlight text %}
E

Finished tests in 0.000628s, 1592.3567 tests/s, 0.0000 assertions/s.

  1) Error:
CustomSourceControl::when a repository is initialized#test_0001_must create a new hidden directory named .esc:
NoMethodError: undefined method `repository_exists?' for #<CustomSourceControl:0x007fe974157038>
    ./custom_source_control.rb:15:in `block (3 levels) in <main>'
{% endhighlight %}

We now get an error _(denoted by the `E`)_ that the `CustomSourceControl` class doesn't have a `repository_exists?` method.  We will just add that method and retest:

{% highlight ruby %}
class CustomSourceControl
  ...
  def repository_exists?
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
F

Finished tests in 0.020405s, 49.0076 tests/s, 49.0076 assertions/s.

  1) Failure:
CustomSourceControl::when a repository is initialized#test_0001_must create a new hidden directory named .esc [./custom_source_control.rb:17]:
Expected: true
  Actual: nil
{% endhighlight %}

We are getting an actual failure _(denoted by the `F`)_ now. I mean, where do we get off expecting true to be returned from the `repository_exists?` method. We haven't even implemented it, of course it’s going to return nil...

So let’s implement it.

{% highlight ruby %}
class CustomSourceControl
  ...
  def repository_exists?
    true
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.

Finished tests in 0.000590s, 1694.9153 tests/s, 1694.9153 assertions/s.
{% endhighlight %}

...and we're passing _(denoted by the `.`)_!

Seriously? We passed? Yeah... and I want you to know that I realize just returning `true` doesn't mean that the repository actually exists. I know this for a few reasons, but let’s take the most straightforward way and prove this.

{% highlight shell-session %}
ls -la
{% endhighlight %}

`ls -la` if you don't know, or couldn't tell, just lists all the files in a directory. We need the `a` in order to see all files, including the hidden ones. On \*nix files/directories that begin with a `.` are hidden.

{% highlight text %}
drwxr-xr-x   4 mweppler  _guest    136 Mar  7 07:05 .
drwxr-xr-x  29 mweppler  _guest    986 Mar  7 07:05 ..
-rwxr--r--   1 mweppler  _guest    377 Mar  7 07:04 custom_source_control.rb
{% endhighlight %}

Nope, no `.esc` directory here... So what did that prove? The testing stuff? Why do it? We are taking a very systematic and pragmatic approach here. This testing stuff is good for a few reasons. We will see this come to light a bit later. For now though, please just accept it.

With this little bit of testing so far, we've really just exercised our minds as well as `minitest`. As our code grows and we move on to other projects, we will likely forget all the intricacies of what we wrote. Our tests here should give us a bit of confidence, even this early on in our development cycle. Also, our code is small and easy to manually test, so we know `minitest` is doing its job.

Let’s really implement the `repository_exists?` method now.

{% highlight ruby %}
class CustomSourceControl
  ...
  def repository_exists?
    Dir.exists? '.esc'
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
F

Finished tests in 0.018134s, 55.1450 tests/s, 55.1450 assertions/s.

  1) Failure:
CustomSourceControl::when a repository is initialized#test_0001_must create a new hidden directory named .esc [./custom_source_control.rb:18]:
Expected: true
  Actual: false
{% endhighlight %}

...and were failing again :(, that rush I got from passing never quite lasts long. Keep calm and carry on. It’s good that we're failing, we should be failing. We have yet to create our `.esc` directory. Now I don't know about you, but I want to get to passing again. I got that itch now...

{% highlight ruby %}
class CustomSourceControl
  ...
  def repository_exists?
    Dir.mkdir '.esc'
    Dir.exists? '.esc'
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.

Finished tests in 0.000720s, 1388.8889 tests/s, 1388.8889 assertions/s.
{% endhighlight %}

There is nothing crazy going on here, just calling the `mkdir` _(make directory)_ method on the `Dir` class. But guess what, we're passing again. If we check the file system, we see our newly added directory.

{% highlight text %}
drwxr-xr-x   5 mweppler  _guest    170 Mar  7 07:15 .
drwxr-xr-x  29 mweppler  _guest    986 Mar  7 07:05 ..
drwxr-xr-x   2 mweppler  _guest     68 Mar  7 07:15 .esc
-rwxr--r--   1 mweppler  _guest    412 Mar  7 07:15 custom_source_control.rb
{% endhighlight %}

Lets move on to our next test.

{% highlight ruby %}
  describe 'when a repository is initialized' do
    ...
    it 'must create an empty HEAD file' do
      @csc.head_exists?.must_equal true
      @csc.head_contents.empty?.must_equal true
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
EE

Finished tests in 0.000708s, 2824.8588 tests/s, 0.0000 assertions/s.

  1) Error:
CustomSourceControl::when a repository is initialized#test_0002_must create an empty HEAD file:
NoMethodError: undefined method `head_exists?' for #<CustomSourceControl:0x007fad59a170f8>
    ./custom_source_control.rb:23:in `block (3 levels) in <main>'

  2) Error:
CustomSourceControl::when a repository is initialized#test_0001_must create a new hidden directory named .esc:
Errno::EEXIST: File exists - .esc
    ./custom_source_control.rb:5:in `mkdir'
    ./custom_source_control.rb:5:in `repository_exists?'
    ./custom_source_control.rb:19:in `block (3 levels) in <main>'
{% endhighlight %}

What? Why do we have 2 errors? We were just passing. If we look at our initial test we can see that the `.esc` file already exists. We have to clean up after ourselves like good TDD citizens. First let’s manually remove the existing `.esc` directory. Then let’s add some code to our tests that will clean up after each test is run.

{% highlight shell-session %}
rmdir .esc
{% endhighlight %}

{% highlight ruby %}
require 'fileutils'

class CustomSourceControl
...
end
...
describe CustomSourceControl do
  after do
    FileUtils.rm_rf '.esc' if Dir.exists? '.esc'
  end
  ...
end
{% endhighlight %}

We added the `require 'fileutils'` right above our `class CustomSourceControl` statement, and after our `after` block inside our main `describe` block above our `before` block. Was that confusing? If so, you can double check your work with the project I have hosted on <a href="https://github.com/mweppler/custom-source-control" target="_blank">github</a>.

_(retest)_

{% highlight text %}
.E

Finished tests in 0.001229s, 1627.3393 tests/s, 813.6697 assertions/s.

  1) Error:
test_0002_must create an empty HEAD file(CustomSourceControl::when a repository is initialized):
NoMethodError: undefined method `head_exists?' for #<CustomSourceControl:0x007feac2805818>
    custom_source_control.rb:29:in `block (3 levels) in <main>'
{% endhighlight %}

Rerun our tests and this time our initial test is passing again. We can now deal with the error we are seeing. I don't know about you, but I am finding this process very helpful. It’s an iterative approach, one that you likely do anyway, just without the testing.

So, if history is any indicator of things to come (and we read the error message), we know the next step is to create the `head_exists?` method in our `CustomSourceControl` class.

{% highlight ruby %}
class CustomSourceControl
  ...
  def head_exists?
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
F.

Finished tests in 0.011323s, 176.6316 tests/s, 176.6316 assertions/s.

  1) Failure:
test_0002_must create an empty HEAD file(CustomSourceControl::when a repository is initialized) [custom_source_control.rb:31]:
Expected: true
  Actual: nil
{% endhighlight %}

We could take the same approach we took in our previous test and return `true` to start, then test, fail, refactor, etc... This would be the right approach, but I'll leave that for you to do on your own. Get comfortable with the process and messages.

Once you've run through the exercise, after a few iterations, you should have a method similar to the `repository_exists?` method except instead of creating a directory, we're going to create a file.

{% highlight ruby %}
class CustomSourceControl
  ...
  def head_exists?
    File.new(File.join('.esc', 'HEAD'), 'w')
    File.exists? File.join('.esc', 'HEAD')
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
E.

Finished tests in 0.001215s, 1646.0905 tests/s, 823.0453 assertions/s.

  1) Error:
test_0002_must create an empty HEAD file(CustomSourceControl::when a repository is initialized):
Errno::ENOENT: No such file or directory - .esc/HEAD
    custom_source_control.rb:7:in `initialize'
    custom_source_control.rb:7:in `new'
    custom_source_control.rb:7:in `head_exists?'
    custom_source_control.rb:34:in `block (3 levels) in <main>'
{% endhighlight %}

...but wait! Why is this you ask! Well we only create `.esc` when we call `repository_exists?`, and then after each test, it is removed if it exists. So `.esc` doesn't exist anymore.

Let's think about our story for a second. What we really care about, from a high level, is _repository initialization_. So lets `skip` this test and refactor a bit.

{% highlight ruby %}
  describe 'when a repository is initialized' do
    ...
    it 'must create an empty HEAD file' do
      skip
      @csc.head_exists?.must_equal true
      @csc.head_contents.empty?.must_equal true
    end
  end
{% endhighlight %}

_(retest)_

{% highlight text %}
.S

Finished tests in 0.029118s, 68.6860 tests/s, 34.3430 assertions/s.
{% endhighlight %}

That `S` tells us that we're skipping a test. Update the `CustomSourceControl` class with the following:


{% highlight ruby %}
...
class CustomSourceControl
  def head_exists?
    File.exists? File.join('.esc', 'HEAD')
  end

  def initialize_repository
    Dir.mkdir '.esc'
    File.new(File.join('.esc', 'HEAD'), 'w')
  end

  def repository_exists?
    Dir.exists? '.esc'
  end
end
...
{% endhighlight %}

We've created an `initialize_repository` method. We've moved both the `.esc` directory creation and the `HEAD` file creation out of the `xxx_exists?` methods and into `initialize_repository`. This all makes sense. The `xxx_exists?` should only be responsible for checking that something actually exists, not creating anything. `initialize_repository` on the other hand, its purpose is to handle the tasks involved in initializing the repository. One of those tasks is creation of the repository structure.

If we run this now what do you think will happen?

_(retest)_

{% highlight text %}
FS

Finished tests in 0.008715s, 229.4894 tests/s, 114.7447 assertions/s.

  1) Failure:
test_0001_must create a new hidden directory named .esc(CustomSourceControl::when a repository is initialized) [custom_source_control.rb:33]:
Expected: true
  Actual: false
{% endhighlight %}

Well, we fail since we haven't actually called the `initialize_repository` method anywhere in our code. Is that what you guessed? So where should we call the `initialize_repository` method? If you guessed _'in our `before` block'_, you win.

{% highlight ruby %}
  ...
  before do
    @csc = CustomSourceControl.new
    @csc.initialize_repository
  end
  ...
{% endhighlight %}

_(retest)_

{% highlight text %}
S.

Finished tests in 0.000897s, 2229.6544 tests/s, 1114.8272 assertions/s.
{% endhighlight %}

Great, we're passing again. Let's remove the `skip` statement from the test and rerun.

_(retest)_

{% highlight text %}
E.

Finished tests in 0.002892s, 691.5629 tests/s, 691.5629 assertions/s.

  1) Error:
test_0002_must create an empty HEAD file(CustomSourceControl::when a repository is initialized):
NoMethodError: undefined method `head_contents' for #<CustomSourceControl:0x007f970d009618>
    custom_source_control.rb:39:in `block (3 levels) in <main>'
{% endhighlight %}

It looks like we're missing that `head_contents` method. We should add that.

{% highlight ruby %}
class CustomSourceControl
  ...
  def head_contents
    File.open('.esc/HEAD', 'r') { |f| f.read }
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
..

Finished tests in 0.001290s, 1550.3876 tests/s, 2325.5814 assertions/s.
{% endhighlight %}

You did it! You can now initialize a new repository! Let's move on to our next story...

---

## Snapshot

{% highlight cucumber %}
Create snapshots of my work
  As a user
  I want to create snapshots
  So that I can save snapshots of my work
{% endhighlight %}

If you recall from our brief pseudo code, we've already kind of mapped out a few steps. If you don't recall that, try again, try harder, or just reread that part above.

Let's update our before block to include a new `snapshot` method.

{% highlight ruby %}
  before do
    @csc = CustomSourceControl.new
    @csc.initialize_repository
    @csc.snapshot
  end
{% endhighlight %}

_(retest)_

{% highlight text %}
EE

Finished tests in 0.002971s, 673.1740 tests/s, 0.0000 assertions/s.

  1) Error:
test_0002_must create an empty HEAD file(CustomSourceControl::when a repository is initialized):
NoMethodError: undefined method `snapshot' for #<CustomSourceControl:0x007fd35a985078>
    custom_source_control.rb:34:in `block (2 levels) in <main>'

  2) Error:
test_0001_must create a new hidden directory named .esc(CustomSourceControl::when a repository is initialized):
NoMethodError: undefined method `snapshot' for #<CustomSourceControl:0x007fd35a98bce8>
    custom_source_control.rb:34:in `block (2 levels) in <main>'
{% endhighlight %}

As you might have guessed, it failed since we haven't actually created a `snapshot` method. You also probably guessed that, that is going to be our next step. And you'd be right.

{% highlight ruby %}
class CustomSourceControl
  ...
  def snapshot
  end
  ...
end
{% endhighlight %}

Deep breath...

_(retest)_

{% highlight text %}
..

Finished tests in 0.001580s, 1265.8228 tests/s, 1898.7342 assertions/s.
{% endhighlight %}

...and we're passing. Now, let's create a new `describe` block for our __snapshot__ story and test the existence of a __metadata__ file. The test will be inside our main `describe CustomSourceControl do` block, outside and below the `describe 'when a repository is initialized' do`.

{% highlight ruby %}
...
describe CustomSourceControl do
  ...
  describe 'when a repository is initialized' do
    ...
  end

  describe 'when we take a snapshot' do
    it 'must create a metadata file' do
      @csc.metadata_exists?.must_equal true
    end
  end
end
{% endhighlight %}

Which will undoubtedly fail...

_(test)_

{% highlight text %}
..E

Finished tests in 0.002115s, 1418.4397 tests/s, 1418.4397 assertions/s.

  1) Error:
test_0001_must create a metadata file(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `metadata_exists?' for #<CustomSourceControl:0x007fb122a36760>
    custom_source_control.rb:53:in `block (3 levels) in <main>'
{% endhighlight %}

Now, let's make it pass.

{% highlight ruby %}
class CustomSourceControl
  ...
  def metadata_exists?
    File.exists? File.join('.esc', '__metadata__')
  end
  ...
  def snapshot
    File.open(File.join('.esc', '__metadata__'), 'w')
  end
end
{% endhighlight %}

First, we are adding the necessary `metadata_exists?` method and checking that a file `.esc/__metadata__` actually exists. It won't, and has to be created as part of the snapshot so we add that code to our snapshot method.

_(retest)_

{% highlight text %}
...

Finished tests in 0.001947s, 1540.8320 tests/s, 2054.4427 assertions/s.
{% endhighlight %}

Here is a homework assignment:

* Follow the same process for the manifest file test/creation. Make sure you follow the process as you go.

It should look something like this:

_(our test)_

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'must create a manifest file' do
      @csc.manifest_exists?.must_equal true
    end
  end
{% endhighlight %}

...and this:

_(method to test existence)_

{% highlight ruby %}
class CustomSourceControl
  ...
  def manifest_exists?
    File.exists? File.join('.esc', '__manifest__')
  end
  ...
end
{% endhighlight %}

...and last but not least:

_(actually create the file)_

{% highlight ruby %}
class CustomSourceControl
  ...
  def snapshot
    File.new(File.join('.esc', '__metadata__'), 'w')
    File.new(File.join('.esc', '__manifest__'), 'w')
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
....

Finished tests in 0.002804s, 1426.5335 tests/s, 1783.1669 assertions/s.
{% endhighlight %}

Our next step is to get a list of files in the current working directory.

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'gets a list of files in the current working directory' do
      @csc.cwd_files.must_equal ['custom_source_control.rb']
    end
  end
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def cwd_files
    all_files_wildcard = File.join '**', '*'
    Dir.glob(all_files_wildcard)
  end
  ...
end
{% endhighlight %}

Notice how I skipped running the test and went straight to implementation? Well I didn't actually skip the testing part. I just didn't write it here. Keep this in mind. You should be testing as often as possible. Get familiar with the messages and try to understand what they are telling you is wrong.

_(retest)_

{% highlight text %}
.....

Finished tests in 0.003872s, 1291.3223 tests/s, 1549.5868 assertions/s.
{% endhighlight %}

We moved pretty quickly in that last cycle of: write a test, watch it fail, write code to make it pass. The last part in that cycle which I have not done (for the most part) is refactor. It's called __Red, Green, Refactor__. Refactoring is an important part of the cycle and I normally wouldn't skip over it. I am doing so here however to get you familiar with the other parts of the cycle with the intention that we will revisit and refactor in another post. I mentioned this before, but want to reiterate the point here.

Let's create our SHA1 file hashes.

_(write a test)_

{% highlight ruby %}
    describe 'when we take a snapshot' do
    ...
    it 'creates a file hash for all files in the current working directory' do
      hashes = {
        'custom_source_control.rb' => '1527a36a8246ad0c07b9d5478c7374d3d576752d'
      }
      @csc.cwd_hashes.must_equal hashes
    end
  end
{% endhighlight %}

_(watch it fail)_

_(test)_

{% highlight text %}
.....E

Finished tests in 0.006143s, 976.7215 tests/s, 976.7215 assertions/s.

  1) Error:
test_0004_creates a file hash for all files in the current working directory(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `cwd_hashes' for #<CustomSourceControl:0x007fbafa8158a0>
    custom_source_control.rb:84:in `block (3 levels) in <main>'
{% endhighlight %}

_(write code to make it pass)_

{% highlight ruby %}
require 'openssl'
...
class CustomSourceControl
  ...
  def cwd_hashes
    sha1 = OpenSSL::Digest::SHA1.new
    hashes = {}
    cwd_files.each do |file|
      hashes[file] = sha1.hexdigest(File.read(file))
      sha1.reset
    end
    hashes
  end
  ...
end
{% endhighlight %}

What did we just do here? First, we are adding `openssl`, which provides the methods necessary to hash files. In the `cwd_hashes` method, we're creating an instance of `OpenSSL::Digest::SHA1` and later using the `hexdigest` it provides to hash files in the current working directory.

_(retest)_

{% highlight text %}
..F...

Finished tests in 0.020276s, 295.9164 tests/s, 345.2357 assertions/s.

  1) Failure:
test_0004_creates a file hash for all files in the current working directory(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:95]:
--- expected
+++ actual
@@ -1 +1 @@
-{"custom_source_control.rb"=>"1527a36a8246ad0c07b9d5478c7374d3d576752d"}
+{"custom_source_control.rb"=>"0b85c90f96ef4d8f0937338760be827d68f93469"}
{% endhighlight %}

We're getting the wrong hash, and that's because were actually updating the very file we're hashing/testing. We can never _(at least I can't think of a cleaver way)_ pass like this. We need to account for this and work around it. What we're going to do is create two files manually, `sha1sum` them and remove all but those two files from the hash returned from the `cwd_hashes` method.

Here I am going to use the `cat` command and paste the text in. You can use any means you're comfortable with to create the files and add the test to them. It is important however that you add the empty `newline` by hitting the `enter` key at the end of the sentence. I am also assuming that you have `shasum` or `sha1sum` installed. If you don't you can safely skip over that command.

{% highlight shell-session %}
cat > test_file_1.txt
{% endhighlight %}

Copy and paste in the following:

{% highlight text %}
this is test_file_1.text
{% endhighlight %}

Then type ctrl+c to quit. Run `shasum` or `sha1sum` to get the files hash.

{% highlight shell-session %}
sha1sum test_file_1.txt
bb4d8995cfa843effc83d6ddcea1a8351c09497f  test_file_1.txt
{% endhighlight %}

Repeat the process for the second test file.

{% highlight shell-session %}
cat > test_file_2.txt
{% endhighlight %}

{% highlight text %}
this is test_file_2.text
{% endhighlight %}

{% highlight shell-session %}
sha1sum test_file_2.txt
5d3140359919315ea06e3755cdc81860e9d7c556  test_file_2.txt
{% endhighlight %}

Now let's update our test.

{% highlight ruby %}
    ...
    it 'creates a file hash for all files in the current working directory' do
      actual_hashes = {
        'test_file_1.txt' => 'bb4d8995cfa843effc83d6ddcea1a8351c09497f',
        'test_file_2.txt' => '5d3140359919315ea06e3755cdc81860e9d7c556'
      }
      expected_hashes = @csc.cwd_hashes.keep_if { |key, value| key == 'test_file_1.txt' || key == 'test_file_2.txt' }
      expected_hashes.must_equal actual_hashes
    end
    ...
{% endhighlight %}

_(retest)_

{% highlight text %}
..F...

Finished tests in 0.019896s, 301.5682 tests/s, 351.8295 assertions/s.

  1) Failure:
test_0003_gets a list of files in the current working directory(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:88]:
--- expected
+++ actual
@@ -1 +1 @@
-["custom_source_control.rb"]
+["custom_source_control.rb", "test_file_1.txt", "test_file_2.txt"]
{% endhighlight %}

This gets us passing the test in question, but now we're failing a previous test. If we inspect the message we see that the newly introduced files are causing `gets a list of files in the current working directory` test to fail. We can simply add the new file names to the array of actual file names.

{% highlight ruby %}
    ...
    it 'gets a list of files in the current working directory' do
      @csc.cwd_files.must_equal ['custom_source_control.rb', 'test_file_1.txt', 'test_file_2.txt']
    end
    ...
{% endhighlight %}

_(retest)_

{% highlight text %}
......

Finished tests in 0.004923s, 1218.7690 tests/s, 1421.8972 assertions/s.
{% endhighlight %}

Now we need our list of files in the repository.

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'gets a list of files in the current working directory' do
      @csc.repository_file_list.must_equal ['__manifest__', '__metadata__', 'HEAD']
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
......E

Finished tests in 0.008568s, 816.9935 tests/s, 816.9935 assertions/s.

  1) Error:
test_0005_gets a list of files in the current working directory(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `repository_file_list' for #<CustomSourceControl:0x007fd440844718>
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def repository_file_list
    all_files_wildcard = File.join '.esc', '*'
    Dir.glob(all_files_wildcard).map { |pathname| File.basename pathname }
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.......

Finished tests in 0.004527s, 1546.2779 tests/s, 1767.1747 assertions/s.
{% endhighlight %}

Ok, now that we have our list of existing files in the repository. We can compare what is new, with what already exists and return both of those lists.

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'returns a list of new and existing files' do
      deltas = @csc.deltas
      deltas[:new].keep_if { |key, value| key == 'test_file_1.txt' || key == 'test_file_2.txt' }
      deltas[:new].must_equal ['test_file_1.txt', 'test_file_2.txt']
      deltas[:existing].must_equal []
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
...E....

Finished tests in 0.008715s, 917.9575 tests/s, 917.9575 assertions/s.

  1) Error:
test_0006_returns a list of new and existing files(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `deltas' for #<CustomSourceControl:0x007f8c2a83e790>
{% endhighlight %}

Let's add that `deltas` method.

{% highlight ruby %}
class CustomSourceControl
  ...
  def deltas
    new, existing = [], []
    cwd_hashes.each do |key, value|
      if repository_file_list.include? key
        existing << key
      else
        new << key
      end
    end
    { :new => new, :existing => existing }
  end
  ...
end
{% endhighlight %}

Here, we're going through our current working directory hashes and checking if any exist in the repository. If they do, we add them to the existing array. If they do not, we add them to the new array. Then we create a hash with the keys `:new` & `:existing`, add the arrays, and return that hash.

_(retest)_

{% highlight text %}
........

Finished tests in 0.005304s, 1508.2956 tests/s, 1885.3695 assertions/s.
{% endhighlight %}

I think the next step should be to add the files to the manifest, then based off the manifest copy and hash the files added to the snapshot.

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'adds entries to the manifest file' do
      expected_content = %Q{5d3140359919315ea06e3755cdc81860e9d7c556 => test_file_2.txt (new)\nbb4d8995cfa843effc83d6ddcea1a8351c09497f => test_file_1.txt (new)}
      @csc.write_manifest
      @csc.manifest_contents.gsub!(/.*? => custom_source_control\.rb \(new\)\n?/, '').chomp.must_equal expected_content
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
.......E.

Finished tests in 0.009311s, 966.5986 tests/s, 1073.9985 assertions/s.

  1) Error:
test_0007_adds entries to the manifest file(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `write_manifest' for #<CustomSourceControl:0x007fb13084c888>
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def hash_for_file(file = nil)
    sha1 = OpenSSL::Digest::SHA1.new
    sha1.hexdigest(File.read(file))
  end
  ...
  def write_manifest
    file_deltas = deltas
    file_list   = []
    file_deltas[:new].each      { |filename| file_list << "#{hash_for_file filename} => #{filename} (new)"}
    file_deltas[:existing].each { |filename| file_list << "#{hash_for_file filename} => #{filename} (existing)"}
    File.open(File.join('.esc', '__manifest__'), 'w') do |file|
      file_list.sort!.each { |entry| file.puts entry }
    end
  end
  ...
end
{% endhighlight %}

Here we're getting the deltas and writing them to the manifest file. We also added a helper method `hash_for_file` to return the hash of any file we pass in. I can see this coming in handy.

_(retest)_

{% highlight text %}
........E

Finished tests in 0.010894s, 826.1428 tests/s, 917.9365 assertions/s.

  1) Error:
test_0007_adds entries to the manifest file(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `manifest_contents' for #<CustomSourceControl:0x007f91e08542f0>
    custom_source_control.rb:146:in `block (3 levels) in <main>'
{% endhighlight %}

We're going to need to read that manifest file back out, so let's add that method.

{% highlight ruby %}
class CustomSourceControl
  ...
  def manifest_contents(manifest = nil)
    manifest ||= '__manifest__'
    File.open(".esc/#{manifest}", 'r') { |f| f.read }
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.........

Finished tests in 0.006487s, 1387.3902 tests/s, 1695.6991 assertions/s.
{% endhighlight %}

If we take another look at this test we see `@csc.write_manifest` method call. Really this should be happening in the `snapshot` method itself. So let's make that call in `snapshot` and remove it from the test.

{% highlight ruby %}
class CustomSourceControl
  ...
  def snapshot
    File.new(File.join('.esc', '__metadata__'), 'w')
    File.new(File.join('.esc', '__manifest__'), 'w')
    write_manifest
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.........

Finished tests in 0.014500s, 620.6897 tests/s, 758.6207 assertions/s.
{% endhighlight %}

Next we need to copy the files in the manifest to the repository directory

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'copies files listed in the manifest to the repository' do
      @csc.copy_manifest_files_to_repository
      @csc.verify_manifest('__manifest__').must_equal true
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
..E.......

Finished tests in 0.015868s, 630.1991 tests/s, 693.2191 assertions/s.

  1) Error:
test_0008_copies files listed in the manifest to the repository(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `copy_manifest_files_to_repository' for #<CustomSourceControl:0x007ff26103d120>
    custom_source_control.rb:155:in `block (3 levels) in <main>'
{% endhighlight %}

We're introducing a few methods here so let's take our time with this.

{% highlight ruby %}
class CustomSourceControl
  ...
  def copy_manifest_files_to_repository
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
..E.......

Finished tests in 0.015557s, 642.7975 tests/s, 707.0772 assertions/s.

  1) Error:
test_0008_copies files listed in the manifest to the repository(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `verify_manifest' for #<CustomSourceControl:0x007fca9b03d1b8>
    custom_source_control.rb:159:in `block (3 levels) in <main>'
{% endhighlight %}

Add the `verify_manifest` helper method.

{% highlight ruby %}
class CustomSourceControl
  ...
  def verify_manifest(manifest = nil)
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.........F

Finished tests in 0.024386s, 410.0714 tests/s, 492.0856 assertions/s.

  1) Failure:
test_0008_copies files listed in the manifest to the repository(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:162]:
Expected: true
  Actual: nil
{% endhighlight %}

Now that we're failing, let's start implementing the `verify_manifest` method.

{% highlight ruby %}
class CustomSourceControl
  ...
  def verify_manifest(manifest = nil)
    manifest ||= '__manifest__'
    File.open(File.join('.esc', manifest)) do |file|
      repo_files = repository_file_list()
      file.readlines.each do |entry|
        return false unless repo_files.include? entry[0...40]
      end
    end
    true
  end
  ...
end
{% endhighlight %}

Here we're reading the `__manifest__` file, and for each entry we get the 40 character hash (`entry[0...40]`) and checking the `repo_files` array (file names) for it.

_(retest)_

{% highlight text %}
....F.....

Finished tests in 0.030663s, 326.1259 tests/s, 391.3511 assertions/s.

  1) Failure:
test_0008_copies files listed in the manifest to the repository(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:170]:
Expected: true
  Actual: false
{% endhighlight %}

This time we're returning `false`, and it makes sense since we're not actually copying the files just yet. So let's work on the implementing the `copy_manifest_files_to_repository` method.

{% highlight ruby %}
class CustomSourceControl
  ...
  def copy_entry_to_repository(manifest_entry)
    FileUtils.cp(manifest_entry[:pathname], File.join('.esc', manifest_entry[:hash]), { :preserve => true })
  end

  def copy_manifest_files_to_repository
    entries = []
    File.open(File.join('.esc', '__manifest__'), 'r') do |file|
      file.readlines.each do |entry|
        entry =~ /(.*?) => (.*?) \(new\)\n?/
        entries << { :hash => $1, :pathname => $2 } if $1
      end
    end
    entries.each do |entry|
      copy_entry_to_repository entry
    end
  end
  ...
end
{% endhighlight %}

There is quite a bit going here. First, we open the `__manifest__` file and break down each entry (line). What's the deal with `=~`, and what are `$1` and `$2`? `=~` is the match operator in ruby. It will match the variable on the left _(string or regular expression)_ to a regular expression on the right. It returns `nil` if a match is not found, and the position of the match if found. Also if there is a match the `$1`, `$2`, ..., `$9` will represent the capture blocks _(whatever is enclosed in the `()`)_. That is how we break down the entry into a `hash` and `pathname`. For the actual copying we created a helper method `copy_entry_to_repository`.

_(retest)_

{% highlight text %}
..........

Finished tests in 0.016832s, 594.1065 tests/s, 712.9278 assertions/s.
{% endhighlight %}

That was fun, wasn't it? Let's take the same approach and add the `copy_manifest_files_to_repository` call to the `snapshot` method. This will allow us to remove it from the test as well. Make sure you're test still passes before moving on.

...it didn't pass did it? We're you able to figure out why? Did you attempt to fix it? Here is what I did. Based on the failure:

{% highlight text %}
........F.

Finished tests in 0.039832s, 251.0544 tests/s, 301.2653 assertions/s.

  1) Failure:
test_0005_gets a list of files in the current working directory(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:168]:
--- expected
+++ actual
@@ -1 +1 @@
-["__manifest__", "__metadata__", "HEAD"]
+["3b0930f8589a4eb37a1dbb9cbf355391781c2bba", "5d3140359919315ea06e3755cdc81860e9d7c556", "__manifest__", "__metadata__", "bb4d8995cfa843effc83d6ddcea1a8351c09497f", "HEAD"]
{% endhighlight %}

I went right to the `gets a list of files in the current working directory` test and saw that we're only accounting for the `HEAD` file, which should always be in an _initialized repository_, and then the current working `__manifest__` & `__metadata__` files. This isn't the case anymore since our `snapshot` method is doing more at this point. So what we really want is to make sure that at the point of this test at least those files exist. The `must_include` assertion provided by `minitest` is perfect for this.

Let's update our `gets a list of files in the current working directory` test to the following:

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'gets a list of files in the current working directory' do
      ['__manifest__', '__metadata__', 'HEAD'].each do |filename|
        @csc.repository_file_list.must_include filename
      end
    end
    ...
  end
{% endhighlight %}

_(retest)_

{% highlight text %}
..........

Finished tests in 0.026117s, 382.8924 tests/s, 650.9170 assertions/s.
{% endhighlight %}

Now we have to calculate the hash of the manifest file and rename it to the hash.

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'calculates the hash of the manifest file and renames it to the hash' do
      manifest_hash = @csc.hash_for_file File.join('.esc', '__manifest__')
      @csc.hash_and_copy_manifest
      @csc.repository_file_exists?(manifest_hash).must_equal true
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
.......E...

Finished tests in 0.026070s, 421.9409 tests/s, 652.0905 assertions/s.

  1) Error:
test_0009_calculates the hash of the manifest file and renames it to the hash(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `hash_and_copy_manifest' for #<CustomSourceControl:0x007ffa4a0a7020>
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def hash_and_copy_manifest
    manifest_file = File.join('.esc', '__manifest__')
    hash = hash_for_file(manifest_file)
    FileUtils.cp(manifest_file, File.join('.esc', hash))
    hash
  end
  ...
  def repository_file_exists?(filename = nil)
    File.exists? File.join('.esc', filename)
  end
  ...
end
{% endhighlight %}

We added another helper method `repository_file_exists?`. It simply takes a file name and checks the repository for existence of the filename.

_(retest)_

{% highlight text %}
...........

Finished tests in 0.039280s, 280.0407 tests/s, 458.2485 assertions/s. 
{% endhighlight %}

Now that we're passing, let's add the `hash_and_copy_manifest` method to the `snapshot` method and remove `@csc.hash_and_copy_manifest` from the test. Make sure you're passing and move on.

We're almost there. Next, we have to update the metadata file with the necessary info, then hash it.

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'adds the snapshot info to the metadata file, calculates its file hash, and renames it to the hash' do
      manifest_hash = @csc.hash_for_file File.join('.esc', '__manifest__')
      @csc.write_metadata manifest_hash
      metadata_hash = @csc.hash_for_file File.join('.esc', '__metadata__')
      @csc.hash_and_copy_metadata
      @csc.repository_file_exists?(metadata_hash).must_equal true
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
..........E.

Finished tests in 0.033031s, 363.2951 tests/s, 544.9426 assertions/s.

  1) Error:
test_0010_adds the snapshot info to the metadata file, calculates its file hash, and renames it to the hash(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `write_metadata' for #<CustomSourceControl:0x007fc77c022f60> 
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def hash_and_copy_metadata
    metadata_file = File.join('.esc', '__metadata__')
    hash = hash_for_file(metadata_file)
    FileUtils.cp(metadata_file, File.join('.esc', hash))
    hash
  end
  ...
  def write_metadata(manifest_hash = nil)
    File.open(File.join('.esc', '__metadata__'), 'w') do |file|
      file.puts "Snapshot Manifest: #{manifest_hash}"
      file.puts "Snapshot Parent:   #{(head_contents.empty?) ? 'root' : head_contents}"
      file.puts "Snapshot Taken:    #{Time.now}"
    end
  end
...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
............

Finished tests in 0.034964s, 343.2102 tests/s, 543.4161 assertions/s.
{% endhighlight %}

Let's clean up our test like we've done before. The `@csc.write_metadata manifest_hash` & `@csc.hash_and_copy_metadata` calls will happen in the `snapshot` methods so let's delete them.

{% highlight ruby %}
    ...
    it 'adds the snapshot info to the metadata file, calculates its file hash, and renames it to the hash' do
      manifest_hash = @csc.hash_for_file File.join('.esc', '__manifest__')
      metadata_hash = @csc.hash_for_file File.join('.esc', '__metadata__')
      @csc.repository_file_exists?(metadata_hash).must_equal true
    end
    ...
{% endhighlight %}

_(test)_

{% highlight text %}
..F.........

Finished tests in 0.076299s, 157.2760 tests/s, 249.0203 assertions/s.

  1) Failure:
test_0010_adds the snapshot info to the metadata file, calculates its file hash, and renames it to the hash(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:224]:
Expected: true
  Actual: false
{% endhighlight %}

Now that we're failing lets add the necessary calls to the `snapshot` method.

{% highlight ruby %}
  ...
  def snapshot
    File.new(File.join('.esc', '__metadata__'), 'w')
    File.new(File.join('.esc', '__manifest__'), 'w')
    write_manifest
    copy_manifest_files_to_repository
    manifest_hash = hash_and_copy_manifest
    write_metadata manifest_hash
    hash_and_copy_metadata
  end
  ...
{% endhighlight %}

_(retest)_

{% highlight text %}
............

Finished tests in 0.079316s, 151.2936 tests/s, 239.5481 assertions/s. 
{% endhighlight %}

The last step for our snapshot story is to update HEAD to point to this snapshot (metadata filename)

{% highlight ruby %}
  describe 'when we take a snapshot' do
    ...
    it 'updates HEAD to the latest snapshot' do
      metadata_hash = @csc.hash_for_file File.join('.esc', '__metadata__')
      @csc.update_head metadata_hash
      @csc.head_contents.must_equal metadata_hash
    end
  end
{% endhighlight %}

_(test)_

{% highlight text %}
......E......

Finished tests in 0.042301s, 307.3213 tests/s, 449.1620 assertions/s.

  1) Error:
test_0011_updates HEAD to the latest snapshot(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `update_head' for #<CustomSourceControl:0x007ff5908eea58>
    custom_source_control.rb:231:in `block (3 levels) in <main>'
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def update_head(metadata_hash = nil)
    File.open(File.join('.esc', 'HEAD'), 'w') do |file|
      file.write metadata_hash
    end
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.............

Finished tests in 0.040271s, 322.8129 tests/s, 496.6353 assertions/s.
{% endhighlight %}

Now refactor the `update_head` out of the test.

{% highlight ruby %}
    it 'updates HEAD to the latest snapshot' do
      metadata_hash = @csc.hash_for_file File.join('.esc', '__metadata__')
      @csc.head_contents.must_equal metadata_hash
    end
{% endhighlight %}

_(retest)_

{% highlight text %}
..F..........

Finished tests in 0.164686s, 78.9381 tests/s, 121.4432 assertions/s.

  1) Failure:
test_0011_updates HEAD to the latest snapshot(CustomSourceControl::when we take a snapshot) [custom_source_control.rb:237]:
--- expected
+++ actual
@@ -1 +1 @@
-"7a294d8483262c77b5d762a5325efb920e9948b6"
+""
{% endhighlight %}

{% highlight ruby %}
  def snapshot
    File.new(File.join('.esc', '__metadata__'), 'w')
    File.new(File.join('.esc', '__manifest__'), 'w')
    write_manifest
    copy_manifest_files_to_repository
    manifest_hash = hash_and_copy_manifest
    write_metadata manifest_hash
    metadata_hash = hash_and_copy_metadata
    update_head metadata_hash
  end
{% endhighlight %}

_(retest)_

{% highlight text %}
.F...........

Finished tests in 0.048889s, 265.9085 tests/s, 409.0900 assertions/s.

  1) Failure:
test_0002_must create an empty HEAD file(CustomSourceControl::when a repository is initialized) [custom_source_control.rb:177]:
Expected: true
  Actual: false
{% endhighlight %}

We expected the previous because we removed the `update_head` call and didn't add it to `snapshot`. Then, we added the `update_head` to the `snapshot` method, but since that file is not empty anymore we're failing our `must create an empty HEAD file` test. It looks like we're going to have to refactor a bit more.

Let's refactor the `before` block. We know all of our tests depend on `@csc` to be an instance of `CustomSourceControl` and they all need an initialized repository. The thing is our `when a repository is initialized` tests don't require a `snapshot`. So let's move that out and into a `before` block inside the `when we take a snapshot` tests.

{% highlight ruby %}
describe CustomSourceControl do
  ...
  before do
    @csc = CustomSourceControl.new
    @csc.initialize_repository
  end
  ...
  describe 'when we take a snapshot' do
    before do
      @csc.snapshot
    end
    ...
  end
end
{% endhighlight %}

_(retest)_

{% highlight text %}
.............

Finished tests in 0.040347s, 322.2049 tests/s, 495.6998 assertions/s.
{% endhighlight %}

...and our snapshot story is complete! On to our final story!

---

## Checkout

{% highlight cucumber %}
Checkout previous snapshots
  As a user
  I want to checkout a previous snapshot
  So that I can fix issues or get back to a working state
{% endhighlight %}

At some point we're going to need a way to list all the snapshots `csc` knows about. One way to do this would be to get the `HEAD` snapshot then recursively scan through the metadata files and their parents all the way up to root, then just list them out. This might end up in a `log` subcommand. For now, I am trying to keep the functionality really basic. I am going to manually build up the repository with 2 snapshots, then pick the first snapshot to checkout.

To keep this testable, we'll do this with a before block for this set of tests.

{% highlight ruby %}
describe CustomSourceControl do
  ...
  describe 'when we checkout a previous snapshot' do
    before do
      @csc.snapshot
    end
  end
end
{% endhighlight %}

So that's going to create the first snapshot. I am going to use the `pry` gem to suspend the test so that I can manually inspect the `.esc` directory. If you use it, make sure to type `quit` when you're finished inspecting things.

{% highlight ruby %}
  describe 'when we checkout a previous snapshot' do
    ...
    it 'suspends the test so we can inspect the .esc directory' do
      require 'pry'; binding.pry
      skip
    end
  end
{% endhighlight %}

There is a way you can accomplish this without having to install a gem. Add a call to ruby's `sleep` method with a time of something long enough for you to carry the tasks out for yourself. That would look like this:

{% highlight ruby %}
  describe 'when we checkout a previous snapshot' do
    ...
    it 'suspends the test so we can inspect the .esc directory' do
      sleep 60 * 60
      skip
    end
  end
{% endhighlight %}

__* Be sure to clean up after yourself by deleting the `suspends the test so we can inspect the .esc directory` test when you are finished.__

Getting the hashes:

{% highlight shell-session %}
ls -ltr .esc
{% endhighlight %}

{% highlight text %}
-rw-r--r--  1 mattweppler  staff    25 Mar  8 11:01 bb4d8995cfa843effc83d6ddcea1a8351c09497f
-rw-r--r--  1 mattweppler  staff    25 Mar  8 11:02 5d3140359919315ea06e3755cdc81860e9d7c556
-rwxr-xr-x  1 mattweppler  staff  7351 Mar  8 14:43 2c114f49e4935865fb00903dba1df2ba70283748
-rw-r--r--  1 mattweppler  staff   129 Mar  8 14:44 b696627a90073c3d3870a30ac5c8140f853a6b3e
-rw-r--r--  1 mattweppler  staff   129 Mar  8 14:44 __metadata__
-rw-r--r--  1 mattweppler  staff   207 Mar  8 14:44 __manifest__
-rw-r--r--  1 mattweppler  staff    40 Mar  8 14:44 HEAD
-rw-r--r--  1 mattweppler  staff   207 Mar  8 14:44 87b17efdc68c9c1d806c4bd05ce70d9baacd22bf
{% endhighlight %}

So if we inspect `HEAD` we see the metadata file hash.

{% highlight shell-session %}
cat .esc/HEAD
{% endhighlight %}

{% highlight text %}
b696627a90073c3d3870a30ac5c8140f853a6b3e
{% endhighlight %}

We then take that file hash, which is the metadata file and inspect that:

{% highlight shell-session %}
cat .esc/b696627a90073c3d3870a30ac5c8140f853a6b3e
{% endhighlight %}

{% highlight text %}
Snapshot Manifest: 87b17efdc68c9c1d806c4bd05ce70d9baacd22bf
Snapshot Parent:   root
Snapshot Taken:    2014-03-08 14:44:10 -0800
{% endhighlight %}

This shows that this is the first snapshot as denoted by the `Snapshot Parent:   root`. So let's take a look at the manifest next `Snapshot Manifest: 87b17efdc68c9c1d806c4bd05ce70d9baacd22bf`


{% highlight shell-session %}
cat .esc/87b17efdc68c9c1d806c4bd05ce70d9baacd22bf
{% endhighlight %}

{% highlight text %}
2c114f49e4935865fb00903dba1df2ba70283748 => custom_source_control.rb (new)
5d3140359919315ea06e3755cdc81860e9d7c556 => test_file_2.txt (new)
bb4d8995cfa843effc83d6ddcea1a8351c09497f => test_file_1.txt (new)
{% endhighlight %}

You can `quit` `pry` now. If you used the `sleep` method do these tasks and it still hasn't woke up and finished just hit `ctrl+c` to kill the tests. Let's add a new file `test_file_3.txt` and update an existing one `test_file_2.txt`:

{% highlight ruby %}
    ...
    before do
      @csc.snapshot

      # make some edits
      File.open('test_file_3.txt', 'w') do |file|
        file.write "this is test_file_3.text\n"
      end
      File.open('test_file_2.txt', 'a') do |file|
        file.write "this is an update to test_file_2.text\n"
      end

      # take our second snapshot
      @csc.snapshot
    end
    ...
{% endhighlight %}

We're also going to want to clean up after ourselves again:

{% highlight ruby %}
    ...
    after do
      File.open('test_file_2.txt', 'w') do |file|
        file.write "this is test_file_2.text\n"
      end
      File.delete('test_file_3.txt')
    end
    ...
{% endhighlight %}

Ok let's run the test again and this time make note of the hashes. For me, `HEAD` is `35d91f744401d8d4828c65bd65029dc07119d5a7`. The metadata file (`35d91f744401d8d4828c65bd65029dc07119d5a7`) shows:

{% highlight text %}
Snapshot Manifest: 14c86c6a758c197367d417b32d57433446fa63e4
Snapshot Parent:   36e0583c25d5e8107538afa345122e9529b9d6fd
Snapshot Taken:    2014-03-08 14:50:32 -0800
{% endhighlight %}

So let's take the parent metadata `36e0583c25d5e8107538afa345122e9529b9d6fd` and take a look:

{% highlight text %}
Snapshot Manifest: 1b1ab1bef308608786e9a1ae2e30e370dd032939
Snapshot Parent:   root
Snapshot Taken:    2014-03-08 14:50:32 -0800
{% endhighlight %}

Yep, `1b1ab1bef308608786e9a1ae2e30e370dd032939` that's the one we want. Just to be sure, I ran through this process a few more times. I noticed that 2 of the hashes were changing, while the remaining files stayed the same. So I opened one of the files where the file hash had changed. I spotted the issue right away... The timestamp! Since the timestamp changed each time I ran it I was not getting a consistent set of hashes. In the spirit of keeping it simple, I am just going to change the timestamp to a constant value '2014-03-07 23:59:59 -0800'. This may seem hacky, and it is. :)


{% highlight ruby %}
class CustomSourceControl
  ...
  def write_metadata(manifest_hash = nil)
    File.open(File.join('.esc', '__metadata__'), 'w') do |file|
      file.puts "Snapshot Manifest: #{manifest_hash}"
      file.puts "Snapshot Parent:   #{(head_contents.empty?) ? 'root' : head_contents}"
      file.puts "Snapshot Taken:    #{'2014-03-07 23:59:59 -0800' || Time.now}"
    end
  end
  ...
end
{% endhighlight %}

This time, our consistent hash is `3b9158d6cd90b07811496330d873d8a71651cd8b`.

{% highlight text %}
Snapshot Manifest: fba7362f34266e6d491c48396f936a8ed4bc5c72
Snapshot Parent:   root
Snapshot Taken:    2014-03-03 23:59:59 -0800
{% endhighlight %}

We can remove the `suspends the test so we can inspect the .esc directory` test.

{% highlight ruby %}
    ...
    it 'copies files from the manifest into the current working directory' do
      @csc.checkout '3b9158d6cd90b07811496330d873d8a71651cd8b'
      restored_hash = @csc.hash_for_file 'test_file_2.txt'
      restored_hash.must_equal '5d3140359919315ea06e3755cdc81860e9d7c556'
    end
    ...
{% endhighlight %}

You know the drill by now.

_(retest)_

{% highlight text %}
..E...........

Finished tests in 0.052594s, 266.1901 tests/s, 380.2715 assertions/s.

  1) Error:
test_0001_copies files from the manifest into the current working directory(CustomSourceControl::when we checkout a previous snapshot):
NoMethodError: undefined method `checkout' for #<CustomSourceControl:0x007feb59034bb0>
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def checkout(snapshot = nil)
  end
  ...
end
{% endhighlight %}

_(retest)_

{% highlight text %}
..F...........

Finished tests in 0.056402s, 248.2181 tests/s, 372.3272 assertions/s.

  1) Failure:
test_0001_copies files from the manifest into the current working directory(CustomSourceControl::when we checkout a previous snapshot) [custom_source_control.rb:274]:
--- expected
+++ actual
@@ -1 +1 @@
-"5d3140359919315ea06e3755cdc81860e9d7c556"
+"89cdd7bfa8c31d8a23a61d6b695b762c7f588bee"
{% endhighlight %}

{% highlight ruby %}
class CustomSourceControl
  ...
  def checkout(snapshot = nil)
    manifest_hash = ''
    File.open(File.join('.esc', snapshot), 'r') do |file|
      file.readlines.each do |entry|
        manifest_hash = $1 if entry =~ /Snapshot Manifest: (\w{40})/
      end
    end

    entries = []
    File.open(File.join('.esc', manifest_hash), 'r') do |file|
      file.readlines.each do |entry|
        entry =~ /(.*?) => (.*?) \(new\)\n?/
        entries << { :hash => $1, :pathname => $2 } if $1
      end
    end
    entries.each do |entry|
      copy_entry_to_working_directory entry
    end
  end
  ...
  def copy_entry_to_working_directory(entry)
    FileUtils.cp(File.join('.esc', entry[:hash]), entry[:pathname], { :preserve => true })
  end
  ...
end
{% endhighlight %}

Here we're reading the metadata file and getting manifest hash. Then we're reading the manifest file and breaking down the entries again, this time calling `copy_entry_to_working_directory` method to copy the files from the repository to the current working directory.

_(retest)_

{% highlight text %}
..E...........

Finished tests in 0.041946s, 333.7625 tests/s, 476.8035 assertions/s.

  1) Error:
test_0001_copies files from the manifest into the current working directory(CustomSourceControl::when we checkout a previous snapshot):
Errno::ENOENT: No such file or directory - .esc/3b9158d6cd90b07811496330d873d8a71651cd8b
{% endhighlight %}

Ugh... another issue with the hashing. Not so much the hashing actually, but the fact that we're editing the very file we're trying to code/test `custom_source_control.rb`. This test can never pass. So what are, our options? Well, the first that comes to mind is to just run the script from another directory. We can do this by adding the directory we're working in to our path. This actually would've solved an issue we faced earlier as well. However, I tried to avoid it to keep things simple.

First, let's skip the current failing test.

_(retest)_

{% highlight text %}
..S...........

Finished tests in 0.115535s, 121.1754 tests/s, 173.1077 assertions/s.
{% endhighlight %}

Ok, we're passing again so we can restructure a bit. Let's get the current working directory.

{% highlight shell-session %}
pwd
{% endhighlight %}

{% highlight text %}
/Users/mattweppler/developer/projects/custom_source_control
{% endhighlight %}

Now let's add it to our path so we can execute it from a different directory. We can even bring our command a little closer to the command Jim Weirich mentions: `csc`, by creating a symlink. Create a new directory (it can even be within the current directory), I am calling it `test_dir`. Then, let's move the test files into the `test_dir` and change into that directory.

{% highlight shell-session %}
export PATH=$PATH:/Users/mattweppler/developer/projects/custom_source_control
ln -s $HOME/developer/projects/custom_source_control/custom_source_control.rb $HOME/developer/projects/custom_source_control/csc
mkdir test_dir
mv test_file_* test_dir
cd test_dir
{% endhighlight %}

Some of our tests will fail since I did a few _hackish_ things here and there. Again, I was trying to cut down on the amount of possible new concepts. Oh well... Rerun the tests and let's see what we get.

{% highlight shell-session %}
csc
{% endhighlight %}

_(retest)_

{% highlight text %}
..S....F.E....

Finished tests in 0.178928s, 78.2438 tests/s, 106.1880 assertions/s.

  1) Failure:
test_0003_gets_a_list_of_files_in_the_current_working_directory(CustomSourceControl::when we take a snapshot) [/Users/mattweppler/developer/projects/custom_source_control/csc:218]:
--- expected
+++ actual
@@ -1 +1 @@
-["custom_source_control.rb", "test_file_1.txt", "test_file_2.txt"]
+["test_file_1.txt", "test_file_2.txt"]


  2) Error:
test_0007_adds_entries_to_the_manifest_file(CustomSourceControl::when we take a snapshot):
NoMethodError: undefined method `chomp' for nil:NilClass
    /Users/mattweppler/developer/projects/custom_source_control/csc:245:in `block (3 levels) in <main>'
{% endhighlight %}

Ok so what are we working with here. Well we no longer need to account for the custom_source_control.rb file. Let's go update that. So this:

{% highlight ruby %}
    ...
    it 'gets a list of files in the current working directory' do
      @csc.cwd_files.must_equal ['custom_source_control.rb', 'test_file_1.txt', 'test_file_2.txt']
    end
    ...
{% endhighlight %}

becomes this:

{% highlight ruby %}
    ...
    it 'gets a list of files in the current working directory' do
      @csc.cwd_files.must_equal ['test_file_1.txt', 'test_file_2.txt']
    end
    ...
{% endhighlight %}

We can also remove the `keep_if`'s since we were trying to guard against anything but our control files (`test_file_1.txt`, `test_file_2.txt`). So this:

{% highlight ruby %}
    ...
    it 'creates a file hash for all files in the current working directory' do
      actual_hashes = {
        'test_file_1.txt' => 'bb4d8995cfa843effc83d6ddcea1a8351c09497f',
        'test_file_2.txt' => '5d3140359919315ea06e3755cdc81860e9d7c556'
      }
      expected_hashes = @csc.cwd_hashes.keep_if { |key, value| key == 'test_file_1.txt' || key == 'test_file_2.txt' }
      expected_hashes.must_equal actual_hashes
    end
    ...
{% endhighlight %}

becomes this:

{% highlight ruby %}
    ...
    it 'creates a file hash for all files in the current working directory' do
      actual_hashes = {
        'test_file_1.txt' => 'bb4d8995cfa843effc83d6ddcea1a8351c09497f',
        'test_file_2.txt' => '5d3140359919315ea06e3755cdc81860e9d7c556'
      }
      @csc.cwd_hashes.must_equal actual_hashes
    end
    ...
{% endhighlight %}

and this:

{% highlight ruby %}
    ...
    it 'returns a list of new and existing files' do
      deltas = @csc.deltas
      deltas[:new].keep_if { |key, value| key == 'test_file_1.txt' || key == 'test_file_2.txt' }
      deltas[:new].must_equal ['test_file_1.txt', 'test_file_2.txt']
      deltas[:existing].must_equal []
    end
    ...
{% endhighlight %}

becomes this:

{% highlight ruby %}
    ...
    it 'returns a list of new and existing files' do
      deltas = @csc.deltas
      deltas[:new].must_equal ['test_file_1.txt', 'test_file_2.txt']
      deltas[:existing].must_equal []
    end
    ...
{% endhighlight %}

Lastly this:

{% highlight ruby %}
    ...
    it 'adds entries to the manifest file' do
      expected_content = %Q{5d3140359919315ea06e3755cdc81860e9d7c556 => test_file_2.txt (new)\nbb4d8995cfa843effc83d6ddcea1a8351c09497f => test_file_1.txt (new)}
      @csc.manifest_contents.gsub!(/.*? => custom_source_control\.rb \(new\)\n?/, '').chomp.must_equal expected_content
    end
    ...
{% endhighlight %}

becomes this:

{% highlight ruby %}
    ...
    it 'adds entries to the manifest file' do
      expected_content = %Q{5d3140359919315ea06e3755cdc81860e9d7c556 => test_file_2.txt (new)\nbb4d8995cfa843effc83d6ddcea1a8351c09497f => test_file_1.txt (new)}
      manifest_contents = @csc.manifest_contents
      if manifest_contents =~ /.*? => custom_source_control\.(?:md|rb) \(new\)\n?/
        manifest_contents.gsub!(/.*? => custom_source_control\.(?:md|rb) \(new\)\n?/, '').chomp.must_equal expected_content
      else
        manifest_contents.chomp.must_equal expected_content
      end
    end
    ...
{% endhighlight %}

_(retest)_

{% highlight text %}
..S...........

Finished tests in 0.032450s, 431.4330 tests/s, 616.3328 assertions/s.
{% endhighlight %}

...and we're back to passing! Let's remove that skip statement and continue working on that last test. If you recall, we need to suspend the test long enough so that we can go through the metadata files and get our root snapshot.

For me, that hash is `485ac882b4e89e929584acdfed522499f0a45464`. With that let's update the test and run it.

{% highlight ruby %}
    ...
    it 'copies files from the manifest into the current working directory' do
      @csc.checkout '485ac882b4e89e929584acdfed522499f0a45464'
      restored_hash = @csc.hash_for_file 'test_file_2.txt'
      restored_hash.must_equal '5d3140359919315ea06e3755cdc81860e9d7c556'
    end
    ...
{% endhighlight %}

For the win...

_(retest)_

{% highlight text %}
..............

Finished tests in 0.040760s, 343.4740 tests/s, 515.2110 assertions/s.
{% endhighlight %}

We... are... passing! Good job! I really enjoyed writing this post. I hope this was helpful for you. Just a few last things before you go.

__How do I use this thing now that it's built?__

Well, while we have the methods to handle some of the functionality, we haven't added the ability to pass arguments on the command line. You can add something very simple like the following code:

First change the `require 'minitest/autorun'` to `require 'minitest/spec'` and add the following to the bottom of the file.

{% highlight ruby %}
...
def main
  unless ['initialize', 'snapshot', 'checkout'].include? ARGV[0]
    puts "#{ARGV[0]} is not a subcommand."
    exit 1
  end

  csc = CustomSourceControl.new
  case ARGV[0]
  when 'initialize'
    csc.initialize_repository
  when 'snapshot'
    csc.snapshot
  when 'checkout'
    if ARGV[1]
      csc.checkout ARGV[1]
    else
      puts "'checkout' subcommand takes a second argument, SHA1 of the metadata file to checkout."
      exit 1
    end
  end
end

main if __FILE__ == $0
{% endhighlight %}

You would then be able to call it from the command line like this:

{% highlight shell-session %}
csc initialize
{% endhighlight %}

{% highlight text %}
tree
.
├── .esc/
│   └── HEAD
├── test_file_1.txt
└── test_file_2.txt
{% endhighlight %}

{% highlight shell-session %}
csc snapshot
{% endhighlight %}

{% highlight text %}
tree
.
├── .esc/
│   ├── 485ac882b4e89e929584acdfed522499f0a45464
│   ├── 5d3140359919315ea06e3755cdc81860e9d7c556
│   ├── 74aec4d0ab199369fc8fe3fd38a9e1459678b2ea
│   ├── HEAD
│   ├── __manifest__
│   ├── __metadata__
│   └── bb4d8995cfa843effc83d6ddcea1a8351c09497f
├── test_file_1.txt
└── test_file_2.txt
{% endhighlight %}

{% highlight shell-session %}
cat > test_file_3.txt
{% endhighlight %}

{% highlight text %}
this is test_file_3.text
{% endhighlight %}

{% highlight shell-session %}
cat >> test_file_2.txt
{% endhighlight %}

{% highlight text %}
this is an update to test_file_2.text
{% endhighlight %}

{% highlight shell-session %}
cat test_file_2.txt
{% endhighlight %}

{% highlight text %}
this is test_file_2.text
this is an update to test_file_2.text
{% endhighlight %}

{% highlight shell-session %}
tree
{% endhighlight %}

{% highlight text %}
.
├── .esc/
│   ├── 485ac882b4e89e929584acdfed522499f0a45464
│   ├── 5d3140359919315ea06e3755cdc81860e9d7c556
│   ├── 74aec4d0ab199369fc8fe3fd38a9e1459678b2ea
│   ├── HEAD
│   ├── __manifest__
│   ├── __metadata__
│   └── bb4d8995cfa843effc83d6ddcea1a8351c09497f
├── test_file_1.txt
├── test_file_2.txt
└── test_file_3.txt
{% endhighlight %}

{% highlight shell-session %}
csc snapshot
{% endhighlight %}

{% highlight shell-session %}
tree
{% endhighlight %}

{% highlight text %}
.
├── .esc/
│   ├── 485ac882b4e89e929584acdfed522499f0a45464
│   ├── 5d3140359919315ea06e3755cdc81860e9d7c556
│   ├── 6ace300838a9818ec987a0e483b7a3ae598afe7f
│   ├── 74aec4d0ab199369fc8fe3fd38a9e1459678b2ea
│   ├── 89cdd7bfa8c31d8a23a61d6b695b762c7f588bee
│   ├── HEAD
│   ├── __manifest__
│   ├── __metadata__
│   ├── bb4d8995cfa843effc83d6ddcea1a8351c09497f
│   ├── bdb94f80a11a03f2f739faa297b3dc219df93e0c
│   └── e9e0ddd6a9d8f998c41fb83978942e1021f21cac
├── test_file_1.txt
├── test_file_2.txt
└── test_file_3.txt
{% endhighlight %}

{% highlight shell-session %}
cat test_file_2.txt
{% endhighlight %}

{% highlight text %}
this is test_file_2.text
this is an update to test_file_2.text
{% endhighlight %}

{% highlight shell-session %}
cat .esc/HEAD
{% endhighlight %}

{% highlight text %}
e9e0ddd6a9d8f998c41fb83978942e1021f21cac
{% endhighlight %}

{% highlight shell-session %}
cat .esc/e9e0ddd6a9d8f998c41fb83978942e1021f21cac
{% endhighlight %}

{% highlight text %}
Snapshot Manifest: bdb94f80a11a03f2f739faa297b3dc219df93e0c
Snapshot Parent:   485ac882b4e89e929584acdfed522499f0a45464
Snapshot Taken:    2014-03-07 23:59:59 -0800
{% endhighlight %}

{% highlight shell-session %}
csc checkout 485ac882b4e89e929584acdfed522499f0a45464
{% endhighlight %}

{% highlight shell-session %}
cat test_file_2.txt
{% endhighlight %}

{% highlight text %}
this is test_file_2.text
{% endhighlight %}

* You should notice the timestamp still shows `2014-03-07 23:59:59 -0800`. You can remove that line of code, but the tests will fail again.
* We don't really clean up after ourselves so that functionality needs to be added.
* Getting the checkout hash is also a manual process so that `csc log` functionality we talked about would come in handy.
* We are not handling any types of errors mind you

...so its not quite production ready.

---

__What do I do next?__

Some of the things I'd like to address in a future post include:

* Separating the tests from the actual implementation code.
* DRY'ing out our code. Many times I have had to fight the urge to do it in this post. I really wanted this information to be approachable by anyone though, so I didn't use any gems, even `minitest/given` which was created by Jim Weirich.
* Testing for more edge cases, and fixing any bugs we find.
* Adding code coverage.
* Adding the ability to handle command line arguments with `OptionParser`.
* Adding tests and functionality to diff checkins.
* Adding tests and functionality to list the history (metadata file hashes from head all the way back to root)
* Possibly turning this into a gem.

Lastly I'd like to thank a few people for helping with this post. Austin Puri, thanks for running through this as a developer and giving some great feedback. Devon Mahnken, for catching a lot of spelling and English grammar mistakes. After all your corrections, for the first time I think my father was right about me being a robot. Really appreciate the help guys!

You can double check your work with the project I have hosted on <a href="https://github.com/mweppler/custom-source-control" target="_blank">github</a>

You may have some questions that this didn't quite answer. Feel free to email me or leave a comment.
