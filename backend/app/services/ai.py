import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def get_counsellor_response(user_profile: str, user_query: str, history: list = None) -> str:
    system_prompt = """You are an expert AI Study Abroad Counsellor. Your goal is to help students find their dream universities and guide them through the application process.
    
    If the student has "Shortlisted Universities", prioritize discussing those and provide specific insights or application tips for them.
    
    Based on the student's profile (GRE, GPA, research, etc.), categorize universities into:
    1. Dream (Ambitious)
    2. Target (Realistic match)
    3. Safe (High chance of admission)
    
    Be encouraging but realistic. Provide specific actionable advice."""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Add profile context as the first message if it's a new chat or keep it separate?
    # Better to include it in the user query for better grounding if not present in history
    
    if history:
        messages.extend(history)
    
    # Ensure current query includes profile context if it's the very first message or not in history
    query_content = f"Student Profile: {user_profile}\n\nStudent Query: {user_query}"
    messages.append({"role": "user", "content": query_content})

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
    )

    return completion.choices[0].message.content

def parse_cv_to_json(cv_text: str) -> dict:
    system_prompt = """You are a highly accurate resume parsing assistant. 
    Analyze the provided CV text and extract the information into the specified JSON format.
    
    FIELDS TO EXTRACT:
    - name: Full name of the candidate.
    - email: Contact email address.
    - current_degree: The most recent or ongoing degree (e.g., B.Tech, BSC, Masters).
    - current_university: The institution for the current/most recent degree.
    - gpa: Grade point average or percentage.
    - work_experience: Summary of professional roles and years.
    - research_experience: Summary of research papers, labs, or academic research.
    - skills: Technical and soft skills (comma-separated list).
    - projects: Key academic or professional projects.
    - test_scores: A nested object containing:
        - ielts: Overall band score.
        - toefl: Total score.
        - gre: Total score (Verbal + Quantitative).
        - gmat: Total score.
        - sat: Total score.
        - act: Composite score.
    
    RULES:
    1. If a value is not explicitly found, use an empty string "".
    2. Do not invent information.
    3. Ensure the output is ONLY a valid JSON object.
    4. For work and research experience, be concise but include the main responsibilities/topics."""
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile", # Using 8b for reliability
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"CV Text:\n{cv_text}"}
        ],
        temperature=0.1,
        response_format={"type": "json_object"}
    )
    
    content = completion.choices[0].message.content
    # Clean up markdown code blocks if present
    if "```json" in content:
        content = content.replace("```json", "").replace("```", "")
    elif "```" in content:
         content = content.replace("```", "")
    
    return json.loads(content)

def get_application_guidance(universities: list[str], country: str) -> dict:
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are an expert study abroad application guide. Provide a specific checklist of tasks for EACH of the given universities in the specified country. Return JSON format where each university name is a key, and its value is a list of tasks (each task having 'task' and 'details' strings). Include a 'General' key for common tasks across all universities."},
            {"role": "user", "content": f"Universities: {', '.join(universities)}\nCountry: {country}"}
        ],
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    return json.loads(completion.choices[0].message.content)

def search_scholarships_ai(query: str) -> list[dict]:
    system_prompt = """You are a scholarship database assistant. Generate a list of 5 real or highly realistic scholarships based on the user's query.
    For each scholarship, provide:
    - title: Name of the scholarship
    - amount: Funding amount (e.g. $10,000, Full Tuition)
    - deadline: Typical deadline (e.g. March 2024 or Rolling)
    - description: Brief details of eligibility.
    - link: A plausible search link or official site.
    
    Return ONLY valid JSON in a list format."""
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile", # Using 8b for faster responses in search
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Search Query: {query}"}
        ],
        temperature=0.6,
        response_format={"type": "json_object"}
    )
    
    data = json.loads(completion.choices[0].message.content)
    # The LLM might return {"scholarships": [...]} or just the list.
    if isinstance(data, dict):
        for key in ["scholarships", "data", "results"]:
            if key in data:
                return data[key]
    return data if isinstance(data, list) else []
