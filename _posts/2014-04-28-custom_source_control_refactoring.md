---
layout: post
meta-description: "Custom Source Control: Refactoring"
meta-keywords: custom source control, git, minitest, ruby, ruby command line application, scm, tdd, test driven development
preview: |
  This is a continuation of my last post on implementing a "custom source control" application in ruby. In that post we built a custom source control application...
syntax-highlighting: true
tags: [cli, ruby, source-control, tdd]
title: "Custom Source Control: Refactoring"
---

# Custom Source Control: Refactoring

This is a continuation of my last post on implementing a <a href="http://matt.weppler.me/2014/03/08/custom_source_control.html" target="_blank">"custom source control"</a> application in ruby. In that post we built a custom source control application based on <a href="http://pragprog.com/screencasts/v-jwsceasy/source-control-made-easy" target="_blank">"Source Control Made Easy"</a> by Jim Weirich.

Before starting you may want to checkout the repository for the application on <a href="https://github.com/mweppler/custom-source-control" target="_blank">github</a>. You can then checkout the part-1-complete release. Or if you'd rather just down a zip file containing the source for <a href="https://github.com/mweppler/custom-source-control/archive/part-1-complete.zip" target="_blank">custom source control: part-1-complete</a>. Let's refactor...

Recall our initial stories from the previous post:

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

I also left you with a list of some stuff I wanted to address in future posts. Lets take another look at what I will be working on now:

* Separating the tests from the actual implementation code.
* DRY'ing out our code.

So without further ado...

## Separating the tests from the actual implementation code.

The first thing that we'll want to do is separate the tests from the application code. Start out by changing directories into the custom_source_control directory.

{% highlight shell-session %}
cd custom_source_control
{% endhighlight %}

Next lets create a directory for our code and another for our tests (which going forward I may refer to them as specs).

{% highlight shell-session %}
mkdir lib
mv custom_source_control.rb lib
{% endhighlight %}

{% highlight shell-session %}
mkdir specs
mv test_dir specs
{% endhighlight %}

Our directory structure should now look like the following:

{% highlight text %}
├── lib/
│   └── custom_source_control.rb*
└── specs/
    └── test_dir/
        ├── test_file_1.txt
        └── test_file_2.txt
{% endhighlight %}

Now we're going to create a Rake file. <a href="http://rake.rubyforge.org" target="_blank">Rake</a> is a build system that we will use from amongst other things, running our specs. I'd like to mention that Rake is another tool brought to us by Jim Weirich.

{% highlight shell-session %}
require 'rake/testtask'

Rake::TestTask.new do |t|
  t.libs << ['lib', 'specs']
  t.test_files = FileList['specs/*_spec.rb']
  t.verbose = true
end
{% endhighlight %}

So what are we doing here? Basically we are making it easy to run our specs. So we'll be able to do: `rake test` for running our tests, and something else to run the application. We're now going to create a spec helper file that will require our application code as well as the minitest library.

{% highlight shell-session %}
touch specs/helper.rb
{% endhighlight %}

{% highlight ruby %}
require 'minitest/autorun'
require 'custom_source_control'
{% endhighlight %}

Now let's move everything in `lib/custom_source_control.rb` from the `require 'minitest/autotest'` line down, to a new file `specs/custom_source_control_spec.rb`. At the top of the file we need to change the `require 'minitest/autotest'` to `require 'helper'`. We also need to change the `before` block so that as part of the testing, we change directory to the `test_dir` directory.

{% highlight ruby %}
require 'helper'

describe CustomSourceControl do
  ...
  before do
    repo_dir = File.join(File.dirname(__FILE__), 'test_dir')
    Dir.chdir repo_dir
    @csc = CustomSourceControl.new
    @csc.initialize_repository
  end
  ...
end
{% endhighlight %}

At this point we should be able to run our tests with `rake test`, and everything should be passing.


{% highlight shell-session %}
rake test
{% endhighlight %}

{% highlight text %}
# Running tests:

..............

Finished tests in 0.107780s, 129.8942 tests/s, 194.8413 assertions/s.

14 tests, 21 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}


## DRY'ing out our code.

Next up on our list... DRY or _Don't repeat yourself_, Basically where we find we have code doing a very similar job is a potential candidate. Doing a visual scan of the code and I notice a few `control_file_exists?` methods. These methods serve as a convenient way to check for the existence of some of the mandatory repository files. One way to DRY this functionality up is to use the `define_method` method.

So I start out by refactoring the `manifest_exists?` and `metadata_exists?` methods into:

{% highlight ruby %}
  ['manifest', 'metadata'].each do |ctl_file|
    define_method("#{ctl_file}_exists?") do
      File.exists? File.join('.esc', "__#{ctl_file}__")
    end
  end
{% endhighlight %}

