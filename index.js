const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // sua senha do MySQL
  database: 'prisma'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

// Rota para cadastro
app.post('/cadastro', (req, res) => {
  let { nome, idade, nascimento, celular, email, senha } = req.body;

  email = email.trim().toLowerCase();
  senha = senha.trim();

  const sql = 'INSERT INTO usuarios (nome, idade, nascimento, celular, email, senha) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nome, idade, nascimento, celular, email, senha], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
      return res.status(500).json({ erro: 'Erro ao cadastrar' });
    }
    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

// Rota para login
app.post('/login', (req, res) => {
  let { email, senha } = req.body;

  email = email.trim().toLowerCase();
  senha = senha.trim();

  console.log('Tentativa de login:', { email, senha });

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(sql, [email, senha], (err, results) => {
    if (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ erro: 'Erro no login' });
    }

    console.log('Resultados da query:', results);

    if (results.length > 0) {
      res.json({ sucesso: true, usuario: results[0] });
    } else {
      res.status(401).json({ erro: 'Email ou senha inválidos' });
    }
  });
});

// Atualizar perfil
app.put('/perfil/:id', (req, res) => {
  const id = req.params.id;
  const { nome, nascimento, email, pronomes, apresentacao, cidade, interesses } = req.body;

  const sql = `UPDATE usuarios SET nome = ?, nascimento = ?, email = ?, pronomes = ?, apresentacao = ?, cidade = ?, interesses = ? WHERE id = ?`;

  db.query(sql, [nome, nascimento, email, pronomes, apresentacao, cidade, interesses, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar perfil:', err);
      return res.status(500).json({ erro: 'Erro ao atualizar perfil' });
    }

    const sqlSelect = 'SELECT * FROM usuarios WHERE id = ?';
    db.query(sqlSelect, [id], (err2, results) => {
      if (err2) {
        console.error('Erro ao buscar perfil atualizado:', err2);
        return res.status(500).json({ erro: 'Erro ao buscar perfil atualizado' });
      }
      res.json({ mensagem: 'Perfil atualizado com sucesso!', usuarioAtualizado: results[0] });
    });
  });
});

// Registrar denúncia
app.post('/denuncias', (req, res) => {
  let { tipo, descricao, anonimo, local, apoio, data, vitima, id_usuario } = req.body;

  // Corrigir o valor de anonimo para boolean
  anonimo = (typeof anonimo === 'string' && anonimo.toLowerCase() === 'sim') ? 1 : 0;

  const sql = `INSERT INTO denuncias (tipo, descricao, anonimo, local, apoio, data_ocorrencia, vitima, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [tipo, descricao, anonimo, local, apoio, data, vitima, id_usuario], (err, result) => {
    if (err) {
      console.error('Erro ao salvar denúncia:', err);
      return res.status(500).json({ mensagem: 'Erro ao salvar denúncia' });
    }
    res.json({ mensagem: 'Denúncia salva com sucesso!' });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

// Rota para buscar todas as denúncias de um usuário específico
app.get('/denuncias/usuario/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;

  const sql = 'SELECT * FROM denuncias WHERE id_usuario = ? ORDER BY data_envio DESC';

  db.query(sql, [id_usuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar denúncias:', err);
      return res.status(500).json({ erro: 'Erro ao buscar denúncias' });
    }

    res.json(results);
  });
});
