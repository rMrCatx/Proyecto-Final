// JavaScript para el Blog del Politécnico Vicente Aquilino Santos
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const postsGrid = document.getElementById('posts-grid');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pollForm = document.getElementById('poll-form');
    const pollResults = document.getElementById('poll-results');
    
    // Datos de ejemplo para publicaciones
    const posts = [
        {
            id: 1,
            title: "Inauguración del nuevo laboratorio de programación",
            excerpt: "El centro ha inaugurado un moderno laboratorio de programación equipado con computadoras de última generación y software especializado para el desarrollo de aplicaciones web y móviles.",
            category: "noticias",
            date: "2024-05-10",
            author: "Departamento de Informática",
            imageColor: "#8B5CF6"
        },
        {
            id: 2,
            title: "Taller de ebanistería para principiantes",
            excerpt: "Este sábado se realizará un taller gratuito de ebanistería para estudiantes interesados en aprender las técnicas básicas del trabajo con madera.",
            category: "actividades",
            date: "2024-05-08",
            author: "Departamento de Ebanistería",
            imageColor: "#10B981"
        },
        {
            id: 3,
            title: "Aviso importante sobre exámenes finales",
            excerpt: "Se informa a todos los estudiantes que el período de exámenes finales se llevará a cabo del 22 al 30 de mayo. Consulten el calendario oficial.",
            category: "avisos",
            date: "2024-05-05",
            author: "Dirección Académica",
            imageColor: "#EF4444"
        },
        {
            id: 4,
            title: "Estudiantes ganan primer lugar en competencia de redes",
            excerpt: "Nuestros estudiantes del técnico en Redes obtuvieron el primer lugar en la competencia regional de configuración de redes y seguridad informática.",
            category: "logros",
            date: "2024-05-03",
            author: "Departamento de Redes",
            imageColor: "#3B82F6"
        },
        {
            id: 5,
            title: "Charla sobre refrigeración comercial sostenible",
            excerpt: "El próximo jueves tendremos una charla sobre las últimas tendencias en refrigeración comercial sostenible, impartida por expertos del sector.",
            category: "actividades",
            date: "2024-05-01",
            author: "Departamento de Refrigeración",
            imageColor: "#F59E0B"
        }]});