// TODO:
// Inspired by the clock website,
// Make this canvas a circle, with draggable items,
// + choice of items around a circle
  // add a spinner wheel to randomize choice.
  // add a button to stop the wheel.

import('/src/style.css')
  .then((module) => {
  })
  .catch((error) => {
    console.error('Error loading the module:', error);
  });

// Arrays to store all options
const artOptions = [
  'art/Brazil_Movie_Poster.jpeg',
  'art/Jeff_Koons_Balloon_Dog.png',
  'art/Archival_Luna_Monde_Poster.png',
  'art/flowers.jpg',
  'art/Yunji_Park.png',
  'art/Mime-flower.jpg',
  'art/Luna_Luna_Archival_Objects_Silk_Scarf.png',
  'art/Yunji_Park_Blue.png',
  'art/bed_with_clouds.png',
];

const sofaOptions = [
  'sofa/Bellini-Sofa.png',
  'sofa/sacha-lakic-bubble-sofa.png',
  'sofa/GaeAulentiLoveseatforKnollInternational.png',
  'sofa/Ligne-Roset-Togo.png',
  'sofa/Togo-Bergundy.png',
  'sofa/Sesann_Sofa.png',
];

const trinketOptions = [
  'trinket/Hay_Bolt_Hook.png',
  'trinket/Fritz_Hansen_Happy_Hook_Blush.png',
  'trinket/Herman_Miller_Hang-It-All.png',
  'trinket/Vitra_Blue_Utensilio.png',
  'trinket/House_Notebooks.png',
  'trinket/Hay_Arcs_Trolley_auburn_red.png',
  'trinket/Vitra_Red_Utensilio.png',
  'trinket/Vitra-mint-green-toolbox.png',
  'trinket/Hay_Korpus_Shelf_S_pink.png',
  'trinket/Basquiat_Ferris_Wheel_Pin.png',
  'trinket/Petite_Friture_Klump_Wall_hook.png',
  'trinket/Kartell_Componibili.png',
  'trinket/Utensilio_Wall_Shelf_Georgio_de_Ferrari_1970.png',
  // 'trinket/Utensilo_White_Plastic_Wall_Shelf_1970.png',
  // 'trinket/Visiva_Wall_storage_system_1970.png',
];

// Current indices
let currentArt = 0;
let currentSofa = 0;
let currentTrinket = 0;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d"); // Webgl is another type of drawing context

// Set up high-DPI canvas
function setupCanvas() {
  // Canvas dimensions can only be set here, not CSS.
  const dpr = window.devicePixelRatio || 1;

  // Set base dimensions
  const baseWidth = 300;   // canvas.width = 300;
    // window.innerWidth * 0.3
  const baseHeight = window.innerHeight * 0.5;  // canvas.height = 400;

  // Set display size (css pixels)
  canvas.style.width = `${baseWidth}px`;
  canvas.style.height = `${baseHeight}px`;

  // Set actual size in memory (scaled for high DPI)
  canvas.width = baseWidth * dpr;
  canvas.height = baseHeight * dpr;

  // Scale all drawing operations by the dpr
  ctx.scale(dpr, dpr);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

// Define fixed positions for each type of item
const canvasPositions = {
  ////// x
  // y ///

  art: {
    x: 110,        // Move right
    y: 50,         // Near top
    w: 100,        // Wider
    h: null        // Taller // Will be calculated based on aspect ratio
  },
  sofa: {
    x: 15,        // Centered
    y: 220,        // Below art
    w: 230,        // Good width for sofa
    h: null         // Reasonable height
  },
  trinket: {
    x: 20,         // Left side
    y: 110,        // Middle height
    w: 70,        // Smaller than other items
    h: null        // Square ratio for trinket
  }
};

// Function to cycle through options
function cycleOption(type, options, currentIndex) {
  // Updating image
  currentIndex = (currentIndex + 1) % options.length;
  const img = document.querySelector(`.${type}`);
  img.src = options[currentIndex];

  // Updating the number tag
  const numberCircle = img.parentElement.querySelector('.number-circle');
  numberCircle.textContent = currentIndex + 1;  // +1 since arrays are 0-based

  return currentIndex;
}

// Add click listeners
document.querySelector('.art').addEventListener('click', () => {
  currentArt = cycleOption('art', artOptions, currentArt);
  drawCanvas();
});

document.querySelector('.sofa').addEventListener('click', () => {
  currentSofa = cycleOption('sofa', sofaOptions, currentSofa);
  drawCanvas();
});

document.querySelector('.trinket').addEventListener('click', () => {
  currentTrinket = cycleOption('trinket', trinketOptions, currentTrinket);
  drawCanvas();
});

function drawCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw art in its position
  drawItemWithEffect(artOptions[currentArt], canvasPositions.art, 'sticker-border', 'art');

  // Draw sofa in its position
  drawItemWithEffect(sofaOptions[currentSofa], canvasPositions.sofa, 'sticker-border', 'sofa');

  // Draw trinket in its position
  drawItemWithEffect(trinketOptions[currentTrinket], canvasPositions.trinket, 'sticker-border', 'trinket');
}

