/*:
 * @plugindesc 이벤트가 플레이어를 피해서 특정 위치로 이동하는 기능 추가
 * @author ChatGPT
 */

(() => {
  Game_Interpreter.prototype.moveRouteForEventAvoidingPlayer = function(eventId, targetX, targetY) {
    const event = $gameMap.event(eventId);
    if (!event) return;

    const start = [event.x, event.y];
    const goal = [targetX, targetY];
    
    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;

    const isPassable = (x, y) => {
      if (x === playerX && y === playerY) return false;
      return $gameMap.isValid(x, y) && $gameMap.isPassable(x, y, 2);
    };

    const openList = [];
    const closedList = new Set();
    openList.push({ x: start[0], y: start[1], path: [] });

    while (openList.length > 0) {
      const current = openList.shift();
      const key = `${current.x},${current.y}`;
      if (closedList.has(key)) continue;
      closedList.add(key);

      if (current.x === goal[0] && current.y === goal[1]) {
        const route = current.path.map(dir => ({ code: dir, parameters: [] }));
        route.push({ code: 0 });
        const moveRoute = { list: route, repeat: false, skippable: true, wait: false };
        event.forceMoveRoute(moveRoute);
        return;
      }

      const directions = [
        { dx: 0, dy: -1, dir: Game_Character.ROUTE_MOVE_UP },
        { dx: 1, dy: 0, dir: Game_Character.ROUTE_MOVE_RIGHT },
        { dx: 0, dy: 1, dir: Game_Character.ROUTE_MOVE_DOWN },
        { dx: -1, dy: 0, dir: Game_Character.ROUTE_MOVE_LEFT },
      ];

      for (const d of directions) {
        const nx = current.x + d.dx;
        const ny = current.y + d.dy;
        if (isPassable(nx, ny)) {
          openList.push({ x: nx, y: ny, path: current.path.concat([d.dir]) });
        }
      }
    }
  };
})();
