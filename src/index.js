let scene, camera, renderer;

function init() {

  let stats = initStats();

  // listen to the resize events
  window.addEventListener("resize", onResize, false);

  //create a scene
  scene = new THREE.Scene();

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

  // show axes in the screen
  let axes = new THREE.AxesHelper(30);
  scene.add(axes);

  addPlane();
  addSphere();
  
  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 45);
  camera.lookAt(scene.position);

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
  let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(10, 0, 0);

  // add the plane to the scene
  scene.add(plane);
}

function addSphere() {
  // create a sphere
  let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff });
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.set(0, 5, 10);

  // add the sphere to the scene
  scene.add(sphere);
}