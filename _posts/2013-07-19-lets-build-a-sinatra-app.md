---
layout: post
meta-description: Building a simple sinatra app.
meta-keywords: sinatra, haml, datamapper
preview: |
  So at this point you  might be saying “I thought this was a post about Sinatra?” or maybe I already lost a few of you. So before I lose any more of you, "Let's get the [[show]] on the road!".
syntax-highlighting: true
tags: [ruby, haml, sass, sinatra]
title: Lets Build a Sinatra App
---

# Lets Build a Sinatra App


<a href="http://rubyweekly.com/archive/156.html" target="_blank" title="Issue #156 of Ruby Weekly">Featured in issue #156 of Ruby Weekly.</a>

Lets talk a little bit about my motivation for this article. Frustration... Frustration with what you ask? Apple TV, AirPlay & watching videos from my library. Normally when I think apple, I think: beauty, simplicity, it just works... You know, the same things that come to mind when anyone thinks of apple. I also love watching Seinfeld before I hit the sack. Its how I switch gears from mad coder to heavy sleeper.

My setup is pretty simple, all my videos are stored on my time capsule. I have a Mac mini with iTunes. I connect via my iPad that sits on my nightstand. Everything has been amazing, that is, until a few months ago. I don’t know what changed but one night I fired up the videos app on my iPad, and waited for it to find the Mac mini library. It didnt... So I get up, go to the Mac mini and make sure it is connected to the network and to the shared drive. Try again, it works. I’d keep running into the same issue every night though. I mean, what good is it if it doesn’t just work? amirite?

So at this point you  might be saying “I thought this was a post about Sinatra?” or maybe I already lost a few of you. So before I lose any more of you, "Let's get the show on the road!".

I have to make a few assumptions here in order to keep this a blog post. One is that you know what Sinatra is. If you don't I'll borrow this brief quote from the <a href="http://sinatrarb.com" target="_blank" title="Sinatra Site">Sinatra</a> site: "Sinatra is a DSL for quickly creating web applications in Ruby with minimal effort". The next assumption I am going to make is that you are already a developer and just want a quick jumpstart in building your first sinatra app. So you should already have ruby installed on your machine.

I'll start by modeling the app a bit. For now just the basics. I am going to have a video object with fields like title, length, description, image & genre. I'll need a storage location. I’ll need a way to add this info about the video, upload the video, and watch it, especially on my iPad.

A few things to note, I am developing and running this from my Mac. I believe everything should work just the same on Linux, though I'm not so sure about Windows. I will be using <a href="http://haml.info/" target="_blank" title="HAML Site">haml</a> for the markup. So instead of having to type out this:

{% highlight html %}
<section class=”container”>
  <h1><%= post.title %></h1>
  <h2><%= post.subtitle %></h2>
  <div class=”content”>
    <%= post.content %>
  </div>
</section>
{% endhighlight %}

we can just type this:

{% highlight ruby %}
%section.container
  %h1= post.title
  %h2= post.subtitle
  .content
    = post.content
{% endhighlight %}

Time to kick things off, we need to open terminal and install a few things. If you're not comfortable on the commandline I'd suggest you read up on basics. You should still be able to follow along, but if your goal is to be a developer you should really have a basic understanding. If you have a few hours and about $24, a great resource is the "Meet the Command Line" videos over at <a href="http://peepcode.com/" target="_blank" title="PeepCode">PeepCode</a>.

    https://peepcode.com/products/meet-the-command-line
    https://peepcode.com/products/advanced-command-line

Now we're going to put the app structure and basic setup in place. From a directory that makes sense (in my case I have a /Users/mweppler/developer/projects directory that I keep all my projects in) run the following:

    mkdir -p the-video-store the-video-store/public the-video-store/public/images the-video-store/public/javascripts the-video-store/public/media/image the-video-store/public/media/video the-video-store/public/stylesheets the-video-store/views the-video-store/media/image the-video-store/media/video

    touch the-video-store/config.ru the-video-store/config.yml the-video-store/Gemfile the-video-store/video_store.rb the-video-store/views/index.haml the-video-store/views/layout.haml

