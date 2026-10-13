import { publicUrl } from "../../lib/publicUrl";
import type { ProjectDetail } from "../projectDetail";

const img = (filename: string) =>
  publicUrl(`images/projects/icmd/${filename}`);

export const icmdDetail: ProjectDetail = {
  cover: {
    src: img("cover.mp4"),
    poster: publicUrl("images/projects/icmd.png"),
    alt: "icmd^ 智能配件的游戏交互创新",
    video: true,
    soundToggle: true,
  },
  eyebrow: "Case Study",
  meta: [
    { label: "Co-designer", value: "谢玉婷；陈宁子" },
    {
      label: "Role",
      value: "交互原型开发 · 项目调研",
    },
    {
      label: "Keyword",
      value: "游戏交互创新 · 物导向设计 · 游戏交互原型 · 传感器与空间计算",
    },
    { label: "Time", value: "2024" },
    { label: "Tutor", value: "郁新安" },
  ],
  lead: [
    "icmd^是针对智能配件游戏化交互机制的创新性研究。该研究立足于智能配件产品交互形式单一的痛点——例如 Apple Pencil 仅限于屏幕交互。通过利用苹果系列智能配件内置的陀螺仪和加速度计，结合 SDK 与蓝牙等信号传输技术，实现与 iPhone、iPad 等移动设备的交互；结合直观交互形式降低用户学习成本，重构人与日常物品之间的联系。",
    "主要负责交互原型开发与项目调研：梳理智能配件的传感能力与使用场景，并落地可玩的游戏化交互原型。",
    "此项目已申请相关专利，专利号：ZL 2025 2 1573005.3",
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
          title: "智能配件的游戏交互机遇",
          paragraphs: [
            "智能配件以不同方式塑造用户的数字产品体验，例如 AirPods 已成为智能手机用户不可或缺的组成部分。智能配件为突破传统控制器范式提供了充满前景的游戏交互机遇。通过整合空间计算能力并融入具身认知原理，未来游戏控制器设计将能提升用户的沉浸式游戏体验。",
            "个人智能配件是具备情境感知能力的电子设备，可通过有线或无线连接自主计算并与其他设备交换数据。这类配件专为 iPhone、iPad 等平台设计，通过多种传感器实现环境情境感知，从而提供扩展功能。这种交互能力对智能配件融入更广泛的物联网生态至关重要。",
            "近年来，智能设备的发展重点在于将智能手机作为游戏控制器使用。同时，研究人员还探索将其作为沉浸式增强现实交互设备，通过熟悉的界面和精准的触控输入，开辟出多样化的交互技术与应用场景。(Arda, 2021; Rishi, 2020)",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-concept-b.png"),
              caption: "Fig.1  the Smart accessories of Apple",
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
          title: "智能配件的空间计算能力",
          paragraphs: [
            "诸如 Apple Pencil Pro、Apple Watch（第 9 代）和 AirPods Pro 2 等智能配件均配备陀螺仪和加速度计，从而具备空间计算能力。这些传感器能高精度检测空间运动，使其成为游戏环境中空间控制器的理想选择。",
            "例如，iWatch 的加速度计 + 陀螺仪组合实现了摇杆的核心功能 / 3D 空间感知能力。但尚未作为游戏控制器使用，为用户定制化 / 体验优化留有空间。",
          ],
        },
        {
          type: "figure",
          figures: [
            {
              src: img("fig-sensor-compare.png"),
              caption: "Fig.3  Interaction Concept Map",
              scale: 0.3,
              invert: true,
            },
          ],
        },
        {
          type: "prose",
          paragraphs: [
            "其紧凑的体积以及在智能手机和平板电脑用户中的广泛普及，使得它们比传统游戏手柄更易于获得。",
          ],
        },
      ],
      right: [
        {
          type: "table",
          table: {
            caption:
              "Fig.2  Comparison of the Smart accessories; Common game controllers have accelerometers, gyroscopes, which can achieve the core functions of the joystick / 3D space perception",
            headers: [
              "Sensor Type",
              "Apple Pencil Pro",
              "AirPods Pro",
              "Apple Watch",
              "Joy-Con",
            ],
            rows: [
              ["Pressure Sensor", "●", "", "", ""],
              ["Gyroscope", "●", "●", "●", "●"],
              ["Tactile Engine", "", "", "●", "●"],
              ["U1 Chip", "●", "", "", ""],
              ["Dual Optical Sensors", "", "", "", "●"],
              ["Motion Accelerometer", "●", "●", "●", "●"],
              ["Voice Accelerometer", "", "●", "", ""],
              ["GPS / Navigation", "", "", "●", ""],
              ["Compass", "", "", "●", ""],
              ["Altimeter", "", "", "●", ""],
              ["Blood Oxygen Sensor", "", "", "●", ""],
              ["Electrode Heart Rate Sensor", "", "", "●", ""],
              ["Ambient Light Sensor", "", "", "●", ""],
              ["Infrared Motion Sensor", "", "", "", "●"],
            ],
          },
        },
      ],
    },
    {
      type: "part",
      number: "02",
      title: "Potential and scalability",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "现状与问题",
          paragraphs: [
            "当前智能配件产品的交互形式相对简单，缺乏创新性和多样性。用户在使用过程中常感到乏味和疲劳，降低了整体使用体验。",
          ],
        },
        {
          type: "prose",
          title: "市场需求",
          paragraphs: [
            "市场上对易于使用且高度互动的游戏控制器存在显著需求。用户希望能够快速掌握新产品，尤其在游戏领域，快速上手和享受体验是主要诉求。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-smartphone-accessories.png"),
              caption: "Fig.3  Smartphone Accessories",
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
          title: "高学习成本壁垒",
          paragraphs: [
            "高昂的学习成本是用户尝试新产品时面临的普遍障碍。尤其在游戏领域，用户期望低学习成本，以便快速上手并享受体验。",
          ],
        },
        {
          type: "prose",
          title: "单一工具交互的局限性",
          paragraphs: [
            "在射击与解谜等多类型游戏中使用单一游戏控制器，会限制用户体验的感知效果。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("fig-design-explore.png"),
              caption: "Existing mobile controller paradigms",
            },
          ],
        },
      ],
    },
    {
      type: "part",
      number: "03",
      title: "Design Opportunities in Game Interaction",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "游戏控制器设计面临的当前挑战",
          paragraphs: [
            "在游戏领域，任天堂的「1-2-Switch」试图将物理交互与 Joy-Con 控制器相结合。然而，传统游戏控制器的静态形态限制了用户能够体验的沉浸式交互范围。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("goal-3.png"),
              caption: "Reference — physical play with Joy-Con style controllers",
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
          title: "设计探索",
          paragraphs: [
            "例如韩国设计师 Yehwan Song 的作品，强调用户动作触发设备响应的具身化视角，形成动态反馈循环。她的网络设计通过将屏幕比作口琴等手法，展现出丰富的交互形式，从而增强数字空间与物理空间之间的互动。",
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("goal-2.png"),
              caption: "Embodied / experimental interaction references",
            },
          ],
        },
      ],
    },
    {
      type: "part",
      number: "04",
      title: "Design innovation",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "goals",
          items: [
            {
              title: "创新交互形式",
              body: "利用智能配件自带的传感器与设备进行通信，拓展智能配件的交互可能性，提供多样化的游戏体验。",
            },
            {
              title: "便携性与易用性",
              body: "将便携且易于获取的智能配件转化为轻量级游戏控制器，使用户能够随时随地便捷使用，从而提升设备的使用率。",
            },
            {
              title: "直观体验",
              body: "通过直观交互降低学习成本，提升游戏体验，让用户更轻松地上手并沉浸于游戏世界。",
            },
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("proto-1-magic.png"),
              caption: "Fig.7  Prototype — modular handle / magnetic assembly",
            },
          ],
        },
      ],
    },
    {
      type: "part",
      number: "05",
      title: "Design Output",
    },
    {
      type: "prose",
      paragraphs: [
        "基于具身认知理论，特别是梅洛-庞蒂提出的「身体图式」概念——该理论认为身体是感知与行动的基础——我们倡导采用一种细致入微的游戏控制器设计方法。这种方法不仅能最大化个人智能配件的潜力，更能丰富用户与虚拟游戏环境的交互方式及感知体验。",
      ],
    },
    {
      type: "prototype",
      prototype: {
        index: "①",
        title: "Apple Pencil: 魔术棒 / 点亮星光",
        device: "Apple Pencil",
        based: "加速度计 + 陀螺仪",
        bullets: [
          "魔术棒！挥动魔杖，火焰将追随你的动作！",
          "绕圈挥动魔杖，即可变换色彩！",
          "点亮星光！挥动魔杖，点亮光芒！",
          "轻点两下，熄灭灯光！",
        ],
        figures: [
          {
            src: img("proto-2-flight.png"),
            caption: "Pencil 形态延展 — 魔术棒原型",
            scale: 0.2,
          },
          {
            src: img("demo-wand.gif"),
            caption: "魔术棒 / 点亮星光 — 动作驱动的光影反馈",
            gif: true,
          },
        ],
      },
    },
    {
      type: "prototype",
      prototype: {
        index: "②",
        title: "Apple Pencil: 飞机操控杆",
        device: "Apple Pencil",
        based: "加速度计 + 陀螺仪",
        bullets: [
          "在家里飞行吧！",
          "向前推 — 俯冲",
          "左右摇摆 — 控制方向",
          "向后拉 — 爬升",
        ],
        figures: [
          {
            src: img("proto-4-title.png"),
            caption: "Pencil 形态延展 — 操控杆原型",
            scale: 0.2,
          },
          {
            src: img("demo-flight.gif"),
            caption: "飞行模拟演示 — 配件作为空间控制器",
            gif: true,
          },
        ],
      },
    },
    {
      type: "prototype",
      prototype: {
        index: "③",
        title: "Apple Pencil: 滑板控制",
        device: "Apple Pencil",
        based: "加速度计 + 陀螺仪",
        bullets: ["向前推 — 加速", "向后拉 — 倒车", "左右摇摆 — 控制方向"],
        figures: [
          {
            src: img("proto-5-title.png"),
            caption: "滑板控制 — 配件形态",
            scale: 0.2,
          },
          {
            src: img("demo-skate.gif"),
            caption: "滑板控制 — Push / Rock / Pull 映射",
            gif: true,
          },
        ],
      },
    },
    {
      type: "prototype",
      prototype: {
        index: "④",
        title: "Apple Watch: 钓鱼小游戏",
        device: "Apple Watch",
        based: "陀螺仪 + Apple Watch 表冠",
        body: [
          "通过旋转 iWatch 内置陀螺仪来控制钓竿的方向。",
          "用户旋转摇杆式 iWatch 内置陀螺仪，即可沿直线控制钓竿的方向。",
        ],
        figures: [
          {
            src: img("proto-6-title.png"),
            caption: "钓鱼小游戏 — Watch 配件形态",
            scale: 0.2,
          },
          {
            src: img("demo-fishing.gif"),
            caption: "钓鱼小游戏 — Watch 姿态驱动虚拟机械臂",
            gif: true,
          },
        ],
      },
    },
    {
      type: "prototype",
      prototype: {
        index: "⑤",
        title: "AirPods: 指尖光剑",
        device: "AirPods",
        based: "加速度计",
        body: [
          "将 AirPods 戴在左右手指上，即可演奏指尖节奏音效。",
          "耳机内的加速度计会检测是否有动作发生。",
        ],
        figures: [
          {
            src: img("proto-extra-a.png"),
            caption: "指尖光剑 — AirPods 指环配件",
            scale: 0.2,
          },
          {
            src: img("demo-saber.gif"),
            caption: "指尖光剑 — AirPods 作为手部动作传感器",
            gif: true,
          },
        ],
      },
    },
    {
      type: "prototype",
      prototype: {
        index: "⑥",
        title: "AirPods: 真心话大冒险骰子",
        device: "AirPods",
        based: "加速度计",
        body: [
          "AirPods 内置的加速度计控制开关功能。",
          "摇动骰子盒即可揭晓新谜题。",
        ],
        figures: [
          {
            src: img("proto-extra-c.png"),
            caption: "真心话大冒险骰子 — 配件形态",
            scale: 0.2,
          },
          {
            src: img("demo-dice.gif"),
            caption: "真心话大冒险骰子 — 摇动配件触发新问题",
            gif: true,
          },
        ],
      },
    },
    {
      type: "part",
      number: "06",
      title: "Patent",
    },
    {
      type: "columns",
      align: "start",
      offsetTitle: false,
      left: [
        {
          type: "prose",
          title: "实用新型专利",
          paragraphs: [
            "本项目相关成果已获得国家知识产权局实用新型专利授权，专利名称为「基于触控笔的无轴力反馈摇杆输入设备」。专利权人为同济大学，发明人为郁新安、谢玉婷、陈宁子。专利号 ZL 2025 2 1573005.3，授权公告号 CN 224624992 U，申请日 2025年07月25日，授权公告日 2026年08月11日。",
            "该设备包括底座与摇臂组件。摇臂组件具有带插入槽的滚动摇臂，以及与底座固定相连的俯仰摇臂；滚动摇臂与俯仰摇臂弹性连接，俯仰摇臂与底座弹性连接，摇臂组件由此实现俯仰和横滚。触控笔可插入或拔出插入槽，插入后带动滚动摇臂和/或俯仰摇臂相对底座的垂向方向偏转。角度传感器检测触控笔的摇摆角度，信号传输模块将该角度传出。无轴结构可以避免有轴摇杆长期使用产生的磨损，结构简单，制造方便，成本低廉。",
          ],
        },
        {
          type: "figure",
          figures: [
            {
              src: img("patent-abstract.jpg"),
              alt: "基于触控笔的无轴力反馈摇杆输入设备摘要附图",
              caption: "摘要附图 · 底座、摇臂组件与触控笔",
              scale: 0.5,
            },
          ],
        },
      ],
      right: [
        {
          type: "figure",
          figures: [
            {
              src: img("patent-certificate.jpg"),
              alt: "基于触控笔的无轴力反馈摇杆输入设备实用新型专利证书",
              caption: "实用新型专利证书 · 专利号 ZL 2025 2 1573005.3",
            },
          ],
        },
      ],
    },
  ],
};
