import * as THREE from "three";
import { vertexShader, fragmentShader, alternateFragmentShader } from "./shaders";

const imgWrapper = document.getElementById("img_wrapper");
const slides = imgWrapper?.querySelectorAll("img[id=img_static]");
const container = document.getElementById("img_wrapper");

let scrollIntensity = 0;
let targetScrollIntensity = 0;
const maxScrollIntensity = 1.0;
const scrollSmoothness = 0.5;

let scrollPosition = 0;
let targetScrollPosition = 0;
const scrollPositionSmoothness = 0.05;

let isMoving = false;
const movementThreshold = 0.001;
let isSnapping = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);
container?.appendChild(renderer.domElement);

const calculatePlaneDimensions = () => {
  const fov = camera.fov * (Math.PI / 100);
  const viewportHeight = 2 * Math.tan(fov / 2) * camera.position.z;
  const viewportWidth = viewportHeight * camera.aspect;

  const widthFactor = window.innerWidth < 900 ? 0.9 : 0.5;
  const planeWidth = viewportWidth * widthFactor;
  const planeHeight = planeWidth * (9 / 16);

  return { width: planeWidth, height: planeHeight };
};

const dimensions = calculatePlaneDimensions();

const loadTextures = () => {
  const textureLoader = new THREE.TextureLoader();

  if (!slides || slides.length === 0) {
    console.error("Ошибка: не найдены изображения для загрузки.");
    return Promise.resolve([]);
  }

  return new Promise((resolve, reject) => {
    const loadPromises = Array.from(slides).map((slide, index) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(
          slide.src,
          (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            textures[index] = texture;
            console.log(`Текстура для ${slide.src} загружена`);
            resolve(texture);
          },
          undefined,
          (error) => {
            console.error(`Ошибка загрузки текстуры для ${slide.src}`);
            reject(error);
          }
        );
      });
    });

    Promise.all(loadPromises)
      .then(() => {
        resolve(textures);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const textures = [];
loadTextures().then(() => {
  preloadAllTextures();
});

function preloadAllTextures() {
  textures.forEach((texture, index) => {
    if (texture) {
      texture.needsUpdate = true;
      console.log(`Текстура с индексом ${index} обновлена.`);
    } else {
      console.warn(`Текстура с индексом ${index} не загружена.`);
    }
  });
}

const geometry = new THREE.PlaneGeometry(
  dimensions.width,
  dimensions.height,
  32,
  32
);

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uScrollIntensity: { value: scrollIntensity },
    uScrollPosition: { value: scrollPosition },
    uCurrentTexture: { value: textures[0] },
    uNextTexture: { value: textures[1] },
  },
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

window.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    console.log("Wheel event detected", event.deltaY);

    isSnapping = false;
    targetScrollIntensity += event.deltaY * 0.001;
    targetScrollIntensity = Math.max(
      -maxScrollIntensity,
      Math.min(maxScrollIntensity, targetScrollIntensity)
    );

    targetScrollPosition += event.deltaY * 0.001;
    console.log("Target scroll position:", targetScrollPosition);
    isMoving = true;
  },
  { passive: false }
);

function updateShader() {
  const normalizedScroll = Math.abs(scrollPosition % 1);

  if (normalizedScroll < 0.5) {
    material.fragmentShader = fragmentShader;
  } else {
    material.fragmentShader = alternateFragmentShader;
  }

  material.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);

  scrollIntensity += (targetScrollIntensity - scrollIntensity) * scrollSmoothness;
  material.uniforms.uScrollIntensity.value = scrollIntensity;

  scrollPosition += (targetScrollPosition - scrollPosition) * scrollPositionSmoothness;
  // Make sure to update the uniform for scroll position
  material.uniforms.uScrollPosition.value = scrollPosition;

  updateShader(); // Updating shader

  renderer.render(scene, camera);
}

loadTextures().then(() => {
  preloadAllTextures();
  console.log("All textures loaded, starting animation");
  // Only start animation after textures are loaded
  animate();
});
