// Animated particle network
const c=document.getElementById('bg'),x=c.getContext('2d');
let W,H,P=[],m={x:-999,y:-999};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){W=c.width=innerWidth;H=c.height=innerHeight;
  P=Array.from({length:Math.min(90,Math.floor(W*H/16000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))}
function draw(){
  x.clearRect(0,0,W,H);
  for(const p of P){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
    x.fillStyle='rgba(255,90,122,.7)';x.beginPath();x.arc(p.x,p.y,1.6,0,7);x.fill();
  }
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){
    const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);
    if(d<130){x.strokeStyle=`rgba(163,21,58,${.35*(1-d/130)})`;x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}
  }
  for(const p of P){const d=Math.hypot(p.x-m.x,p.y-m.y);
    if(d<160){x.strokeStyle=`rgba(255,90,122,${.5*(1-d/160)})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(m.x,m.y);x.stroke()}}
  if(!reduce)requestAnimationFrame(draw);
}
addEventListener('resize',size);size();draw();

// Cursor glow
const glow=document.querySelector('.glow');
addEventListener('pointermove',e=>{m={x:e.clientX,y:e.clientY};glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

// Reveal on scroll + count-up
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
  const n=e.target.querySelector('[data-count]');
  if(n){const to=+n.dataset.count,t0=performance.now();
    (function f(t){const k=Math.min(1,(t-t0)/1400);n.textContent=(to*(1-Math.pow(1-k,3))).toFixed(to%1?2:0);if(k<1)requestAnimationFrame(f)})(t0)}
}),{threshold:.2});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});

// 3D tilt + spotlight on cards
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    card.style.transform=`perspective(800px) rotateX(${(.5-py)*8}deg) rotateY(${(px-.5)*8}deg)`;
    card.style.setProperty('--mx',px*100+'%');card.style.setProperty('--my',py*100+'%');
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});
document.getElementById('y').textContent=new Date().getFullYear();
