'use strict';
const canvas=document.querySelector('#sky'),ctx=canvas.getContext('2d');
const radiusInput=document.querySelector('#radius'),distanceInput=document.querySelector('#distance');
const pauseButton=document.querySelector('#pause'),status=document.querySelector('#status');
let W=0,H=0,scale=1,ox=0,oy=0,source,points=[],paused=matchMedia('(prefers-reduced-motion: reduce)').matches,last=0,time=0;
const mouse={x:-10000,y:-10000,px:-10000,py:-10000,vx:0,vy:0,active:false};
function resize(){W=innerWidth;H=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(source){const usableH=H-(W<600?190:110);scale=Math.min((W-32)/source.width,usableH/source.height);ox=(W-source.width*scale)/2;oy=60+(usableH-source.height*scale)/2;}}
function syncPause(){pauseButton.textContent=paused?'움직임 재생':'움직임 멈춤';pauseButton.setAttribute('aria-pressed',String(paused));}
syncPause();
window.addEventListener('resize',resize);resize();
for(const input of [radiusInput,distanceInput])input.addEventListener('input',()=>{document.querySelector('#'+input.id+'Value').value=input.value;});
function move(e){if(!mouse.active){mouse.px=e.clientX;mouse.py=e.clientY;}mouse.active=true;mouse.x=e.clientX;mouse.y=e.clientY;}
canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',e=>{move(e);canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointerleave',()=>{mouse.active=false;});canvas.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')mouse.active=false;});canvas.addEventListener('pointercancel',()=>{mouse.active=false;});
window.addEventListener('blur',()=>{mouse.active=false;});
pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();});
document.querySelector('#reset').addEventListener('click',()=>{points.forEach(p=>{p.x=p.hx;p.y=p.hy;p.vx=p.vy=p.energy=0;});mouse.active=false;});
function draw(ts){const dt=Math.min((ts-last)/16.667||1,2);last=ts;if(!paused)time+=dt*.016667;
 ctx.fillStyle='#ce479c';ctx.fillRect(0,0,W,H);
 const grid=25*scale; if(grid>0){ctx.strokeStyle='rgba(255,255,255,.13)';ctx.lineWidth=.5;ctx.beginPath();for(let x=ox%grid;x<W;x+=grid){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=oy%grid;y<H;y+=grid){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();}
 if(source){const radius=+radiusInput.value/scale,travel=+distanceInput.value/scale;const mx=(mouse.x-ox)/scale,my=(mouse.y-oy)/scale;
 if(!paused){mouse.vx+=(Math.max(-32,Math.min(32,mouse.x-mouse.px))-mouse.vx)*.22;mouse.vy+=(Math.max(-32,Math.min(32,mouse.y-mouse.py))-mouse.vy)*.22;mouse.px=mouse.x;mouse.py=mouse.y;}
 ctx.fillStyle='#fffff4';
 for(const p of points){if(!paused){const dx=p.hx-mx,dy=p.hy-my,d=Math.hypot(dx,dy);const influence=mouse.active?Math.max(0,1-d/radius):0;p.energy+=(influence-p.energy)*(influence>p.energy?.12:.024)*dt;
 // A shared curling flow keeps the flock coherent. Individual phases and springs give it a soft return.
 const a=Math.atan2(dy,dx);const phase=time*2.3+p.phase;const bend=Math.sin(phase)*.22;const flow=a+.65+bend;const force=travel*p.energy;
 // Slow spatial waves move neighboring dots together even without a pointer.
 const wind=time*.85+p.hx*.004+p.hy*.002;
 const flock=Math.pow((1+Math.sin(time*.65-p.hx*.006+p.hy*.0025))/2,6);
 const ambientX=(Math.sin(wind)*3+Math.cos(wind*.7)*flock*11)/scale;
 const ambientY=(Math.cos(wind*.8)*2.5-Math.sin(wind*.7)*flock*9)/scale;
 const targetX=p.hx+ambientX+Math.cos(flow)*force+mouse.vx/scale*p.energy*1.2;
 const targetY=p.hy+ambientY+Math.sin(flow)*force+mouse.vy/scale*p.energy*1.2- Math.sin(phase*.7)*force*.18;
 p.vx+=(targetX-p.x)*.012*dt;p.vy+=(targetY-p.y)*.012*dt;const damping=Math.pow(.88,dt);p.vx*=damping;p.vy*=damping;p.x+=p.vx*dt;p.y+=p.vy*dt;}
 const x=ox+p.x*scale,y=oy+p.y*scale,size=Math.max(1.7,p.size*scale);const speed=Math.hypot(p.vx,p.vy)*scale;
 // Tiny elongated traces read as flight without replacing the reference's square pixels.
 if(speed>.5){ctx.globalAlpha=Math.min(.22,speed*.045);ctx.fillRect(x-p.vx*scale*1.5-size/2,y-p.vy*scale*1.5-size/2,size,size);}
 ctx.globalAlpha=1;ctx.fillRect(x-size/2,y-size/2,size,size);
 }
 }requestAnimationFrame(draw);}
fetch('points.json').then(r=>{if(!r.ok)throw Error('load');return r.json();}).then(data=>{source=data;points=data.points.map(([x,y,size],i)=>({hx:x,hy:y,x,y,size,vx:0,vy:0,energy:0,phase:Math.sin(i*12.9898)*.8}));resize();status.textContent='';}).catch(()=>{status.textContent='그림을 불러오지 못했어. 페이지를 새로고침해 줘.';});
requestAnimationFrame(draw);
