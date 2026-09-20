-- ================================================
-- AI Financial Literacy — PostgreSQL Init Script
-- Run once: psql -d aifinance -f init.sql
-- ================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100),
    email           VARCHAR(150) UNIQUE NOT NULL,
    auth_provider   VARCHAR(20)  DEFAULT 'email',
    college         VARCHAR(150),
    monthly_budget  DECIMAL(10,2) DEFAULT 5000.00,
    monthly_income  DECIMAL(10,2) DEFAULT 8000.00,
    savings_goal    DECIMAL(10,2) DEFAULT 2000.00,
    created_at      TIMESTAMP    DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    amount      DECIMAL(10,2) NOT NULL,
    category    VARCHAR(50)   NOT NULL,
    description TEXT,
    date        VARCHAR(20)   DEFAULT CURRENT_DATE::TEXT,
    created_at  TIMESTAMP     DEFAULT NOW()
);

-- AI conversation log
CREATE TABLE IF NOT EXISTS ai_conversations (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    module       VARCHAR(30),
    user_message TEXT,
    ai_response  TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_user    ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_conv_user     ON ai_conversations(user_id);
