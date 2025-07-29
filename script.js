import { personagens, imagens } from "./personagens.js";
import { API_KEY } from "./config.js";

// Preenche os selects dinamicamente
function popularSelects() {
  $(".seletor__personagem").each(function () {
    const select = $(this);
    select
      .empty()
      .append(`<option disabled selected>Escolha seu personagem</option>`);
    personagens.forEach((p) => {
      select.append(new Option(p, p));
    });
  });
}

// Inicializa o Select2 após o preenchimento
function iniciarSelect2() {
  $(".seletor__personagem").select2({
    width: "100%",
    dropdownAutoWidth: true,
    minimumResultsForSearch: 10,
  });
}

function verificarSeletores() {
  const selecionados = $(".seletor__personagem")
    .map((_, el) => $(el).val())
    .get();
  const botao = document.getElementById("btn__analise");
  if (botao) {
    botao.disabled = !(selecionados[0] && selecionados[1]);
  }
}

// Atualiza imagem ao selecionar personagem
function atualizarImagem(idx, personagem) {
  const img =
    idx === 0
      ? document.getElementById("img__personagem__1")
      : document.getElementById("img__personagem__2");
  if (!img) return;

  const src = imagens[personagem] || imagens["Random"];
  img.src = src;
  img.alt = personagem || "Random";
  img.style.display = "block";
}

// Evento de mudança nos selects
$(document).on("change", ".seletor__personagem", function () {
  const index = $(".seletor__personagem").index(this);
  const personagem = $(this).val();
  atualizarImagem(index, personagem);
  verificarSeletores();
});

// Ao carregar a página
$(document).ready(function () {
  popularSelects();
  iniciarSelect2();

  // Define imagens iniciais
  atualizarImagem(0, "Random");
  atualizarImagem(1, "Random");

  verificarSeletores();
});

// Botão de análise
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function consultarGemini(prompt) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Nenhuma resposta recebida."
    );
  } catch (error) {
    console.error("Erro na API:", error);
    return "Erro ao consultar a API do Gemini.";
  }
}

document.getElementById("btn__analise")?.addEventListener("click", async () => {
  const [p1, p2] = $(".seletor__personagem")
    .map((_, el) => $(el).val())
    .get();
  if (!p1 || !p2) {
    alert("Selecione dois personagens para analisar.");
    return;
  }

  const resultado = document.getElementById("caixa__analise");
  resultado.innerHTML = `Analisando a batalha entre: <b>${p1}</b> VS <b>${p2}</b>...`;

  const prompt = `
    ## Especialidade
    Você é especialista em Naruto, incluindo personagens, jutsus e estratégias.

    ## Tarefa
    Analise quem venceria em uma batalha entre ${p1} e ${p2}. Considere habilidades, fraquezas, estilo de luta e contexto.

    ## Regras
    - Não use emojis ou linguagem desnecessária.
    - No máximo 600 caracteres.
    - Apenas texto claro.

    ## Pergunta
    Quem vence entre ${p1} e ${p2}?`;

  const resposta = await consultarGemini(prompt);

  resultado.innerHTML = `
    <h3>Análise da batalha: ${p1} vs ${p2}</h3>
    <p>${resposta}</p>
  `;
});
