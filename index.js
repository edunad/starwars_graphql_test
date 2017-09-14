var express = require('express');
var request = require('request');

var fs = require('fs');
var path = require('path');

var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var data = {
  characters: [],
  planets: [],
  species: [],
  starships: [],
  films: [],
  vehicles: []
}

var gatherCount = Object.keys(data).length - 1;
var schema = buildSchema(`
  type Query {
    # Characters in the Starwars Movie
    characters(filter: String): [Character]
    # Planets in the Starwars Movie
    planets(filter: String): [Planet]
    # Species in the Starwars Movie
    species(filter: String): [Specie]
    # Starships in the Starwars Movie
    starships(filter: String): [Starship]
    # Starwars Movies
    films(filter: String): [Film]
    # Vehicles in the Starwars Movie
    vehicles(filter: String): [Vehicle]
  }

  # A type that describes the Characters
  type Character {
    # Acts as unique identifier
    url: String!
    # The name of this person.
    name: String
    # The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is a battle that occurs at the end of Star Wars episode IV: A New Hope.
    birth_year: String
    # The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.
    eye_color: String
    # The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.
    gender: String
    # The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.
    hair_color: String
    # The height of the person in centimeters.
    height: String
    # The mass of the person in kilograms.
    mass: String
    # The skin color of this person.
    skin_color: String
    # A planet that this person was born on or inhabits.
    homeworld: Planet
    # An array of film resource URLs that this person has been in.
    films: [Film]
    # An array of species resource URLs that this person belongs to.
    species: [Specie]
    # An array of starship resource URLs that this person has piloted.
    starships: [Starship]
    # An array of vehicle resource URLs that this person has piloted.
    vehicles: [Vehicle]
  }

  # A type that describes the Planets
  type Planet {
    # Acts as unique identifier
    url: String!
    # The name of this planet.
    name: String
    # The diameter of this planet in kilometers.
    diameter: String
    # The number of standard hours it takes for this planet to complete a single rotation on its axis.
    rotation_period: String
    # The number of standard days it takes for this planet to complete a single orbit of its local star.
    orbital_period: String
    # A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.
    gravity: String
    # The average population of sentient beings inhabiting this planet.
    population: String
    # The climate of this planet. Comma separated if diverse.
    climate: String
    # The terrain of this planet. Comma separated if diverse.
    terrain: String
    # The percentage of the planet surface that is naturally occurring water or bodies of water.
    surface_water: String
    # An array of People URL Resources that live on this planet.
    residents: [Character]
    # An array of Film URL Resources that this planet has appeared in.
    films: [Film]
  }

  # A type that describes the Species
  type Specie {
    # Acts as unique identifier
    url: String!
    # The name of this species.
    name: String
    # The classification of this species, such as "mammal" or "reptile".
    classification: String
    # The designation of this species, such as "sentient".
    designation: String
    # The average height of this species in centimeters.
    average_height: String
    # The average lifespan of this species in years.
    average_lifespan: String
    # A comma-separated string of common eye colors for this species, "none" if this species does not typically have eyes.
    eye_colors: String
    # A comma-separated string of common hair colors for this species, "none" if this species does not typically have hair.
    hair_colors: String
    # A comma-separated string of common skin colors for this species, "none" if this species does not typically have skin.
    skin_colors: String
    # The language commonly spoken by this species.
    language: String
    # The URL of a planet resource, a planet that this species originates from.
    homeworld: [Planet]
    # An array of People URL Resources that are a part of this species.
    people: [Character]
    # An array of Film URL Resources that this species has appeared in.
    films: [Film]
  }

  # A type that describes the Starships
  type Starship {
    # Acts as unique identifier
    url: String!
    # The name of this starship. The common name, such as "Death Star".
    name: String
    # The model or official name of this starship. Such as "T-65 X-wing" or "DS-1 Orbital Battle Station".
    model: String
    # The class of this starship, such as "Starfighter" or "Deep Space Mobile Battlestation"
    starship_class: String
    # The manufacturer of this starship. Comma separated if more than one.
    manufacturer: String
    # The cost of this starship new, in galactic credits.
    cost_in_credits: String
    # The length of this starship in meters.
    length: String
    # The number of personnel needed to run or pilot this starship.
    crew: String
    # The number of non-essential people this starship can transport.
    passengers: String
    # The maximum speed of this starship in the atmosphere. "N/A" if this starship is incapable of atmospheric flight.
    max_atmosphering_speed: String
    # The class of this starships hyperdrive.
    hyperdrive_rating: String
    # The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.
    MGLT: String
    # The maximum number of kilograms that this starship can transport.
    cargo_capacity: String
    # The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.
    consumables: String
    # An array of Film URL Resources that this starship has appeared in.
    films: [Film]
    # An array of People URL Resources that this starship has been piloted by.
    pilots: [Character]
  }

  # A type that describes the Films
  type Film {
    # Acts as unique identifier
    url: String!
    # The title of this film
    title: String
    # The episode number of this film.
    episode_id: Int
    # The opening paragraphs at the beginning of this film.
    opening_crawl: String
    # The name of the director of this film.
    director: String
    # The name(s) of the producer(s) of this film. Comma separated.
    producer: String
    # The ISO 8601 date format of film release at original creator country.
    release_date: String
    # An array of species resource URLs that are in this film.
    species: [Specie]
    # An array of starship resource URLs that are in this film.
    starships: [Starship]
    # An array of vehicle resource URLs that are in this film.
    vehicles: [Vehicle]
    # An array of people resource URLs that are in this film.
    characters: [Character]
    # An array of planet resource URLs that are in this film.
    planets: [Planet]
  }

  # A type that describes the Vehicles
  type Vehicle {
    # Acts as unique identifier
    url: String!
    # The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder bike".
    name: String
    # The model or official name of this vehicle. Such as "All-Terrain Attack Transport".
    model: String
    # The class of this vehicle, such as "Wheeled" or "Repulsorcraft".
    vehicle_class: String
    # The manufacturer of this vehicle. Comma separated if more than one.
    manufacturer: String
    # The length of this vehicle in meters.
    length: String
    # The cost of this vehicle new, in Galactic Credits.
    cost_in_credits: String
    # The number of personnel needed to run or pilot this vehicle.
    crew: String
    # The number of non-essential people this vehicle can transport.
    passengers: String
    # The maximum speed of this vehicle in the atmosphere.
    max_atmosphering_speed: String
    # The maximum number of kilograms that this vehicle can transport.
    cargo_capacity: String
    # The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.
    consumables: String
    # An array of Film URL Resources that this vehicle has appeared in.
    films: [Film]
    # An array of People URL Resources that this vehicle has been piloted by.
    pilots: [Character]
  }
`);

