import { minSize, maxSize, coolants } from "./E2E-NC-config.json";

const MAX_SIZE = maxSize;
const MIN_SIZE = minSize;
const HEIGHT = 3;

const AIR = 0;
const CONNECTOR = 1;
const TOP_LEFT_CORNER_MAGNET = 2;
const TOP_RIGHT_CORNER_MAGNET = 3;
const BOTTOM_LEFT_CORNER_MAGNET = 4;
const BOTTOM_RIGHT_CORNER_MAGNET = 5;
const VERTICAL_MAGNET = 6;
const HORIZONTAL_MAGNET = 7;
const TOP_LEFT_CORNER_GLASS_MAGNET = 8;
const TOP_RIGHT_CORNER_GLASS_MAGNET = 9;
const BOTTOM_LEFT_CORNER_GLASS_MAGNET = 10;
const BOTTOM_RIGHT_CORNER_GLASS_MAGNET = 11;
const VERTICAL_GLASS_MAGNET = 12;
const HORIZONTAL_GLASS_MAGNET = 13;
const WATER_COOLER = 14;
const BOOSTED_WATER_COOLER = 15;
const REDSTONE_COOLER = 16;
const BOOSTED_REDSTONE_COOLER = 17;
const QUARTZ_COOLER = 18;
const BOOSTED_QUARTZ_COOLER = 19;
const GOLD_COOLER = 20;
const BOOSTED_GOLD_COOLER = 21;
const GLOWSTONE_COOLER = 22;
const BOOSTED_GLOWSTONE_COOLER = 23;
const LAPIS_COOLER = 24;
const BOOSTED_LAPIS_COOLER = 25;
const DIAMOND_COOLER = 26;
const BOOSTED_DIAMOND_COOLER = 27;
const HELIUM_COOLER = 28;
const BOOSTED_HELIUM_COOLER = 29;
const ENDER_COOLER = 30;
const BOOSTED_ENDER_COOLER = 31;
const CRYOTHEUM_COOLER = 32;
const BOOSTED_CRYOTHEUM_COOLER = 33;
const IRON_COOLER = 34;
const BOOSTED_IRON_COOLER = 35;
const EMERALD_COOLER = 36;
const BOOSTED_EMERALD_COOLER = 37;
const COPPER_COOLER = 38;
const BOOSTED_COPPER_COOLER = 39;
const TIN_COOLER = 40;
const BOOSTED_TIN_COOLER = 41;
const MAGNESIUM_COOLER = 42;
const BOOSTED_MAGNESIUM_COOLER = 43;

const coolerMap = {};
coolerMap[WATER_COOLER] = coolants.water/4;
coolerMap[BOOSTED_WATER_COOLER] = coolants.water;
coolerMap[REDSTONE_COOLER] = coolants.redstone/4;
coolerMap[BOOSTED_REDSTONE_COOLER] = coolants.redstone;
coolerMap[QUARTZ_COOLER] = coolants.quartz/4;
coolerMap[BOOSTED_QUARTZ_COOLER] = coolants.quartz;
coolerMap[GOLD_COOLER] = coolants.gold/4;
coolerMap[BOOSTED_GOLD_COOLER] = coolants.gold;
coolerMap[GLOWSTONE_COOLER] = coolants.glowstone/4;
coolerMap[BOOSTED_GLOWSTONE_COOLER] = coolants.glowstone;
coolerMap[LAPIS_COOLER] = coolants.lapis/4;
coolerMap[BOOSTED_LAPIS_COOLER] = coolants.lapis;
coolerMap[DIAMOND_COOLER] = coolants.diamond/4;
coolerMap[BOOSTED_DIAMOND_COOLER] = coolants.diamond;
coolerMap[HELIUM_COOLER] = coolants.helium/4;
coolerMap[BOOSTED_HELIUM_COOLER] = coolants.helium;
coolerMap[ENDER_COOLER] = coolants.ender/4;
coolerMap[BOOSTED_ENDER_COOLER] = coolants.ender;
coolerMap[CRYOTHEUM_COOLER] = coolants.cryotheum/4;
coolerMap[BOOSTED_CRYOTHEUM_COOLER] = coolants.cryotheum;
coolerMap[IRON_COOLER] = coolants.iron/4;
coolerMap[BOOSTED_IRON_COOLER] = coolants.iron;
coolerMap[EMERALD_COOLER] = coolants.emerald/4;
coolerMap[BOOSTED_EMERALD_COOLER] = coolants.emerald;
coolerMap[COPPER_COOLER] = coolants.copper/4;
coolerMap[BOOSTED_COPPER_COOLER] = coolants.copper;
coolerMap[TIN_COOLER] = coolants.tin/4;
coolerMap[BOOSTED_TIN_COOLER] = coolants.tin;
coolerMap[MAGNESIUM_COOLER] = coolants.magnesium/4;
coolerMap[BOOSTED_MAGNESIUM_COOLER] = coolants.magnesium;

