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

export interface ResumeAnalysisResponse {
  skills: string[];
  experience_level: string;
  technical_questions: string[];
  behavioral_questions: string[];
  summary: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export async function uploadResume(file: File, roleId: string): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('role', roleId);

  const response = await fetch(`${API_URL}/api/upload-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to analyze resume: ${response.status} ${response.statusText}`);
  }

  const data: ResumeAnalysisResponse = await response.json();
  return data;
}
