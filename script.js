/**@type {HTMLCanvasElement} */


window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas-one');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;

    ctx.lineWidth = 9;
    ctx.lineCap = 'square';
    ctx.fillStyle = 'blue';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetY = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowBlur = 15;

    const canvas2 = document.getElementById('canvas-two');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;

    class Fractal {
        constructor(canvasWidth, canvasHeight){
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.size = this.canvasWidth * 0.3;
            this.sides = 7;
            this.maxLevel = 7;
            this.scale = 0.3;
            this.spread = Math.random() * 2.5 + 11;
            this.branches = 5;
            this.color = 'hsl(' + Math.random() * 360 + ', 100%, 70%)';
        }
        draw(context){
            context.strokeStyle = this.color;
            context.save();
            context.translate(this.canvasWidth/2, this.canvasHeight/2);
            context.scale(1, 1);
            for (let i = 0; i < this.sides; i++){
                this.#drawLine(context, 0);
                context.rotate((Math.PI * 2)/this.sides);
            };
            context.restore();
        }
        #drawLine(context, level){
            if (level > this.maxLevel) return;
            context.beginPath();
            context.moveTo(0, 0);   
            context.bezierCurveTo(0, 150, 500, 50, 150, 0);
            context.stroke();
    
            for (let i = 0; i < this.branches; i++){
                context.save();

                context.translate((this.size/this.branches) *i, 50);
                context.scale(this.scale, this.scale);

                context.save();
                context.rotate(this.spread);
                this.#drawLine(context, level + 1);
                context.restore();
    
                context.restore();
            }
        }
    }

    class Particle {
        constructor(canvasWidth, canvasHeight, image){
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.image = image;
            this.x = Math.random() * this.canvasWidth;
            this.y = Math.random() * this.canvasHeight;
            this.sizeModifier =  Math.random() * 0.5 + 0.1;
            this.width = this.image.width * this.sizeModifier;
            this.height = this.image.height * this.sizeModifier;
            this.speed = Math.random() * 1 + 0.9;
            this.angle = 0;
            this.va = Math.random() * 0.01 - 0.005;
        }
        update(){
            this.angle += this.va;
            this.x += this.speed;
            if (this.x > this.canvasWidth + this.width) this.x = -this.width;
            this.y += this.speed;
            if (this.y > this.canvasHeight + this.height) this.y = -this.height;
        }
        draw(context){
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image, -this.width/3, -this.height/3, this.width, this.height);
            context.restore();
        }
    }

    class Drop {
        constructor(canvasWidth, canvasHeight, image){
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.image = image;
            this.numberOfParticles = 15;
            this.particles = [];
            this.#initialize();
        }
        #initialize(){
            for (let i = 0; i < this.numberOfParticles; i++){
                this.particles.push(new Particle(this.canvasWidth, this.canvasHeight, this.image));
            }
        }
        run(context){
            this.particles.forEach(particle => {
                particle.draw(context);
                particle.update();
            });
        }
    }
    
    const fractal1 = new Fractal(canvas.width, canvas.height);
    fractal1.draw(ctx);
    const fractalImage = new Image();
    fractalImage.src = canvas.toDataURL();

    fractalImage.onload = function(){
        const dropEffect = new Drop(canvas2.width, canvas2.height, fractalImage);

        function animate(){
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            dropEffect.run(ctx2);
            requestAnimationFrame(animate);
        }
        animate();
    }
});