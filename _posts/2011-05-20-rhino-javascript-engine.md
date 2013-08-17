---
layout: post
meta-description:
meta-keywords:
preview: |
  A friend of mine thinks he can beat my score on the gild.com triangle numbers challenge. His only excuse is getting rhino setup on his MacBook to test the JS. So here is a quick and dirty approach.
title: Rhino Javascript Engine
---
# Rhino Javascript Engine

A friend of mine thinks he can beat my score on the gild.com triangle numbers challenge. His only excuse is getting rhino setup on his MacBook to test the JS. So here is a quick and dirty approach.

* Grab the <a href="ftp://ftp.mozilla.org/pub/mozilla.org/js/rhino1_7R2.zip" target="_blank" title="Rhino source">Rhino source</a>.
* Un-zip/tar to a cool directory. I use: '/Users/username/Development/Tools/Rhino'
* Edit your .bash_profile file:<br>
{% highlight bash %}
export PATH=$PATH:/Users/username/Development/Tools/Rhino
alias rhino='java -jar /Users/username/Development/Tools/Rhino/js.jar'
{% endhighlight %}

{% gist 981382 %}

* Add a print statement.
{% highlight javascript %}
print(fibs(12));
{% endhighlight %}
* Run from the console using:
{% highlight bash %}
rhino fibs.js
{% endhighlight %}

Questions, Comment?

__UPDATE__

I found an issue when trying to test a js file. Because ‘rhino’ is an alias bash will not run it as a command. I found a better solution here: <a href="http://workingrhino.blogspot.com/" target="_blank">WorkingRhino</a>. Check it out, or just follow my instructions below:

* Remove the rhino alias from .bash_profile or .profile.
* Create a shell script in ‘/Users/username/Development/Tools/Rhino’ named rhino
* Copy/Paste this:
{% highlight bash %}
#!/bin/bash
dir=$(dirname $0)
export CLASSPATH=${CLASSPATH}${CLASSPATH:+:}${dir}/*
echo using CLASSPATH=$(printenv CLASSPATH) &gt; /dev/stderr
[ "$1" = "-f" ] || { RLWRAP="rlwrap -C js" ;}
exec $RLWRAP java ${JAVAOPTS} \
org.mozilla.javascript.tools.shell.Main -strict "$@"
{% endhighlight %}
* Make rhino executable with chmod u+x rhino