You should now have the following structure:

    .
    ├── media/
    │   ├── image/
    │   └── video/
    ├── public/
    │   ├── images/
    │   ├── javascripts/
    │   ├── media/
    │   │   ├── image/
    │   │   └── video/
    │   └── stylesheets/
    ├── views/
    │   ├── index.haml
    │   └── layout.haml
    ├── Gemfile
    ├── config.ru
    ├── config.yml
    └── video_store.rb

    11 directories, 6 files

Raise your hand if you know what a "Gemfile" is. Ok now put your hand down. Since I couldn't see if you had your hand raised or not I'll just assume you did and proceed with adding some gems to our Gemfile. Note: If you don't know what a gem file is you've got some more reading to do pal. Start by checking out the <a href="http://bundler.io/" target="_blank" title="Bundler Site">Bundler</a> site.

{% highlight ruby %}
source "https://rubygems.org"

gem 'capistrano', '2.14.2'
gem 'data_mapper', '1.2.0'
gem 'dm-core', '1.2.0'
gem 'dm-sqlite-adapter', '1.2.0'
gem 'dm-timestamps', '1.2.0'
gem 'haml', '3.1.7'
gem 'sass', '3.2.1'
gem 'shotgun', '0.9'
gem 'sinatra', '1.3.5'
gem 'sqlite3', '1.3.7'
{% endhighlight %}

...and from the commandline, run bundler:

    bundle install

I want to get this basic app up and running quickly so we can iterate through the functionality. Normally I'd suggest you follow TDD/BDD practices but for something this basic I want to focus on sinatra. Add the following to your config.ru file:

{% highlight ruby %}
require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'haml'
require './video_store'

set :environment, :development
set :run, false
set :raise_errors, true

run Sinatra::Application
{% endhighlight %}

I am going to create a config file to store things like the media location, and supported file types:

{% highlight ruby %}
file_properties:
  image:
    absolute_path: 'media/image'
    link_path:     'public/media/image'
  video:
    absolute_path: 'media/video'
    link_path:     'public/media/video'
supported_mime_types:
  - extension:     'jpeg'
    mime_type:     'image/jpeg'
    type:          'image'
  - extension:     'jpg'
    mime_type:     'image/jpeg'
    type:          'image'
  - extension:     'm4v'
    mime_type:     'video/mv4'
    type:          'video'
  - extension:     'mov'
    mime_type:     'video/quicktime'
    type:          'video'
  - extension:     'mp4'
    mime_type:     'video/mp4'
    type:          'video'
  - extension:     'png'
    mime_type:     'image/png'
    type:          'image'
{% endhighlight %}

Before we can use some of these gems we'll have to require them. In our main app file video_store.rb add the following:

{% highlight ruby %}
require 'data_mapper'
require 'dm-core'
require 'dm-migrations'
require 'dm-sqlite-adapter'
require 'dm-timestamps'
require 'ostruct'


class Hash
  def self.to_ostructs(obj, memo={})
    return obj unless obj.is_a? Hash
    os = memo[obj] = OpenStruct.new
    obj.each { |k,v| os.send("#{k}=", memo[v] || to_ostructs(v, memo)) }
    os
  end
end

$config = Hash.to_ostructs(YAML.load_file(File.join(Dir.pwd, 'config.yml')))
{% endhighlight %}

What is that "Hash" stuff above? Well the short answer is: It enables us to easily turn the config file settings into Objects. That allows us to use syntax like this:

{% highlight ruby %}
$config.file_properties.video.link_path
{% endhighlight %}

Instead of this:

{% highlight ruby %}
$config['file_properties']['video']['link_path']
{% endhighlight %}

Note: this is just a preference of mine.

The database and DataMapper. Now lets add the sqlite database:

