import MarkdownIt from 'markdown-it'

// make text input affect card text
const editCardTextEvent = (element, hasStroke) => {
  const inputCardText = document.getElementById(`input-${element}`)
  const cardText = document.getElementById(element)
  // on reload, remove text from input
  // ideally you would keep everything but that's a lot harder
  inputCardText.value = ""
    inputCardText.addEventListener("input", function (event) {
        inputCardText.value = event.target.value.replace("$/inf", "∞")
        cardText.innerHTML = md.renderInline(event.target.value)
  })
    if (hasStroke) {
        const cardStroke = document.getElementById(`${element}-stroke`)
        inputCardText.addEventListener("input", function (event) {
            cardStroke.innerHTML = md.renderInline(event.target.value)
        })
    }
}

const editAbilityTextEvent = (element, hasStroke, part) => {
    const inputCardText = document.getElementById(`input-${element}`)
    // on reload, remove text from input
    // ideally you would keep everything but that's a lot harder
    inputCardText.value = ""
    inputCardText.addEventListener("input", function (event) {
        inputCardText.value = event.target.value.replace("$/inf", "∞")
        const cardText = document.getElementById(`${element}-${abilityOptions.value}`)
        cardText.innerHTML = md.renderInline(event.target.value)
        currentAbilityInfo[part] = event.target.value
    })
    if (hasStroke) {
        
        inputCardText.addEventListener("input", function (event) {
            const cardStroke = document.getElementById(`${element}-stroke-${abilityOptions.value}`)
            cardStroke.innerHTML = md.renderInline(event.target.value)
        })
    }
}

const addKeyword = () => {
    let finalDescription = keywords[keywordDropdown.value].Description.replace("{VALUE}", keywordValue.value)
    keywordDescription.innerHTML = md.renderInline(finalDescription)
    let finalTitle = keywords[keywordDropdown.value].Title.replace("{VALUE}", keywordValue.value)
    keywordTitle.innerHTML = md.renderInline(finalTitle)
    keywordTitleStroke.innerHTML = md.renderInline(finalTitle)
    keywordImg.src = `/src/img/Keyword/${keywordDropdown.value}.png`
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

    let abilityInfo = {
        Name: `Ability ${i}`,
        Description: "Ability Description",
        Cost: "0",
        Passive: false,
        Icon: "",
        AbilityID: i,
    }

    let newOption = document.createElement("option")
    newOption.value = i
    newOption.textContent = abilityInfo.Name
    newOption.id = `ability-option-${i}`
    abilityOptions.appendChild(newOption)

    abilityElement.Name.textContent = abilityInfo.Name
    abilityElement.NameStroke.textContent = abilityInfo.Name
    abilityElement.Description.textContent = abilityInfo.Description
    abilityElement.Element.style.order = `${i}`

    let newAbility = abilityElement.Element.cloneNode(true)
    newAbility.style.display = "flex"
    abilityHolder.appendChild(newAbility)
    abilityOptions.value = i

    for (let property in abilityElement) {
        abilityElement[property].id = `${abilityElementIDs[property]}`
    }

    abilityInfoArray.push(abilityInfo)
    abilityArray.push(i)
    refreshSelectedAbility()
    toggleAbilityInputs()
    
}
const removeAbility = () => {
    if (abilityArray.length <= 0) return;
    let index = abilityArray.indexOf(Number(abilityOptions.value))
    let markdownIndex = abilityInfoArray.indexOf(currentAbilityInfo)

    const removedAbility = document.getElementById(`ability-element-${abilityOptions.value}`)
    const removedAbilityOption = document.getElementById(`ability-option-${abilityOptions.value}`)
    removedAbility.remove()
    removedAbilityOption.remove()
    abilityArray.splice(index, 1)
    abilityInfoArray.splice(markdownIndex, 1)

    if (abilityArray.length != 0) refreshSelectedAbility();
    toggleAbilityInputs()
}

