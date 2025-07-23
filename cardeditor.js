try { const md = require('markdown-it') }
catch { console.log("Fail") }

// make text input affect card text
const editCardTextEvent = (element, hasStroke) => {
  const inputCardText = document.getElementById(`input-${element}`)
  const cardText = document.getElementById(element)
  // on reload, remove text from input
  // ideally you would keep everything but that's a lot harder
  inputCardText.value = ""
    inputCardText.addEventListener("input", function (event) {
        inputCardText.value = event.target.value.replace("$/inf", "∞")
        cardText.textContent = event.target.value
  })
    if (hasStroke) {
        const cardStroke = document.getElementById(`${element}-stroke`)
        inputCardText.addEventListener("input", function (event) {
            cardStroke.textContent = event.target.value
        })
    }
}

const editAbilityTextEvent = (element, hasStroke) => {
    const inputCardText = document.getElementById(`input-${element}`)
    // on reload, remove text from input
    // ideally you would keep everything but that's a lot harder
    inputCardText.value = ""
    inputCardText.addEventListener("input", function (event) {
        inputCardText.value = event.target.value.replace("$/inf", "∞")
        const cardText = document.getElementById(`${element}-${abilityOptions.value}`)
        cardText.textContent = event.target.value
    })
    if (hasStroke) {
        
        inputCardText.addEventListener("input", function (event) {
            const cardStroke = document.getElementById(`${element}-stroke-${abilityOptions.value}`)
            cardStroke.textContent = event.target.value
        })
    }
}

const switchAbilityToEdit = () => {

}
const addKeyword = () => {
    let finalDescription = keywords[keywordDropdown.value].Description.replace("{VALUE}", keywordValue.value)
    keywordDescription.textContent = finalDescription
    let finalTitle = keywords[keywordDropdown.value].Title.replace("{VALUE}", keywordValue.value)
    keywordTitle.textContent = finalTitle
    keywordTitleStroke.textContent = finalTitle
    keywordImg.src = `src/img/Keyword/${keywordDropdown.value}.png`
    let newKeyword = keywordElement.cloneNode(true)
    newKeyword.style.display = "flex"
    let addedKeyword = keywordHolder.appendChild(newKeyword)
    keywordList.push(addedKeyword)
    keywordListData.push({keyword: keywordDropdown.value, value: keywordValue.value})
}

const LongMax = (numArray) => {
    let largest = numArray[0]
    for (let i = 1; i < numArray.length; i++) {
        if (numArray[i] > largest) largest = numArray[i]
    }
    return largest;
}


const addAbility = () => {
    let i = 1
    while (abilityArray.includes(i) || i < LongMax(abilityArray)) i++
    for (let property in abilityElement) {
        abilityElement[property].id = `${abilityElementIDs[property]}-${i}`
    }

    let newOption = document.createElement("option")
    newOption.value = i
    newOption.textContent = `Ability ${i}`
    newOption.id = `ability-option-${i}`
    abilityOptions.appendChild(newOption)

    abilityElement.Name.textContent = `Ability ${i}`
    abilityElement.NameStroke.textContent = `Ability ${i}`
    abilityElement.Description.textContent = `Ability Description`
    abilityElement.Element.style.order = `${i}`

    let newAbility = abilityElement.Element.cloneNode(true)
    newAbility.style.display = "flex"
    abilityHolder.appendChild(newAbility)
    abilityOptions.value = i

    for (let property in abilityElement) {
        abilityElement[property].id = `${abilityElementIDs[property]}`
    }

    abilityArray.push(i)
    refreshSelectedAbility()
    toggleAbilityInputs()
}

const removeAbility = () => {
    if (abilityArray.length <= 0) return;
    let index = abilityArray.indexOf(Number(abilityOptions.value))
    const removedAbility = document.getElementById(`ability-element-${abilityOptions.value}`)
    const removedAbilityOption = document.getElementById(`ability-option-${abilityOptions.value}`)
    removedAbility.remove()
    removedAbilityOption.remove()
    abilityArray.splice(index, 1)

    if (abilityArray.length != 0) refreshSelectedAbility();
    toggleAbilityInputs()
}

async function addDraftAbilities(Abilities) {
    while (abilityArray.length > 0) removeAbility()
    for (let k in Abilities) {
        let i = 1
        while (abilityArray.includes(i) || i < LongMax(abilityArray)) i++
        for (let property in abilityElement) {
            abilityElement[property].id = `${abilityElementIDs[property]}-${i}`
        }
        const ability = Abilities[k]
        let newOption = document.createElement("option")
        newOption.value = i
        newOption.textContent = `Ability ${i}`
        newOption.id = `ability-option-${i}`
        abilityOptions.appendChild(newOption)
        abilityElement.Name.textContent = ability.Name
        abilityElement.NameStroke.textContent = ability.Name
        abilityElement.Description.textContent = ability.Description
        abilityElement.Element.style.order = `${i}`
        abilityElement.Cost.textContent = ability.Cost
        abilityElement.CostStroke.textContent = ability.Cost
        abilityElement.Button.src = ability.Button

        let loadImgPromise = new Promise(
            function (resolve) { addDraftImagePromise(ability.Icon, abilityElement.Icon, resolve) })
        const n = await loadImgPromise
        let newAbility = abilityElement.Element.cloneNode(true)
        newAbility.style.display = "flex"
        abilityHolder.appendChild(newAbility)
        abilityOptions.value = i

        const nameContainerID = abilityElement.NameContainer.id
        const descriptionID = abilityElement.Description.id

        for (let property in abilityElement) {
            abilityElement[property].id = `${abilityElementIDs[property]}`
        }

        fitTextToHeight(document.getElementById(nameContainerID), 1.225, 35)
        fitTextToHeight(document.getElementById(descriptionID), 1.2, 56)

        abilityArray.push(i)
        refreshSelectedAbility()
        toggleAbilityInputs()
    }
    abilityElement.Icon.src = "src/img/None.png"
}

