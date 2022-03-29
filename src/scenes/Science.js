import Phaser from 'phaser';
import Player from '../entities/Player';

let item;
let sciDoor;
let sText;

export default class Science extends Phaser.Scene {
  constructor() {
    super('Science');
  }

  preload() {
    this.load.tilemapTiledJSON(
      'sciMap',
      '../public/assets/tilemaps/ScienceRoom.json'
    );
    this.load.image('lab', '../public/assets/tilesets/lab.png');
    this.load.image(
      'furniture',
      '../public/assets/tilesets/shop-and-hospital.png'
    );
    this.load.image('lobby', '../public/assets/tilesets/LobbyTiles.png')
    this.load.image('chemical', '../public/assets/images/chemical.png');
    this.load.image('coal', '../public/assets/images/coal.png');
    this.load.image('research', '../public/assets/images/research.png');
    this.load.image('dna', '../public/assets/images/dna.png');
    this.load.image('sciDoor', "../public/assets/images/sciDoor.png");

    this.load.spritesheet('rosalind', '../public/assets/sprites/rosalind.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    console.log(this.cache.tilemap.get('sciMap').data);

    const map = this.make.tilemap({
      key: 'sciMap',
      tileWidth: 32,
      tileHeight: 32,
    });

    const labTiles = map.addTilesetImage('lab', 'lab');
    const furnitureTiles = map.addTilesetImage('furniture', 'furniture');
    const lobbyTiles = map.addTilesetImage('LobbyTiles', 'lobby');

    let floorLayer = map.createLayer('Floors', [labTiles, lobbyTiles]);
    let wallLayer = map.createLayer('Walls', labTiles);
    let furnitureLayer = map.createLayer('Furniture', furnitureTiles);
    let objectLayer = map.createLayer('Objects', furnitureTiles);

    this.player = new Player(this, 470, 590, 'rosalind').setScale(1.5);

    this.createAnimations();

    this.cursors = this.input.keyboard.createCursorKeys();

    let clues = map.getObjectLayer('Clues')['objects'];
    let door = map.getObjectLayer('Door')['objects'];
    item = this.physics.add.staticGroup();
    sciDoor = this.physics.add.staticGroup();

    clues.forEach((object) => {
      let obj = item.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    door.forEach((object) => {
      let obj = sciDoor.create(object.x, object.y, object.name);
      obj.setScale(object.width / object.width, object.height / object.height);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    this.physics.add.overlap(this.player, item, this.collect, null, this);
    this.physics.add.overlap(this.player, sciDoor, this.exit, null, this);

    furnitureLayer.setCollisionByExclusion([-1]);
    objectLayer.setCollisionByExclusion([-1]);
    wallLayer.setCollisionByExclusion([-1]);

    this.physics.add.collider(this.player, furnitureLayer);
    this.physics.add.collider(this.player, wallLayer);
    this.physics.add.collider(this.player, objectLayer);

    sText = this.add.text(500, 70, `Clues List`, {
      fontSize: "20px",
      fill: "white",
    });
    sText.setScrollFactor(0);
  }

  update() {
    this.player.update(this.cursors);
  }

  collect(player, object) {
    object.destroy(object.x, object.y);
    sText.setText(`Clues: y`);
    return false;
  }

  exit() {
    this.scene.stop("Science");
    this.scene.start("Lobby");
  }

  createAnimations() {
    this.player.anims.create({
      key: 'walk right',
      frames: this.anims.generateFrameNumbers('rosalind', { start: 6, end: 8 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'walk left',
      frames: this.anims.generateFrameNumbers('rosalind', { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'walk up',
      frames: this.anims.generateFrameNumbers('rosalind', {
        start: 9,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'walk down',
      frames: this.anims.generateFrameNumbers('rosalind', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('rosalind', { start: 1, end: 1 }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
