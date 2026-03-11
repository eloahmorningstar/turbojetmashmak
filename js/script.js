// Disable right-click
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  alert("Copyright Kusanagi 2026 Philippines!");
});

// Disable F12 and common dev tools shortcuts
document.addEventListener('keydown', function(e) {

  // F12
  if (e.key === 'F12') {
    e.preventDefault();
    alert("Copyright Kusanagi 2026 Philippines!");
  }

  // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey) {
    if (['I','J','C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      alert("Copyright Kusanagi 2026 Philippines!");
    }
  }

  // Ctrl+U (view source)
  if (e.ctrlKey && e.key.toUpperCase() === 'U') {
    e.preventDefault();
    alert("Copyright Kusanagi 2026 Philippines!");
  }

});


// === Three.js HUD Background ===
const canvas = document.getElementById('bg-canvas');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 60;


// Grid
const grid = new THREE.GridHelper(200,50,0x00ffff,0x00ffff);
grid.rotation.x = Math.PI/2;
scene.add(grid);


// Particles
const particles = new THREE.BufferGeometry();
const particleCount = 500;

const positions = [];

for(let i=0;i<particleCount;i++){

  positions.push((Math.random()-0.5)*200);
  positions.push((Math.random()-0.5)*200);
  positions.push((Math.random()-0.5)*200);

}

particles.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions,3)
);

const particleMaterial = new THREE.PointsMaterial({
  color:0x00ffff,
  size:0.7
});

const particleSystem = new THREE.Points(
  particles,
  particleMaterial
);

scene.add(particleSystem);


// Animation
function animate(){

  requestAnimationFrame(animate);

  grid.rotation.z += 0.001;
  particleSystem.rotation.y += 0.002;

  renderer.render(scene,camera);

}

animate();


// === Radio Button Marker Logic ===
const radios = document.querySelectorAll('.radios input[type="radio"]');

radios.forEach(radio => {

  radio.addEventListener('change', () => {

    const markerId = radio.value;

    document.querySelectorAll('.marker')
      .forEach(m => m.style.display='none');

    if(markerId){

      const marker = document.getElementById(markerId);

      if(marker){
        marker.style.display='block';
      }

    }

  });

});

document.addEventListener("dragstart", function(e) {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});

// === View Counter ===
let count = localStorage.getItem('visitCount');

if(!count){
  count = 0;
}

count = parseInt(count) + 1;

document.getElementById('counter').innerText = "Total Views: " + count;

localStorage.setItem('visitCount', count);


// === Table Popup Logic ===
const popup = document.getElementById('table-popup');

document.getElementById('open-table-btn')
  .addEventListener('click', () => {
    popup.style.display='block';
});

document.getElementById('close-table-btn')
  .addEventListener('click', () => {
    popup.style.display='none';
});

/* Block PrintScreen */
document.addEventListener("keyup", function(e){
    if(e.key === "PrintScreen"){
        navigator.clipboard.writeText("");
        alert("Copyright Kusanagi 2026 Philippines!");
    }
});

/* Block common screenshot shortcuts */
document.addEventListener("keydown", function(e){

    /* Windows Snipping Tool */
    if(e.key === "PrintScreen"){
        e.preventDefault();
    }

    /* Windows + Shift + S */
    if(e.ctrlKey && e.shiftKey && e.key === "S"){
        e.preventDefault();
    }

    /* Ctrl + P (print screenshot) */
    if(e.ctrlKey && e.key === "p"){
        e.preventDefault();
    }

});

/* Detect DevTools */
setInterval(function(){

    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if(widthThreshold || heightThreshold){
        document.body.innerHTML =
        "<h1 style='color:red;text-align:center;margin-top:20%;font-family:Orbitron;'>Copyright Kusanagi 2026 Philippines!</h1>";
    }

},1000);

window.addEventListener("blur", function(){
    document.body.style.filter = "blur(20px)";
});

window.addEventListener("focus", function(){
    document.body.style.filter = "none";
});
