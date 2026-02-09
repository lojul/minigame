-- Create scores table for all games
CREATE TABLE IF NOT EXISTS scores (
    id BIGSERIAL PRIMARY KEY,
    game VARCHAR(50) NOT NULL,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    level VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_scores_game_level ON scores(game, level);
CREATE INDEX IF NOT EXISTS idx_scores_game_score ON scores(game, score DESC);

-- Enable Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores (public leaderboard)
CREATE POLICY "Allow public read access" ON scores
    FOR SELECT USING (true);

-- Allow anyone to insert scores (anonymous players)
CREATE POLICY "Allow public insert access" ON scores
    FOR INSERT WITH CHECK (true);
