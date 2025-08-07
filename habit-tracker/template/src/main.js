const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
/*                    0         1          2           3           4          5           6                   */

const habitsJson = localStorage.getItem("habits");
let habitsParsed = JSON.parse(habitsJson || "{}", (key, value) => { // startDate unusued but will be useful for completion statistics later
    if (key == "startDate") return new Date(value);
    if (key == "completionDates") return value.map(date => new Date(date));
    return value;
})
let habits = habitsParsed;

const cards = document.querySelector(".cards");
const addButton = document.querySelector(".add-habit");
const cardTemplate = document.querySelector("#card-template");
const sectionButtons = document.querySelector(".habits-list");
const mainSection = document.querySelector(".section1");
const completedSection = document.querySelector(".section2");


const hidden = document.querySelector("#detached-container");
const extenderTemplate = document.querySelector("#extender-template");
const extender = extenderTemplate.content.firstElementChild;
const saveButton = extender.querySelector(".save-habit");
const deleteButton = extender.querySelector(".delete-habit");
const inputTitle = extender.querySelector("#habit_name_input");
const inputTime = extender.querySelector("#time");
const repeatOptions = extender.querySelector(".repeat-options");
const daily = extender.querySelector(".daily");
const weekly = extender.querySelector(".weekly");
const none = extender.querySelector(".none");
const selectDaysTitle = extender.querySelector("#select-days-title");
const daysButtons = extender.querySelector(".days");




addButton.addEventListener("click", () => newHabit());
sectionButtons.addEventListener("click", (e) => {
    if (!e.target.classList.contains("selected") && e.target == mainSection) {
        mainSection.classList.add("selected");
        completedSection.classList.remove("selected");
        renderHabits("main");
    }
    else if (!e.target.classList.contains("selected") && e.target == completedSection) {
        completedSection.classList.add("selected");
        mainSection.classList.remove("selected");
        renderHabits("completed");
    }
});
renderHabits("main");

function extenderFill(habitId) {
    inputTitle.value = habits[habitId].name;
    inputTime.value = habits[habitId].reminderTime; //
    repeatSet(habits[habitId].repeat);
    renderDays(habits[habitId].repeatDays);
}

function repeatSet(option) {
    weekly.classList.remove("clicked");
    none.classList.remove("clicked");
    daily.classList.remove("clicked");
    selectDaysTitle.classList.remove("available");
    daysButtons.classList.remove("available");
    let clear = false;
    switch (option) {
        case "daily":
            option = daily;
            break;
        case "weekly":
            option = weekly;
            selectDaysTitle.classList.add("available");
            daysButtons.classList.add("available");
            break;
        case "none": 
            option = none;
            break;
        default: 
            clear = true;
    }
    if (!clear) option.classList.add("clicked");
}

function setDays(button, habitId) {
    if (typeof button === "string") button = daysButtons.querySelector(`#${button}`);
    const day = button.id;
    button.classList.toggle("clicked");
    if (!habits[habitId].repeatDays) habits[habitId]["repeatDays"] = []; // for cards created and stored with my old code  
    let repeatDays = habits[habitId].repeatDays; 
    const index = repeatDays.indexOf(day);
    if (index != -1) repeatDays.splice(index, 1);
    else repeatDays.push(button.id);
    localUpdate();
}

function renderDays(daysList) { 
    if (!daysList) throw new Error("input undefined");
    renderDaysEmpty();
    for (const day of daysList) {
        let button = daysButtons.querySelector(`#${day}`);
        button.classList.add("clicked");  
    }
}

function renderDaysEmpty() {
    for (const day of daysArray) {
        let button = daysButtons.querySelector(`#${day}`);
        button.classList.remove("clicked");  
    }
}

function getDayButton(day) {
    
}

function extenderClear() {
    inputTitle.value = "";
    inputTime.value = "10:00";  //
    repeatSet("daily");
    for (const day of daysArray) renderDaysEmpty();
}

function habitInteract(e, article, habitId) {
    const habitTop = article.querySelector(".habit-card-main");
    const completedStatus = article.querySelector(".status"); 
    const completionIcon = article.querySelector(".habit-icon"); 
    const percentInner = article.querySelector(".inner-circle");

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
    } else if (e.target == percentInner) { //console.log("inner pressed");
    } else if (repeatOptions.contains(e.target)) {
        if (e.target.classList.contains("daily")) {
            habits[habitId].repeat = "daily";
            repeatSet("daily");
        } else if (e.target.classList.contains("weekly")) {
            habits[habitId].repeat = "weekly";
            repeatSet("weekly");
        } else if (e.target.classList.contains("none")) {
            habits[habitId].repeat = "none";
            repeatSet("none");
        } else console.log("bugged repeat selector?");
        localUpdate();
    } else if (daysButtons.contains(e.target) && e.target != daysButtons) {
        setDays(e.target, habitId);
    } else if (habitTop.contains(e.target) && article.querySelector(".habit-card-extender")) {
        changeHabit(article);
        hidden.appendChild(extender);
    } else if (!article.querySelector(".habit-card-extender")) { 
        article.appendChild(extender);
        extenderFill(habitId);
    } 
}