const refreshSelectedAbility = () => {
    const abilityButton = document.getElementById(`ability-icon-button-${abilityOptions.value}`)
    const abilityName = document.getElementById(`ability-name-${abilityOptions.value}`)
    const abilityDescription = document.getElementById(`ability-description-${abilityOptions.value}`)
    const bloontoniumCost = document.getElementById(`bloontonium-cost-${abilityOptions.value}`)

    abilityNameInput.value = abilityName.textContent
    abilityDescriptionInput.value = abilityDescription.textContent
    bloontoniumCostInput.value = bloontoniumCost.textContent
    passiveToggle.checked = abilityButton.src.includes("Passive")
}

const toggleAbilityInputs = () => {
    const isDisabled = abilityArray.length == 0
    inputAbilityEnabled.classList.toggle("disabled-text", isDisabled)
    abilityNameInput.disabled = isDisabled
    abilityDescriptionInput.disabled = isDisabled
    passiveToggle.disabled = isDisabled
    bloontoniumCostInput.disabled = isDisabled
    abilityIconUpload.disabled = isDisabled
    abilityOptions.disabled = isDisabled
    moveAbilityUp.disabled = isDisabled
    moveAbilityDown.disabled = isDisabled
}

const moveAbility = (movement) => {
    const selectedValue = abilityOptions.value;
    const selectedIndex = abilityArray.indexOf(Number(selectedValue));
    const movedIndex = selectedIndex + movement;
    console.log(abilityArray);
    if (movedIndex >= abilityArray.length || movedIndex < 0) return;
    const movedValue = abilityArray[movedIndex];
    console.log(`selected value: ${selectedValue}, moved value: ${movedValue}`);

    const selectedElement = document.getElementById(`ability-element-${selectedValue}`);
    const movedElement = document.getElementById(`ability-element-${movedValue}`);
    const selectedOption = document.getElementById(`ability-option-${selectedValue}`);
    const movedOption = document.getElementById(`ability-option-${movedValue}`);


    [selectedElement.style.order, movedElement.style.order] = [movedElement.style.order, selectedElement.style.order];
    [selectedOption.textContent, movedOption.textContent] = [movedOption.textContent, selectedOption.textContent];
    [selectedOption.value, movedOption.value] = [movedOption.value, selectedOption.value];
    [selectedOption.id, movedOption.id] = [movedOption.id, selectedOption.id];
    [abilityArray[selectedIndex], abilityArray[movedIndex]] = [abilityArray[movedIndex], abilityArray[selectedIndex]];

    abilityOptions.value = selectedValue;
}
const removeKeyword = () => {
    if (keywordList.length > 0) {
        keywordList[keywordList.length - 1].remove()
        keywordList.pop()
        keywordListData.pop()
    }
}

const togglePassive = () => {
    passiveToggle.checked = false
    passiveToggle.addEventListener("input", function (event) {
        const abilityButton = document.getElementById(`ability-icon-button-${abilityOptions.value}`)
        if (passiveToggle.checked) abilityButton.src = "src/img/HeroCreator/PassiveAbilityButton.png"
        else abilityButton.src = "src/img/HeroCreator/ActiveAbilityButton.png"
    })
}

const toggleBloontoniumCost = () => {
    const BloontoniumToggle = document.getElementById("bloontonium-toggle")
    const Coins = document.getElementsByClassName("cost")
    const CostText = document.getElementById("cost-text-container")
    BloontoniumToggle.checked = false
    BloontoniumToggle.addEventListener("input", function (event) {
        let CostImg = "src/img/CardIcon/Coin.png"
        let CostTop = "4%"
        if (BloontoniumToggle.checked) {
            CostImg = "src/img/CardIcon/Bloontonium.png"
            CostTop = "5%"
        }
        for (let i = 0; i < Coins.length - 1; i++) {
            Coins[i].src = CostImg
            Coins[i].style.top = CostTop
        }
        CostText.style.top = CostTop
    })
}

const toggleDetails = () => {
    detailCheckbox.checked = false
    keywordDropdown.disabled = true
    keywordValue.disabled = true
    addKeywordBtn.disabled = true
    removeKeywordBtn.disabled = true
    inputFlavorText.disabled = true
    keywordDropdown.value = "Defender"
    cardJustifier.style.justifyContent = "center"
    inputFlavorText.value = ""
    keywordValue.value = 0
    var checked = false
    detailCheckbox.addEventListener("input", function (event) {
        if (checked != detailCheckbox.checked) {
            checked = detailCheckbox.checked
            inputDetailEnabled.classList.toggle("disabled-text")
        }
        if (detailCheckbox.checked) {
            cardContainer.style.width = "775px"
            detailBox.style.display = "flex"
            keywordDropdown.disabled = false
            keywordValue.disabled = false
            addKeywordBtn.disabled = false
            removeKeywordBtn.disabled = false
            inputFlavorText.disabled = false
            // flavorText.style.visibility = "hidden"
            cardJustifier.style.justifyContent = ""

        }
        else {
            cardContainer.style.width = "375px"
            detailBox.style.display = "none"
            keywordDropdown.disabled = true
            keywordValue.disabled = true
            addKeywordBtn.disabled = true
            removeKeywordBtn.disabled = true
            inputFlavorText.disabled = true
            // flavorText.style.visibility = "visible"
            cardJustifier.style.justifyContent = "center"
        }
    })
}


