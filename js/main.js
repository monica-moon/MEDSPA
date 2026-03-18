/* ── CURSOR GLOW ── */
const glow=document.getElementById('cursor-glow');
document.addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

/* ── NAV SCROLL ── */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>60)});

/* ── MOBILE NAV ── */
const toggle=document.getElementById('mobile-toggle'),navLinks=document.getElementById('nav-links');
toggle.addEventListener('click',()=>{navLinks.classList.toggle('open');toggle.classList.toggle('active')});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

/* ── PARALLAX HERO (enhanced) ── */
const heroP=document.getElementById('hero-parallax'),heroC=document.getElementById('hero-content'),heroOverlay=document.querySelector('.hero-overlay');
let ticking=false;
window.addEventListener('scroll',()=>{
if(!ticking){requestAnimationFrame(()=>{
const s=window.scrollY;
if(s<window.innerHeight){
heroP.style.transform='translate3d(0,'+s*.35+'px,0) scale('+(1+s*.0002)+')';
heroOverlay.style.opacity=.4+s/(window.innerHeight*2);
heroC.style.transform='translate3d(0,'+s*.12+'px,0)';
heroC.style.opacity=1-s/(window.innerHeight*.7);
}
ticking=false;
});}ticking=true;
});

/* ── PARTICLES (enhanced — drift, shimmer, connections) ── */
(function(){
const c=document.getElementById('particles-canvas'),ctx=c.getContext('2d');
let w,h,particles=[],mouse={x:-1000,y:-1000},time=0;
function resize(){w=c.width=c.offsetWidth;h=c.height=c.offsetHeight}
window.addEventListener('resize',resize);resize();
const count=80;
for(let i=0;i<count;i++){
particles.push({
x:Math.random()*w,y:Math.random()*h,
r:Math.random()*2+.5,
baseR:Math.random()*2+.5,
dx:(Math.random()-.5)*.15,
dy:(Math.random()-.5)*.15 - .05,
o:Math.random()*.4+.1,
baseO:Math.random()*.4+.1,
phase:Math.random()*Math.PI*2,
speed:.3+Math.random()*.4
});
}
document.querySelector('.hero').addEventListener('mousemove',e=>{
const r=c.getBoundingClientRect();
mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
});
document.querySelector('.hero').addEventListener('mouseleave',()=>{mouse.x=-1000;mouse.y=-1000});
function draw(){
time+=.008;
ctx.clearRect(0,0,w,h);
particles.forEach(p=>{
/* sinusoidal drift */
p.x+=p.dx+Math.sin(time*p.speed+p.phase)*.12;
p.y+=p.dy+Math.cos(time*p.speed*.7+p.phase)*.06;
/* shimmer */
p.o=p.baseO+Math.sin(time*1.5+p.phase)*.15;
p.r=p.baseR+Math.sin(time*2+p.phase)*.4;
/* wrap */
if(p.y<-20){p.y=h+20;p.x=Math.random()*w}
if(p.y>h+20){p.y=-20;p.x=Math.random()*w}
if(p.x<-20)p.x=w+20;
if(p.x>w+20)p.x=-20;
/* mouse repel (gentle) */
const mdx=p.x-mouse.x,mdy=p.y-mouse.y,md=Math.sqrt(mdx*mdx+mdy*mdy);
if(md<150){
const force=(1-md/150)*.6;
p.x+=mdx/md*force;p.y+=mdy/md*force;
}
/* draw glow */
const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
grad.addColorStop(0,'rgba(201,169,110,'+p.o+')');
grad.addColorStop(1,'rgba(201,169,110,0)');
ctx.beginPath();ctx.arc(p.x,p.y,p.r*3,0,Math.PI*2);
ctx.fillStyle=grad;ctx.fill();
/* core dot */
ctx.beginPath();ctx.arc(p.x,p.y,p.r*.6,0,Math.PI*2);
ctx.fillStyle='rgba(212,185,122,'+Math.min(p.o*1.8,1)+')';ctx.fill();
});
/* subtle connection lines between nearby particles */
for(let i=0;i<particles.length;i++){
for(let j=i+1;j<particles.length;j++){
const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
const dist=dx*dx+dy*dy;
if(dist<12000){
ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);
ctx.lineTo(particles[j].x,particles[j].y);
ctx.strokeStyle='rgba(201,169,110,'+((.04)*(1-dist/12000))+')';
ctx.lineWidth=.5;ctx.stroke();
}
}
}
requestAnimationFrame(draw);
}
draw();
})();

