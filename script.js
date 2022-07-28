//API URL
const baseURL = 'https://digimoncard.io/api-public/search.php?sort=card_number&series=Digimon Card Game';

//getting elements
const cardContainer = document.getElementById('card-container');
const btnSearch = document.getElementById('searchButton');
const textField = document.getElementById('searchField');
const errorContainer = document.getElementById('errorMessage');

const colorFilterContainer = document.getElementById('color-filters-container');
const typeFilterContainer = document.getElementById('type-filter-container');
const btnFilters = document.getElementById('buttonFilters');

const infoContainer = document.getElementById('info-container');
const colorFilters = document.querySelectorAll('.color-filter');
const typeFilters = document.querySelectorAll('.type-filter');

//UTILS

//Uncheck Color and Type filters 
function initializeFilters(filtersContainer)
{
    filtersContainer.forEach(filter => {
        filter.checked = false;
    });
}

//Returns the id of the active filter
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

//Receives an id uncheck all filters in the container except the filter with the id sent
function uncheckOthersFilters(filtersContainer, idActiveFilter)
{
    filtersContainer.forEach(filter => {
        if(filter.id != idActiveFilter){
            filter.checked = false;
        }
    });
}

//Call to the API
async function getData(urlParameters = "") {
    if (urlParameters.length != 0) {
      urlParameters += "&";
    }
    const response = await fetch(
      `https://digimoncard.io/api-public/search.php?${urlParameters}sort=card_set&series=Digimon Card Game`
    );
    if(response.status == 400){
      const data = null;
      return data;
    }
    else{
      const data = await response.json();
      return data;
    }
  }
  
  const imageSkeleton = document.getElementById('cardSkeleton');
//Display the cards received as parameter
function showCards(cards = null, cleanContainer = true) {
 if(cards != null)
 {
    if(cleanContainer)
    {
        cardContainer.innerHTML = '';
    }
    cards.forEach((card) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.classList.add("loading");
        const cardImage = document.createElement("img");
        cardImage.setAttribute("loading", "lazy");
        cardImage.setAttribute("src", card.image_url);
        cardImage.setAttribute("alt", card.name);
        cardImage.addEventListener("click", () => {
          createDetailedCardView(card);
          infoContainer.classList.remove("hide");
        });
        cardImage.addEventListener('load', () => {
          cardDiv.classList.remove('loading');
          console.log("image loaded");
        });
        
        cardDiv.appendChild(cardImage);
        cardContainer.appendChild(cardDiv);
        
    });
 }
}