// make dropdown affect card images
const editDropdownEvent = (ID, folderName) => {
    const Dropdown = document.getElementById(`${ID}-dropdown`)
    const DropdownImg = document.getElementById(`${ID}`)
    // on reload, the empty image is selected by default
    Dropdown.value = "None"
    Dropdown.addEventListener("change", function (event) {
    DropdownImg.src = `src/img/${folderName}/${Dropdown.value}.png`})
}

const editAbilityOptionEvent = () => {
    abilityOptions.addEventListener("input", function (event) {
        refreshSelectedAbility()
    })
}

const editImagePositionEvent = (ID, variable) => {
    const positionInput = document.getElementById(ID)
    positionInput.value = 0
    positionInput.addEventListener("input", function (event) {
        cardImageValues[variable] = parseFloat(positionInput.value)
        updateCardImage()
    })
}

const editImageScaleEvent = (ID, variable) => {
    const scaleInput = document.getElementById(ID)
    scaleInput.addEventListener("input", function (event) {
        cardImageValues[variable] = parseFloat(scaleInput.value * imgSize / 100)
        updateCardImage()
    })
}

const toggleKeepRatio = () => {
    const keepRatioCheckbox = document.getElementById(`ratio-toggle`)
    keepRatioCheckbox.checked = true;
    keepRatioCheckbox.addEventListener("input", function (event) {
        updateCardImage()
    })
}

const resetImageValues = () => {
    cardImageValues.x = 0
    cardImageValues.y = 0
    cardImageValues.w = imgSize
    cardImageValues.h = imgSize
    document.getElementById(`x-input`).value = 0
    document.getElementById(`y-input`).value = 0
    document.getElementById(`w-input`).value = 100
    document.getElementById(`h-input`).value = 100
    updateCardImage()
}

var descriptionMaxHeight = 250

const editDescriptionEvent = () => {
    const DescriptionBox = document.getElementById("input-description-text")
    DescriptionBox.addEventListener("input", function (event) {
        fitTextToHeight(cardDescriptionText, 3.2, descriptionMaxHeight)
    })
}

const editHeroNameEvent = () => {
    const heroNameContainer = document.getElementById("hero-name-container")
    const heroNameInput = document.getElementById("input-hero-name")
    
    heroNameInput.addEventListener("input", function (event) {
        fitTextToHeight(heroNameContainer, 2, 41)
    })
}

const editAbilityNameEvent = () => {
    abilityNameInput.addEventListener("input", function (event) {
        const option = document.getElementById(`ability-option-${abilityOptions.value}`)
        option.textContent = abilityNameInput.value
        fitTextToHeight(document.getElementById(`ability-name-container-${abilityOptions.value}`), 1.225, 35)
    })
}

const editAbilityDescriptionEvent = () => {
    const abilityDescriptionInput = document.getElementById("input-ability-description")
    abilityDescriptionInput.addEventListener("input", function (event) {
        fitTextToHeight(document.getElementById(`ability-description-${abilityOptions.value}`), 1.2, 56)
    })
}

const fitTextToHeight = (TextHTML, initFontSize, maxHeight) => {
    let newFontSize = initFontSize
    TextHTML.style.fontSize = `${newFontSize}em`
    while (TextHTML.clientHeight > maxHeight)
    {
        newFontSize -= 1.0 / 16.0
        TextHTML.style.fontSize = `${newFontSize}em`
    }
    return newFontSize
}


// set as many coins visible
const setCoinQuantity = () => {
  const coins = document.getElementsByClassName("cost")
   const coinCount = copiesSlider.value;
  const copiesText = document.getElementById("copies-label")
  for (let coin_i = 0; coin_i < coins.length; coin_i++) {
    coins[coin_i].style.visibility = coin_i < coinCount ? "visible" : "hidden"
  }
  copiesText.textContent = `Copies: ${coinCount}`
  if (coinCount > 3) copiesText.textContent = `Copies: 3+`
}

const toggleVisibility = (element, isVisible) => {
  element.style.visibility = isVisible ? "visible" : "hidden";
};

const toggleVisibilities = (cardTypeObj) => {
  toggleVisibility(cardDamage, cardTypeObj.damageVisibility);
  toggleVisibility(cardDamageTextContainer, cardTypeObj.damageVisibility);
  toggleVisibility(cardAmmo, cardTypeObj.ammoVisibility);
  toggleVisibility(cardAmmoTextContainer, cardTypeObj.ammoVisibility);
  toggleVisibility(cardDelay, cardTypeObj.delayVisibility);
  toggleVisibility(cardDelayTextContainer, cardTypeObj.delayVisibility);
}
// card art properties for every card type
const cardTypes = {
  monkey: {
    borderSrc: "src/img/Border/MonkeyCardBorder.png",
    damageSrc: "src/img/CardIcon/MonkeyDamage.png",
    imgHeight: "96%",
    imgWidth: "92%",
    damageLeft: "90%",
    damageTop: "4%",
    imgTransform: "translate(-50%, 2.2%)",
    imgBorderRadius: "10%",
    borderOffset: "translate(0%, -0.8%)",
    imgObjFit: "cover",
    delayTop: "36%",
    delayLeft: "95%",
    delayFontSize: "4em",
    classPinLeft: "7%",
    classPinTop: "24%",
    heroPinLeft: "50%",
    heroPinTop: "0%",
    titleBottom: "45.25%",
    classTop: "57%",
    descriptionTop: "74%",
    damageVisibility: true,
    ammoVisibility: true,
    delayVisibility: true
  },
  bloon: {
    borderSrc: "src/img/Border/BloonCardBorder.png",
    damageSrc: "src/img/CardIcon/BloonDamage.png",
    imgHeight: "55%",
    imgWidth: "75%",
    damageLeft: "88%",
    damageTop: "4%",
    imgTransform: "translate(-50%, -7%)",
    borderOffset: "translate(0%, -7.25%)",
    classPinLeft: "9%",
    classPinTop: "39%",
    heroPinLeft: "89%",
    heroPinTop: "39.5%",
    imgBorderRadius: "50%",
    imgObjFit: "fill",
    delayTop: "22.25%",
    delayLeft: "94%",
    delayFontSize: "6em",
    titleBottom: "42.25%",
    classTop: "60%",
    descriptionTop: "77.5%",
    damageVisibility: true,
    ammoVisibility: false,
    delayVisibility: true
  },
  power: {
    borderSrc: "src/img/Border/PowerCardBorder.png",
    imgHeight: "55%",
    imgWidth: "86%",
    imgTransform: "translate(-51%, -7%)",
    borderOffset: "translate(0%, -7.25%)",
    classPinLeft: "9%",
    classPinTop: "39%",
    heroPinLeft: "89%",
    heroPinTop: "39.5%",
    imgBorderRadius: "41%",
    imgObjFit: "fill",
    titleBottom: "42.25%",
    classTop: "60%",
    descriptionTop: "77.5%",
    damageVisibility: false,
    ammoVisibility: false,
    delayVisibility: false,
    },
  hero: {
      isHero: true,
    }
};