// function drawItem(src, position) {
//   const img = new Image();
//   img.src = src;
//   img.onload = () => {
//     const aspectRatio = img.naturalHeight / img.naturalWidth;
//     const height = position.w * aspectRatio;

//     ctx.drawImage(img, position.x, position.y, position.w, height);
//   };
// }

function drawItemWithEffect(src, position, effect, type) {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const height = position.w * aspectRatio;

    ctx.save(); // Save current context state

    switch(effect) {
      case 'sticker-border':
        // Draw white outline using multiple shadows
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 0;  // Sharp edge for outline

        // Top-left outline
        ctx.shadowOffsetX = -4;
        ctx.shadowOffsetY = -4;
        ctx.drawImage(img, position.x, position.y, position.w, height);

        // Top-right outline
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = -4;
        ctx.drawImage(img, position.x, position.y, position.w, height);

        // Bottom-left outline
        ctx.shadowOffsetX = -4;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(img, position.x, position.y, position.w, height);

        // Bottom-right outline
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(img, position.x, position.y, position.w, height);

        // Clear shadows and draw the original image on top
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(img, position.x, position.y, position.w, height);

        ctx.restore(); // Restore the context state

        break;

      case 'holographic':
        // Create holographic effect
        ctx.shadowColor = 'rgba(239, 84, 143, 0.6)'; // --c1: #ef548f
        ctx.shadowBlur = 20;

        // Create gradient overlay
        const gradient = ctx.createLinearGradient(
          position.x,
          position.y,
          position.x + position.w,
          position.y + height
        );
        gradient.addColorStop(0, '#ef548f');    // --c1
        gradient.addColorStop(0.25, '#ef8b6d');  // --c2
        gradient.addColorStop(0.5, '#cfef6b');   // --c3
        gradient.addColorStop(0.75, '#3bf0c1');  // --c4
        gradient.addColorStop(1, '#bb4af0');     // --c5

        // Add shine effect
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = gradient;

        break;

      case 'sticker':
        // Create sticker effect with white border
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        // Add white border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 10;
        ctx.strokeRect(position.x - 5, position.y - 5, position.w + 10, height + 10);

        break;

      case 'glossy':
        // Create glossy effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 15;

        // Add shine gradient
        const shineGradient = ctx.createLinearGradient(
          position.x,
          position.y,
          position.x,
          position.y + height
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');

        break;
    }

    // Draw the image
    ctx.drawImage(img, position.x, position.y, position.w, height);

    // Apply additional effect overlays if needed
    // if (effect === 'glossy') {
    //   ctx.globalAlpha = 0.2;
    //   ctx.fillRect(position.x, position.y, position.w, height);
    // }

    // After drawing the image, Detect visible edges of PNG images
    // NOT WORKING TOO WELL
    const imageData = ctx.getImageData(position.x, position.y, position.w, height);
    const data = imageData.data;

    let minX = position.w;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    // Find non-transparent pixels
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < position.w; x++) {
        const alpha = data[((y * position.w + x) * 4) + 3];
        if (alpha > 0) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    // Log the boundaries (relative to image position)
    console.log('Image bounds:', {
      left: position.x + minX,
      top: position.y + minY,
      right: position.x + maxX,
      bottom: position.y + maxY
    });

    console.log('Image bounds divided by scale:', {
      left: position.x + minX,
      top: position.y + minY,
      right: position.x + maxX,
      bottom: position.y + maxY
    });

    // RETURN HERE TO CHANGE THE NUMBER TAG POSITION

    // Position the number tag based on detected edges
    const numberCircle = document.querySelector(`.${type}`).parentElement.querySelector('.number-circle');
    if (numberCircle) {
      // Convert canvas coordinates to page coordinates
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      // Position at top-right of visible content
      numberCircle.style.position = 'absolute';
      // 🚨🚨 TODO 🚨🚨
      // numberCircle.style.left = `${(position.x + maxX) / scaleX}px`;
      // numberCircle.style.top = `${(position.y + minY) / scaleY}px`;

      numberCircle.style.left = `${0}px`;
      numberCircle.style.top = `${0}px`;
    }

    ctx.restore(); // Restore context state
  };
}

setupCanvas();
drawCanvas();

window.addEventListener('resize', () => {
  setupCanvas();
  drawCanvas();  // Make sure to redraw content after resize
});
