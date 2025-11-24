import { openDB } from "https://cdn.jsdelivr.net/npm/idb@7/+esm";

let db;

async function createDB() {
  db = await openDB('banco', 1, {
    upgrade(db) {
      const store = db.createObjectStore('pessoas', {
        keyPath: 'nome'
      });
      store.createIndex('foto', 'foto');
    }
  });

  showResult("Banco de dados criado/aberto.");
}

window.addEventListener("DOMContentLoaded", () => {
  createDB();

  document.getElementById("btnSalvar").onclick = addData;
  document.getElementById("btnListar").onclick = getData;
});

// SALVAR FOTO
async function addData() {
  const nome = "Foto-" + Date.now();
  const foto = document.querySelector("#camera-output").src;

  if (!foto) {
    showResult("Tire uma foto antes de salvar.");
    return;
  }

  const tx = db.transaction('pessoas', 'readwrite');
  await tx.store.add({ nome, foto });
  await tx.done;

  showResult("Foto salva!");
}

// LISTAR FOTOS
async function getData() {
  const lista = await db.getAll('pessoas');

  if (!lista.length) {
    showResult("Nenhum dado salvo.");
    return;
  }

  const container = document.querySelector("output");
  container.innerHTML = "";

  lista.forEach(item => {
    const t = document.getElementById("item-template").content.cloneNode(true);
    t.querySelector(".nome").textContent = item.nome;
    t.querySelector(".foto").src = item.foto;
    container.appendChild(t);
  });
}

// EXIBIR TEXTO
function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
