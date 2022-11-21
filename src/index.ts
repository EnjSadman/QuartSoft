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

document.body.appendChild(app.view); //creating app

const texturesArray = {
  'flying_dragon-red': await Assets.load('./images/singleRed.json'),
  'flying_twin_headed_dragon-red': await Assets.load('./images/RedTwoHeaded.json'),
  'flying_twin_headed_dragon-blue': await Assets.load('./images/BlueTwoHeaded.json'), 
} as any;

const epxlosionTexture = await Assets.load('./images/explosion.json');
const numbers = await Assets.load('./images/numbers.json');
const clouds = Texture.from('./images/cloud.png');
// loading assets

const cloudsSprite = new TilingSprite(clouds, window.innerWidth, window.innerHeight);
  cloudsSprite.tileScale.set(0.1, 0.1);
app.ticker.add(function() {
  cloudsSprite.tilePosition.y -= 1;
})
app.stage.addChild(cloudsSprite);  // background clouds added on page


const counterContainer = new Container(); 
app.stage.addChild(counterContainer); // container for enemy counter added on page


const fetcher = async () => {
  const result = await fetch('./api.json');

  return result.json();
} // async function to get data from json

let enemiesCount = 0;

const spriter = async () => { //function for creating enemies
  const info = await fetcher();

  info.enemies.forEach((enemy : any)=> {
    const sprite = new Enemy(enemy.name, texturesArray) as any; // create an single enemy. Enemy extends AnimatedSprite
    sprite.position.x = enemy.x;
    sprite.position.y = enemy.y;
    sprite.animationSpeed = 0.1;
    sprite.gotoAndPlay(getRandomInt(0, 2)); // Get random frame from 3 to make different dragons to move wings asyncronnically
    sprite.interactive = true;
    sprite.cursor = 'pointer';
    sprite.on('click', killEnemy);
    enemiesCount++; // upon creating single enemy increment enemies count
    app.stage.addChild(sprite); // add to app enemy
  });
}

function killEnemy ()  {
  const x = this.x;
  const y = this.y;
// save x and y to play new animation on the same place

  this.destroy(); // remove dragon sprite

  const deathAnimation =  new AnimatedSprite(epxlosionTexture.animations['exp']); //set explosion animation
  const explosionSound = new Howl ({
    src: ['./sounds/explosion.wav'],
  }); // set explosion sound

  deathAnimation.width = 144;
  deathAnimation.height = 128;
  deathAnimation.x = x;
  deathAnimation.y = y;
  deathAnimation.play();
  deathAnimation.loop = false;
  deathAnimation.onComplete = () => {
    explosionSound.play(); // play explosion sound
    deathAnimation.destroy(); // remove fireball
  };
  app.stage.addChild(deathAnimation);
  enemiesCount--; // decrement enemies count 
  counter(); // update counter info
};

const counter = () => {
  counterContainer.removeChildren(); // removes old number

  const countLength = enemiesCount + ''; // stringify  enemies count for check if it multi-digit number or not

  for (let i = 0; i <= countLength.length; i++) {
    const numSprite = new Sprite(numbers.textures[`Number${countLength[i]} 7x10.png`]); // create sprite for each symbol in count length
    numSprite.width = 10;
    numSprite.height = 13;
    if ( i !== 0) {
      numSprite.x += 13
    }
    
   counterContainer.addChild(numSprite);
  }
}

await spriter(); // make spriter end to do everything work fine
counter();

// I assume that propably all textures can be packed in single file to speed up file download. But Im not sure