var root = {
  characters: function({filter}) {
    return handleFilter(data.characters, filter);
  },
  planets: function({filter}){
    return handleFilter(data.planets, filter);
  },
  species: function({filter}){
    return handleFilter(data.species, filter);
  },
  starships: function({filter}){
    return handleFilter(data.starships, filter);
  },
  films: function({filter}){
    return handleFilter(data.films, filter);
  },
  vehicles: function({filter}){
    return handleFilter(data.vehicles, filter);
  }
};

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  pretty: true
}));

function INIT(){
  console.log('Gathering Starwars resources\n================\n\n');
  gatherResources();
}

// If you wish to keep your sanity intact do not look into the following functions :)

function gatherResources() {
  data.characters = {};
  data.planets = {};
  data.species = {};
  data.starships = {};
  data.films = {};
  data.vehicles = {};

  if (!fs.existsSync('data'))
    fs.mkdirSync('data');

  gatherData('people', [], 1, function(rawData, wasCached){
    if(!wasCached){
      rawData.forEach(function(pageData){
        pageData.forEach(function(key){
          data.characters[key.url] = key;
        })
      });

      createDataCache('people', data.characters, function(err){
        if(err) console.log('Failed to save People Cache');
        else console.log('Saved People Cache');
      });
    }else{
      data.characters = rawData;
      console.log('Loaded Starships');
    }

    console.log('Done gathering People! Found ' + Object.keys(data.characters).length);
    onDoneGather();
  });

  gatherData('planets', [], 1, function(rawData, wasCached){
    if(!wasCached){
      rawData.forEach(function(pageData){
        pageData.forEach(function(key){
          data.planets[key.url] = key;
        })
      });

      createDataCache('planets', data.planets, function(err){
        if(err) console.log('Failed to save Planet Cache');
        else console.log('Saved Planet Cache');
      });
    }else{
      console.log('Loaded Planets');
      data.planets = rawData;
    }

    console.log('Done gathering Planets! Found ' + Object.keys(data.planets).length);
    onDoneGather();
  });

  gatherData('species', [], 1, function(rawData, wasCached){
    if(!wasCached){
      rawData.forEach(function(pageData){
        pageData.forEach(function(key){
          data.species[key.url] = key;
        })
      });

      createDataCache('species', data.species, function(err){
        if(err) console.log('Failed to save Species Cache');
        else console.log('Saved Species Cache');
      });
    }else{
      console.log('Loaded Species');
      data.species = rawData;
    }

    console.log('Done gathering Species! Found ' + Object.keys(data.species).length);
    onDoneGather();
  });

  gatherData('starships', [], 1, function(rawData, wasCached){
    if(!wasCached){
      rawData.forEach(function(pageData){
        pageData.forEach(function(key){
          data.starships[key.url] = key;
        })
      });

      createDataCache('starships', data.starships, function(err){
        if(err) console.log('Failed to save Starships Cache');
        else console.log('Saved Starships Cache');
      });
    }else{
      console.log('Loaded Starships');
      data.starships = rawData;
    }

    console.log('Done gathering Starships! Found ' + Object.keys(data.starships).length);
    onDoneGather();
  });

  gatherData('films', [], 1, function(rawData, wasCached){
    if(!wasCached){
      rawData.forEach(function(pageData){
        pageData.forEach(function(key){
          data.films[key.url] = key;
        })
      });

      createDataCache('films', data.films, function(err){
        if(err) console.log('Failed to save Films Cache');
        else console.log('Saved Films Cache');
      });
    }else{
      console.log('Loaded Films');
      data.films = rawData;
    }

    console.log('Done gathering Films! Found ' + Object.keys(data.films).length);
    onDoneGather();
  });

  gatherData('vehicles', [], 1, function(rawData, wasCached){
    if(!wasCached){
      rawData.forEach(function(pageData){
        pageData.forEach(function(key){
          data.vehicles[key.url] = key;
        })
      });

      createDataCache('vehicles', data.vehicles, function(err){
        if(err) console.log('Failed to save Vehicles Cache');
        else console.log('Saved Vehicles Cache');
      });
    }else{
      console.log('Loaded Vehicles');
      data.vehicles = rawData;
    }

    console.log('Done gathering Vehicles! Found ' + Object.keys(data.vehicles).length);
    onDoneGather();
  });

}

