export default {
  order: {
    headersOfTable: {
      None: { require: false, content: false, defValue: "" },
      "№": { require: true, content: "number", defValue: "" },
      Ник: { require: true, content: "string", defValue: "Anonimous" },
      Марка: { require: false, content: "string", defValue: "" },
      "Название вещи": { require: false, content: "string", defValue: "" },
      Ссылка: { require: false, content: "string", defValue: "" },
      Цвет: { require: false, content: "string", defValue: "" },
      Размер: { require: false, content: "string", defValue: "" },
      Цена: { require: true, content: "number", defValue: "0" },
      Количество: { require: true, content: "number", defValue: "1" },
      Вес: { require: false, content: "number", defValue: "" },
      "Категория цен": { require: true, content: "number", defValue: "1" },
      Примечание: { require: false, content: "string", defValue: "" },
      Итого: { require: true, content: "number", defValue: "" },
      Доставка: { require: false, content: "number", defValue: "" }
    },
    depForChangeValueHeaders: ["№", "Ник", "Итого"]
  }
};
