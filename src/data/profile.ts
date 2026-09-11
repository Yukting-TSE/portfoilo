import { publicUrl } from "../lib/publicUrl";

export const profile = {
  name: "謝玉婷",
  englishName: "Yukting Tse",
  logo: "Yukting®",
  roles: [
    "Interaction Designer",
    "HCI Researcher",
    "Creative Technologist",
  ],
  location: "Shanghai / Saint-Étienne",
  typewriter:
    "Hola! I'm Yukting TSE — an interaction designer & media artist exploring HCI, narrative media, and embodied experience.",
  heroVideo: publicUrl("videos/hero.mp4"),
  metadata: ["Interaction Design", "Research", "Creative Technology", "2026"],
  bio: "Hola! 我是谢玉婷，一名专注于人机交互与数字媒体的设计师。我喜欢旅游吃饭和发呆。即将毕业于同济大学机械方向交互设计专业，法国圣埃蒂安高等艺术与设计学院的媒体设计专业硕士双学位。我关注技术、叙事与情感体验的结合，热衷于通过交互设计、展览与实验性项目，把概念转化为可感知的体验，也持续探索 AI、编程与设计研究的更多可能性。期待有一天能和你合作！",
  aboutLabel: "",
  aboutHeadline: "Make technology feel human.",
  aboutLeft:
    "设计简单、好奇且令人记住的交互体验，让人与技术之间的距离变得更近，让每一次触碰、回应与参与，都成为值得记住的体验。",
  aboutRight:
    "从 AI 到具身交互，我探索技术如何感知人、回应人，并成为我们生活与感知世界的一部分。",
  email: "yukting@tongji.edu.cn",
  phone: "+86 13694960273",
  social: {
    linkedin: "",
    github: "",
    instagram: "",
  },
  pills: [
    { label: "人机交互", href: "#cat-hci" },
    { label: "媒体艺术", href: "#cat-media" },
    { label: "商业合作", href: "#cat-commercial" },
    { label: "个人简历", href: "/about" },
  ],
};

export type Profile = typeof profile;
