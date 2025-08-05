const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const habitsJson = localStorage.getItem("habits");
let habitsParsed = JSON.parse(habitsJson || "{}", (key, value) => {
    if (key == "startDate") return new Date(value);
    if (key == "completionDates") return value.map(date => new Date(date));
    return value;
})
let habits = habitsParsed;

const cards = document.querySelector(".cards");
const addButton = document.querySelector(".add-habit");
const cardTemplate = document.querySelector("#card-template");
const extenderTemplate = document.querySelector("#extender-template");
const hidden = document.querySelector("#detached-container");
const extender = extenderTemplate.content.firstElementChild;
const saveButton = extender.querySelector(".save-habit");
const deleteButton = extender.querySelector(".delete-habit");

const inputTitle = extender.querySelector("#habit_name_input");
const inputTime = extender.querySelector("#time");

const cardsArray = document.querySelectorAll(".habit-card");

for (const card of cardsArray) {
    card.addEventListener("click", (e) => {
        if (e.target != saveButton) card.appendChild(extender);
    })
}

addButton.addEventListener("click", () => newHabit());
renderHabits();

function habitInteract(e, article, habitId) {
    const habitTop = article.querySelector(".habit-card-main");
    const completedStatus = article.querySelector(".status"); 
    const completionIcon = article.querySelector(".habit-icon"); 

    if (e.target == saveButton) {
        hidden.appendChild(extender);
        changeHabit(article); 
    } else if (e.target == deleteButton) {
        hidden.appendChild(extender);
        article.remove();
        delete habits[habitId]; 
        localStorage.setItem("habits", JSON.stringify(habits));
    } else if (e.target == completionIcon) {
        if (completedStatus.textContent == "completed ☑️") {
            completedStatus.textContent = "unfinished";
            completionIcon.classList.remove("completed");
            habits[habitId].completionDates.splice(-1);
            localStorage.setItem("habits", JSON.stringify(habits));
        } else {
            completedStatus.textContent = "completed ☑️"
            completionIcon.classList.add("completed");
            habits[habitId].completionDates.push(new Date());
            localStorage.setItem("habits", JSON.stringify(habits));
        }
    } else if (habitTop.contains(e.target) && article.querySelector(".habit-card-extender")) {
        hidden.appendChild(extender);
    } else if (!article.querySelector(".habit-card-extender")) { 
        article.appendChild(extender);
    } 
}

function habitInteractDouble(e, article, habitId) {
    const habitTop = article.querySelector(".habit-card-main");
    const completionIcon = article.querySelector(".habit-icon"); 
    if (e.target != saveButton &&
        e.target != deleteButton &&
        e.target != completionIcon &&
        !(habitTop.contains(e.target) && article.querySelector(".habit-card-extender")) &&
        !article.querySelector(".habit-card-extender")
    ) {
        hidden.appendChild(extender);
        article.remove();
        delete habits[habitId]; 
        localStorage.setItem("habits", JSON.stringify(habits));
    }
}

function newHabit() {
    const clone = cardTemplate.content.cloneNode(true);
    const article = clone.querySelector("article");
    article.appendChild(extender);
    const habitId = storeHabit(article);

    article.addEventListener("click", (e) => habitInteract(e, article, habitId));
    article.addEventListener("dblclick", (e) => habitInteractDouble(e, article, habitId)); /*temporary*/
    cards.appendChild(clone);
}

function renderHabits() {
    for (const habitId in habits) {
        const clone = cardTemplate.content.cloneNode(true);
        const article = clone.querySelector("article");
        
        const habitTop = article.querySelector(".habit-card-main");
        const completedStatus = article.querySelector(".status"); 
        const completionIcon = article.querySelector(".habit-icon"); 
        
        const oneDayInMs = 1000 * 60 * 60 * 24;
        const today = new Date();

        article.dataset.habitId = habitId;  // isSameDay(today, habits[habitId].completionDates.at(-1)) bugged though
        if (habits[habitId].completionDates && today - habits[habitId].completionDates.at(-1) < oneDayInMs) {
            completedStatus.textContent = "completed ☑️";
            completionIcon.classList.add("completed");
        }   

        article.addEventListener("click", (e) => habitInteract(e, article, habitId))
        article.addEventListener("dblclick", (e) => habitInteractDouble(e, article, habitId)); /*temporary*/
        
        // from changehabit function
        const titleElement = article.querySelector(".habit-title");
        const timeElement = article.querySelector(".time");
        titleElement.textContent = habits[habitId].name;
        timeElement.textContent = convert24to12(habits[habitId].reminderTime || "10:00");

        cards.appendChild(clone);
    }
}


function storeHabit(article) {
    date = new Date();
    const habitId = date.toISOString();
    article.dataset.habitId = habitId;
    habits[habitId] = { 
        name: "New Habit",
        startDate: date,
        completionDates: [],
        reminderTime: "10:00",
    };
    localStorage.setItem("habits", JSON.stringify(habits));
    return habitId;
}

function changeHabit(article, repeat) {
    const titleElement = article.querySelector(".habit-title");
    const timeElement = article.querySelector(".time");
    titleElement.textContent = inputTitle.value || "New Habit";
    timeElement.textContent = convert24to12(inputTime.value);

    const habitId = article.dataset.habitId;
    habits[habitId].name = inputTitle.value || "New Habit";
    habits[habitId].reminderTime = inputTime.value;
    localStorage.setItem("habits", JSON.stringify(habits));
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

function completeHabit(habitId) { // unused
    habits[habitId].completionDates.push(new Date());
    localStorage.setItem("habits", JSON.stringify(habits));
}

function isSameDay(date1, date2) {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    return date1.getTime() === date2.getTime();
}

// function to calc streak. Basically did alr. But, need local storage for this to even matter. 
// Can test by adding parameter for date and inputting fake dates. Actually yeah we should do this before local storage implementation. 

// wait no, streaks would be from markcomplete. So need an array with dates associated to a habit. 
// Prob can hash habits by exact start time

// markcomplete:
// Shouldn't have the opportunity to mark it complete until it reopens. I guess to make it simple, at 00:00 the day, and the next day/week
// Need to add frequency paramater to addHabit for this. 
// And again for testing, add date parameter to completeHabit