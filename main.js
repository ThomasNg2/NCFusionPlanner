import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const REACTOR_HEIGHT = 3;
const SIZE = 4;
const TRANSPARENCY = 6;

let sideLength;
let blocks;

/**
 * 
 * @param {Number} x length
 * @param {Number} y height
 * @param {Number} z depth
 * @returns the index of a 3D coordinate in the block presence array
 */
function computeBlockIndex(x, y, z){
    let bound = Math.floor(sideLength / 2);
    if(Math.abs(x) > bound || Math.abs(z) > bound) return -1;
    x += bound;
    z += bound;
    return y * sideLength**2 + z * sideLength + x;
}

/**
 * Marks the presence of a square ring centered around (0, y, 0) in the block presence array
 * @param {Number} y height of the ring
 * @param {Number} size outer size of the ring
 */
function makeRing(y, size){
    // Corners
    blocks[computeBlockIndex(size, y, -size)] = 2 + TRANSPARENCY; // Top right
    blocks[computeBlockIndex(-size, y, -size)] = 3 + TRANSPARENCY; // Top left
    blocks[computeBlockIndex(size, y, size)] = 4 + TRANSPARENCY; // Bottom right
    blocks[computeBlockIndex(-size, y, size)] = 5 + TRANSPARENCY; // Bottom left
    
    // Connecting corners
    for(let i = 1;i < 2*size;++i){
        blocks[computeBlockIndex(-size+i, y, -size)] = 7 + TRANSPARENCY; // Top side
        blocks[computeBlockIndex(size, y, -size+i)] = 6 + TRANSPARENCY; // Right side
        blocks[computeBlockIndex(size-i, y, size)] = 7 + TRANSPARENCY; // Bottom side
        blocks[computeBlockIndex(-size, y, size-i)] = 6 + TRANSPARENCY; // Left side
    }
}

/**
 * Builds a reactor
 * @param {Number} size size of the reactor (1-48);
 * @returns an array indicating the placement of blocks
 */
function buildReactor(size){
    if(size < 1 || size > 48) size = 1;
    sideLength = 9 + 2*(size-1);
    blocks = new Uint8Array(REACTOR_HEIGHT * sideLength * sideLength);

    makeRing(1, size + 1); // Inner
    makeRing(1, size + 3); // Outer
    makeRing(2, size + 2); // Top
    makeRing(0, size + 2); // Bottom

    for(let i = 0;i < size-1;++i){ // Connectors
        blocks[computeBlockIndex(0, 1, -2-i)] = 1;
        blocks[computeBlockIndex(0, 1, 2+i)] = 1;
        blocks[computeBlockIndex(-2-i, 1, 0)] = 1;
        blocks[computeBlockIndex(2+i, 1, 0)] = 1;
    }

    return blocks;
}

/**
 * Sets the block at (x, y, z) to blockId
 * Accounts for the cooling bonus of symmetrical coolers
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 * @param {*} blockId  
 * @returns 
 */
function setBlock(x, y, z, blockId){
    const index = computeBlockIndex(x, y, z);
    if(y == 1 || index == -1) return;
    reactorBlocks[index] = blockId;

    // Set symmetrical block
    const symmetricalBlockIndex = computeBlockIndex(-x, (y-2)*-1, -z);
    const symmetricalBlockExists = reactorBlocks[symmetricalBlockIndex] > 0;
    if(blockId > 0){ // Placing a cooler
        if(symmetricalBlockExists){ // Symmetrical block is a cooler : give both blocks a cooling bonus
            reactorBlocks[symmetricalBlockIndex]++;
            reactorBlocks[index]++;
        }
    } else { // Removing a cooler 
        if(symmetricalBlockExists) reactorBlocks[symmetricalBlockIndex]--; // Symmetrical block is a cooler : remove cooling bonus
    }
}

const tileSize = 16;
const tileTextureWidth = 688;
const tileTextureHeight = 64;
const loader = new THREE.TextureLoader();
const texture = loader.load("assets/atlas.png");
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;

/**
 * Resizes the renderer to match the canvas size
 * @param {*} renderer 
 * @returns 
 */
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const canvas = document.querySelector("#c");

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Set up camera
const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 300;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 6;
camera.position.x = 6;
camera.position.y = 6;

const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.update();
controls.addEventListener("change", requestRenderIfNotRequested);

// Set up renderer
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const light1 = new THREE.DirectionalLight(0xFFFFFF, 1.5);
const light2 = new THREE.DirectionalLight(0xFFFFFF, 1);
light1.position.set(-54, 14, 64);
light2.position.set(52, -12, -64);
scene.add(light1);
scene.add(light2);

const gltfLoader = new GLTFLoader();
const url = "assets/NC Fusion Core.glb";
gltfLoader.load(url, (gltf) => {
    const root = gltf.scene;
    root.position.x = root.position.z = 0.5;
    scene.add(root);
});

