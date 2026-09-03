/**
 * main.js - Portfólio Profissional
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicialização dos Ícones Lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2. Dicionário de Tradução PT / EN
  const dictionary = {
    pt: {
      // Navegação
      navSobre: "Sobre Mim",
      navProjetos: "Projetos",
      navExperiencias: "Experiências",
      navContato: "Contato",

      // Hero / Sobre Mim
      heroTitle: 'Olá, eu sou <span class="highlight">Pedro Nogueira</span>',
      heroSubtitle: "Desenvolvedor de Software",
      heroBio:
        "Estudante de Engenharia de Software na PUC Minas. Atualmente estou no quarto período do curso e graduado como Técnico em Administração pelo IFMG, busco unir a precisão do desenvolvimento de sistemas à visão estratégica de negócios.",
      btnContact: "Fale Comigo",
      btnProjects: "Ver Projetos",

      // Projetos
      titleProjects: "Projetos",
      proj1Date: "2025 - 2º Período da faculdade",
      proj1Title: "RHFusion (RHSoft)",
      proj1Desc:
        "Aplicação web desenvolvida em equipe para otimização de processos corporativos e gestão de Recursos Humanos.",
      proj2Date: "2026 - 3º Período da faculdade",
      proj2Title: "FrotaSync (TI: Trabalho Interdisciplinar III)",
      proj2Desc:
        "O projeto FrotaSync visa modernizar e centralizar o gerenciamento de manutenção de veículos administrado por empresas intermediárias entre prefeituras e oficinas mecânicas.",

      // Experiências
      titleExp: "Experiências",
      exp1Title: "Análise e Desenvolvimento de Sistemas",
      exp1Period: "Abr 2025 - Presente",
      exp1Desc: "Resolução de problemas e Desenvolvimento de software.",
      exp2Title: "Técnico em informática",
      exp2Period: "Fev 2022 - Jan 2025",
      exp2Desc:
        "Desenvolvimento de Liderança, Gestão de Projeto, Gestão Operacional, Gestão de Vendas, Resolução de Problemas e Pesquisa de Mercado.",
      exp3Title: "Graduando em Engenharia de Software",
      exp3Period: "Fev 2025 - Presente",
      exp3Desc:
        "Desenvolvimento de Software, Liderança de Equipe, Gestão de Equipe e Gestão de Relacionamento com o Cliente.",

      // Contato
      titleContact: "Contato",
      contactHeadline: "Vamos conversar!",
      contactSub: "Entre em contato através dos canais abaixo:",
      whatsappLabel: "WhatsApp",
      githubPersonalLabel: "GitHub Pessoal",
      githubAcademicLabel: "GitHub Acadêmico",

      // Botão e Modal de Acesso
      btnRequestAccess: "Solicitar Acesso Especial",
      modalTitle: "Solicitar Acesso Especial",
      modalSub: "Preencha os dados abaixo e entraremos em contato para liberar seu acesso personalizado.",

      // Rodapé
      footerText:
        "© 2026 Caio César Falinacio dos Santos. Todos os direitos reservados. | Lab01S01 - PUC Minas",
    },

    en: {
      // Navigation
      navSobre: "About Me",
      navProjetos: "Projects",
      navExperiencias: "Experience",
      navContato: "Contact",

      // Hero / About Me
      heroTitle: 'Hello, I am <span class="highlight">Caio César Falinacio dos Santos</span>',
      heroSubtitle: "Software Developer",
      heroBio:
        "Software Engineering student at PUC Minas. Currently in my fourth semester and graduated as a Business Administration Technician from IFMG, I seek to combine the precision of systems development with a strategic business vision.",
      btnContact: "Get in Touch",
      btnProjects: "View Projects",

      // Projects
      titleProjects: "Projects",
      proj1Date: "2025 - 2nd Semester of college",
      proj1Title: "RHFusion (RHSoft)",
      proj1Desc:
        "Web application developed as a team to optimize corporate processes and Human Resources management.",
      proj2Date: "2026 - 3rd Semester of college",
      proj2Title: "FrotaSync (Interdisciplinary Work III)",
      proj2Desc:
        "The FrotaSync project aims to modernize and centralize vehicle maintenance management handled by intermediary companies between city halls and mechanical workshops.",

      // Experience
      titleExp: "Experience",
      exp1Title: "Systems Analysis and Development",
      exp1Period: "Apr 2025 - Present",
      exp1Desc: "Problem-solving and Software Development.",
      exp2Title: "Business Administration Technician",
      exp2Period: "Feb 2022 - Jan 2025",
      exp2Desc:
        "Leadership Development, Project Management, Operational Management, Sales Management, Problem-Solving and Market Research.",
      exp3Title: "Undergraduate in Software Engineering",
      exp3Period: "Feb 2025 - Present",
      exp3Desc:
        "Software Development, Team Leadership, Team Management and Customer Relationship Management.",

      // Contact
      titleContact: "Contact",
      contactHeadline: "Let's talk!",
      contactSub: "Feel free to reach out through any of the channels below:",
      whatsappLabel: "WhatsApp",
      githubPersonalLabel: "Personal GitHub",
      githubAcademicLabel: "Academic GitHub",

      // Access Button & Modal
      btnRequestAccess: "Request Special Access",
      modalTitle: "Request Special Access",
      modalSub: "Fill in your details below and we'll get back to you with a personalized access link.",

      // Footer
      footerText:
        "© 2026 Caio César Falinacio dos Santos. All rights reserved. | Lab01S01 - PUC Minas",
    },
  };

  // 3. Função auxiliar e de Alternância de Idioma
  const btnPt = document.getElementById("lang-pt");
  const btnEn = document.getElementById("lang-en");

  function get(id) {
    return document.getElementById(id);
  }

  function changeLanguage(lang) {
    const t = dictionary[lang];
    if (!t) return;

    // Atualizar atributo lang do HTML
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

    // Botões de idioma
    btnPt.classList.toggle("active", lang === "pt");
    btnEn.classList.toggle("active", lang === "en");

    // --- Navegação ---
    const navLinks = document.querySelectorAll(".nav-menu a");
    if (navLinks.length >= 4) {
      navLinks[0].textContent = t.navSobre;
      navLinks[1].textContent = t.navProjetos;
      navLinks[2].textContent = t.navExperiencias;
      navLinks[3].textContent = t.navContato;
    }

    // --- Hero / Sobre Mim ---
    const heroH1 = document.querySelector(".hero-text h1");
    if (heroH1) heroH1.innerHTML = t.heroTitle;
    if (get("hero-subtitle")) get("hero-subtitle").textContent = t.heroSubtitle;
    if (get("bio-text")) get("bio-text").textContent = t.heroBio;
    if (get("btn-contact")) get("btn-contact").textContent = t.btnContact;
    if (get("btn-projects")) get("btn-projects").textContent = t.btnProjects;

    // --- Projetos ---
    if (get("title-projects")) get("title-projects").textContent = t.titleProjects;
    if (get("proj1-date")) get("proj1-date").textContent = t.proj1Date;
    if (get("proj1-title")) get("proj1-title").textContent = t.proj1Title;
    if (get("proj1-desc")) get("proj1-desc").textContent = t.proj1Desc;
    if (get("proj2-date")) get("proj2-date").textContent = t.proj2Date;
    if (get("proj2-title")) get("proj2-title").textContent = t.proj2Title;
    if (get("proj2-desc")) get("proj2-desc").textContent = t.proj2Desc;

    // --- Experiências ---
    if (get("title-exp")) get("title-exp").textContent = t.titleExp;
    if (get("exp1-title")) get("exp1-title").textContent = t.exp1Title;
    if (get("exp1-period")) get("exp1-period").textContent = t.exp1Period;
    if (get("exp1-desc")) get("exp1-desc").textContent = t.exp1Desc;
    if (get("exp2-title")) get("exp2-title").textContent = t.exp2Title;
    if (get("exp2-period")) get("exp2-period").textContent = t.exp2Period;
    if (get("exp2-desc")) get("exp2-desc").textContent = t.exp2Desc;
    if (get("exp3-title")) get("exp3-title").textContent = t.exp3Title;
    if (get("exp3-period")) get("exp3-period").textContent = t.exp3Period;
    if (get("exp3-desc")) get("exp3-desc").textContent = t.exp3Desc;

    // --- Contato ---
    if (get("title-contact")) get("title-contact").textContent = t.titleContact;
    if (get("contact-headline")) get("contact-headline").textContent = t.contactHeadline;
    if (get("contact-sub")) get("contact-sub").textContent = t.contactSub;
    if (get("whatsapp-label")) get("whatsapp-label").textContent = t.whatsappLabel;
    if (get("github-personal-label")) get("github-personal-label").textContent = t.githubPersonalLabel;
    if (get("github-academic-label")) get("github-academic-label").textContent = t.githubAcademicLabel;

    // --- Botão e Modal de Acesso ---
    if (get("btn-request-text")) get("btn-request-text").textContent = t.btnRequestAccess;
    if (get("modal-title")) get("modal-title").textContent = t.modalTitle;
    const modalSubEl = document.querySelector(".modal-header p");
    if (modalSubEl) modalSubEl.textContent = t.modalSub;

    // --- Rodapé ---
    if (get("footer-text")) get("footer-text").textContent = t.footerText;
  }

  btnPt.addEventListener("click", () => changeLanguage("pt"));
  btnEn.addEventListener("click", () => changeLanguage("en"));

  // 4. Highlight Dinâmico de Link Ativo durante o Scroll
  const sections = document.querySelectorAll("section[id]");
  const navMenuLinks = document.querySelectorAll(".nav-menu a");

  function highlightNavOnScroll() {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navMenuLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll);

  // 5. Animação Suave de Entrada (Fade-in nas seções)
  const observerOptions = {
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".timeline-item, .card, .contact-wrapper"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    revealObserver.observe(el);
  });
});
