import {fetchMovieAvailability,fetchMovieList} from "./api.js"

let selectedSeats;
let seats;
let seatsArray = [];
let k = fetchMovieList().then(a => code(a));
let loader = document.getElementById("loader");
let main = document.querySelector("main");
let bookTicketBtn = document.getElementById("book-ticket-btn");
let h3Div = document.querySelector(".v-none");
let booker = document.getElementById("booker");
bookTicketBtn.addEventListener('click', e=> checkout(e, seats));
let numberOfSelected = 0;
document.body.style.opacity = 0.4;


function code(data){
    document.body.style.opacity = 10;   
    loader.remove();
    data.forEach((element, index) => {
        let compo = document.createElement("a");
        compo.innerHTML = `<div class="movie" data-d="${element.name}">
            <div class="movie-img-wrapper"></div>
            <h4>${element.name}</h4>
            </div>`
        main.appendChild(compo);
        compo.setAttribute('href', "#");
        compo.setAttribute('class', "movie-link");
        let movieImg = document.querySelectorAll(".movie-img-wrapper")[index];
        movieImg.style.backgroundImage = `url(${element.imgUrl})`
        });

        let movie;
        document.querySelector('main').addEventListener('click', e => {
        if (e.target.tagName != 'MAIN'){
            let parent = e.target.parentElement;
            movie = parent.querySelector("h4").innerHTML;
            let f = fetchMovieAvailability(movie);
            f.then(fetchedSeats => showSeats(fetchedSeats));
        }
    }) 
}

function showSeats(fetchedSeats){
    h3Div.style.visibility = "visible";
    let bookerHolder = document.getElementById("booker-grid-holder");
    bookerHolder.innerHTML = `<div class="booking-grid"></div>
                            <div class="booking-grid"></div>`
    
    let firstDiv4x3 = document.querySelectorAll('.booking-grid')[0];
    let secondDiv4x3 = document.querySelectorAll('.booking-grid')[1];
    let seatsDiv= "";
    for(let i=1; i<=12; i++){
        let tempClass = ""
        if(fetchedSeats.indexOf(i)!= (-1)){
            tempClass = "unavailable-seat";
        }
        else{tempClass = "available-seat"};
        seatsDiv = seatsDiv + `<div class=${tempClass} id="booking-grid-${i}">${i}</div>`;
    }
    firstDiv4x3.innerHTML = seatsDiv;
    seatsDiv = "";  
    for(let i=13; i<=24; i++){
        let tempClass = ""
        if(fetchedSeats.indexOf(i)!= (-1)){
            tempClass = "unavailable-seat";
        }
        else{tempClass = "available-seat"}
        seatsDiv = seatsDiv + `<div class=${tempClass} id="booking-grid-${i}">${i}</div>`;
    }
    secondDiv4x3.innerHTML = seatsDiv;

    firstDiv4x3.addEventListener('click', e=> selectSeats(e, selectedSeats));
    secondDiv4x3.addEventListener('click', e=> selectSeats(e, selectedSeats));
}

function selectSeats(event, selectedSeats){
    let listOfClass = event.target.classList;

    if(listOfClass.contains("available-seat") && !listOfClass.contains("selected-seat")){
        listOfClass.add("selected-seat");
        numberOfSelected++;
    }
    else if(listOfClass.contains("available-seat") && listOfClass.contains("selected-seat")){
        listOfClass.remove("selected-seat");
        numberOfSelected--;
    }

    if(numberOfSelected>0){
        bookTicketBtn.classList.remove("v-none");
    } else{
        bookTicketBtn.classList.add("v-none");
    }

    selectedSeats = document.getElementsByClassName("selected-seat");
    seats = selectedSeats;
}
    

function checkout(event, seats){
    let tempArray = Array.from(seats);
    
    for(let i of tempArray){
       seatsArray.push(i.innerHTML);
    }
    booker.innerHTML = `<div id="confirm-purchase">
    <h3>Confirm your booking for seat numbers:${seatsArray.join(",")}</h3>
    <form  id="customer-detail-form">
        <label for="email">Email: </label>
        <input type="email" id="email" required></br>
        <label for="number">Phone number: </label>
        <input type="number" id="number" required></br>
        <input type="submit" value="Submit" id="submit">
    </form>
</div>`

    let formElement = document.getElementById("customer-detail-form");
    formElement.addEventListener('submit', finalDisplay)
}

function finalDisplay(){
    let email = document.getElementById("email").value;
    let phone = document.getElementById("number").value;
    booker.innerHTML =   `<div id="Success">
    <h3>Booking details: </h3>
    <div>Seats : ${seatsArray.join(",")}</div>
    <div>Email : ${email}</div>
    <div>Phone : ${phone}</div>
</div>`
}
