// Supabase Configuration
const SUPABASE_URL = 'https://risydxsgttsbidgsjlbg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpc3lkeHNndHRzYmlkZ3NqbGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjE5NzIsImV4cCI6MjA4NjE5Nzk3Mn0.VOn63EjfKv9SvcyD9Xmumn5WIKqOQbFyGv_DrGkP5a0';

// Initialize Supabase client
let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully');
    } catch (e) {
        console.error('Failed to initialize Supabase:', e);
    }
} else {
    console.warn('Supabase library not loaded');
}

// Shared score functions
async function getScoresFromDB(game, level = null) {
    try {
        if (!supabaseClient) {
            console.warn('Supabase not initialized');
            return [];
        }

        let query = supabaseClient
            .from('scores')
            .select('*')
            .eq('game', game)
            .order('score', { ascending: game === 'memory_match' }) // Memory match: lower time is better
            .limit(10);

        if (level) {
            query = query.eq('level', level);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching scores:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Error fetching scores:', err);
        return [];
    }
}

async function addScoreToDB(game, playerName, score, level = null) {
    try {
        if (!supabaseClient) {
            console.warn('Supabase not initialized, score not saved');
            return false;
        }

        console.log('Saving score:', { game, playerName, score, level });

        const { data, error } = await supabaseClient
            .from('scores')
            .insert([{
                game: game,
                player_name: playerName,
                score: score,
                level: level
            }]);

        if (error) {
            console.error('Error saving score:', error);
            return false;
        }

        console.log('Score saved successfully');
        return true;
    } catch (err) {
        console.error('Error saving score:', err);
        return false;
    }
}

async function isHighScoreInDB(game, score, level = null) {
    try {
        if (!supabaseClient) {
            console.warn('Supabase not initialized, allowing score entry');
            return true;
        }

        const scores = await getScoresFromDB(game, level);

        if (scores.length < 10) return true;

        // For memory match, lower is better (time-based)
        if (game === 'memory_match') {
            return score < scores[scores.length - 1].score;
        }

        // For other games, higher is better
        return score > scores[scores.length - 1].score;
    } catch (err) {
        console.error('Error checking high score:', err);
        // Return true on error so player can still enter their name
        return true;
    }
}
