var len = 10;

var wall = 'rgb(255, 255, 255)';
var original = 'rgb(52, 52, 52)';
var path = '#fce303';

function setup()
{
    var maze_container = document.getElementById('maze_container');
    for(var i = 0; i < 10; i++)
    {
        var row = document.createElement('div');
        row.className = 'row row' + (i+1);
        row.id = 'row' + (i+1);
        for(var j = 0; j < 10; j++)
        {
            var node = document.createElement('div')
            node.className = 'node node' + ((i*10)+(j+1));
            node.id = 'node' + ((i*10)+(j+1));

            if(((i*10)+(j+1)) != 1 && ((i*10)+(j+1)) != 100)
            {
                node.style.backgroundColor = original;

                node.onclick = function(){
                    clicked(this.id);
                }
            }
            row.appendChild(node);

        }
        maze_container.appendChild(row);
    }
}

function clicked(elementID)
{
    var node = document.getElementById(elementID);

    if(node.style.backgroundColor == wall)
    {
        node.style.backgroundColor = original;
    }
    else
    {
        console.log('turn');
        node.style.backgroundColor = wall;
    }
}

function reset()
{
    console.log('yoo');
    for(var i = 2; i < 100; i++)
    {
        var node = document.getElementById('node' + i);
        node.style.backgroundColor = original;
    }

    document.getElementById('node1').style.backgroundColor = 'rgb(255,38,38)';
    document.getElementById('node100').style.backgroundColor = 'rgb(236,0,177)';
}

function solveMaze()
{
    console.time('Execution Time');
    console.log('yo1');
    if(hasWall())
    {
        alert('I am going to reset the maze!');
        reset();
    }
    var maze = [];
    for(let i = 0; i < len; i++)
    {
        maze[i]= new Array(len).fill(0);
    }
    var rowCount = 0;
    var colCount = 0;
    var nodeVal = 1;
    console.log('yo2');
    for(var i = 1; i < (len*len+1); i++)
    {
        console.log('yo3');
        if(document.getElementById('node' + i).style.backgroundColor == wall)
        {
            console.log('damn');
            maze[rowCount][colCount] = -1;
        }
        else
        {
            console.log('yo4');
            maze[rowCount][colCount] = nodeVal;
        }

        colCount++;

        if(colCount==len)
        {
            rowCount++;
            colCount = 0;
        }
        nodeVal++;
    }
    //console.log(maze);

    var adjList = {};
    var possibleMoves = [
        [-1,0],
        [1,0],
        [0,1],
        [0,-1]
    ];

    for(var row = 0; row < maze.length; row++)
    {
        for(var col = 0; col < maze[row].length; col++)
        {
            if(maze[row][col] == -1)
                continue;

            var currNode = maze[row][col];
            var neighbours = [];

            for(var count = 0; count < possibleMoves.length; count++)
            {
                var nRow = possibleMoves[count][0] + row;
                var nCol = possibleMoves[count][1] + col;

                if((nRow >= 0 && nRow < maze.length) && (nCol >=0 && nCol < maze[0].length))
                {
                    if(maze[nRow][nCol] != -1)
                    {
                        neighbours.push([nRow,nCol]);
                    }
                }
            }

            adjList[currNode] = neighbours;
        }
    }
    //console.log(adjList[1]);

    var visited = [];
    var prev = new Array(len*len).fill(0);

    for(var i = 0;i < len; i++)
    {
        visited[i] = new Array(len).fill(false);
    }

    var queue = [];

    var solved = false;

    queue.push([0,0]);

    while (queue.length > 0) {

        var nodeCoord = queue.splice(0, 1)[0];
        var node = maze[nodeCoord[0]][nodeCoord[1]];

        visited[nodeCoord[0]][nodeCoord[1]] = true;

        if(node==100)
        {
            solved = true;
            break;
        }

        var adj = adjList[node];

        for(var count = 0; count < adj.length; count++)
        {
            var n = adj[count];

            if(!visited[n[0]][n[1]])
            {
                visited[n[0]][n[1]] = true;
                queue.push(n);
                prev[(maze[n[0]][n[1]])-1] = node - 1;
            }
        }
    }

    if(!solved)
    {
        alert("This maze is impossible! I'll reset for you!");
        reset();
        return "";
    }

    //retrace
    var endNode = maze[9][9];
    document.getElementById('node'+endNode).style.backgroundColor = path;
    var previous = endNode-1;
    var loopControl = false;

    while(true)
    {
        var node = prev[previous];

        try {
            document.getElementById('node'+(node+1)).style.backgroundColor = path;
        } catch(err) {
            loopControl=true;
        }

        if(node == 0)
        {
            loopControl=true;
        }
        else
        {
            previous=node;
        }

        if (loopControl) {
            // statement
            break;
        }
    }
    document.getElementById('node1').style.backgroundColor = path;
    console.timeEnd('Execution Time');
}

function hasWall()
{
    for(var i = 1; i < 101; i++)
    {
        if(document.getElementById('node'+i).style.backgroundColor == path)
        {
            return true;
        }
    }
    return false;
}
