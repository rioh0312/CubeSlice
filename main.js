/* global $ */
/* global THREE */
var width = 600;
var height = 400;
var fov = 80;
var aspect = width / height;
var near = 1;
var far = 1000;

var camera, trackball, light, axis, mainCubeMesh, renderer;
var scene = new THREE.Scene();
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

var container = document.getElementById('canvas-frame');
var mouseXPosElement = document.getElementById('mouse-x-pos');
var mouseYPosElement = document.getElementById('mouse-y-pos');
var mouseZPosElement = document.getElementById('mouse-z-pos');
var searchXPosElement = document.getElementById('search-x-pos');
var searchYPosElement = document.getElementById('search-y-pos');
var searchZPosElement = document.getElementById('search-z-pos');

// カメラ作成 & トラックボール作成
initCamera();

// 光源の作成
initLight()

// axis-helperの描画
initAxisHelper();

// メインキューブの作成
createMainCubeMesh();

// レンダラーの作成
initRenderer();

// レンダリング
animate();

// マウスイベント登録
initMouseEvent();

// -------------------------------
// GUI関連
// -------------------------------
var timer = new Timer(100, [function (time) {
    document.getElementById('current-time').innerHTML = time;
    $('#playback').val(time);
    $('#playback').change();

}]);

$('#play').click(function () {
    timer.start();
});
$('#stop').click(function () {
    timer.stop();
});
$('#playback').change(function () {
    var playback = $(this);
    timer.setTime(Number(playback.val()));
});

function initCamera() {
    // カメラ作成
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // カメラの位置を設定
    camera.position.set(300, 300, 300);
    // カメラの向きを設定
    camera.lookAt({ x: 0, y: 0, z: 0 });

    // トラックボールの作成
    trackball = new THREE.TrackballControls(camera);
    // 回転無効化と回転速度の設定
    trackball.noRotate = false; // false:有効 true:無効
    trackball.rotateSpeed = 5.0;
    // ズーム無効化とズーム速度の設定
    trackball.noZoom = false; // false:有効 true:無効
    trackball.zoomSpeed = 1.0;
    // パン無効化とパン速度の設定
    trackball.noPan = false; // false:有効 true:無効
    trackball.panSpeed = 1.0;
    // スタティックムーブの有効化
    trackball.staticMoving = true; // true:スタティックムーブ false:ダイナミックムーブ
    // ダイナミックムーブ時の減衰定数
    trackball.dynamicDampingFactor = 0.3
}

function initLight() {
    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
}

function initAxisHelper() {
    axis = new THREE.AxisHelper(1000);
    axis.position.set(0, 0, 0);
    scene.add(axis);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
}

function initMouseEvent() {
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
}

function createMainCubeMesh() {
    // ジオメトリ(形状)の作成
    var geometry = new THREE.CubeGeometry(200, 200, 200);

    // マテリアル(材質)の作成
    var materials = [
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
        new THREE.MeshLambertMaterial({ color: 0x0000ff }),
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
        new THREE.MeshLambertMaterial({ color: 0x0000ff })];
    var material = new THREE.MeshFaceMaterial(materials);

    // メッシュ(物体)の作成
    mainCubeMesh = new THREE.Mesh(geometry, material);
    
    // シーンに追加
    scene.add(mainCubeMesh);
}

function animate() {
    // アニメーション
    requestAnimationFrame(animate);
    // トラックボールによるカメラのプロパティの更新
    trackball.update();
    // レンダリング
    render();
}

function render() {
    // 衝突判定
    intersects();
    // レンダリング
    renderer.render(scene, camera);
}

function onMouseMove(event) {

    event.preventDefault();

    var array = getMousePosition(container, event.clientX, event.clientY);
    mouse.fromArray(array);
    mouse.set((mouse.x * 2) - 1, - (mouse.y * 2) + 1);
    raycaster.setFromCamera(mouse, camera); raycaster.setFromCamera(mouse, camera);
}

function onMouseDown(event) {

    if (event.button == 2) { // 右クリック
        if (intersects()) {
            searchXPosElement.value = mouseXPosElement.innerText;
            searchYPosElement.value = mouseYPosElement.innerText;
            searchZPosElement.value = mouseZPosElement.innerText;
        }
    }
}

function intersects() {

    var intersects = raycaster.intersectObjects([mainCubeMesh]);
    if (intersects.length > 0) {
        var pikcingObj = intersects[0];
        mouseXPosElement.innerText = String(Math.floor(pikcingObj.point.x) + 100);
        mouseYPosElement.innerText = String(Math.floor(pikcingObj.point.y) + 100);
        mouseZPosElement.innerText = String(Math.floor(pikcingObj.point.z) + 100);
        return true;
    }
    return false;
}

function getMousePosition(dom, x, y) {
    var rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
};
