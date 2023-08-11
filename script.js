//Утилиты:
const $ = id => document.getElementById(id);
const random = x => Math.random()*x;
const distance = (x0, x1, y0, y1) => Math.sqrt((x1-x0)**2+(y1-y0)**2);
const PI = Math.PI;

//Константы:
const size = 300;
const scale = 4;
const fps = 60;
const S = x => x*scale;

//Элементы:
const speed = $('speed');
const wiggle = $('wiggle');
const zone = $('zone');
const error = $('error');
const count = $('count');
const canvas = $('canvas');

const ctx = canvas.getContext('2d');

//Переменные:
var pause = true;
var frame;
var arr;

class Fly { //Муха
  constructor() {
    this.speed();
    
    this.id = arr.length;
    
    //Позиция:
    this.x = random(size);
    this.y = random(size);
  }
  handler() { //Обработка
    //Дёрганье:
    const w = wiggle.value;
    if (w) if (frame%Math.ceil(300/w) == 0) this.speed();
    
    //Объединение:
    let d = 0, c = 0;
    const z = zone.value/2.5;
    for (let i = 0; i < arr.length; i++) {
      if (i == this.id) continue;
      
      const p = arr[i];
      if (distance(this.x, p.x, this.y, p.y) < z) {
        d += p.dir;
        c++;
      }
    }
    if (c) {
      const e = error.value/100;
      this.dir = d/c+random(e)-e/2;
    }

    //Движение:
    const s = speed.value/20;
    this.x = cord(this.x+Math.cos(this.dir)*s);
    this.y = cord(this.y+Math.sin(this.dir)*s);
  }
  render() { //Отрисовка
    const d = this.dir/2/PI*360;
    const r = d < 90 ? 0.5-d/180:(d > 270 ? 1-(d-270)/180:(d-90)/180);
    const c = r*225;
    
    ctx.fillStyle = "#"+hex(255-c)+"00"+hex(c);
    ctx.beginPath();
    ctx.arc(S(this.x), S(this.y), S(2), 0, PI*2);
    ctx.fill();
  }
  speed() { //Случайное направление
    this.dir = random(PI*2);
  }
}

function cord(x) { //Координаты
  while (x < 0) x += size;
  while (x > size) x -= size;
  return x;
}

function hex(x) { //HEX
  x = Math.min(Math.max(Math.floor(x), 0), 255);
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


window.onload = function() {
  reset();
  setInterval(frame_, 1000/fps);
};