{% highlight ruby %}
configure do
  DataMapper::setup(:default, File.join('sqlite3://', Dir.pwd, 'development.db'))
end
{% endhighlight %}

Our video class is going to need access to some DataMapper methods so well need to include it in our models:

{% highlight ruby %}
class Video
  include DataMapper::Resource

  has n, :attachments

  property :id,           Serial
  property :created_at,   DateTime
  property :description,  Text
  property :genre,        String
  property :length,       Integer
  property :title,        String
  property :updated_at,   DateTime
end
{% endhighlight %}

That was easy! Our attachment class will have a bit more logic in it since it will handle the file uploads:

{% highlight ruby %}
class Attachment
  include DataMapper::Resource

  belongs_to :video

  property :id,         Serial
  property :created_at, DateTime
  property :extension,  String
  property :filename,   String
  property :mime_type,  String
  property :path,       Text
  property :size,       Integer
  property :updated_at, DateTime

  def handle_upload(file)
    self.extension = File.extname(file[:filename]).sub(/^\./, '').downcase
    supported_mime_type = $config.supported_mime_types.select { |type| type['extension'] == self.extension }.first
    return false unless supported_mime_type

    self.filename  = file[:filename]
    self.mime_type = file[:type]
    self.path      = File.join(Dir.pwd, $config.file_properties.send(supported_mime_type['type']).absolute_path, file[:filename])
    self.size      = File.size(file[:tempfile])
    File.open(path, 'wb') do |f|
      f.write(file[:tempfile].read)
    end
    FileUtils.symlink(self.path, File.join($config.file_properties.send(supported_mime_type['type']).link_path, file[:filename]))
  end
end
{% endhighlight %}

Now that we've declared our models, we have to "finalize" them and create the tables. We do that with the block of code below:

{% highlight ruby %}
configure :development do
  DataMapper.finalize
  DataMapper.auto_upgrade!
end
{% endhighlight %}

We need to set the content type header to "text/html" in order for the page to render correctly in the browser. So add the following:

{% highlight ruby %}
# set utf-8 for outgoing
before do
  headers "Content-Type" => "text/html; charset=utf-8"
end
{% endhighlight %}

Up to this point, we've been adding a bunch of "backend" code. Now we are going to start write code that we can actually see in the web browser. So we'll create our initial route:

{% highlight ruby %}
get '/' do
  @title = 'The Video Store'
  haml :index
end
{% endhighlight %}

This tells sinatra that if the user visits our site http://localhost:9393/ we want to render the index view. Lets add some text to our index view. Open views/index.haml and add the following:

{% highlight ruby %}
%h1 Welcome to the Video Store
{% endhighlight %}

I want to finish off this first sprint by building out our layout:

{% highlight ruby %}
!!! 5
%html{:lang => "en"}
  %head
    %meta{"http-equiv" => "X-UA-Compatible", :content => "IE=edge,chrome=1" }
    %meta{ :charset => "utf-8" }
    %title= @title || 'The Video Store'
  %body
    .container
      = yield
{% endhighlight %}

All of our views will be inserted inside this layout with the yield statement. That was a lot of work! Where is the payoff? Just run the following:

    bundle exec shotgun

...and open <a href="http://localhost:9393/" target="_blank">http://localhost:9393/</a>

This step is optional, but I think we should put the project under version control:

    touch .gitignore

In this .gitignore I add the following lines:

    development.db
    /media
    /public/media

...and commit

    git init
    git add .
    git commit -m "Initial commit"

Yay! Take one hand and put it way up in the air. Now with your other hand give yourself a big high five!

Ok, lets not marvel at the wonder of the h1 welcoming us. No, lets push ourselves a bit further. Lets add the ability to actually upload a movie. So lets create another route:

{% highlight ruby %}
post '/video/create' do
  video            = Video.new(params[:video])
  image_attachment = video.attachments.new
  video_attachment = video.attachments.new
  image_attachment.handle_upload(params['image-file'])
  video_attachment.handle_upload(params['video-file'])
  if video.save
    @message = 'Video was saved.'
  else
    @message = 'Video was not saved.'
  end
  haml :create
