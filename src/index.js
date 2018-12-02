const socket = io.connect(`http://localhost:8888`);

socket.on("updateSpeed",data=>{
  sphere.setLinearVelocity(data.speed);
})

let scene, camera, renderer;
let sphere;
let friction = 1, restitution = 1;
function init() {
  // Add phys environment
  Physijs.scripts.worker = "../libs/physijs/physijs_worker.js";
  Physijs.scripts.ammo = "./ammo.js";

  let stats = initStats();

  // listen to the resize events
  window.addEventListener("resize", onResize, false);

  //create a scene
  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -100, 0));

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // create a render and set the size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // // show axes in the screen
  // let axes = new THREE.AxesHelper(30);
  // scene.add(axes);

  addPlane();
  sphere = addSphere(0,10,0);

  // position and point the camera to the center of the scene
  camera.position.set(0, 100, 70);
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 40, -15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight);

  let ambienLight = new THREE.AmbientLight(0x808080);
  scene.add(ambienLight);

  // add the output of the renderer to the html element
  document.getElementById("three-output").appendChild(renderer.domElement);

  renderScene();
  function renderScene() {
    stats.update();
    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
    scene.simulate();
  }
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
      map: textureLoader.load("../assets/metal-floor.jpg")
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

function addSphere(x,y,z) {
  // create a sphere
  let material = Physijs.createMaterial(
    new THREE.MeshStandardMaterial({ color: 0x830808}),
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
    socket.emit("speed",{
      speed:{z: zspeed, y: sphere.getLinearVelocity().y, x: xspeed}
    })
    //sphere.setLinearVelocity({z: zspeed, y: sphere.getLinearVelocity().y, x: xspeed})
  }

  setInterval(() => {
    updateSpeed()
  }, 10);

  // add the sphere to the scene
  scene.add(sphere);
  return sphere;
}