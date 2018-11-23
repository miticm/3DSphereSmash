let scene, camera, renderer;

function init() {

  let stats = initStats();

  // listen to the resize events
  window.addEventListener("resize", onResize, false);

  //create a scene
  scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(
    45,window.innerWidth / window.innerHeight,
    0.1,1000
  );

  // create a render and set the size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // show axes in the screen
  let axes = new THREE.AxesHelper(30);
  scene.add(axes);

  addPlane();
  let s1 = addSphere();
  
  // position and point the camera to the center of the scene
  camera.position.set(-40, 100, 50);
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(-40, 40, -15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(4096, 4096);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight);


  let ambienLight = new THREE.AmbientLight(0x808080);
  scene.add(ambienLight);

  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
    let speed = 1;
    let keyCode = event.which;
    console.log(keyCode)
      if (keyCode == 38) {
          s1.position.z -= speed;
      } else if (keyCode == 40) {
          s1.position.z += speed;
      } else if (keyCode == 37) {
          s1.position.x -= speed;
      } else if (keyCode == 39) {
          s1.position.x += speed;
      } else if (keyCode == 32) {
          s1.position.set(0, 4, 0);
      }
  };


  // add the output of the renderer to the html element
  document.getElementById("three-output").appendChild(renderer.domElement);

  renderScene()
  function renderScene() {
    stats.update();
    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addPlane() {
  let planeGeometry = new THREE.PlaneGeometry(50, 50);
  let planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xbbbbbb
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;

  // add the plane to the scene
  scene.add(plane);
}

function addSphere() {
  // create a sphere
  let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  
  // position the sphere
  sphere.position.set(0, 5, 10);
  sphere.castShadow = true;

  // add the sphere to the scene
  scene.add(sphere);
  return sphere;
}