/**
 * Edge
 */
export class Edge {
  // !!! IMPLEMENT ME
  constructor(destination) {
    this.destination = destination;
  }
}

/**
 * Vertex
 */
export class Vertex {
  // !!! IMPLEMENT ME
  constructor(value = "default", pos = { x: -1, y: -1 }, color = "white") {
    this.value = value;
    this.edges = [];
    this.pos = pos;
    this.color = color;
  }
}

/**
 * Graph
 */
export class Graph {
  constructor() {
    this.vertexes = [];
  }

  createDummyGraph() {
    const dummyVertex1 = new Vertex("v1", { x: 20, y: 25 });
    const dummyVertex2 = new Vertex("v2", { x: 100, y: 75 });
    const dummyVertex3 = new Vertex("v3", { x: 500, y: 605 });

    dummyVertex1.edges.push(new Edge(dummyVertex2));
    dummyVertex2.edges.push(new Edge(dummyVertex1));
    dummyVertex2.edges.push(new Edge(dummyVertex3));
    dummyVertex3.edges.push(new Edge(dummyVertex2));

    this.vertexes.push(dummyVertex1);
    this.vertexes.push(dummyVertex2);
    this.vertexes.push(dummyVertex3);
  }

  /**
   * Create a random graph
   */
  randomize(width, height, pxBox, probability = 0.6) {
    // Helper function to set up two-way edges
    function connectVerts(v0, v1) {
      v0.edges.push(new Edge(v1));
      v1.edges.push(new Edge(v0));
    }

    let count = 0;

    // Build a grid of verts
    let grid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let v = new Vertex();
        //v.value = 'v' + x + ',' + y;
        v.value = "v" + count++;
        row.push(v);
      }
      grid.push(row);
    }

    // Go through the grid randomly hooking up edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Connect down
        if (y < height - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y + 1][x]);
          }
        }

        // Connect right
        if (x < width - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y][x + 1]);
          }
        }
      }
    }

    // Last pass, set the x and y coordinates for drawing
    const boxBuffer = 0.8;
    const boxInner = pxBox * boxBuffer;
    const boxInnerOffset = (pxBox - boxInner) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x].pos = {
          x: (x * pxBox + boxInnerOffset + Math.random() * boxInner) | 0,
          y: (y * pxBox + boxInnerOffset + Math.random() * boxInner) | 0
        };
      }
    }

    // Finally, add everything in our grid to the vertexes in this Graph
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.vertexes.push(grid[y][x]);
      }
    }
  }

  /**
   * Dump graph data to the console
   */
  dump() {
    let s;

    for (let v of this.vertexes) {
      if (v.pos) {
        s = v.value + " (" + v.pos.x + "," + v.pos.y + "):";
      } else {
        s = v.value + ":";
      }

      for (let e of v.edges) {
        s += ` ${e.destination.value}`;
      }
      console.log(s);
    }
  }

  /**
   * BFS
   */
  bfs(start, reset = true) {
    // !!! IMPLEMENT ME
    const component = new Set();
    let queue = [];

    start.color = "gray";
    queue.push(start);

    while (queue.length > 0) {
      const head = queue[0];

      for (let edge of head.edges) {
        const vertex = edge.destination;
        if (vertex.color === "white") {
          vertex.color = "gray";
          queue.push(vertex);
        }
      }

      queue.shift();
      head.color = "black";

      component.add(head);

      // for (let i = 0; i < queue.length; i++) {
      //   let node = queue.shift();
      //   if (node === reset) {
      //     return true;
      //   }
      //   if (node.left) {
      //     queue.push(start[node.left]);
      //   }
      //   if (node.right) {
      //     queue.push(start[node.right]);
      //   }
      // }
    }
    return component;
  }

  /**
   * Get the connected components
   */
  getConnectedComponents() {
    // !!! IMPLEMENT ME
    const componentsSet = new Set();
    // loop through all the vertexes in the graph
    for (let vertex of this.vertexes) {
      if ((vertex.color = "white")) {
        const component = this.bfs(vertex);
        componentsSet.add(component);
      }
    }
    // if it sees a white vertex, call bfs on that vertex
    // since we know that vertex hasn't been traversed
    return componentsSet;
  }
}