What we're doing is creating an array taking the prefix of previous methods and iterating through that array. With each element we're passing it in as an argument to the `define_method` method. The method body should be pretty straightforward; we're doing a `File.join` on the repository directory, and the control files. Let's run our tests to make sure everything still works.

{% highlight text %}
# Running tests:

..............

Finished tests in 0.032827s, 426.4782 tests/s, 639.7173 assertions/s.

14 tests, 21 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

Why stop there? Let's add `head_exists?`.

{% highlight ruby %}
  ['__manifest__', '__metadata__', 'HEAD'].each do |ctl_file|
    define_method("#{ctl_file.downcase.gsub('_', '')}_exists?") do
      File.exists? File.join('.esc', ctl_file)
    end
  end
{% endhighlight %}

So in refactoring `head_exists?` we had to turn the array of method names into an array of filenames. This would create methods `__manifest___exists?`, `__metadata___exists?` &  `HEAD_exists?`. Which is not what we want. So we simply add a call to the `String#downcase` method which properly creates the `head_exists?` method. We also add a call to `String.gsub` to handle removing the `_`'s. The last thing is to change the `File.join` and remove the `_`'s as well.

_(retest)_

{% highlight text %}
# Running tests:

..............

Finished tests in 0.036157s, 387.2003 tests/s, 580.8004 assertions/s.

14 tests, 21 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

The next bit of code has to do with the `cwd_hashes` method.

{% highlight ruby %}
  def cwd_hashes
    sha1 = OpenSSL::Digest::SHA1.new
    hashes = {}
    cwd_files.each do |file|
      hashes[file] = sha1.hexdigest(File.read(file))
      sha1.reset
    end
    hashes
  end
{% endhighlight %}

{% highlight ruby %}
  def hash_for_file(file = nil)
    sha1 = OpenSSL::Digest::SHA1.new
    sha1.hexdigest(File.read(file))
  end
{% endhighlight %}

It instantiates a new SHA1 object, then iterates through the current working directories files and hashes them, assigning the hash to... well our hashes hash. I am tempted to refactor the code to something like the following:

{% highlight ruby %}
  def cwd_hashes
    cwd_files.inject({}) { |hash, file| hash[file] = hash_for_file(file); hash }
  end
{% endhighlight %}

Which passes our tests, but I wonder if we take a performance hit since we're now creating multiple instances of a SHA1 object. It would be nice if we could benchmark this somehow... Well we can! First let's add the following code:

{% highlight ruby %}
  def cwd_hashes
    cwd_files.inject({}) { |hash, file| hash[file] = hash_for_file(file); hash }
  end
  alias_method :refactor_cwd_hashes, :cwd_hashes

  def initial_cwd_hashes
    sha1 = OpenSSL::Digest::SHA1.new
    hashes = {}
    cwd_files.each do |file|
      hashes[file] = sha1.hexdigest(File.read(file))
      sha1.reset
    end
    hashes
  end
{% endhighlight %}

Add the following to to the bottom of the file:

{% highlight ruby %}
def benchmark_cwd_hashes
  repo_dir = File.join(File.dirname(__FILE__), '../', 'specs', 'test_dir')
  Dir.chdir repo_dir

  10000.times do |idx|
    File.open("file_#{idx}", 'w') do |f|
      f.write "I am file #{idx}"
    end
  end

  @csc = CustomSourceControl.new
  @csc.initialize_repository
  @csc.snapshot

  require 'benchmark'
  Benchmark.bmbm do |x|
    x.report("initial:")  { @csc.initial_cwd_hashes }
    x.report("refactor:") { @csc.refactor_cwd_hashes }
  end

  if Dir.exists? '.esc'
    FileUtils.rm_rf '.esc'
    FileUtils.rm Dir.glob('file_*')
  end
end

if __FILE__ == $0
  benchmark_cwd_hashes if ARGV[0] == '--benchmark'
end
{% endhighlight %}

Everything wrapping the benchmark stuff is the same setup code we're using in our tests.

Next let's add the following to our rake file:

{% highlight ruby %}
task :benchmark do
  system('ruby', "-Ilib", 'lib/custom_source_control.rb', '--benchmark', out: $stdout, err: :out)
end
{% endhighlight %}

Run it with:

{% highlight shell-session %}
rake benchmark
{% endhighlight %}

It should output results similar too:

{% highlight text %}
Rehearsal ---------------------------------------------
initial:    0.140000   0.130000   0.270000 (  0.265694)
refactor:   0.160000   0.120000   0.280000 (  0.279160)
------------------------------------ total: 0.550000sec

                user     system      total        real
initial:    0.120000   0.120000   0.240000 (  0.239919)
refactor:   0.170000   0.120000   0.290000 (  0.284348)
{% endhighlight %}

As you can see, not much of a difference.

