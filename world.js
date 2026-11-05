import * as THREE from './vendor/three.module.js';
const canvas = document.querySelector('#world');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true;
renderer.setClearColor(0xd9e8d8);
const scene = new THREE.Scene(); scene.background=new THREE.Color(0xd9e8d8);
const camera = new THREE.PerspectiveCamera(38,1,.1,100); camera.position.set(11,10,14); camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff9e8,0x758d6c,2)); const light=new THREE.DirectionalLight(0xffefcf,2); light.position.set(-5,12,5); scene.add(light);
function box(w,h,d,color,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.9}));m.position.set(x,y,z);scene.add(m);return m}
function sphere(r,color,x,y,z){const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),new THREE.MeshStandardMaterial({color,roughness:.9}));m.position.set(x,y,z);scene.add(m);return m}
box(20,.2,20,0x97b38d,0,-.25,0);box(10,.25,7,0xb5ada0,0,-.1,0);
// 큰 통창과 밝은 지붕선
box(10,.25,.22,0xeee9dd,0,4,-3.4); for(let x=-5;x<=5;x+=2.5)box(.1,4,.12,0x87978c,x,2,-3.4);
box(10,.35,.18,0xa8b7a9,0,.2,-3.4);
// 숲
for(let i=0;i<15;i++){let x=-10+i*1.5,z=-5.2-(i%3)*1.4;box(.24,2.3,.24,0x816d50,x,1,z);for(let j=0;j<3;j++){const tree=new THREE.Mesh(new THREE.ConeGeometry(1.05-j*.17,1.7,7),new THREE.MeshStandardMaterial({color:[0x769b70,0x86a97e,0x6e946d][j]}));tree.position.set(x,2.3+j*.65,z);scene.add(tree)}}
// 긴 나무 테이블, 책과 의자
box(4,.16,1.25,0x9d7755,0,1,0);for(const x of [-1.7,1.7])for(const z of [-.45,.45])box(.12,1,.12,0x846347,x,.5,z);
for(let i=0;i<10;i++)box(.33,.07,.45,[0xdac8a2,0xaebea4,0xc79f8d,0xe5d8bf][i%4],-1.5+i*.32,1.12,0);
for(const x of [-1.2,1.2])for(const z of [-1.45,1.45]){box(.75,.12,.75,0xad8762,x,.55,z);box(.75,.8,.1,0xa27c58,x,.95,z+(z>0?.32:-.32));for(const dx of [-.28,.28])for(const dz of [-.28,.28])box(.08,.55,.08,0x876347,x+dx,.28,z+dz)}
// 책 진열대
box(2.5,.6,1,0xb59a7d,-3,.3,1.5);for(let i=0;i<10;i++)box(.2,.1,.5,[0xe4d3b4,0xb7c3af,0xc8998a][i%3],-4+i*.22,.65,1.5);
const character=new THREE.Group();scene.add(character);character.position.set(0,0,2.5);
const skin=new THREE.MeshStandardMaterial({color:0xe8bd94});const clothes=new THREE.MeshStandardMaterial({color:0x91a77e});
function part(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);character.add(m);return m}
part(new THREE.SphereGeometry(.38,20,16),skin,0,1,0);part(new THREE.SphereGeometry(.14,16,12),skin,-.3,1.3,0);part(new THREE.SphereGeometry(.14,16,12),skin,.3,1.3,0);part(new THREE.SphereGeometry(.3,16,12),clothes,0,.48,0);for(const x of [-.13,.13])part(new THREE.SphereGeometry(.035,12,8),new THREE.MeshStandardMaterial({color:0x433c34}),x,1,.355);
const keys=new Set();let seated=false,pages=0; const hint=document.querySelector('#hint');const sit=document.querySelector('#sit'),read=document.querySelector('#read'),stand=document.querySelector('#stand');
sit.onclick=()=>{if(Math.hypot(character.position.x,character.position.z-1.45)>1.8){hint.textContent='테이블 가까이 이동해 주세요';return}seated=true;character.position.set(1.2,0,1.45);character.scale.y=.72;sit.hidden=true;read.hidden=false;stand.hidden=false;hint.textContent='책장 넘기기를 눌러 보세요'};
read.onclick=()=>{pages++;hint.textContent=`사락사락, 책장을 넘겼어요 · ${pages}쪽`};stand.onclick=()=>{seated=false;character.scale.y=1;sit.hidden=false;read.hidden=true;stand.hidden=true;hint.textContent='방향키 또는 화면 버튼으로 이동하세요'};
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key)}});addEventListener('keyup',e=>keys.delete(e.key));
const names={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};document.querySelectorAll('[data-dir]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(names[b.dataset.dir])};b.onpointerup=b.onpointercancel=()=>keys.delete(names[b.dataset.dir])});
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();let last=0;function animate(t){requestAnimationFrame(animate);const dt=Math.min((t-last)/1000,.05);last=t;if(!seated){let dx=(keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0),dz=(keys.has('ArrowDown')?1:0)-(keys.has('ArrowUp')?1:0);character.position.x=THREE.MathUtils.clamp(character.position.x+dx*dt*2,-4.5,4.5);character.position.z=THREE.MathUtils.clamp(character.position.z+dz*dt*2,-3,3);character.position.y=dx||dz?Math.abs(Math.sin(t*.012))*.07:0}renderer.render(scene,camera)}requestAnimationFrame(animate);
