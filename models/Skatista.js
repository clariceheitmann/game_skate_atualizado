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
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }

    des_quad(){
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h)
    } 
}

class GarotoSkatista extends Obj{

    dir = 0
    vida = 5
    pontos = 0
    frame = 1
    tempo = 0

    velX = 0 // 🔥 NOVO (movimento lateral)

    // 🔥 NOVO SISTEMA DE PULO
    velY = 0
    gravidade = 0.6
    pulando = false

    mov_car(){

    // 🔥 movimento horizontal
    this.x += this.velX

    if(this.x < 0){
            this.x = 0
    }else if(this.x > 1200 - this.w){
            this.x = 1200 - this.w
    }

    this.velY += this.gravidade
    this.y += this.velY

    // chão
    if(this.y >= chao - this.h){
        this.y = chao - this.h
        this.velY = 0
        this.pulando = false

        // 🔥 PARA o som do pulo aqui
        somPulo.pause()
        somPulo.currentTime = 0
    }
    }

    colid(objeto){
        if((this.x < objeto.x + objeto.w)&&
          (this.x + this.w > objeto.x)&&
          (this.y < objeto.y + objeto.h)&&
          (this.y + this.h > objeto.y)){
            return true
        }else{
            return false
        }
    }

    point(objeto){
        if(objeto.x <= -100){
            return true
        }else{
            return false
        }
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
    
        this.a = "./imgs/" + nome + this.frame + ".png"
        this.img.src = this.a
    }

    atualizaAnimacao(){

        // 🔥 PARADO
        if(this.velX === 0 && !this.pulando){
            this.frame = 1
            this.a = "./imgs/skatista_parado.png"
            this.img.src = this.a
        }
    
        // 🔥 ANDANDO (3 frames)
        else if(this.velX !== 0 && !this.pulando){
            this.anim("animacao_andando_", 3)
        }
    
        // 🔥 PULANDO (4 frames)
        else if(this.velY < 0){
            this.anim("animacao_pulando_", 4)
        }
    
        // 🔥 CAINDO (2 frames)
        else if(this.velY > 0){
            this.anim("animacao_caindo_", 2)
        }
    }
}

class Inimigos extends Obj{

    vel = 6

    ativo = false // 🔥 controla se está ativo

    recomeca(){
        this.x = 1300 + Math.random() * 800
        this.y = chao - this.h
        this.ativo = true
    }

    mov_car(){
        if(!this.ativo) return

        this.x -= this.vel

        if(this.x <= -200){            
            this.ativo = false
        }
    }

    desenha(){
        if(this.ativo){
            this.des_carro()
        }
    }
}

class Text{
    des_text(text, x, y, cor, font){
        des.font = font
    
        // 🔥 SOMBRA NEON
        des.shadowColor = cor
        des.shadowBlur = 15
    
        // 🔥 CONTORNO (grafite)
        des.lineWidth = 4
        des.strokeStyle = 'black'
        des.strokeText(text, x, y)
    
        // 🔥 TEXTO PRINCIPAL
        des.fillStyle = cor
        des.fillText(text, x, y)
    
        // 🔥 RESET sombra (IMPORTANTE)
        des.shadowBlur = 0
    }
}