function habitInteractDouble(e, article, habitId) {
    const habitTop = article.querySelector(".habit-card-main");
    const completionIcon = article.querySelector(".habit-icon"); 
    const percentInner = article.querySelector(".inner-circle");
    if (e.target == percentInner) {
        hidden.appendChild(extender);
        article.remove();
        delete habits[habitId]; 
        localStorage.setItem("habits", JSON.stringify(habits));
    }
}

function newHabit() {
    if (completedSection.classList.contains("selected")) {
        mainSection.dispatchEvent(new CustomEvent("click", {bubbles:true}));
    }
    const clone = cardTemplate.content.cloneNode(true);
    const article = clone.querySelector("article");
    const habitId = storeHabit(article);
    extenderClear(habitId);
    article.appendChild(extender);
    

    article.addEventListener("click", (e) => habitInteract(e, article, habitId));
    article.addEventListener("dblclick", (e) => habitInteractDouble(e, article, habitId)); /*temporary? can have warning popup that can be disabled permanently*/
    cards.appendChild(clone);
}

function renderHabits(section) {
    renderClear();
    let main = (section == "main") ? true : false;
    for (const habitId in habits) {
        const clone = cardTemplate.content.cloneNode(true);
        const article = clone.querySelector("article");
        
        const habitTop = article.querySelector(".habit-card-main");
        const completedStatus = article.querySelector(".status"); 
        const completionIcon = article.querySelector(".habit-icon"); 
        
        const timeframe = habits[habitId].repeat;
        const completionDates = habits[habitId].completionDates;
        const repeatDays = habits[habitId].repeatDays;
        const oneDayInMs = 1000 * 60 * 60 * 24;
        const today = new Date();

        article.dataset.habitId = habitId;  
        if (completionDates && isSameTimeframe(timeframe, repeatDays, today, completionDates.at(-1))) {
            completedStatus.textContent = "completed ☑️";
            completionIcon.classList.add("completed");
            if (main) continue;
        } else {
            if (!main) continue;
        }   

        article.addEventListener("click", (e) => habitInteract(e, article, habitId))
        article.addEventListener("dblclick", (e) => habitInteractDouble(e, article, habitId)); /*temporary?*/
        
        // from changehabit function
        const titleElement = article.querySelector(".habit-title");
        const timeElement = article.querySelector(".time");
        titleElement.textContent = habits[habitId].name;
        timeElement.textContent = convert24to12(habits[habitId].reminderTime || "10:00");

        cards.appendChild(clone);
    }
}

function renderClear() {
    cards.replaceChildren();
}

function localUpdate() {
    localStorage.setItem("habits", JSON.stringify(habits));
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
        repeat: "daily",
        repeatDays: [], //repeatDays: [daysArray[date.getDay()]] for now too comlpxe i leave in 2 min
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

function isSameTimeframe(repeat, repeatDays, date1, lastCompletedDate) { 
    if (!lastCompletedDate) return false;

    date1.setHours(0, 0, 0, 0);
    lastCompletedDate.setHours(0, 0, 0, 0);
    if (repeat === "daily") {
        return date1.getTime() === lastCompletedDate.getTime();
    }
    else if (repeat === "weekly") {
        for (const day of repeatDays) {
            const lastSuchDay = calcLastSuchDay(day);
            if (lastSuchDay > lastCompletedDate) return false;
        }
        return true;
    }
    else if (repeat === "none") {
        return true; 
    }
}

function calcLastSuchDay(day) {
    const today = new Date();
    const lastDayNumber = daysArray.indexOf(day);
    const todayNumber = today.getDay();
    let diff = todayNumber - lastDayNumber;
    if (diff < 0) diff += 7;
    const lastSuch = new Date();
    lastSuch.setDate(lastSuch.getDate() - diff);
    lastSuch.setHours(0,0,0,0);
    return lastSuch;
}

// function to calc streak. Basically did alr. But, need local storage for this to even matter. 
// Can test by adding parameter for date and inputting fake dates. Actually yeah we should do this before local storage implementation. 

// wait no, streaks would be from markcomplete. So need an array with dates associated to a habit. 
// Prob can hash habits by exact start time

// markcomplete:
// Shouldn't have the opportunity to mark it complete until it reopens. I guess to make it simple, at 00:00 the day, and the next day/week
// Need to add frequency paramater to addHabit for this. 
// And again for testing, add date parameter to completeHabit


// today - habits[habitId].completionDates.at(-1) < oneDayInMs)

