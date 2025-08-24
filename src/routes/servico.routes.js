const express = require('express');
const getUploader = require('../middleware/upload');
const router = express.Router();
const Servico = require('../models/servico');
const Arquivo = require('../models/arquivo');

// Cria uploader específico para 'servicos'
const uploadServico = getUploader('servicos');

// Rota POST /servico
router.post('/', uploadServico.array('arquivos', 5), async (req, res) => {
  try {
    const {
      salaoId,
      titulo,
      preco,
      comissao,
      duracao,
      recorrencia,
      descricao
    } = req.body;

    // Cria novo serviço
    const novoServico = new Servico({
      salaoId,
      titulo,
      preco,
      comissao,
      duracao,
      recorrencia,
      descricao,
      status: 'A'
    });

    await novoServico.save();

    // Salva arquivos no modelo Arquivo, apontando para o serviço
    let arquivosSalvos = [];
    if (req.files && req.files.length > 0) {
      arquivosSalvos = await Promise.all(
        req.files.map(f =>
          Arquivo.create({
            referenciaId: novoServico._id,
            model: 'Servico',
            caminho: f.filename
          })
        )
      );
    }

    // Retorna serviço + arquivos
    res.status(201).json({
      message: 'Serviço criado com sucesso!',
      servico: novoServico,
      arquivos: arquivosSalvos.map(a => ({
        _id: a._id,
        caminho: a.caminho,
        dataCadastro: a.dataCadastro
      }))
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
