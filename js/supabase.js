const SUPABASE_URL = 'https://kkfdqevjhygerqyenbhf.supabase.co'; // Ej: https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_bY7wAvoRMXTEBLl3oOacjw_j83lfLKE';

// Inicializador de Supabase (verifica UMD, intenta import dinámico y fallback a local)
var supabase = null;

function loadScript(src) {
	return new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = src;
		s.async = true;
		s.onload = () => resolve();
		s.onerror = (e) => reject(new Error('Error cargando script: ' + src));
		document.head.appendChild(s);
	});
}

async function initSupabase() {
	console.debug('Inicializando Supabase...');

	// 1) Intentar desde el global UMD (si está cargado)
	if (window.supabase && typeof window.supabase.createClient === 'function') {
		supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
		console.info('Supabase inicializado desde global UMD');
		return supabase;
	}

	// 2) Intentar import dinámico (ESM) desde CDN como fallback
	try {
		console.debug('Intentando import dinámico de Supabase (ESM)...');
		const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js');
		if (mod && typeof mod.createClient === 'function') {
			supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
			console.info('Supabase inicializado vía import ESM (mod.createClient)');
			return supabase;
		} else if (mod && mod.supabase && typeof mod.supabase.createClient === 'function') {
			supabase = mod.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
			console.info('Supabase inicializado vía import ESM (mod.supabase.createClient)');
			return supabase;
		}
	} catch (err) {
		console.warn('Import dinámico ESM falló (puede ser bloqueo por extensión/CSP):', err);
	}

	// 3) Intentar cargar bundle UMD desde CDN (ya se intenta en HTML), pero como fallback intentar cargar copia local
	try {
		console.debug('Intentando cargar local `js/supabase.umd.js` como fallback...');
		await loadScript('js/supabase.umd.js');
		if (window.supabase && typeof window.supabase.createClient === 'function') {
			supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
			console.info('Supabase inicializado desde copia local UMD');
			return supabase;
		}
	} catch (err) {
		console.error('Fallo al cargar copia local UMD:', err);
	}

	// 4) Si todo falla, registrar y devolver null
	console.error('Supabase JS no está disponible. Revisa la conexión a CDN y la inclusión del script UMD.');
	return null;
}

// Exponer la promesa y un método para reintentar
window.supabaseReady = initSupabase();
window.retrySupabaseInit = function() {
	window.supabaseReady = initSupabase();
	return window.supabaseReady;
};
