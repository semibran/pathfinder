module.exports = function Pathfinder(world) {
  return function findPath(start, goal) {

    var path

    var stack = [start]
    var costs = {}

    world.grid.each(function (value, x, y) {
      if (world.tiles[value].solid)
        return
      costs[x + ',' + y] = 1
    })

    var opened = {}
    var closed = {}
    var gscore = {}
    var fscore = {}
    var parent = {}
    var dirs = {}

    opened[start] = true

    gscore[start] = 0
    fscore[start] = manhattan(start, goal)

    while (stack.length) {
      stack = stack.sort(function (a, b) { return fscore[b] - fscore[a] })
      cell = stack.pop()
      if (cell.toString() === goal.toString()) {
        path = [goal]
        while (cell.toString() !== start.toString()) {
          cell = parent[cell]
          path.unshift(cell)
        }
        return path
      }
      closed[cell] = true
      neighbors(cell).forEach(function (neighbor, index) {
        if (closed[neighbor] || !costs[neighbor])
          return
        g = gscore[cell] + 1
        if (!opened[neighbor]) {
          opened[neighbor] = true
          stack.push(neighbor)
        } else if (g >= gscore[neighbor] || Infinity)
          return
        parent[neighbor] = cell
        dirs[neighbor] = index
        gscore[neighbor] = g
        fscore[neighbor] = g + manhattan(neighbor, goal)
      })
    }
    return null
  }
}

function neighbors(cell) {
  var x = cell[0]
  var y = cell[1]
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ]
}

function manhattan(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}
