let scene, camera, renderer;

function init() {
  // Add phys environment
  Physijs.scripts.worker = "../libs/physijs/physijs_worker.js";
  Physijs.scripts.ammo = "./ammo.js";

  let stats = initStats();

  // listen to the resize events
  window.addEventListener("resize", onResize, false);

  //create a scene
  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -10, 0));

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
  addSphere();

  // position and point the camera to the center of the scene
  camera.position.set(-40, 100, 50);
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 40, -15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(4096, 4096);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight);

  let ambienLight = new THREE.AmbientLight(0x808080);
  scene.add(ambienLight);

  // document.addEventListener("keydown", onDocumentKeyDown, false);
  // function onDocumentKeyDown(event) {
  //   let speed = 1;
  //   let keyCode = event.which;
  //   console.log(keyCode)
  //     if (keyCode == 38) {
  //         s1.position.z -= speed;
  //     } else if (keyCode == 40) {
  //         s1.position.z += speed;
  //     } else if (keyCode == 37) {
  //         s1.position.x -= speed;
  //     } else if (keyCode == 39) {
  //         s1.position.x += speed;
  //     } else if (keyCode == 32) {
  //         s1.position.set(0, 4, 0);
  //     }
  // };

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
  let ground_material = Physijs.createMaterial(
    new THREE.MeshStandardMaterial({
      map: textureLoader.load("../assets/metal-floor.jpg")
    }),
    0.9,
    0.3
  );
  let plane = new Physijs.BoxMesh(
    new THREE.BoxGeometry(60, 1, 60),
    ground_material,
    0
  );

  //plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;
  plane.castShadow = true;

  // add the plane to the scene
  scene.add(plane);
}

function addSphere() {
  // create a sphere
  let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  // let sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  // let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  let sphere = new Physijs.BoxMesh(
    sphereGeometry,
    Physijs.createMaterial(
      new THREE.MeshStandardMaterial({
        color: 0x8777ff,
        transparent: false,
        opacity: 1
      })
    )
  );

  // position the sphere
  sphere.position.set(0, 30, 10);
  sphere.castShadow = true;

  // add the sphere to the scene
  scene.add(sphere);
  return sphere;
}
