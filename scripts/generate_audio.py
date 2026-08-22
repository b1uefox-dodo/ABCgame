import os
import subprocess
import json

# Ensure directories exist
os.makedirs("public/audio/letters", exist_ok=True)
os.makedirs("public/audio/numbers", exist_ok=True)
os.makedirs("public/audio/eggs", exist_ok=True)
os.makedirs("public/audio/prompts", exist_ok=True)

def generate_voice_file(text, output_path):
    aiff_path = output_path.replace(".m4a", ".aiff")
    # Generate speech using macOS Tingting voice (friendly clear Mandarin + English)
    cmd1 = ["say", "-v", "Tingting", "-r", "165", text, "-o", aiff_path]
    subprocess.run(cmd1, check=True)
    
    # Convert to AAC m4a
    cmd2 = ["afconvert", "-f", "mp4f", "-d", "aac", aiff_path, output_path]
    subprocess.run(cmd2, check=True)
    
    # Remove temporary aiff
    if os.path.exists(aiff_path):
        os.remove(aiff_path)
    print(f"Generated: {output_path} <- {text}")

# 1. Letters and Letter Items
letters_data = {
    'A': [('Apple', '苹果'), ('Astronaut', '宇航员'), ('Alligator', '大鳄鱼'), ('Airplane', '飞机')],
    'B': [('Bear', '小熊'), ('Butterfly', '蝴蝶'), ('Banana', '香蕉'), ('Balloon', '气球')],
    'C': [('Cat', '小猫'), ('Car', '小汽车'), ('Cake', '蛋糕'), ('Cookie', '小饼干')],
    'D': [('Dog', '小狗'), ('Dinosaur', '小恐龙'), ('Duck', '小鸭子'), ('Donut', '甜甜圈')],
    'E': [('Elephant', '大象'), ('Egg', '彩蛋'), ('Earth', '地球'), ('Eagle', '雄鹰')],
    'F': [('Fish', '金鱼'), ('Frog', '小青蛙'), ('Fox', '小狐狸'), ('Flower', '向日葵')],
    'G': [('Giraffe', '长颈鹿'), ('Grapes', '葡萄'), ('Guitar', '吉他'), ('Gift', '礼物盒')],
    'H': [('Heart', '爱心'), ('House', '城堡小屋'), ('Horse', '小斑马'), ('Hat', '魔法帽')],
    'I': [('Ice Cream', '冰淇淋'), ('Igloo', '冰屋'), ('Island', '海岛')],
    'J': [('Jellyfish', '水母'), ('Juice', '橙汁'), ('Jaguar', '小豹子')],
    'K': [('Kangaroo', '袋鼠'), ('Kite', '风筝'), ('Koala', '考拉'), ('Key', '魔法钥匙')],
    'L': [('Lion', '狮子王'), ('Lemon', '柠檬'), ('Lollipop', '棒棒糖'), ('Ladybug', '七星瓢虫')],
    'M': [('Monkey', '小猴子'), ('Moon', '弯弯月亮'), ('Mushroom', '小蘑菇'), ('Music', '音符')],
    'N': [('Nest', '鸟巢'), ('Nut', '坚果'), ('Night', '星空夜')],
    'O': [('Owl', '猫头鹰'), ('Orange', '橘子'), ('Octopus', '章鱼八爪鱼')],
    'P': [('Panda', '大熊猫'), ('Pig', '粉红小猪'), ('Pizza', '披萨饼'), ('Penguin', '小企鹅')],
    'Q': [('Queen', '女王'), ('Quack', '小鸭嘎嘎'), ('Question', '问号小精灵')],
    'R': [('Rainbow', '彩虹'), ('Rabbit', '小白兔'), ('Rocket', '小火箭'), ('Robot', '智能机器人')],
    'S': [('Sun', '太阳公公'), ('Star', '小星星'), ('Strawberry', '草莓'), ('Snowman', '小雪人')],
    'T': [('Tiger', '小老虎'), ('Train', '小火车'), ('Tree', '大树'), ('Turtle', '小乌龟')],
    'U': [('Umbrella', '雨伞'), ('Unicorn', '独角兽'), ('UFO', '飞碟')],
    'V': [('Violin', '小提琴'), ('Volcano', '小火山'), ('Van', '小货车')],
    'W': [('Whale', '大鲸鱼'), ('Watermelon', '西瓜'), ('Windmill', '大风车')],
    'X': [('Xylophone', '木琴'), ('X-ray', '透视光波')],
    'Y': [('Yo-Yo', '悠悠球'), ('Yacht', '帆船'), ('Yarn', '毛线球')],
    'Z': [('Zebra', '斑马'), ('Zoo', '动物园')]
}