The next pieces of code are the `hash_and_copy_manifest` & `hash_and_copy_metadata` methods.

{% highlight ruby %}
  ['manifest', 'metadata'].each do |method|
    define_method("hash_and_copy_#{method}") do
      file = File.join('.esc', "__#{method}__")
      hash = hash_for_file(file)
      FileUtils.cp(file, File.join('.esc', hash))
      hash
    end
  end
{% endhighlight %}

_(retest)_

{% highlight text %}
# Running tests:

..............

Finished tests in 0.035168s, 398.0892 tests/s, 597.1338 assertions/s.

14 tests, 21 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

There is not a whole lot going on in the `initialize_repository` method, but in `snapshot` we can make a few changes.

{% highlight ruby %}
  def snapshot
    File.new(File.join('.esc', '__metadata__'), 'w')
    File.new(File.join('.esc', '__manifest__'), 'w')
    write_manifest
    ...
    write_metadata manifest_hash
    ...
  end
{% endhighlight %}

The creation of the metadata & manifest files doesn't need to happen because we do a `File.open` and write to them within the `write_manifest` & `write_metadata` methods.

{% highlight text %}
# Running tests:

..............

Finished tests in 0.053743s, 260.4990 tests/s, 390.7486 assertions/s.

14 tests, 21 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

The next thing to fix is the fact that metadata timestamp was hardcoded to `2014-03-07 23:59:59 -0800`. We can remove that line of code, but the tests will fail again. So what can we do? Stub the `Time.now` method. If you're not on ruby 2 or higher, you are going to need to take a few extra steps. Create a `Gemfile` file and add the following:

{% highlight ruby %}
source 'https://rubygems.org'
gem 'minitest'
{% endhighlight %}

{% highlight shell-session %}
bundle install
{% endhighlight %}

Now we update `helper.rb` with the following:

{% highlight ruby %}
require 'minitest/autorun'
require 'minitest/mock'
require 'custom_source_control'
{% endhighlight %}

in `custom_source_control.rb`:

{% highlight ruby %}
  def write_metadata(manifest_hash = nil)
    File.open(File.join('.esc', '__metadata__'), 'w') do |file|
      file.puts "Snapshot Manifest: #{manifest_hash}"
      file.puts "Snapshot Parent:   #{(head_contents.empty?) ? 'root' : head_contents}"
      file.puts "Snapshot Taken:    #{Time.now}"
    end
  end
{% endhighlight %}

in `custom_source_control_spec.rb`, wrap the stuff inside our `before` blocks in:

{% highlight ruby %}
    before do
      Time.stub :now, '2014-03-07 23:59:59 -0800' do
        ...
      end
    end
{% endhighlight %}

_(retest)_

{% highlight text %}
# Running:

..............

Finished in 0.046209s, 302.9713 runs/s, 454.4569 assertions/s.

14 runs, 21 assertions, 0 failures, 0 errors, 0 skips
{% endhighlight %}

---

I left off in the last post with a question: __How do I use this thing now that it's built?__. I left off with a suggestion on how to make the script runable. Now I'd like to update the script and add this functionality. Open up `custom_source_control.rb` and add the following to the very bottom.

{% highlight ruby %}
if __FILE__ == $0
  unless ['--benchmark', '--checkout', '--initialize', '--snapshot'].include? ARGV[0]
    puts "#{ARGV[0]} is not a subcommand."
    exit 1
  end

  csc = CustomSourceControl.new
  case ARGV[0]
  when '--benchmark'
    benchmark_cwd_hashes
  when '--checkout'
    if ARGV[1]
      csc.checkout ARGV[1]
    else
      puts "'checkout' subcommand takes a second argument, SHA1 of the metadata file to checkout."
      exit 1
    end
  when '--initialize'
    csc.initialize_repository
  when '--snapshot'
    csc.snapshot
  end
end
{% endhighlight %}

Lastly, what I've done is symlink the file into my `/usr/local/bin` directory as `csc`

{% highlight shell-session %}
ln -s $HOME/developer/projects/custom_source_control/lib/custom_source_control.rb /usr/local/bin/csc
export PATH=$PATH:/usr/local/bin
{% endhighlight %}

---

Still, more to do:

* We don't really clean up after ourselves so that functionality needs to be added.
* Getting the checkout hash is also a manual process so that `csc log` functionality we talked about would come in handy.
* We are not handling any types of errors mind you
* Testing for more edge cases, and fixing any bugs we find.
* Adding code coverage.
* Adding the ability to handle command line arguments with `OptionParser`.
* Adding tests and functionality to diff checkins.
* Adding tests and functionality to list the history (metadata file hashes from head all the way back to root)
* Possibly turning this into a gem.

...so, again, its not quite production ready.

You can double check your work with the project I have hosted on <a href="https://github.com/mweppler/custom-source-control" target="_blank">github</a>
