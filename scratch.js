(function playScratchCard() {

    var scratchColor = '#9e9e9e';
    var randomArr = [];
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function hasWon(){
      var hashMap = {};
      var el;
      for(var i =0 ; i < 9 ; i++){
        el = randomArr[i];
        if(hashMap[el]){
          hashMap[el]++;
          if(hashMap[el] === 3){
            return true;
          }
        }
        else{
          hashMap[el] = 1 ;
        }
      }
      return false;
    }

    function createMatrix(container){
      var random;
      var table = document.createElement('table');
      var tr;
      var td;
      for(var i =0 ; i < 3 ; i++){
        tr = document.createElement('tr');
        for(var j =0 ; j < 3 ; j++){
          td = document.createElement('td');
          random = getRandomInt(1, 8);
          td.innerHTML = random;
          randomArr.push(random);
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      container.appendChild(table);
    }

    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width;
        canvas.node.height = height;
        parent.appendChild(canvas.node);
        return canvas;
    }

    function isCanvasTransparent(canvas) {
      var ctx=canvas.getContext("2d");
      var imageData=ctx.getImageData(0,0,canvas.offsetWidth,canvas.offsetHeight);
      for(var i=0;i<imageData.data.length;i+=10)
        if(imageData.data[i+9]!==0)
          return false;
      return true;
    }

    function init(container, width, height) {
        var canvas = createCanvas(container, width, height);
        var ctx = canvas.context;
        ctx.fillCircle = function(x, y, radius) {
            this.fillStyle = scratchColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
        };
        ctx.clearTo = function() {
            ctx.fillStyle = scratchColor;
            ctx.fillRect(0, 0, width, height);
        };
        ctx.clearTo();

        //mouse events
        canvas.node.onmousemove = function(e) {
            if (!canvas.isDrawing) {
               return;
            }

            var x = e.offsetX;
            var y = e.offsetY;
            var radius = 80; // or whatever
            var fillColor = '#ff0000';
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillCircle(x, y, radius, fillColor);
        };
        canvas.node.onmousedown = function(e) {
            canvas.isDrawing = true;
        };
        canvas.node.onmouseup = function(e) {
            canvas.isDrawing = false;
            if(isCanvasTransparent(this)){
              if(hasWon()){
                alert('Congrats');
              }else{
                alert('Better Luck Next Time');
              }
              var r = confirm("Want to Scratch Again ?");
              if (r == true) {
                playScratchCard();
              }
            }
        };
        //touch events
        canvas.node.addEventListener('touchmove',function(e){
          if (!canvas.isDrawing) {
             return;
          }
          if (e.changedTouches){
            var  touch = e.changedTouches[0];
            var pos_x =  touch.pageX;
            var pos_y =  touch.pageY;
            var x = pos_x -  this.offsetParent.offsetLeft + this.offsetParent.clientWidth/2;
            var y = pos_y - this.offsetParent.offsetTop + this.offsetParent.clientHeight/2;
            var radius = 80; // or whatever
            var fillColor = '#ff0000';
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillCircle(x, y, radius, fillColor);
          }
        },false);
        canvas.node.addEventListener('touchstart',canvas.node.onmousedown,false);
        canvas.node.addEventListener('touchend',canvas.node.onmouseup, false);
    }

    var container = document.getElementById('canvas');
    container.innerHTML = '';
    createMatrix(container);
    init(container,600,600);
})();
