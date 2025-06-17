"use strict";

const eNumero = (numero) => /^[0-9]+$/.test(numero);
const cepValido = (cep) => cep.length == 8 && eNumero(cep);

const limparFormulario = () => {
  document.getElementById("rua").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("estado").value = "";
};

const preencherFormulario = (endereco) => {
  document.getElementById("rua").value = endereco.logradouro;
  document.getElementById("bairro").value = endereco.bairro;
  document.getElementById("cidade").value = endereco.localidade;
  document.getElementById("estado").value = endereco.uf;
};

const pesquisarCep = async () => {
  limparFormulario();
  const cep = document.getElementById("cep").value.replace("-", "").trim();
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  if (cepValido(cep)) {
    const dados = await fetch(url);
    const endereco = await dados.json();
    if (endereco.hasOwnProperty("erro")) {
      alert("CEP não encontrado.");
    } else {
      preencherFormulario(endereco);
    }
  } else {
    alert("CEP inválido. Verifique o número digitado.");
  }
};

document.getElementById("cep").addEventListener("focusout", pesquisarCep);

const showPage = (id) => {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

const toggleMobileMenu = () => {
  document.getElementById("navMenu").classList.toggle("active");
};