const findCurrentAbilityInfo = () => {
    return abilityInfoArray.find(x => x.AbilityID == abilityOptions.value)
}

async function addDraftAbilities(abilityInfoArr) {
    while (abilityArray.length > 0) {
        removeAbility()
    }
    let i = 1
    for (let abilityIndex in abilityInfoArr) {

        addAbility()
        const abilityInfo = abilityInfoArr[abilityIndex]

        setInputManually("input-ability-description", abilityInfo.Description)
        setInputManually("input-ability-name", abilityInfo.Name)
        setInputManually("input-bloontonium-cost", abilityInfo.Cost)
        if (abilityInfo.Passive) setToggleCheck("is-passive-toggle", abilityInfo.Passive)
        else if (abilityInfo.Button) setToggleCheck("is-passive-toggle", abilityInfo.Button.includes("Passive")) // deprecated

        let Icon = document.getElementById(`${abilityElementIDs.Icon}-${i}`)
        let loadImgPromise = new Promise(
            function (resolve) { addDraftImagePromise(abilityInfo.Icon, Icon, resolve) })
        const n = await loadImgPromise

        i++
    }
}

const refreshSelectedAbility = () => {
    currentAbilityInfo = findCurrentAbilityInfo()

    abilityNameInput.value = currentAbilityInfo.Name
    abilityDescriptionInput.value = currentAbilityInfo.Description
    bloontoniumCostInput.value = currentAbilityInfo.Cost
    passiveToggle.checked = currentAbilityInfo.Passive

    console.log(currentAbilityInfo)
}

var currentAbilityInfo

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
    if (movedIndex >= abilityArray.length || movedIndex < 0) return;
    const movedValue = abilityArray[movedIndex];

    const selectedElement = document.getElementById(`ability-element-${selectedValue}`);
    const movedElement = document.getElementById(`ability-element-${movedValue}`);
    const selectedOption = document.getElementById(`ability-option-${selectedValue}`);
    const movedOption = document.getElementById(`ability-option-${movedValue}`);


    [selectedElement.style.order, movedElement.style.order] = [movedElement.style.order, selectedElement.style.order];
    [selectedOption.textContent, movedOption.textContent] = [movedOption.textContent, selectedOption.textContent];
    [selectedOption.value, movedOption.value] = [movedOption.value, selectedOption.value];
    [selectedOption.id, movedOption.id] = [movedOption.id, selectedOption.id];
    [abilityArray[selectedIndex], abilityArray[movedIndex]] = [abilityArray[movedIndex], abilityArray[selectedIndex]];
    [abilityInfoArray[selectedIndex], abilityInfoArray[movedIndex]] = [abilityInfoArray[movedIndex], abilityInfoArray[selectedIndex]]
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
        if (passiveToggle.checked) abilityButton.src = "/src/img/HeroCreator/PassiveAbilityButton.png"
        else abilityButton.src = "/src/img/HeroCreator/ActiveAbilityButton.png"
        currentAbilityInfo.Passive = passiveToggle.checked
    })
}

