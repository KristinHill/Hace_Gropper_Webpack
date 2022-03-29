import Phaser from "phaser";
import Player from "../entities/Player";
import Lobby from "./Lobby";

let eItem;
let eText;
let eObject;
let EngineeringClues;
let Door;
let backToLobbyDoor;
let clueCount = 0;

export default class Engineering extends Phaser.Scene {
  constructor() {
    super("Engineering");
  }
  preload() {
    this.load.tilemapTiledJSON(
      "enginMap",
      "../public/assets/tilemaps/engineeringnew4.json"
    );
    this.load.image(
      "engineeringFloor",
      "../public/assets/tilesets/LobbyTiles.png"
    );
    this.load.image(
      "spaceStationpng",
      "../public/assets/tilesets/neotiles.png"
    );
    this.load.image(
      "furniturepng",
      "../public/assets/tilesets/shop-and-hospital.png"
    );
    this.load.image(
      "chalkboardpng",
      "../public/assets/tilesets/chalkboards.png"
    );
    this.load.image(
      "plantsAndDecorPng",
      "../public/assets/tilesets/studyTimeTiles.png"
    );
    this.load.image("planet", "../public/assets/images/purplePlanet.png");
    this.load.image("coin", "../public/assets/images/coin.png");
    this.load.image("skunk", "../public/assets/images/skunk.png");
    this.load.image("flag", "../public/assets/images/cherokeeFlag.png");
    this.load.image("lock", "../public/assets/images/lock.png");
    this.load.image("door", "../public/assets/images/Door.png");
    this.load.spritesheet("mary", "../public/assets/sprites/marySprite.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.add.image(0, 0, "engineeringFloor");
    
    let engineeringClues = document.getElementById("engineering-clues");    
    engineeringClues.classList.remove("hidden")

    const map = this.make.tilemap({
      key: "enginMap",
      tileWidth: 32,
      tileHeight: 32,
    });

    // add tileset image to tilemap p1= name of tileset in Tiled, p2= is key in png in preload
    const engineeringTiles = map.addTilesetImage(
      "LobbyTiles",
      "engineeringFloor"
    );
    const spaceStationTiles = map.addTilesetImage(
      "spacestation",
      "spaceStationpng"
    );
    const furnitureTiles = map.addTilesetImage(
      "shop-and-hospital",
      "furniturepng"
    );
    const chalkboardTiles = map.addTilesetImage(
      "building_inner-tileg",
      "chalkboardpng",
      32,
      32
    );
    const plantsAndDecorTiles = map.addTilesetImage(
      "furniture",
      "plantsAndDecorPng"
    );

    // create layer in order, p1=name of layer in Tiled, p2= tileset image constant it's referring to
    let floorLayer = map.createLayer("Floor", engineeringTiles);
    let wallLayer = map.createLayer("Wall", engineeringTiles);
    let spaceStation = map.createLayer("spaceStation", spaceStationTiles);
    let furnitureLayer = map.createLayer("Furniture", furnitureTiles);
    let chalkboardLayer = map.createLayer("ChalkBoards", chalkboardTiles);
    let plantsAndDecorLayer = map.createLayer("Objects", plantsAndDecorTiles);

    this.player = new Player(this, 470, 610, "mary").setScale(1.5);
    this.createAnimations();
    this.cursors = this.input.keyboard.createCursorKeys();

    EngineeringClues = map.getObjectLayer("Clues")["objects"];
    eItem = this.physics.add.staticGroup();

    EngineeringClues.forEach((object) => {
      let obj = eItem.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    // Door layers
    Door = map.getObjectLayer("Door")["objects"];
    backToLobbyDoor = this.physics.add.staticGroup();
    Door.forEach((object) => {
      let obj = backToLobbyDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
      console.log(object);
      console.log(eItem);
    });

    this.physics.add.overlap(this.player, eItem, this.eCollect, null, this);
    this.physics.add.overlap(
      this.player,
      backToLobbyDoor,
      this.exitRoom,
      null,
      this
    );

    wallLayer.setCollisionByExclusion([-1]);
    spaceStation.setCollisionByExclusion([-1]);
    furnitureLayer.setCollisionByExclusion([-1]);
    chalkboardLayer.setCollisionByExclusion([-1]);
    plantsAndDecorLayer.setCollisionByExclusion([-1]);
    // this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, spaceStation);
    this.physics.add.collider(this.player, furnitureLayer);
    this.physics.add.collider(this.player, chalkboardLayer);
    this.physics.add.collider(this.player, plantsAndDecorLayer);

    eText = this.add.text(570, 70, `Clues: x`, {
      fontSize: "20px",
      fill: "#ffffff",
    });
    eText.setScrollFactor(0);
  }

  update() {
    this.player.update(this.cursors);
  }

  exitRoom() {
    this.scene.stop("Engineering");
    this.scene.start("Scrammble");
    // this.scene.start("Lobby", Lobby);
  }

  eCollect(player, object) {
    clueCount += 1;
    object.destroy(object.x, object.y);
    let clue7 = document.getElementById("7");
    let clue8 = document.getElementById("8");
    let clue9 = document.getElementById("9");
    let clue10 = document.getElementById("10");
    let clue11 = document.getElementById("11");

    let count = document.getElementById("clueCount");
    count.innerText = clueCount;
    
    if (object.texture.key === "planet") {
      clue11.classList.remove("hidden");
    } else if (object.texture.key === "coin") {
      clue8.classList.remove("hidden");
    } else if (object.texture.key === "skunk") {
      clue9.classList.remove("hidden");
    } else if (object.texture.key === "flag") {
      clue7.classList.remove("hidden");
    } else if (object.texture.key === "lock") {
      clue10.classList.remove("hidden");
    }

    if (clueCount === 5){
      let dialogue = document.getElementById("dialogue");
      dialogue.innerText = "You did it!"
    }

    return false;
  }
  createAnimations() {
    this.player.anims.create({
      key: "walk right",
      frames: this.anims.generateFrameNumbers("mary", { start: 6, end: 8 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "walk left",
      frames: this.anims.generateFrameNumbers("mary", { start: 2, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "walk up",
      frames: this.anims.generateFrameNumbers("mary", { start: 9, end: 11 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "walk down",
      frames: this.anims.generateFrameNumbers("mary", { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("mary", { start: 0, end: 0 }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