const keywords = {
    Armor: {
        Title: "Armor {VALUE}",
        OptionTitle: "Armor",
        Description: "Reduce damage recieved by {VALUE}",
    },
    ArmorPiercing: {
        Title: "Armor Piercing",
        Description: "Hit Bloons lose all Armor",
    },
    Defender: {
        Title: "Defender +{VALUE}",
        OptionTitle: "Defender",
        Description: "Can defend on opponent's turn, has +{VALUE} damage on opponent's turn.",
    },
    DoubleAttack: {
        Title: "Double Attack",
        Description: "Attacks twice.",
    },
    TripleAttack: {
        Title: "Triple Attack",
        Description: "Attacks three times."
    },
    Doomed: {
        Title: "Doomed",
        Description: "This Monkey will be removed at the start of its next turn.",
    },
    Immobile: {
        Title: "Immobile",
        Description: "Cannot increase or decrease delay. Cannot attack",
    },
    MustPop: {
        Title: "Must Pop",
        Description: "Monkey must attack this Bloon before others"
    },
    OnDamaged: {
        Title: "On Damaged",
        Description: "Triggers on losing health from any source",
    },
    OnDestroyed: {
        Title: "On Destroyed",
        Description: "Triggers when Bloon is Popped (by damage or effect) or when it hits opposing Hero.",
    },
    OnFire: {
        Title: "On Fire",
        Description: "Will take 30 damage at the end of its turn and before attacking.",
    },
    OnLeak: {
        Title: "On Leak",
        Description: "Triggers when a bloon attacks a hero (after defenders have acted).",
    },
    OnPlay: {
        Title: "On Play",
        Description: "Triggers when card is played",
    },
    OnPopped: {
        Title: "On Popped",
        Description: "Triggers when Bloon is Popped (by damage or effect). Does not trigger if Bloon hits opposing Hero.",
    },
    OnAttack: {
        Title: "On Attack",
        Description: "Triggers when this Monkey attacks.",
    },
    OnReload: {
        Title: "On Reload",
        Description: "Triggers when this Monkey reloads.",
    },
    OnReplace: {
        Title: "On Replace",
        Description: "Triggers when this Monkey is replaced by another Monkey.",
    },
    OnTurnStart: {
        Title: "On Turn Start",
        Description: "Triggers at start of turn",
    },
    OnTurnEnd: {
        Title: "On Turn End",
        Description: "Triggers once turn has ended",
    },
    Pick: {
        Title: "Pick {VALUE}",
        OptionTitle: "Pick",
        Description: "Look at the next {VALUE} cards in your deck. Choose one and add it to your hand. Other cards go to the bottom of your deck.",
    },
    Shield: {
        Title: "Shield {VALUE}",
        OptionTitle: "Shield",
        Description: "Shield will block {VALUE} incoming damage.",
    },
    SplashDamage: {
        Title: "Splash Damage",
        Description: "Also deals damage to Bloons on either side of the target"
    },
    Stunned: {
        Title: "Stunned",
        Description: "Monkey can't attack or reload until stun wears off. Bloon delay does not reduce at end of turn.",
    },
    Temporary: {
        Title: "Temporary",
        Description: "Is removed at end of turn after ammo reaches 0."
    },
    TemporaryAmmo: {
        Title: "Temporary Ammo",
        Description: "Extra ammo that is removed at the start of the turn"
    },
    Unique: {
        Title: "Unique",
        Description: "You can only have one copy of this card.",
    },
    AcidPool: {
        Title: "Acid Pool",
        Description: "Deals 30 damage to any Bloon ending its turn on it. Lasts 2 turns"
    },
    StrongAcidPool: {
        Title: "Strong Acid Pool",
        Description: "Deals 50 damage to any Bloon ending its turn on it. Lasts 2 turns"
    },
    ZeroGold: {
        Title: "Zero Gold",
        Description: "Triggers an additional effect if you have 0 Gold"
    }
}

const setKeywordOptions = () => {
    for (let keyword in keywords) {
        var keywordOption = document.createElement("option")
        keywordOption.value = keyword
        if (keywords[keyword].OptionTitle) keywordOption.textContent = keywords[keyword].OptionTitle
        else keywordOption.textContent = keywords[keyword].Title
        keywordDropdown.add(keywordOption)
    }
}

