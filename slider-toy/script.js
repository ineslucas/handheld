// Design goal: Make the slider as satisfying as possible to play with.

// What makes an interaction satisfying?
  // Continuity. Infinite possibilities while increasing the stakes.

// Ideas:
  // If gyroscope moves, gravity.y changes.
  // TODO: add window resize function.
  // New feature done: Press space to disable or enable gravity ✅
  // Have it hosted locally and figure out spacebar issue OR change key.

console.log('Hello!');

let slider = document.getElementById('slider');
slider.value = 0.5; // Initial value - midpoint between 0 and 1

let firstInteraction = false; // Tracking first slider movement
let isDragging = false; // Track if user is holding down the slider
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let spawnInterval; // Interval for continuous spawning
let gravityEnabled = true; // Track if gravity is on

// Track mouse position
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});


// Create an engine
const engine = Matter.Engine.create();
engine.gravity.x = 0; // Subtle horizontal pull 0.33
engine.gravity.y = 0.5; // Floating effect -0.2

const world = engine.world;

// Create a renderer
const render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Common bouncy properties
const bouncyOptions = {
    isStatic: true,
    restitution: 0.8, // Walls bounce a little
    friction: 0.2,
    render: { visible: false } // Floor now invisible
};

// Walls + Ground at the bottom of the screen
const wallThickness = 50;
const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 40, bouncyOptions);
const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, bouncyOptions);
const rightWall = Matter.Bodies.rectangle(window.innerWidth + wallThickness / 2, window.innerHeight / 2, wallThickness, window.innerHeight, bouncyOptions);
const ceiling = Matter.Bodies.rectangle(window.innerWidth / 2, -wallThickness / 2, window.innerWidth, wallThickness, bouncyOptions);

Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

// Store all created balls
let balls = [];


// New ball at mouse position
const createBallAtMouse = () => {
    const newBall = Matter.Bodies.circle(mouseX, mouseY, 40, {
        restitution: 1.1, // Higher than 1 = gain energy (feels fun!)
        friction: 0.015, // Reduce friction for smoothness
        frictionAir: 0.001 // Slight air resistance for natural feel - perfect param.
    });
    Matter.World.add(world, newBall);
};


// Listen for slider changes
slider.addEventListener('input', (event) => {
    let gravityFactor = parseFloat(event.target.value) * 2 - 1; // Map 0 → -1 and 1 → 1
    // engine.gravity.x = gravityFactor;
    if (gravityEnabled) engine.gravity.x = gravityFactor; // Change gravity only if enabled 🌸
    console.log(`Gravity X: ${engine.gravity.x}`);
});

// When the user first clicks the slider, start spawning balls
slider.addEventListener('mousedown', () => {
    if (!firstInteraction) {
        firstInteraction = true;
    }
    isDragging = true;

    // Start spawning balls every 200ms while holding the slider
    spawnInterval = setInterval(() => {
        if (isDragging) {
            createBallAtMouse();
        }
    }, 200);
});

// Stop spawning balls when the user releases the slider
slider.addEventListener('mouseup', () => {
    isDragging = false;
    clearInterval(spawnInterval);
});

// Listen for spacebar press to disable gravity
// Nor working -> debug.
window.addEventListener('keydown', (event) => {
    if (event.code === "Space") {
        gravityEnabled = !gravityEnabled; // Toggle gravity

        if (!gravityEnabled) {
            engine.gravity.x = 0; // Stop horizontal movement
            engine.gravity.y = 0.2; // Disable gravity

            // Make all balls fall naturally with very little bounce
            balls.forEach(ball => {
                Matter.Body.set(ball, {
                    restitution: 0.05, // Just enough bounce to look alive
                    friction: 0.3, // More friction to settle
                    frictionAir: 0.05 // Slight air resistance
                });
            });

            console.log("Gravity Disabled. Balls will drop naturally.");
        } else {
            engine.gravity.y = 0.5; // Restore normal downward gravity
            console.log("Gravity Enabled. Balls floating again.");
        }
    }
});


// Run the engine and renderer
Matter.Engine.run(engine);
Matter.Render.run(render);