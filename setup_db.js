const db = require('./db');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
  try {
    // Create Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Users Table Created or Exists");

    // Create Projects Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        challenge TEXT,
        solution TEXT,
        results TEXT[], -- Array of strings
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Projects Table Created or Exists");

    // Check if Admin exists
    const checkAdmin = await db.query("SELECT * FROM users WHERE email = 'admin@nrt.com'");

    if (checkAdmin.rows.length === 0) {
      // Create Default Admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await db.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
      `, ['Super Admin', 'admin@nrt.com', hashedPassword, 'superadmin']);

      console.log("✅ Default Admin Created: admin@nrt.com / admin123");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    // Create Services Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        image_url VARCHAR(500),
        features TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Services Table Created or Exists");

    // Seed Services
    const services = [
      {
        title: "AI / Machine Learning & Generative AI",
        description: "Chatbots, AI agents, recommendation systems. Building intelligent solutions for complex problems.",
        icon: "Cpu",
        image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        features: ["Python, TensorFlow/PyTorch", "LLM APIs, Prompt Engineering", "Chatbots & AI Agents", "Recommendation Systems"]
      },
      {
        title: "Full-Stack Web Development (Modern Stack)",
        description: "Stable & evergreen niche. Modern web applications built with scalable technologies.",
        icon: "Globe",
        image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
        features: ["React, Next.js, Vue", "Node.js, Django, FastAPI", "Databases & Cloud Integration", "Modern Tech Stack"]
      },
      {
        title: "Cloud Computing & DevOps",
        description: "Product companies + startups ka backbone. Scalable infrastructure and automated deployment pipelines.",
        icon: "Cloud",
        image_url: "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80&w=1000",
        features: ["AWS, Azure, GCP", "Docker, Kubernetes, CI/CD", "Infrastructure as Code", "Scalable Architecture"]
      },
      {
        title: "Cybersecurity",
        description: "AI ke baad fastest-growing field. Protecting applications and infrastructure with advanced security protocols.",
        icon: "Shield",
        image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
        features: ["App & Cloud Security", "DevSecOps", "Penetration Testing", "Secure Coding Practices"]
      },
      {
        title: "Mobile App Development",
        description: "Startup & freelance friendly. Native and cross-platform mobile experiences for iOS and Android.",
        icon: "Smartphone",
        image_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000",
        features: ["Flutter, React Native", "Android (Kotlin), iOS (Swift)", "Cross-Platform Solutions", "Mobile-First Design"]
      },
      {
        title: "Data Engineering & Big Data",
        description: "AI/Data teams ke liye must-have. Robust data pipelines and analytics infrastructure.",
        icon: "Database",
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        features: ["Data Pipelines (ETL)", "Spark, Kafka", "SQL + Python", "Big Data Analytics"]
      },
      {
        title: "Blockchain & Web3",
        description: "Selective but High-Pay. Decentralized applications and smart contract development.",
        icon: "Blocks",
        image_url: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000",
        features: ["Smart Contracts (Solidity, Rust)", "DeFi Solutions", "NFT Marketplaces", "Web3 Integration"]
      },
      {
        title: "Automation / RPA",
        description: "Quick learning + fast ROI. Streamlining business processes with intelligent automation.",
        icon: "Workflow",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
        features: ["Selenium, Playwright", "Business Process Automation", "Python Automation", "Workflow Optimization"]
      }
    ];

    for (const service of services) {
      const check = await db.query("SELECT * FROM services WHERE title = $1", [service.title]);
      if (check.rows.length === 0) {
        await db.query(
          'INSERT INTO services (title, description, icon, image_url, features) VALUES ($1, $2, $3, $4, $5)',
          [service.title, service.description, service.icon, service.image_url, service.features]
        );
        console.log(`✅ Added Service: ${service.title}`);
      } else {
        console.log(`ℹ️ Service already exists: ${service.title}`);
      }
    }

  } catch (err) {
    console.error("❌ Database Setup Failed:", err);
  } finally {
    process.exit();
  }
};

setupDatabase();
