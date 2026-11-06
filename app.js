"use strict";

const loadButton = document.getElementById("load-button");
const loadMessage = document.getElementById("load-message");
const posts = document.getElementById("posts");
const form = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const createButton = document.getElementById("create-button");
const createMessage = document.getElementById("create-message");

loadButton.addEventListener("click", async () => {
  loadButton.disabled = true;
  loadMessage.className = "";
  loadMessage.textContent = "Загрузка публикаций…";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    if (!response.ok) {
      throw new Error(`Ошибка HTTP ${response.status}`);
    }
    const data = await response.json();
    posts.replaceChildren();

    for (const post of data) {
      const article = document.createElement("article");
      const title = document.createElement("h3");
      const body = document.createElement("p");
      title.textContent = post.title;
      body.textContent = post.body;
      article.append(title, body);
      posts.append(article);
    }
    loadMessage.className = "success";
    loadMessage.textContent = `Загружено публикаций: ${data.length}`;
  } catch (error) {
    loadMessage.className = "error";
    loadMessage.textContent = `Не удалось загрузить публикации. ${error.message}. Проверьте интернет и повторите попытку.`;
  } finally {
    loadButton.disabled = false;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    createMessage.className = "error";
    createMessage.textContent = "Заполните заголовок и текст. Одних пробелов недостаточно.";
    return;
  }

  createButton.disabled = true;
  createMessage.className = "";
  createMessage.textContent = "Отправка публикации…";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 })
    });
    if (!response.ok) {
      throw new Error(`Ошибка HTTP ${response.status}`);
    }
    const post = await response.json();
    createMessage.className = "success";
    createMessage.textContent = `Публикация «${post.title}» создана. ID: ${post.id}`;
  } catch (error) {
    createMessage.className = "error";
    createMessage.textContent = `Не удалось создать публикацию. ${error.message}. Проверьте интернет и повторите попытку.`;
  } finally {
    createButton.disabled = false;
  }
});
