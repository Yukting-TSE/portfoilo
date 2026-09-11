import { publicUrl } from "../../lib/publicUrl";
import type { ProjectDetail } from "../projectDetail";

const img = (filename: string) =>
  publicUrl(`images/projects/choir-bot/${filename}`);

export const choirBotDetail: ProjectDetail = {
  cover: {
    src: publicUrl("images/projects/choir-bot/cover.mp4"),
    poster: publicUrl("images/projects/choir-bot.jpg"),
    alt: "Choir Bot声光互动装置",
    video: true,
    soundToggle: true,
  },
  eyebrow: "Case Study",
  meta: [
    { label: "Co-designer", value: "谢玉婷；许昕" },
    { label: "Keyword", value: "多模态交互；生成式音乐；声光映射" },
    { label: "Time", value: "2022" },
    { label: "Tutor", value: "童芳" },
  ],
  lead: [
    "在算法与数据日益介入日常情感生活的今天，人向技术寻求告慰的方式，正在替代传统宗教里向神忏悔的路径；而忏悔本身，也不再只是求宽恕，更像一场人对自我的救赎。当语言难以承载遗憾、愧疚与未竟之言，Choir Bot 转而以声音、音乐与光搭建另一条情感通路：观者向麦克风倾诉，系统回避语义识别，将声学特征转译为教堂乐器音乐，再驱动蓝色激光射向天空，让那些尚未说出的话沿声音、音乐与光被送出体外。",
    "展出于浙江龙游瀫石光·艺术生态走廊（雷电所赞助），并参与米兰设计周、荷兰设计周；收录于《100个D&I学生获奖作品》；获第十七届中国好创意暨全国数字艺术设计大赛一等奖。",
  ],
  sections: [
    {
      type: "part",
      number: "01",
      title: "Research Background",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "文字失效",
          paragraphs: [
            "在当代社会中，语言作为一种高度理性化、社会化的沟通工具，往往优先服务于效率、秩序与功能性表达，而非个体真实而脆弱的情感经验。心理学与传播学研究指出，人们在面对遗憾、愧疚、未竟的情感或难以启齿的愿望时，往往会经历「表达阻滞」（expressive inhibition），即情感存在但无法被准确说出。",
            "尤其是在涉及遗憾、歉意、欲望、死亡、分离等情境时，人们往往会主动回避直接的语言表达。《Choir Bot》的研究背景正是基于这一现实问题展开：当语言作为主要沟通媒介失效时，是否可以通过其他感官通道，构建一条替代性的情感表达路径，使这些「尚未说出的话」得以被释放，而非被压抑？",
            "语音在进入语言系统之前，本身就是一种高度情绪化的信号，其音高、音量、节奏与音色中天然携带着说话者的心理状态信息。相比文本，声音更接近情感生成的源头。",
            "《Choir Bot》刻意回避语义识别，而将声音视为一种「未被社会编码的情感原材料」。观众在麦克风前说出的并不是「需要被系统理解的话」，而是一段可以被分解、转译和重新组织的声学数据：无需担心「说得对不对」，而只需「说出来」。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-07.png"),
              caption: "Installation detail · blue laser & metal structure",
            },
          ],
        },
      ],
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "唱诗班与神圣之光",
          paragraphs: [
            "单纯的声音仍是碎片化的。《Choir Bot》引入音乐作为中介：Susanne Langer 认为，音乐呈现情感的形式，而非指向具体对象；它模拟情绪在时间中的起伏与释放。",
            "教堂唱诗班正是这一原型：多声部人声不必依赖逐字语义，却能托起敬畏、忏悔与安慰；光在教堂中亦非单纯照明，而是指引向上、标示神圣。声与光在礼拜中协作，完成可感的「传递」与「升华」。《Choir Bot》由此以类唱诗的音乐回应声音，再以激光射向天空，延续那条出口。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-03.png"),
              caption: "Music as ritual mediator",
            },
          ],
        },
      ],
    },
    {
      type: "part",
      number: "02",
      title: "System & Experience",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "装置材料",
          paragraphs: [
            "《Choir Bot》的主体由银灰色金属结构支撑，骨架同时承载麦克风、激光矩阵与棱镜等核心部件，使装置在形态上介于工业构件与仪式器物之间。",
            "视觉主色为蓝色激光：光线自金属内部发出，经棱镜改变路径后射向天空。银灰色表面与冷蓝光束并置，形成介于科技感与宗教仪式感之间的材料氛围。",
            "配套展览 zine 以银色印刷与不同纸张质感回应装置本身的光反射特性，把金属与激光的材料经验延展到平面阅读之中。",
          ],
        },
        {
          type: "prose",
          title: "声光转译系统",
          paragraphs: [
            "项目将声音特征转译为 MIDI 信号，并进一步生成以管风琴、长笛、单簧管等教堂乐器为主的自动化音乐。这些乐器在西方文化中长期与宗教、祈祷与精神空间相关联，其音色天然带有庄重、超越日常的情绪指向，形成「被回应」的情感回路。",
            "在完成从声音到音乐的转译之后，《Choir Bot》进一步引入「光」作为情感路径的最终出口。光具有明确的方向性与空间指向性，非常适合象征「传递」「升华」与「离开身体」的过程。",
            "音乐的节奏与强度被映射为激光矩阵的发射频率与路径变化，使光成为音乐的视觉化延伸。激光从装置内部出发，经由棱镜改变路径后射向天空，形成一条清晰但不可触的「沟通通道」。情感不再停留于身体或装置内部，而是被「送出」至更大的自然与公共空间之中。",
            "装置通过麦克风捕捉观众的声音，关注其音高、音量、频谱等声学特征，而非语义内容，保证了表达的私密性与真实性。通过 TouchDesigner，声音被解析为 MIDI 信号，并利用 OSC 协议传输至 Ableton Live，由软件根据声学特征自动生成以管风琴、长笛和单簧管等教堂乐器为主的音乐。",
            "音乐的生成进一步驱动光的表达：通过激光矩阵，音乐的节奏、强弱和频率变化被映射为激光发射的路径与速度，光线从装置内部出发，经过棱镜折射后射向天空，将个体的声音与情绪引向外部空间。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-08.jpg"),
              caption: "On-site documentation，瀫石光",
            },
            {
              src: img("fig-04.png"),
              caption: "Laser matrix · light as transmission path",
            },
          ],
        },
      ],
    },
    {
      type: "part",
      number: "03",
      title: "Exhibition",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "瀫石光·艺术生态廊道",
          paragraphs: [
            "作品展出于浙江省衢州市龙游县的「瀫石光·艺术生态走廊」，沿 5 公里河岸展开，由雷电所艺术机构赞助。展览强调公共空间、自然景观与艺术的融合；观众通过简单的声音输入即可生成复杂的音乐与光影组合，完成一场私人情感向外部空间的投射。",
          ],
        },
        {
          type: "prose",
          title: "米兰设计周 2024",
          paragraphs: [
            "由同济大学设计创意学院带领，于 2024 米兰设计周 SaloneSatellite 卫星沙龙展出。",
          ],
        },
        {
          type: "prose",
          title: "荷兰设计周 2024",
          paragraphs: [
            "由同济大学设计创意学院带领，于 2024 荷兰设计周（埃因霍温）FMTTM 数字展览装置中展出。",
          ],
        },
        {
          type: "prose",
          paragraphs: [
            "收录于《100个D&I学生获奖作品》。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-05.png"),
              caption:
                "展出记录 · 米兰设计周 SaloneSatellite / 荷兰设计周 Fly Me to the Moon；收录于《100个D&I学生获奖作品》",
            },
          ],
        },
      ],
    },
  ],
};
