CREATE DATABASE IF NOT EXISTS prisma;
USE prisma;

-- Tabela de usuários (login, cadastro, perfil)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade INT,
  nascimento DATE,
  celular VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255),
  pronomes VARCHAR(200),
  apresentacao TEXT,
  cidade VARCHAR(200),
  interesses TEXT
);

-- Ajustar autenticação do usuário root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;

-- Tabela de denúncias
CREATE TABLE IF NOT EXISTS denuncias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  anonimo BOOLEAN,
  local TEXT NOT NULL,
  apoio VARCHAR(100),
  data_ocorrencia DATE NOT NULL,
  vitima TEXT,
  id_usuario INT,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);




