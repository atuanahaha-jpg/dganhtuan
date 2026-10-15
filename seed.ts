import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("ChangeMe-123!");
  const user = await prisma.user.upsert({
    where: { email: "demo@photoshop.local" },
    update: {},
    create: {
      email: "demo@photoshop.local",
      username: "photoshop_demo",
      name: "Photoshop Demo",
      bio: "Curating beautiful moments from around the world.",
      passwordHash
    }
  });

  const examples = [
    {
      slug: "alpine-dreams",
      title: "Alpine Dreams",
      description: "Quiet mornings, glassy water, and mountains that seem to touch the sky.",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      altText: "Mountain lake surrounded by green alpine hills",
      tags: ["nature", "mountains", "travel"]
    },
    {
      slug: "city-after-dark",
      title: "City After Dark",
      description: "The city becomes a different world after sunset.",
      url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
      altText: "City skyline illuminated at night",
      tags: ["city", "night", "architecture"]
    },
    {
      slug: "golden-hour",
      title: "Golden Hour",
      description: "A little warmth at the end of a long day.",
      url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
      altText: "Golden sunlight over a peaceful landscape",
      tags: ["sunset", "landscape", "nature"]
    },
    {
      slug: "curious-companion",
      title: "Curious Companion",
      description: "Small details make the best stories.",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      altText: "Cat looking toward the camera",
      tags: ["animals", "cat", "portrait"]
    },
    {
      slug: "ocean-state",
      title: "Ocean State",
      description: "Blue horizons and a slower pace.",
      url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      altText: "Ocean waves under a bright sky",
      tags: ["ocean", "travel", "blue"]
    },
    {
      slug: "quiet-architecture",
      title: "Quiet Architecture",
      description: "Simple shapes, soft light, and clean lines.",
      url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2",
      altText: "Modern architectural structure viewed from below",
      tags: ["architecture", "minimal", "design"]
    }
  ];

  for (const item of examples) {
    const post = await prisma.post.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        title: item.title,
        description: item.description,
        userId: user.id,
        images: {
          create: [{
            url: item.url,
            thumbnailUrl: item.url,
            altText: item.altText,
            mimeType: "image/jpeg",
            sizeBytes: 0,
            position: 0
          }]
        },
        tags: {
          create: await Promise.all(item.tags.map(async (name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } }
          })))
        }
      }
    });
    void post;
  }
  console.log("Seed complete. Demo login: demo@photoshop.local / ChangeMe-123!");
}

main().finally(async () => prisma.$disconnect());