function createDataCache(cacheName, data, callback){
  if (fs.existsSync('data/' + cacheName + '.cache')) return callback(null);
  fs.writeFile('data/' + cacheName + '.cache', JSON.stringify(data), 'utf-8', callback);
}

function getCachedData(cacheName, callback){
  if (!fs.existsSync('data/' + cacheName + '.cache')) return callback(null);
  fs.readFile('data/' + cacheName + '.cache', 'utf8', function (err, data) {
    if(err) return callback(null);
    return callback(JSON.parse(data.toString()));
  });
}

function gatherData(dataType, data, page, callback){
  getCachedData(dataType, function(cachedData){
    if(cachedData != null && Object.keys(cachedData).length > 0){
      return callback(cachedData, true);
    }else{
      request.get({
          url: "https://swapi.co/api/"+dataType+"/?page=" + page,
          timeout: 3500
      }, function (err, res, body) {
        if(!res || res.statusCode != 200) return null;
        var jBody = JSON.parse(body);
        data.push(jBody.results);
        if(jBody.next != null) gatherData(dataType, data, page + 1, callback);
        else return callback(data, false);
      });
    }
  });
}

// The api returns a link string for the characters, planets, etc.
// This will link the other api calls with the url, allowing you to get the info.
/* Ex:
{
  characters{
    name
    url
    films { // It will now return the film object instead of a url
      title
      episode_id
    }
  }
}
*/
function linkApiData(callback){
  Object.keys(data).forEach(function(key){
    if(data[key] == undefined) return;

    Object.keys(data[key]).forEach(function(mainKey){
      // Scan Fields
      Object.keys(data[key][mainKey]).forEach(function(charKey){
        // Is Object linkable
        var linkData = data[key][mainKey][charKey];
        if(linkData == null) return;

        if(typeof linkData == typeof [] && linkData.length > 0)
          linkData = data[key][mainKey][charKey][0] // Compare the first element

        if(charKey.toString().indexOf('url') == -1 && linkData.toString().indexOf('https://swapi.co/api/') != -1){
          var correctLink = null;

          if(Object.keys(data).indexOf(charKey) != -1){
            correctLink = charKey;
          }else{
            correctLink = linkData.replace('https://swapi.co/api/','');
            correctLink = correctLink.split('/')[0];
          }

          // Check if the correctlink array exists in the local data
          if(Object.keys(data).indexOf(correctLink) != -1){
            // Check if the data is null
            if(data[key][mainKey][charKey] != null){
              // If it's an array
              if(typeof data[key][mainKey][charKey] == typeof []){
                Object.keys(data[key][mainKey][charKey]).forEach(function(linkKey){
                  var linkId = data[key][mainKey][charKey][linkKey];
                  if(linkId != null && data[correctLink][linkId] != null){
                    data[key][mainKey][charKey][linkKey] = data[correctLink][linkId];
                  }
                });
              }else{
                var linkId = data[key][mainKey][charKey];
                data[key][mainKey][charKey] = data[correctLink][linkId];
              }
            }
          }
        }
      });
    });
  });

  return callback();
}

function onDoneGather(){
  if(gatherCount <= 0){
    linkApiData(function(){
      app.listen(4000, () => {
        console.log('\n===== Server listening to localhost:4000/graphql');
      });
    });
  }else{
    gatherCount -= 1;
  }
}

function handleFilter(data, params){
  var array = Object.values(data);
  if(params != undefined){
    var fixedParams = params.replace(/'/g,'"');
    return parseFilterObject(JSON.parse(fixedParams), array);
  }else
    return array;
}

function parseFilterObject(filterObject, array){
  if(filterObject == undefined) return array;
  var filteredArray = array;
  Object.keys(filterObject).forEach(function(filterKey){
    filteredArray = filterByKey(filteredArray, filterKey, filterObject[filterKey]);
  });
  return filteredArray;
}

function filterByKey(array, keyToFilter, filter){
  var arr = [];
  array.forEach(function(data){
    if(data[keyToFilter].indexOf(filter) != -1){
      arr.push(data)
    }
  });
  return arr;
}

INIT();