/* ── FADE IN ON SCROLL ── */
const faders=document.querySelectorAll('.fade-in');
const fadeObs=new IntersectionObserver((entries)=>{
entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');fadeObs.unobserve(e.target)}});
},{threshold:.15});
faders.forEach(f=>fadeObs.observe(f));

/* ── HERO BADGE FADE ── */
const heroBadge=document.querySelector('.hero-badge');
if(heroBadge)setTimeout(()=>heroBadge.classList.add('visible'),1200);

/* ── TIMELINE ANIMATION ── */
const tlItems=document.querySelectorAll('.timeline-item');
const tlObs=new IntersectionObserver((entries)=>{
entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');tlObs.unobserve(e.target)}});
},{threshold:.2});
tlItems.forEach(t=>tlObs.observe(t));

/* ── QUIZ ── */
(function(){
let step=0,answers=[];
const steps=document.querySelectorAll('.quiz-step'),
dots=document.querySelectorAll('.quiz-dot'),
result=document.getElementById('quiz-result'),
resultTitle=document.getElementById('quiz-result-title'),
resultDesc=document.getElementById('quiz-result-desc');

document.querySelectorAll('.quiz-opt').forEach(btn=>{
btn.addEventListener('click',function(){
this.parentElement.querySelectorAll('.quiz-opt').forEach(b=>b.classList.remove('selected'));
this.classList.add('selected');
answers[step]=this.dataset.value;
});
});
document.querySelectorAll('.quiz-next').forEach(btn=>{
btn.addEventListener('click',()=>{
if(!answers[step])return;
if(step<2){step++;showStep()}else showResult();
});
});
document.querySelectorAll('.quiz-back').forEach(btn=>{
btn.addEventListener('click',()=>{if(step>0){step--;showStep()}});
});
document.getElementById('quiz-restart').addEventListener('click',()=>{
step=0;answers=[];result.style.display='none';
document.querySelectorAll('.quiz-opt').forEach(b=>b.classList.remove('selected'));
showStep();
});
function showStep(){
steps.forEach((s,i)=>s.classList.toggle('active',i===step));
dots.forEach((d,i)=>d.classList.toggle('active',i<=step));
result.style.display='none';
}
function showResult(){
steps.forEach(s=>s.classList.remove('active'));
const recs={
wrinkles:{immediate:{minimal:'Hydrafacial',moderate:'Botox',advanced:'Botox'},
gradual:{minimal:'Hydrafacial',moderate:'Microneedling',advanced:'Botox'},
longterm:{minimal:'Microneedling',moderate:'PRP Therapy',advanced:'Laser Skin Rejuvenation'}},
texture:{immediate:{minimal:'Hydrafacial',moderate:'Hydrafacial',advanced:'Microneedling'},
gradual:{minimal:'Hydrafacial',moderate:'Microneedling',advanced:'Microneedling'},
longterm:{minimal:'Microneedling',moderate:'PRP Therapy',advanced:'Laser Skin Rejuvenation'}},
brighten:{immediate:{minimal:'Hydrafacial',moderate:'Hydrafacial',advanced:'Laser Skin Rejuvenation'},
gradual:{minimal:'Hydrafacial',moderate:'Microneedling',advanced:'PRP Therapy'},
longterm:{minimal:'Microneedling',moderate:'PRP Therapy',advanced:'Laser Skin Rejuvenation'}},
acne:{immediate:{minimal:'Hydrafacial',moderate:'Hydrafacial',advanced:'Laser Skin Rejuvenation'},
gradual:{minimal:'Hydrafacial',moderate:'Microneedling',advanced:'Microneedling'},
longterm:{minimal:'Microneedling',moderate:'PRP Therapy',advanced:'Laser Skin Rejuvenation'}}
};
const descs={
'Botox':'Precision neuromodulator injections to smooth wrinkles and fine lines, delivering a naturally refreshed appearance with minimal downtime.',
'Hydrafacial':'A multi-step facial that cleanses, exfoliates, and infuses skin with intensive serums for an immediate, radiant glow.',
'Microneedling':'Controlled micro-injuries stimulate your skin\'s natural healing, boosting collagen for smoother, firmer skin over time.',
'Dermal Fillers':'Premium hyaluronic acid fillers restore lost volume, sculpt contours, and smooth deep lines for youthful definition.',
'PRP Therapy':'Using your body\'s own platelet-rich plasma to accelerate healing, rejuvenate skin, and promote natural collagen growth.',
'Laser Skin Rejuvenation':'Advanced laser technology precisely targets pigmentation, scars, and texture irregularities for a flawless, even complexion.'
};
const rec=recs[answers[0]]?.[answers[1]]?.[answers[2]]||'Hydrafacial';
resultTitle.textContent='We Recommend: '+rec;
resultDesc.textContent=descs[rec]||'';
result.style.display='block';
dots.forEach(d=>d.classList.add('active'));
}
})();

