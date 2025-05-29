import { MenuRepository } from "../repositories/menu.repository.js";
import { processImage } from "../services/openai.service.js";
import fs from "fs";

export const MenuController = {
  // Operações de MenuItem
  async create(req, res) {
    try {
      const item = await MenuRepository.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Erro ao inserir item" });
    }
  },

  async getAll(req, res) {
    try {
      const items = await MenuRepository.getAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar itens" });
    }
  },

  async getById(req, res) {
    try {
      const item = await MenuRepository.getById(parseInt(req.params.id));
      item
        ? res.json(item)
        : res.status(404).json({ error: "Item não encontrado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar item" });
    }
  },

  async update(req, res) {
    try {
      const updatedItem = await MenuRepository.update(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar" });
    }
  },

  async delete(req, res) {
    try {
      await MenuRepository.delete(parseInt(req.params.id));
      res.json({ message: "Item deletado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar" });
    }
  },

  // Operações de Cardápio
  async createCardapio(req, res) {
    try {
      const cardapio = await MenuRepository.createCardapio(req.body);
      res.status(201).json(cardapio);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar cardápio" });
      console.log(error);
    }
  },

  async getCardapios(req, res) {
    try {
      const cardapios = await MenuRepository.getCardapios();
      res.json(cardapios);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cardápios" });
    }
  },

  async getCardapioById(req, res) {
    try {
      const cardapio = await MenuRepository.getCardapioById(
        parseInt(req.params.id)
      );
      cardapio
        ? res.json(cardapio)
        : res.status(404).json({ error: "Cardápio não encontrado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar cardápio" });
    }
  },

  async updateCardapio(req, res) {
    try {
      const updatedCardapio = await MenuRepository.updateCardapio(
        parseInt(req.params.id),
        req.body
      );
      res.json(updatedCardapio);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar cardápio" });
    }
  },

  async deleteCardapio(req, res) {
    try {
      await MenuRepository.deleteCardapio(parseInt(req.params.id));
      res.json({ message: "Cardápio deletado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar cardápio" });
    }
  },

  async getItensByCardapio(req, res) {
    try {
      const itens = await MenuRepository.getByCardapio(
        parseInt(req.params.cardapioId)
      );
      res.json(itens);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar itens do cardápio" });
    }
  },

  // Operação de upload de imagem
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem enviada" });
      }

      const imagePath = req.file.path;
      console.log(`Imagem recebida: ${imagePath}`);

      const responseData = await processImage(imagePath);
      let extractedData = JSON.parse(responseData);

      console.log("Dados extraídos:", extractedData);

      // Já no novo modelo, os dados devem ser um array de objetos com "category_name"
      if (!Array.isArray(extractedData)) {
        extractedData = [extractedData];
      }

      for (const categoria of extractedData) {
        // Cria o cardápio usando a propriedade "category_name"
        const cardapio = await MenuRepository.createCardapio({
          nome: categoria.category_name,
          descricao: "", // Se houver outra propriedade para descrição, ajuste aqui
          ativo: true,
        });

        // Percorre os produtos da categoria
        for (const produto of categoria.products) {
          const menuItem = await MenuRepository.create({
            tipo: "Produto",
            nome: produto.product_name,
            descricao: produto.description || "",
            valor: produto.value || 0,
            valorPromocional: produto.promotion_value || 0,
            tipoComplemento: "",
            qtdMinima: 0,
            qtdMaxima: 0,
            cardapioId: cardapio.id, // Relaciona o item ao cardápio
          });
        }
      }

      fs.unlinkSync(imagePath);
      res.json({ message: "Imagem processada e dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro no processamento da imagem:", error);
      res.status(500).json({ error: "Erro ao processar a imagem" });
    }
  },
};
