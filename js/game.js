/* $ montage -background transparent step*.png -geometry +0+0 -tile 7x1 steps.png
// Load them google fonts before starting...!
WebFont.load({
  google: {
    families: ['Freckle+Face::latin', 'Slackey::latin']
  }
});
*/

function Game() {

  function FishNet(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.top = game.add.sprite(0,0,'net');
    this.top.anchor.setTo(0, 1);
    this.bottom = game.add.sprite(0,0,'net');
    this.bottom.anchor.setTo(0, 0);
    game.physics.arcade.enableBody(this.top);
    game.physics.arcade.enableBody(this.bottom);
    this.add(this.top);
    this.add(this.bottom);
    this.hasScored = false;
    this.setAll('body.allowGravity', false);
    this.setAll('body.immovable', true);
  }
  FishNet.prototype = Object.create(Phaser.Group.prototype);
  FishNet.prototype.constructor = FishNet;
  FishNet.prototype.update = function() { }; //this.exists = this.top.inWorl; }
  FishNet.prototype.reset = function(y) {
    this.top.reset(0,0);
    this.bottom.reset(0,285);
    this.x = game.width;
    this.y = y;
    this.setAll('body.velocity.x', -200);
    this.hasScored = false;
    this.exists = true;    
  };


  // Game states



  var Begin = function(game){};
  Begin.prototype = {
    create: function(){
      var text = game.add.text(game.world.centerX, game.world.centerY, "* Flappy Doppy *\n\nWave close to\nmic to start");
      text.anchor.setTo(0.5);

      text.font = 'Slackey';
      text.fontSize = 60;

      //  x0, y0 - x1, y1
      grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
      grd.addColorStop(0, '#8ED6FF');   
      grd.addColorStop(1, '#004CB3');
      text.fill = grd;

      text.align = 'center';
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    },
    flap: function(){
      game.state.start('swim', true);
    }
  };


  var Swim = function(game){};
  Swim.prototype = {
    create: function() {
      this.net_count = 0;
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.arcade.gravity.y = -500;

      game.add.sprite(0, 0, 'sea');
      var scroll = game.add.tileSprite(0, 300, 800, 300, 'dark-blue-bg');
      scroll.autoScroll(-50, 0);

      this.fish = game.add.sprite(300, 300, 'fish');
      game.physics.arcade.enableBody(this.fish);
      this.fish.body.collideWorldBounds = true;
      this.fish.animations.add('flap');

      this.nets = game.add.group();

      this.number = game.add.text(50,50, "0");
      this.number.anchor.setTo(0.5);
      this.number.font = 'Slackey';
      this.number.fontSize = 80;
      //  x0, y0 - x1, y1
      grd = this.number.context.createLinearGradient(0, 0, 0, this.number.canvas.height);
      grd.addColorStop(0, '#eeeeee');   
      grd.addColorStop(1, '#ffffff');
      this.number.fill = grd;

      this.number.align = 'center';
      this.number.stroke = '#000000';
      this.number.strokeThickness = 2;
      this.number.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);





      game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.generateNet, this).timer.start();
      game.time.events.add(Phaser.Timer.SECOND * 3.2, function(){
        game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.increment, this).timer.start();
      }, this);


    },
    increment: function() {
      this.number.text = ++this.net_count;
    },
    generateNet: function() {
      var y = game.rnd.integerInRange(50, 350);
      var net = this.nets.getFirstExists(false);
      if (!net) {
        net = new FishNet(game, this.nets);
      }
      net.reset(y);
    },
    flap: function() {
      this.fish.animations.play('flap', 30, false);
      this.fish.body.velocity.y = 320;
    },
    update: function() {
      var fish = this.fish;
      var count = this.net_count;
      this.nets.forEach(function(net){
        game.physics.arcade.collide(fish, net, function(){
          game.state.start('gameover', true, false, count);
        });
      });
    }
  };

  var GameOver = function(game){};
  GameOver.prototype = {
    init: function(count) {
      this.t0 = Date.now();
      this.count = count;
    },
    create: function() {
      game.add.sprite(0, 0, 'sea');

      this.fish = game.add.sprite(400, 300, 'fish');
      this.fish.anchor.setTo(0.5, 0.5);
      this.fish.animations.add('flap');
      this.fish.animations.play('flap', 90, true);


      this.number = game.add.text(game.world.centerX, 120, ''+this.count);
      this.number.anchor.setTo(0.5);
      this.number.font = 'Slackey';
      this.number.fontSize = 170;
      //  x0, y0 - x1, y1
      grd = this.number.context.createLinearGradient(0, 0, 0, this.number.canvas.height);
      grd.addColorStop(0, '#eeeeee');   
      grd.addColorStop(1, '#ffffff');
      this.number.fill = grd;

      this.number.align = 'center';
      this.number.stroke = '#000000';
      this.number.strokeThickness = 2;
      this.number.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);



      var text = game.add.text(game.world.centerX, 450, game.rnd.pick(TEXTS));
      text.anchor.setTo(0.5);

      text.font = 'Freckle Face';
      text.fontSize = 60;

      //  x0, y0 - x1, y1
      grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
      grd.addColorStop(0, '#f5f5f5');   
      grd.addColorStop(1, '#ffffff');
      text.fill = grd;

      text.align = 'center';
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    },
    flap: function() {
      if ((Date.now() - this.t0) > 1500)
        game.state.start('swim', true);
    }
  };





  var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload /*, create: create, update: update*/ });

  game.state.add('begin', Begin);
  game.state.add('swim', Swim);
  game.state.add('gameover', GameOver);

  var t0 = Date.now();
  doppler.init(function(bandwidth) {
    if (Math.abs(bandwidth.left -  bandwidth.right) >= 2 && (Date.now() - t0) > 2500)
      _flap();
  });

  function _flap() {
    game.state.getCurrentState().flap();

    var tmp = _flap;
    _flap = function(){};
    setTimeout(function(){
      _flap = tmp;
    }, 200);
  }


  function preload() {
    game.load.image('sea', 'img/tausta.png');
    game.load.image('dark-blue-bg', 'img/tausta2.png');
    game.load.spritesheet('fish', 'img/steps.png', 138,110,12);
    game.load.image('net', 'img/net2.png');

    game.state.start('begin', true);
  }


}
new Game();
