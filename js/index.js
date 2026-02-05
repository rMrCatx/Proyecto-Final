

        // Datos de publicaciones (simulados)
       const posts = [
    {
        id: 1,
        title: "Inauguración del nuevo laboratorio de programación",
        excerpt: "El centro ha inaugurado un moderno laboratorio de programación equipado con computadoras de última generación y software especializado para el desarrollo de aplicaciones web y móviles.",
        category: "noticias",
        date: "10 Mayo 2024",
        author: "Departamento de Informática",
        color: "#8B5CF6",
        likes: 24,
        comments: 8,
        image: "imagenes/laboratorio-programacion.jpg"
    },
    {
        id: 2,
        title: "Taller de ebanistería para principiantes - Inscripciones abiertas",
        excerpt: "Este sábado se realizará un taller gratuito de ebanistería para estudiantes interesados en aprender las técnicas básicas del trabajo con madera. Cupos limitados.",
        category: "actividades",
        date: "8 Mayo 2024",
        author: "Departamento de Ebanistería",
        color: "#10B981",
        likes: 18,
        comments: 5,
        image: "imagenes/taller-ebanisteria.jpg"
    },
    {
        id: 3,
        title: "AVISO IMPORTANTE: Calendario de exámenes finales",
        excerpt: "Se informa a todos los estudiantes que el período de exámenes finales se llevará a cabo del 22 al 30 de mayo. Consulten el calendario oficial para horarios específicos.",
        category: "avisos",
        date: "5 Mayo 2024",
        author: "Dirección Académica",
        color: "#EF4444",
        likes: 42,
        comments: 15,
        image: "imagenes/calendario-examenes.jpg"
    },
    {
        id: 4,
        title: "Estudiantes ganan primer lugar en competencia nacional de redes",
        excerpt: "Nuestros estudiantes del técnico en Redes obtuvieron el primer lugar en la competencia nacional de configuración de redes y seguridad informática. ¡Felicidades!",
        category: "logros",
        date: "3 Mayo 2024",
        author: "Departamento de Redes",
        color: "#3B82F6",
        likes: 56,
        comments: 22,
        image: "imagenes/ganadores-redes.jpg"
    },
    {
        id: 5,
        title: "Charla sobre refrigeración comercial sostenible",
        excerpt: "El próximo jueves tendremos una charla sobre las últimas tendencias en refrigeración comercial sostenible, impartida por expertos del sector. Entrada libre.",
        category: "actividades",
        date: "1 Mayo 2024",
        author: "Departamento de Refrigeración",
        color: "#F59E0B",
        likes: 31,
        comments: 7,
        image: "imagenes/charla-refrigeracion.jpg"
    },
    {
        id: 6,
        title: "Nuevo convenio con empresas locales para prácticas profesionales",
        excerpt: "Firmamos un convenio con 5 empresas locales para ofrecer prácticas profesionales a nuestros estudiantes. Una gran oportunidad para experiencia laboral real.",
        category: "noticias",
        date: "28 Abril 2024",
        author: "Vinculación Laboral",
        color: "#8B5CF6",
        likes: 38,
        comments: 12,
        image: "imagenes/convenio-empresas.jpg"
    }

        ];

        document.addEventListener('DOMContentLoaded', function() {
            // Cargar navbar y footer
            loadComponents();
            
            // Inicializar filtros y cargar publicaciones
            initFilters();
            loadPosts();
            
            // Inicializar funcionalidad de búsqueda
            initSearch();
        });

        function loadComponents() {
            // Cargar navbar
            fetch('components/navbar.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('navbar-container').innerHTML = data;
                    if (typeof initNavbar === 'function') initNavbar();
                })
                .catch(error => {
                    console.error('Error cargando navbar:', error);
                    document.getElementById('navbar-container').innerHTML = `
                        <nav style="background: white; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                                <a href="index.html" style="text-decoration: none; color: #1f2937; font-weight: bold; font-size: 1.5rem;">
                                    Politecnico V. A. Santos
                                </a>
                                <a href="index.html" style="color: #8B5CF6; text-decoration: none;">Inicio</a>
                            </div>
                        </nav>
                    `;
                });
            
            // Cargar footer
            fetch('components/footer.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('footer-container').innerHTML = data;
                })
                .catch(error => {
                    console.error('Error cargando footer:', error);
                    document.getElementById('footer-container').innerHTML = `
                        <footer style="background: #1f2937; color: white; padding: 40px 20px; margin-top: 60px;">
                            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                                <p>&copy; 2024 Politecnico Vicente Aquilino Santos</p>
                                <p style="color: #9ca3af; margin-top: 10px;">Blog Institucional</p>
                            </div>
                        </footer>
                    `;
                });
        }

        function initFilters() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remover activo de todos
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Agregar activo al clickeado
                    btn.classList.add('active');
                    
                    const filter = btn.getAttribute('data-filter');
                    filterPosts(filter);
                });
            });
        }

        function loadPosts() {
            const postsGrid = document.getElementById('posts-grid');
            
            if (posts.length === 0) {
                postsGrid.innerHTML = `
                    <div class="no-posts">
                        <i class="fas fa-newspaper"></i>
                        <h3>No hay publicaciones recientes</h3>
                        <p>Pronto habrá nuevas publicaciones en el blog.</p>
                    </div>
                `;
                return;
            }
            
            displayPosts(posts);
        }

        function displayPosts(postsToShow) {
            const postsGrid = document.getElementById('posts-grid');
            postsGrid.innerHTML = '';
            
            postsToShow.forEach(post => {
                const postCard = document.createElement('article');
                postCard.className = 'post-card';
                
                // Determinar color según categoría
                let categoryColor = '#8B5CF6';
                let categoryText = 'Noticias';
                
                switch(post.category) {
                    case 'actividades':
                        categoryColor = '#10B981';
                        categoryText = 'Actividades';
                        break;
                    case 'avisos':
                        categoryColor = '#EF4444';
                        categoryText = 'Avisos';
                        break;
                    case 'logros':
                        categoryColor = '#3B82F6';
                        categoryText = 'Logros';
                        break;
                }
                
                postCard.innerHTML = `
                    <div class="post-image" style="background: linear-gradient(135deg, ${categoryColor} 0%, ${post.color} 100%); color: white; font-size: 3rem;">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <div class="post-content">
                        <span class="post-category" style="background-color: ${categoryColor}20; color: ${categoryColor};">
                            ${categoryText}
                        </span>
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-excerpt">${post.excerpt}</p>
                        
                        <a href="post.html?id=${post.id}" class="read-more">
                            Leer más <i class="fas fa-arrow-right"></i>
                        </a>
                        
                        <div class="post-meta">
                            <span><i class="far fa-calendar"></i> ${post.date}</span>
                            <span><i class="fas fa-user"></i> ${post.author}</span>
                        </div>
                    </div>
                `;
                
                postsGrid.appendChild(postCard);
            });
        }

        function filterPosts(filter) {
            let filteredPosts = posts;
            
            if (filter !== 'all') {
                filteredPosts = posts.filter(post => post.category === filter);
            }
            
            displayPosts(filteredPosts);
        }

        function initSearch() {
            const searchInput = document.getElementById('search-input');
            const searchBtn = document.getElementById('search-btn');
            
            if (searchBtn && searchInput) {
                searchBtn.addEventListener('click', performSearch);
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') performSearch();
                });
            }
        }

        function performSearch() {
            const query = document.getElementById('search-input')?.value.trim();
            if (!query) {
                alert('Por favor, ingresa un término de búsqueda.');
                return;
            }
            
            // Filtrar posts por término de búsqueda
            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) || 
                post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                post.author.toLowerCase().includes(query.toLowerCase())
            );
            
            if (filteredPosts.length > 0) {
                displayPosts(filteredPosts);
                
                // Mostrar mensaje de resultados
                const resultsMsg = document.createElement('div');
                resultsMsg.style.cssText = 'text-align: center; padding: 15px; background-color: #f0fdf4; border-radius: 10px; margin-bottom: 20px;';
                resultsMsg.innerHTML = `<strong>${filteredPosts.length} resultados</strong> encontrados para: "${query}"`;
                
                const postsGrid = document.getElementById('posts-grid');
                postsGrid.parentNode.insertBefore(resultsMsg, postsGrid);
                
                // Desplazar a los resultados
                resultsMsg.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`No se encontraron resultados para: "${query}"`);
            }
        }
   