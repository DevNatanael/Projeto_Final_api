import OpenAI from "openai";
import fs from "fs";
import sharp from "sharp"; // certifique-se de instalar o sharp via npm

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Obtém a chave do .env
});

export async function processImage(imagePath) {
  // Lê o buffer original da imagem
  const imageBuffer = fs.readFileSync(imagePath);

  // Redimensiona e (opcionalmente) comprime a imagem
  const resizedBuffer = await sharp(imageBuffer)
    .resize({ width: 800, withoutEnlargement: true })
    .toBuffer();

  // Construindo o prompt conforme o exemplo
  const prompt = `
De acordo com as imagens enviadas, que são imagens de um cardápio, você encontrará várias seções importantes: categorias, produtos, descrições, valores, complementos, tipos de complemento, promoções, opções, adicionais e acompanhamentos.

1. Categorias: São classificações de produtos semelhantes. Algumas categorias comuns incluem: Pizzas, Bebidas, Sobremesas, Açaí, Lanches, Burguers, Pasteis, e Doces.

2. Produtos: São itens específicos dentro de cada categoria. Cada produto tem um nome e geralmente uma descrição detalhando seus componentes e o valor do produto. Sempre que tiver tamanhos eles devem ser tratados como produtos. por exemplo, Pizza P(Pequena), Pizza M(Média), Pizza G(Grande), 35cm, 45cm, 65cm.

3. Descrições: São textos que fornecem detalhes adicionais sobre um produto, complemento ou opção. A descrição pode incluir informações sobre os ingredientes, tamanho ou outros detalhes relevantes.

4. Valores: Referem-se ao custo em dinheiro associado a um produto, complemento ou opção. Se um valor não estiver explícito na imagem, ele deve ser considerado como 0.

5. Complementos: Referem-se a itens adicionais que podem ser escolhidos para acompanhar ou personalizar o produto principal. Os complementos podem ser denominados como: Adicionais, Acompanhamentos, Complementos ou Acréscimos. Cada complemento deve ser sempre associado diretamente a todos os produtos correspondentes, aparecendo logo após o outro.

6. Promoções: Referem-se aos itens promocionais do cardápio. Quando há promoções, aparece no cardápio um valor com um traço no meio e um valor sem esse traço, onde o valor com traço se torna o valor e o sem traço o valor promocional (promotion_value).

7. Tipos de complementos: Referem-se aos tipos de todos os complementos. Os tipos podem ser "Apenas uma opcao", "Mais de uma opcao sem repeticao" ou "Mais de uma opcao com repeticao". Além disso, também devem ser informados a "QTDE MINIMA" e "QTDE MAXIMA", que podem ser "1" ou "2".

8. Opções: São diferentes escolhas disponíveis para cada complemento, podendo vir acompanhadas de descrições e valores. As opções devem estar associadas a todos os produtos de forma semelhante aos complementos.

Exemplos Específicos:

Cardápio de Pizza:
- Categoria: "Pizzas"
- Produto: "Pizza 2 Sabores"
- Complemento: "Escolha o Sabor"
- Opções: Lista de todos os sabores disponíveis, cada um com sua descrição e valor.
- Observação: Sempre que for cardápio de pizza, a categoria deve ser "Pizzas", o produto "Pizza 2 Sabores", o complemento "Escolha o Sabor" e os sabores devem ser listados como opções. Se houver tamanhos, estes devem ser tratados como produtos (ex.: Pizza P, Pizza M, Pizza G, 35cm, 45cm, 65cm).

Cardápio de Açaí:
- Categoria: "Açaís"
- Produtos: Tamanhos dos açaís
- Complementos: Podem incluir "Acompanhamentos", "Caldas", "Toppings" e "Adicionais"
- Opções: Todos os itens disponíveis nos complementos, cada um com descrição e valor.

Cardápio de Bolos:
- Categoria: "Bolos"
- Produtos: Tamanhos dos bolos com descrição e valor
- Complementos: Podem incluir "Recheios", "Massas", "Decoração" e "Acompanhamentos"
- Opções: Todos os itens disponíveis nos complementos, cada um com descrição e valor.

Cardápio de Sushi:
- Categoria: Podem ser "Hossomaki", "Uramakis", "Hot Rolls", "Temakis" ou "Niguiri"
- Produtos: Diferentes sabores de sushi
- Complementos: "Escolha as peças"
- Opções: Podem incluir todos os sabores de sushi

Cardápio de Pastéis:
- Categoria: "Pastéis"
- Produto: "Pastel Salgado" ou "Pastel Doce"
- Complemento: "Escolha o sabor"
- Opções: Lista de sabores disponíveis

Cardápio de Churrasco:
- Categoria: "Churrascos"
- Produto: "Picanha"
- Complemento: "Escolha o ponto da carne"
- Opções: "Bem passado", "Mal passado" e "Ao ponto"

Instruções para Resposta:
- Especificação: Sempre especifique o que cada item representa (categoria, produto, complemento, opção, descrição ou valor).
- Valores: Se um valor não estiver explícito, considere-o como 0.
- Formato de Resposta: Forneça a resposta sempre em formato JSON sem formatação.
- Ordem de resposta: Siga a ordem dos produtos da esquerda para a direita.
- Para refrigerantes, sucos e drinks, os sabores devem ficar como complementos e as opções devem ser os respectivos sabores.
- Se aparecerem as palavras "Adicionais", "Acompanhamentos", "Complementos" ou "Acréscimos", trate-os como complementos dos produtos.
- Associação de Complementos: Cada produto deve ter seus complementos diretamente associados, aparecendo logo após o produto correspondente.
- Ordene as informações conforme a estrutura natural do cardápio.
- Ajuste a ortografia das palavras, mantendo o sentido, e sempre que houver "ou" nas descrições, liste as opções de escolha nos complementos.
`;

  // Cria um objeto de imagem, semelhante ao exemplo, com a imagem convertida para base64
  const imageUrl = {
    type: "image_url",
    image_url: {
      url: "data:image/png;base64," + resizedBuffer.toString("base64"),
    },
  };

  // Envia o prompt e a imagem como parte da mensagem do usuário
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [prompt, imageUrl],
      },
    ],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  console.log("Resposta da OpenAI recebida.");

  return response.choices[0].message.content;
}

/*
const aaa = `[
    {
        "title": "Cardapio de pizzas",
        "Description": "pizzas boas",
        "category_name": "Pizzas",
        "products": [
            {
                "product_name": "Pizzas 2 sabores",
                "description": "Escolha 2 sabores",
                "value": 50,
                "promotion_value": 45,
                "complements": [
                    {
                        "complement_name": "Escolha o sabor",
                        "complement_type": "Mais de uma opcao sem repetição",
                        "qtd_minima": "1",
                        "maxima": "2",
                        "options": [
                            {
                                "option_name": "Calabresa",
                                "value": 0
                            },
                            {
                                "option_name": "Mussarela",
                                "value": 0
                            },
                            {
                                "option_name": "Portuguesa",
                                "value": 5
                            }
                        ]
                    }
                ]
            }
        ]
    }
]`;
*/
