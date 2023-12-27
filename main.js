import { requestRenderIfNotRequested, updateReactorFrameGeometry } from "./render.js";
import { buildReactor } from "./reactor.js";
const SIZE = 4;
buildReactor(SIZE, true, true, true, true);
updateReactorFrameGeometry(SIZE);

setTimeout(() => requestRenderIfNotRequested(), 100);