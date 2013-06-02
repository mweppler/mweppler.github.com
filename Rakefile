namespace :watch do
  desc 'Watches for changes to any of the css/sass/less javascript/coffeescript and recompiles them as necessary'
  task :guard do
    system 'bundle exec guard'
  end

  desc 'Starts jekyll and serves the site on port specified in _config.yml file\nWatches for changes and regenerates the site into the _site directory'
  task :jekyll do
    system 'bundle exec jekyll serve --watch'
  end
end
