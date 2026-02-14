CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  default_niche VARCHAR(120),
  timezone VARCHAR(60) DEFAULT 'UTC',
  theme VARCHAR(20) DEFAULT 'light',
  notification_quiet_hours VARCHAR(40),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255),
  platform_username VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  follower_count INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL,
  rate_limit_used_percent INTEGER DEFAULT 0,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE topics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  source VARCHAR(60) NOT NULL,
  category VARCHAR(100),
  viral_score INTEGER,
  trend VARCHAR(20),
  competition VARCHAR(20),
  selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  topic_id UUID REFERENCES topics(id),
  title VARCHAR(500),
  script TEXT,
  script_quality INTEGER,
  seo_score INTEGER,
  retention_score INTEGER,
  voice_url TEXT,
  visual_manifest JSONB,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE schedule (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  platform VARCHAR(50),
  scheduled_time TIMESTAMP,
  status VARCHAR(20),
  retry_count INTEGER DEFAULT 0,
  published_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  platform VARCHAR(50),
  date DATE,
  views INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  watch_time INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  api_name VARCHAR(80),
  endpoint VARCHAR(255),
  request_count INTEGER DEFAULT 1,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