end

get '/video/new' do
  @title = 'Upload Video'
  haml :new
end
{% endhighlight %}

Now lets create the view which is basically a form. Within the views directory create a file 'new.haml' and add the following:

{% highlight ruby %}
%h1= @title
%form#video-form{ :action => "/video/create", :method => "post", :enctype => "multipart/form-data" }
  %label Title:
  %input#title{ :type => "text", :name => "video[title]" }
  %label Description:
  %input#description{ :type => "text", :name => "video[description]" }
  %label Genre:
  %input#genre{ :type => "text", :name => "video[genre]" }
  %label Length:
  %input#length{ :type => "text", :name => "video[length]" }
  %label Image:
  %input#image-file{ :type => "file", :name => "image-file" }
  %label Video:
  %input#video-file{ :type => "file", :name => "video-file" }
  %input{ :type => "submit" }
{% endhighlight %}

Create another view to show our success message 'create.haml' and add a simple:

{% highlight ruby %}
%h1= @message
{% endhighlight %}

Fire it up with good ol 'bundle exec shotgun' and test. Works for me! Lets commit.

Before I go any further I'd like to add a touch of style to the video store. So lets add our application stylesheet:

    touch public/stylesheets/application.css

I also was looking to try <a href="http://purecss.io/" target="_blank" title="Yahoo! Pure">Yahoo! Pure</a> so lets do that now. So I am going to refactor the layout.haml file a bit:

{% highlight ruby %}
!!! 5
%html{:lang => "en"}
  %head
    %meta{"http-equiv" => "X-UA-Compatible", :content => "IE=edge,chrome=1" }
    %meta{ :charset => "utf-8" }
    %title= @title || 'The Video Store'
    %link{ :rel => "stylesheet", :href => "http://yui.yahooapis.com/combo?pure/0.2.0/base-min.css&pure/0.2.0/grids-min.css&pure/0.2.0/forms-min.css&pure/0.2.0/buttons-min.css&pure/0.2.0/menus-min.css&pure/0.2.0/tables-min.css" }
    %link{ :rel => "stylesheet", :href => "/stylesheets/application.css" }
  %body
    .container
      .nav
        .pure-menu.pure-menu-open.pure-menu-horizontal
          %ul
            %li
              %a{ :href => "/" } Home
            %li.pure-menu-selected
              %a{ :href => "/video/new" } Upload Video
      .main
        = yield
{% endhighlight %}

I added the links to both our application.css file and the pruecss file, also a nav and main section. Looks pretty good, but I want to center the page in a 960px container. So in application.css add the following:

{% highlight css %}
body { width: 100%; }
.container { margin: 0 auto; max-width: 960px; }
{% endhighlight %}

Now lets clean up the upload form. Update the new.haml file with:

{% highlight ruby %}
%form#video-form.pure-form.pure-form-aligned{ :action => "/video/create", :method => "post", :enctype => "multipart/form-data" }
  %fieldset
    %legend= @title
    .pure-control-group
      %label Title:
      %input#title{ :type => "text", :name => "video[title]" }

    .pure-control-group
      %label Description:
      %textarea#description{ :name => "video[description]" }

    .pure-control-group
      %label Genre:
      %input#genre{ :type => "text", :name => "video[genre]" }

    .pure-control-group
      %label Length:
      %input#length{ :type => "text", :name => "video[length]" }

    .pure-control-group
      %label Image:
      %input#image-file{ :type => "file", :name => "image-file" }

    .pure-control-group
      %label Video:
      %input#video-file{ :type => "file", :name => "video-file" }

    .pure-controls
      %button.pure-button.pure-button-primary{ :type => "submit" } Submit
{% endhighlight %}

![New/Upload View](/img/for-posts/lets-build-a-sinatra-app/new-view.png "New/Upload View")