const loadDraft = (event) => {
    const fileList = event.target.files;
    const firstFile = fileList[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const cardData = JSON.parse(event.target.result)
        if (cardData.isHero) heroDraftLoaded(cardData)
        else draftLoaded(cardData)
    }

    if (firstFile.type.startsWith("application/json")) reader.readAsText(firstFile)
}

const heroDraftLoaded = (cardData) => {
    updateCardLayout(cardData.Type)

    setCardValue("input-hero-name", cardData.Title)
    fitTextToHeight(document.getElementById("hero-name-container"), 2, 41)
    setToggleCheck("enable-portrait-toggle", cardData.PortraitEnabled)
    const heroPortrait = document.getElementById("hero-portrait")
    addDraftImage(cardData.Image, heroPortrait, "src/img/HeroCreator/EmptyPortrait.png")
    addDraftAbilities(cardData.Abilities)
}

const draftLoaded = (cardData) => {
    updateCardLayout(cardData.Type)
    setCardValue("input-title-text", cardData.Title)
    setCardValue("input-cost-text", cardData.Cost)
    setCardValue("input-damage-text", cardData.Damage)
    setCardValue("input-delay-text", cardData.Delay)
    setCardValue("input-ammo-text", cardData.Ammo)
    setCardValue("copies-slider", cardData.Copies)
    setCardValue("input-class-text", cardData.Class)
    setCardValue("rarity-pin-dropdown", cardData.Rarity)
    setCardValue("hero-pin-dropdown", cardData.Hero)
    setCardValue("class-pin-dropdown", cardData.ClassPin)

    setCardValue("input-description-text", cardData.Description)
    fitTextToHeight(cardDescriptionText, 3.2, descriptionMaxHeight)

    setCardValue("input-flavor-text", cardData.Flavor)
    setToggleCheck("damage-checkbox", cardData.hasDamage)
    setToggleCheck("temporary-toggle", cardData.hasAmmo)
    setToggleCheck("bloontonium-toggle", cardData.costsBloontonium)
    setToggleCheck("detail-toggle", cardData.isDetailsEnabled)
    setMonkeyStatVisibility()
    storedImg = document.createElement("img");
    addDraftImage(cardData.Image, storedImg)

    setCardValue("x-input", cardData.ImageTransform[0])
    setCardValue("y-input", cardData.ImageTransform[1])
    setCardValue("w-input", cardData.ImageTransform[2])
    setCardValue("h-input", cardData.ImageTransform[3])
    setToggleCheck("ratio-toggle", cardData.KeepRatio)
    updateCardImage()
    addDraftKeywords(cardData.Keywords)
}

function addDraftImage(imgData, imgSrc, emptyImg = "src/img/None.png") {
    if (imgData) {
        const newImg = document.createElement("img");
        newImg.crossOrigin = "anonymous";
        newImg.src = imgData;
        newImg.onload = function () {
            imgSrc.src = newImg.src
        }
    }
    else
    {
        imgSrc.src = emptyImg
    }
}

function addDraftImagePromise(imgData, imgSrc, resolve, emptyImg = "src/img/None.png") {
    if (imgData) {
        const newImg = document.createElement("img");
        newImg.crossOrigin = "anonymous";
        newImg.src = imgData;
        newImg.onload = function () {
            imgSrc.src = newImg.src
            resolve("Loaded Image")
        }
    }
    else {
        imgSrc.src = emptyImg
        resolve("Loaded Nothing")
    }
}

const addDraftKeywords = (Keywords) => {
    while (keywordList.length > 0) removeKeyword()
    for (let i = 0; i < Keywords.length; i++) {

        let Keyword = Keywords[i].keyword
        let Value = Keywords[i].value

        let finalDescription = keywords[Keyword].Description.replace("{VALUE}", Value)
        keywordDescription.textContent = finalDescription

        let finalTitle = keywords[Keyword].Title.replace("{VALUE}", Value)
        keywordTitle.textContent = finalTitle
        keywordTitleStroke.textContent = finalTitle

        keywordImg.src = `src/img/Keyword/${Keyword}.png`
        let newKeyword = keywordElement.cloneNode(true)
        newKeyword.style.display = "flex"
        let addedKeyword = keywordHolder.appendChild(newKeyword)
        keywordList.push(addedKeyword)
        keywordListData.push({ keyword: Keyword, value: Value })
    }
}
const saveAbilities = () => {
    const abilities = []
    for (let i = 0; i < abilityArray.length; i++) {
        var abilityDetails = {
            Name: "",
            Description: "",
            Cost: "",
            Button: "",
            Icon: "",
        }
        for (let property in abilityDetails) {
            const str = `${abilityElementIDs[property]}-${abilityArray[i]}`

            const savedElement = document.getElementById(str)
            if (property == "Button" || property == "Icon") {
                console.log(savedElement.id)
                abilityDetails[property] = savedElement.src
            }
            else abilityDetails[property] = savedElement.textContent
        }
        abilities.push(abilityDetails)
    }
    return abilities
}
const saveDraft = () => {
    var cardData
    const isHero = cardTypes[cardType].isHero
    if (isHero) {
        cardData = {
            Type: cardType,
            isHero: isHero,
            Title: titleText(true, false),
            Abilities: saveAbilities(),
            PortraitEnabled: getToggleCheck("enable-portrait-toggle"),
            Image: document.getElementById("hero-portrait").src,
        }
    }
    else {
        cardData = {
            Type: cardType,
            isHero: isHero,
            Title: titleText(false, false),
            Cost: getCardValue("input-cost-text"),
            Damage: getCardValue("input-damage-text"),
            Delay: getCardValue("input-delay-text"),
            Ammo: getCardValue("input-ammo-text"),
            Copies: getCardValue("copies-slider"),
            Class: getCardValue("input-class-text"),
            Rarity: getCardValue("rarity-pin-dropdown"),
            Hero: getCardValue("hero-pin-dropdown"),
            ClassPin: getCardValue("class-pin-dropdown"),
            Description: getCardValue("input-description-text"),
            Flavor: getCardValue("input-flavor-text"),
            hasDamage: getToggleCheck("damage-checkbox"),
            hasAmmo: getToggleCheck("temporary-toggle"),
            costsBloontonium: getToggleCheck("bloontonium-toggle"),
            isDetailsEnabled: getToggleCheck("detail-toggle"),
            Keywords: keywordListData,
            ImageTransform: [getCardValue("x-input"), getCardValue("y-input"), getCardValue("w-input"), getCardValue("h-input")],
            KeepRatio: getToggleCheck("ratio-toggle"),
            Image: saveCardImage(),
        }
    }
    const JSONData = JSON.stringify(cardData)
    console.log(JSON.stringify(cardData))

    var downloadLink = document.createElement("a")
    const blob = new Blob([JSONData], { type: 'application/json' })
    downloadLink.href = window.URL.createObjectURL(blob)
    downloadLink.download = `bcs-draft-${titleText(isHero, true)}`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}
