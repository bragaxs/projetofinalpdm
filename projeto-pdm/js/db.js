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
              keyPath: 'nome'
            });
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

// -------------------------------------
// SALVAR
// -------------------------------------
async function addData() {
  const nomeInput = document.getElementById("input").value;

  if (!nomeInput) {
    showResult("Por favor, insira um nome.");
    return;
  }

  // foto atual da câmera (base64)
  const fotoBase64 = document.querySelector("#camera-output").src;

  const tx = await db.transaction('pessoas', 'readwrite');
  const store = tx.objectStore('pessoas');

  store.add({
    nome: nomeInput,
    foto: fotoBase64
  });

  await tx.done;
  showResult(`Pessoa ${nomeInput} adicionada ao banco.`);
}

// -------------------------------------
// LISTAR
// -------------------------------------
async function getData() {
  if (!db) {
    showResult("O banco de dados está fechado");
    return;
  }

  const tx = await db.transaction('pessoas', 'readonly');
  const store = tx.objectStore('pessoas');
  const pessoas = await store.getAll();

  const output = document.querySelector("output");

  if (pessoas.length === 0) {
    output.innerHTML = "Não há nenhum dado no banco!";
    return;
  }

  // limpa tela
  output.innerHTML = "<h3>Dados do Banco:</h3>";

  // pega o template HTML separado
  const template = document.getElementById("pessoa-template");

  pessoas.forEach(p => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".pessoa-nome").textContent = p.nome;
    clone.querySelector(".pessoa-foto").src = p.foto;

    output.appendChild(clone);
  });
}

// -------------------------------------
function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
