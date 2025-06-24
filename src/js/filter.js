// Array para armazenar as oportunidades cadastradas
let opportunities = [];

// Controle de navegação entre páginas
function showPage(pageId) {
  // Remove a classe 'active' de todas as páginas
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Remove a classe 'active' de todos os links de navegação
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Adiciona a classe 'active' à página selecionada
  document.getElementById(pageId).classList.add("active");

  // Adiciona a classe 'active' ao link correspondente
  event.target.classList.add("active");

  // Se a página for 'necessidades', renderiza as oportunidades
  if (pageId === "necessidades") {
    renderOpportunities();
  }

  // Fecha o menu mobile se estiver aberto
  closeMobileMenu();
}

// Controle do menu mobile
function toggleMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("active");
}

function closeMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.remove("active");
}

// Função para buscar endereço pelo CEP
async function buscarCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}

// Configuração do campo CEP
function setupCEPField() {
  const cepInput = document.getElementById("cep");
  const ruaInput = document.getElementById("rua");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");

  // Formatação automática do CEP
  cepInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{1,3})/, "$1-$2");
    }
    this.value = value;

    // Busca automática quando CEP estiver completo
    if (value.length === 9) {
      const cepNumeros = value.replace("-", "");
      buscarEnderecoPorCEP(cepNumeros);
    } else {
      // Limpa os campos se CEP incompleto
      limparCamposEndereco();
    }
  });

  async function buscarEnderecoPorCEP(cep) {
    const endereco = await buscarCEP(cep);

    if (endereco) {
      ruaInput.value = endereco.logradouro || "";
      bairroInput.value = endereco.bairro || "";
      cidadeInput.value = endereco.localidade || "";
      estadoInput.value = endereco.uf || "";
    } else {
      alert("CEP não encontrado. Verifique e tente novamente.");
      limparCamposEndereco();
    }
  }

  function limparCamposEndereco() {
    ruaInput.value = "";
    bairroInput.value = "";
    cidadeInput.value = "";
    estadoInput.value = "";
  }
}

// Configuração do formulário
function setupForm() {
  const form = document.getElementById("necessidadeForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Coleta os dados do formulário
    const formData = new FormData(form);
    const opportunity = {
      id: Date.now(), // ID único baseado no timestamp
      nomeInstituicao: formData.get("nomeInstituicao"),
      tipoAjuda: formData.get("tipoAjuda"),
      titulo: formData.get("titulo"),
      descricao: formData.get("descricao"),
      cep: formData.get("cep"),
      rua: formData.get("rua"),
      bairro: formData.get("bairro"),
      cidade: formData.get("cidade"),
      estado: formData.get("estado"),
      contato: formData.get("contato"),
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
    };

    // Adiciona a oportunidade ao array
    opportunities.push(opportunity);

    // Exibe mensagem de sucesso
    alert(
      "🎉 Necessidade cadastrada com sucesso!\n\nObrigado por contribuir para uma comunidade melhor!"
    );

    // Limpa o formulário
    form.reset();

    // Redireciona para a página de oportunidades
    showPage("necessidades");
  });
}

