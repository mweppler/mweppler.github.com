---
layout: post
meta-description:
meta-keywords:
preview: |
  I am growing more and more interested in Algorithms, and with algorithms comes Recursion or so im finding. I found source for Factorial.java and broke it down visually.
title: Recursion (via Factorial)
---
# Recursion (via Factorial)

I am growing more and more interested in Algorithms, and with algorithms comes Recursion or so im finding. I found source for Factorial.java and broke it down visually. Hope this helps anyone working with recursion for the first time.

So whats happening here:

{% highlight java %}
public static long factorial(long N) {
   if (N == 1) return 1;
   return N * factorial(N-1);
}
{% endhighlight %}

Lets say your main method looks something like this:

{% highlight java %}
public static void main(String[] args) {
   long factors = 5;
   factorial(factors);
}
{% endhighlight %}

    5 is tested and is not equal to 1 so it moves to N * factorial(N-1)
      4 is tested and is not equal to 1 so it moves to N * factorial(N-1)
        3 is tested and is not equal to 1 so it moves to N * factorial(N-1)
          2 is tested and is not equal to 1 so it moves to N * factorial(N-1)
            1 is tested and is equal to 1 so it returns 1
          (N==2) N * (factorial(N-1) returned 1) 1 = 2 and returns 2
        (N==3) N * (factorial(N-1) returned 2) 2 = 6 and returns 6
      (N==4) N * (factorial(N-1) returned 6) 6 = 24 and returns 24
    (N==5) N * (factorial(N-1) returned 24) 24 = 120 and returns 120

So:

    5*4*3*2*1 = 120

Make sense? I hope. If not feel free to comment and ill try to clear it up.
