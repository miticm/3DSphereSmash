function init() {
  // listen to the resize events
  window.addEventListener("resize", onResize, false);

  //create a scene
  let scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);


    // show axes in the screen
  var axes = new THREE.AxesHelper(30);
  scene.add(axes);

  let planeGeometry = new THREE.PlaneGeometry(50, 50);
  let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xAAAAAA
  });
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);

  // add the plane to the scene
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 45);
  camera.lookAt(scene.position);

   // add the output of the renderer to the html element
   document.getElementById("three-output").appendChild(renderer.domElement);

   // render the scene
   renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
