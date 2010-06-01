
function github(options){

	if ( !options || !options.author ) return;

	this.options = options;

	this.element = $( options.element );
		
	this.commits = [];

	this.i = 0;

	this.init();
}

$.extend(github.prototype, {

	init: function(){

		var self = this;

		this.elements = {
			list: $('<ul />'),
			loader: this.element.find('#loader'),
			repositories: this.element.find('#repositories'),
			commits: this.element.find('#commits')
		};

		this.element.find('section').not( this.elements.loader ).hide();

		this.getRepos(function(){

			$.each(self.repos, function( i, repo ){

				self.elements.list.append( $('<li>').html( repo.name ) );
			
				self.getCommits( repo.name, function(data, repo){

					$.each(data, function(i, commit){

						var time = self._formatTime( commit.committed_date );

						commit.committed_date = time;

						self.commits.push({
							val: time,
							commit: commit,
							repo: repo
						});

					});
				
				}, function(){
					self.finished();
				});
			});
		});

	},

	getRepos: function( callback ){

		var self = this;
	
		$.getJSON('http://rest.badsyntax.co.uk/github/get_repos/' + this.options.author + '?jsoncallback=?', function(data){

			self.repos = data;

			callback.apply();
		});
	},

	getCommits: function( repo, callback, finished ){

		var self = this, url = 'http://rest.badsyntax.co.uk/github/get_commits/' + this.options.author + '/' + repo + '/master?jsoncallback=?';

		$.getJSON( url , function(data){

			callback(data, repo);
			
			self.i++;

			if ( self.i < self.repos.length ) {
			} else {

				finished.apply();
			}
		});
	},
	
	_formatTime: function( committed_date ){

		var 
			segments = committed_date.split('T'),

			matches = segments[1].match(/([0-9]+:[0-9]+:[0-9]+)(.*)/),

			d = segments[0].split('-'), 

			t = matches[1].split(':');

		return new Date( d[0], d[1], d[2], t[0], t[1], t[2] );
	},

	getUser: function(callback){
		
		$.getJSON('http://rest.badsyntax.co.uk/github/get_user/' + this.author + '?jsoncallback=?', function(data){
			callback( data );
		});
	},
	
	finished: function(){

		var self = this;

		this.getUser(function(data){

			self.commits.sort(function(a, b){
				return b.val - a.val;
			});

			var commitstring = '';

			for (var i=0; i<=60; i++){

				var d = self.commits[i].commit.committed_date.toUTCString().split(' ').slice(1, 3).join(' ');

				commitstring += d + 
					' - <a href="' + self.commits[i].commit.url + '">' + 
					self.commits[i].repo + '</a> - ' + 
					self.commits[i].commit.message + '<br />';
			}

			var data = $.extend({}, data, { commits: commitstring, });
			
			self.element.find('section').show();

			self.elements.commits
				.render( data )
				.find( '#commits-scroll' )
					.scrollbar();

			self.elements.repositories.render( data );

			self.elements.loader.hide();
		});
	}

});
