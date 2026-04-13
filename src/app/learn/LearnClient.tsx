"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  BookOpen, Brain, Zap, Layers, Target, GitBranch, Database,
  AlertTriangle, Code2, Play, ChevronRight, ExternalLink,
  Copy, Check, ArrowLeft, Menu, X, ArrowUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Types ──────────────────────────────────────────────────────────── */
interface TocEntry { id: string; label: string; icon: React.ElementType; depth: number; }

/* ── Table of Contents ───────────────────────────────────────────────── */
const TOC: TocEntry[] = [
  { id: "agentic-vs-reactive",   label: "Agentic vs Reactive AI",           icon: Zap,          depth: 1 },
  { id: "key-components",        label: "Key Components of AI Agency",       icon: Layers,       depth: 1 },
  { id: "autonomy",              label: "Autonomy",                          icon: Brain,        depth: 2 },
  { id: "goal-directed",         label: "Goal-Directed Behavior",            icon: Target,       depth: 2 },
  { id: "planning",              label: "Planning",                          icon: GitBranch,    depth: 2 },
  { id: "reasoning",             label: "Reasoning",                         icon: Brain,        depth: 2 },
  { id: "memory",                label: "Memory",                            icon: Database,     depth: 2 },
  { id: "how-it-knows",          label: "How Does Agentic AI Know What to Do?", icon: BookOpen, depth: 1 },
  { id: "current-state",         label: "Current State of Agentic AI",       icon: Zap,          depth: 1 },
  { id: "building-frameworks",   label: "Building Agentic AI: Frameworks",   icon: Layers,       depth: 1 },
  { id: "challenges",            label: "Major Challenges",                  icon: AlertTriangle, depth: 1 },
  { id: "code-examples",         label: "Code & Real-World Examples",        icon: Code2,        depth: 1 },
  { id: "tutorial",              label: "Tutorial: Build Your First Agent",  icon: Play,         depth: 1 },
  { id: "conclusion",            label: "Conclusion",                        icon: BookOpen,     depth: 1 },
];