const saveCardImage = () => {
    if (storedImg) return storedImg.src
    else return null
}
const getCardValue = (element) => {
    return document.getElementById(element).value;
}
const ManualInput = new Event("input")
const ManualChange = new Event("change")
const setCardValue = (element, value) => {
    const e = document.getElementById(element)
    e.value = value
    e.dispatchEvent(ManualInput)
    e.dispatchEvent(ManualChange)
}

const getToggleCheck = (element) => {
    return document.getElementById(element).checked
}

const setToggleCheck = (element, checked) => {
    const e = document.getElementById(element)
    e.checked = checked
    e.dispatchEvent(ManualInput)
}

// occurs when type changes
const updateCardLayout = (type) => {
  cardType = type
    const cardTypeObj = cardTypes[cardType];
    if (cardTypeObj.isHero) {
        cardForm.style.display = "none"
        cardJustifier.style.display = "none"
        cardFormHero.style.display = ""
        heroJustifier.style.display =""
        return
    }
    else {
        cardForm.style.display = ""
        cardJustifier.style.display = ""
        cardFormHero.style.display = "none"
        heroJustifier.style.display = "none"
    }
  if (type == 'monkey') descriptionMaxHeight = 250
  else descriptionMaxHeight = 221
  fitTextToHeight(cardDescriptionText, 3.2, descriptionMaxHeight)

  const Title = document.getElementById("title-text-container")
  const Class = document.getElementById("class-text-container")
  const Description = document.getElementById("description-text")
  Title.style.bottom = cardTypeObj.titleBottom
  Class.style.top = cardTypeObj.classTop
  Description.style.top = cardTypeObj.descriptionTop
  cardBorder.src = cardTypeObj.borderSrc;
  cardBorder.style.transform = cardTypeObj.borderOffset;
  if (cardTypeObj.damageSrc)
  {
    cardDamage.src = cardTypeObj.damageSrc;
    cardDamage.style.top = cardTypeObj.damageTop;
    cardDamage.style.left = cardTypeObj.damageLeft;
    cardDamageTextContainer.style.top = cardTypeObj.damageTop;
    cardDamageTextContainer.style.left = cardTypeObj.damageLeft;
  }
  cardImg.style.height = cardTypeObj.imgHeight;
  cardImg.style.width = cardTypeObj.imgWidth;
  cardImg.style.transform = cardTypeObj.imgTransform;
  cardImg.style.borderRadius = cardTypeObj.imgBorderRadius;
  cardImg.style.ObjFit = cardTypeObj.imgObjFit;
  cardDelay.style.top = cardTypeObj.delayTop;
  cardDelay.style.left = cardTypeObj.delayLeft;
  cardDelayTextContainer.style.top = cardTypeObj.delayTop;
  cardDelayTextContainer.style.left = cardTypeObj.delayLeft;
  cardDelayTextContainer.style.fontSize = cardTypeObj.delayFontSize;
  classPin.style.left = cardTypeObj.classPinLeft;
  classPin.style.top = cardTypeObj.classPinTop;
  heroPin.style.left = cardTypeObj.heroPinLeft;
  heroPin.style.top = cardTypeObj.heroPinTop;
  toggleVisibilities(cardTypeObj)
};

var damageChecked = true
const setMonkeyStatVisibility = () => {

    if (damageChecked != damageCheckbox.checked) {
        inputDamageEnabled.classList.toggle("disabled-text")
        damageChecked = !damageChecked
    }

    cardTypes.monkey.damageVisibility = TemporaryCheck()
    cardTypes.monkey.ammoVisibility = damageChecked
    cardTypes.monkey.delayVisibility = TemporaryCheck()

    inputDamage.disabled = !TemporaryCheck()
    inputAmmo.disabled = !damageChecked
    inputDelay.disabled = !TemporaryCheck()

    toggleVisibilities(cardTypes[cardType])
};

const temporaryToggle = document.getElementById("temporary-toggle")

const TemporaryCheck = () => {
    return !temporaryToggle.checked && damageCheckbox.checked
}

const openUploadModal = (targetImg) => {
  const uploadModal = document.getElementById("uploadImgModal")
  selectedImgTarget = uploadImgTargets[targetImg]
  setThumbnail(selectedImgTarget.src)
  toggleVisibility(uploadModal, true)
}

