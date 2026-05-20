-- 物种表
CREATE TABLE IF NOT EXISTS species (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT
);

-- 品种表
CREATE TABLE IF NOT EXISTS breeds (
  id BIGSERIAL PRIMARY KEY,
  species_id BIGINT REFERENCES species(id),
  name TEXT NOT NULL
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 宠物表
CREATE TABLE IF NOT EXISTS pets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  species_id BIGINT REFERENCES species(id),
  breed_id BIGINT REFERENCES breeds(id),
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  traits TEXT[] DEFAULT '{}',
  image_url TEXT,
  health_status TEXT,
  shelter_info TEXT,
  description TEXT,
  is_adopted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id BIGINT REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, pet_id)
);

-- 领养申请表
CREATE TABLE IF NOT EXISTS adoption_applications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id BIGINT REFERENCES pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 成功故事表
CREATE TABLE IF NOT EXISTS success_stories (
  id BIGSERIAL PRIMARY KEY,
  pet_name TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  story_text TEXT,
  adopter_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_id BIGINT REFERENCES adoption_applications(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 策略：公开数据所有人可读
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开物种" ON species FOR SELECT USING (true);
CREATE POLICY "公开品种" ON breeds FOR SELECT USING (true);
CREATE POLICY "公开宠物" ON pets FOR SELECT USING (true);
CREATE POLICY "公开故事" ON success_stories FOR SELECT USING (true);

-- RLS：用户私有数据
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "本人读写" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "本人读写收藏" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "本人读写申请" ON adoption_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "本人读写通知" ON notifications FOR ALL USING (auth.uid() = user_id);

-- 启用 Realtime（通知表）
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 种子数据：物种
INSERT INTO species (id, name, icon) VALUES
  (1, '狗', '🐕'), (2, '猫', '🐈'), (3, '兔', '🐰');

-- 种子数据：品种
INSERT INTO breeds (id, species_id, name) VALUES
  (1, 1, '金毛寻回犬'), (2, 1, '拉布拉多'), (3, 1, '柯基'),
  (4, 2, '布偶猫'), (5, 2, '英短'), (6, 2, '橘猫'),
  (7, 3, '荷兰垂耳兔'), (8, 3, '侏儒兔');

-- 种子数据：宠物
INSERT INTO pets (name, age, species_id, breed_id, size, traits, image_url, health_status, shelter_info, description) VALUES
  ('Buddy', 2, 1, 1, 'large', ARRAY['温顺', '活泼', '亲人'], 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop', '已接种疫苗，已绝育', '阳光动物救助中心 · 北京市朝阳区', 'Buddy 是一只非常友善的金毛，喜欢和人玩耍，适合有孩子的家庭。'),
  ('小花', 1, 2, 4, 'medium', ARRAY['安静', '粘人', '优雅'], 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop', '已接种疫苗，已绝育', '喵星人救助站 · 上海市浦东新区', '小花是一只温柔的布偶猫，喜欢窝在主人腿上，非常适合公寓生活。'),
  ('豆豆', 3, 1, 3, 'small', ARRAY['机灵', '忠诚', '好动'], 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop', '已接种疫苗', '爱心宠物之家 · 广州市天河区', '豆豆是一只可爱的柯基，精力充沛，每天都需要散步和玩耍。'),
  ('雪球', 6, 3, 7, 'small', ARRAY['温顺', '安静', '可爱'], 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop', '健康良好', '小动物保护协会 · 成都市武侯区', '雪球是一只纯白的垂耳兔，性格温顺安静，适合新手饲养。'),
  ('大橘', 4, 2, 6, 'medium', ARRAY['贪吃', '慵懒', '亲人'], 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop', '已接种疫苗', '喵星人救助站 · 上海市浦东新区', '大橘是一只典型的橘猫，爱吃爱睡，性格超级好，从来不挠人。'),
  ('Lucky', 1, 1, 2, 'large', ARRAY['热情', '聪明', '忠诚'], 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=400&fit=crop', '已接种疫苗，已绝育', '阳光动物救助中心 · 北京市朝阳区', 'Lucky 是一只聪明的拉布拉多幼犬，学习能力超强，正在接受基础训练。'),
  ('咪咪', 2, 2, 5, 'small', ARRAY['独立', '爱干净', '机警'], 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=400&fit=crop', '已接种疫苗', '爱心宠物之家 · 广州市天河区', '咪咪是一只优雅的英短，非常爱干净，独立性强但也会撒娇。'),
  ('团团', 1, 3, 8, 'small', ARRAY['活泼', '好奇', '粘人'], 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop', '健康良好', '小动物保护协会 · 成都市武侯区', '团团是一只小侏儒兔，好奇心强，喜欢探索新环境，非常粘人。');

-- 种子数据：成功故事
INSERT INTO success_stories (pet_name, before_image, after_image, story_text, adopter_name) VALUES
  ('阿福', 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', '阿福刚来救助站时非常瘦弱，经过3个月的照顾，现在已经健康快乐地生活在新家了！', '张女士'),
  ('奶茶', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400', 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400', '奶茶从一只胆小的流浪猫变成了家里的女王，每天都享受着被宠爱的日子。', '李先生');