//Creates a window with detailed information of the card sent as parameter
function createDetailedCardView(card){
  
      infoContainer.innerHTML = '';
      infoContainer.style.backgroundColor=`var(--card-${card.color})`;
      
      const br = document.createElement('br');
  
      const infoBar = document.createElement('div');
      infoBar.classList.add('infoBar');
  
      const numberContainer = document.createElement('h4');
      const cardNumber = document.createTextNode(card.cardnumber);
      numberContainer.appendChild(cardNumber);
  
      infoBar.appendChild(numberContainer);
  
      const rarityContainer = document.createElement('h4');
      const cardRarity = document.createTextNode(card.cardrarity);
      rarityContainer.appendChild(cardRarity);
      
      infoBar.appendChild(rarityContainer);
      
      const cardColor = document.createElement('h4');
      cardColor.innerHTML = `Color: ${card.color}`;
      infoBar.appendChild(cardColor);
  
      const typeContainer = document.createElement('h4');
      const cardType = document.createTextNode(card.type);
      typeContainer.appendChild(cardType);
  
      infoBar.appendChild(typeContainer);
  
      if(card.level != null)
      {
          const levelContainer = document.createElement('h4');
          const cardLevel = document.createTextNode(`Level: ${card.level}`);
          levelContainer.appendChild(cardLevel);
          infoBar.appendChild(levelContainer);
      }
      
      if(card.dp != null)
      {
          const dpContainer = document.createElement('h4');
          const cardDp = document.createTextNode(`DP: ${card.dp}`);
          dpContainer.appendChild(cardDp);
          infoBar.appendChild(dpContainer);
      }
  
      
  
      const btnCloseDetailedButton = document.createElement('button');
      //const closeSymbol  = document.createTextNode('<i class="fa-solid fa-xmark"></i>');
      btnCloseDetailedButton.innerHTML = '<i class="fa-solid fa-xmark"></i>'
      //btnCloseDetailedButton.appendChild(closeSymbol);
      btnCloseDetailedButton.classList.add('btnClose');
  
      btnCloseDetailedButton.addEventListener('click', () => 
      {
          infoContainer.classList.add('hide');
          cardContainer.classList.remove('hide');
  
          infoContainer.style.color=`var(--card-White)`;
          btnCloseDetailedButton.style.color = `var(--card-White)`;
      });
      infoBar.appendChild(btnCloseDetailedButton);
      
  
      infoBar.classList.add('infobar');
      infoContainer.appendChild(infoBar);
      
  
      const detailedInfo = document.createElement('div');
      const cardImage = document.createElement('img');
      cardImage.setAttribute('src', card.image_url);
  
      detailedInfo.appendChild(cardImage);
      detailedInfo.classList.add('detailed-info');
      
  
      const detailedTextContainer = document.createElement('div');
      
      const nameContainer = document.createElement('h1');
      const cardName = document.createTextNode(card.name);
      nameContainer.appendChild(cardName);
      detailedTextContainer.appendChild(nameContainer);
  
      if(card.play_cost != null)
      {
          const pcContainer = document.createElement('h3');
          const cardPc = document.createTextNode(`Play Cost: ${card.play_cost}`);
          pcContainer.appendChild(cardPc);
          detailedTextContainer.appendChild(pcContainer);
      }
      
  
      if(card.evolution_cost != null)
      {
          const evoCostContainer = document.createElement('h3');
          const cardEvoCost = document.createTextNode(`Evolution Cost: ${card.evolution_cost}`);
          evoCostContainer.appendChild(cardEvoCost);
          evoCostContainer.appendChild(br);
          detailedTextContainer.appendChild(evoCostContainer);
      }
      
      if(card.maineffect != null){
          const mainEffectContainer = document.createElement('h2');
          const cardMainEffect = document.createTextNode('Main Effect: ');
          const meTextContainer = document.createElement('p');
          const cardMEText = document.createTextNode(replaceSpecialCharacters(card.maineffect));
          mainEffectContainer.appendChild(cardMainEffect);
          meTextContainer.appendChild(cardMEText);
          meTextContainer.appendChild(br);
          detailedTextContainer.append(mainEffectContainer);
          detailedTextContainer.append(meTextContainer);
      }
  
      if(card.soureeffect != null)
      {
          const sourceEffectContainer = document.createElement('h2');
          const cardSourceEffect = document.createTextNode('Source Effect: ');
          sourceEffectContainer.appendChild(cardSourceEffect);
      
          const seTextContainer = document.createElement('p');
          const CardSEText = document.createTextNode(replaceSpecialCharacters(card.soureeffect));
          seTextContainer.appendChild(CardSEText);
  
          detailedTextContainer.append(sourceEffectContainer);
          detailedTextContainer.append(seTextContainer);
      }
  
      let additionalInfoContainer = document.createElement('div');
      additionalInfoContainer.classList.add('additional-info-container')
      if(card.artist != null)
      {
          //additionalInfoContainer = document.createElement('div');
          ;
          var artistTitle = document.createElement('h2');
          artistTitle.innerHTML =`Artist: ${card.artist}`;
          additionalInfoContainer.appendChild(artistTitle);
      }
      const wikiaLink = document.createElement('a');
      wikiaLink.innerHTML = 'More info';
      wikiaLink.setAttribute('href', `https://digimoncardgame.fandom.com/wiki/${card.cardnumber}`);
      additionalInfoContainer.appendChild(wikiaLink);
  
      detailedTextContainer.classList.add('detailedInfo');
      detailedInfo.appendChild(detailedTextContainer);
      infoContainer.appendChild(detailedInfo);
      infoContainer.appendChild(additionalInfoContainer);
  
      if(card.color == 'White' || card.color == 'Yellow')
      {
          infoContainer.style.color=`var(--card-Black)`;
          btnCloseDetailedButton.style.color = `var(--card-Black)`;
      }
  }

