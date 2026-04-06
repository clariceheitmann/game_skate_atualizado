// Classe base para os objetos do jogo
class Obj{
    constructor(x,y,w,h,a){
        // Posição e tamanho
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a

        // Cria imagem do objeto
        this.img = new Image()
        this.img.src = this.a

        // Armazena as imagens já carregadas 
        this.imagens = {}
    }

    // Desenha o skatista (ou objeto com imagem)
    des_skatista(){
        if(this.img.complete && this.img.naturalWidth !== 0){
            des.drawImage(this.img, this.x, this.y, this.w, this.h)
        }

        // Caso não estiver ativo, para aqui
        if(!this.ativo) return

    let w = this.w * this.escala
    let h = this.h * this.escala

    let x = this.x - (w - this.w) / 2
    let y = this.y - (h - this.h) / 2

    des.drawImage(this.img, x, y, w, h)
    }

    des_quad(){
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h)
    } 
}

// Classe do personagem jogador
class GarotoSkatista extends Obj{

    constructor(x,y,w,h,a, tipo="M"){
        super(x,y,w,h,a)

        // Tipo do personagem (Se vai ser o garoto(M) ou a garota(F))
        this.tipo = tipo 

        this.dir = 0
        this.vida = 5
        this.pontos = 0
        this.frame = 1
        this.tempo = 0
        this.velX = 0

        //Lógica do pulo 
        this.velY = 0
        this.gravidade = 0.6
        this.pulando = false

        // Tempo de invencibilidade após o dano
        this.invencivel = 0
    }

    // Movimento e física do personagem
    mov_skatista(){

        this.x += this.velX

        // Limita tudo a ficar dentro da tela
        if(this.x < 0){
            this.x = 0
        }else if(this.x > 1200 - this.w){
            this.x = 1200 - this.w
        }

        // Aplica gravidade 
        this.velY += this.gravidade
        this.y += this.velY

        // Verifica se o jogador está no chão
        if(this.y >= chao - this.h){
            this.y = chao - this.h
            this.velY = 0
            this.pulando = false

            somPulo.pause()
            somPulo.currentTime = 0
        }
    }

    // Verifica colisão com outro objeto
    colid(objeto){
        return (
            this.x < objeto.x + objeto.w &&
            this.x + this.w > objeto.x &&
            this.y < objeto.y + objeto.h &&
            this.y + this.h > objeto.y
        )
    }

    // Controla animações (troca de sprites)
    anim(nome, maxFrames){
        this.tempo++

        // Troca de frame a cada certo tempo
        if(this.tempo > 12){
            this.tempo = 0
            this.frame++
        }

        // Reinicia animação
        if(this.frame > maxFrames){
            this.frame = 1
        }

        let caminho = ""

        // Define se a imagem é o garoto ou a garota
        if(this.tipo === "M"){
            caminho = "./imgs/" + nome + this.frame + "_M.png"
        }else{
            caminho = "./imgs/" + nome + this.frame + "_F.png"
        }

        if(!this.imagens[caminho]){
            let img = new Image()
            img.src = caminho
            this.imagens[caminho] = img
        }

        this.img = this.imagens[caminho]
    }

    // Decide qual animação usar
    atualizaAnimacao(){

        // Parado
        if(this.velX === 0 && !this.pulando){
            this.frame = 1

            if(this.tipo === "M"){
                this.a = "./imgs/skatista_parado_M.png"
            }else{
                this.a = "./imgs/skatista_parado_F.png"
            }

            if(!this.imagens[this.a]){
                let img = new Image()
                img.src = this.a
                this.imagens[this.a] = img
            }

            this.img = this.imagens[this.a]
        }
            // Andando
            else if(this.velX !== 0 && !this.pulando){
            this.anim("animacao_andando_", 3)
        }
            // Subindo no pulo
            else if(this.velY < 0){
            this.anim("animacao_pulando_", 4)
        }
            // Caindo
            else if(this.velY > 0){
            this.anim("animacao_caindo_", 2)
        }
    }

    // Desenha personagem com efeito de dano (ele pisca e fica branco)
    drawComDano(){
        if(this.invencivel > 0){
            if(Math.floor(this.invencivel / 5) % 2 === 0){
                des.filter = "brightness(2)"
            }

            this.invencivel--
        }
            this.des_skatista()
            des.filter = "none"
    }
}

// Classe dos inimigos 
class Inimigos extends Obj{

    constructor(x,y,w,h,a){
        super(x,y,w,h,a)
        this.vel = 6
        this.ativo = false
        this.pontuado = false 
        this.passouTela = false
    }

     // Reposiciona inimigo para reaparecer
    recomeca(){
        this.x = 1300 + Math.random() * 800
        this.y = chao - this.h
        this.ativo = true
        this.pontuado = false
        this.passouTela = false 
    }

    // Movimento do inimigo
    mov_skatista(){
        if(!this.ativo) return

        this.x -= this.vel

        // Marca quando entrou na tela
        if(this.x < 1200){
            this.passouTela = true
        }

        // Desativa quando sai da tela
        if(this.x <= -200){            
            this.ativo = false
        }
    }

    // Desenha inimigo
    desenha(){
        if(this.ativo){
            this.des_skatista()
        }
    }
}

// Classe do coração (item de vida)
class Coracao extends Obj {

    constructor(x,y,w,h,a){
    super(x,y,w,h,a)
    this.ativo = false
    this.vel = 6

    this.tempo = 0
    this.escala = 1
    }

    // Faz o coração aparecer
    spawn(){
        this.x = 1300
        this.y = 300
        this.ativo = true
    }

    // Animação do coração
    animar(){
    this.tempo += 0.1
    this.escala = 1 + Math.sin(this.tempo) * 0.1
    }

    // Movimento do coração
    mov(){
    if(!this.ativo) return

    this.x -= this.vel
    this.animar()

    // Desativa quando sai da tela
    if(this.x < -100){
        this.ativo = false
        }
    }
}

// Classe para desenhar textos na tela
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