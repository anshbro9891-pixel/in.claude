export const INCLAW_VERSION = "1.0.0";

export const SUPPORTED_MODELS = [
  {
    id: "codellama-34b",
    name: "CodeLlama 34B",
    provider: "Meta",
    description: "Specialized for code generation, completion, and infilling",
    parameters: "34B",
    license: "Llama 2 Community",
    strengths: ["Code Generation", "Code Completion", "Debugging"],
  },
  {
    id: "deepseek-coder-33b",
    name: "DeepSeek Coder 33B",
    provider: "DeepSeek AI",
    description: "Trained on 2T tokens with 87% code and 13% natural language",
    parameters: "33B",
    license: "DeepSeek License",
    strengths: ["Multi-language", "Code Reasoning", "FIM Support"],
  },
  {
    id: "starcoder2-15b",
    name: "StarCoder2 15B",
    provider: "BigCode / Hugging Face",
    description: "Trained on The Stack v2 dataset, 619 programming languages",
    parameters: "15B",
    license: "BigCode Open RAIL-M",
    strengths: ["619 Languages", "Fill-in-Middle", "Long Context"],
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Mistral AI",
    description: "Sparse Mixture of Experts model with strong coding abilities",
    parameters: "46.7B (12.9B active)",
    license: "Apache 2.0",
    strengths: ["Reasoning", "Multi-task", "Fast Inference"],
  },
  {
    id: "llama3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "State-of-the-art open model with exceptional coding performance",
    parameters: "70B",
    license: "Llama 3 Community",
    strengths: ["Advanced Reasoning", "Code Quality", "Instruction Following"],
  },
  {
    id: "qwen2.5-coder-32b",
    name: "Qwen2.5 Coder 32B",
    provider: "Alibaba Cloud",
    description: "Purpose-built coding model rivaling proprietary alternatives",
    parameters: "32B",
    license: "Apache 2.0",
    strengths: ["Code Repair", "Multi-language", "Agentic Coding"],
  },
] as const;

export const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Rust",
  "Go",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "C#",
  "SQL",
  "HTML/CSS",
  "Shell/Bash",
] as const;

export const FEATURES = [
  {
    title: "Agentic Code Generation",
    description:
      "INCLAW doesn't just autocomplete — it plans, reasons, and generates entire modules with full context awareness.",
    icon: "brain",
  },
  {
    title: "Multi-Model Architecture",
    description:
      "Ensemble of open-source LLMs working together. CodeLlama, DeepSeek, StarCoder2, and more — pick the best for your task.",
    icon: "layers",
  },
  {
    title: "Intelligent Debugging",
    description:
      "Paste your error, get a fix. INCLAW analyzes stack traces, understands root causes, and generates corrected code.",
    icon: "bug",
  },
  {
    title: "619+ Languages",
    description:
      "From Python to Rust, JavaScript to COBOL — INCLAW writes fluent code in hundreds of programming languages.",
    icon: "globe",
  },
  {
    title: "Open Source & Transparent",
    description:
      "Built on fully open-source models. No black boxes, no vendor lock-in. Inspect, modify, and self-host everything.",
    icon: "unlock",
  },
  {
    title: "Made in India 🇮🇳",
    description:
      "Proudly built from India for the world. Supporting the vision of Digital India and Atmanirbhar Bharat in AI.",
    icon: "flag",
  },
] as const;

export const DEMO_CONVERSATIONS = [
  {
    prompt: "Write a Python function to find the longest palindromic substring",
    response: `def longest_palindrome(s: str) -> str:
    """Find the longest palindromic substring using expand-around-center."""
    if len(s) < 2:
        return s
    
    start, max_len = 0, 1
    
    def expand(left: int, right: int) -> None:
        nonlocal start, max_len
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > max_len:
                start = left
                max_len = right - left + 1
            left -= 1
            right += 1
    
    for i in range(len(s)):
        expand(i, i)      # Odd length palindromes
        expand(i, i + 1)  # Even length palindromes
    
    return s[start:start + max_len]

# Example usage
print(longest_palindrome("babad"))  # Output: "bab" or "aba"
print(longest_palindrome("cbbd"))   # Output: "bb"`,
    language: "python",
    model: "CodeLlama 34B",
  },
  {
    prompt: "Create a REST API endpoint in Express.js with JWT authentication",
    response: `import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware: Verify JWT token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// POST /login - Generate JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validate credentials (replace with real auth)
  if (username === 'admin' && password === 'secret') {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, {
      expiresIn: '1h',
    });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// GET /protected - Protected route
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    language: "javascript",
    model: "DeepSeek Coder 33B",
  },
  {
    prompt: "Implement a concurrent web scraper in Rust",
    response: `use reqwest;
use scraper::{Html, Selector};
use tokio;
use futures::future::join_all;

#[derive(Debug)]
struct PageData {
    url: String,
    title: String,
    links: Vec<String>,
}

async fn scrape_page(url: &str) -> Result<PageData, Box<dyn std::error::Error>> {
    let response = reqwest::get(url).await?.text().await?;
    let document = Html::parse_document(&response);
    
    let title_sel = Selector::parse("title").unwrap();
    let link_sel = Selector::parse("a[href]").unwrap();
    
    let title = document
        .select(&title_sel)
        .next()
        .map(|el| el.inner_html())
        .unwrap_or_default();
    
    let links: Vec<String> = document
        .select(&link_sel)
        .filter_map(|el| el.value().attr("href"))
        .map(String::from)
        .collect();
    
    Ok(PageData {
        url: url.to_string(),
        title,
        links,
    })
}

#[tokio::main]
async fn main() {
    let urls = vec![
        "https://example.com",
        "https://httpbin.org",
        "https://rust-lang.org",
    ];
    
    let tasks: Vec<_> = urls
        .iter()
        .map(|url| scrape_page(url))
        .collect();
    
    let results = join_all(tasks).await;
    
    for result in results {
        match result {
            Ok(data) => println!("{}: {} ({} links)", data.url, data.title, data.links.len()),
            Err(e) => eprintln!("Error: {}", e),
        }
    }
}`,
    language: "rust",
    model: "StarCoder2 15B",
  },
] as const;