const toggleBloontoniumCost = () => {
    const BloontoniumToggle = document.getElementById("bloontonium-toggle")
    const Coins = document.getElementsByClassName("cost")
    const CostText = document.getElementById("cost-text-container")
    BloontoniumToggle.checked = false
    BloontoniumToggle.addEventListener("input", function (event) {
        let CostImg = "/src/img/CardIcon/Coin.png"
        let CostTop = "4%"
        if (BloontoniumToggle.checked) {
            CostImg = "/src/img/CardIcon/Bloontonium.png"
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
    DropdownImg.src = `/src/img/${folderName}/${Dropdown.value}.png`})
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

const fitHeroName = () => {
    const heroNameContainer = document.getElementById("hero-name-container")
    
    heroNameInput.addEventListener("input", function (event) {
        fitTextToHeight(heroNameContainer, 2, 41)
    })
}

const heroNameInput = document.getElementById("input-hero-name")

const fitAbilityName = () => {
    abilityNameInput.addEventListener("input", function (event) {
        const option = document.getElementById(`ability-option-${abilityOptions.value}`)
        option.textContent = abilityNameInput.value
        fitTextToHeight(document.getElementById(`ability-name-container-${abilityOptions.value}`), 1.225, 35)
    })
}

const fitAbilityDescription = () => {
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
    borderSrc: "/src/img/Border/MonkeyCardBorder.png",
    damageSrc: "/src/img/CardIcon/MonkeyDamage.png",
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
    borderSrc: "/src/img/Border/BloonCardBorder.png",
    damageSrc: "/src/img/CardIcon/BloonDamage.png",
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
    borderSrc: "/src/img/Border/PowerCardBorder.png",
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
    Camo: {
        Title: "Camo",
        Description: "Attackers must target non-Camo Bloons first",
    },
    Defender: {
        Title: "Defender +{VALUE}",
        OptionTitle: "Defender",
        Description: "Can defend on opponent's turn, has +{VALUE} damage on opponent's turn",
    },
    Detect: {
        Title: "Detect",
        Description: "Can target Camo Bloons normally"
    },
    DoubleAttack: {
        Title: "Double Attack",
        Description: "Attacks twice",
    },
    TripleAttack: {
        Title: "Triple Attack",
        Description: "Attacks three times"
    },
    Doomed: {
        Title: "Doomed",
        Description: "This Monkey will be removed at the start of its next turn",
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
        Description: "Triggers when Bloon is Popped (by damage or effect) or when it hits opposing Hero",
    },
    OnFire: {
        Title: "On Fire",
        Description: "Will take 30 damage at the end of its turn and before attacking",
    },
    OnLeak: {
        Title: "On Leak",
        Description: "Triggers when a bloon attacks a hero (after defenders have acted)",
    },
    OnPlay: {
        Title: "On Play",
        Description: "Triggers when card is played",
    },
    OnPopped: {
        Title: "On Popped",
        Description: "Triggers when Bloon is Popped (by damage or effect). Does not trigger if Bloon hits opposing Hero",
    },
    OnAttack: {
        Title: "On Attack",
        Description: "Triggers when this Monkey attacks",
    },
    OnReload: {
        Title: "On Reload",
        Description: "Triggers when this Monkey reloads",
    },
    OnReplace: {
        Title: "On Replace",
        Description: "Triggers when this Monkey is replaced by another Monkey",
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
        Description: "Look at the next {VALUE} cards in your deck. Choose one and add it to your hand. Other cards go to the bottom of your deck",
    },
    Regrow: {
        Title: "Regrow {VALUE}",
        OptionTitle: "Regrow",
        Description: "**On Turn Start:** Heal {VALUE}"
    },
    Revive: {
        Title: "Revive",
        Description: "When Destroyed, resummon this Bloon with current Delay and without Revive"
    },
    Undead: {
        Title: "Undead",
        Description: "When Destroyed, does not go to Graveyard"
    },
    Shield: {
        Title: "Shield {VALUE}",
        OptionTitle: "Shield",
        Description: "Shield will block {VALUE} incoming damage",
    },
    SplashDamage: {
        Title: "Splash Damage",
        Description: "Also deals damage to Bloons on either side of the target"
    },
    Stunned: {
        Title: "Stunned",
        Description: "Monkey can't attack or reload until stun wears off. Bloon delay does not reduce at end of turn",
    },
    Temporary: {
        Title: "Temporary",
        Description: "Is removed at end of turn after ammo reaches 0"
    },
    TemporaryAmmo: {
        Title: "Temporary Ammo",
        Description: "Extra ammo that is removed at the start of the turn"
    },
    Unique: {
        Title: "Unique",
        Description: "You can only have one copy of this card",
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

    setInputManually("input-hero-name", cardData.Title)
    fitTextToHeight(document.getElementById("hero-name-container"), 2, 41)
    setToggleCheck("enable-portrait-toggle", cardData.PortraitEnabled)
    const heroPortrait = document.getElementById("hero-portrait")
    addDraftImage(cardData.Image, heroPortrait, "/src/img/HeroCreator/EmptyPortrait.png")
    addDraftAbilities(cardData.Abilities)
}

const draftLoaded = (cardData) => {
    updateCardLayout(cardData.Type)
    setInputManually("input-title-text", cardData.Title)
    setInputManually("input-cost-text", cardData.Cost)
    setInputManually("input-damage-text", cardData.Damage)
    setInputManually("input-delay-text", cardData.Delay)
    setInputManually("input-ammo-text", cardData.Ammo)
    setInputManually("copies-slider", cardData.Copies)
    setInputManually("input-class-text", cardData.Class)
    setInputManually("rarity-pin-dropdown", cardData.Rarity)
    setInputManually("hero-pin-dropdown", cardData.Hero)
    setInputManually("class-pin-dropdown", cardData.ClassPin)

    setInputManually("input-description-text", cardData.Description)
    fitTextToHeight(cardDescriptionText, 3.2, descriptionMaxHeight)

    setInputManually("input-flavor-text", cardData.Flavor)
    setToggleCheck("attack-toggle", cardData.hasDamage)
    setToggleCheck("ammo-toggle", cardData.hasAmmo)
    if (cardData.hasDelay) setToggleCheck("delay-toggle", cardData.hasDelay)
    else setToggleCheck("delay-toggle", cardData.hasDelay)
    setToggleCheck("bloontonium-toggle", cardData.costsBloontonium)
    setToggleCheck("detail-toggle", cardData.isDetailsEnabled)
    setMonkeyStatVisibility()
    storedImg = document.createElement("img");
    addDraftImage(cardData.Image, storedImg)

    setInputManually("x-input", cardData.ImageTransform[0])
    setInputManually("y-input", cardData.ImageTransform[1])
    setInputManually("w-input", cardData.ImageTransform[2])
    setInputManually("h-input", cardData.ImageTransform[3])
    setToggleCheck("ratio-toggle", cardData.KeepRatio)
    updateCardImage()
    addDraftKeywords(cardData.Keywords)
}

function addDraftImage(imgData, imgSrc, emptyImg = "/src/img/None.png") {
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

function addDraftImagePromise(imgData, imgSrc, resolve, emptyImg = "/src/img/None.png") {
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
        keywordDescription.innerHTML = md.renderInline(finalDescription)

        let finalTitle = keywords[Keyword].Title.replace("{VALUE}", Value)
        keywordTitle.innerHTML = md.renderInline(finalTitle)
        keywordTitleStroke.innerHTML = cardText.innerHTML = md.renderInline(finalTitle)

        keywordImg.src = `/src/img/Keyword/${Keyword}.png`
        let newKeyword = keywordElement.cloneNode(true)
        newKeyword.style.display = "flex"
        let addedKeyword = keywordHolder.appendChild(newKeyword)
        keywordList.push(addedKeyword)
        keywordListData.push({ keyword: Keyword, value: Value })
    }
}
const saveDraft = () => {
    var cardData
    const isHero = cardTypes[cardType].isHero
    if (isHero) {
        cardData = {
            Type: cardType,
            isHero: isHero,
            Title: markdownTitle(true),
            Abilities: abilityInfoArray,
            PortraitEnabled: getToggleCheck("enable-portrait-toggle"),
            Image: document.getElementById("hero-portrait").src,
        }
    }
    else {
        cardData = {
            Type: cardType,
            isHero: isHero,
            Title: markdownTitle(false),
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
            hasDamage: getToggleCheck("attack-toggle"),
            hasAmmo: getToggleCheck("ammo-toggle"),
            hasDelay: getToggleCheck("delay-toggle"),
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
    downloadLink.download = `bcs-draft-${sanitizedTitleText(isHero)}`
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
const setInputManually = (element, value) => {
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

const setMonkeyStatVisibility = () => {

    cardTypes.monkey.damageVisibility = attackToggle.checked
    cardTypes.monkey.ammoVisibility = ammoToggle.checked
    cardTypes.monkey.delayVisibility = delayToggle.checked

    inputDamage.disabled = !attackToggle.checked
    inputAmmo.disabled = !ammoToggle.checked
    inputDelay.disabled = !delayToggle.checked

    toggleVisibilities(cardTypes[cardType])
};

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
          currentAbilityInfo.Icon = newImg.src
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
          currentAbilityInfo.Icon = newImg.src
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
    cardDescriptionText.classList.toggle("description-text-download")
    console.log(cardDescriptionText.classList)
  html2canvas(downloadedContainer, {
    backgroundColor: null,
    useCORS: true,
    scale: 5,
  }).then(function (canvas) {

    let imageData = canvas.toDataURL("image/png")
    downloadButtonMethod(imageData, `bcs-${sanitizedTitleText(isHero)}.png`)
  })
  cardDescriptionText.classList.toggle("description-text-download")
    downloadedContainer.style.height = "510px"
}

const sanitizedTitleText = (isHero) => {
    let title
    if (!isHero) title = document.getElementById("title-text").textContent;
    else title = document.getElementById("hero-name").textContent;
    return sanitizeText(title).replace(/ /gi, '-').toLowerCase().substring(0, 50);
}

const markdownTitle = (isHero) => {
    let title
    if (!isHero) title = titleTextInput.value
    else title = title = heroNameInput.value
    return title
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
    attackToggle.checked = true
    ammoToggle.checked = true
    delayToggle.checked = true
    copiesSlider.value = 1
}

var cardType = "monkey"

const copiesSlider = document.getElementById("copies-slider")

const attackToggle = document.getElementById("attack-toggle")
const ammoToggle = document.getElementById("ammo-toggle")
const delayToggle = document.getElementById("delay-toggle")

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
const titleTextInput = document.getElementById("input-title-text")
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
var abilityInfoArray = []

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
editAbilityTextEvent("ability-name", true, "Name")
editAbilityTextEvent("bloontonium-cost", true, "Cost")
editAbilityTextEvent("ability-description", false, "Description")
fitAbilityName()
fitAbilityDescription()


editDropdownEvent("rarity-pin", "RarityPin")
editDropdownEvent("hero-pin", "HeroPin")
editDropdownEvent("class-pin", "ClassPin")
editImagePositionEvent("x-input", "x")
editImagePositionEvent("y-input", "y")
editImageScaleEvent("w-input", "w")
editImageScaleEvent("h-input", "h")
toggleKeepRatio()
editDescriptionEvent()
fitHeroName()
toggleDetails()
togglePassive()
toggleHeroPortrait()
toggleBloontoniumCost()
editAbilityOptionEvent()
// other things which need to happen at startup
startup()
toggleAbilityInputs()
setKeywordOptions()

const md = MarkdownIt()
md.disable(['link', 'image'])

globalThis.updateCardLayout = updateCardLayout
globalThis.setMonkeyStatVisibility = setMonkeyStatVisibility
globalThis.addKeyword = addKeyword
globalThis.removeKeyword = removeKeyword
globalThis.resetImageValues = resetImageValues
globalThis.openUploadModal = openUploadModal
globalThis.saveDraft = saveDraft
globalThis.loadDraft = loadDraft
globalThis.downloadImg = downloadImg
globalThis.downloadButtonMethod = downloadButtonMethod
globalThis.moveAbility = moveAbility
globalThis.addAbility = addAbility
globalThis.removeAbility = removeAbility
globalThis.closeUploadModal = closeUploadModal
globalThis.uploadImgFromURL = uploadImgFromURL
globalThis.uploadImg = uploadImg
globalThis.setCoinQuantity = setCoinQuantity