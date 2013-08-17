---
layout: post
meta-description:
meta-keywords:
preview: |
  Ran into this issue today with a site I am developing. Read through a lot of posts, on a lot of different sites. Steps I’ve tried include
title: Drupal – HTTP Error 0 when uploading files
---
# Drupal – HTTP Error 0 when uploading files

Ran into this issue today with a site I am developing. Read through a lot of posts, on a lot of different sites. Steps I’ve tried include:  

1. Fixed write permissions on /tmp and sites/default/files  
2. Install and enable pecl upload progress  
3. Disable/Re-Enable IMCE &amp; IMCE Wysiwyg API bridge module  
4. memory_limit already set to 512M  
5. Installed the <a href="http://drupal.org/project/jquery_update" target="_blank" title="jquery update module">jquery update module</a>  
6. Replaced jquery.form.js  
7. Set the value of baseurl in settings.php  
8. Modified vhost file ServerName  
9. Last but not least...  

I downloaded filefield-6.x-3.0-alpha2 and replaced filefield-6.x-3.9. Ran into 2 undefined functions:  

{% highlight php %}
theme_filefield_widget()
field_file_urlencode_path()
{% endhighlight %}

copy/pasted from them from the corresponding filefield-6.x-3.9 files. Everything is running fine so far. The real test is in the morning when the rest of the developers are working on the site.
