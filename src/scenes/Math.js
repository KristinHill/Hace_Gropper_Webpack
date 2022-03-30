import Phaser from "phaser";
import Player from "../entities/Player";
import Lobby from "./Lobby";
import SpaceInvaders from "./SpaceInvaders";

let item;
let door;
let rocket;
let mathClueCount = 0;

export default class Math extends Phaser.Scene {
  constructor() {
    super("Math");
  }

  preload() {
    this.load.tilemapTiledJSON(
      "mathMap",
      "../public/assets/tilemaps/MathRoom.json"
    );
    // tilesets
    this.load.image("lobbyTiles", "../public/assets/tilesets/LobbyTiles.png");
    this.load.image(
      "furniture",
      "../public/assets/tilesets/studyTimeTiles.png"
    );
    this.load.image("school", "../public/assets/tilesets/schoolmap.png");
    // objects
    this.load.image("Pennant", "../public/assets/images/WVSUPennant.png");
    this.load.image("Medal", "../public/assets/images/PMoF.png");
    this.load.image("Calculator", "../public/assets/images/Calculator.png");
    this.load.image("Moon", "../public/assets/images/FullMoon.png");
    this.load.image("Rocket", "../public/assets/images/RocketWhite.png");
    this.load.image("ExitDoor", "../public/assets/images/exitDoor.png");

    this.load.spritesheet(
      "katherine",
      "../public/assets/sprites/katherine.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  create() {
    console.log(this.cache.tilemap.get("mathMap").data);

    let mathCluesText = document.getElementById('math-clues');
    mathCluesText.classList.remove('hidden');

    const map = this.make.tilemap({
      key: "mathMap",
      tileWidth: 32,
      tileHeight: 32,
    });

    const lobbyTiles = map.addTilesetImage("LobbyTiles", "lobbyTiles");
    const furnitureTiles = map.addTilesetImage("studyTimeTiles", "furniture");
    const schoolTiles = map.addTilesetImage("SchoolTiles", "school");

    let floorLayer = map.createLayer("Floor", [lobbyTiles, schoolTiles]);
    let windowLayer = map.createLayer("Windows", [
      schoolTiles,
      furnitureTiles,
      lobbyTiles,
    ]);
    let furnitureLayer = map.createLayer("Furniture", furnitureTiles);
    let stuffLayer = map.createLayer("Stuff", [furnitureTiles, schoolTiles]);
    let topFurnitureLayer = map.createLayer("Top Furniture", [
      furnitureTiles,
      schoolTiles,
    ]);

    this.player = new Player(this, 470, 590, "katherine").setScale(1.1);

    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    let mathClues = map.getObjectLayer("MathClues")["objects"];
    item = this.physics.add.staticGroup();

    mathClues.forEach((object) => {
      let obj = item.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });
    this.physics.add.overlap(this.player, item, this.mCollect, null, this);

    let exitDoor = map.getObjectLayer("Door")["objects"];
    door = this.physics.add.staticGroup();

    exitDoor.forEach((object) => {
      let obj = door.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });
    this.physics.add.overlap(this.player, door, this.exit, null, this);

    let rocketLayer = map.getObjectLayer('Rocket')['objects'];
    rocket = this.physics.add.staticGroup();

    rocketLayer.forEach((object) => {
      let obj = rocket.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });
    this.physics.add.overlap(this.player, rocket, this.startGame, null, this);

    furnitureLayer.setCollisionByExclusion([-1]);
    windowLayer.setCollisionByExclusion([-1]);
    stuffLayer.setCollisionByExclusion([-1]);
    topFurnitureLayer.setCollisionByExclusion([-1]);

    this.physics.add.collider(this.player, furnitureLayer);
    this.physics.add.collider(this.player, windowLayer);
    this.physics.add.collider(this.player, stuffLayer);
    this.physics.add.collider(this.player, topFurnitureLayer);
  }

  update() {
    this.player.update(this.cursors);
  }

  mCollect(player, object) {
      mathClueCount += 1;
      object.destroy(object.x, object.y);
      // text.setText(`Clues: y`); // set the text to show the current score
      let clue30 = document.getElementById('30');
      let clue31 = document.getElementById('31');
      let clue32 = document.getElementById('32');
      let clue33 = document.getElementById('33');
      let clue103 = document.getElementById('103');

      let count = document.getElementById('mathClueCount');
      count.innerText = mathClueCount;

      if (object.texture.key === 'Pennant') {
        clue30.classList.remove('hidden');
      } else if (object.texture.key === 'Medal') {
        clue31.classList.remove('hidden');
      } else if (object.texture.key === 'Calculator') {
        clue32.classList.remove('hidden');
      } else if (object.texture.key === 'Moon') {
        clue33.classList.remove('hidden');
      }

      if (mathClueCount === 4) {
        let dialogue = document.getElementById('dialogue');
        dialogue.innerText = "Great job! Why don't we head back to the main lobby?";
        setTimeout(() => {
          clue30.classList.toggle("hidden")
          clue31.classList.toggle("hidden")
          clue32.classList.toggle("hidden")
          clue33.classList.toggle("hidden")
          clue103.classList.remove("hidden")
        }, 3000);
      }
      return false;
    }
  

  startGame() {
    this.scene.stop("Math");
    this.scene.start("SpaceInvaders", SpaceInvaders);
  }

  exit() {
    this.scene.stop("Math");
    this.scene.start("Lobby", Lobby);
  }

  createAnimations() {
    this.player.anims.create({
      key: "walk right",
      frames: this.anims.generateFrameNumbers("katherine", {
        start: 6,
        end: 8,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "walk left",
      frames: this.anims.generateFrameNumbers("katherine", {
        start: 3,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "walk up",
      frames: this.anims.generateFrameNumbers("katherine", {
        start: 9,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "walk down",
      frames: this.anims.generateFrameNumbers("katherine", {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("katherine", {
        start: 1,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
