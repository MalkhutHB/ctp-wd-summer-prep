const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let habits = {};

const cards = document.querySelector(".cards");
const addButton = document.querySelector(".create-button");
const habitName = document.querySelector("#habit_name");
const categories = document.querySelector("#categories");

addButton.addEventListener("click", () => addHabit(habitName, categories));

function addHabit(habitName, categories, date) {
    if (!habitName.value) throw new Error("User didn't enter name");
    const card = document.createElement("article");
    card.classList.add("habit-card") ;

    const habitHeader = document.createElement("h2");
    const started = document.createElement("p");
    const streak = document.createElement("p");
    const buttons = document.createElement("div");
    const b1 = document.createElement("button");
    const b2 = document.createElement("button");
    if (!date) date = new Date();

    habitHeader.textContent = habitName.value;
    started.textContent = `Started ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    streak.textContent = `Current Streak: 40 days!`;
    b1.textContent = `Mark Complete`;
    b2.textContent = `View Details`;
    b1.id = "complete";
    b2.id = "details";

    buttons.appendChild(b1);
    buttons.appendChild(b2);
    card.appendChild(habitHeader);
    card.appendChild(started);
    card.appendChild(streak);
    card.appendChild(buttons);

    cards.appendChild(card);


    // category function later
    const selectedCategory = categories.options[categories.selectedIndex];
    console.log(selectedCategory.value);

    // store Habit (not local yet)
    const habitId = date.toISOString();
    card.dataset.habitId = habitId;
    habits[habitId] = { 
        name: habitName.value,
        category: selectedCategory.value,
        startDate: date,
        completionDates: [],
    };

    // markcomplete event listener
    card.addEventListener("click", (e) => {
    if (e.target.id == "complete") { 
        completeHabit(card.dataset.habitId) ;
    };
});
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