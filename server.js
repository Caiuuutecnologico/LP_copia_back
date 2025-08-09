const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'neondb_owner',
  host: 'ep-curly-shadow-acpfh75q-pooler.sa-east-1.aws.neon.tech',
  database: 'neondb',
  password: 'npg_7ikSRte2Bahy',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});


// CONFIGURAÇÃO DO DOTENV
dotenv.config();

// CONFIGURAÇÃO DO EXPRESS
const app = express();

// CONFIGURAÇÃO PARA USAR JSON NAS REQUISIÇÕES
app.use(express.json());

// CONFIGURAÇÃO DA PORTA
const PORT = process.env.PORT || 3000;

// MIDDLEWARE DE CORS
app.use(cors());

// INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, function () {
  console.log(`Servidor rodando em http://localhost:${PORT}?utm_source=facebook&utm_medium=social&utm_campaign=lancamento`);
});

// CONFIGURAÇÃO PARA RODAR O FRONT NO SERVIDOR
app.use(express.static(path.join(__dirname, "public")));

// TESTE DE REQUISIÇÃO NO SERVIDOR
app.get('/teste', async function(req, res) {
try {
    return res.json({resultado: 4444444444});
} catch (erro) {
    return res.json({erro: "Problemas com o servidor"})
}
}
);

// REQUISIÇÃO PARA TABELA DE DEMOSTRAÇÃO
app.post('/envio', async function(req, res) {
  const dados = req.body
  let cnpjFormat = dados.cnpj.replace(/\D/g, '');
  let zapFormat = dados.zap.replace(/\D/g, '');

  const query = `INSERT INTO interessados(nome, empresa, cnpj, cargo, email, zap, agenda, hora)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8)`;

  const values = [
    dados.nome,
    dados.empresa,
    cnpjFormat,
    dados.cargo,
    dados.email,
    zapFormat,
    dados.agenda,
    dados.dataHora
  ]

try {
    const result = await pool.query(query, values);
    return res.json({status: "Dados enviados com sucesso!"})
} catch (erro) {
    return res.json({erro: "Problemas com o servidor"})
}
}
);

// REQUISIÇÃO PARA TABELA DE COMPRA
app.post('/compra', async function(req, res) {
  const dados = req.body
  let cnpjFormat = dados.cnpj2.replace(/\D/g, '');
  let zapFormat = dados.zap2.replace(/\D/g, '');

  const query = `INSERT INTO compradores(nome, empresa, cnpj, cargo, email, zap, proposta, hora)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8)`;

  const values = [
    dados.nome2,
    dados.empresa2,
    cnpjFormat,
    dados.cargo2,
    dados.email2,
    zapFormat,
    dados.proposta,
    dados.dataHora
  ]

try {
    const result = await pool.query(query, values);
    return res.json({status: "Dados enviados com sucesso!"})
} catch (erro) {
    return res.json({erro: "Problemas com o servidor"})
}
}
);

// REQUISIÇÃO DE UTMS
app.post('/utms', async function(req, res) {
  const dados = req.body
  
  const query = `INSERT INTO utms(utm_source, utm_medium, utm_campaign)
VALUES
($1, $2, $3)`;

  const values = [
    dados.utmSource,
    dados.utmMedium,
    dados.utmCampaign
  ]

try {
    const result = await pool.query(query, values);
    return res.json({status: "Dados enviados com sucesso!"})
} catch (erro) {
    return res.json({erro: "Problemas com o servidor"})
}
}
);

app.get('/contagem', async function(req, res) {
    const query = `SELECT utm_source AS plataformas, COUNT(*) AS acessos FROM utms
GROUP BY plataformas
ORDER BY acessos DESC`;

    try {
      const result = await pool.query(query);
      return res.json(result.rows);
    } catch (erro) {
      return res.json({erro: "Problemas com o servidor"})
    }
}

);
