const canvas =
  document.getElementById("stars");

const ctx =
  canvas.getContext("2d");

function resize(){

  canvas.width =
    innerWidth;

  canvas.height =
    innerHeight;

}

resize();

window.addEventListener(
  "resize",
  resize
);

const stars = [];

for(let i=0;i<90;i++){

  stars.push({

    x:Math.random()*canvas.width,

    y:Math.random()*canvas.height,

    vx:(Math.random()-0.5)*0.3,

    vy:(Math.random()-0.5)*0.3,

    size:Math.random()*2

  });

}

let target = null;

window.addEventListener(
  "click",
  e=>{

    target = {

      x:e.clientX,
      y:e.clientY,

      time:Date.now()

    };

  }
);

function draw(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for(let s of stars){

    if(target){

      s.x +=
        (target.x - s.x)
        *0.015;

      s.y +=
        (target.y - s.y)
        *0.015;

    }else{

      s.x += s.vx;
      s.y += s.vy;

    }

    if(s.x<0)
      s.x=canvas.width;

    if(s.x>canvas.width)
      s.x=0;

    if(s.y<0)
      s.y=canvas.height;

    if(s.y>canvas.height)
      s.y=0;

    ctx.beginPath();

    ctx.arc(
      s.x,
      s.y,
      s.size,
      0,
      Math.PI*2
    );

    ctx.fillStyle =
      "rgba(255,255,255,0.9)";

    ctx.fill();

  }

  for(let i=0;i<stars.length;i++){

    for(let j=i+1;j<stars.length;j++){

      let a=stars[i];
      let b=stars[j];

      let dx=a.x-b.x;
      let dy=a.y-b.y;

      let dist =
        Math.sqrt(dx*dx+dy*dy);

      if(dist<110){

        ctx.beginPath();

        ctx.moveTo(a.x,a.y);

        ctx.lineTo(b.x,b.y);

        ctx.strokeStyle =
          "rgba(255,255,255,"
          +(1-dist/110)*0.15
          +")";

        ctx.stroke();

      }

    }

  }

  if(target){

    if(
      Date.now()-target.time
      >2200
    ){

      target = null;

    }

  }

  requestAnimationFrame(draw);

}

draw();
