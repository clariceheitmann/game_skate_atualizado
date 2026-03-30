class Obj{
    constructor(x,y,w,h,a){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        this.img = new Image()
        this.img.src = this.a
    }

    des_carro(){
        if(this.img.complete && this.img.naturalWidth !== 0){
            des.drawImage(this.img, this.x, this.y, this.w, this.h)
        }
    }

    des_quad(){
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h)
    } 
}

class GarotoSkatista extends Obj{

    constructor(x,y,w,h,a, tipo="M"){
        super(x,y,w,h,a)

        this.tipo = tipo 

        this.dir = 0
        this.vida = 5
        this.pontos = 0
        this.frame = 1
        this.tempo = 0

        this.velX = 0

        this.velY = 0
        this.gravidade = 0.6
        this.pulando = false
    }

    mov_car(){

        this.x += this.velX

        if(this.x < 0){
            this.x = 0
        }else if(this.x > 1200 - this.w){
            this.x = 1200 - this.w
        }

        this.velY += this.gravidade
        this.y += this.velY

        if(this.y >= chao - this.h){
            this.y = chao - this.h
            this.velY = 0
            this.pulando = false

            somPulo.pause()
            somPulo.currentTime = 0
        }
    }

    colid(objeto){
        return (
            this.x < objeto.x + objeto.w &&
            this.x + this.w > objeto.x &&
            this.y < objeto.y + objeto.h &&
            this.y + this.h > objeto.y
        )
    }

    point(objeto){
    return this.x > objeto.x + objeto.w
}

    anim(nome, maxFrames){
        this.tempo += 1
    
        if(this.tempo > 12){
            this.tempo = 0
            this.frame += 1
        }
    
        if(this.frame > maxFrames){
            this.frame = 1
        }
    
        if(this.tipo === "M"){
            this.a = "./imgs/" + nome + this.frame + "_M.png"
        }else{
            this.a = "./imgs/" + nome + this.frame + "_F.png"
        }
    
        this.img.src = this.a
    }

    atualizaAnimacao(){

    if(this.velX === 0 && !this.pulando){
        this.frame = 1

        if(this.tipo === "M"){
            this.a = "./imgs/skatista_parado_M.png"
        }else{
            this.a = "./imgs/skatista_parado_F.png"
        }

        this.img.src = this.a
    }

    else if(this.velX !== 0 && !this.pulando){
        this.anim("animacao_andando_", 3)
    }

    else if(this.velY < 0){
        this.anim("animacao_pulando_", 4)
    }

    else if(this.velY > 0){
        this.anim("animacao_caindo_", 2)
    }
}
}

class Inimigos extends Obj{

    vel = 6

    ativo = false
    pontuado = false 
    passouTela = false

    recomeca(){
    this.x = 1300 + Math.random() * 800
    this.y = chao - this.h
    this.ativo = true
    this.pontuado = false
    this.passouTela = false 
}

    mov_car(){
    if(!this.ativo) return

    this.x -= this.vel

    if(this.x < 1200){
        this.passouTela = true
    }

    if(this.x <= -200){            
        this.ativo = false
    }
}

    desenha(){
        des.fillStyle = "red"
        des.fillRect(100,100,100,100)

        if(this.ativo){
            this.des_carro()
        }
    }
}

class Text{
    des_text(text, x, y, cor, font, contorno = 'black'){
    des.font = font

    des.shadowColor = cor
    des.shadowBlur = 5

    des.lineWidth = 4
    des.strokeStyle = contorno
    des.strokeText(text, x, y)

    des.fillStyle = cor
    des.fillText(text, x, y)

    des.shadowBlur = 0
    }
}