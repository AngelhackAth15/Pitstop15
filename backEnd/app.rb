require 'sinatra'
require 'shotgun' if development?
require	'redis'
require 'json'

# Init redis
redis4u = "redis://redistogo:c9b95d8f05abb5b5cdde6fdc2565e2c4@stingfish.redistogo.com:9322/"
uri = URI.parse(redis4u)
redis=Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)


# Roots
before do
   content_type :json    
   headers 'Access-Control-Allow-Origin' => '*', 
            'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']  
end

get '/' do  
	'hello'
end

get '/ping' do
	'pong'
end	

# API
get '/api/v1/get/keys/:key' do
	@key = params[:key]

	@super_key = redis.get("key:#{@key}")

	if @super_key
		content_type :json
  		{:key => @key, :value => @super_key}.to_json
	else	
		content_type :json
		status 404
  		{:message => "key not found"}.to_json
	end
end

post '/api/v1/set/keys/:key' do
  	@key = params[:key]
  	value = request.body.read

 	redis.set("key:#{@key}", value)
 	# TODO: remove expiration
	redis.expire("key:#{@key}", 3600) 				# live for 4 minutes  # 12h -> 43200, 24h -> 8640
	redis.quit  
  
	content_type :json
	  	{ :status => 200, :key => @key, :value => value }.to_json
end

get	'/api/v1/get/keys' do
	@keys = redis.keys("key*")

	# FIXME: pipeline does not work
	# res = redis.pipelined do
	#    @keys.map {|x| [x, redis.get(x)] }
	# end

	res = @keys.map {|x| [x, redis.get(x)]}

	content_type :json
		{:values => res}.to_json
end

get	'/api/v1/get/messages' do
	@keys = redis.keys("message*")
	res = redis.pipelined do
	   @keys.each do |x|
	      redis.get x
	   end
	end

	content_type :json
		{:values => res}.to_json
end

get '/api/v1/get-message/topics/:topic' do
	max_n = 10
	topic = params[:topic]

	@keys = redis.keys("message:#{topic}:*")
	res = redis.pipelined do
	    @keys.reverse.first(max_n).each do |x|
	    	redis.get x
	    end
	end

	if @keys.any?
		content_type :json
  			{:topic => topic, :values => res}.to_json
	else	
		content_type :json
			status 404
  			{:topic => "topic not found"}.to_json
	end
end	

get '/api/v1/get-message/topics/:topic/:n' do
	max_n = 10
	topic = params[:topic]
	n = params[:n].to_i

	n > max_n || n == nil ? n = max_n : n

	@keys = redis.keys("message:#{topic}:*")
	res = redis.pipelined do
	    @keys.reverse.first(n).each do |x|
	    	redis.get x
	    end
	end

	if @keys.any?
		content_type :json
  			{:topic => topic, :values => res}.to_json
	else	
		content_type :json
			status 404
  			{:topic => "topic not found"}.to_json
	end
end	

post '/api/v1/send-message/topics/:topic' do
  	@topic = params[:topic]
  	value = request.body.read

 	redis.set("message:#{@topic}:#{value}", value)
	redis.expire("message:#{@topic}:#{value}", 120) 				# live for 4 minutes  # 12h -> 43200, 24h -> 8640
	redis.quit  
  
	content_type :json
	  	{ :status => 200, :topic => @topic, :message => value }.to_json
end
