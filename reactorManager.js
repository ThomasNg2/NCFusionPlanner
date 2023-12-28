import { minSize, maxSize } from "./E2E-NC-config.json";

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

let reactorBlocks;
const reactorDetails = {};
let coolerId;

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
    } else { // Removing a cooler 
        if(symmetricalBlockExists) reactorBlocks[symmetricalBlockIndex]--; // Symmetrical block is a cooler : remove cooling bonus
    }
}

export { AIR, CONNECTOR, TOP_LEFT_CORNER_GLASS_MAGNET, HORIZONTAL_GLASS_MAGNET, reactorBlocks, reactorDetails, computeBlockIndex, buildReactor, makeRing, setBlock, setCoolerType}