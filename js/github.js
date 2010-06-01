
function github(options){

	this.options = $.extend({
		baseurl: 'http://rest.badsyntax.co.uk/github/',
		user: ''
	}, options);

	this.data = {};
}

$.extend(github.prototype, {
	
	_get: function( url, callback ){
		
		var self = this;

		$.getJSON( url, function( data ){

			( callback ) && callback.call( self, data );
		});
	},
	
	getUserInfo: function(callback){

		var self = this;

		this._get( this.options.baseurl + 'get_user/' + this.options.user + '?jsoncallback=?', function( data ){

			self.data.userinfo = data;

			( callback ) && callback.call( self, data );
		});

		return this;
	},

	getLatestCommits: function(callback){

		var self = this;

		this._get( this.options.baseurl + 'get_latest_commits/' + this.options.user + '/30?jsoncallback=?', function( data ){


			self.data.latestcommits = data;

			( callback ) && callback.call( self, data );
		});

		return this;
	},
	
	getRepos: function( callback ){

		var self = this;

		this._get( this.options.baseurl + 'get_repos/' + this.options.user + '?jsoncallback=?', function( data ){
			
			self.data.latestcommits = data;
			
			( callback ) && callback.call( self, data );
		});

		return this;
	}
});