// Renderiza as oportunidades na página
function renderOpportunities(filteredOpportunities = null) {
  const container = document.getElementById("opportunitiesContainer");
  const opportunitiesToShow = filteredOpportunities || opportunities;

  if (opportunitiesToShow.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🌟</div>
                <h3 style="color: #ffffff; margin-bottom: 1rem;">
                    ${
                      opportunities.length === 0
                        ? "Nenhuma oportunidade cadastrada ainda"
                        : "Nenhuma oportunidade encontrada"
                    }
                </h3>
                <p style="color: #b8b8b8;">
                    ${
                      opportunities.length === 0
                        ? "Seja o primeiro a cadastrar uma necessidade e fazer a diferença!"
                        : "Tente ajustar os filtros para encontrar oportunidades."
                    }
                </p>
                ${
                  opportunities.length === 0
                    ? `
                    <button class="btn btn-primary" onclick="showPage('cadastro')" style="margin-top: 1.5rem;">
                        ✨ Cadastrar Nova Necessidade
                    </button>
                `
                    : ""
                }
            </div>
        `;
    return;
  }

  container.innerHTML = opportunitiesToShow
    .map(
      (opportunity) => `
        <div class="opportunity-card">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${opportunity.titulo}</h3>
                    <p class="card-institution">${
                      opportunity.nomeInstituicao
                    }</p>
                </div>
                <span class="card-type">${getTypeEmoji(
                  opportunity.tipoAjuda
                )} ${opportunity.tipoAjuda}</span>
            </div>
            
            <p class="card-description">${opportunity.descricao}</p>
            
            <div class="card-location">
                📍 ${formatarEndereco(opportunity)}
            </div>
            
            <div class="card-contact">
                💬 Contato: ${opportunity.contato}
            </div>
        </div>
    `
    )
    .join("");
}

// Função para obter emoji do tipo de ajuda
function getTypeEmoji(tipo) {
  const emojis = {
    Educação: "📚",
    Saúde: "🏥",
    "Meio Ambiente": "🌱",
    "Doação de Alimentos": "🍽️",
    "Doação de Roupas": "👕",
    Outros: "🤝",
  };
  return emojis[tipo] || "🤝";
}

// Função para formatar endereço
function formatarEndereco(opportunity) {
  const parts = [];

  if (opportunity.rua) parts.push(opportunity.rua);
  if (opportunity.bairro) parts.push(opportunity.bairro);
  if (opportunity.cidade) parts.push(opportunity.cidade);
  if (opportunity.estado) parts.push(opportunity.estado);
  if (opportunity.cep) parts.push(`CEP: ${opportunity.cep}`);

  return parts.length > 0 ? parts.join(", ") : "Endereço não informado";
}

// Sistema de filtros
function setupFilters() {
  const searchInput = document.getElementById("searchInput");
  const filterTipo = document.getElementById("filterTipo");

  // Filtro por texto
  searchInput.addEventListener("input", applyFilters);

  // Filtro por tipo
  filterTipo.addEventListener("change", applyFilters);

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = filterTipo.value;

    let filtered = opportunities;

    // Filtro por texto (busca no título, descrição e instituição)
    if (searchTerm) {
      filtered = filtered.filter(
        (opportunity) =>
          opportunity.titulo.toLowerCase().includes(searchTerm) ||
          opportunity.descricao.toLowerCase().includes(searchTerm) ||
          opportunity.nomeInstituicao.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por tipo
    if (selectedType) {
      filtered = filtered.filter(
        (opportunity) => opportunity.tipoAjuda === selectedType
      );
    }

    renderOpportunities(filtered);
  }
}

// Dados de exemplo para demonstração
function loadSampleData() {
  const sampleOpportunities = [
    {
      id: 1,
      nomeInstituicao: "ONG Esperança",
      tipoAjuda: "Educação",
      titulo: "Reforço Escolar para Crianças",
      descricao:
        "Precisamos de voluntários para ajudar crianças de 8 a 12 anos com reforço escolar em matemática e português. As atividades acontecem de segunda a sexta, das 14h às 17h.",
      cep: "80000-000",
      rua: "Avenida J.K",
      bairro: "Centro",
      cidade: "Londrina",
      estado: "PR",
      contato: "contato@ongesperanca.org.br",
      dataCadastro: "15/06/2025",
    },
    {
      id: 2,
      nomeInstituicao: "Instituto Verde Vida",
      tipoAjuda: "Meio Ambiente",
      titulo: "Plantio de Mudas no Parque",
      descricao:
        "Junte-se a nós no plantio de mudas nativas no Parque da Cidade. Ação voltada para restauração ambiental e conscientização ecológica. Traga disposição e amor pela natureza!",
      cep: "80000-000",
      rua: "Rua Sergipe",
      bairro: "Centro",
      cidade: "Londrina",
      estado: "PR",
      contato: "(43) 98765-4321",
      dataCadastro: "16/06/2025",
    },
    {
      id: 3,
      nomeInstituicao: "Casa do Idoso",
      tipoAjuda: "Saúde",
      titulo: "Companhia para Idosos",
      descricao:
        "Buscamos voluntários para fazer companhia aos nossos idosos, conversando, jogando, lendo ou simplesmente estando presente. Seu tempo pode iluminar o dia de alguém especial.",
      cep: "80000-000",
      rua: "Avenida Acerbispo Dom Geraldo Fernandes",
      bairro: "Centro",
      cidade: "Londrina",
      estado: "PR",
      contato: "voluntarios@casadoidoso.org",
      dataCadastro: "17/06/2025",
    },
  ];

  // Adiciona os dados de exemplo apenas se não houver oportunidades cadastradas
  if (opportunities.length === 0) {
    opportunities.push(...sampleOpportunities);
  }
}

// Inicialização quando a página carrega
document.addEventListener("DOMContentLoaded", function () {
  setupForm();
  setupCEPField();
  setupFilters();
  loadSampleData(); // Carrega dados de exemplo

  // Se estiver na página de necessidades, renderiza as oportunidades
  const necessidadesPage = document.getElementById("necessidades");
  if (necessidadesPage && necessidadesPage.classList.contains("active")) {
    renderOpportunities();
  }
});

// Função para exportar dados (funcionalidade extra)
function exportarDados() {
  const dataStr = JSON.stringify(opportunities, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "oportunidades_voluntariado.json";
  link.click();
}

// Função para importar dados (funcionalidade extra)
function importarDados(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        opportunities = importedData;
        renderOpportunities();
        alert("Dados importados com sucesso!");
      } catch (error) {
        alert("Erro ao importar dados. Verifique se o arquivo é válido.");
      }
    };
    reader.readAsText(file);
  }
}
