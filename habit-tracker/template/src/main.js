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

    habitHeader.textContent = `${habitName.value}`;
    started.textContent = `Started ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    streak.textContent = `Current Streak: 40 days!`;
    b1.textContent = `Mark Complete`;
    b2.textContent = `View Details`;

    buttons.appendChild(b1);
    buttons.appendChild(b2);
    card.appendChild(habitHeader);
    card.appendChild(started);
    card.appendChild(streak);
    card.appendChild(buttons);

    cards.appendChild(card);

    // store Habit (not local yet)
    //const habitID = date.toISOString();
    //habits[habitId] = { /*habit content*/};


    // category function later
    const selectedCategory = categories.options[categories.selectedIndex];
    console.log(selectedCategory.value);
}

// function to calc streak. Basically did alr. But, need local storage for this to even matter. 
// Can test by adding parameter for date and inputting fake dates. Actually yeah we should do this before local storage implementation. 

// wait no, streaks would be from markcomplete. So need an array with dates associated to a habit. 
// Prob can hash habits by exact start time