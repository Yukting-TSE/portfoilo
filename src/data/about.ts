import type { ProjectDetail } from "./projectDetail";
import { profile } from "./profile";

export const aboutDetail: ProjectDetail = {
  eyebrow: "About Me",
  headline: `${profile.name} ${profile.englishName}`,
  meta: [{ label: "Email", value: profile.email }],
  services: { label: "Contact", value: profile.phone },
  lead: [],
  sections: [
    {
      type: "part",
      number: "01",
      title: "Education",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "同济大学 · 机械方向交互设计（硕士）",
          paragraphs: [
            "2023.9 – 2026.6。核心课程：用户体验设计、商业模式、设计数据分析、服务设计、设计思维、人机协作产品与系统设计、数据驱动基于实证的设计。",
            "获奖与发表：第一作者论文投稿 CHI 2027；第一作者论文发表于 HCII 2025；第一作者论文海报发表于 CSCW 2024；第二作者论文海报发表于 UIST 2025。作品曾展出于荷兰设计周、米兰设计周、第十四届全国美术作品展、瀫石光·生态艺术廊道及 2022 文创博览会。",
          ],
        },
        {
          type: "prose",
          title: "南京艺术学院 · 视觉传达设计（学士）",
          paragraphs: [
            "2018.9 – 2022.6。核心课程：互动媒体艺术、实验电影、现代与当代艺术史。",
            "获奖：金奖，中国可视化大会数据可视化；国家级一等奖，第十七届中国创意设计大赛；铜奖，第 21 届白金创意国际大学生平面设计大赛；省级二等奖，第 11 届未来设计师全国数位艺术设计大赛等。",
          ],
        },
      ],
      right: [
        {
          type: "prose",
          title: "ESAD Saint-Étienne · 媒体设计（硕士双学位）",
          paragraphs: [
            "2024.9 – 2025.6。核心课程：人工智能互动媒体艺术、装置艺术、材料研究与实验。",
            "作品曾展出于香港理工大学「多元宇宙—文化与艺术科技展」及法国圣艾蒂安设计双年展。",
          ],
        },
      ],
    },
    {
      type: "part",
      number: "02",
      title: "Project Experience",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "非视觉交互中的错误恢复与任务相关映射 · 实证研究",
          paragraphs: [
            "2026。在特殊教育学校完成两项实验（N = 19）：规定路径上同时记录错误与条件恢复，并以刻意错位的深度音高探测「听得见」是否等于「用得上」；投稿 CHI 2027。",
          ],
        },
        {
          type: "prose",
          title: "AI 助手辅助用户研究 · 交互设计师",
          paragraphs: [
            "2025.05。项目 Co-Researcher 增强以人为中心的设计工作流；主导用户研究与交互设计，构建人机协同共创模式；第一作者论文发表于 HCII 2025。",
          ],
        },
        {
          type: "prose",
          title: "FitPal：AI 聊天机器人与社区服务 · 交互设计师",
          paragraphs: [
            "2024.11。主导面向老年人运动认知的 AI 聊天机器人设计与研发，开展用户研究并将洞察转化为个性化体验；第一作者论文发表于 CSCW 2024 Poster。",
          ],
        },
        {
          type: "prose",
          title: "OPPO × 网球锦标赛 · IP 设计师",
          paragraphs: [
            "2022.03。主导设计小欧的网球主题版本，将 OPPO 科技基因与温网品牌元素融合；与赛事主办方持续沟通，统筹跨职能团队协作，优化 3D 模型与版式，并在赛事期间完成现场发布。",
          ],
        },
      ],
      right: [
        {
          type: "prose",
          title: "icmd^：智能配件的交互机制创新 · 交互设计师",
          paragraphs: [
            "2024.06。主导智能配件游戏控制器的设计与研发，基于 Apple 配件陀螺仪、加速度计与高速信号传输，探索轻量级游戏化交互，降低学习成本并增强品牌生态粘性。",
          ],
        },
        {
          type: "prose",
          title: "大数据分析系统技术在金融投教与决策过程交互创新 · 交互设计师",
          paragraphs: [
            "2024.01。与蚂蚁数智服务设计联合实验室合作，参与基于 AI 的金融教育系统设计，将被动图表阅读转化为互动式情境化学习；第二作者论文发表于 UIST 2025 Poster。",
          ],
        },
        {
          type: "prose",
          title: "扬州小秦淮河多媒体展览 · 新媒体设计师",
          paragraphs: [
            "2021.12。由扬州市广陵区政府、苏州金螳螂及南京米点创意工作室联合主办；参与媒体装置互动视频内容创作，强化视觉叙事与观众沉浸感。",
          ],
        },
      ],
    },
    {
      type: "part",
      number: "03",
      title: "Work Experience",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "Startbase 星基原科技（深圳）有限公司 · 联合创始人及 CDO",
          paragraphs: [
            "2025.10 – 至今。全面负责技术产品工作，涵盖技术战略、产品架构、UI/UX、开发与团队管理；负责从产品路线图、需求分析、原型到上线与展览策划的完整流程。",
          ],
        },
        {
          type: "prose",
          title: "问象艺术空间 · 网站设计师 & 展览助理",
          paragraphs: [
            "2019.9 – 2020.7，南京。从零构建官方网站，结合竞品与用户行为分析优化体验；运用 SEO 提升自然流量，通过内容与线上曝光支持展览营销与艺术品销售。",
          ],
        },
      ],
      right: [
        {
          type: "prose",
          title: "南京米点创意文化有限公司 · 媒体设计师",
          paragraphs: [
            "2021.9 – 2022.3。通过用户调研、竞争分析与趋势研究协助制定创意方案；担任团队与客户联络人，将需求转化为可执行设计任务，支持互动媒体设计创新与原型制作。",
          ],
        },
      ],
    },
    {
      type: "part",
      number: "04",
      title: "Skills",
    },
    {
      type: "columns",
      align: "start",
      left: [
        {
          type: "prose",
          title: "工具与编程",
          paragraphs: [
            "交互媒体：Unreal Engine、Unity、TouchDesigner、Arduino。平面与 3D：Figma、Adobe Illustrator、C4D、Blender。视频：After Effects。基础编程：Python、HTML & CSS。",
          ],
        },
      ],
      right: [
        {
          type: "prose",
          title: "语言",
          paragraphs: [
            "普通话（母语）、粤语（母语）、英语（雅思 5.5）、日语（流利）、法语（日常会话）。",
          ],
        },
      ],
    },
  ],
};
