var pMap = new Map();
var gMap = new Map();
var splashList = ["with herself", "around with Python", "around with Javascript", "Doki Doki Literature Club", "with Kitchen Sponges", "around with boys' hearts", "in Your Reality", "Deep Space Maifu"];

//
pMap.set('Colton', '170219703363567616');
pMap.set('Josiah', '183638411683430400');
pMap.set('Luca', '182696081220567041');
pMap.set('Alex', '259738843253571586');
pMap.set('Bill', '184030502070517761');
pMap.set('Chris', '185192156489580544');
pMap.set('Rohan', '254389325557530624');
pMap.set('Sam', '271781374162108426');
pMap.set('CJ', '182697162734436352');
pMap.set('Matthew', '176806596536434688');
pMap.set('Vishnu', '168444189212672001');
pMap.set('John', '170611068383657984');
pMap.set('Diego', '326508789685551105');

// setting the values
gMap.set('pat', [pMap.get('Colton'),pMap.get('Luca'),pMap.get('Alex'),pMap.get('Chris'),pMap.get('CJ'),pMap.get('Josiah'),pMap.get('Bill')]);
gMap.set('pubg', [pMap.get('Luca'),pMap.get('Alex'),pMap.get('Colton'),pMap.get('Josiah'),pMap.get('Bill'),pMap.get('Chris'),pMap.get('CJ'),pMap.get('Rohan'),pMap.get('Sam')]);
gMap.set('rainbow', [pMap.get('Luca'),pMap.get('Alex'),pMap.get('Colton'),pMap.get('Chris'),pMap.get('CJ')]);
gMap.set('civ', [pMap.get('Luca'),pMap.get('Colton'),pMap.get('Josiah'),pMap.get('Chris'),pMap.get('CJ')]);
gMap.set('ark', [pMap.get('Luca'),pMap.get('Chris'),pMap.get('Rohan')]);
gMap.set('tunite', [pMap.get('Luca'),pMap.get('Alex'),pMap.get('Colton'),pMap.get('Josiah'),pMap.get('Bill'),pMap.get('Chris'),pMap.get('CJ'),pMap.get('Sam')]);
gMap.set('tos', [pMap.get('Colton'),pMap.get('Josiah'),pMap.get('Bill'),pMap.get('Chris')]);
gMap.set('fact', [pMap.get('Luca'),pMap.get('Josiah'),pMap.get('Chris')]);
gMap.set('csgo', [pMap.get('Colton'),pMap.get('Josiah'),pMap.get('Chris'),pMap.get('CJ'),pMap.get('Bill'),pMap.get('Diego'),pMap.get('Sam')]);

function gameMapList() {
  var arr = new Array();
  Array.from(gMap.entries()).forEach( ent => {
    arr.push(ent[0]);
  });
  return arr;
}

module.exports = {
  playerMap : pMap,
  gameMap : gMap,
  splashes : splashList
}
module.exports.gameMapList = gameMapList;
