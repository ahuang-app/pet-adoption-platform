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
  (7, 3, '荷兰垂耳兔'), (8, 3, '侏儒兔'),
  (9, 1, '柯基犬混血'), (10, 3, '狮子兔'), (11, 1, '中华田园犬');

-- 种子数据：宠物
INSERT INTO pets (name, age, species_id, breed_id, size, traits, image_url, health_status, shelter_info, description) VALUES
  ('Buddy', 2, 1, 1, 'large', ARRAY['温顺', '活泼', '亲人', '聪明', '贪吃'], 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop', '已完成全部疫苗接种，已绝育，每月定期驱虫，无任何疾病史。性格极其温和，适合家庭饲养。', '阳光动物救助中心 · 北京市朝阳区建国路128号 · 电话: 010-12345678', 'Buddy曾在建筑工地流浪数月，被工人们轮流喂养。它是一只非常友善的金毛，对人类有着天然的信任感。每天最喜欢的事情就是趴在草地上晒太阳，然后等你走过去摸摸它的头。它很聪明，已经学会了坐下、握手和趴下三个指令。虽然体型大，但脾气超级温柔，连小猫都能从它碗里抢食吃。适合有小孩的家庭，也适合第一次养狗的新手。'),
  ('小花', 1, 2, 4, 'medium', ARRAY['安静', '粘人', '优雅', '胆小', '爱干净'], 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop', '已完成疫苗接种，已绝育，定期体检一切正常。有轻微毛球症，需定期喂化毛膏。', '喵星人救助站 · 上海市浦东新区张杨路361号 · 电话: 021-87654321', '小花是在一个下雨天被发现的，蜷缩在快递柜下面瑟瑟发抖，才两个月大。被救助后，它从一只浑身湿透、不停发抖的小猫，变成了救助站里最优雅的"小公主"。它喜欢坐在窗台上看外面的鸟，不太爱吵闹，但一到晚上就会主动跳上你的腿，用头蹭你求摸摸。它对陌生人比较谨慎，需要一点时间熟悉，但一旦信任你，就会成为最忠实的伙伴。适合居住在安静环境中的领养者。'),
  ('豆豆', 3, 1, 3, 'small', ARRAY['机灵', '忠诚', '好动', '护主', '爱吃'], 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop', '已完成疫苗接种，已绝育，髋关节发育正常，牙齿健康良好。精力旺盛，需要充足运动。', '爱心宠物之家 · 广州市天河区体育西路59号 · 电话: 020-34567890', '豆豆原本是一对老夫妻的伴侣犬，后来老人搬去养老院无法继续照顾它。豆豆继承了柯基的聪明和机灵，会察言观色，能感知主人的情绪变化。它特别喜欢叼着球到处跑，每天不玩够半小时绝不罢休。在救助站里，它是最受欢迎的"开心果"，总能用摇来摇去的小屁股逗得大家哈哈大笑。虽然腿短，但跑起来速度丝毫不慢，适合喜欢户外运动的家庭。'),
  ('雪球', 6, 3, 7, 'small', ARRAY['温顺', '安静', '可爱', '胆小', '爱干净'], 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop', '健康状态良好，已做过全身体检，牙齿和消化系统正常。毛发需定期梳理以防毛球。已绝育。', '小动物保护协会 · 成都市武侯区科华北路83号 · 电话: 028-56789012', '雪球曾在一所小学的操场角落被发现，当时它正被几个孩子围住喂胡萝卜。被送到救助站后，它凭借雪白的毛色和温柔的性格迅速成了站里的"团宠"。雪球每天最喜欢的就是躺在柔软的垫子上晒太阳，偶尔会站起来伸个懒腰，然后继续趴下。它非常适合作为家养宠物，不吵闹、不捣乱，会自己用厕所，特别干净。适合有耐心、喜欢安静陪伴的领养者，也适合家里有小孩的家庭。'),
  ('大橘', 4, 2, 6, 'medium', ARRAY['贪吃', '慵懒', '亲人', '佛系', '嗓门大'], 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop', '已完成疫苗接种，已绝育，体重偏重需控制饮食。牙齿有轻微牙结石，建议定期洁牙。肝功能正常。', '喵星人救助站 · 上海市浦东新区张杨路361号 · 电话: 021-87654321', '大橘是在一个菜市场后面被救助的，当时它正蹲在鱼摊旁边眼巴巴地等着老板给点边角料。作为一只标准橘猫，它的座右铭就是"能吃是福"。它不挑食、不挠人、不拆家，一天大约有16个小时都在睡觉，剩下8小时用来吃饭和求摸摸。它有一个特别的技能——能用不同的叫声表达不同的需求，饿了是一种叫法，想出门是一种叫法，想被摸又是另一种。适合想要一只省心陪伴猫的领养者，尤其适合上班族。'),
  ('Lucky', 1, 1, 2, 'large', ARRAY['热情', '聪明', '忠诚', '贪玩', '学习能力强'], 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=400&fit=crop', '已完成幼犬全套疫苗接种（犬瘟、细小、传染性肝炎、狂犬），已驱虫，未绝育（年龄尚小）。健康活泼，无任何先天性疾病。', '阳光动物救助中心 · 北京市朝阳区建国路128号 · 电话: 010-12345678', 'Lucky是救助站从一处废弃养殖场救出的5只幼犬之一。它从小就展现出了拉布拉多的优良品质——超级聪明，什么东西一学就会。目前已经掌握了"坐""卧""等""来""吐"等7个指令，正在学习导盲基础训练。它特别喜欢水，每次经过小水坑都要踩两脚。对所有人都很友好，但不会过分粘人，独立性也很好。因为年龄小，需要领养者有足够的时间和耐心进行持续训练。适合有养犬经验的活跃家庭。'),
  ('咪咪', 2, 2, 5, 'small', ARRAY['独立', '爱干净', '机警', '慢热', '优雅'], 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=400&fit=crop', '已完成疫苗接种，已绝育，肾功能和心脏功能正常。毛发质量优秀，定期体内外驱虫。日常体检各项指标均在正常范围内。', '爱心宠物之家 · 广州市天河区体育西路59号 · 电话: 020-34567890', '咪咪的前主人因移居国外无法带它同行，于是送到救助站寻找新家。它是一只典型的英国短毛猫——外表圆滚滚，性格独立但不冷漠。它不需要你时刻陪着，但当你坐在沙发上看电视时，它会默默跳上来趴在你旁边。它非常爱干净，每天都要花大量时间舔毛，从不把猫砂带出盆外。对陌生人会比较戒备，但一旦认定你是"自己人"，就会在你回家时用尾巴蹭你的腿表示欢迎。适合追求安静、优雅陪伴的领养者。'),
  ('团团', 1, 3, 8, 'small', ARRAY['活泼', '好奇', '粘人', '好动', '聪明'], 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop', '身体健康，发育良好，已完成基础体检和疫苗接种。牙齿整齐，消化系统健康。活泼好动，无任何疾病史。', '小动物保护协会 · 成都市武侯区科华北路83号 · 电话: 028-56789012', '团团是救助站里最小的"活跃分子"，虽然是侏儒兔，但精力堪比大型犬。它对任何新鲜事物都充满好奇，每次志愿者打扫兔舍，它都要跟在后面东闻闻西看看，偶尔还会用鼻子拱一拱扫把。它和人特别亲近，只要有人蹲下来伸出手，它就会蹦蹦跳跳地跑过来把头放低让你摸。团团很喜欢玩玩具，一个小藤球能自己玩上半小时。适合愿意花时间互动、希望养一只活泼可爱小宠物的领养者。'),
  ('小Q', 1, 1, 9, 'small', ARRAY['活泼', '好动', '亲人', '贪玩', '聪明'], 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=600&h=400&fit=crop', '已完成全部幼犬疫苗接种，已驱虫，已绝育。身体各项指标健康，精力充沛。无遗传病史，髋关节发育正常。', '阳光动物救助中心 · 北京市朝阳区建国路128号 · 电话: 010-12345678', '小Q是在地铁站附近被发现的，当时它戴着一条破旧的项圈四处张望，似乎在寻找旧主人。这只混血柯基继承了柯基标志性的短腿和大耳朵，再加上一点别的血统，让它的面部表情格外丰富，常常歪着头用疑惑的小眼神看着人。它超级喜欢玩球，只要有人扔球就会飞奔过去叼回来，乐此不疲。虽然体型小，但胆量一点不小，在救助站里见到大狗也敢上去打招呼。适合喜欢小型犬但又希望拥有一只活泼互动伴侣的领养者。'),
  ('芝麻', 3, 2, 5, 'medium', ARRAY['高冷', '独立', '优雅', '干净', '慢热'], 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=400&fit=crop', '已完成全部疫苗接种，已绝育，每年定期体检。近期血检和尿检均正常。有轻度牙结石，建议半年内做一次洁牙。体重偏重，需控制饮食。', '喵星人救助站 · 上海市浦东新区张杨路361号 · 电话: 021-87654321', '芝麻的前主人是一位独居老人，老人过世后被亲戚送到救助站。可能因为经历过失去，芝麻的防备心比较强，不会轻易示好。但救助站的工作人员发现，只要你耐心地每天跟它说说话、轻轻地摸摸它的下巴，它就会慢慢放下高冷的架子。三个月后，它已经学会了在特定的人面前翻肚皮。芝麻的日常很规律：早上在窗台看鸟，中午睡午觉，下午在猫爬架上磨爪子，晚上等所有人安静下来后悄悄巡视一圈领地。适合有耐心、不急躁、愿意给予空间和时间的领养者。'),
  ('棉花糖', 1, 3, 10, 'small', ARRAY['胆小', '温顺', '安静', '萌', '爱睡觉'], 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop', '健康状态良好，已完成基础体检，消化系统正常。毛发浓密柔软，需定期梳理以防打结。已绝育，牙齿健康。', '小动物保护协会 · 成都市武侯区科华北路83号 · 电话: 028-56789012', '棉花糖是在一个公园的纸箱里被发现的，和它的三个兄弟姐妹挤在一起。被救助时只有巴掌大小，毛茸茸的一团，像极了一坨棉花糖，因此得名。作为狮子兔，它有着一圈标志性的"鬃毛"围绕在头部周围，看起来像一只小小的狮子。它的胆子非常小，听到突然的大声响会立刻躲进窝里。但它有个可爱的习惯——睡着后会发出轻微的磨牙声，那是兔子表示满足和放松的方式。每天的生活就是吃饭、睡觉、发呆、再吃饭、再睡觉，妥妥的"佛系"兔生。适合追求安静、低维护宠物的领养者。'),
  ('阿黄', 5, 1, 11, 'medium', ARRAY['忠诚', '稳重', '看家', '懂事', '不挑食'], 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=400&fit=crop', '已完成疫苗接种，已绝育，心脏和关节功能正常。年龄偏大，建议每年做一次全面体检。牙齿有轻度磨损属正常老化。整体健康状况良好。', '阳光动物救助中心 · 北京市朝阳区建国路128号 · 电话: 010-12345678', '阿黄是救助站里资历最老的"常住居民"，已经在这里住了快三年。它曾经是某工厂的看门犬，工厂搬迁后被遗弃。阿黄性格稳重得像一个老干部，不吵不闹不拆家，有陌生人靠近院子会轻轻叫两声提醒，但不是那种乱叫的狗。它非常懂事，从来不在室内大小便，吃饭也不挑食，给什么吃什么。每天傍晚，它会独自坐在院子里望着远方发呆，工作人员说那是在等一个永远不会回来的人。它需要的只是一个温暖的家和一个不会再次抛弃它的主人，让它安度余生。');

-- 种子数据：成功故事
INSERT INTO success_stories (pet_name, before_image, after_image, story_text, adopter_name) VALUES
  ('阿福', 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', '阿福刚来救助站时体重只有不到4公斤，全身都是跳蚤和皮肤病，眼神里写满了恐惧。经过救助站3个月的精心治疗和调养，它终于恢复了健康。张女士第一次见到阿福就红了眼眶，她说"这只狗和我小时候养的那只太像了"。领养后的第一周阿福还很拘谨，但第二周就开始摇着尾巴在门口等张女士下班了。现在阿福已经是家里不可缺少的一员，每天最期待的事情就是和张女士一起去公园散步，看到松鼠的时候会兴奋地转圈圈。张女士常说，不是她救了阿福，是阿福让她的生活重新有了色彩。', '张女士'),
  ('奶茶', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400', 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400', '奶茶被发现时正躲在一个废弃的纸箱里，浑身脏兮兮的，一只眼睛因为感染几乎睁不开。救助人员花了整整两个小时才用猫条把它引诱出来。经过治疗后，奶茶不仅眼睛恢复了健康，原本暗淡的毛发也渐渐变得有光泽。李先生为了领养它做足了功课，把所有猫咪用品都提前准备好。刚到家时奶茶只敢躲在沙发下面，李先生就在沙发旁边放了水和食物，坐在地板上静静地等它。三天后，奶茶终于走出了沙发底，蹭了蹭李先生的腿。现在奶茶已经完全把自己当成了家里的"女王"，每天早上准时跳上床用爪子拍李先生的脸要早餐，晚上则要占据沙发的正中间位置看电视。李先生笑着说："我明明是领养了一只猫，怎么感觉自己才是被收养的那个。"', '李先生'),
  ('大黄', 'https://images.unsplash.com/photo-1551730459-9bc7a63c75ab?w=400', 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400', '大黄是小区附近一只流浪了三年多的中华田园犬，靠着好心人偶尔的投喂勉强活了下来。它有一条腿因为小时候被车撞过，走起路来一瘸一拐的。2024年冬天特别冷，志愿者在一个废弃工地的角落里发现了瑟瑟发抖的大黄，身上盖着一层薄薄的积雪。救助站的工作人员说，大黄被带回来后的第一晚，吃了整整三大碗狗粮，像是要把这几年的饥饿都补回来。王先生一家在救助站看到大黄的第一眼就决定领养它，尽管它年纪不小了，腿也不方便。现在大黄有了自己的狗窝、固定的饭点和永远不用再担心的下一顿饭在哪里。王先生的小女儿和大黄形影不离，每天早上一起出门，一个去上学，一个去散步。大黄的腿虽然还是有点跛，但它走起路来尾巴竖得高高的，那是幸福的姿态。', '王先生一家'),
  ('小咪', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400', 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=400', '小咪来自一个囤积救助案例——救助人员在仅有60平米的房子里发现了40多只猫。小咪当时被挤在角落里，瘦得肋骨一根根清晰可见，鼻子上还有和其他猫打架留下的伤疤。长期的恶劣环境让它对同类充满了恐惧，但对人却有一种说不清的依赖。经过半年的社会化和康复训练，小咪逐渐从一只惊恐的小猫变成了能够正常社交的猫咪。陈小姐是一名程序员，平时独自居住，她说小咪是她的"最佳编程搭档"——工作时安静地趴在电脑旁边，休息时会用爪子轻轻地碰碰她的手提醒她该起来活动一下了。陈小姐说："虽然我有几十个技术群聊，但现在最治愈的，是小咪用头蹭我手心的那个瞬间。"', '陈小姐'),
  ('球球', 'https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400', 'https://images.unsplash.com/photo-1591047010878-b1ac5cd2b24c?w=400', '球球是一只被人遗弃在宠物店门口的荷兰垂耳兔，笼子外面贴了一张纸条写着"搬家无法带走，求好心人收养"。宠物店老板联系了救助站，球球就这样来到了小动物保护协会。它的一只耳朵因为小时候受过伤而无法完全垂下来，看上去总是一高一低的，但这反而成了它最可爱的标志。刘女士带着两个女儿来救助站本来是看猫的，结果大女儿看到球球后就走不动路了。小女儿蹲下来伸出手指，球球竟然主动凑上来闻了闻，然后用头蹭了蹭她的手指。那一刻，母女三人都被征服了。现在球球住在刘女士家客厅的大兔笼里，每天放风时间一到，两个小姑娘就抢着陪它玩。球球最喜欢用鼻子拱姐姐的脚踝，然后一蹦一跳地跑开，像是邀请她们来追自己。', '刘女士一家'),
  ('旺财', 'https://images.unsplash.com/photo-1558929996-da64a16e0f23?w=400', 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400', '旺财是一只11岁的老年金毛，在救助站里大家都叫它"老干部"。它的前主人因病去世后，主人的子女都不愿意收养它，旺财便来到了救助站。年迈的旺财行动缓慢，耳朵也不太灵光了，但那双眼睛依然温和而充满智慧。很多人来看宠物时都会忽略它，因为它太老了——直到周先生的出现。周先生今年65岁，退休后独自生活，他说："我不需要一只能陪我跑马拉松的狗，我需要的是一个能陪我慢慢走完余生路的伙伴。"旺财到新家后适应得出奇地好，它很快就弄清楚了自己该在哪里吃饭、在哪里睡觉。每天清晨，周先生和旺财会一起在小区的林荫道上慢慢散步，一老一犬成了小区里最温暖的风景线。邻居们都说，自从旺财来了，周先生的笑容明显多了。周先生说："别人都说我在做善事收养了一只老狗，但其实是旺财在陪伴我度过退休后的每一天。"', '周先生');
