const settings = document.getElementById('settings');
const city = document.getElementsByClassName('city')[0];
const current = document.querySelector('.current')
const currentDescription = document.querySelector('.clearMoon')
const forecastItem = document.querySelectorAll('.forecastItem')
const image = document.querySelectorAll('img')
let timesOfDay;



function dayOfWeek(day) {
    let date = new Date(day)
    switch (date.toDateString().substring(0,3)) {
        case "Mon":
            return("Monday");
        case "Tue":
            return("Tuesday");
        case "Wed":
            return("Wednesday");
        case "Thu":
            return("Thursday");
        case "Fri":
            return("Friday");   
        case "Sat":
            return("Saturday");
        case "Sun":
            return("Sunday");             
    }
}

async function getWeatherAndTime(place) {
    const url =`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=bf9d673488df4611ad6162034212710&q=${place}&num_of_days=5&format=json`
    const url2 = `https://api.ipgeolocation.io/timezone?apiKey=0ff5b49972ae415a8ea04c643e86b36b&location=${place}`
    const res = await fetch(url)
    const res2 = await fetch(url2)
    const data = await res.json()   
    const data2 = await res2.json()
    if (data2.time_24.substring(0,2) > 6 && data2.time_24.substring(0,2) < 21) {
       timesOfDay = 'day'
    } else{
        timesOfDay = 'night'
    }
    rerender(data)
}


function rerender(data) {
    city.children[1].innerHTML = data.data.request[0].query  
    image[0].src=`./pic/64x64/${timesOfDay}/${data.data.current_condition[0].weatherCode}.png` 
    current.querySelector('.current_temperature').innerHTML = data.data.current_condition[0].temp_C + '℃'
    current.querySelector('.humidityPercent').innerHTML = data.data.current_condition[0].humidity + '%'
    current.querySelector('.pressurePercent').innerHTML = data.data.current_condition[0].pressure + 'mbar'
    current.querySelector('.windKm').innerHTML = data.data.current_condition[0].windspeedKmph + 'kmh'
    currentDescription.innerHTML = data.data.current_condition[0].weatherDesc[0].value

    for (let i = 0; i < 5; i++) {
        forecastItem[i].querySelector('.forecastDay').innerHTML = dayOfWeek(data.data.weather[i].date)
        forecastItem[i].querySelector('img').src = `./pic/64x64/day/${data.data.weather[i].hourly[4].weatherCode}.png`
        forecastItem[i].querySelector('.desciption').innerHTML = data.data.weather[i].hourly[4].weatherDesc[0].value
        forecastItem[i].querySelector('.degreeRed').innerHTML = data.data.weather[0].maxtempC + ' C'
        forecastItem[i].querySelector('.degreeBlue').innerHTML = data.data.weather[i].mintempC + ' C'
        console.log(forecastItem[i].querySelector('.forecastDay').innerHTML = dayOfWeek(data.data.weather[i].date));
        console.log(forecastItem[i].querySelector('.desciption').innerHTML = data.data.weather[i].hourly[4].weatherDesc[0].value);
        console.log(forecastItem[i].querySelector('.degreeBlue').innerHTML = data.data.weather[i].mintempC + ' C');
        console.log(forecastItem[i].querySelector('.degreeRed').innerHTML = data.data.weather[0].maxtempC + ' C');
    }
} 

settings.addEventListener('click', () => {
    if (city.children[0].hidden) {
        city.children[0].hidden=false
        city.children[1].hidden=true
    } else {
        city.children[1].hidden=false
        city.children[0].hidden=true
    }
})

city.children[0].addEventListener('keyup', function (event) {  
    if (event.key=='Enter') { 
        city.children[0].hidden=true
        city.children[1].hidden=false
        getWeatherAndTime(city.children[0].value)
    }   
})