for letter, items in letters_data.items():
    # Base letter sound
    primary_en, primary_cn = items[0]
    generate_voice_file(f"字母 {letter}，{primary_en}，{primary_cn}！", f"public/audio/letters/{letter}.m4a")
    for idx, (name_en, name_cn) in enumerate(items):
        generate_voice_file(f"字母 {letter}，{name_en}，{name_cn}！", f"public/audio/letters/{letter}_{idx}.m4a")

# 2. Numbers
numbers_data = [
    (0, 'Zero', '零', '个神奇蛋'),
    (1, 'One', '一', '只小毛鸡'),
    (2, 'Two', '二', '只小天鹅'),
    (3, 'Three', '三', '只彩蝴蝶'),
    (4, 'Four', '四', '只跳跳蛙'),
    (5, 'Five', '五', '只金星星'),
    (6, 'Six', '六', '只海豚宝宝'),
    (7, 'Seven', '七', '道七彩虹'),
    (8, 'Eight', '八', '只小章鱼'),
    (9, 'Nine', '九', '个大热气球')
]

for num, name_en, name_cn, count_str in numbers_data:
    generate_voice_file(f"数字 {num}，{name_en}，{name_cn}，{num} {count_str}！", f"public/audio/numbers/{num}.m4a")

# 3. Easter Eggs
eggs_data = [
    ('CAT', 'Cat，小猫咪，喵喵喵！'),
    ('DOG', 'Dog，小狗，汪汪汪！'),
    ('SUN', 'Sun，太阳公公出来啦！'),
    ('CAR', 'Car，小汽车，嘀嘀叭叭！'),
    ('BUS', 'Bus，大巴士出发！'),
    ('PIG', 'Pig，小猪，呼噜呼噜！'),
    ('FOX', 'Fox，小狐狸！'),
    ('FLY', 'Fly，飞翔！'),
    ('STAR', 'Star，满天繁星！'),
    ('FISH', 'Fish，小鱼游啊游！'),
    ('LOVE', 'Love，满满的爱！'),
    ('RAIN', 'Rain，下雨啦！'),
    ('ICE', 'Ice，冰晶魔法！'),
    ('BEE', 'Bee，小蜜蜂嗡嗡嗡！')
]

for egg_word, prompt_text in eggs_data:
    generate_voice_file(prompt_text, f"public/audio/eggs/{egg_word}.m4a")

# 4. Special Prompts
prompts_data = [
    ('confetti', '彩虹礼炮大狂欢！'),
    ('gift', '神秘惊喜盲盒来啦！'),
    ('vacuum', '咕噜咕噜，怪物吸尘器出动！'),
    ('goodbye', '宝宝再见，下次再来一起探险哦！'),
    ('correct', '太棒啦，答对啦！'),
    ('balloon_start', '请在键盘上找到目标字母或数字！'),
    ('train_start', '小火车进站啦，按数字装满车厢吧！'),
    ('whistle', '呜——呜——！小火车鸣笛啦！')
]

for p_name, p_text in prompts_data:
    generate_voice_file(p_text, f"public/audio/prompts/{p_name}.m4a")

print("All audio files generated successfully!")
