let currentDate = moment().format("MM-DD");
/* 
Travis: 18750a86e1be4adb85fb042628761fbc

*/
$(function() {
  createList();
  M.AutoInit();
});

const select = $("#state");
const input = $("#city");
const form = $("#form");
const weatherdiv = $("#weatherData");
const fooddiv = $("#foodData");
const trailUl = $("#trailData");
const states = [
  "Alaska",
  "Alabama",
  "Arkansas",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Iowa",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Massachusetts",
  "Maryland",
  "Maine",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Mississippi",
  "Montana",
  "North Carolina",
  "North Dakota",
  "Nebraska",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "Nevada",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Virginia",
  "Virgin Islands",
  "Vermont",
  "Washington",
  "Wisconsin",
  "West Virginia",
  "Wyoming"
];
let listfoods = [];

//--------------------------------------------------add food to DOM-----------------------------------------
/*
this gets called to show food food just needs id of click trail
as long as trail id is related to where the food list index
*/
function showFood(el) {
  let list = listfoods[el];
  for (let i = 0; i < list.length; i++) {
    let food = $("#foodData");
    let card = $("<div>");
    let content = $("<div>");
    let action = $("<div>");
    let bgDiv = $("<div>");
    let span = $("<span>");
    let foodDesc = $("<p>");
    let foodAddr = $("<p>");
    let foodRating = $("<p>");
    let a = $("<a>");
    span.attr("class", "card-title");
    card.attr("class", "card tn-bg");
    bgDiv.attr("class", "tn-bg-link");
    content.attr("class", "card-content white-text");
    action.attr("class", "card-action");
    span.text(list[i].name);
    a.text(list[i].name);
    a.attr("href", list[i].url);
    foodDesc.text(`Cuisine: ${list[i].food}`);
    foodRating.text(
      `Rating: ${list[i].rating} ${list[i].text} Votes: ${list[i].votes}`
    );
    foodAddr.text(`Address: ${list[i].address}`);

    content
      .append(span)
      .append(foodDesc)
      .append(foodRating)
      .append(foodAddr);
    action.append(a);
    bgDiv.append(action);
    card.append(content).append(bgDiv);
    food.append(card);
  }
}
/*
call this to get food list if you want or use the gloabl let listfood 
*/
function getFood(lat, lon) {
  let settings = {
    async: true,
    crossDomain: true,
    url: `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`,
    method: "GET",
    headers: {
      "user-key": "d72c48da91ca5b7172d76a664b41aeb0",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  let list = [];
  //d72c48da91ca5b7172d76a664b41aeb0 zamoto
  //https://developers.zomato.com/api/v2.1/geocode?lat=43.0678016&lon=-70.7764224
  $.get(settings, function({ nearby_restaurants }) {
    let food = nearby_restaurants;
    for (let i = 0; i < food.length; i++) {
      let { restaurant } = food[i];
      let cur = {
        name: restaurant.name,
        url: restaurant.url,
        food: restaurant.cuisines,
        address: restaurant.location.address,
        rating: restaurant.user_rating.aggregate_rating,
        text: restaurant.user_rating.rating_text,
        votes: restaurant.user_rating.votes
      };

      list.push(cur);
    }
  });
  listfoods.push(list);
  //return list;
}

function addToHtml(list) {
  for (let i = 0; i < list.length; i++) {
    let foodButton = $("<a>");
    let li = $("<li>");
    let h4 = $("<h4>");
    let a = $("<a>");
    let header = $("<div>");
    let body = $("<div>");
    let trailsummary = $("<p>");
    let trailDiff = $("<p>");
    let trailRate = $("<p>");
    let trailLoc = $("<p>");
    foodButton.attr("class", "waves-effect waves-light btn right colorBtns");
    header.attr("class", "collapsible-header trailHead");
    body.attr("class", "collapsible-body trailBody");
    h4.text(list[i].name);
    header.append(h4);
    a.attr("href", list[i].url);
    a.text("Trail Link");
    foodButton.attr("onclick", "showFood(this.id)");
    foodButton.attr("id", i);
    foodButton.attr("href", "#!");
    foodButton.text("Nearby Restaurants");

    trailDiff.text(`Trail Difficulty: ${list[i].difficulty}`);
    trailRate.text(`Trail Rating: ${list[i].stars}`);
    trailLoc.text(`Trail Location: ${list[i].location}`);
    trailsummary.text(list[i].summary);
    body
      .append(trailsummary)
      .append(trailDiff, trailRate, trailLoc)
      .append(a)
      .append(foodButton);

    li.append(header).append(body);
    trailUl.append(li);
    // localStorage.setItem("foods", JSON.stringify(list[i].food));
  }
}

function getTrails(lat, lon) {
  // console.log(`lat: ${lat} lon: ${lon}`);

  let trailList = [];

  //d72c48da91ca5b7172d76a664b41aeb0 zamoto
  //https://developers.zomato.com/api/v2.1/geocode?lat=43.0678016&lon=-70.7764224
  $.get(
    `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=200681842-da90e5231d773b9b92835e9dc121c36e`,
    function({ trails }) {
      //longitude: -118.7342
      // latitude: 36.5966
      for (let i = 0; i < trails.length; i++) {
        let cur = trails[i];
        let lt = cur.latitude;
        let ln = cur.longitude;
        let foods = getFood(lt, ln);
        // localStorage.setItem(`${i}`, JSON.stringify(foods));
        /*
                console.group();
                console.log(foods);
                console.log(foods[0]);
                console.log(foods.length);
                console.groupEnd();
                */
        let trail = {
          name: cur.name,
          summary: cur.summary,
          url: cur.url,
          difficulty: cur.difficulty,
          stars: cur.stars,
          location: cur.location,
          food: foods
        };

        trailList.push(trail);
      }
      addToHtml(trailList);
    }
  );
}

function createList() {
  let start = $("option");
  start.text("choose State");
  start.val("");

  select.append(start);

  for (let i = 0; i < states.length; i++) {
    select.append(`<option value="${states[i]}"> 
                 ${states[i]} 
            </option>`);
  }
}

$("#city").keyup(function(event) {
  if (event.keyCode == 13) {
    $("#submit").click();
  }
});
form.on("submit", function(e) {
  e.preventDefault();
  // weatherdiv.empty();
  fooddiv.empty();
  trailUl.empty();
  if (listfoods.length > 0) {
    listfoods = [];
  }

  let sel = select.val();
  let str = input.val();
  let city = encodeURI(str);
  select.val("");
  input.val("");
  // https://developers.zomato.com/api/v2.1/locations?query=Portsmouth%2C%20NH
  let setting = {
    async: true,
    crossDomain: true,
    url: `https://developers.zomato.com/api/v2.1/locations?query=${city}%2C%2${sel}`,
    method: "GET",
    headers: {
      "user-key": "d72c48da91ca5b7172d76a664b41aeb0",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  $.get(setting, function({ location_suggestions }) {
    let lat = location_suggestions[0].latitude;
    let lon = location_suggestions[0].longitude;
    getTrails(lat, lon);
  });

  getWeatherByCity(str);
});

var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  getTrails(lat,lon);

  getWeatherByLocation(lat,lon);
}

function getWeatherByCity(str) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${str},US&units=imperial&APPID=508709c2441fb673a7b65b4044c1ad6d`,
    method: "GET"
  }).then(function(response) {

    let day0IconCode = response.weather[0].icon;
    let day0IconURL =
      "https://openweathermap.org/img/w/" + day0IconCode + ".png";

    $("#day0Date").html(currentDate);
    $("#day0Icon").html(day0IconCode);
    $("#day0Icon").attr("src", day0IconURL);
    $("#day0Temp").html("Temp: " + Math.floor(response.main.temp) + " °F");
    $("#day0Hum").html("Humidity: " + response.main.humidity + "%");

    let cityCode = response.id;

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?id=${cityCode}&units=imperial&appid=508709c2441fb673a7b65b4044c1ad6d`,
      method: "GET"
    }).then(function(response) {
      

      let day1IconCode = response.list[4].weather[0].icon;
      let day1IconURL =
        "https://openweathermap.org/img/w/" + day1IconCode + ".png";

      let day2IconCode = response.list[12].weather[0].icon;
      let day2IconURL =
        "https://openweathermap.org/img/w/" + day2IconCode + ".png";

      let day3IconCode = response.list[20].weather[0].icon;
      let day3IconURL =
        "https://openweathermap.org/img/w/" + day3IconCode + ".png";

      let day4IconCode = response.list[28].weather[0].icon;
      let day4IconURL =
        "https://openweathermap.org/img/w/" + day4IconCode + ".png";

      $("#day1Date").html(response.list[4].dt_txt.slice(5, 10));
      $("#day1Icon").html(day1IconCode);
      $("#day1Icon").attr("src", day1IconURL);
      $("#day1Temp").html(
        "Temp: " + Math.floor(response.list[4].main.temp) + " °F"
      );
      $("#day1Hum").html("Humidity: " + response.list[4].main.humidity + "%");

      $("#day2Date").html(response.list[12].dt_txt.slice(5, 10));
      $("#day2Icon").html(day2IconCode);
      $("#day2Icon").attr("src", day2IconURL);
      $("#day2Temp").html(
        "Temp: " + Math.floor(response.list[12].main.temp) + " °F"
      );
      $("#day2Hum").html("Humidity: " + response.list[12].main.humidity + "%");

      $("#day3Date").html(response.list[20].dt_txt.slice(5, 10));
      $("#day3Icon").html(day3IconCode);
      $("#day3Icon").attr("src", day3IconURL);
      $("#day3Temp").html(
        "Temp: " + Math.floor(response.list[20].main.temp) + " °F"
      );
      $("#day3Hum").html("Humidity: " + response.list[20].main.humidity + "%");

      $("#day4Date").html(response.list[28].dt_txt.slice(5, 10));
      $("#day4Icon").html(day4IconCode);
      $("#day4Icon").attr("src", day4IconURL);
      $("#day4Temp").html(
        "Temp: " + Math.floor(response.list[28].main.temp) + " °F"
      );
      $("#day4Hum").html("Humidity: " + response.list[28].main.humidity + "%");
    });
  });
}

