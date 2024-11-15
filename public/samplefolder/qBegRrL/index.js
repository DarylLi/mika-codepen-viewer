document.addEventListener("DOMContentLoaded", function () {
  const paragraphs = document.querySelectorAll(".drop");
  paragraphs.forEach((paragraph) => {
    const firstLetter = paragraph.textContent.trim().charAt(0).toLowerCase();
    paragraph.classList.add(firstLetter);
    const imageUrl = `https://assets.codepen.io/11614-${firstLetter}.svg`;
  });
});
