import { Application, AnimatedSprite, Assets } from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';

const app : any = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
window.onload = () => {
  document.body.appendChild(app.view);
}


const texture = await Assets.load('./images/singleRed.json');


class Enemy extends AnimatedSprite{
  model: string;
  id: string;
  constructor(model : string) {
    super(texture.animations[`${model}`]);
    this.id = uuidv4();
  }
}
const fetcher = async () => {
  const a = await fetch('../src/api.json');

  return a.json();
}

async function promiseSet() {
  const b = await fetcher();

  return b
} 

const spriter = async () => {
  const a = await promiseSet();

  a.enemies.forEach((element : any)=> {
    const sprite = new Enemy(element.name) as any;
    sprite.position.x = element.x;
    sprite.position.y = element.y;
    sprite.animationSpeed = 0.09;
    sprite.play();
    sprite.interactive = true;
    sprite.cursor = 'pointer';
    sprite.on('click', killEnemy)
    app.stage.addChild(sprite);
  });
}

function killEnemy ()  {
  this.destroy();
  console.log(app.stage.children.filter((el : any)=> {
    el.id !== undefined
  }))
};

spriter();




