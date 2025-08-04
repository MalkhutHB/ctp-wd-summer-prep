const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let habits = {};

const cards = document.querySelector(".cards");
const addButton = document.querySelector(".add-habit");
//const habitName = document.querySelector("#habit_name");
//const categories = document.querySelector("#categories");
const cardTemplate = document.querySelector("#card-template");
const extenderTemplate = document.querySelector("#extender-template");
const hidden = document.querySelector("#detached-container");
const extender = extenderTemplate.content.firstElementChild;
const saveButton = extender.querySelector(".save-habit");

const inputTitle = extender.querySelector("#habit_name_input");
const inputTime = extender.querySelector("#time");

const cardsArray = document.querySelectorAll(".habit-card");

for (const card of cardsArray) {
    card.addEventListener("click", (e) => {
        if (e.target != saveButton) card.appendChild(extender);
    })
}

addButton.addEventListener("click", () => newHabit());
// saveButton.addEventListener("click", () => {
//      /***/
// });

function newHabit() {
    const clone = cardTemplate.content.cloneNode(true);
    const article = clone.querySelector("article");
    article.appendChild(extender);

    const habitTop = article.querySelector(".habit-card-main");
    const completedStatus = article.querySelector(".completed");
    const completionIcon = article.querySelector(".habit-icon"); // def rewrite that if statement lmaooo
    article.addEventListener("click", (e) => {
        if (e.target == saveButton) {
            hidden.appendChild(extender);
            changeHabit(article); 
        } else if (e.target == completionIcon) {
            if (completedStatus.textContent == "completed ☑️") {
                completedStatus.textContent = "unfinished";
                completionIcon.classList.remove("completed");
            } else {
                completedStatus.textContent = "completed ☑️"
                completionIcon.classList.add("completed");
            }
        } else if (habitTop.contains(e.target) && article.querySelector(".habit-card-extender")) {
            hidden.appendChild(extender);
        } else if (!article.querySelector(".habit-card-extender")) { 
            article.appendChild(extender);
        } 
    })
    cards.appendChild(clone);
    //storeHabit(article);
}

function storeHabit(article) {
    date = new Date();
    const habitId = date.toISOString();
    card.dataset.habitId = habitId;
    habits[habitId] = { 
        name: habitName.value,
        category: selectedCategory.value,
        startDate: date,
        completionDates: [],
    };
}

function changeHabit(article, repeat) {
    const titleElement = article.querySelector(".habit-title");
    const timeElement = article.querySelector(".time");
    titleElement.textContent = inputTitle.value || "New Habit";
    timeElement.textContent = convert24to12(inputTime.value);
}

function convert24to12(time) {
    let timeParts = time.split(":");
    const date = new Date();
    date.setHours(timeParts[0], timeParts[1]);

    const time12hr = date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return time12hr;
}

function completeHabit(habitId) {
    habits[habitId].completionDates.push(new Date());
}

// function to calc streak. Basically did alr. But, need local storage for this to even matter. 
// Can test by adding parameter for date and inputting fake dates. Actually yeah we should do this before local storage implementation. 

// wait no, streaks would be from markcomplete. So need an array with dates associated to a habit. 
// Prob can hash habits by exact start time

// markcomplete:
// Shouldn't have the opportunity to mark it complete until it reopens. I guess to make it simple, at 00:00 the day, and the next day/week
// Need to add frequency paramater to addHabit for this. 
// And again for testing, add date parameter to completeHabit