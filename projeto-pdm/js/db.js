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
 document.getElementById("btnExcluir").onclick = async () => {
    await db.clear('pessoas');
    document.querySelector("output").innerHTML = "";
    alert("Todos os dados foram excluídos.");

};
});


async function addData() {
  const nome = "Foto-" + Date.now();
  const foto = document.querySelector("#camera-output").src;
  const descricaoInput = document.getElementById("descricao");
  const descricao = descricaoInput.value.trim();

  if (!foto) {
    showResult("Tire uma foto antes de salvar.");
    return;
  }

  const tx = db.transaction('pessoas', 'readwrite');
  await tx.store.add({ nome, foto, descricao });
  await tx.done;

  showResult("Foto salva!");
  document.getElementById("descricao").value = "";
}


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
    t.querySelector(".descricao").textContent = item.descricao || "Sem descrição";
    container.appendChild(t);
  });
}


function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