const blockFaces = [
    { // left
        uvRow: 1,
        dir: [-1, 0, 0],
        corners: [
            { pos: [0, 1, 0], uv: [0, 1] },
            { pos: [0, 0, 0], uv: [0, 0] },
            { pos: [0, 1, 1], uv: [1, 1] },
            { pos: [0, 0, 1], uv: [1, 0] }
        ]
    },
    { // right
        uvRow: 1,
        dir: [1, 0, 0],
        corners: [
            { pos: [1, 1, 1], uv: [0, 1] },
            { pos: [1, 0, 1], uv: [0, 0] },
            { pos: [1, 1, 0], uv: [1, 1] },
            { pos: [1, 0, 0], uv: [1, 0] }
        ]
    },
    { // bottom
        uvRow: 3,
        dir: [0, -1, 0],
        corners: [
            { pos: [1, 0, 1], uv: [1, 0] },
            { pos: [0, 0, 1], uv: [0, 0] },
            { pos: [1, 0, 0], uv: [1, 1] },
            { pos: [0, 0, 0], uv: [0, 1] }
        ]
    },
    { // top
        uvRow: 0,
        dir: [0, 1, 0],
        corners: [
            { pos: [0, 1, 1], uv: [1, 1] },
            { pos: [1, 1, 1], uv: [0, 1] },
            { pos: [0, 1, 0], uv: [1, 0] },
            { pos: [1, 1, 0], uv: [0, 0] }
        ]
    },
    { // back
        uvRow: 2,
        dir: [0, 0, -1],
        corners: [
            { pos: [1, 0, 0], uv: [0, 0] },
            { pos: [0, 0, 0], uv: [1, 0] },
            { pos: [1, 1, 0], uv: [0, 1] },
            { pos: [0, 1, 0], uv: [1, 1] }
        ]
    },
    { // front
        uvRow: 2,
        dir: [0, 0, 1],
        corners: [
            { pos: [0, 0, 1], uv: [0, 0] },
            { pos: [1, 0, 1], uv: [1, 0] },
            { pos: [0, 1, 1], uv: [0, 1] },
            { pos: [1, 1, 1], uv: [1, 1] }
        ]
    }
];

let reactorFrameGeometry = new THREE.BufferGeometry();
const reactorFrameMaterial = new THREE.MeshLambertMaterial( {
    map: texture,
    transparent: true,
    alphaTest: 0.2,
    side: THREE.DoubleSide
});

/**
 * Updates the geometry of the reactor frame
 * @param {*} size 
 */
function updateReactorFrameGeometry(size){
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const HALF_LENGTH = Math.floor((9+2*(size-1))/2);
    for(let y = 0;y < 3;++y){
        for(let z = -HALF_LENGTH;z <= HALF_LENGTH;++z){
            for(let x = -HALF_LENGTH;x <= HALF_LENGTH;++x){
                const block = reactorBlocks[computeBlockIndex(x, y, z)];
                if (block != 0) {
                    // block type #0 has no texture so texture indexes start at 0
                    const textureIndex = block - 1;
                    const blockIsTransparent = block > 7 && block < 14;
                    for ( const { dir, corners, uvRow } of blockFaces ) {
                        const neighbor = reactorBlocks[computeBlockIndex(x + dir[0], y + dir[1], z + dir[2])];
                        const neighborIsTransparent = neighbor > 7 && neighbor < 14;
                        if (neighbor == 0 || neighbor == undefined || (!blockIsTransparent && neighborIsTransparent)){
                            // Current face isn't obstructed by a neighbor, draw it
                            const ndx = positions.length / 3;
                            for ( const { pos, uv } of corners ) {
                                positions.push(pos[0]+x, pos[1]+y, pos[2]+z);
                                normals.push(...dir);
                                uvs.push(
                                    ( textureIndex + uv[0] ) * tileSize / tileTextureWidth,
                                    1 - ( uvRow + 1 - uv[1] ) * tileSize / tileTextureHeight );
                            }
                            indices.push(
                                ndx, ndx + 1, ndx + 2,
                                ndx + 2, ndx + 1, ndx + 3,
                            );
                        }
                    }
                }
            }
        }
    }

    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    reactorFrameGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array( positions ), positionNumComponents));
    reactorFrameGeometry.setAttribute(
        "normal",
        new THREE.BufferAttribute(new Float32Array( normals ), normalNumComponents));
    reactorFrameGeometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array( uvs ), uvNumComponents));
    reactorFrameGeometry.setIndex(indices);
}

const reactorBlocks = buildReactor(SIZE);
updateReactorFrameGeometry(SIZE);
const reactorFrameMesh = new THREE.Mesh(reactorFrameGeometry, reactorFrameMaterial);


scene.add( reactorFrameMesh );

/**
 * Attemps to render a frame
 */
function requestRenderIfNotRequested() {
    if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
    }
}

let renderRequested = false;
/**
 * Renders a frame
 */
function render() {
    renderRequested = false;
   
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render(scene, camera);
}

