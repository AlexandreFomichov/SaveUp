/**
 * SERVIDOR BACKEND SaveUp - Node.js + Express
 * Conecta à base de dados MySQL e fornece endpoints de API
 */

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Iniciando SaveUp Server...');
console.log('📡 Conectando à base de dados...');
console.log('  Host:', process.env.DB_HOST || 'localhost');
console.log('  User:', process.env.DB_USER || 'root');
console.log('  Database:', process.env.DB_NAME || 'saveup');
console.log('');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ charset: 'utf-8' }));

// Garantir UTF-8 em todas as respostas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Configuração do banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saveup',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Inicializar tabelas se não existirem
const initializeTables = async () => {
  try {
    const connection = await pool.getConnection();

    // Definir charset da conexão
    await connection.execute('SET NAMES utf8mb4');
    await connection.execute('SET CHARACTER SET utf8mb4');

    // Criar tabela de categorias de rendimentos se não existir
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sauveup_categorias_rendimentos (
        id              INT(11)         NOT NULL AUTO_INCREMENT,
        nome            VARCHAR(100)    NOT NULL,
        PRIMARY KEY (id)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // Criar tabela rendimentos extras se não existir
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sauveup_rendimentos_extra (
        id              INT(11)         NOT NULL AUTO_INCREMENT,
        utilizador_id   INT(11)         NOT NULL,
        categoria_id    INT(11)         DEFAULT NULL,
        origem          VARCHAR(100)    NOT NULL,
        valor           DECIMAL(10,2)   NOT NULL,
        data            DATE            NOT NULL,
        data_registo    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (utilizador_id) REFERENCES sauveup_utilizadores(id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id)  REFERENCES sauveup_categorias_rendimentos(id) ON DELETE SET NULL
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    // Adicionar coluna origem se a tabela já existir mas estiver com esquema antigo
    try {
      await connection.execute(
        'ALTER TABLE sauveup_rendimentos_extra ADD COLUMN IF NOT EXISTS origem VARCHAR(100) NOT NULL AFTER categoria_id'
      );
    } catch (alterError) {
      if (alterError.code !== 'ER_DUP_FIELDNAME') {
        throw alterError;
      }
    }

    connection.release();
    console.log('✅ Tabelas inicializadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error);
  }
};

// Converter tabelas existentes para UTF-8
const convertTablesToUtf8 = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Definir charset da conexão
    await connection.execute('SET NAMES utf8mb4');
    
    // Converter banco de dados
    await connection.query('ALTER DATABASE `saveup` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    
    // Converter todas as tabelas existentes
    const [tables] = await connection.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        await connection.query(
          `ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        console.log(`✅ Tabela ${tableName} convertida para UTF-8`);
      } catch (e) {
        console.warn(`⚠️ Não foi possível converter ${tableName}:`, e.message);
      }
    }
    
    connection.release();
  } catch (error) {
    console.warn('⚠️ Aviso ao converter tabelas:', error.message);
  }
};

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_aqui', (err, user) => {
    if (err) {
      return res.status(401).json({ error: true, message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ==================== INICIALIZAR SERVIDOR ====================

// Função principal para inicializar tudo
const startServer = async () => {
  await initializeTables();
  await convertTablesToUtf8();

  // Definir rotas após inicialização das tabelas

  // ==================== AUTENTICAÇÃO ====================

  /**
   * POST /api/auth/login
   */
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: true, message: 'Email e password requeridos' });
      }

      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM sauveup_utilizadores WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        connection.release();
        return res.status(401).json({ error: true, message: 'Credenciais inválidas' });
      }

      const user = rows[0];
      const passwordMatch = await bcryptjs.compare(password, user.palavra_passe);

      if (!passwordMatch) {
        connection.release();
        return res.status(401).json({ error: true, message: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'seu_segredo_aqui',
        { expiresIn: '24h' }
      );

      connection.release();

      res.json({
        token,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          data_criacao: user.data_criacao,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro no servidor' });
    }
  });

  /**
   * POST /api/auth/register
   */
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { nome, email, password } = req.body;

      // Logging para diagnóstico (não logar passwords em produção)
      console.log('🔔 Register attempt:', { nome, email });

      if (!nome || !email || !password) {
        return res.status(400).json({ error: true, message: 'Todos os campos são requeridos' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const connection = await pool.getConnection();

      try {
        await connection.execute(
          'INSERT INTO sauveup_utilizadores (nome, email, palavra_passe, data_criacao) VALUES (?, ?, ?, NOW())',
          [nome, email, hashedPassword]
        );

        console.log('✅ Inserted user into database for email:', email);

        const [rows] = await connection.execute(
          'SELECT * FROM sauveup_utilizadores WHERE email = ?',
          [email]
        );

        const newUser = rows[0];
        connection.release();

        res.status(201).json({
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email,
          data_criacao: newUser.data_criacao,
        });
      } catch (dbError) {
        connection.release();
        if (dbError.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: true, message: 'Email já registado' });
        }
        throw dbError;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro no servidor' });
    }
  });

  // ==================== DESPESAS ====================

  /**
   * GET /api/despesas/:userId
   */
  app.get('/api/despesas/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate, categoriaId } = req.query;

      let query = `
        SELECT 
          d.id,
          d.utilizador_id,
          d.categoria_id,
          c.nome as categoria_nome,
          d.descricao,
          d.valor,
          d.data,
          d.data_registo
        FROM sauveup_despesas d
        LEFT JOIN sauveup_categorias c ON d.categoria_id = c.id
        WHERE d.utilizador_id = ?
      `;
      const params = [userId];

      if (startDate) {
        query += ' AND d.data >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND d.data <= ?';
        params.push(endDate);
      }

      if (categoriaId) {
        query += ' AND d.categoria_id = ?';
        params.push(categoriaId);
      }

      query += ' ORDER BY d.data DESC';

      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, params);
      connection.release();

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao obter despesas' });
    }
  });

  /**
   * POST /api/despesas
   */
  app.post('/api/despesas', authenticateToken, async (req, res) => {
    try {
      const { utilizador_id, categoria_id, descricao, valor, data } = req.body;

      if (!utilizador_id || !categoria_id || !descricao || !valor || !data) {
        return res.status(400).json({ error: true, message: 'Dados incompletos' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sauveup_despesas (utilizador_id, categoria_id, descricao, valor, data, data_registo) VALUES (?, ?, ?, ?, ?, NOW())',
        [utilizador_id, categoria_id, descricao, valor, data]
      );

      const [rows] = await connection.execute(
        `SELECT 
          d.*,
          c.nome as categoria_nome
        FROM sauveup_despesas d
        LEFT JOIN sauveup_categorias c ON d.categoria_id = c.id
        WHERE d.id = ?`,
        [result.insertId]
      );

      connection.release();

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao criar despesa' });
    }
  });

  /**
   * PUT /api/despesas/:id
   */
  app.put('/api/despesas/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { descricao, valor, categoria_id, data } = req.body;

      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE sauveup_despesas SET descricao = ?, valor = ?, categoria_id = ?, data = ? WHERE id = ?',
        [descricao, valor, categoria_id, data, id]
      );
      connection.release();

      res.json({ success: true, message: 'Despesa atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao atualizar despesa' });
    }
  });

  /**
   * DELETE /api/despesas/:id
   */
  app.delete('/api/despesas/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM sauveup_despesas WHERE id = ?', [id]);
      connection.release();

      res.json({ success: true, message: 'Despesa eliminada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao eliminar despesa' });
    }
  });

  // ==================== CATEGORIAS ====================

  /**
   * GET /api/categorias (público - não requer autenticação)
   */
  app.get('/api/categorias', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM sauveup_categorias');
      connection.release();

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao obter categorias' });
    }
  });

  /**
   * POST /api/categorias
   */
  app.post('/api/categorias', authenticateToken, async (req, res) => {
    try {
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ error: true, message: 'Nome da categoria requerido' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sauveup_categorias (nome) VALUES (?)',
        [nome]
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        nome,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao criar categoria' });
    }
  });

  // ==================== CATEGORIAS DE RENDIMENTOS ====================

  app.get('/api/categorias_rendimentos', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM sauveup_categorias_rendimentos');
      connection.release();

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao obter categorias de rendimentos' });
    }
  });

  app.post('/api/categorias_rendimentos', authenticateToken, async (req, res) => {
    try {
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ error: true, message: 'Nome da categoria de rendimento requerido' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sauveup_categorias_rendimentos (nome) VALUES (?)',
        [nome]
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        nome,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao criar categoria de rendimento' });
    }
  });

  // ==================== ORÇAMENTOS ====================

  /**
   * GET /api/orcamentos/:userId
   */
  app.get('/api/orcamentos/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { mes, ano } = req.query;

      let query = 'SELECT * FROM sauveup_orcamentos WHERE utilizador_id = ?';
      const params = [userId];

      if (mes && ano) {
        query += ' AND mes = ? AND ano = ?';
        params.push(mes, ano);
      }

      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, params);
      connection.release();

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao obter orçamento' });
    }
  });

  /**
   * POST /api/orcamentos
   */
  app.post('/api/orcamentos', authenticateToken, async (req, res) => {
    try {
      const { utilizador_id, valor_mensal, mes, ano } = req.body;

      if (!utilizador_id || !valor_mensal || !mes || !ano) {
        return res.status(400).json({ error: true, message: 'Dados incompletos' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sauveup_orcamentos (utilizador_id, valor_mensal, mes, ano) VALUES (?, ?, ?, ?)',
        [utilizador_id, valor_mensal, mes, ano]
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        utilizador_id,
        valor_mensal,
        mes,
        ano,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao criar orçamento' });
    }
  });

  /**
   * PUT /api/orcamentos/:id
   */
  app.put('/api/orcamentos/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { valor_mensal } = req.body;

      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE sauveup_orcamentos SET valor_mensal = ? WHERE id = ?',
        [valor_mensal, id]
      );
      connection.release();

      res.json({ success: true, message: 'Orçamento atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao atualizar orçamento' });
    }
  });

  // ==================== RENDIMENTOS EXTRA ====================

  app.get('/api/rendimentos_extra/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      let query = `
        SELECT 
          id,
          utilizador_id,
          categoria_id,
          origem,
          valor,
          data,
          data_registo
        FROM sauveup_rendimentos_extra
        WHERE utilizador_id = ?
      `;
      const params = [userId];

      if (startDate) {
        query += ' AND data >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND data <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY data DESC';

      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, params);
      connection.release();

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao obter rendimentos extras' });
    }
  });

  app.post('/api/rendimentos_extra', authenticateToken, async (req, res) => {
    try {
      const { utilizador_id, categoria_id, origem, valor, data } = req.body;

      if (!utilizador_id || !origem || !valor || !data) {
        return res.status(400).json({ error: true, message: 'Dados incompletos' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sauveup_rendimentos_extra (utilizador_id, categoria_id, origem, valor, data) VALUES (?, ?, ?, ?, ?)',
        [utilizador_id, categoria_id || null, origem, valor, data]
      );

      const [rows] = await connection.execute(
        'SELECT * FROM sauveup_rendimentos_extra WHERE id = ?',
        [result.insertId]
      );

      connection.release();

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao criar rendimento extra' });
    }
  });

  app.put('/api/rendimentos_extra/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { categoria_id, origem, valor, data } = req.body;

      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE sauveup_rendimentos_extra SET categoria_id = ?, origem = ?, valor = ?, data = ? WHERE id = ?',
        [categoria_id || null, origem, valor, data, id]
      );
      connection.release();

      res.json({ success: true, message: 'Rendimento extra atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao atualizar rendimento extra' });
    }
  });

  app.delete('/api/rendimentos_extra/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM sauveup_rendimentos_extra WHERE id = ?', [id]);
      connection.release();

      res.json({ success: true, message: 'Rendimento extra eliminado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao eliminar rendimento extra' });
    }
  });

  // ==================== RECEITAS ====================

  /**
   * GET /api/receitas/:userId
   */
  app.get('/api/receitas/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      let query = `
        SELECT 
          id,
          utilizador_id,
          categoria_id,
          origem,
          valor,
          data,
          data_registo
        FROM sauveup_rendimentos_extra
        WHERE utilizador_id = ?
      `;
      const params = [userId];

      if (startDate) {
        query += ' AND data >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND data <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY data DESC';

      const connection = await pool.getConnection();
      const [rows] = await connection.execute(query, params);
      connection.release();

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao obter receitas' });
    }
  });

  /**
   * POST /api/receitas
   */
  app.post('/api/receitas', authenticateToken, async (req, res) => {
    try {
      const { utilizador_id, categoria_id, origem, valor, data } = req.body;

      if (!utilizador_id || !origem || !valor || !data) {
        return res.status(400).json({ error: true, message: 'Dados incompletos' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO sauveup_rendimentos_extra (utilizador_id, categoria_id, origem, valor, data) VALUES (?, ?, ?, ?, ?)',
        [utilizador_id, categoria_id || null, origem, valor, data]
      );

      const [rows] = await connection.execute(
        'SELECT * FROM sauveup_rendimentos_extra WHERE id = ?',
        [result.insertId]
      );

      connection.release();

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao criar receita' });
    }
  });

  /**
   * PUT /api/receitas/:id
   */
  app.put('/api/receitas/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { categoria_id, origem, valor, data } = req.body;

      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE sauveup_rendimentos_extra SET categoria_id = ?, origem = ?, valor = ?, data = ? WHERE id = ?',
        [categoria_id || null, origem, valor, data, id]
      );
      connection.release();

      res.json({ success: true, message: 'Receita atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao atualizar receita' });
    }
  });

  /**
   * DELETE /api/receitas/:id
   */
  app.delete('/api/receitas/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;

      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM sauveup_rendimentos_extra WHERE id = ?', [id]);
      connection.release();

      res.json({ success: true, message: 'Receita eliminada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: 'Erro ao eliminar receita' });
    }
  });

  // Iniciar servidor
  const server = app.listen(port, () => {
    console.log(`✅ SaveUp API rodando em http://localhost:${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Porta ${port} já está em uso. Use outra porta ou execute \`npm run server:clean\` antes de iniciar.`);
      process.exit(1);
    }
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  });
};

// Iniciar tudo
startServer();
