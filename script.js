//Утилиты:
const $ = id => document.getElementById(id);
const m = Math;
const random = x => m.random()*x;
const distance = (x0, x1, y0, y1) => m.sqrt(
  m.min(m.abs(x1-x0), m.abs(size-x1+x0), m.abs(size-x0+x1))**2 + 
  m.min(m.abs(y1-y0), m.abs(size-y1+y0), m.abs(size-y0+y1))**2
);
const PI = m.PI;

//Константы:
const czone = 50;
const size = 300;
const scale = 4;
const fps = 60;
const S = x => x*scale;

var speed, wiggle, zone, error, count, canvas, ctx, table, tbl;

//Переменные:
var pause = true;
var lrframe = 0;
var rframe = 0;
var frame;
var lrule;
var rule;
var arr;

class Fly { //Муха
  constructor() {
    this.speed();
    
    this.id = arr.length;
    this.state = m.floor(random(states.length));
    
    //Позиция:
    this.x = random(size);
    this.y = random(size);
  }
  handler() { //Обработка
    //Дёрганье:
    const w = wiggle.value;
    if (w) if (frame%m.ceil(300/w) == 0) this.speed();
    
    //Объединение:
    let d = 0, c = 0;
    const z = zone.value/2.5;
    for (let i = 0; i < arr.length; i++) {
      if (i == this.id) continue;
      
      const p = arr[i];
      const r = [0, 1, -1][rule[p.state][this.state]];
      if (r && distance(this.x, p.x, this.y, p.y) < z) {
        d += deg(r*p.dir);
        c++;
      }
    }
    if (c) {
      const e = error.value/100;
      this.dir = d/c+random(e)-e/2;
    }

    //Движение:
    const s = speed.value/20;
    this.x = cord(this.x+m.cos(this.dir)*s);
    this.y = cord(this.y+m.sin(this.dir)*s);
  }
  render() { //Отрисовка
    if (states.length > 1) {
      ctx.fillStyle = states[this.state];
    } else {
      const d = this.dir/2/PI*360;
      const r = d < 90 ? 0.5-d/180:(d > 270 ? 1-(d-270)/180:(d-90)/180);
      const c = r*225;
      
      ctx.fillStyle = "#"+hex(255-c)+"00"+hex(c);
    }
    
    ctx.beginPath();
    ctx.arc(S(this.x), S(this.y), S(2), 0, PI*2);
    ctx.fill();
  }
  speed() { //Случайное направление
    this.dir = random(PI*2)-PI;
  }
}

function cord(x) { //Координаты
  while (x < 0) x += size;
  while (x > size) x -= size;
  return x;
}
function deg(x) { //Поворот
  while (x < -180) x += 360;
  while (x > 180) x -= 360;
  return x;
}


function hex(x) { //HEX
  x = m.min(m.max(m.floor(x), 0), 255);
  const h = x.toString(16);
  return x < 16 ? "0"+h:h;
}

function reset() { //Сброс
  arr = [];
  frame = 0;
  
  if (count.value > 2500) count.value = 2500;
  if (count.value < 25) count.value = 25;
  
  for (let i = 0; i < count.value; i++) arr.push(new Fly());
}

function frame_() { //Кадр
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!pause) for (let i = 0; i < arr.length; i++) arr[i].handler();
  for (let i = 0; i < arr.length; i++) arr[i].render();
  
  if (!pause) frame++;
  
  tbl.clearRect(0, 0, table.width, table.height);
  
  const l = states.length;
  const s = 450/l;
  
  const a = ["#ffffff", "#0000a0", "#a00000"];
  for (let x = 0; x < l; x++) for (let y = 0; y < l; y++) {
    tbl.fillStyle = a[lrule[x][y]];
    tbl.fillRect(x*s+50, y*s+50, s, s);
    tbl.fillStyle = a[rule[x][y]]+hex((rframe-lrframe)/8*255);
    tbl.fillRect(x*s+50, y*s+50, s, s);
  }
  
  for (let i = 0; i < l; i++) {
    tbl.fillStyle = states[i];
    tbl.fillRect(i*s+50, 0, s, 10);
    tbl.fillRect(0, i*s+50, 10, s);
  }
  
  tbl.lineWidth = 3;
  tbl.strokeStyle = "#a0a0a0";
  
  tbl.beginPath();
  for (let i = 0; i < l; i++) {
    tbl.moveTo(i*s+50, 0);
    tbl.lineTo(i*s+50, 500);
    tbl.moveTo(0, i*s+50);
    tbl.lineTo(500, i*s+50);
  }
  tbl.stroke();
  
  rframe++;
}