const mouse = {
    x: 0,
    y: 0,
};
   
/**
 * Records the starting position of the mouse
 * @param {*} event 
 */
function recordStartPosition(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.moveX = 0;
    mouse.moveY = 0;
}

/**
 * Records the movement of the mouse
 * @param {*} event 
 */
function recordMovement(event) {
    mouse.moveX += Math.abs(mouse.x - event.clientX);
    mouse.moveY += Math.abs(mouse.y - event.clientY);
}

/**
 * Places or removes a block at cursor position
 * @param {*} event 
 */
function placeBlockIfNoMovement(event) {
    if (mouse.moveX < 5 && mouse.moveY < 5) {
        toggleCooler(event);
    }
    window.removeEventListener("pointermove", recordMovement);
    window.removeEventListener("pointerup", placeBlockIfNoMovement);
}
canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    recordStartPosition(event);
    window.addEventListener("pointermove", recordMovement);
    window.addEventListener("pointerup", placeBlockIfNoMovement);
}, {passive: false});

/**
 * Returns the canvas relative position of the mouse
 * @param {*} event 
 * @returns 
 */
function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
}

/**
 * Returns the intersection of a ray with the reactor frame
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
function intersectRay(start, end) {
    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let dz = end.z - start.z;
    const lenSq = dx * dx + dy * dy + dz * dz;
    const len = Math.sqrt( lenSq );

    dx /= len;
    dy /= len;
    dz /= len;

    let t = 0.0;
    let ix = Math.floor( start.x );
    let iy = Math.floor( start.y );
    let iz = Math.floor( start.z );

    const stepX = ( dx > 0 ) ? 1 : - 1;
    const stepY = ( dy > 0 ) ? 1 : - 1;
    const stepZ = ( dz > 0 ) ? 1 : - 1;

    const txDelta = Math.abs( 1 / dx );
    const tyDelta = Math.abs( 1 / dy );
    const tzDelta = Math.abs( 1 / dz );

    const xDist = ( stepX > 0 ) ? ( ix + 1 - start.x ) : ( start.x - ix );
    const yDist = ( stepY > 0 ) ? ( iy + 1 - start.y ) : ( start.y - iy );
    const zDist = ( stepZ > 0 ) ? ( iz + 1 - start.z ) : ( start.z - iz );

    // location of nearest block boundary, in units of t
    let txMax = ( txDelta < Infinity ) ? txDelta * xDist : Infinity;
    let tyMax = ( tyDelta < Infinity ) ? tyDelta * yDist : Infinity;
    let tzMax = ( tzDelta < Infinity ) ? tzDelta * zDist : Infinity;

    let steppedIndex = - 1;

    // main loop along raycast vector
    while (t <= len) {
        const block = reactorBlocks[computeBlockIndex(ix, iy, iz)];
        if (block > 0) {
            return {
                position: [
                    start.x + t * dx,
                    start.y + t * dy,
                    start.z + t * dz,
                ],
                normal: [
                    steppedIndex === 0 ? - stepX : 0,
                    steppedIndex === 1 ? - stepY : 0,
                    steppedIndex === 2 ? - stepZ : 0,
                ],
                block
            };
        }

        // advance t to next nearest block boundary
        if (txMax < tyMax) {
            if (txMax < tzMax) {
                ix += stepX;
                t = txMax;
                txMax += txDelta;
                steppedIndex = 0;

            } else {
                iz += stepZ;
                t = tzMax;
                tzMax += tzDelta;
                steppedIndex = 2;
            }
        } else {
            if (tyMax < tzMax) {
                iy += stepY;
                t = tyMax;
                tyMax += tyDelta;
                steppedIndex = 1;
            } else {
                iz += stepZ;
                t = tzMax;
                tzMax += tzDelta;
                steppedIndex = 2;
            }
        }
    }
    return null;
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function toggleCooler(event){
    const pos = getCanvasRelativePosition(event);
    const x = (pos.x / canvas.width ) *  2 - 1;
    const y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
 
    const start = new THREE.Vector3();
    const end = new THREE.Vector3();
    start.setFromMatrixPosition(camera.matrixWorld);
    end.set(x, y, 1).unproject(camera);
    const intersection = intersectRay(start, end);
    if(!intersection) return;
    if (intersection.block > 1) { // Block is not a connector
        let blockId;
        if(intersection.block < 14){ // Block is a magnet
            blockId = 16;
        } else { // Block is a cooler
            blockId = 0;
        }
        const pos = intersection.position.map((v, ndx) => {
            return Math.floor(v + intersection.normal[ndx] * (blockId > 0 ? 0.5 : -0.5));
        });
        setBlock(...pos, blockId);
        updateReactorFrameGeometry(SIZE);
        requestRenderIfNotRequested();
    }
}

// Handle window resize
window.addEventListener("resize", requestRenderIfNotRequested);

// Start the animation loop
setTimeout(() => render(), 100);