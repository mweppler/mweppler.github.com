---
layout: post
meta-description: "Custom Source Control: Code Coverage"
meta-keywords: code coverage, custom source control, git, minitest, ruby, ruby command line application, scm, tdd, test driven development
preview: |
  This is a continuation of my last post on implementing a "refactoring the custom source control" application in ruby. In that post we built a custom source control application...
syntax-highlighting: true
tags: [cli, ruby, source-control, tdd]
title: "Custom Source Control: Code Coverage"
---

# Custom Source Control: Code Coverage

I originally started writing this post a few months ago. Unfortunitely I got wrapped up in other things and had to put this off. I don't have much to add but wanted to just wrap this up. This is a continuation of my last post on <a href="http://matt.weppler.me/2014/04/28/custom_source_control_refactoring.html" target="_blank">refactoring the custom source control</a> application in ruby. I will be working off the <a href="https://github.com/mweppler/custom-source-control" target="_blank">previous code</a>, so be sure to grab a copy if you don't already have it.

A while back, Aaron Patterson <a href="https://twitter.com/tenderlove" target="_blank">@tenderlove</a> wrote a blog post on code coverage and ruby. He wrote a very basic code coverage tool using rubys built in stuff. I can't find that post otherwise I'd link to it. I used what I learned in that post to build something to capture our code coverage in csc.

In `specs/custom_coverage.rb` add the following:

{% highlight ruby %}
require 'erb'

class CustomCoverage
  def self.build(coverages)
    _template = ERB.new template, nil, '><'
    body = coverages.map do |filename, coverage|
      source = File.readlines filename
      stats = stats(coverage)
      _template.result binding
    end
    header << body.join << footer
  end

  def self.stats(coverage)
    stats = { hits: 0, misses: 0, nils: 0 }
    coverage.each do |stat|
      if stat.nil?
        stats[:nils] += 1
      elsif stat == 0
        stats[:misses] += 1
      elsif stat >= 1
        stats[:hits] += 1
        stats
      end
    end
    stats[:coverage] = ((stats[:hits].to_f / (stats[:hits] + stats[:misses])) * 100).round(2)
    stats
  end

  def self.footer
    %q[</body>
      </html>].gsub(/^[ ]{6}/, '')
  end

  def self.header
    %q[<html>
        <head>
          <title>Custom Coverage</title>
          <style>
            .empty{background-color:#fff;}
            .hit{background-color:#cdf2cd;}
            .miss{background-color:#f7cfcf;}
            .never{background-color:#efefef;}
          </style>
        </head>
        <body style="width:960px;margin: 0 auto;padding:25px 0;">
          <h1 style="width:100%;text-align:center;">Custom Coverage</h1>].gsub(/^[ ]{6}/, '')
  end

  def self.template
    %q[<hr />
          <h2 style="text-align:center;"><%= filename %></h2>
          <h3 style="text-align:center;">Coverage: <%= stats[:coverage] %>%</h3>
          <table style="width:100%;border:1px solid #000">
            <tr>
              <th>Total Lines</th>
              <th>Relevant Lines</th>
              <th>Irrelevant Lines</th>
              <th>Covered Lines</th>
              <th>Missed Lines</th>
            </tr>
            <tr>
              <td style="text-align:center;"><%= stats[:hits] + stats[:misses] + stats[:nils] %></td>
              <td style="text-align:center;"><%= stats[:hits] + stats[:misses] %></td>
              <td style="text-align:center;"><%= stats[:nils] %></td>
              <td style="text-align:center;"><%= stats[:hits] %></td>
              <td style="text-align:center;"><%= stats[:misses] %></td>
            </tr>
          </table>
          <table style="width:100%;border:1px solid #000">
            <% source.zip(coverage).each_with_index do |(line, cov), idx| %>
            <% classname = cov ? (cov > 0 ? 'hit' : 'miss') : (line.chomp.empty? ? 'empty' : 'never' ) %>
            <tr class="<%= classname %>" <%= cov ? "data-hits=\"#{cov}\"" : '' %>>
              <th>
                <a name="line<%= idx + 1 %>"><%= idx + 1 %></a>
              </th>
              <td>
                <pre><%= line.chomp %></pre>
              </td>
            </tr>
            <% end %>
          </table>].gsub(/^[ ]{6}/, '')
  end
end

require 'coverage'
Coverage.start

at_exit do
  coverages = Coverage.result
  coverage = {}
  base_dir = File.expand_path(File.join(File.dirname(File.realpath(__FILE__)), '..'))
  lib_dir  = File.expand_path(File.join(base_dir, 'lib'))
  sources  = Dir.glob(File.join(lib_dir, '**', '*.rb'))
  coverages.each do |src, cov|
    if sources.include? src
      coverage[src] = cov
    end
  end

  report = CustomCoverage.build coverage

  cov_dir = File.join(base_dir, 'coverage')
  FileUtils.mkdir_p cov_dir
  File.open(File.join(cov_dir, 'index.html'), 'w') do |file|
    file.write report
  end
end
{% endhighlight %}

In `specs/helper` replace the contents with the following:

{% highlight ruby %}
require 'custom_coverage'

require 'minitest/autorun'
require 'minitest/mock'

require 'custom_source_control'
{% endhighlight %}

Now if you run it you'll get some coverage to look at.

{% highlight bash %}
$ rake test
$ open index.html
{% endhighlight %}

<a href="/custom-source-control-code-coverage-report.html" target="_blank" title="Custom Source Control: Code Coverage Report">Custom Source Control: Code Coverage Report</a>

This was a fun experiement for me. It helped me better understand `git`, touched on TDD, and now code coverage. I hope those of you reading found it useful. Feel free to leave me any comments or feedback. You can find the project on <a href="https://github.com/mweppler/custom-source-control" target="_blank">github</a>.

