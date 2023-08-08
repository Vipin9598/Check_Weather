let userWeathertab=document.querySelector("[UserWeatherbtn]");
let userWeatherContainer=document.querySelector("[UserWeatherContainer]");
let searchWeatherContainer=document.querySelector("[searchWeatherContainer]");
let searchWeathertab=document.querySelector("[SearchWeatherbtn]");
let searchInput=document.querySelector(".input");
let grantAccessContainer=document.querySelector("[grantAccessContainer]");
let loadingScreen=document.querySelector(".loadingTab");
const API_key="83eb83a4191da1843d2246ca92e26a27";

// to  chaliye ab suru krte h


let currentTab=userWeathertab;
currentTab.classList.add("btn-active");
// grantAccessContainer.classList.add("active");
getFromSessionStorage();

userWeathertab.addEventListener('click',()=>{
    switchTab(userWeathertab);
});


searchWeathertab.addEventListener('click',()=>{
    switchTab(searchWeathertab);
});

function switchTab(clickedtab){
    if(currentTab != clickedtab){
        currentTab.classList.remove('btn-active');
        currentTab=clickedtab;
        currentTab.classList.add('btn-active');

        if(!searchWeatherContainer.classList.contains("active")){
            userWeatherContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchWeatherContainer.classList.add("active");

        }
        else{
            searchWeatherContainer.classList.remove("active");
            userWeatherContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}


  // check weather cordinates are already saved or not

function getFromSessionStorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinate");
    if(!localcoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchUserweatherInfo(coordinates);
    }
}

async function fetchUserweatherInfo(coordinates){

    const {lat,lon}=coordinates;
    console.log(lat,lon);
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active"); 

    // API call 

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const result = await response.json();
        loadingScreen.classList.remove("active"); 
        userWeatherContainer.classList.add("active");
        renderWeatherInfo(result);

    }
    catch{
        loadingScreen.classList.remove("active");
        // baaad m dekhte h     
    }
    
}


function renderWeatherInfo(result){
    let cityName=document.querySelector("[cityName]");
    let flag=document.querySelector("[countryIcon]");
    let aboutWeather=document.querySelector("[aboutWeather]");
    let aboutWeatherImg=document.querySelector("[aboutWeatherImg]");
    let temp=document.querySelector("[temp]");
    let windSpeed=document.querySelector("[windspeed]");
    let humidity=document.querySelector("[humidity]");
    let clouds=document.querySelector("[clouds]");

    cityName.innerText=result?.name;

    aboutWeather.innerText=result?.weather?.[0]?.description;
    temp.innerText=result?.main?.temp;
    temp.innerText=temp.innerText+' °C';    

    windSpeed.innerText=result?.wind?.speed;
    windSpeed.innerText=windSpeed.innerText+' m/s';   
    humidity.innerText=result?.main?.humidity+"%";
    clouds.innerText=result?.clouds?.all+"%";
    flag.src = `https://flagcdn.com/144x108/${result?.sys?.country.toLowerCase()}.png`;
    aboutWeatherImg.src=`http://openweathermap.org/img/w/${result?.weather?.[0]?.icon}.png`;

}

function getLocation(){
    console.log("i am  in get location")
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // badd m dekhenge isne
        let error=document.querySelector(".error");
        error.innerText="error occure";
        console.log("not support");
    }
}

function showPosition(position){
    console.log("showposition m aaa gya");
    const usercoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem('user-coordinate',JSON.stringify(usercoordinate));
    console.log("showpositiom");
    fetchUserweatherInfo(usercoordinate);
}

const grantAccessBtn=document.querySelector(".grantAccess");
grantAccessBtn.addEventListener('click',getLocation);
let btn=document.querySelector(".btn");

btn.addEventListener("click",(e)=>{
    e.preventDefault();
    let cityname=searchInput.value;
    if(cityname===""){
        return;
    }
    else{
        fetchcityweatherInfo(cityname);
    }
});

async function fetchcityweatherInfo(cityname){
    userWeatherContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}&units=metric`
          );
          
        const result = await response.json();
        
        
        loadingScreen.classList.remove("active");
        const error=document.querySelector(".error-container");
        if(result?.name===undefined){
            searchInput.value="";
            error.classList.add("active");
            userWeatherContainer.classList.remove("active");
        }
        else{
            searchInput.value="";
            error.classList.remove("active");
            userWeatherContainer.classList.add("active");
            renderWeatherInfo(result);
        }
        
    }
    catch(err){
        console.log("city ka weather na aara"); 
    }
}

