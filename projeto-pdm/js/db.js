import { openDB } from "idb";

let db;

async function createDB() {
  try {
    db = await openDB('banco', 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        switch (oldVersion) {
          case 0:
          case 1:
            const store = db.createObjectStore('pessoas', {
              // A propriedade nome será o campo chave
              keyPath: 'nome'
            });
            // Criando um índice id na store, deve estar contido no objeto do banco.
            store.createIndex('id', 'id');
            showResult('Banco de dados criado!');
        }
      }
    });
    showResult("Banco de dados aberto.");
  } catch (e) {
    showResult("Erro ao criar o banco de dados: " + e.message);
  }
}

window.addEventListener("DOMContentLoaded", async event => {
  createDB();
  document.getElementById("btnSalvar").addEventListener("click", addData);
  document.getElementById("btnListar").addEventListener("click", getData);
});

// Função para adicionar dados ao banco
async function addData() {
  const nomeInput = document.getElementById("input").value;  // Pegando o valor do input
  if (!nomeInput) {
    showResult("Por favor, insira um nome.");
    return;
  }

  const tx = await db.transaction('pessoas', 'readwrite');
  const store = tx.objectStore('pessoas');
  store.add({ nome: nomeInput }); // Usando 'nome' como chave
  await tx.done;
  showResult(`Pessoa ${nomeInput} adicionada ao banco.`);
}

// Função para listar dados do banco
async function getData() {
  if (db == undefined) {
    showResult("O banco de dados está fechado");
    return;
  }

  const tx = await db.transaction('pessoas', 'readonly');
  const store = tx.objectStore('pessoas');
  const value = await store.getAll();
  if (value.length > 0) {
    showResult("Dados do banco: " + JSON.stringify(value));
  } else {
    showResult("Não há nenhum dado no banco!");
  }
}

// Função para mostrar resultados na tela
function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
