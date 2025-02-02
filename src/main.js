import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from 'lenis'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const lenis = new Lenis();
lenis.on("scroll",ScrollTrigger.update);
gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
});

gsap.ticker.lagSmoothing(0)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(0x000000,0)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
document.querySelector(".model").appendChild(renderer.domElement)

const amblight = new THREE.AmbientLight( 0x404040, 0.5 ); 
scene.add( amblight );

const mainLight = new THREE.DirectionalLight( 0xffffff , 3.5 );
mainLight.position.set(0.5, 7.5, 2.5)
scene.add( mainLight );

const fillLight = new THREE.DirectionalLight( 0xffffff , 0.5 );
fillLight.position.set(-15, 0, -5)
scene.add( fillLight );

const hemilight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
hemilight.position.set(0, 0, 0)
scene.add( hemilight );

window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

function basciAnimate() {
	renderer.render( scene, camera );
    renderer.setAnimationLoop( basciAnimate );
}
basciAnimate()

let model;
const loader = new GLTFLoader();
loader.load("./black_chair.glb",function(gltf){
    model = gltf.scene
    model.traverse((node) => {
        if(node.isMesh){
            if(node.material){
                node.material.metalness = 2;
                node.material.roughness = 3;
                node.material.evvMapIntensity = 5;
            }
            node.cashShadow = true;
            node.receiveShadow = true
        }
    })

    const box = new THREE.Box3().setFromObject(model);
    const center =  box.getCenter(new THREE.Vector3())
    model.position.sub(center)
    scene.add(model)


    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    camera.position.z = maxDim * 1.9

    model.scale.set(0, 0, 0)
    model.rotation.set(0, 0.7, 0)
    playInitialAnimation();

    cancelAnimationFrame(basciAnimate)
    animate();
})

const floatAmplitude = 0.2
const floatSpeed = 1.5
const rotationSpeed = 0.3
let isFloating = true
let currentScroll = 0

const totalScrollHeight =
document.documentElement.scrollHeight - window.innerHeight

function playInitialAnimation(){
    if(model) {
        gsap.to(model.scale, {
            x:1,
            y:1,
            z:1,
            duration:1,
            ease:"power2.out"
        })
    }
}

lenis.on("scroll", (e) =>{
    currentScroll = e.scroll;
})

function animate() {
    if(model){
        if (isFloating){
            const floatOffset = Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude
            model.position.y = floatOffset
        }

        const scrollProgress = Math.min(currentScroll / totalScrollHeight, 1)

        const baseTilt = 0.5
        model.rotation.x = scrollProgress * Math.PI * 4 + baseTilt
    }

    renderer.render(scene,camera)
    requestAnimationFrame(animate)
}

var tl = gsap.timeline()
gsap.registerPlugin(ScrollTrigger)

tl.from('.sec1h22',{
    y:30,
    opacity:0,
    delay:0.5,
    duration:0.5
})
tl.from('.sec1h11',{
    y:30,
    opacity:0,
    delay:0.3,
    duration:0.5
})
tl.from('.left p',{
    y:10,
    opacity:0,
    delay:0.3,
    duration:0.5
})
tl.from('.right p',{
    opacity:0,
    delay:0.3,
    duration:0.5,
    stagger:0.5
})

let tl_2 = gsap.timeline({
    scrollTrigger:{
        trigger:'.sec2id2',
        start:'top 30%'
    }
}) 

tl_2.from('.offers',{
    opacity:0,
    stagger:0.3
})

let tl_3 = gsap.timeline({
    scrollTrigger:{
        trigger:'.sec3',
        start:'top 30%'
    }
}) 

tl_3.from('.sec3 h1',{
    opacity:0,
    y:-100,
})

tl_3.from('.sec3 p',{
    opacity:0,
    delay:0.5,
    stagger:1
})