// Rolamento dinamico

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Adiciona o evento de clique aos links de navegação
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const sectionId = link.getAttribute("href").substring(1);
    scrollToSection(sectionId);
  });
});

// Adiciona evento de rolagem no botão cadastrar necessidades
const cadastroLink = document.querySelector(".cadastro-link");
cadastroLink.addEventListener("click", () => {
  scrollToSection("cadastro");
});

// Adiciona o evento de clique ao botão de rolagem para o topo
const scrollToTopButton = document.querySelector(".scroll-to-top");
scrollToTopButton.addEventListener("click", () => {
  scrollToSection("home");
});

// Menu hamburguer mobile

function toggleMobileMenu() {
  const navMenu = document.getElementById("navMenu");
  const toggle = document.querySelector(".mobile-toggle");

  navMenu.classList.toggle("active");
  toggle.classList.toggle("open"); /**

 * Fecha o menu mobile
 */
}