const coolerIdToName = {};
coolerIdToName[WATER_COOLER] = "Water";
coolerIdToName[BOOSTED_WATER_COOLER] = "Water";
coolerIdToName[REDSTONE_COOLER] = "Redstone";
coolerIdToName[BOOSTED_REDSTONE_COOLER] = "Redstone";
coolerIdToName[QUARTZ_COOLER] = "Quartz";
coolerIdToName[BOOSTED_QUARTZ_COOLER] = "Quartz";
coolerIdToName[GOLD_COOLER] = "Gold";
coolerIdToName[BOOSTED_GOLD_COOLER] = "Gold";
coolerIdToName[GLOWSTONE_COOLER] = "Glowstone";
coolerIdToName[BOOSTED_GLOWSTONE_COOLER] = "Glowstone";
coolerIdToName[LAPIS_COOLER] = "Lapis";
coolerIdToName[BOOSTED_LAPIS_COOLER] = "Lapis";
coolerIdToName[DIAMOND_COOLER] = "Diamond";
coolerIdToName[BOOSTED_DIAMOND_COOLER] = "Diamond";
coolerIdToName[HELIUM_COOLER] = "Helium";
coolerIdToName[BOOSTED_HELIUM_COOLER] = "Helium";
coolerIdToName[ENDER_COOLER] = "Ender";
coolerIdToName[BOOSTED_ENDER_COOLER] = "Ender";
coolerIdToName[CRYOTHEUM_COOLER] = "Cryotheum";
coolerIdToName[BOOSTED_CRYOTHEUM_COOLER] = "Cryotheum";
coolerIdToName[IRON_COOLER] = "Iron";
coolerIdToName[BOOSTED_IRON_COOLER] = "Iron";
coolerIdToName[EMERALD_COOLER] = "Emerald";
coolerIdToName[BOOSTED_EMERALD_COOLER] = "Emerald";
coolerIdToName[COPPER_COOLER] = "Copper";
coolerIdToName[BOOSTED_COPPER_COOLER] = "Copper";
coolerIdToName[TIN_COOLER] = "Tin";
coolerIdToName[BOOSTED_TIN_COOLER] = "Tin";
coolerIdToName[MAGNESIUM_COOLER] = "Magnesium";
coolerIdToName[BOOSTED_MAGNESIUM_COOLER] = "Magnesium";


let reactorBlocks;
const reactorDetails = {};
let coolerId;
let placedCoolers;

/**
 * 
 * @param {Number} x length
 * @param {Number} y height
 * @param {Number} z depth
 * @returns the index of a 3D coordinate in reactor blocks array
 */
function computeBlockIndex(x, y, z){
    let bound = Math.floor(reactorDetails.reactorSideLength / 2);
    if(Math.abs(x) > bound || Math.abs(z) > bound) return -1;
    if(y < 0 || y > HEIGHT-1) return -1;
    x += bound;
    z += bound;
    return y * reactorDetails.reactorSideLength* reactorDetails.reactorSideLength + z * reactorDetails.reactorSideLength + x;
}

/**
 * Builds a square ring centered around (0, y, 0)
 * @param {Number} y height of the ring
 * @param {Number} size outer size of the ring
 * @param {Boolean} isGlass whether the ring is transparent or not
 */
function makeRing(y, ringSize, isGlass){
    let topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner, vertical, horizontal;
    if(isGlass){
        topLeftCorner = TOP_LEFT_CORNER_GLASS_MAGNET;
        topRightCorner = TOP_RIGHT_CORNER_GLASS_MAGNET;
        bottomLeftCorner = BOTTOM_LEFT_CORNER_GLASS_MAGNET;
        bottomRightCorner = BOTTOM_RIGHT_CORNER_GLASS_MAGNET;
        vertical = VERTICAL_GLASS_MAGNET;
        horizontal = HORIZONTAL_GLASS_MAGNET;
    } else {
        topLeftCorner = TOP_LEFT_CORNER_MAGNET;
        topRightCorner = TOP_RIGHT_CORNER_MAGNET;
        bottomLeftCorner = BOTTOM_LEFT_CORNER_MAGNET;
        bottomRightCorner = BOTTOM_RIGHT_CORNER_MAGNET;
        vertical = VERTICAL_MAGNET;
        horizontal = HORIZONTAL_MAGNET;
    }

    // Corners
        reactorBlocks[computeBlockIndex(ringSize, y, -ringSize)] = topLeftCorner; // Top left
        reactorBlocks[computeBlockIndex(-ringSize, y, -ringSize)] = topRightCorner; // Top right
        reactorBlocks[computeBlockIndex(ringSize, y, ringSize)] = bottomLeftCorner; // Bottom left
        reactorBlocks[computeBlockIndex(-ringSize, y, ringSize)] = bottomRightCorner; // Bottom right
    
    // Connecting corners
    for(let i = 1;i < 2*ringSize;++i){
        reactorBlocks[computeBlockIndex(-ringSize+i, y, -ringSize)] = horizontal; // Top side
        reactorBlocks[computeBlockIndex(ringSize, y, -ringSize+i)] = vertical; // Right side
        reactorBlocks[computeBlockIndex(ringSize-i, y, ringSize)] = horizontal; // Bottom side
        reactorBlocks[computeBlockIndex(-ringSize, y, ringSize-i)] = vertical; // Left side
    }
}