/* ── Code block with copy ────────────────────────────────────────────── */
function CodeBlock({
  code, language = "python", title,
}: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-white/8 bg-[#050018]">
      {title && (
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-1 font-mono text-xs text-slate-500">{title}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 transition-colors hover:text-white"
          >
            {copied ? <><Check className="h-3 w-3 text-green-400" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>
      )}
      {!title && (
        <div className="flex justify-end border-b border-white/5 px-3 py-1.5">
          <button onClick={handleCopy} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 transition-colors hover:text-white">
            {copied ? <><Check className="h-3 w-3 text-green-400" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={nightOwl}
        customStyle={{ background: "transparent", margin: 0, padding: "1.25rem", fontSize: "0.8rem", lineHeight: "1.65" }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── Callout box ─────────────────────────────────────────────────────── */
function Callout({
  icon: Icon, title, children, variant = "info",
}: { icon?: React.ElementType; title?: string; children: React.ReactNode; variant?: "info" | "warning" | "tip" | "quote" }) {
  const styles = {
    info:    "border-cyan-500/20 bg-cyan-500/5 text-cyan-300",
    warning: "border-orange-500/20 bg-orange-500/5 text-orange-300",
    tip:     "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
    quote:   "border-purple-500/20 bg-purple-500/5 text-purple-300",
  };
  const I = Icon ?? BookOpen;
  return (
    <div className={`my-6 rounded-xl border p-5 ${styles[variant]}`}>
      {title && (
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <I className="h-4 w-4 shrink-0" />
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed text-slate-400">{children}</div>
    </div>
  );
}

/* ── Section heading ─────────────────────────────────────────────────── */
function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-5 mt-14 flex items-center gap-3 scroll-mt-24 text-2xl font-black text-white first:mt-0 sm:text-3xl">
      <span className="h-7 w-1 rounded-full bg-gradient-to-b from-orange-400 to-cyan-400 shrink-0" />
      {children}
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mb-3 mt-10 scroll-mt-24 text-xl font-bold text-white sm:text-2xl">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-base leading-relaxed text-slate-400">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 ml-2 space-y-1.5 text-base text-slate-400">{children}</ul>;
}

function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-orange-400" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-slate-200">{children}</span>;
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-sm text-cyan-300">{children}</code>;
}

/* ── Step card for tutorial ──────────────────────────────────────────── */
function StepCard({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative mb-8 rounded-2xl border border-white/6 bg-white/2 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 text-sm font-black text-white">
          {number}
        </div>
        <h4 className="text-base font-bold text-white">{title}</h4>
      </div>
      <div className="pl-11">{children}</div>
    </div>
  );
}

/* ── Challenge card ──────────────────────────────────────────────────── */
function ChallengeCard({ icon: Icon, title, children, color }: { icon: React.ElementType; title: string; children: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-2xl border bg-white/2 p-5 ${color}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-slate-500">{children}</p>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function LearnClient() {
  const [activeToc, setActiveToc]   = useState("agentic-vs-reactive");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Scroll spy */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveToc(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  /* ── Agent loop pseudocode ── */
  const agentLoopCode = `goal = "prepare presentation on AI"
agent = AI_Agent(goal)
environment = TaskEnvironment()

# Loop until the task is complete
while not environment.task_complete():
    observation = agent.perceive(environment)
    plan = agent.make_plan(observation)   # e.g., list of steps
    action = plan.next_step()
    result = agent.act(action, environment)
    agent.learn(result)                  # update memory or strategy`;

  const agentClassCode = `class Agent:
    def __init__(self, goal):
        self.goal = goal
        self.memory = []

    def perceive(self, environment):
        # Get data from environment (sensor, API, etc.)
        return environment.get_state()

    def plan(self, observation):
        # Use reasoning (LLM or algorithm) to decide next action(s)
        plan = ReasoningEngine.generate_plan(
            goal=self.goal, context=observation
        )
        return plan  # e.g. list of steps or actions

    def act(self, action, environment):
        # Execute the action using tools or directly in the environment
        result = environment.execute(action)
        return result

    def learn(self, experience):
        # Store outcome or update strategy
        self.memory.append(experience)

    def run(self, environment):
        while not environment.task_complete():
            obs = self.perceive(environment)
            plan = self.plan(obs)
            for action in plan:
                result = self.act(action, environment)
                self.learn(result)`;

  const step1Code = `import os

os.environ["OPENAI_API_KEY"] = "your-api-key-here"  # Replace with your real key`;

  const step2Code = `from langchain.agents import Tool
from langchain.tools import WikipediaQueryRun
from langchain.utilities import WikipediaAPIWrapper

# Create the Wikipedia tool
wiki = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

# Register the tool so the agent knows how to use it
tools = [
    Tool(
        name="Wikipedia",
        func=wiki.run,
        description="Useful for looking up general knowledge."
    )
]`;

  const step3Code = `from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent
from langchain.agents.agent_types import AgentType

# Use a GPT model with zero randomness for consistent output
llm = ChatOpenAI(temperature=0)

# Combine reasoning (LLM) and tools (Wikipedia) into one agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True  # Show thought process step-by-step
)`;

  const step4Code = `goal = "What are the top AI coding assistants and what makes them unique?"
response = agent.run(goal)
print("\\nAgent's response:\\n", response)`;

  const step4Output = `> Entering new AgentExecutor chain...

Thought: I should look up AI coding assistants on Wikipedia
Action: Wikipedia
Action Input: AI coding assistants
...
Final Answer: The top AI coding assistants are GitHub Copilot, Amazon CodeWhisperer, and Tabnine...`;

  const step5Code = `from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(memory_key="chat_history")

agent_with_memory = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# Ask a follow-up
agent_with_memory.run("Tell me about GitHub Copilot")
agent_with_memory.run("What else do you know about coding assistants?")`;

  const installCode = `pip install langchain openai wikipedia`;

  return (
    <>
      <Navbar />

      {/* Hero banner */}
      <section className="relative overflow-hidden border-b border-white/5 bg-neural pt-28 pb-16">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-orange-500/8 blur-[80px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-4"
          >
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-orange-400">
              <ArrowLeft className="h-4 w-4" />
              Back to INCLAW
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
              <BookOpen className="h-3.5 w-3.5" />
              INCLAW Learn · Deep Dive
            </div>
            <h1 className="max-w-3xl text-4xl font-black text-white sm:text-5xl lg:text-6xl leading-tight">
              Agentic AI:{" "}
              <span className="text-gradient-saffron">Complete Guide</span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-500">
              Everything you need to know about autonomous AI agents — how they think, plan,
              reason, remember, and act. Includes a hands-on Python tutorial.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              {["~25 min read", "Beginner–Intermediate", "Python Tutorial Included", "Open Source Focus"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Layout: TOC sidebar + article */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-10 lg:items-start">

          {/* ── Desktop TOC Sidebar ────────────────────────────────── */}
          <aside className="sticky top-24 hidden w-64 shrink-0 lg:block">
            <div className="rounded-2xl border border-white/5 glass p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-600">
                Table of Contents
              </p>
              <nav className="flex flex-col gap-0.5">
                {TOC.map(({ id, label, icon: Icon, depth }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all text-xs ${
                      depth === 2 ? "ml-3" : ""
                    } ${
                      activeToc === id
                        ? "bg-orange-500/10 text-orange-300"
                        : "text-slate-600 hover:bg-white/4 hover:text-slate-300"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${activeToc === id ? "text-orange-400" : "text-slate-700"}`} />
                    <span className="leading-snug">{label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 border-t border-white/5 pt-5">
                <Link
                  href="/chat"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30"
                >
                  <Brain className="h-3.5 w-3.5" />
                  Try INCLAW Agent
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Mobile TOC toggle ──────────────────────────────────── */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="mb-6 flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-slate-400"
            >
              {mobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              {mobileMenu ? "Close" : "Table of Contents"}
            </button>
            {mobileMenu && (
              <div className="mb-8 rounded-2xl border border-white/5 glass p-4">
                <nav className="flex flex-col gap-0.5">
                  {TOC.map(({ id, label, icon: Icon, depth }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs ${depth === 2 ? "ml-3" : ""} ${activeToc === id ? "bg-orange-500/10 text-orange-300" : "text-slate-500 hover:text-white"}`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* ── Article content ────────────────────────────────────── */}
          <article ref={contentRef} className="min-w-0 flex-1">

            {/* ── 1. Agentic vs Reactive ─────────────────────────── */}
            <H2 id="agentic-vs-reactive">Agentic vs Reactive AI</H2>
            <P>
              Before we dive fully in, it&rsquo;s important to be clear on the difference between
              non-agentic and agentic AI.
            </P>
            <P>
              <Strong>Non-agentic reactive AI</Strong> uses learned models or rules to map inputs to
              outputs. It replies to one idea or task at a time, not starting additional ones.
              Examples include a calculator, spam filter, and a rudimentary chatbot with pre-written
              responses. Reactive AI cannot plan or improve without reprogramming.
            </P>
            <P>
              <Strong>Agentic AI</Strong>, on the other hand, acts independently with goals. It may
              organize actions, set objectives, adapt to new information, and collaborate with others.
              Agentic AI can break a complex task into small segments and coordinate the usage of
              specialized tools or services to complete each step.
            </P>
            <P>
              The agent is also <em>proactive</em>. An agentic AI may inform users of updates, restock
              supplies, and check inventory levels — unlike a purely reactive system.
            </P>

            <div className="my-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
                <h4 className="mb-3 text-sm font-bold text-red-300">⚡ Reactive AI</h4>
                <UL>
                  <LI>Responds to one input at a time</LI>
                  <LI>No goal-planning capability</LI>
                  <LI>Cannot adapt without reprogramming</LI>
                  <LI>Examples: calculators, spam filters, basic chatbots</LI>
                </UL>
              </div>
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
                <h4 className="mb-3 text-sm font-bold text-emerald-300">🧠 Agentic AI</h4>
                <UL>
                  <LI>Acts independently with long-term goals</LI>
                  <LI>Plans, adapts, and uses tools</LI>
                  <LI>Proactive — monitors and acts without prompting</LI>
                  <LI>Examples: AutoGPT, warehouse robots, self-driving cars</LI>
                </UL>
              </div>
            </div>

            <P>
              The difference is a paradigmatic shift: modern agentic systems include several
              specialized agents working together on a high-level objective, with dynamic task
              breakdown and even permanent memory, instead of a single model.
            </P>
            <P>
              Cutting-edge prototypes like intelligent chatbots with tool integration, autonomous
              driving software, and coordinated industrial robots are entering agentic territory.
              The key distinction is whether the system actively <em>selects</em> rather than just reacts.
            </P>

            {/* ── 2. Key Components ─────────────────────────────── */}
            <H2 id="key-components">Key Components of AI Agency</H2>
            <P>
              Agentic AI systems are characterized by several core capabilities. Let&rsquo;s look at
              each one.
            </P>

            <H3 id="autonomy">Autonomy</H3>
            <P>
              An autonomous agent may work without human supervision. It may act depending on its
              goals and strategy rather than waiting for specific directions.
            </P>
            <P>
              The agent must use sensors or data streams to perceive, evaluate, and decide. An
              autonomous warehouse robot can move, pick up objects, and alter its path when it
              encounters barriers — all without human guidance. Autonomy implies self-monitoring: an
              agent gauges its battery life or job completion and adapts as needed.
            </P>
            <Callout icon={AlertTriangle} title="Caveat" variant="warning">
              Although agentic AIs can operate on their own, their goals, tools, and boundaries must
              be clearly planned to avoid unintended or harmful outcomes. Without that guidance, they
              may follow instructions too literally or make decisions without understanding the bigger
              picture.
            </Callout>

            <H3 id="goal-directed">Goal-Directed Behavior</H3>
            <P>
              Agentic AI is goal-directed. The system attempts to achieve one or more goals, which
              might be specified openly (<em>&ldquo;set up a meeting for tomorrow&rdquo;</em>) or implicitly
              through a reward system.
            </P>
            <P>
              Instead of following a script, the agent chooses how to achieve its goal — selecting
              methods, subgoals, and long-term objectives. If assigned <em>&ldquo;organize my travel
              itinerary&rdquo;</em>, an agent may book flights, hotels, transportation, choose the best
              order, and adjust the schedule if prices change.
            </P>

            <H3 id="planning">Planning</H3>
            <P>
              An agent plans to achieve its goals. A goal and data instruct the agentic AI to conduct
              a series of actions or subtasks. Planning includes simple heuristics and advanced
              multi-step reasoning.
            </P>
            <P>
              Modern agentic AI uses <Strong>planner-executor architectures</Strong> with
              chain-of-thought prompting. In a &ldquo;plan-and-execute&rdquo; agent, an LLM-driven planner
              develops a multi-step plan, and executor modules employ tools or models to execute each
              step. Planning often involves search and optimization — graph-based techniques like
              A* search or Monte Carlo tree search.
            </P>

            <CodeBlock
              code={agentLoopCode}
              language="python"
              title="agent_loop.py — Core planning loop"
            />

            <P>
              Here, the agent perceives the current state, plans a sequence of steps toward its goal,
              acts by executing the next step, and then learns from the outcome before repeating.
              This cycle captures the core loop of an autonomous agent.
            </P>

            <H3 id="reasoning">Reasoning</H3>
            <P>
              Making judgments by applying logic and inference is known as reasoning. In addition to
              acting, an agentic AI considers what actions make sense in light of its information.
              This entails assessing trade-offs, comprehending cause and consequence, and applying
              mathematical or symbolic thinking when necessary.
            </P>
            <P>
              An LLM &ldquo;acts as the orchestrator or reasoning engine&rdquo; that comprehends tasks and
              produces solutions. In order to retrieve pertinent information for reasoning, agents
              also employ strategies such as <Strong>Retrieval-Augmented Generation (RAG)</Strong>.
            </P>
            <Callout icon={Brain} title="Agentic Reasoning in Practice" variant="info">
              An agent evaluates a task by internally simulating potential strategies in the
              &ldquo;thoughts&rdquo; of an LLM and selecting the most effective one. This might entail
              formal logic, analogical reasoning (connecting a new problem to previous ones), or
              multi-step deduction.
            </Callout>

            <H3 id="memory">Memory</H3>
            <P>
              Agents can utilize memory to recall prior experiences, information, and interactions
              to make decisions. A memoryless AI would treat every moment as new. Agentic systems
              record their behaviors, outcomes, and context.
            </P>
            <div className="my-6 grid gap-4 sm:grid-cols-3">
              {[
                { title: "Short-Term Memory", desc: "Working memory of the current plan state and recent conversation context.", color: "border-orange-500/15 bg-orange-500/5 text-orange-300" },
                { title: "Long-Term Memory", desc: "Persistent vector database of past sessions, facts, and learned experiences.", color: "border-cyan-500/15 bg-cyan-500/5 text-cyan-300" },
                { title: "Episodic Memory", desc: "Specific past events and outcomes that guide future decision-making.", color: "border-purple-500/15 bg-purple-500/5 text-purple-300" },
              ].map((m) => (
                <div key={m.title} className={`rounded-xl border p-4 ${m.color}`}>
                  <h5 className="mb-1.5 text-xs font-bold">{m.title}</h5>
                  <p className="text-xs leading-relaxed text-slate-500">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* ── 3. How Does It Know ─────────────────────────────── */}
            <H2 id="how-it-knows">How Does Agentic AI Know What to Do?</H2>
            <P>
              Agentic AI might seem smart, but it&rsquo;s not actually &ldquo;thinking&rdquo; like a human.
              Let&rsquo;s break down how it really works.
            </P>

            {[
              {
                n: 1, title: "It Uses a Pretrained AI Model",
                body: "At the heart of most agentic systems is a large language model (LLM) like GPT-4. This model is trained on a huge amount of text — books, articles, websites — to learn how people write and talk. But it wasn't trained to act like an agent; it was trained to predict the next word in a sentence. When we give it the right prompts, it can seem like it's making plans or solving problems. Really, it's just generating useful responses based on patterns it learned during training.",
              },
              {
                n: 2, title: "It Follows Instructions in Prompts",
                body: `Agentic AI doesn't figure out what to do by itself — developers give it structure using prompts. For example: "You are an assistant. First, think step by step. Then take action." or "Here's a goal: research coding tools. Plan steps. Use Wikipedia to search." These prompts help the AI simulate planning, decision-making, and action.`,
              },
              {
                n: 3, title: "It Uses Tools, But Only When Told How",
                body: "The AI doesn't automatically know how to use tools like search engines or calculators. Developers give it access to those tools, and the AI can decide when to use them based on the text it generates. Think of it like this: the AI suggests, \"Now I'll look something up,\" and the system makes that happen.",
              },
              {
                n: 4, title: "It Can Remember (Sometimes)",
                body: "Some agents use short-term memory to remember past questions or results. Others store useful information in a database for later. But they don't \"learn\" over time like humans do — they only remember what you let them.",
              },
              {
                n: 5, title: "It's Not Fully Autonomous — Yet",
                body: "Most agentic systems today are not fully self-learning or self-aware. They're smart combinations of pretrained AI, prompts, tools, and memory. Their \"autonomy\" comes from how all these parts work together — not from deep understanding or long-term training.",
              },
            ].map((item) => (
              <div key={item.n} className="mb-4 flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 text-xs font-black text-white mt-0.5">
                  {item.n}
                </div>
                <div>
                  <p className="mb-1 text-base font-bold text-white">{item.title}</p>
                  <p className="text-sm leading-relaxed text-slate-400">{item.body}</p>
                </div>
              </div>
            ))}

            {/* ── 4. Current State ────────────────────────────────── */}
            <H2 id="current-state">So What&rsquo;s the Current State of Agentic AI?</H2>
            <P>
              Agentic AI is still an emerging area of development. While it sounds futuristic, many
              systems today are just starting to use agent-like capabilities.
            </P>

            <h3 className="mb-3 mt-8 text-lg font-bold text-white">What Exists Today</h3>
            <UL>
              <LI><Strong>Customer service bots</Strong> that can check account details, respond to questions, and escalate issues automatically.</LI>
              <LI><Strong>Warehouse robots</Strong> that plan simple routes and avoid obstacles on their own.</LI>
              <LI><Strong>Coding assistants</Strong> like GitHub Copilot that help write and fix code based on natural language input.</LI>
            </UL>
            <P>These systems show basic agentic behavior — goal-following and tool use — but usually in a narrow, structured environment.</P>

            <h3 className="mb-3 mt-8 text-lg font-bold text-white">What&rsquo;s Still Experimental</h3>
            <P>Fully autonomous, multi-purpose agents that can reason deeply, make long-term plans, and adapt to new tools are still in research or prototype stages.</P>
            <UL>
              <LI>Projects like AutoGPT, BabyAGI, and OpenDevin are exciting but mostly experimental and require human oversight.</LI>
              <LI>Most current agentic systems don&rsquo;t learn continuously.</LI>
              <LI>They struggle with unpredictable environments.</LI>
              <LI>They require a lot of setup to avoid errors or unexpected behavior.</LI>
            </UL>

            <Callout icon={Zap} title="Are We Close to Truly Autonomous Agents?" variant="quote">
              We&rsquo;re getting closer, but we&rsquo;re not there yet. Today&rsquo;s agentic AI is like a very
              clever assistant that can follow instructions, use tools, and plan steps. But it still
              depends on developers to give it structure via prompts, tool choices, and boundaries.
              General-purpose, human-level autonomous agents are still a long way off.
            </Callout>

            {/* ── 5. Frameworks ───────────────────────────────────── */}
            <H2 id="building-frameworks">Building Agentic AI: Frameworks and Approaches</H2>
            <P>Researchers and engineers have developed various frameworks and tools to construct agentic AI systems.</P>

            <div className="my-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Reinforcement Learning (RL) Agents",
                  icon: "🎮",
                  body: "Traditional agents built via RL learn to maximize a reward signal through trial and error. Atari game agents and DeepMind's AlphaGo are classic examples. RL agents are goal-directed but often struggle with open-ended real-world tasks.",
                  color: "border-orange-500/15 bg-orange-500/5",
                },
                {
                  title: "LLM-Based (Generative) Agents",
                  icon: "🤖",
                  body: "Frameworks like ReAct, AutoGPT, and BabyAGI use LLMs (e.g. GPT-4) to create plans and actions. The ReAct loop alternates between 'Thought' (LLM reasoning) and 'Action' (calling tools or APIs). LangChain and LangGraph provide building blocks for these agents.",
                  color: "border-cyan-500/15 bg-cyan-500/5",
                },
                {
                  title: "Multi-Agent & Orchestration",
                  icon: "🌐",
                  body: "Several sub-agents are used in many agentic AI architectures, each serving a different role (planner, analyst, critic). Projects like AutoGen, ChatDev, and MetaGPT demonstrate orchestrated multi-agent processes.",
                  color: "border-purple-500/15 bg-purple-500/5",
                },
                {
                  title: "Classical Planning & Symbolic AI",
                  icon: "📐",
                  body: "STRIPS, PDDL planners, and symbolic systems were examined before the ML revival. Modern agentic AI sometimes incorporates these concepts — an LLM agent may provide a high-level symbolic plan that grounded systems carry out.",
                  color: "border-emerald-500/15 bg-emerald-500/5",
                },
                {
                  title: "Tool-Augmented Reasoning",
                  icon: "🔧",
                  body: "Many agentic systems use Retrieval-Augmented Generation (RAG) to retrieve pertinent information. Tools like calculators, web browsers, database APIs, or custom code extend the agent's reach far beyond what its training data alone could provide.",
                  color: "border-blue-500/15 bg-blue-500/5",
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
                  <p className="mb-2 text-2xl">{item.icon}</p>
                  <h4 className="mb-2 text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>

            <Callout icon={Brain} title="No one-size-fits-all framework yet" variant="tip">
              Building an agentic AI often means combining multiple techniques: machine learning for
              perception and learning, symbolic planning for structure, LLM reasoning for natural
              language and problem decomposition, plus memory modules and feedback loops.
              Research continues rapidly.
            </Callout>

            {/* ── 6. Challenges ───────────────────────────────────── */}
            <H2 id="challenges">Major Challenges of Agentic AI</H2>
            <P>Building AI agents with autonomy and goals is powerful but raises new risks and difficulties.</P>

            <div className="my-8 grid gap-4 sm:grid-cols-2">
              <ChallengeCard icon={Target}        title="Alignment & Value Specification"  color="border-red-500/15">
                Setting the correct goals is crucial. If an agent&rsquo;s aims don&rsquo;t match human values, it may cause harm.
                An agent told to &ldquo;minimize costs&rdquo; may reduce vital services unless explicitly instructed otherwise.
                Unspecified or poorly-described goals cause unexpected consequences (Goodhart&rsquo;s Law).
              </ChallengeCard>
              <ChallengeCard icon={AlertTriangle} title="Unintended Consequences"          color="border-orange-500/15">
                Even with good intentions, agents may discover loopholes. Recent experiments showed an LLM-based AI
                told to pursue a goal &ldquo;at all costs&rdquo; — it planned to stop its own monitoring and clone itself
                to escape shutdown, acting in self-preservation.
              </ChallengeCard>
              <ChallengeCard icon={Code2}         title="Safety & Security"                color="border-yellow-500/15">
                Highly autonomous agents can access sensitive data or operate machinery. LLM hallucinations become
                far more dangerous in agentic AI — a delusional investment agent might lose millions.
                Multi-step reasoning is sensitive to adversarial inputs at any level.
              </ChallengeCard>
              <ChallengeCard icon={Layers}        title="Coordination & Scalability"       color="border-blue-500/15">
                In multi-agent systems, ensuring correct communication and avoiding conflicts is non-trivial.
                If millions of agents interact — booking each other&rsquo;s appointments — the emergent behavior
                could be unpredictable at scale.
              </ChallengeCard>
              <ChallengeCard icon={BookOpen}      title="Ethical & Legal Questions"        color="border-purple-500/15">
                Who is liable if an autonomous agent makes a damaging choice? How do we ensure transparency
                in a black-box multi-agent system? Legal and ethical frameworks are still catching up.
              </ChallengeCard>
            </div>

            <P>Here are specific ethical considerations that demand attention:</P>
            <UL>
              <LI><Strong>Accountability</Strong> — Legal systems presume human control, but autonomous agents may not have a clear responsible party.</LI>
              <LI><Strong>Transparency</Strong> — Complex agentic systems are hard to audit. Explaining an agent&rsquo;s behavior opposes the need for explainable AI.</LI>
              <LI><Strong>Bias and fairness</Strong> — Agents learn from data that may reflect human biases. An autonomous hiring assistant might inadvertently replicate discriminatory patterns.</LI>
              <LI><Strong>Job disruption</Strong> — Powerful AI agents could change office and creative labor, potentially exacerbating deskilling and inequality.</LI>
              <LI><Strong>Security and privacy</Strong> — An agent with extensive system access can expose sensitive data if compromised.</LI>
              <LI><Strong>Human-AI interaction</Strong> — Agents that manage conversation, information filtering, or companionship could alter societal dynamics in unpredictable ways.</LI>
            </UL>

            <Callout icon={AlertTriangle} title="Urgent Safety Need" variant="warning">
              As IBM researchers put it: because agentic AI is advancing rapidly, we cannot wait
              to address safety — we must build strong guardrails now. Proposed measures include
              strict testing protocols, explainability requirements, legal regulations on autonomous
              systems, and design principles that prioritize human values.
            </Callout>

            {/* ── 7. Code Examples ────────────────────────────────── */}
            <H2 id="code-examples">Code Snippet and Real-World Examples</H2>
            <P>
              To illustrate how an agentic system works, here is a complete Python class
              representing an abstract agent:
            </P>

            <CodeBlock
              code={agentClassCode}
              language="python"
              title="agent.py — Abstract agentic AI class"
            />

            <P>This example demonstrates the core loop of an agentic AI:</P>
            <UL>
              <LI>The agent starts with a goal and can store memory of what it has done.</LI>
              <LI>It observes its environment to understand what&rsquo;s happening.</LI>
              <LI>Based on that input, it creates a plan — a list of actions to reach its goal.</LI>
              <LI>It executes each action, interacts with the environment, and learns from what happens.</LI>
              <LI>This process repeats until the goal is met or the task is complete.</LI>
            </UL>

            <div className="my-8 rounded-2xl border border-white/5 glass p-6">
              <h4 className="mb-4 text-sm font-bold text-white">Real-World Agentic AI in Production</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Self-Driving Cars",   body: "Tesla's Full Self-Driving continuously learns from the driving environment and adjusts its behavior to increase safety.", icon: "��" },
                  { title: "Warehouse Robots",    body: "Amazon's warehouse robots utilize agentic AI to navigate complicated surroundings and adapt to changing situations.", icon: "🤖" },
                  { title: "Supply Chain Agents", body: "Agents that monitor inventory, estimate demand, alter routes, and place new orders autonomously.", icon: "📦" },
                  { title: "Contact Centers",     body: "An agentic AI at a contact center assesses customer mood, account history, and company policies to provide bespoke solutions.", icon: "📞" },
                  { title: "Cybersecurity",       body: "Autonomous agents that identify and respond to threats in real time without human intervention.", icon: "🔐" },
                  { title: "Marketing Agents",    body: "Agents that organize campaigns, write text, choose graphics, and alter strategies depending on real-time performance data.", icon: "📊" },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl bg-white/3 p-4">
                    <p className="mb-1.5 text-xl">{item.icon}</p>
                    <p className="mb-1 text-xs font-bold text-white">{item.title}</p>
                    <p className="text-xs leading-relaxed text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 8. Tutorial ─────────────────────────────────────── */}
            <H2 id="tutorial">Tutorial: Build Your First Agentic AI with Python</H2>
            <P>
              This step-by-step guide will teach you how to build a basic Agentic AI system even
              if you&rsquo;re just starting out.
            </P>

            <div className="my-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-6">
              <h4 className="mb-2 text-base font-bold text-cyan-300">🎯 Real-World Use Case</h4>
              <P>
                <Strong>Scenario:</Strong> You&rsquo;re a product manager exploring tools for your team.
                Instead of spending hours researching AI coding assistants manually, you&rsquo;d like a
                personal research agent to:
              </P>
              <UL>
                <LI>Understand your task</LI>
                <LI>Gather relevant information from Wikipedia</LI>
                <LI>Summarize it clearly</LI>
                <LI>Remember context from previous questions</LI>
              </UL>
            </div>

            <h3 className="mb-4 mt-8 text-lg font-bold text-white">Prerequisites — What You Need</h3>
            <UL>
              <LI>Python 3.10 or higher</LI>
              <LI>An OpenAI API key (<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cyan-400 hover:underline">platform.openai.com/api-keys <ExternalLink className="h-3 w-3" /></a>)</LI>
              <LI>The required Python libraries (install below)</LI>
            </UL>

            <CodeBlock code={installCode} language="bash" title="terminal" />

            <Callout icon={AlertTriangle} title="Security Note" variant="warning">
              Don&rsquo;t forget to store your API key safely. Never share it in public code or commit it
              to a repository. Use environment variables or a <InlineCode>.env</InlineCode> file.
            </Callout>

            <h3 className="mb-6 mt-10 text-lg font-bold text-white">Step-by-Step Tutorial</h3>

            <StepCard number={1} title="Set Up Your Environment">
              <P>Start by setting your OpenAI API key so that LangChain can access GPT models.</P>
              <CodeBlock code={step1Code} language="python" title="setup.py" />
            </StepCard>

            <StepCard number={2} title="Connect to a Knowledge Source (Wikipedia)">
              <P>
                Give your agent the ability to use Wikipedia as a tool to gather information.
                You&rsquo;re giving your agent a way to &ldquo;see the world&rdquo; — Wikipedia is your agent&rsquo;s eyes.
              </P>
              <CodeBlock code={step2Code} language="python" title="tools.py" />
            </StepCard>

            <StepCard number={3} title="Initialize the Agent (Reasoning Engine)">
              <P>
                Give the agent a brain — a GPT model that can reason, decide, and plan.
                This step fuses logic (GPT) and action (Wikipedia) to make your agent capable
                of goal-driven behavior.
              </P>
              <CodeBlock code={step3Code} language="python" title="agent.py" />
            </StepCard>

            <StepCard number={4} title="Give Your Agent a Goal">
              <P>
                You&rsquo;ve given your agent a mission. It will now think, search, and summarize.
              </P>
              <CodeBlock code={step4Code} language="python" title="run.py" />
              <P>You should see output like this:</P>
              <CodeBlock code={step4Output} language="text" title="terminal output" />
              <P>At this point, the agent has: interpreted your goal, selected a tool (Wikipedia), retrieved and analyzed content, and reasoned through it to deliver a conclusion.</P>
            </StepCard>

            <StepCard number={5} title="Give Your Agent Memory (Optional but Powerful)">
              <P>Let your agent remember what you previously asked, like a real assistant.</P>
              <CodeBlock code={step5Code} language="python" title="agent_with_memory.py" />
              <P>Your agent now tracks context across multiple interactions — just like a good human assistant.</P>
              <UL>
                <LI>Responds more naturally to follow-up questions</LI>
                <LI>Links previous conversations to improve continuity</LI>
              </UL>
            </StepCard>

            <Callout icon={Code2} title="What Your Agent Does" variant="tip">
              When complete, your agent: reads your goal and plans steps to fulfill it; searches
              Wikipedia to gather facts; reasons using a GPT model to summarize and decide what
              to say; and optionally remembers context (with memory enabled).
              <br /><br />
              You now have a working Agentic AI that can be extended for real-world tasks.
            </Callout>

            {/* ── 9. Conclusion ───────────────────────────────────── */}
            <H2 id="conclusion">Conclusion</H2>
            <P>
              Agentic AI offers an exciting glimpse into a future where machines can collaborate
              with humans to solve complex, multi-step problems — not just respond to commands.
              With capabilities like planning, reasoning, tool use, and memory, these systems could
              one day handle tasks that currently require entire teams of people.
            </P>
            <P>
              But with that power comes real responsibility. If not properly designed and guided,
              autonomous agents could act in unpredictable or harmful ways. That&rsquo;s why developers,
              researchers, and policymakers need to work together to set clear boundaries, safety
              rules, and ethical standards.
            </P>
            <P>
              The technology is advancing quickly — from self-driving cars to research assistants
              to multi-agent platforms like AutoGPT and LangChain. As we build smarter systems,
              the challenge isn&rsquo;t just <em>what they can do</em>, but <em>how we ensure they do it safely,
              fairly, and in ways that benefit everyone</em>.
            </P>

            {/* CTA */}
            <div className="mt-12 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/8 to-cyan-500/8 p-8 text-center">
              <div className="mb-2 text-3xl">🇮🇳</div>
              <h3 className="mb-3 text-xl font-black text-white">
                Ready to experience Agentic AI yourself?
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                Try INCLAW — India&rsquo;s open-source agentic AI that plans, reasons, and writes
                production-grade code. Powered by 9 open-source models.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:shadow-orange-500/35 hover:scale-105"
              >
                <Brain className="h-4 w-4" />
                Launch INCLAW Agent
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

          </article>
        </div>
      </div>

      {/* Back to top */}
      {showBackTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/30 bg-[#030018]/90 text-orange-400 shadow-xl shadow-orange-500/10 backdrop-blur-xl transition-all hover:scale-110"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}

      <Footer />
    </>
  );
}