/* ── CALENDAR ── */
(function(){
const grid=document.getElementById('calendar-days'),
monthYear=document.getElementById('cal-month-year'),
prevBtn=document.getElementById('cal-prev'),
nextBtn=document.getElementById('cal-next');
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
let current=new Date(),selDay=null;
function render(){
const y=current.getFullYear(),m=current.getMonth();
monthYear.textContent=months[m]+' '+y;
grid.innerHTML='';
days.forEach(d=>{const el=document.createElement('div');el.className='cal-day-label';el.textContent=d;grid.appendChild(el)});
const first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate();
const today=new Date();today.setHours(0,0,0,0);
for(let i=0;i<first;i++){const el=document.createElement('div');el.className='cal-day empty';grid.appendChild(el)}
for(let d=1;d<=last;d++){
const el=document.createElement('div');el.className='cal-day';el.textContent=d;
const dt=new Date(y,m,d);
if(dt<today)el.classList.add('past');
else{
el.addEventListener('click',function(){
grid.querySelectorAll('.cal-day').forEach(c=>c.classList.remove('selected'));
this.classList.add('selected');selDay=d;
});
}
grid.appendChild(el);
}
}
prevBtn.addEventListener('click',()=>{current.setMonth(current.getMonth()-1);render()});
nextBtn.addEventListener('click',()=>{current.setMonth(current.getMonth()+1);render()});
render();

/* Time slots */
document.querySelectorAll('.time-slot').forEach(s=>{
s.addEventListener('click',function(){
document.querySelectorAll('.time-slot').forEach(t=>t.classList.remove('selected'));
this.classList.add('selected');
});
});
})();

/* ── FOOTER PARTICLES ── */
(function(){
const fc=document.getElementById('footer-particles');
if(!fc)return;
const fctx=fc.getContext('2d');
let fw,fh,fp=[];
function fResize(){
fw=fc.width=fc.parentElement.offsetWidth;
fh=fc.height=fc.parentElement.offsetHeight;
}
function fInit(){
fResize();fp=[];
const count=Math.floor((fw*fh)/12000);
for(let i=0;i<count;i++){
fp.push({
x:Math.random()*fw,y:Math.random()*fh,
r:Math.random()*1.5+0.3,
vx:(Math.random()-0.5)*0.15,
vy:-Math.random()*0.2-0.05,
a:Math.random()*0.4+0.1,
flicker:Math.random()*Math.PI*2
});
}
}
function fDraw(){
fctx.clearRect(0,0,fw,fh);
fp.forEach(p=>{
p.x+=p.vx;p.y+=p.vy;
p.flicker+=0.015;
if(p.x<0)p.x=fw;if(p.x>fw)p.x=0;
if(p.y<0)p.y=fh;
const alpha=p.a*(0.6+0.4*Math.sin(p.flicker));
fctx.beginPath();
fctx.arc(p.x,p.y,p.r,0,Math.PI*2);
fctx.fillStyle='rgba(201,169,110,'+alpha+')';
fctx.fill();
});
requestAnimationFrame(fDraw);
}
fInit();fDraw();
window.addEventListener('resize',fResize);
})();
