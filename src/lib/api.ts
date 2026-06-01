export interface EvaluationResponse {
  overall_score: number;
  technical_score: number;
  communication_score: number;
  confidence_score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface EvaluationRequest {
  question: string;
  answer: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function evaluateAnswer(question: string, answer: string): Promise<EvaluationResponse> {
  const response = await fetch(`${API_URL}/api/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, answer }),
  });

  if (!response.ok) {
    throw new Error(`Failed to evaluate response: ${response.status} ${response.statusText}`);
  }

  const data: EvaluationResponse = await response.json();
  return data;
}