const closeUploadModal = () => {
  const uploadModal = document.getElementById("uploadImgModal")
  toggleVisibility(uploadModal, false)
}

const toggleHeroPortrait = () => {
    const heroPortraitToggle = document.getElementById("enable-portrait-toggle")
    heroPortraitToggle.checked = true
    const heroContainer = document.getElementById("hero-container")
    heroPortraitToggle.addEventListener("input", function (event) {
        if (heroPortraitToggle.checked) {
            uploadImgTargets.heroPortrait.style.display = ""
            heroContainer.style.width = ""
            detailBoxHero.style.left = ""
            detailBoxHero.style.flex = ""
            heroContainer.style.left = ""
        }
        else {
            uploadImgTargets.heroPortrait.style.display = "none"
            heroContainer.style.width = "600px"
            detailBoxHero.style.left = "77px"
            detailBoxHero.style.flex = "0.74"
            heroContainer.style.left = "auto"
        }
    })
}

// if click out of modal, close it
window.onclick = function(event) {
  const uploadModal = document.getElementById("uploadImgModal")
  if (event.target == uploadModal) {
    closeUploadModal()
  }
} 

// resize img to wanted width and height
const updateCardImage = () => {
    if (storedImg == null || drawTimer != null) return;
    drawTimer = window.setTimeout(function () {
        const keepRatioCheckbox = document.getElementById(`ratio-toggle`)
        if (keepRatioCheckbox.checked) updateWithKeepRatio()
        else updateWithoutKeepRatio()
        cardImg.src = canvas.toDataURL()
        drawTimer = null
    }, 125)
}

const updateWithKeepRatio = () => {
    canvas.width = cardImageValues.w
    canvas.height = cardImageValues.h
    ctx.drawImage(storedImg, cardImageValues.x, -cardImageValues.y, cardImageValues.w, cardImageValues.h)
}

const updateWithoutKeepRatio = () => {
    canvas.width = 512
    canvas.height = 512
    widthDifference = cardImageValues.w / 512 - 1
    heightDifference = cardImageValues.h / 512 - 1
    let widthOffset = 256 * widthDifference
    let heightOffset = 256 * heightDifference
    ctx.drawImage(storedImg, cardImageValues.x - widthOffset, -cardImageValues.y - heightOffset, cardImageValues.w, cardImageValues.h)
}

const uploadImg = (event) => {
  const fileList = event.target.files;
  const firstFile = fileList[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    // Create a new image element
    const newImg = document.createElement("img");
    newImg.src = event.target.result;
    // Resize the image and update card-img element
    newImg.onload = function () {
      setThumbnail(newImg.src)
      if (selectedImgTarget == cardImg) {
        storedImg = newImg
        updateCardImage();
      }
      else if (selectedImgTarget == uploadImgTargets.abilityIcon) {
          let abilityIcon = document.getElementById(`ability-icon-${abilityOptions.value}`)
          abilityIcon.src = newImg.src
      }
      else selectedImgTarget.src = newImg.src;
    };
  };
  // Check if the selected file is an image
  if (firstFile.type.startsWith("image/")) {
    reader.readAsDataURL(firstFile);
  }
}

const uploadImgFromURL = () => {
  const imgURLInput = document.getElementById("url-input");
  const url = imgURLInput.value.trim();

  if (url) {
    imgURLInput.value = '';

    const newImg = document.createElement("img");
    newImg.crossOrigin = "anonymous";
    newImg.src = url;

    newImg.onload = function () {
      setThumbnail(url);
      if (selectedImgTarget == cardImg) {
        storedImg = newImg
        updateCardImage();
      }
      else if (selectedImgTarget == uploadImgTargets.abilityIcon) {
          let abilityIcon = document.getElementById(`ability-icon-${abilityOptions.value}`)
          abilityIcon.src = newImg.src
      }
      else selectedImgTarget.src = newImg.src;
    };

    newImg.onerror = function () {
      alert("Invalid image URL. Please check the link and try again.");
    };
  }
};

const setThumbnail = (src) => {
  var imgThumbnail = document.getElementById("img-thumbnail")
  imgThumbnail.src = src
}

const downloadImg = () => {
    let isHero = cardTypes[cardType].isHero
    let downloadedContainer
    if (!isHero) {
        downloadedContainer = document.getElementById("card-container")
        if (detailCheckbox.checked) downloadedContainer.style.height = `${Math.max(detailBox.offsetHeight + 40, 510)}px`
        else downloadedContainer.style.height = "510px"
    }
    else {
        downloadedContainer = document.getElementById("hero-container")
        downloadedContainer.style.height = `${Math.max(detailBoxHero.offsetHeight + 40, 510)}px`
    }
  html2canvas(downloadedContainer, {
    backgroundColor: null,
    useCORS: true,
    scale: 5,
  }).then(function (canvas) {

    let imageData = canvas.toDataURL("image/png")
    downloadButtonMethod(imageData, `bcs-${titleText(isHero, true)}.png`)
  })
    downloadedContainer.style.height = "510px"
}

const titleText = (isHero, sanitize) => {
    let title

    if (!isHero) title = document.getElementById("title-text").textContent;
    else title = document.getElementById("hero-name").textContent;

    if (sanitize) return sanitizeText(title).replace(/ /gi, '-').toLowerCase().substring(0, 50);
    else return title
}

const sanitizeText = (text) => {
    return text.replace(/[^\w\s]/gi, '').trim();
}

const downloadButtonMethod = (url, name) => {
    var downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = name // Set the download file name
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}



const startup = () => {
    damageCheckbox.checked = true
    temporaryToggle.checked = false
    copiesSlider.value = 1
}

var cardType = "monkey"

