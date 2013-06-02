# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard :less, :all_on_start => true, :all_after_change => true, :output => 'css' do
  watch(%r{^.+\.less$})
end

guard :coffeescript, :output => 'js' do
  watch(%r{^js/_coffee/.+\.coffee$})
end
