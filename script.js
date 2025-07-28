// Só busca elementos se existirem na página
const img1 = document.getElementById("img__personagem__1");
const img2 = document.getElementById("img__personagem__2");
const botaoAnalisar = document.getElementById("btn__analise");

const imagens = {
  Naruto: "./IMG/Personagens/P_Naruto.png",
  Sasuke: "./IMG/Personagens/P_Sasuke.png",
  Sakura: "./IMG/Personagens/P_Sakura.png",
  Pain: "./IMG/Personagens/P_Pain.png",
  Gai: "./IMG/Personagens/P_Gai.png",
  Kakashi: "./IMG/Personagens/P_Kakashi.png",
  Itachi: "./IMG/Personagens/P_Itachi.png",
  Asuma: "./IMG/Personagens/P_Asuma.png",
  Orochimaru: "./IMG/Personagens/P_Orochimaru.png",
  Kisame: "./IMG/Personagens/P_Kisame.jpg",
  Random: "./IMG/Personagens/P_Random.jpg",
  Deidara: "./IMG/Personagens/P_Deidara.png",
  Sasori: "./IMG/Personagens/P_Sasori.png",
  RockLee: "./IMG/Personagens/P_RockLee.jpg",
  Jiraya: "./IMG/Personagens/P_Jiraya.png",
  Neji: "./IMG/Personagens/P_Neji.png",
  Hidan: "./IMG/Personagens/P_Hidan.png",
  Hinata: "./IMG/Personagens/P_Hinata.png",
  KillerBee: "IMG/Personagens/P_KillerBee.png",
  Obito: "./IMG/Personagens/P_Obito.png",
  Shikamaru: "./IMG/Personagens/P_Shikamaru.png",
  Hashirama: "./IMG/Personagens/P_Hashirama.png",
  Madara: "./IMG/Personagens/P_Madara.png",
  Tobirama: "./IMG/Personagens/P_Tobirama.png",
  Minato: "./IMG/Personagens/P_Minato.png",
  Gaara: "./IMG/Personagens/P_Gaara.png",
  Kakuzu: "./IMG/Personagens/P_Kakuzu.png",
  Konan: "./IMG/Personagens/P_Konan.png",
  Shisui: "./IMG/Personagens/P_Shisui.png"
};

function verificarSeletores() {
  if (!botaoAnalisar) return;
  const personagem1selecionado = $(".seletor__personagem").eq(0).val() !== "";
  const personagem2selecionado = $(".seletor__personagem").eq(1).val() !== "";
  botaoAnalisar.disabled = !(personagem1selecionado && personagem2selecionado);
}

// Usar jQuery para garantir compatibilidade com Select2

$(document).on("change", ".seletor__personagem", function () {
  if (!img1 || !img2) return;
  const idx = $(this).parent().index();
  const personagem = $(this).val();
  if (idx === 0) {
    if (imagens[personagem]) {
      img1.src = imagens[personagem];
      img1.alt = personagem;
    } else {
      img1.src = imagens["Random"];
      img1.alt = "Random";
    }
    img1.style.display = "block";
  } else if (idx === 2) {
    // o segundo seletor está no terceiro filho do flex
    if (imagens[personagem]) {
      img2.src = imagens[personagem];
      img2.alt = personagem;
    } else {
      img2.src = imagens["Random"];
      img2.alt = "Random";
    }
    img2.style.display = "block";
  }
  verificarSeletores();
});

window.addEventListener("DOMContentLoaded", () => {
  if (img1) {
    img1.src = imagens.Random;
    img1.alt = "Random";
    img1.style.display = "block";
  }
  if (img2) {
    img2.src = imagens.Random;
    img2.alt = "Random";
    img2.style.display = "block";
  }
});

if (botaoAnalisar) botaoAnalisar.disabled = true;

// Configuração da API do Gemini
const API_KEY = "AIzaSyBToRsoZT6CVNu49R5IV-KBaaA9BXA1mPo";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

// Função para chamar a API do Gemini
async function consultarGemini(prompt) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    return "Desculpe, ocorreu um erro ao consultar o Gemini.";
  }
}

// Função de análise da batalha
const btnAnalise = document.getElementById("btn__analise");
if (btnAnalise) {
  btnAnalise.onclick = async function () {
    const p1 = $(".seletor__personagem").eq(0).val();
    const p2 = $(".seletor__personagem").eq(1).val();
    if (!p1 || !p2) {
      alert("Por favor, selecione dois personagens para analisar a batalha");
      return;
    }
    const resultado = document.getElementById("caixa__analise");
    resultado.innerHTML = `Analisando a batalha entre: <b>${p1}</b>VS<b>${p2}</b>`;

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
      `;

    // chama a API e atualiza o resultado
    const resposta = await consultarGemini(prompt);
    resultado.innerHTML = `
      <h3>Análise da batalha: ${p1} vs ${p2}</h3>
      <p>${resposta}</p>
      `;
  };
}

$(document).ready(function () {
  $(".seletor__personagem").select2({
    width: "100%",
    dropdownAutoWidth: true,
    minimumResultsForSearch: 10, // mostra busca só se tiver mais de 10 opções
  });
});

// Criando gotas de chuva
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, rain script running");
  const rainDiv = document.getElementById("rain");
  if (!rainDiv) {
    console.error("Div #rain não encontrada!");
    return;
  }
  for (let i = 0; i < 80; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = 0.7 + Math.random() * 0.7 + "s";
    drop.style.opacity = 0.2 + Math.random() * 0.5;
    rainDiv.appendChild(drop);
  }
  console.log("Gotas criadas:", document.querySelectorAll(".raindrop").length);

  function lightning() {
    const el = document.getElementById("lightning");
    if (!el) {
      console.error("Div #lightning não encontrada!");
      return;
    }
    el.style.opacity = 0.7;
    setTimeout(() => {
      el.style.opacity = 0;
    }, 80 + Math.random() * 120);
    setTimeout(lightning, 2000 + Math.random() * 4000);
  }
  lightning();
});