//Replaces the hmtl entities for '<<', '>>' o '['
function replaceSpecialCharacters(text){
      let modifiedText = text.replaceAll('&lt;','<<');
      modifiedText = modifiedText.replaceAll('&gt;', '>>');
      modifiedText = modifiedText.replaceAll('&#91;','[');
      return modifiedText;
      
  }

//Checks the input text and checkboxes and gets the parameters
//to make the call to the API
function getSearchParameters() {
    let parameters = "";
    let colorActive = checkActiveFilter(colorFilters);
    let typeActive = checkActiveFilter(typeFilters);
  
    console.log("color: " + colorActive);
    if (textField.value.length > 0) {
      parameters += `n=${textField.value}`;
      if (colorActive != null) {
        parameters += `&color=${colorActive}`;
        if (typeActive != null) {
          parameters += `&type=${typeActive}`;
        }
      } else {
        if (colorActive != null) {
          parameters += `color=${colorActive}`;
        } else {
          if (typeActive != null) {
            parameters += `type=${typeActive}`;
          }
        }
      }
    } else {
      if (colorActive != null) {
        parameters += `color=${colorActive}`;
        if (typeActive != null) {
          parameters += `&type=${typeActive}`;
        }
      } else {
        if (typeActive != null) {
          parameters += `type=${typeActive}`;
        }
      }
    }
    return parameters;
  }  

//
function createImageSkeleton(quantity = 1)
{
    for(let counter = 0; counter < quantity; counter++)
    {
        const containerSkeleton = document.createElement('div');
        containerSkeleton.classList.add('card-container-loading');
        cardContainer.appendChild(containerSkeleton);
    }
}

  
//Event listeners----------------------------------------------------------------------------------

//Hide or show filters
btnFilters.addEventListener('click', async () => {
    
    if(colorFilterContainer.classList.contains('hide'))
    {
        colorFilterContainer.classList.remove('hide');
        typeFilterContainer.classList.remove('hide');
    }
    else
    {
        initializeFilters(colorFilters);
        initializeFilters(typeFilters);
        colorFilterContainer.classList.add('hide');
        typeFilterContainer.classList.add('hide');
        let data = null;
        let parameters = getSearchParameters();
        data = await getData(parameters);
        showCards(data);
    }
});

//Go to the top of the page 
const btnTop = document.getElementById('btnTop');
btnTop.addEventListener('click', () => {
    window.scroll(0,0);
});

//Filter cards by color
colorFilterContainer.addEventListener("click", async function (event) {
  if (event.target && event.target.tagName == "INPUT") {
    uncheckOthersFilters(colorFilters, event.target.id);
    let parameters = getSearchParameters();
    const data = await getData(parameters);
    showCards(data);
  }
}); 

//Filter card by type
typeFilterContainer.addEventListener('click', async function(event){
    if(event.target && event.target.tagName == 'INPUT')
    {
        uncheckOthersFilters(typeFilters, event.target.id);
        let parameters = getSearchParameters();
        const data = await getData(parameters);
        showCards(data);
    }
});

//Search cards when "Search" button is pressed
btnSearch.addEventListener('click', async () => {
    initializeFilters(colorFilters);
    initializeFilters(typeFilters);
    
    const data = await getData(getSearchParameters());
    showCards(data);
}
);

//Search cards when "Enter" key is pressed
textField.addEventListener('keydown', async function(event) {
    if(event.code == 'Enter')
    {
        initializeFilters(typeFilters);
        initializeFilters(colorFilters);
        const parameters = getSearchParameters();
        const data = await getData(parameters);
        showCards(data);
    }
});

async function initialize(){
    const cards = await getData();
    showCards(cards, true);
}

initialize();

