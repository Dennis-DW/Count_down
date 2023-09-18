// Get DOM elements
const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");
const countdownEl = document.getElementById('countdown');
const countdownElTittle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");
const completEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

// Initialize variables
let countdownTittle = '';
let countdownDate = ''
let countdownValue = Date;
let countdownActive;
let savedcountDown;
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const Day = hour * 24;

// Set the minimum date to today
const Today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', Today);

// Function to update the DOM with countdown or completion information
function upadateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(distance / Day);
        const hours = Math.floor((distance % Day) / hour);
        const minutes = Math.floor(((distance % Day) % hour) / minute);
        const seconds = Math.floor((((distance % Day) % hour) % minute) / second);

        // Hide input and display countdown or completion
        inputContainer.hidden = true;

        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTittle} finished on ${countdownDate}`;
            completEl.hidden = false;
        } else {
            countdownElTittle.textContent = `${countdownTittle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;

            completEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// Function to handle form submission
function updateCountdown(e) {
    e.preventDefault();
    countdownTittle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedcountDown = {
        title: countdownTittle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedcountDown));

    if (countdownDate === '') {
        alert("Please enter a valid date");
    } else {
        countdownValue = new Date(countdownDate).getTime();
        upadateDOM();
    }
}

// Function to reset countdown
function reset() {
    countdownEl.hidden = true;
    completEl.hidden = true;
    inputContainer.hidden = false;
    clearInterval(countdownActive);
    countdownTittle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Function to restore previous countdown from local storage
function restorePreviousCount() {
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedcountDown = JSON.parse(localStorage.getItem('countdown'));
        countdownTittle = savedcountDown.title
        countdownDate = savedcountDown.date;
        countdownValue = new Date(countdownDate).getTime();
        upadateDOM();
    }
}

// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On page load, check local storage for a saved countdown
restorePreviousCount();
