import { Application, AnimatedSprite, Assets, Sprite, Texture, Container, TilingSprite } from 'pixi.js';
import { Enemy } from './components/classes';
import {Howl, Howler} from 'howler';
import { getRandomInt } from './components/randomInt';

const app : any = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  background: 0x00BFFF,
});

const backgroundSong = new Howl({
  src: ['./sounds/Thunderdome.mp3'],
  autoplay: true,
  loop: true,
  volume: 0.3,
})


document.body.appendChild(app.view);

const texturesArray = {
  'flying_dragon-red': await Assets.load('./images/singleRed.json'),
  'flying_twin_headed_dragon-red': await Assets.load('./images/RedTwoHeaded.json'),
  'flying_twin_headed_dragon-blue': await Assets.load('./images/BlueTwoHeaded.json'), 
} as any;

const epxlosionTexture = await Assets.load('./images/explosion.json');

const numbers = await Assets.load('./images/numbers.json');
const clouds = Texture.from('./images/cloud.png');
const cloudsSprite = new TilingSprite(clouds, window.innerWidth, window.innerHeight);
  cloudsSprite.tileScale.set(0.1, 0.1);
app.ticker.add(function() {
  cloudsSprite.tilePosition.y -= 1;
})
app.stage.addChild(cloudsSprite);
const counterContainer = new Container();
app.stage.addChild(counterContainer);


const fetcher = async () => {
  const result = await fetch('../src/api.json');

  return result.json();
}

let enemiesCount = 0;

const spriter = async () => {
  const info = await fetcher();

  info.enemies.forEach((enemy : any)=> {
    const sprite = new Enemy(enemy.name, texturesArray) as any;
    sprite.position.x = enemy.x;
    sprite.position.y = enemy.y;
    sprite.animationSpeed = 0.1;
    sprite.gotoAndPlay(getRandomInt(0, 2));
    sprite.interactive = true;
    sprite.cursor = 'pointer';
    sprite.on('click', killEnemy);
    enemiesCount++;
    app.stage.addChild(sprite);
  });
}

function killEnemy ()  {
  const x = this.x;
  const y = this.y;

  this.destroy();

  const deathAnimation =  new AnimatedSprite(epxlosionTexture.animations['exp']);
  const explosionSound = new Howl ({
    src: ['./sounds/explosion.wav'],
  });

  deathAnimation.width = 144;
  deathAnimation.height = 128;
  deathAnimation.x = x;
  deathAnimation.y = y;
  deathAnimation.play();
  deathAnimation.loop = false;
  deathAnimation.onComplete = () => {
    explosionSound.play();
    deathAnimation.destroy();
  };
  app.stage.addChild(deathAnimation);
  enemiesCount--;
  counter();
};

const counter = () => {
  counterContainer.removeChildren();
  const countLength = enemiesCount + '';
  for (let i = 0; i <= countLength.length; i++) {
    const numSprite = new Sprite(numbers.textures[`Number${countLength[i]} 7x10.png`]);
    numSprite.width = 10;
    numSprite.height = 13;
    if ( i !== 0) {
      numSprite.x += 13
    }
    
   counterContainer.addChild(numSprite);
  }
}

await spriter();
counter();





