const seletor1 = document.querySelectorAll('.seletor__personagem') [0]
const img1 = document.getElementById('img__personagem__1')
const seletor2 = document.querySelectorAll('.seletor__personagem') [1]
const img2 = document.getElementById('img__personagem__2')
const botaoAnalisar = document.getElementById('btn__analise')

const imagens = {
    Naruto: './IMG/Personagens/P_Naruto.png',
    Sasuke: './IMG/Personagens/P_Sasuke.png',
    Sakura: './IMG/Personagens/P_Sakura.png',
    Pain: './IMG/Personagens/P_Pain.png',
    Gai: './IMG/Personagens/P_Gai.png',
    Kakashi: './IMG/Personagens/P_Kakashi.png',
    Itachi: './IMG/Personagens/P_Itachi.png',
    Asuma: './IMG/Personagens/P_Asuma.png',
    Orochimaru: './IMG/Personagens/P_Orochimaru.png',
    Kisame: './IMG/Personagens/P_Kisame.jpg',
    Random: './IMG/Personagens/P_Random.jpg',
    Deidara: './IMG/Personagens/P_Deidara.png',
    Sasori: './IMG/Personagens/P_Sasori.png',
    RockLee: './IMG/Personagens/P_RockLee.jpg',
    Jiraya: './IMG/Personagens/P_Jiraya.png',
    Neji: './IMG/Personagens/P_Neji.png',
    Hidan: './IMG/Personagens/P_Hidan.png',
    Hinata: './IMG/Personagens/P_Hinata.png',
    KillerBee: 'IMG/Personagens/P_KillerBee.png'
}

function verificarSeletores() {
    const personagem1selecionado = seletor1.value !== ''
    const personagem2selecionado = seletor2.value !== ''

    botaoAnalisar.disabled = !(personagem1selecionado && personagem2selecionado)
}


seletor1.addEventListener('change' , function() {
    const personagem  = seletor1.value
    if (imagens[personagem]) {
        img1.src = imagens[personagem]
        img1.alt = personagem
        img1.style.display = 'block'
    } else {
        img1.src = imagens['Random']
        img1.alt = 'Random'
    }
        img1.style.display = 'block'
        verificarSeletores()    
})

seletor2.addEventListener('change' , function() {
    const personagem = seletor2.value
    if (imagens[personagem]) {
        img2.src = imagens[personagem]
        img2.alt = personagem
        img2.style.display = 'block'
    } else {
        img2.src = imagens['Random']
        img2.alt = 'Random'
        }
        img2.style.display = 'block'
        verificarSeletores()
})

window.addEventListener('DOMContentLoaded', () => {
    img1.src = imagens.Random
    img1.alt = 'Random'
    img1.style.display = 'block'

    img2.src = imagens.Random
    img2.alt = 'Random'
    img2.style.display = 'block'
})

botaoAnalisar.disabled = true

 // Configuração da API do Gemini
const API_KEY = '';
const API_URL = ``;

 // Função para chamar a API do Gemini
async function consultarGemini(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify ({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        const data = await response.json()
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        return 'Desculpe, ocorreu um erro ao consultar o Gemini.'
    }
}

// Função de análise da batalha
document.getElementById('btn__analise').onclick = async function() {
    const p1 = seletor1.value || 'Random'
    const p2 = seletor2.value || 'Random'
    const resultado = document.getElementById('caixa__analise')
    resultado.innerHTML = `Analisando a batalha entre: <b>${p1}</b>VS<b>${p2}</b>`

    const prompt = `
        ## Especialidade
        - Você é um especialista sobre o universo de Naruto, incluindo personagens, habilidades, estratégias de batalha.

        ## Tarefa
        - Você deve responder a pergunta do usuário com base no seu conhecimento do anime.
        - Você deve analisar a batalha que o usuário propõe e determinar quem venceria, considerando as habilidades, fraquezas e estratégias dos personagens envolvidos.
        - Imagine bem o cenário da batalha, os poderes de cada personagem, e como eles se enfrentariam. 


        ## Regras
        - Não use emojis ou formatação desnecessária.

        ## Resposta
        - Seja detalhista e responda com no máximo 600 caracteres. Responda em markdown.
        - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
        - Não use linguagem de programação, apenas responda com texto simples.
        ---
        Aqui está a pergunta do usuário: Quero uma análise detalhada: Uma batalha entre ${p1} e ${p2}. Quem venceria? 
    `

    // chama a API e atualiza o resultado
    const resposta = await consultarGemini(prompt);
    resultado.innerHTML = `
    <h3>Análise da batalha: ${p1} vs ${p2}</h3>
    <p>${resposta}</p>
    `
}