const copiesSlider = document.getElementById("copies-slider")
const damageCheckbox = document.getElementById("damage-checkbox")

const cardForm = document.getElementById("card-form")
const cardFormHero = document.getElementById("card-form-hero")
const cardBorder = document.getElementById("card-border")
const cardTypeButtons = document.querySelectorAll(".card-type-button")
const cardJustifier = document.getElementById("card-justifier")
const heroJustifier = document.getElementById("hero-justifier")

const cardContainer = document.getElementById("card-container")
const detailCheckbox = document.getElementById(`detail-toggle`)
const detailBox = document.getElementById("detail-box")
const detailBoxHero = document.getElementById("detail-box-hero")
const keywordHolder = document.getElementById("keyword-holder")
const flavorText = document.getElementById("flavor-text")
const keywordList = []
const keywordListData = []

const inputDamageEnabled = document.getElementById("enable-damage-elements")
const inputDamage = document.getElementById("input-damage-text")
const inputAmmo = document.getElementById("input-ammo-text")
const inputDelay = document.getElementById("input-delay-text")

const inputDetailEnabled = document.getElementById("enable-detail-elements")
const keywordDropdown = document.getElementById("keyword-dropdown")
const inputFlavorText = document.getElementById(`input-flavor-text`)
const keywordImg = document.getElementById("keyword-img")
const keywordDescription = document.getElementById("keyword-description")
const keywordTitle = document.getElementById("keyword-title")
const keywordElement = document.getElementById("keyword-element")
const keywordTitleStroke = document.getElementById("keyword-title-stroke")
const keywordValue = document.getElementById("keyword-value")
const addKeywordBtn = document.getElementById("add-keyword")
const removeKeywordBtn = document.getElementById("remove-keyword")

const abilityElement = {
    Element: document.getElementById("ability-element"),
    Button: document.getElementById("ability-icon-button"),
    Icon: document.getElementById("ability-icon"),
    Name: document.getElementById("ability-name"),
    NameStroke: document.getElementById("ability-name-stroke"),
    NameContainer: document.getElementById("ability-name-container"),
    Description: document.getElementById("ability-description"),
    Cost: document.getElementById("bloontonium-cost"),
    CostStroke: document.getElementById("bloontonium-cost-stroke"),
}
const abilityElementIDs = {
    Element: "ability-element",
    Button: "ability-icon-button",
    Icon: "ability-icon",
    Name: "ability-name",
    NameStroke: "ability-name-stroke",
    NameContainer: "ability-name-container",
    Description: "ability-description",
    Cost: "bloontonium-cost",
    CostStroke: "bloontonium-cost-stroke",
}
const inputAbilityEnabled = document.getElementById("enable-ability-elements")
const abilityHolder = document.getElementById("ability-holder")
const abilityOptions = document.getElementById("ability-options")
const moveAbilityUp = document.getElementById("move-ability-up")
const moveAbilityDown = document.getElementById("move-ability-down")

const passiveToggle = document.getElementById("is-passive-toggle")
const abilityNameInput = document.getElementById("input-ability-name")
const abilityDescriptionInput = document.getElementById("input-ability-description")
const bloontoniumCostInput = document.getElementById("input-bloontonium-cost")
const abilityIconUpload = document.getElementById("ability-img-btn")

var abilityArray = []

const uploadImgTargets = {
    cardImg: document.getElementById("card-img"),
    abilityIcon: document.getElementById("ability-icon"),
    heroPortrait: document.getElementById("hero-portrait")
}
var selectedImgTarget = null


const cardDamage = document.getElementById("card-damage")
const cardAmmo = document.getElementById("card-ammo")
const cardDelay = document.getElementById("card-delay")
const cardDamageTextContainer = document.getElementById("damage-text-container")
const cardAmmoTextContainer = document.getElementById("ammo-text-container")
const cardDelayTextContainer = document.getElementById("delay-text-container")
const cardDescriptionText = document.getElementById("description-text")

const rarityPin = document.getElementById("rarity-pin")
const heroPin = document.getElementById("hero-pin")
const classPin = document.getElementById("class-pin")
const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
var storedImg = null
var drawTimer = null

const cardImg = uploadImgTargets.cardImg

// img size in pixels
const imgSize = 512
const cardImageValues = { x: 0, y: 0, w: imgSize, h: imgSize }

// make text editable
editCardTextEvent("title-text", true)
editCardTextEvent("class-text", true)
editCardTextEvent("cost-text", true)
editCardTextEvent("damage-text", true)
editCardTextEvent("ammo-text", true)
editCardTextEvent("delay-text", true)
editCardTextEvent("description-text", false)
editCardTextEvent("flavor-text", false)

editCardTextEvent("hero-name", true)
editAbilityTextEvent("ability-name", true)
editAbilityTextEvent("bloontonium-cost", true)
editAbilityTextEvent("ability-description", false)
editAbilityNameEvent()
editAbilityDescriptionEvent()


editDropdownEvent("rarity-pin", "RarityPin")
editDropdownEvent("hero-pin", "HeroPin")
editDropdownEvent("class-pin", "ClassPin")
editImagePositionEvent("x-input", "x")
editImagePositionEvent("y-input", "y")
editImageScaleEvent("w-input", "w")
editImageScaleEvent("h-input", "h")
toggleKeepRatio()
editDescriptionEvent()
editHeroNameEvent()
toggleDetails()
togglePassive()
toggleHeroPortrait()
toggleBloontoniumCost()
editAbilityOptionEvent()
// other things which need to happen at startup
startup()
toggleAbilityInputs()
setKeywordOptions()

try {const r = markdownit()
r.render('**BOLD!**') }
catch {}