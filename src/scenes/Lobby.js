import Phaser from "phaser";
import Player from "../entities/Player";
import Technology from "./Technology";
import Engineering from "./Engineering";
import Math from "./Math";
import config from "../config/config";

let Clues;
let item;
let text;
let object;
let SDoor;
let TDoor;
let EDoor;
let MDoor;
let engDoor;
let mathDoor;
let sciDoor;
let clueCount = 0;
let techDoor;

export default class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
  }

  preload() {
    this.load.tilemapTiledJSON("map", "../public/assets/tilemaps/GHLobby.json");
    this.load.image("lobby", "../public/assets/tilesets/LobbyTiles.png");
    this.load.image("text", "../public/assets/tilesets/Text.png");
    this.load.image("Ship", "../public/assets/images/navyShip.png");
    this.load.image("Moth", "../public/assets/images/CompPic.png");
    this.load.image("Engineering", "../public/assets/images/Door.png");
    this.load.image("Math", "../public/assets/images/Door.png");
    this.load.image("Science", "../public/assets/images/Door.png");
    this.load.spritesheet(
      "grace",
      "../public/assets/sprites/gh-spritesheet.png",
      {
        frameWidth: 17,
        frameHeight: 34,
      }
    );
  }

  create() {

    const rules = document.getElementById("rules")
    const playGameBtn = document.getElementById("play-maingame-btn")
    rules.classList.remove("hidden")

    playGameBtn.addEventListener("click", function (e) {
      rules.classList.toggle("hidden")
    });

    // console.log(this.cache.tilemap.get("map").data);
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 32,
      tileHeight: 32,
    });

    const lobbyTiles = map.addTilesetImage("Walls and Floor", "lobby");
    const textTiles = map.addTilesetImage("Text", "text");

    let floorLayer = map.createLayer("Floor and Wall", lobbyTiles);
    let furnitureLayer = map.createLayer("Furniture", lobbyTiles);
    let objectLayer = map.createLayer("Objects", lobbyTiles);
    let letterLayer = map.createLayer("Letters", textTiles);

    this.player = new Player(this, 470, 610, "grace").setScale(1.75); //Joe is pleased

    // this.item = new InteractableObj(this, 'ship')

    //Player class might have five different modes - grace, mary, etc...

    this.createAnimations(); //maybe also move this to player class?

    this.cursors = this.input.keyboard.createCursorKeys(); // move this to PLayer class

    // this.createCollisions();

    Clues = map.getObjectLayer("Clues")["objects"];

    // Doors layers

    SDoor = map.getObjectLayer("SDoor")["objects"];
    TDoor = map.getObjectLayer("TDoor")["objects"];
    EDoor = map.getObjectLayer("EDoor")["objects"];
    MDoor = map.getObjectLayer("MDoor")["objects"];

    item = this.physics.add.staticGroup();
    engDoor = this.physics.add.staticGroup();
    techDoor = this.physics.add.staticGroup();
    mathDoor = this.physics.add.staticGroup();
    sciDoor = this.physics.add.staticGroup();
    techDoor = this.physics.add.staticGroup();

    Clues.forEach((object) => {
      let obj = item.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
      console.log(item);
    });
    TDoor.forEach((object) => {
      let obj = techDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });
    EDoor.forEach((object) => {
      let obj = engDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    MDoor.forEach((object) => {
      let obj = mathDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });
    TDoor.forEach((object) => {
      let obj = techDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    SDoor.forEach((object) => {
      let obj = sciDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    this.physics.add.overlap(this.player, item, this.collect, null, this);
    this.physics.add.overlap(this.player, engDoor, this.enterERoom, null, this);
    this.physics.add.overlap(
      this.player,
      mathDoor,
      this.enterMRoom,
      null,
      this
    );
    this.physics.add.overlap(this.player, sciDoor, this.enterSRoom, null, this);
    this.physics.add.overlap(
      this.player,
      techDoor,
      this.enterTRoom,
      null,
      this
    );

    text = this.add.text(570, 70, `Clues: x`, {
      fontSize: "20px",
      fill: "#ffffff",
    });
    text.setScrollFactor(0);

    furnitureLayer.setCollisionByExclusion([-1]);
    objectLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, furnitureLayer);
    this.physics.add.collider(this.player, objectLayer);
    let curtainsLayer = map.createLayer("Curtains", lobbyTiles);
  }

  update() {
    this.player.update(this.cursors);
  }
  enterTRoom() {
    this.scene.stop("Lobby");
    this.scene.start("Technology", Technology);
  }
  enterERoom() {
    this.scene.stop("Lobby");
    this.scene.start("Engineering", Engineering);
  }

  enterMRoom() {
    this.scene.stop("Lobby");
    this.scene.start("Math", Math);
  }

  enterSRoom() {
    this.scene.stop("Lobby");
    this.scene.start("Science");
  }

  collect(player, object) {
    // this is what happens when we overlap with the object
    clueCount += 1;
    object.destroy(object.x, object.y);
    // text.setText(`Clues: y`); // set the text to show the current score
    let clue1 = document.getElementById("1");
    let clue2 = document.getElementById("2");
    let count = document.getElementById("clueCount");
    count.innerText = clueCount;

    // console.log(object.texture.key); // object name

    if (object.texture.key === "Ship") {
      clue1.classList.remove("hidden");
    } else if (object.texture.key === "Moth") {
      clue2.classList.remove("hidden");
    }

    if (clueCount === 2) {
      let dialogue = document.getElementById("dialogue");
      dialogue.innerText = "Hmm ... those curtains look funny";
    }
    // list = []
    // list.push(object.listClues)
    //`${list}
    return false;
  }

  createAnimations() {
    // Joe says this belongs in the player class, even if it changes by scene - it's attached to each specific sprite
    this.anims.create({
      key: "walk right",
      frames: this.anims.generateFrameNumbers("grace", { start: 11, end: 14 }),
      //something to keep in mind about line 62 - it is a decision that youre making and it can be a return from a function i.e. getWalkRight and you can pass in string, if character === grace return start (numbers) else if character === mary start(marynumbers)
      //each mechanism is like its own system

      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "walk left",
      frames: this.anims.generateFrameNumbers("grace", { start: 15, end: 18 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "walk up",
      frames: this.anims.generateFrameNumbers("grace", { start: 23, end: 30 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "walk down",
      frames: this.anims.generateFrameNumbers("grace", { start: 0, end: 6 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("grace", { start: 0, end: 0 }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
