import * as CONFIG from "./E2E-NC-config.json";
import { requestRenderIfNotRequested, updateReactorFrameGeometry } from "./render.js";
import { buildReactor, makeRing, reactorDetails, setCoolerType } from "./reactorManager.js";

function changeReactorSize(size){
    size = Number(size);
    elReactorSize.innerText = `Toroid size ${size}`;
    elMagnetCost.innerText = `Magnet upkeep cost : TODO RF/t`;
    buildReactor(size, topRingGlass, bottomRingGlass, outerRingGlass, innerRingGlass);
    updateReactorFrameGeometry();
    changeFuelCombo();
    setTimeout(() => requestRenderIfNotRequested(), 50);
}

function changeFuelCombo(){
    const fuel = CONFIG.fuels[elFuelCombo.value];
    const reactorSize = Number(elSlider.value);
    elComboName.innerText = `${fuel.fuel1.name}-${fuel.fuel2 != null ? fuel.fuel2.name : fuel.fuel1.name}`;
    elFuel1.innerText = `${fuel.fuel1.name} : ${((fuel.fuel1.amount*reactorSize)/(fuel.fuelLifetime/CONFIG.fuelUseRateMultipler)).toFixed(2)} mB/t`;
    elFuel2.innerText = fuel.fuel2 != null ? `${fuel.fuel2.name} : ${((fuel.fuel2.amount*reactorSize)/(fuel.fuelLifetime/CONFIG.fuelUseRateMultipler)).toFixed(2)} mB/t` : "-";

    while(elProducts.firstChild) elProducts.removeChild(elProducts.lastChild);
    for(const product of fuel.product){
        const elProduct = document.createElement("li");
        elProduct.innerText = `${product.name} : ~${((product.amount*reactorSize)/(fuel.fuelLifetime/CONFIG.fuelUseRateMultipler)).toFixed(2)} mB/t`;
        elProducts.appendChild(elProduct);
    }

    const energyProduced = fuel.basePower * reactorSize * CONFIG.fusionPowerMultiplier * CONFIG.extraPowerMultiplierThatIsntMentionedAnywhereButTheInGameValuesDontMakeSenseOtherwise;
    const energyString = energyProduced >= 1000000 ? `${(energyProduced/1000000).toFixed(2)} MRF/t` : `${energyProduced/1000} KRF/t`;
    elEnergyOutput.innerText = `Energy produced ${energyString}`;
}
const elComboName = document.querySelector("#comboName");
const elSlider = document.querySelector("#sizeSlider");
elSlider.min = CONFIG.minSize;
elSlider.max = CONFIG.maxSize;
elSlider.addEventListener("input", () => {changeReactorSize(elSlider.value);});

const elReactorSize = document.querySelector("#reactorSize");

const elFuelCombo = document.querySelector("#fuelCombo");
for(const fuel of Object.entries(CONFIG.fuels)){
    const elOption = document.createElement("option");
    elOption.value = fuel[0];
    elOption.innerText = `${fuel[1].fuel1.name}-${fuel[1].fuel2 != null ? fuel[1].fuel2.name : fuel[1].fuel1.name}`;
    elFuelCombo.appendChild(elOption);
}
elFuelCombo.addEventListener("change", changeFuelCombo);

const elFuel1 = document.querySelector("#fuel1");
const elFuel2 = document.querySelector("#fuel2");
const elProducts = document.querySelector("#products");
const elMagnetCost = document.querySelector("#magnetCost");
const elEnergyOutput = document.querySelector("#energyOutput");

const elTopRingGlassToggle = document.querySelector("#topRing");
const elBottomRingGlassToggle = document.querySelector("#bottomRing");
const elOuterRingGlassToggle = document.querySelector("#outerRing");
const elInnerRingGlassToggle = document.querySelector("#innerRing");

let topRingGlass = false;
let bottomRingGlass = false;
let outerRingGlass = false;
let innerRingGlass = false;

elTopRingGlassToggle.addEventListener("click", () => {
    topRingGlass = !topRingGlass;
    elTopRingGlassToggle.innerText = `Top ring : ${topRingGlass ? "transparent" : "solid"}`;
    makeRing(2, reactorDetails.reactorSize + 2, topRingGlass);
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});
elBottomRingGlassToggle.addEventListener("click", () => {
    bottomRingGlass = !bottomRingGlass;
    elBottomRingGlassToggle.innerText = `Bottom ring : ${bottomRingGlass ? "transparent" : "solid"}`;
    makeRing(0, reactorDetails.reactorSize + 2, bottomRingGlass);
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});
elOuterRingGlassToggle.addEventListener("click", () => {
    outerRingGlass = !outerRingGlass;
    elOuterRingGlassToggle.innerText = `Outer ring : ${outerRingGlass ? "transparent" : "solid"}`;
    makeRing(1, reactorDetails.reactorSize + 3, outerRingGlass);
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});
elInnerRingGlassToggle.addEventListener("click", () => {
    innerRingGlass = !innerRingGlass;
    elInnerRingGlassToggle.innerText = `Inner ring : ${innerRingGlass ? "transparent" : "solid"}`;
    makeRing(1, reactorDetails.reactorSize + 1, innerRingGlass);
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});

const elCoolerSelection = document.querySelector("#coolerSelection");
let coolerStartIndex = 14;
for(const coolant of Object.entries(CONFIG.coolants)){
    const elOption = document.createElement("input");
    elOption.name = "coolerType";
    elOption.type = "radio";
    elOption.value = coolerStartIndex;
    coolerStartIndex += 2;
    elOption.id = coolant[0];
    elOption.title = coolant[0];
    elCoolerSelection.appendChild(elOption);
    const elLabel = document.createElement("label");
    elLabel.htmlFor = coolant[0];
    elLabel.title = coolant[0].charAt(0).toUpperCase() + coolant[0].slice(1);
    elLabel.style.backgroundImage = `url('assets/${coolant[0]}.png')`;
    elCoolerSelection.appendChild(elLabel);
    elLabel.addEventListener("click", () => {
        setCoolerType(elOption.value);
        elOption.checked = true;
    });
}

setCoolerType(elCoolerSelection.children[0].value);
elCoolerSelection.children[0].checked = true;
elFuelCombo.children[0].selected = true;
elSlider.value = 4;
changeReactorSize(elSlider.value);
changeFuelCombo();