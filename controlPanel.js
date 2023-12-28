import * as CONFIG from "./E2E-NC-config.json";
import { requestRenderIfNotRequested, updateReactorFrameGeometry } from "./render.js";
import { buildReactor, makeRing, reactorDetails, setCoolerType, computeCoolingBreakdown, getCoolerAmount } from "./reactorManager.js";

/**
 * Changes the size of the reactor
 * @param {*} size 
 */
function changeReactorSize(size){
    size = Number(size);
    elReactorSize.innerText = `Toroid size ${size}`;
    elMagnetCost.innerText = `Magnet upkeep cost : TODO RF/t`;
    buildReactor(size, topRingGlass, bottomRingGlass, outerRingGlass, innerRingGlass);
    updateReactorFrameGeometry();
    changeFuelCombo();
    updateCostBreakdown();
    updateCoolingBreakdown(computeCoolingBreakdown());
    setTimeout(() => requestRenderIfNotRequested(), 50);
}

/**
 * Changes the fuel combination
 */
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

/**
 * Updates the cooling breakdown
 * @param {*} breakdown
 */
function updateCoolingBreakdown(breakdown){
    const coolingPercentage = (breakdown.total / 5000 * 100).toFixed(2);
    elTotalCooling.innerText = `${breakdown.total.toFixed(2)}/5000 K/t (${coolingPercentage}%)`;
    if(coolingPercentage > 120 || coolingPercentage < 100) elTotalCooling.style.color = "red";
    else elTotalCooling.style.color = "green";

    while(elTypeContribution.firstChild) elTypeContribution.removeChild(elTypeContribution.lastChild);
    if(breakdown.total == 0) return;
    for(let type of Object.entries(breakdown.typeContribution)){
        type[1] /= reactorDetails.reactorSize;
        const typePercentage = (type[1] / breakdown.total * 100).toFixed(2);
        const elType = document.createElement("li");
        elType.innerText = `${type[0]} : ${type[1].toFixed(2)} K/t (${typePercentage}%)`;
        elTypeContribution.appendChild(elType);
    }
}

/**
 * Updates the cost breakdown
 */
function updateCostBreakdown(){
    let solidMagnets = 0;
    let transparentMagnets = 0;
    if(topRingGlass) transparentMagnets += 4 * (5 + reactorDetails.reactorSize);
    else solidMagnets += 4 * (5 + reactorDetails.reactorSize);
    if(bottomRingGlass) transparentMagnets += 4 * (5 + reactorDetails.reactorSize);
    else solidMagnets += 4 * (5 + reactorDetails.reactorSize);
    if(innerRingGlass) transparentMagnets += 4 * (3 + reactorDetails.reactorSize);
    else solidMagnets += 4 * (3 + reactorDetails.reactorSize);
    if(outerRingGlass) transparentMagnets += 4 * (7 + reactorDetails.reactorSize);
    else solidMagnets += 4 * (7 + reactorDetails.reactorSize);
    while(elBlockList.children.length > 1) elBlockList.removeChild(elBlockList.lastChild);
    if(solidMagnets > 0){
        let elMagnetCount = document.createElement("li");
        elMagnetCount.innerText = `x${solidMagnets} Fusion Electromagnets`;
        elBlockList.appendChild(elMagnetCount);
    }
    if(transparentMagnets > 0){
        let elMagnetCount = document.createElement("li");
        elMagnetCount.innerText = `x${transparentMagnets} Transparent Fusion Electromagnets`;
        elBlockList.appendChild(elMagnetCount);
    }
    let coolerCount = getCoolerAmount();
    if(coolerCount > 0){
        let elCoolerCount = document.createElement("li");
        elCoolerCount.innerText = `x${coolerCount} Active Fluid Coolers`;
        elBlockList.appendChild(elCoolerCount);
    }
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
    updateCostBreakdown();
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});
elBottomRingGlassToggle.addEventListener("click", () => {
    bottomRingGlass = !bottomRingGlass;
    elBottomRingGlassToggle.innerText = `Bottom ring : ${bottomRingGlass ? "transparent" : "solid"}`;
    makeRing(0, reactorDetails.reactorSize + 2, bottomRingGlass);
    updateCostBreakdown();
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});
elOuterRingGlassToggle.addEventListener("click", () => {
    outerRingGlass = !outerRingGlass;
    elOuterRingGlassToggle.innerText = `Outer ring : ${outerRingGlass ? "transparent" : "solid"}`;
    makeRing(1, reactorDetails.reactorSize + 3, outerRingGlass);
    updateCostBreakdown();
    updateReactorFrameGeometry();
    requestRenderIfNotRequested();
});
elInnerRingGlassToggle.addEventListener("click", () => {
    innerRingGlass = !innerRingGlass;
    elInnerRingGlassToggle.innerText = `Inner ring : ${innerRingGlass ? "transparent" : "solid"}`;
    makeRing(1, reactorDetails.reactorSize + 1, innerRingGlass);
    updateCostBreakdown();
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

const elTotalCooling = document.querySelector("#totalCooling");
const elTypeContribution = document.querySelector("#typeContribution");
window.addEventListener("coolerChange", () => { 
    updateCoolingBreakdown(computeCoolingBreakdown());
    updateCostBreakdown();
});

const elBlockList  = document.querySelector("#blockList");
elBlockList.appendChild(document.createElement("li"));
elBlockList.children[0].innerText = "x1 Fusion Core";

setCoolerType(elCoolerSelection.children[0].value);
elCoolerSelection.children[0].checked = true;
elFuelCombo.children[0].selected = true;
elSlider.value = 4;
changeReactorSize(elSlider.value);
changeFuelCombo();