/**
 * Builds a reactor
 * @param {Number} size size of the reactor (1-48);
 * @returns an array indicating the placement of blocks
 */
function buildReactor(size, topRingIsGlass, bottomRingIsGlass, outerRingIsGlass, innerRingIsGlass){
    if(size < MIN_SIZE || size > MAX_SIZE) reactorDetails.reactorSize = 1;
    else reactorDetails.reactorSize = size;
    reactorDetails.reactorSideLength = 9 + 2*(size-1);
    reactorBlocks = new Uint8Array(HEIGHT * reactorDetails.reactorSideLength * reactorDetails.reactorSideLength);
    makeRing(1, reactorDetails.reactorSize + 1, innerRingIsGlass); // Inner
    makeRing(1, reactorDetails.reactorSize + 3, outerRingIsGlass); // Outer
    makeRing(2, reactorDetails.reactorSize + 2, topRingIsGlass); // Top
    makeRing(0, reactorDetails.reactorSize + 2, bottomRingIsGlass); // Bottom

    for(let i = 0;i < size-1;++i){ // Connectors
        reactorBlocks[computeBlockIndex(0, 1, -2-i)] = CONNECTOR;
        reactorBlocks[computeBlockIndex(0, 1, 2+i)] = CONNECTOR;
        reactorBlocks[computeBlockIndex(-2-i, 1, 0)] = CONNECTOR;
        reactorBlocks[computeBlockIndex(2+i, 1, 0)] = CONNECTOR;
    }
    placedCoolers = [];
}

/**
 * Sets the type of cooler to be placed
 * @param {Number} coolerType 
 */
function setCoolerType(coolerType){
    coolerId = Number(coolerType);
}

/**
 * Sets a block in the reactor
 * Accounts for the cooling bonus of symmetrical coolers
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @param {Boolean} removal whether the block is being removed or not
 * @returns 
 */
function setBlock(x, y, z, remvoval){
    let blockId = remvoval ? AIR : coolerId;
    const index = computeBlockIndex(x, y, z);
    if(y == 1 || index == -1) return;
    reactorBlocks[index] = blockId;

    // Set symmetrical block
    const symmetricalBlockIndex = computeBlockIndex(-x, (y-2)*-1, -z);
    const symmetricalBlockExists = reactorBlocks[symmetricalBlockIndex] != AIR;
    if(blockId != AIR){ // Placing a cooler
        if(symmetricalBlockExists){ // Symmetrical block is a cooler : give both blocks a cooling bonus
            reactorBlocks[symmetricalBlockIndex]++;
            reactorBlocks[index]++;
        }
        placedCoolers.push(index);
    } else { // Removing a cooler 
        if(symmetricalBlockExists) reactorBlocks[symmetricalBlockIndex]--; // Symmetrical block is a cooler : remove cooling bonus
        placedCoolers.splice(placedCoolers.indexOf(index), 1);
    }
    window.dispatchEvent(new CustomEvent("coolerChange"));
}

/**
 *  @returns the amount of placed coolers
 */
function getCoolerAmount(){
    return placedCoolers.length;
}

/**
 * 
 * @returns the total cooling of the reactor, including the contribution of each cooler type
 */
function computeCoolingBreakdown(){
    const breakdown = {total : 0, typeContribution : {}};
    for(const placedCooler of placedCoolers){
        const coolantName = coolerIdToName[reactorBlocks[placedCooler]];
        if(!breakdown.typeContribution[coolantName]) breakdown.typeContribution[coolantName] = 0;
        breakdown.typeContribution[coolantName] += coolerMap[reactorBlocks[placedCooler]];
        breakdown.total += coolerMap[reactorBlocks[placedCooler]];
    }
    breakdown.total /= reactorDetails.reactorSize;
    return breakdown;
}

export { AIR, CONNECTOR, TOP_LEFT_CORNER_GLASS_MAGNET, HORIZONTAL_GLASS_MAGNET, reactorBlocks, reactorDetails, computeBlockIndex, buildReactor, makeRing, setBlock, setCoolerType, computeCoolingBreakdown, getCoolerAmount}