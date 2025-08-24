const path = require('path');
const fs = require('fs');

const express = require('express');
const getUploader = require('../middleware/upload');
const router = express.Router();
const Servico = require('../models/servico');
const Arquivo = require('../models/arquivo');
const servico = require('../models/servico');

// Cria uploader específico para 'servicos'
const uploadServico = getUploader('servicos');

// Rota POST /servico
router.post('/', uploadServico.array('arquivos', 5), async (req, res) => {
  try {
    const {
      salaoId,
      servico,
      titulo,
      preco,
      comissao,
      duracao,
      recorrencia,
      descricao
    } = req.body;

    let errors = []
    let arquivos = []

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
        referenciaId: a.referenciaId,
        model: a.model,
        caminho: a.caminho,
        dataCadastro: a.dataCadastro
      }))
    });

    let jsonServico = JSON.parse(servico)
    const servicoCadastrado = await Servico(jsonServico).save();

    arquivos = arquivos.map(arquivo => ({
      referenciaId: servicoCadastrado._id,
      model: 'Servico',
      caminho: arquivo
    }))

    await Arquivo.insertMany(arquivos)

    res.json({ servico: servicoCadastrado, arquivos})

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota PUT /servico
router.put('/:id', uploadServico.array('arquivos', 5), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      salaoId,
      titulo,
      preco,
      comissao,
      duracao,
      recorrencia,
      descricao
    } = req.body;

    // Atualiza serviço existente
    const servicoAtualizado = await Servico.findByIdAndUpdate(
      id,
      {
        salaoId,
        titulo,
        preco,
        comissao,
        duracao,
        recorrencia,
        descricao
      },
      { new: true } // retorna o documento atualizado
    );

    if (!servicoAtualizado) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Salva arquivos novos (se enviados)
    let arquivosSalvos = [];
    if (req.files && req.files.length > 0) {
      arquivosSalvos = await Promise.all(
        req.files.map(f =>
          Arquivo.create({
            referenciaId: servicoAtualizado._id,
            model: 'Servico',
            caminho: f.filename
          })
        )
      );
    }

    // Busca todos os arquivos associados ao serviço
    const todosArquivos = await Arquivo.find({ referenciaId: servicoAtualizado._id });

    res.status(200).json({
      message: 'Serviço atualizado com sucesso!',
      servico: servicoAtualizado,
      arquivos: todosArquivos.map(a => ({
        _id: a._id,
        referenciaId: a.referenciaId,
        model: a.model,
        caminho: a.caminho,
        dataCadastro: a.dataCadastro
      }))
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota DELETE /servico/arquivo
router.delete('/arquivo/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o arquivo no banco
    const arquivo = await Arquivo.findById(id);
    if (!arquivo) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    // Remove o registro do banco
    await Arquivo.findByIdAndDelete(id);

    // Remove o arquivo físico da pasta uploads
    const filePath = path.join(__dirname, '..', 'uploads', 'servicos', arquivo.caminho);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn(`⚠️ Não foi possível excluir o arquivo físico: ${filePath}`);
      }
    });

    res.json({ message: 'Arquivo excluído com sucesso!' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota DELETE /servico
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const servico = await Servico.findByIdAndUpdate(
      id,
      { status: 'E' },
      { new: true } // retorna o documento atualizado
    );

    if (!servico) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.json({ message: 'Serviço excluído (status = E) com sucesso!', servico });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/salao/:salaoId', async (req, res) => {
  try {
    let servicosSalao = [];
    const servicos = await Servico.find({
      salaoId: req.params.salaoId,
      status: { $ne: 'E'},
    });

    for (let servico of servicos) {
      const arquivos = await Arquivo.find({
        model: 'Servico',
        referenciaId: servico._id,
      });
      servicosSalao.push({ ... servico._doc, arquivos});
    }

    res.json({
      servicos: servicosSalao,
    });

  } catch(err){
    res.json({ error: true, message: err.message})
  }
})

module.exports = router;
