import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model: string;
}

/**
 * INCLAW Chat API
 *
 * In production, this would route to actual open-source LLM inference backends:
 * - Ollama (local) — supports CodeLlama, DeepSeek, Mixtral, Llama3, etc.
 * - HuggingFace Inference API — for StarCoder2, CodeLlama, etc.
 * - vLLM / TGI — for high-throughput serving
 * - Together AI / Replicate — for cloud-hosted open models
 *
 * This demo implementation provides intelligent code responses to showcase
 * the INCLAW agent's capabilities.
 */

const CODE_TEMPLATES: Record<string, string> = {
  python: `\`\`\`python
def solution():
    """
    INCLAW-generated solution
    Clean, efficient, production-ready Python code.
    """
    pass
\`\`\``,
  javascript: `\`\`\`javascript
/**
 * INCLAW-generated solution
 * Modern, clean JavaScript following best practices.
 */
function solution() {
  // Implementation
}
\`\`\``,
  rust: `\`\`\`rust
/// INCLAW-generated solution
/// Safe, fast, idiomatic Rust code.
fn solution() {
    // Implementation
}
\`\`\``,
};

function generateResponse(messages: ChatMessage[], model: string): string {
  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage.content.toLowerCase();

  // Detect programming language from prompt
  const langMap: Record<string, string> = {
    python: "python",
    py: "python",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    java: "java",
    rust: "rust",
    go: "go",
    golang: "go",
    "c++": "cpp",
    cpp: "cpp",
    ruby: "ruby",
    php: "php",
    swift: "swift",
    kotlin: "kotlin",
    sql: "sql",
    react: "javascript",
    node: "javascript",
    express: "javascript",
    django: "python",
    flask: "python",
    fastapi: "python",
  };

  let detectedLang = "python";
  for (const [keyword, lang] of Object.entries(langMap)) {
    if (prompt.includes(keyword)) {
      detectedLang = lang;
      break;
    }
  }

  // Pattern matching for common coding requests
  if (prompt.includes("sort") && prompt.includes("linked list")) {
    return `I'll implement a merge sort for a linked list — it's the most efficient approach with O(n log n) time complexity.

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def sort_linked_list(head: ListNode) -> ListNode:
    """Sort a linked list using merge sort - O(n log n) time, O(log n) space."""
    if not head or not head.next:
        return head
    
    # Split the list into two halves
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None
    
    # Recursively sort both halves
    left = sort_linked_list(head)
    right = sort_linked_list(mid)
    
    # Merge sorted halves
    dummy = ListNode(0)
    current = dummy
    while left and right:
        if left.val <= right.val:
            current.next = left
            left = left.next
        else:
            current.next = right
            right = right.next
        current = current.next
    
    current.next = left or right
    return dummy.next
\`\`\`

**Time Complexity:** O(n log n) — optimal for comparison-based sorting
**Space Complexity:** O(log n) — for the recursion stack

This uses the slow/fast pointer technique to find the middle, then recursively sorts and merges. Want me to add unit tests or implement this in another language?`;
  }

  if (prompt.includes("merge") && prompt.includes("sorted")) {
    return `Here's an efficient solution to merge two sorted linked lists:

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_sorted_lists(l1: ListNode, l2: ListNode) -> ListNode:
    """Merge two sorted linked lists into one sorted list."""
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = l1 if l1 else l2
    return dummy.next

# Example usage
# List 1: 1 -> 3 -> 5
# List 2: 2 -> 4 -> 6
# Result: 1 -> 2 -> 3 -> 4 -> 5 -> 6
\`\`\`

**Complexity:** O(n + m) time, O(1) extra space — we reuse existing nodes.

The dummy node pattern simplifies edge case handling. Want me to add a recursive version or implement this in a different language?`;
  }

  if (prompt.includes("react") && prompt.includes("hook")) {
    return `Here's a custom React hook for infinite scrolling with intersection observer:

\`\`\`typescript
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<T[]>;
  initialPage?: number;
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  sentinelRef: (node: HTMLElement | null) => void;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchFn,
  initialPage = 1,
  threshold = 0.5,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, threshold]
  );

  useEffect(() => {
    const loadMore = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newItems = await fetchFn(page);
        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch'));
      } finally {
        setIsLoading(false);
      }
    };

    loadMore();
  }, [page, fetchFn]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return { items, isLoading, error, hasMore, sentinelRef, reset };
}
\`\`\`

**Usage example:**
\`\`\`tsx
function PostsList() {
  const { items, isLoading, sentinelRef } = useInfiniteScroll({
    fetchFn: async (page) => {
      const res = await fetch(\`/api/posts?page=\${page}\`);
      return res.json();
    },
  });

  return (
    <div>
      {items.map((post) => <PostCard key={post.id} post={post} />)}
      <div ref={sentinelRef} />
      {isLoading && <Spinner />}
    </div>
  );
}
\`\`\`

This hook uses the Intersection Observer API for efficient scroll detection. It's fully typed, handles errors, supports reset, and cleans up observers automatically.`;
  }

  if (prompt.includes("rate limit")) {
    return `Here's a Redis-based rate limiter using the sliding window algorithm:

\`\`\`go
package ratelimiter

import (
\t"context"
\t"fmt"
\t"time"

\t"github.com/redis/go-redis/v9"
)

// RateLimiter implements a sliding window rate limiter using Redis.
type RateLimiter struct {
\tclient   *redis.Client
\tlimit    int
\twindow   time.Duration
}

// New creates a new RateLimiter.
func New(client *redis.Client, limit int, window time.Duration) *RateLimiter {
\treturn &RateLimiter{
\t\tclient: client,
\t\tlimit:  limit,
\t\twindow: window,
\t}
}

// Allow checks if a request from the given key is allowed.
func (rl *RateLimiter) Allow(ctx context.Context, key string) (bool, error) {
\tnow := time.Now().UnixMicro()
\twindowStart := now - rl.window.Microseconds()
\tredisKey := fmt.Sprintf("ratelimit:%s", key)

\tpipe := rl.client.Pipeline()

\t// Remove expired entries
\tpipe.ZRemRangeByScore(ctx, redisKey, "0", fmt.Sprintf("%d", windowStart))

\t// Count current window
\tcountCmd := pipe.ZCard(ctx, redisKey)

\t// Add current request
\tpipe.ZAdd(ctx, redisKey, redis.Z{Score: float64(now), Member: now})

\t// Set TTL
\tpipe.Expire(ctx, redisKey, rl.window)

\t_, err := pipe.Exec(ctx)
\tif err != nil {
\t\treturn false, fmt.Errorf("redis pipeline error: %w", err)
\t}

\tcount := countCmd.Val()
\treturn count < int64(rl.limit), nil
}
\`\`\`

**Usage:**
\`\`\`go
limiter := ratelimiter.New(redisClient, 100, time.Minute)

// In your HTTP middleware
func RateLimitMiddleware(limiter *ratelimiter.RateLimiter) func(http.Handler) http.Handler {
\treturn func(next http.Handler) http.Handler {
\t\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
\t\t\tallowed, err := limiter.Allow(r.Context(), r.RemoteAddr)
\t\t\tif err != nil || !allowed {
\t\t\t\thttp.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
\t\t\t\treturn
\t\t\t}
\t\t\tnext.ServeHTTP(w, r)
\t\t})
\t}
}
\`\`\`

This uses Redis sorted sets for a **sliding window** approach — more accurate than fixed windows. Each request is scored by timestamp, and expired entries are pruned atomically using a pipeline.`;
  }

  if (
    prompt.includes("api") &&
    (prompt.includes("express") || prompt.includes("rest"))
  ) {
    return `Here's a production-ready REST API with JWT authentication in Express.js:

\`\`\`javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change-in-production';
const SALT_ROUNDS = 12;

// In-memory store (replace with database in production)
const users = new Map();

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// POST /auth/register
app.post('/auth/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (users.has(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    users.set(email, { email, password: hash });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { email } });
  }
);

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { email } });
});

// GET /api/profile (protected)
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
\`\`\`

**Key features:**
- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with 24h expiration
- Input validation with express-validator
- Clean error responses
- Auth middleware pattern

Want me to add refresh tokens, role-based access, or database integration?`;
  }

  // Generic coding response
  const modelName =
    SUPPORTED_MODELS.find((m) => m.id === model)?.name || model;

  if (
    prompt.includes("explain") ||
    prompt.includes("how does") ||
    prompt.includes("what is")
  ) {
    return `Great question! Let me break this down for you.

${lastMessage.content.charAt(0).toUpperCase() + lastMessage.content.slice(1)} — here's a clear explanation:

**Key Concepts:**
1. **Core Idea** — The fundamental principle behind this involves understanding the underlying data structures and algorithms at play.
2. **How It Works** — The mechanism operates by processing inputs through well-defined stages, each optimized for specific operations.
3. **Best Practices** — When implementing this, ensure you handle edge cases, write comprehensive tests, and follow established patterns.

**In Practice:**
\`\`\`${detectedLang}
// Example demonstrating the concept
// This is a simplified illustration
\`\`\`

Would you like me to dive deeper into any specific aspect, or would you prefer a complete implementation?

*— Generated by ${modelName} via INCLAW*`;
  }

  // Default: generate code
  const template =
    CODE_TEMPLATES[detectedLang] || CODE_TEMPLATES["python"];

  return `I'll help you with that! Here's my approach:

**Plan:**
1. Analyze the requirements
2. Choose the optimal algorithm/pattern
3. Implement with clean, documented code
4. Consider edge cases

${template}

I've generated a foundation based on your request. In the full version of INCLAW, this would be a complete, runnable solution using **${modelName}**.

**To get full inference capabilities**, connect INCLAW to one of these backends:
- **Ollama** (local) — \`ollama run codellama:34b\`
- **HuggingFace Inference API** — cloud-hosted models
- **vLLM / TGI** — for production deployment
- **Together AI** — managed open-source models

Would you like me to elaborate on the implementation or try a different approach?

*— Generated by ${modelName} via INCLAW*`;
}

