var foodApp = {};

// Get location ID for the user's location
foodApp.getLocation = function(){
	$.ajax({
		url:'https://developers.zomato.com/api/v2.1/locations',
		method: 'GET',
		dataType: 'json',
		data:{
			apikey:'f46a56a9f1b268192552153a8996b67a',
			query: foodApp.locationInput
		}
	}).then(function(locationResults){
		var locationID = locationResults.location_suggestions[0].city_id;
		// console.log(locationID);
		foodApp.getRestInfo(locationID);
	})
};


//get the restaurant info using the location ID and the query
foodApp.getRestInfo = function(location) {
	$.ajax({
		url:'https://developers.zomato.com/api/v2.1/search?sort=rating&entity_type=city',
		method: 'GET',
		dataType: 'json',
		data:{
			apikey:'f46a56a9f1b268192552153a8996b67a',
			q: foodApp.foodInput,
			entity_id: location
		}
	})
	.then(function(results){
		// console.log(results);	
		var restaurantList = results.restaurants;
		console.log(restaurantList);
		foodApp.displayFood(restaurantList);
	});
};


//with the data, display only the featured images 
foodApp.displayFood = function(restInfo){
	$('.results').empty();
	//filter the restaurants to only the ones with featured images
	restInfo = restInfo.filter(function(rest){
		return rest.restaurant.thumb !== "";
	});
	// console.log(restInfo);
	//from each restInfo display the featured images
	restInfo.forEach(function(rest){
		var $foodBox = $('<article>').addClass('foodBox');
		var $link = $('<a>').attr({
			href: rest.restaurant.url,
			target: "_blank"
		});
		var $image = $('<img class="item">').attr({
			src: rest.restaurant.thumb,
		});
		
		var $rating = $('<div>').addClass('rating');
		var $ratingText = $('<p>').text( '★' + rest.restaurant.user_rating.aggregate_rating + '/5');
		$rating.append($ratingText);
		
		// if ( $(document).width() > 770) {
		// 	$link.hover(function(){
		// 		$rating.fadeIn().css("display", "flex");
		// 		}, function(){
		// 		$rating.fadeOut();
		// 	});
		// } else {
		// 	$link.hover(function(){
		// 		$rating.css("display", "flex");
		// 		}, function(){
		// 		$rating.css("display", "flex");
		// 	});
		// }

		$link.append($image, $rating);
		$foodBox.append($link);
		$('.results').append($foodBox).css('display', 'flex');
	
	});

};




//on submitting, get the location ID and query and replace 
foodApp.events = function(){
	$('.fa-times').on('click', function(){
		$('.warning').fadeOut();
		$('header').fadeIn().css("display", "flex");
	});

	$('.submit').on('submit', function(e){
		e.preventDefault();
		// get the location input and insert it to the city ID
		foodApp.locationInput = $('input[type=search]').val();

		//get the food input and insert it in the query
		foodApp.foodInput = $('input[type=text]').val();
		
		//get the location ID of the user's location
		foodApp.getLocation();		

		//smooth scroll
		// $('#results').smoothScroll ('');
		$('html, body').animate({
		    scrollTop: $("#results").offset().top
		}, 2000);

	});
};
// foodApp.header = function(){
// 	$.when(foodApp.events)
// 	.then(function(){
// 		$('.fixed-header').css('display', 'block');
// 	});
// };
	


foodApp.init = function() {
	foodApp.events();
};



$(function(){
	foodApp.init();

	var $nav = $('.fixed-header');
	var $win = $(window);
	var winH = $win.height(); // Get the window height.

		$win.on("scroll", function () {
	       if ($(this).scrollTop() > winH - 100 ) {
	           $nav.addClass("fixed");
	       } else {
	           $nav.removeClass("fixed");
	       }
	   }).on("resize", function(){ // If the user resizes the window
	      winH = $(this).height(); // you'll need the new height value
	   });
});
