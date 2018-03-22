var width; //window.innerWidth;
var height; //window.innerHeight;
var scene;
var camera;
var renderer;
var controls;
var cube = [];
var cubelist = [];
var r = 50;
var n = 3;

function windSize(){
  height = window.innerHeight;
  width = window.innerWidth;
}



function init(){
  windSize();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);
  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;
  renderer = createRenderer(width, height);
  for(var i = -1; i < n-1; i++){
    cube[i+1] = [];
    for(var j = -1; j < n-1; j++){
      cube[i+1][j+1] = [];
      for(var k = -1; k < n-1; k++){
        cube[i+1][j+1][k+1] = createCube(r,i,j,k,0);
        cubelist[9*(i+1)+3*(j+1)+k+1] = cube[i+1][j+1][k+1];
      }
    }
  }
  var light1 = createLight(0xFFFFFF, 0, 1000, 0);
  var light2 = createLight(0xFFFFFF, 500, 1000, 1000);
  var light3 = createLight(0xFFFFFF, -500, 1000, -1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 200;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  update();
}



function createRenderer(width, height){
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0xFFFFFF, 1);
  document.body.appendChild(renderer.domElement);
  return renderer;
}



function createCube(r,x,y,z,w){
  var color = Math.floor(Math.random()*2);
  var geometry = new THREE.BoxGeometry(r, r, r);
  var material = new THREE.MeshPhongMaterial({color: (color == 0 ? 0x353535 : 0xFF8000)});
  var cube = new THREE.Mesh(geometry, material);
  cube.color = color;
  cube.position.set(x*(r+10), y*(r+10), z*(r+10));
  cube.mapx = x+1;
  cube.mapy = y+1;
  cube.mapz = z+1;
  scene.add(cube);
  return cube;
}



function cubecolorChange(obj){
  if(obj.color == 0) obj.material.color.setHex(0x353535);
  else obj.material.color.setHex(0xFF8000);
}



function createLight(color, x, y, z){
  var light = new THREE.DirectionalLight(color);
  light.position.set(x, y, z);
  return light;
}



function update(){
  controls.update();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
  var projector = new THREE.Projector();
  var mouse = {x: 0, y: 0};
  window.onmousedown = function(e){
    if(e.target == renderer.domElement){
      var rect = e.target.getBoundingClientRect();
      mouse.x =  e.clientX - rect.left;
      mouse.y =  e.clientY - rect.top;
      mouse.x =  (mouse.x / width) * 2 - 1;
      mouse.y = -(mouse.y / height) * 2 + 1;
      var vector = new THREE.Vector3(mouse.x, mouse.y ,1);
      projector.unprojectVector(vector, camera);
      var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var obj = ray.intersectObjects(cubelist);
      if(obj.length > 0){
        var tmp = [obj[0].object.mapx,obj[0].object.mapy,obj[0].object.mapz];
        for(var i = 0; i < 3; i++){
          for(var j = -1; j < 2; j++){
            var flag = 0;
            var x = tmp[0];
            var y = tmp[1];
            var z = tmp[2];
            if(i == 0){x += j; flag = 1;}
            else if(i == 1 && j != 0){y += j; flag = 1;}
            else if(i == 2 && j != 0){z += j; flag = 1;}
            if(flag == 1 && 0 <= x && x <= n-1 && 0 <= y && y <= n-1 && 0 <= z && z <= n-1){
              var centerC = cube[x][y][z];
              centerC.color = ~centerC.color&1;
              cubecolorChange(centerC);
            }
          }
        }
      }else controls.autoRotate = !controls.autoRotate;
    }
  };
}



window.addEventListener('DOMContentLoaded', init);