const SUPPORTED_MODELS = [
  { id: "codellama-34b", name: "CodeLlama 34B" },
  { id: "deepseek-coder-33b", name: "DeepSeek Coder 33B" },
  { id: "starcoder2-15b", name: "StarCoder2 15B" },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B" },
  { id: "llama3-70b", name: "Llama 3 70B" },
  { id: "qwen2.5-coder-32b", name: "Qwen2.5 Coder 32B" },
];

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, model } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // In production, this is where you'd route to actual LLM inference:
    //
    // Option 1: Ollama (local)
    // const response = await fetch('http://localhost:11434/api/chat', {
    //   method: 'POST',
    //   body: JSON.stringify({ model: 'codellama:34b', messages }),
    // });
    //
    // Option 2: HuggingFace Inference API
    // const response = await fetch('https://api-inference.huggingface.co/models/...', {
    //   headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
    //   body: JSON.stringify({ inputs: messages }),
    // });
    //
    // Option 3: vLLM / TGI endpoint
    // const response = await fetch('http://your-vllm-server/v1/chat/completions', {
    //   body: JSON.stringify({ model, messages }),
    // });

    const content = generateResponse(messages, model);

    return NextResponse.json({
      content,
      model,
      usage: {
        prompt_tokens: messages.reduce(
          (acc, m) => acc + m.content.split(" ").length,
          0
        ),
        completion_tokens: content.split(" ").length,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
