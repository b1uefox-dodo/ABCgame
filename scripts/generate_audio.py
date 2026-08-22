import os
import subprocess
import shutil

modes = ['bilingual', 'en', 'zh']
for m in modes:
    os.makedirs(f"public/audio/letters/{m}", exist_ok=True)
    os.makedirs(f"public/audio/numbers/{m}", exist_ok=True)

os.makedirs("public/audio/eggs", exist_ok=True)
os.makedirs("public/audio/prompts", exist_ok=True)

def generate_voice(text, voice, output_path, rate="165"):
    aiff_path = output_path.replace(".m4a", ".aiff")
    cmd1 = ["say", "-v", voice, "-r", rate, text, "-o", aiff_path]
    subprocess.run(cmd1, check=True)
    
    cmd2 = ["afconvert", "-f", "mp4f", "-d", "aac", aiff_path, output_path]
    subprocess.run(cmd2, check=True)
    
    if os.path.exists(aiff_path):
        os.remove(aiff_path)
    print(f"Generated ({voice}): {output_path} <- {text}")

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

# 1. Letters in 3 Language Modes (Direct letter pronunciation, no '字母'/'Letter')
for letter, items in letters_data.items():
    primary_en, primary_cn = items[0]
    
    # Base letters
    generate_voice(f"{letter}，{primary_en}，{primary_cn}！", "Tingting", f"public/audio/letters/bilingual/{letter}.m4a")
    generate_voice(f"{letter}, {primary_en}!", "Samantha", f"public/audio/letters/en/{letter}.m4a", rate="160")
    generate_voice(f"{letter}，{primary_cn}！", "Tingting", f"public/audio/letters/zh/{letter}.m4a")
    
    # Also write to root of public/audio/letters/
    shutil.copyfile(f"public/audio/letters/bilingual/{letter}.m4a", f"public/audio/letters/{letter}.m4a")
    
    for idx, (name_en, name_cn) in enumerate(items):
        generate_voice(f"{letter}，{name_en}，{name_cn}！", "Tingting", f"public/audio/letters/bilingual/{letter}_{idx}.m4a")
        generate_voice(f"{letter}, {name_en}!", "Samantha", f"public/audio/letters/en/{letter}_{idx}.m4a", rate="160")
        generate_voice(f"{letter}，{name_cn}！", "Tingting", f"public/audio/letters/zh/{letter}_{idx}.m4a")
        
        # Also copy bilingual to root
        shutil.copyfile(f"public/audio/letters/bilingual/{letter}_{idx}.m4a", f"public/audio/letters/{letter}_{idx}.m4a")

# 2. Numbers in 3 Language Modes (Direct number pronunciation, no '数字'/'Number')
numbers_data = [
    (0, 'Zero', '零', '个神奇蛋'),
    (1, 'One', '一', '只小毛鸡'),
    (2, 'Two', '二', '只小天鹅'),
    (3, 'Three', '三', '只彩蝴蝶'),
    (4, 'Four', '四', '只跳跳蛙'),
    (5, 'Five', '五', '颗金星星'),
    (6, 'Six', '六', '只海豚宝宝'),
    (7, 'Seven', '七', '道七彩虹'),
    (8, 'Eight', '八', '只小章鱼'),
    (9, 'Nine', '九', '个大热气球')
]

for num, name_en, name_cn, count_str in numbers_data:
    # Bilingual: "5，Five，五，5 颗金星星！"
    generate_voice(f"{num}，{name_en}，{name_cn}，{num} {count_str}！", "Tingting", f"public/audio/numbers/bilingual/{num}.m4a")
    # English only: "5, Five!"
    generate_voice(f"{num}, {name_en}!", "Samantha", f"public/audio/numbers/en/{num}.m4a", rate="160")
    # Chinese only: "5，五，5 颗金星星！"
    generate_voice(f"{num}，{name_cn}，{num} {count_str}！", "Tingting", f"public/audio/numbers/zh/{num}.m4a")
    
    # Also copy bilingual to root of public/audio/numbers/
    shutil.copyfile(f"public/audio/numbers/bilingual/{num}.m4a", f"public/audio/numbers/{num}.m4a")

# 3. Language Switch Announcement Prompts
generate_voice("已开启中英双语发音！", "Tingting", "public/audio/prompts/mode_bilingual.m4a")
generate_voice("English voice mode activated!", "Samantha", "public/audio/prompts/mode_en.m4a", rate="160")
generate_voice("已开启纯中文发音！", "Tingting", "public/audio/prompts/mode_zh.m4a")

# 4. Quest & Game Mode Prompts
generate_voice("请在键盘上找到目标并按下！", "Tingting", "public/audio/prompts/balloon_start.m4a")
generate_voice("小火车进站啦，按数字键装满车厢吧！", "Tingting", "public/audio/prompts/train_start.m4a")
generate_voice("太棒啦，答对啦！", "Tingting", "public/audio/prompts/correct.m4a")

print("All root and multi-language audio files refreshed without any prefixes!")