function play() { //Запуск
  pause = false;
  $('play').style.display = "none";
  $('stop').style.display = "block";
}
function stop() { //Остановка
  pause = true;
  $('stop').style.display = "none";
  $('play').style.display = "block";
}


function tablec(e) { //Клик таблицы
  const r = table.getBoundingClientRect();
  const x = (e.clientX-r.left)/100*500;
  const y = (e.clientY-r.top)/100*500;
  
  if (x > 50 && x > 50) {
    const s = 450/states.length;
    const xa = m.floor((x-50)/s);
    const ya = m.floor((y-50)/s);
    
    lrule = JSON.parse(JSON.stringify(rule));
    rule[xa][ya] = (rule[xa][ya]+1)%3;
    lrframe = rframe;
  }
}

function click(e) { //Клик
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX-r.left)/300*size;
  const y = (e.clientY-r.top)/300*size;
  
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i];
    if (distance(p.x, x, p.y, y) < czone) p.dir = m.atan2(x-p.x, y-p.y);
  }
}

window.onload = function() {
  const style = document.createElement('style');
  style.innerHTML = `
  h3, label, p, input, a {
    font-family: Monospace, Sans-Serif;
  }
  h3 {
    margin-bottom: 10px;
  }
  #canvas {
    border-radius: 5px;
    border: 2px solid #808080;
    width: 300px;
    height: 300px;
  }
  #table {
    width: 100px;
    height: 100px;
    border-radius: 3px;
    border: 1px solid #a0a0a0;
  }
  #main {
    width: 320px;
    text-align: center;
  }
  #stop {
    display: none;
  }
  #count {
    width: 60px;
  }
  #back {
    margin-bottom: 10px;
  }
  .prop {
    margin-top: 20px;
    margin-bottom: 20px;
  }`;
  document.head.appendChild(style);
  
  const main = document.createElement('div');
  main.innerHTML = `
  <div id="back"><a href="index.html"><b>назад</b></a></div>
  <div><canvas id="canvas" width="1200" height="1200"></canvas></div>
  <div class="prop">
    <label for="speed">Скорость: </label>
    <input id="speed" type="range" min="0" max="100" value="20">
  </div>
  <div class="prop">
    <label for="wiggle">Колебание: </label>
    <input id="wiggle" type="range" min="0" max="100" value="0">
  </div>
  <div class="prop">
    <label for="zone">Зона: </label>
    <input id="zone" type="range" min="0" max="100" value="20">
    </div>
  <div class="prop">
    <label for="error">Погрешность: </label>
    <input id="error" type="range" min="0" max="100" value="20">
  </div>
  <div class="prop">
    <label for="count">Количество: </label>
    <input id="count" type="number" onchange="reset()" value="300" valueAsNumber>
  </div>
  <div class="prop">
    <canvas id="table" width="500" height="500">
  </div>
  <p id="play" onclick="play()">Запуск</p>
  <p id="stop" onclick="stop()">Пауза</p>
  <p onclick="reset()">Перемешать</p>`;
  $('main').appendChild(main);
  
  const viewport = document.createElement('meta');
  viewport.name = "viewport";
  viewport.content = "width=800px";
  document.head.appendChild(viewport);
  
  //Элементы:
  speed = $('speed');
  wiggle = $('wiggle');
  zone = $('zone');
  error = $('error');
  count = $('count');
  canvas = $('canvas');
  table = $('table');
  
  ctx = canvas.getContext('2d');
  tbl = table.getContext('2d');
  
  rule = [];
  lrule = [];
  for (let x = 0; x < states.length; x++) {
    rule[x] = [];
    lrule[x] = [];
    for (let y = 0; y < states.length; y++) {
      rule[x][y] = x == y ? 1:0;
      lrule[x][y] = 0;
    }
  }
  
  table.addEventListener('click', tablec);
  canvas.addEventListener('click', click);
  
  reset();
  setInterval(frame_, 1000/fps);
};