Now that that's out of the way lets add a way to view videos that we've uploaded. In other words lets add a /video/list route in video_store.rb:

{% highlight ruby %}
get '/video/list' do
  @title = 'Available Videos'
  @videos = Video.all(:order => [:title.desc])
  haml :list
end
{% endhighlight %}

...and list view:

    touch views/list.haml

...and lets add a link to it in our layout.haml:

{% highlight ruby %}
%li.pure-menu-selected
  %a{ :href => "/video/list" } Available Videos
{% endhighlight %}

Make this list.haml view pretty:

{% highlight ruby %}
%h1= @title
%table.pure-table
  %thead
    %tr
      %td Title
      %td Length
      %td Description
      %td Genre
  %tbody
    - @videos.each do |video|
      %tr
        %td= video.title
        %td= video.length
        %td= video.description
        %td= video.genre
{% endhighlight %}

![List View](/img/for-posts/lets-build-a-sinatra-app/list-view.png "List View")

Ok, one last step. Lets add a way to get all the video details as well as an option to watch them! So lets add the route in video_store.rb:

{% highlight ruby %}
get '/video/show/:id' do
  @video = Video.get(params[:id])
  @title = @video.title
  if @video
    haml :show
  else
    redirect '/video/list'
  end
end
{% endhighlight %}

...and we'll add a link in the list view list.haml. We'll make the title the link element so update the code:

{% highlight ruby %}
%td= video.title
{% endhighlight %}

to:

{% highlight ruby %}
%td
  %a{ :href => "/video/show/#{video.id}" }= video.title
{% endhighlight %}

...and we'll need the show.haml view:

    touch views/show.haml

For now we're just going to add the same elements from the list view, only we'll remove the each iterator. So open views/show.haml:

{% highlight ruby %}
%h1= @title
%table.pure-table
  %thead
    %tr
      %td Title
      %td Length
      %td Description
      %td Genre
  %tbody
    %tr
      %td= @video.title
      %td= @video.length
      %td= @video.description
      %td= @video.genre
{% endhighlight %}

...and add a watch link. Wait a watch link? Yeah a watch link:

{% highlight ruby %}
%td
  %a{ :href => "#" } Watch
{% endhighlight %}

So does this mean we're going to need a route and view as well? Umm, yeah sure. Can you handle that?

{% highlight ruby %}
%td
  %a{ :href => "/video/watch/#{@video.id}" } Watch
{% endhighlight %}

![Show View](/img/for-posts/lets-build-a-sinatra-app/show-view.png "Show View")

So thats the link. What about the route:

{% highlight ruby %}
get '/video/watch/:id' do
  video = Video.get(params[:id])
  if video
    @videos = {}
    video.attachments.each do |attachment|
      supported_mime_type = $config.supported_mime_types.select { |type| type['extension'] == attachment.extension }.first
      if supported_mime_type['type'] === 'video'
        @videos[attachment.id] = { :path => File.join($config.file_properties.video.link_path['public'.length..-1], attachment.filename) }
      end
    end
    if @videos.empty?
      redirect "/video/show/#{video.id}"
    else
      @title = "Watch #{video.title}"
      haml :watch
    end
  else
    redirect '/video/list'
  end
end
{% endhighlight %}

...and the view:

    touch views/watch.haml

...and we make it look nice (but not really...):

{% highlight ruby %}
%h1= @title
%video{ :src => @videos.values[0][:path], :controls => 'controls' }
  Your browser does not support the <code>video</code> element.
{% endhighlight %}

![Watch View](/img/for-posts/lets-build-a-sinatra-app/watch-view.png "Watch View")

Wow that was a lot of work. Its time for another high five and commit! It's also time for me to cut the cord, or kick you out of the nest. Get some copy/paste action going on, and add in a touch of google. I think you can take it from here and continue building on top of this project.

You can double check your work with the project I have hosted on <a href="https://github.com/mweppler/the-video-store" target="_blank" title="The Video Store - on GitHub">github</a>
