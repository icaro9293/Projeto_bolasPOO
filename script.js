const numObjetos = document.getElementById('inumObjetos')
const campoAdd = document.getElementById('inum')
const botaoAdd = document.getElementById('iadd')
const botaoDel = document.getElementById('idelete')
const palco = document.getElementById('istage')
// const palcoObj = document.getElementById('istageObjetos')



let larguraPalco = palco.offsetWidth
let alturaPalco = palco.offsetHeight
let bolas = []
let numBolas = 0

class Bola {
    constructor(palco, arrayBolas) {
        this.tam = Math.floor(Math.random() * 15) + 10 //número aleatório de 0 a 15, acrescido de 10 para que não seja muito pequena, assim o mínimo sera 10.
        this.red = Math.floor(Math.random() * 255)
        this.green = Math.floor(Math.random() * 255)
        this.blue = Math.floor(Math.random() * 255)
        this.px = Math.floor(Math.random() * (larguraPalco - this.tam)) // aleatório do tamanho da largura menos o tamanho da bola, para que não ocorra da bola aparecer cortada fora da tela.
        this.py = Math.floor(Math.random() * (alturaPalco - this.tam))
        this.id = `${Date.now()}_${Math.random() * 1000000000}`
        this.dirx = (Math.random() * 10) > 5 ? 1 : -1
        this.diry = (Math.random() * 10) > 5 ? 1 : -1
        this.velx = Math.floor(Math.random() * 2) + 0.5 // 0.5 sera a velocidade minima
        this.vely = Math.floor(Math.random() * 2) + 0.5 // 0.5 sera a velocidade minima
        this.palco = palco // tem que saber aonde o objeto será inserido.
        this.arrayBolas = arrayBolas // em que array será inserido
        this.desenhar()
        this.eu = document.getElementById(this.id) // para saber qual o id de cada bola
        this.controle = setInterval(this.controlar, 10)
        numBolas++
        numObjetos.firstElementChild.nextElementSibling.innerHTML = numBolas
    }

    desenhar = () => { // cria a bola no DOM.
        const novoEl = document.createElement('div')
        novoEl.setAttribute('id', this.id)
        novoEl.setAttribute('class', 'bola')
        novoEl.setAttribute('style', `width: ${this.tam}px; height: ${this.tam}px; background-color: rgb(${this.red}, ${this.green}, ${this.blue}); top: ${this.py}px; left: ${this.px}px`)
        this.palco.appendChild(novoEl)
    }

    controlar_colisão = () => {
        if ((this.px + this.tam) >= larguraPalco) { //se chegar no canto direito da tela, define a direção para a direita, colocando o left negativo
            this.dirx = -1
        } else if (this.px <= 0) {
            this.dirx = 1
        }
        if (this.py + this.tam >= alturaPalco) { //se chegar no bottom da tela, defina o top como negativo para a bola ir para cima.
            this.diry = -1
        } else if (this.py <= 0) { //caso chegue no topo, vai para baixo, definindo o top como positivo
            this.diry = 1
        }
    }

    controlar = () => { // controla a direção das bolas e é chamada a cada 10 mili-segundos.
        this.controlar_colisão()
        this.px += this.velx * this.dirx
        this.py += this.vely * this.diry
        this.eu.setAttribute('style', `width: ${this.tam}px; height: ${this.tam}px; background-color: rgb(${this.red}, ${this.green}, ${this.blue}); top: ${this.py}px; left: ${this.px}px`)

        if ((this.px > larguraPalco) || (this.py > alturaPalco)) { // caso eu de um resize na janela, as bolas que ficarem de fora serão removidas
            this.remover()
        }
    }

    minhaPos = () => {
        return this.arrayBolas.indexOf(this)
    }

    remover = () => {
        clearInterval(this.controle) //apenas chamando este método ele irá fazer a bola ficar parada, é necessário ainda remover da lista e do DOM.
        bolas = bolas.filter((b) => { //compara bola por bola do array com o id da bola que será excluida, se for diferente retorna para o array, se for igual ela fica fora.
            if (b.id != this.id) {
                return b
            }
        })
        this.eu.remove() // identifica o elemento pelo id e o remove do DOM.
        numBolas--
        numObjetos.firstElementChild.nextElementSibling.innerHTML = numBolas

    }
}

window.addEventListener('resize', (evt) => {
    larguraPalco = palco.offsetWidth
    alturaPalco = palco.offsetHeight
    console.log(larguraPalco)
})

botaoAdd.addEventListener('click', (evt) => { //instancia os objetos da classe bola na lista.
    let qtd = campoAdd.value
    for (c = 0; c < qtd; c++) {
        // const novaBola = new Bola(bolas, palco)
        // bolas.push(novaBola)
        bolas.push(new Bola(palco, bolas))
    }
    campoAdd.value = 0
})

botaoDel.addEventListener('click', (evt) => {
    bolas.map((b) => {
        b.remover()
    })
})
