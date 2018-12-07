const socket = io.connect(`http://localhost:8888`);

socket.on("connected", data => {
  index = data.index
  if(index == 0){
    p2Index = 1;
  }else{
    p2Index = 0;
  }
  console.log(index);
});

socket.on("start", () => {
  var body = document.getElementById("three-output");
  var pending = document.getElementById("pending");
  if (body.childNodes.length > 0) {
    body.removeChild(body.childNodes[0]);
  }

  if (pending.childNodes.length > 0) {
    pending.innerHTML = '';
  }

  init();
  console.log("coming here");
  spheres = [
    addSphere(1,4,1),
    addSphere(9,4,9)
  ];
  renderScene();
});

socket.on("findNew", () => {
  socket.emit("findNew");
});

socket.on("update",data => {
  spheres[index].setLinearVelocity(data.me.speed)
  spheres[p2Index].setLinearVelocity(data.opponent.speed)
  xspeed = data.me.speed.x;
  zspeed = data.me.speed.z;
});

socket.on("pending", data => {
  var body = document.getElementById("three-output");
  if (body.childNodes.length > 0) {
    body.removeChild(body.childNodes[0]);
  }
  document.getElementById("pending").innerHTML = `<h1>${data.message}</h1>`;
});


let scene, camera, renderer,stats;
let spheres;
let friction = 0.7, restitution = 1;
let index,p2Index;
let playersData = {};

function init() {
  // Add phys environment
  Physijs.scripts.worker = "../libs/physijs/physijs_worker.js";
  Physijs.scripts.ammo = "./ammo.js";

  stats = initStats();

  // listen to the resize events
  window.addEventListener("resize", onResize, false);

  //create a scene
  scene = new Physijs.Scene();
  let spaceTexture = new THREE.TextureLoader().load( "./assets/space.jpg" );
  scene.background = spaceTexture;

  scene.setGravity(new THREE.Vector3(0, -100, 0));

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // create a render and set the size
  renderer = new THREE.WebGLRenderer({ antialias: false,alpha:true });
  renderer.setClearColor(new THREE.Color(0x000000,0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  addPlane();
  addCage();

  // position and point the camera to the center of the scene
  camera.position.set(0, 150, 150);
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 100, 0);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight);

  let ambienLight = new THREE.AmbientLight(0x808080);
  scene.add(ambienLight);

  // add the output of the renderer to the html element
  document.getElementById("three-output").appendChild(renderer.domElement);
}

function renderScene() {
  stats.update();
  updateSpeed();
  // render using requestAnimationFrame
  requestAnimationFrame(renderScene);
  renderer.render(scene, camera);
  scene.simulate();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addPlane() {
  let textureLoader = new THREE.TextureLoader();
  let p1_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: textureLoader.load("./assets/metal-floor.jpg")
    }),
    friction,
    restitution
  );
  let plane = new Physijs.BoxMesh(
    new THREE.BoxGeometry(70, 1, 70),
    p1_material,
    0
  );

  //plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;
  plane.castShadow = true;

  // add the plane to the scene
  scene.add(plane);
  return plane;
}

function addCage() {
  let textureLoader = new THREE.TextureLoader();
  let texture = textureLoader.load( './assets/fire.jpg', function ( texture ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 2,5 );
  });

  let p1_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: texture
    }),
    friction,
    restitution
  );

  // Floor of cage
  let floor = new Physijs.BoxMesh(
    new THREE.BoxGeometry(150, 1, 150),
    p1_material,
    0
  );

  // Top wall of cage
  let tWall = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 1, 150),
    p1_material,
    0
  );

  // Right Wall of cage
  let rWall = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 1, 150),
    p1_material,
    0
  );

  // Bottom wall of cage
  let bWall = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 1, 150),
    p1_material,
    0
  );

  // Left wall of cage
  let lWall = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 1, 150),
    p1_material,
    0
  );

  // Set floor position
  //plane.rotation.x = -0.5 * Math.PI;
  floor.position.set(0, -30, 0);
  floor.receiveShadow = true;
  floor.castShadow = true;

  // Set top wall position
  tWall.rotation.y = -0.5 * Math.PI;
  tWall.rotation.z = -0.5 * Math.PI;
  tWall.position.set(0, -5, 75);
  tWall.receiveShadow = true;
  tWall.castShadow = true;

  // Set right wall position
  rWall.rotation.z = 0.5 * Math.PI;
  rWall.position.set(75, -5, 0);
  rWall.receiveShadow = true;
  rWall.castShadow = true;

  // Set bottomo wall position
  bWall.rotation.y = 0.5 * Math.PI;
  bWall.rotation.z = 0.5 * Math.PI;
  bWall.position.set(0, -5, -75);
  bWall.receiveShadow = true;
  bWall.castShadow = true;

  // Set left wall position
  lWall.rotation.z = -0.5 * Math.PI;
  lWall.position.set(-75, -5, 0);
  lWall.receiveShadow = true;
  lWall.castShadow = true;


  // add the plane to the scene
  scene.add(floor);
  scene.add(tWall);
  scene.add(rWall);
  scene.add(bWall);
  scene.add(lWall);
}

function addSphere(x,y,z) {
  // create a sphere
  let textureLoader = new THREE.TextureLoader();
  let material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: textureLoader.load("./assets/floor-wood.jpg")
    }),
    friction,
    restitution
  );
  let sphere = new Physijs.SphereMesh(
    new THREE.SphereGeometry(4, 30, 30),
    material
  );

  //make it Ellipsoid
  sphere.scale.set(1,1,1);

  // position the sphere
  sphere.position.set(x,y,z);
  sphere.castShadow = true;

  // add the sphere to the scene
  scene.add(sphere);
  return sphere;
}



let zspeed = 0,xspeed = 0,acceleration = 1;
let keymap = {38:false,40:false,37:false,39:false,32:false};
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
function onKeyUp(event) {
  if(event.which in keymap){
    keymap[event.which] = false;
  }
}
function onKeyDown(event) {
  if(event.which in keymap){
    keymap[event.which] = true;
  }
}

function updateSpeed() {
  if(keymap[32]){
    acceleration = 5;
  }else{
    acceleration = 1;
  }
  if (keymap[38]) {
    zspeed -= acceleration;
  }
  if (keymap[40]) {
    zspeed += acceleration;
  }
  if (keymap[37]) {
    xspeed -= acceleration;
  }
  if (keymap[39]) {
    xspeed += acceleration;
  }
  playersData[index] = {z: zspeed, y: spheres[index].getLinearVelocity().y, x: xspeed}
  playersData[p2Index] = spheres[p2Index].getLinearVelocity()
  socket.emit("speed",playersData)
}
