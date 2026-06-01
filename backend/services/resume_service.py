import fitz  # PyMuPDF
import os
import requests
import json
import logging

logger = logging.getLogger("mockmate-backend")

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts and concatenates all text from a PDF file provided as bytes.
    """
    try:
        # Open PDF from memory stream
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text_content = []
        for page in doc:
            page_text = page.get_text()
            if page_text.strip():
                text_content.append(page_text)
        
        doc.close()
        
        full_text = "\n".join(text_content).strip()
        if not full_text:
            raise ValueError("No extractable text found in the PDF.")
            
        return full_text
    except Exception as e:
        logger.error(f"Error during PDF text extraction: {str(e)}")
        raise ValueError(f"Failed to parse PDF document: {str(e)}")

def generate_personalized_questions(resume_text: str, role: str) -> dict:
    """
    Sends the resume text to Gemini API to extract skills, experience level,
    and generate 5 tailored technical and 3 behavioral questions for the given role.
    """
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    
    # Define a high-quality fallback generator for when Gemini is offline / key is missing
    fallback_response = generate_fallback_questions(role)
    
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is not configured. Returning premium fallback questions.")
        return fallback_response

    GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

    prompt = f"""
    You are an expert technical interviewer. Analyze the following candidate's resume content:
    ---
    {resume_text}
    ---
    
    Based on this resume, determine:
    1. Key technical skills.
    2. Experience level (e.g., Junior, Mid-Level, Senior, Lead, etc.).
    3. A short summary of their background.
    4. Generate exactly 5 technical interview questions tailored specifically to their skills and projects in the context of the '{role}' role.
    5. Generate exactly 3 behavioral interview questions based on their experience and background.
    
    Format your response as a JSON object matching this schema:
    {{
      "skills": ["skill1", "skill2", ...],
      "experience_level": "Level",
      "technical_questions": [
        "Technical Question 1",
        "Technical Question 2",
        "Technical Question 3",
        "Technical Question 4",
        "Technical Question 5"
      ],
      "behavioral_questions": [
        "Behavioral Question 1",
        "Behavioral Question 2",
        "Behavioral Question 3"
      ],
      "summary": "A short summary of their background and profile."
    }}
    Ensure the response contains ONLY the JSON object.
    """

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(
            GEMINI_URL, 
            json=payload, 
            headers={"Content-Type": "application/json"}, 
            timeout=15
        )
        
        if response.status_code != 200:
            logger.error(f"Gemini API returned error code {response.status_code} during resume analysis: {response.text}")
            return fallback_response
            
        result = response.json()
        candidates = result.get("candidates", [])
        if not candidates:
            raise ValueError("No candidates found in Gemini response")
            
        content_text = candidates[0].get("content", {}).get("parts", [])[0].get("text", "")
        
        # Parse the JSON returned by Gemini
        feedback_data = json.loads(content_text.strip())
        
        # Validation of basic structure
        return {
            "skills": list(feedback_data.get("skills", ["Software Engineering"])),
            "experience_level": str(feedback_data.get("experience_level", "Mid-Level")),
            "technical_questions": list(feedback_data.get("technical_questions", fallback_response["technical_questions"])),
            "behavioral_questions": list(feedback_data.get("behavioral_questions", fallback_response["behavioral_questions"])),
            "summary": str(feedback_data.get("summary", "Resume analyzed successfully."))
        }
    except Exception as e:
        logger.error(f"Error parsing Gemini resume response, reverting to fallback: {str(e)}")
        return fallback_response

def generate_fallback_questions(role: str) -> dict:
    """
    Generates high-quality fallback questions matching the role if Gemini fails.
    """
    role_lower = role.lower()
    
    if "frontend" in role_lower:
        skills = ["React", "TypeScript", "Next.js", "Tailwind CSS", "Web Performance"]
        tech_qs = [
            "How do you manage complex states in large-scale React applications? Contrast Context API with Zustand or Redux.",
            "Can you explain React Hydration and describe how to solve common Next.js hydration errors?",
            "What strategies do you use to optimize the Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) in a Next.js app?",
            "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR), and when to use each.",
            "How does React's reconciliation process and virtual DOM diffing work under the hood?"
        ]
    elif "backend" in role_lower:
        skills = ["Python", "FastAPI", "PostgreSQL", "Redis Caching", "REST APIs", "Microservices"]
        tech_qs = [
            "Explain the difference between REST, GraphQL, and gRPC. In what scenarios would you choose each?",
            "Explain how SQL indexing works, how it affects write performance, and how you design indexing strategies.",
            "How do you handle distributed transactions and consistency across multiple microservices?",
            "What is a cache stampede, and how do you implement mutex locks or early expiration in Redis to prevent it?",
            "How do you design API rate-limiting using the token bucket algorithm and defend against DDoS attacks?"
        ]
    elif "ml" in role_lower or "machine" in role_lower:
        skills = ["Python", "PyTorch", "Data Pipelines", "CNNs", "NLP"]
        tech_qs = [
            "How do you handle vanishing or exploding gradients during training of deep neural networks?",
            "Explain the trade-offs between training a model from scratch vs. fine-tuning a pre-trained model.",
            "What methods do you employ for handling class imbalance in training datasets?",
            "Describe the architecture of a Transformer model. How does self-attention differ from standard attention?",
            "How do you monitor model drift and deploy models for real-time inference in production environments?"
        ]
    else:
        # Default/Software Engineer fallback
        skills = ["JavaScript", "Python", "SQL", "Git", "REST APIs"]
        tech_qs = [
            "Describe a complex system design problem you solved and how you arrived at the final architecture.",
            "Explain the concept of Big O notation and how you analyze time and space complexity in algorithms.",
            "How do you handle database migration safety in production environments without causing downtime?",
            "What is the difference between concurrency and parallelism, and how do you utilize them in your projects?",
            "Explain how JWT-based authentication works, including token storage, refreshing, and security best practices."
        ]

    behavioral_qs = [
        "Describe a time when you had a technical disagreement with another senior developer. How did you resolve it?",
        "Can you share an experience where you had to ship a feature under a tight deadline while balancing technical debt?",
        "Tell me about a time you noticed a critical flaw in a production system. How did you diagnose and resolve it?"
    ]

    return {
        "skills": skills,
        "experience_level": "Professional",
        "technical_questions": tech_qs,
        "behavioral_questions": behavioral_qs,
        "summary": f"Strong engineering candidate displaying solid background matching the {role.title()} Developer requirements."
    }
