/**
 * INCLAW Model Router
 *
 * Intelligent routing to the best open-source model for each task.
 * Combines strengths of 9+ Ollama models for optimal results.
 */

import { SUPPORTED_MODELS } from "@/lib/constants";

export type TaskType =
  | "code-generation"
  | "debugging"
  | "explanation"
  | "code-review"
  | "full-stack"
  | "frontend"
  | "backend"
  | "database"
  | "testing"
  | "deployment";

interface ModelScore {
  modelId: string;
  ollamaTag: string;
  score: number;
  reason: string;
}

/** Task-to-model scoring matrix */
const TASK_MODEL_SCORES: Record<TaskType, Record<string, number>> = {
  "code-generation": {
    "qwen2.5-coder-32b": 95,
    "deepseek-coder-33b": 92,
    "codellama-34b": 88,
    "starcoder2-15b": 85,
    "llama3.3-70b": 80,
    "llama3-70b": 78,
    "mixtral-8x7b": 75,
    "phi4-14b": 82,
    "gemma3-27b": 80,
  },
  debugging: {
    "qwen2.5-coder-32b": 94,
    "deepseek-coder-33b": 90,
    "llama3.3-70b": 88,
    "codellama-34b": 86,
    "gemma3-27b": 82,
    "mixtral-8x7b": 80,
    "phi4-14b": 78,
    "starcoder2-15b": 75,
    "llama3-70b": 76,
  },
  explanation: {
    "llama3.3-70b": 95,
    "llama3-70b": 92,
    "mixtral-8x7b": 90,
    "gemma3-27b": 88,
    "qwen2.5-coder-32b": 82,
    "deepseek-coder-33b": 78,
    "phi4-14b": 85,
    "codellama-34b": 70,
    "starcoder2-15b": 65,
  },
  "code-review": {
    "qwen2.5-coder-32b": 93,
    "llama3.3-70b": 90,
    "deepseek-coder-33b": 88,
    "gemma3-27b": 85,
    "mixtral-8x7b": 83,
    "codellama-34b": 80,
    "phi4-14b": 78,
    "llama3-70b": 76,
    "starcoder2-15b": 72,
  },
  "full-stack": {
    "qwen2.5-coder-32b": 95,
    "deepseek-coder-33b": 90,
    "llama3.3-70b": 88,
    "codellama-34b": 85,
    "mixtral-8x7b": 82,
    "gemma3-27b": 80,
    "llama3-70b": 78,
    "phi4-14b": 76,
    "starcoder2-15b": 74,
  },
  frontend: {
    "qwen2.5-coder-32b": 92,
    "deepseek-coder-33b": 88,
    "llama3.3-70b": 86,
    "codellama-34b": 84,
    "gemma3-27b": 82,
    "mixtral-8x7b": 80,
    "phi4-14b": 78,
    "llama3-70b": 76,
    "starcoder2-15b": 74,
  },
  backend: {
    "qwen2.5-coder-32b": 93,
    "deepseek-coder-33b": 90,
    "codellama-34b": 87,
    "llama3.3-70b": 85,
    "mixtral-8x7b": 83,
    "gemma3-27b": 80,
    "llama3-70b": 78,
    "phi4-14b": 76,
    "starcoder2-15b": 74,
  },
  database: {
    "llama3.3-70b": 90,
    "qwen2.5-coder-32b": 88,
    "deepseek-coder-33b": 86,
    "mixtral-8x7b": 84,
    "gemma3-27b": 82,
    "codellama-34b": 80,
    "llama3-70b": 78,
    "phi4-14b": 76,
    "starcoder2-15b": 70,
  },
  testing: {
    "qwen2.5-coder-32b": 92,
    "deepseek-coder-33b": 88,
    "codellama-34b": 86,
    "llama3.3-70b": 84,
    "gemma3-27b": 82,
    "mixtral-8x7b": 80,
    "phi4-14b": 78,
    "llama3-70b": 76,
    "starcoder2-15b": 74,
  },
  deployment: {
    "llama3.3-70b": 90,
    "qwen2.5-coder-32b": 88,
    "mixtral-8x7b": 86,
    "gemma3-27b": 84,
    "deepseek-coder-33b": 82,
    "llama3-70b": 80,
    "codellama-34b": 78,
    "phi4-14b": 76,
    "starcoder2-15b": 72,
  },
};

export class ModelRouter {
  /** Select the best model for a task type */
  selectModel(taskType: TaskType): string {
    const scores = this.scoreModels(taskType);
    const best = scores[0];
    return best.ollamaTag;
  }

  /** Get ranked model scores for a task */
  scoreModels(taskType: TaskType): ModelScore[] {
    const taskScores = TASK_MODEL_SCORES[taskType] || TASK_MODEL_SCORES["code-generation"];

    const scores: ModelScore[] = SUPPORTED_MODELS.map((model) => {
      const score = taskScores[model.id] || 50;
      return {
        modelId: model.id,
        ollamaTag: model.ollamaTag,
        score,
        reason: this.getScoreReason(model.id, taskType, score),
      };
    });

    return scores.sort((a, b) => b.score - a.score);
  }

  /** Get human-readable reason for the score */
  private getScoreReason(modelId: string, taskType: TaskType, score: number): string {
    const model = SUPPORTED_MODELS.find((m) => m.id === modelId);
    if (!model) return "Unknown model";

    if (score >= 90) return `${model.name} excels at ${taskType} tasks — top pick`;
    if (score >= 80) return `${model.name} is strong at ${taskType} — good alternative`;
    if (score >= 70) return `${model.name} can handle ${taskType} — acceptable`;
    return `${model.name} is not optimized for ${taskType}`;
  }

  /** Get the recommended model with explanation */
  getRecommendation(taskType: TaskType): { model: string; explanation: string; alternatives: string[] } {
    const scores = this.scoreModels(taskType);
    const top3 = scores.slice(0, 3);

    return {
      model: top3[0].ollamaTag,
      explanation: top3[0].reason,
      alternatives: top3.slice(1).map((s) => s.ollamaTag),
    };
  }
}

/** Singleton router instance */
export const modelRouter = new ModelRouter();
