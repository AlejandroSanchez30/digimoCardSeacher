//API URL
const baseURL = 'https://digimoncard.io/api-public/search.php?sort=card_number&series=Digimon Card Game';

//getting elements
const cardContainer = document.getElementById('card-container');
const btnSearch = document.getElementById('searchButton');
const textField = document.getElementById('searchField');

//Filter cards by color
const colorFilters = document.querySelectorAll('.color-filter');
colorFilters.forEach(color => {
    color.addEventListener('click', async function (event) {
        let parameters = '';
        if(color.checked){
            uncheckOthersFilters(colorFilters, color.id);
            if(textField.value.length != 0)
            {
                parameters += `n=${textField.value}`;
                const activeType = checkActiveFilter(typeFilters);
                if(activeType != null){
                    parameters +=`&type=${activeType}`;
                }
                parameters +=`&color=${color.id}`;
            }
            else{
                const activeType = checkActiveFilter(typeFilters);
                console.log(activeType);
                if(activeType != null){
                    
                    parameters +=`&type=${activeType}&color=${color.id}`;
                }
                else{
                    parameters +=`color=${color.id}`;
                }
            }
        }
        else{
            if(textField.value.length =! 0)
            {
                parameters += `n=${textField.value}`;
                const colorActive = (checkActiveFilter(colorFilters));
                if(colorActive != null)
                {
                    parameters += `&color=${colorActive}`;
                }
            }
            else{
                const colorActive = (checkActiveFilter(colorFilters));
                if(colorActive != null)
                {
                    parameters += `&color=${colorActive}`;
                }
            }
        }
            const data = await getData(parameters);
            showCards(data);
})});


//Filter card by type
const typeFilters = document.querySelectorAll('.type-filter');
typeFilters.forEach(type => {
    type.addEventListener('click', async function () {
        let parameters = '';
        if(type.checked){
            uncheckOthersFilters(typeFilters, type.id);
            if(textField.value.length != 0)
            {
                parameters += `n=${textField.value}`;
                
                const colorActive = checkActiveFilter(colorFilters);
                if(colorActive != null)
                {
                    parameters += `&color=${colorActive}&type=${type.id}`;
                }
                else{
                    parameters +=`&type=${type.id}`;
                }
            }
            else{

                const colorActive = checkActiveFilter(colorFilters);
                
                if(colorActive != null)
                {
                    parameters += `color=${colorActive}&type=${type.id}`;
                }
                else{
                    parameters += `type=${type.id}`
                }
            }
        }
        else{
            if(textField.value.length != 0)
            {
                parameters += `n=${textField.value}`;
                const activeFilter = checkActiveFilter(colorFilters);
                if(activeFilter != null)
                {
                    parameters += `&color=${activeFilter}`;
                }
            }
            else
            {
                const activeFilter = checkActiveFilter(colorFilters);
                if(activeFilter != null)
                {
                    parameters += `&color=${activeFilter}`;
                }
            }
        }
        const data = await getData(parameters);
        showCards(data);
    });
    
});

function initializeFilters(filtersContainer)
{
    filtersContainer.forEach(filter => {
        filter.checked = false;
    });
}

function checkActiveFilter(filtersContainer)
{
    let id = null;
    filtersContainer.forEach(filter => {
        if(filter.checked)
        {
            id =  filter.id;
        }
    });
    return id;
    
}

function uncheckOthersFilters(filtersContainer, idActiveFilter)
{
    filtersContainer.forEach(filter => {
        if(filter.id != idActiveFilter){
            filter.checked = false;
        }
    });
}



btnSearch.addEventListener('click', async () => {
    initializeFilters(colorFilters);
    initializeFilters(typeFilters);
    const data = await getData('n=' + textField.value + '&');
    showCards(data);
}
);

textField.addEventListener('keydown', async function(event) {
    if(event.code == 'Enter')
    {
        initializeFilters(typeFilters);
        initializeFilters(colorFilters);
        const data = await getData('n=' + textField.value + '&');
        showCards(data);
    }
});




async function getData(urlParameters = "") {
  if (urlParameters.length != 0) {
    urlParameters += "&";
  }
  const response = await fetch(
    `https://digimoncard.io/api-public/search.php?${urlParameters}sort=card_set&series=Digimon Card Game`
  );
  const data = await response.json();
  return data;
}

function showCards(cards = "") {
  cardContainer.innerHTML = "";
  cards.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", card.image_url);
    cardImage.setAttribute("alt", card.name);

    cardDiv.appendChild(cardImage);
    cardContainer.appendChild(cardDiv);
  });
}

async function initialize(){
    const cards = await getData();
    showCards(cards);
}
initialize();