function getWeatherByLocation(lat, lon) {
  $.ajax({
    url:
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=508709c2441fb673a7b65b4044c1ad6d`,
    method: "GET"
  }).then(function(response) {
    
    let day0IconCode = response.weather[0].icon;
    let day0IconURL =
      "https://openweathermap.org/img/w/" + day0IconCode + ".png";

    $("#day0Date").html(currentDate);
    $("#day0Icon").html(day0IconCode);
    $("#day0Icon").attr("src", day0IconURL);
    $("#day0Temp").html("Temp: " + Math.floor(response.main.temp) + " °F");
    $("#day0Hum").html("Humidity: " + response.main.humidity + "%");

    let cityCode = response.id;

    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?id=${cityCode}&units=imperial&appid=508709c2441fb673a7b65b4044c1ad6d`,
      method: "GET"
    }).then(function(response) {
      

      let day1IconCode = response.list[4].weather[0].icon;
      let day1IconURL =
        "https://openweathermap.org/img/w/" + day1IconCode + ".png";

      let day2IconCode = response.list[12].weather[0].icon;
      let day2IconURL =
        "https://openweathermap.org/img/w/" + day2IconCode + ".png";

      let day3IconCode = response.list[20].weather[0].icon;
      let day3IconURL =
        "https://openweathermap.org/img/w/" + day3IconCode + ".png";

      let day4IconCode = response.list[28].weather[0].icon;
      let day4IconURL =
        "https://openweathermap.org/img/w/" + day4IconCode + ".png";

      $("#day1Date").html(response.list[4].dt_txt.slice(5, 10));
      $("#day1Icon").html(day1IconCode);
      $("#day1Icon").attr("src", day1IconURL);
      $("#day1Temp").html(
        "Temp: " + Math.floor(response.list[4].main.temp) + " °F"
      );
      $("#day1Hum").html("Humidity: " + response.list[4].main.humidity + "%");

      $("#day2Date").html(response.list[12].dt_txt.slice(5, 10));
      $("#day2Icon").html(day2IconCode);
      $("#day2Icon").attr("src", day2IconURL);
      $("#day2Temp").html(
        "Temp: " + Math.floor(response.list[12].main.temp) + " °F"
      );
      $("#day2Hum").html("Humidity: " + response.list[12].main.humidity + "%");

      $("#day3Date").html(response.list[20].dt_txt.slice(5, 10));
      $("#day3Icon").html(day3IconCode);
      $("#day3Icon").attr("src", day3IconURL);
      $("#day3Temp").html(
        "Temp: " + Math.floor(response.list[20].main.temp) + " °F"
      );
      $("#day3Hum").html("Humidity: " + response.list[20].main.humidity + "%");

      $("#day4Date").html(response.list[28].dt_txt.slice(5, 10));
      $("#day4Icon").html(day4IconCode);
      $("#day4Icon").attr("src", day4IconURL);
      $("#day4Temp").html(
        "Temp: " + Math.floor(response.list[28].main.temp) + " °F"
      );
      $("#day4Hum").html("Humidity: " + response.list[28].main.humidity + "%");
    });
  });
}
