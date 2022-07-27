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

btnFilters.addEventListener('click', () => {

    
    if(colorFilterContainer.classList.contains('hide'))
    {
        colorFilterContainer.classList.remove('hide');
        typeFilterContainer.classList.remove('hide');
    }
    else
    {
        colorFilterContainer.classList.add('hide');
        typeFilterContainer.classList.add('hide');
        
    }
   
});

const btnTop = document.getElementById('btnTop');
btnTop.addEventListener('click', () => {
    window.scroll(0,0);
});

const infoContainer = document.getElementById('info-container');
textField.addEventListener('change', async (event) => {
    let parameters = '';
    let data;

    
    if(textField.value.length != 0)
    {
        parameters += `n=${textField.value}`;
        data = await getData(parameters);  
    }
    else{
        data = await getData();
    }
    
    showCards(data);
});

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
  if(response.status == 400){
    const data = null;
    return data;
  }
  else{
    const data = await response.json();
    return data;
  }
}

function showCards(cards = null, cleanContainer = true) {
  let counter = 0;
  if (cleanContainer) {
    cardContainer.innerHTML = "";
  }

  if (cards != null) {
    errorContainer.classList.add("hide");
    cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      const cardImage = document.createElement("img");
      cardImage.setAttribute("src", card.image_url);
      cardImage.setAttribute("alt", card.name);
      cardImage.addEventListener("click", () => {
        createDetailedCardView(card);
        infoContainer.classList.remove("hide");
      });
      cardDiv.appendChild(cardImage);
      cardContainer.appendChild(cardDiv);
    });
  } else {
    errorContainer.classList.remove("hide");
  }
}

async function initialize(){
    const cards = await getData();
    showCards(cards);
}

function createDetailedCardView(card){

    infoContainer.innerHTML = '';
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
        artistTitle.innerHTML ='Artist: ';
        var cardArtist = document.createElement('h4');
        cardArtist.innerHTML = card.artist;
        additionalInfoContainer.appendChild(artistTitle);
        additionalInfoContainer.appendChild(cardArtist);
    }
    const wikiaLink = document.createElement('a');
    wikiaLink.innerHTML = 'More info';
    wikiaLink.setAttribute('href', `https://digimoncardgame.fandom.com/wiki/${card.cardnumber}`);
    additionalInfoContainer.appendChild(wikiaLink);

    detailedTextContainer.classList.add('detailedInfo');
    detailedInfo.appendChild(detailedTextContainer);
    infoContainer.appendChild(detailedInfo);
    infoContainer.appendChild(additionalInfoContainer);
}

function replaceSpecialCharacters(text){
    let modifiedText = text.replaceAll('&lt;','<<');
    modifiedText = modifiedText.replaceAll('&gt;', '>>');
    modifiedText = modifiedText.replaceAll('&#91;','[');
    return modifiedText;
    
}
initialize();


let start = 0;
let end = 100;
let lastCard;

/* let observer = new IntersectionObserver((entries, observer)  => {
    
    entries.forEach(async (entry) => {
      if(entry.isIntersecting)
      {
        start = end + 1;
        end += 100;
        console.log(`Start: ${start}, End: ${end}`);
        const data = await getData();
        showCards(data);
      }  
    });

}, {
    rootMargin: '0px 0px 300px 0px',
    threshold: 1.0
} ); */