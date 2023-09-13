const resultContainer = document.getElementById("result");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const mealList = document.querySelector(".meal-list");
const modalContainer = document.querySelector(".modal-container");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipeCloseBtn");


// API to fetch meal datat

const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

// Event listeners
searchBtn.addEventListener("click", performSearch)
searchInput.addEventListener("keyup", (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
    }
})

mealList.addEventListener('click', async (e) => {
    const card = e.target.closest('.meal-item');
    if (card) {
        const mealId = card.dataset.id
        const meal =  await getMealDetails(mealId);
        if (meal) {
            showMealDetailsPopup(meal);
        }
    }
})

async function performSearch() {
    const ingredient = searchInput.value.trim();
    if (ingredient) {
        const meals = await searchMealsByIngredient(ingredient);
        displayMeals(meals)
    }
}

async function searchMealsByIngredient(ingredient) {
    try {
        const response = await fetch (`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        const data = await response.json();
        return data.meals
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

async function getMealDetails(mealId){
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        const data = await response.json()
        return data.meals[0]
    } catch (error) {
        console.log("Error fetching meal details:", error)
    }
}

function displayMeals(meals) {
    mealList.innerHTML = ''
    if (meals) {
        meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.dataset.id = meal.idMeal
            mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <h3>${meal.strMeal}</h3>
            `;
            mealList.appendChild(mealItem)
        })
    } else {
        mealList.innerHTML = '<p>No meals found, please try another ingredient.</p>'
    }
}


function showMealDetailsPopup(meal) {
    const ingredients = getIngredients(meal);
    mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-ingredients">
            <h3>Ingredients:</h3>
            <ul>${ingredients}</ul>
        </div>
        <div class="recipe-instructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    modalContainer.style.display = 'block'

}

recipeCloseBtn.addEventListener('click', closeRecipeModal)

function closeRecipeModal() {
    modalContainer.style.display ='none'
}


// function showMealDetailsPopup(meal) {

//     if (!meal) {
//         resultContainer.innerHTML = '<h3>No meal found, please try again.</h3>';
//         return;
//     }
//     const ingredients = getIngredients(meal);
//     const recipeHtml = `
//         <div class="details">
//             <h2>${meal.strMeal}</h2>
//             <h4>${meal.strArea}</h4>
//         </div>
//         <a href="${meal.strSource}" target=	"_blank">
//         <img src=${meal.strMealThumb} alt=${meal.strMeal} />
//         </a>
//         <div id="ingre-container">
//             <h3>Ingredients:</h3>
//             <ul>${ingredients}</ul>
//         </div>
//         <div id="recipe">
//             <button id="hide-recipe">X</button>
//             <pre id="instructions">${meal.strInstructions}</pre>
//         </div>
//         <button id="show-recipe">View Recipe</button>
//     `;
//     resultContainer.innerHTML = recipeHtml;

//     const hideRecipeBtn = document.getElementById("hide-recipe");
//     hideRecipeBtn.addEventListener("click", hideRecipe);
//     const showRecipeBtn = document.getElementById("show-recipe");
//     showRecipeBtn.addEventListener("click", showRecipe);

//     searchContainer.style.opacity = '0';
//     searchContainer.style.display = 'none';
// }

// function searchMeal() {
//     const userInput = searchInput.value.trim();
//     if (!userInput) {
//         resultContainer.innerHTML = '<h3>Input field cannot be empty</h3>';
//         return
//     }

//     fetch(apiUrl + userInput)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data)
//             const meal = data.meals[0];
//             console.log(meal)

//             if (!meal) {
//                 resultContainer.innerHTML = '<h3>No meal found, please try again.</h3>';
//                 return;
//             }
//             const ingredients = getIngredients(meal);
//             const recipeHtml = `
//                 <div class="details">
//                     <h2>${meal.strMeal}</h2>
//                     <h4>${meal.strArea}</h4>
//                 </div>
//                 <a href="${meal.strSource}" target=	"_blank">
//                 <img src=${meal.strMealThumb} alt=${meal.strMeal} />
//                 </a>
//                 <div id="ingre-container">
//                     <h3>Ingredients:</h3>
//                     <ul>${ingredients}</ul>
//                 </div>
//                 <div id="recipe">
//                     <button id="hide-recipe">X</button>
//                     <pre id="instructions">${meal.strInstructions}</pre>
//                 </div>
//                 <button id="show-recipe">View Recipe</button>
//             `;
//             resultContainer.innerHTML = recipeHtml;

//             const hideRecipeBtn = document.getElementById("hide-recipe");
//             hideRecipeBtn.addEventListener("click", hideRecipe);
//             const showRecipeBtn = document.getElementById("show-recipe");
//             showRecipeBtn.addEventListener("click", showRecipe);

//             searchContainer.style.opacity = '0';
//             searchContainer.style.display = 'none';
//         })
//         .catch((err) => {
//             searchContainer.style.opacity = '1';
//             searchContainer.style.diplay = 'grid';
//             searchContainer.innerHTML = `<h3>Error fetching data.</h3>
//             <h3>${err}</h3>`;
//         })
// }

function getIngredients(meal) {
    let ingreHtml = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingreHtml += `<li>${measure} ${ingredient}</li>`
        }
        else {
            break;
        }
    }
    return ingreHtml;
}
 