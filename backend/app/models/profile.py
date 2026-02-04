from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional, Union, Dict, Any

class TestScores(BaseModel):
    model_config = ConfigDict(extra='ignore')
    ielts: Optional[Union[str, float, int]] = ""
    toefl: Optional[Union[str, float, int]] = ""
    gre: Optional[Union[str, float, int]] = ""
    gmat: Optional[Union[str, float, int]] = ""
    sat: Optional[Union[str, float, int]] = ""
    act: Optional[Union[str, float, int]] = ""

class Profile(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: Optional[str] = None
    name: Optional[Union[str, List[str]]] = ""
    email: str
    current_degree: Optional[Union[str, List[str]]] = ""
    current_university: Optional[Union[str, List[str]]] = ""
    gpa: Optional[Union[str, float, int]] = ""
    work_experience: Optional[Union[str, List[str]]] = ""
    research_experience: Optional[Union[str, List[str]]] = ""
    test_scores: Optional[TestScores] = None
    skills: Optional[Union[str, List[str]]] = ""
    projects: Optional[Union[str, List[str]]] = ""
    target_country: Optional[Union[str, List[str]]] = ""
    target_degree: Optional[Union[str, List[str]]] = ""
    budget: Optional[Union[str, List[str]]] = ""
    shortlisted_universities: Optional[Union[str, List[str]]] = ""
    checklist: Optional[Union[List[dict], Dict[str, Any]]] = {}

    @field_validator('name', 'current_degree', 'current_university', 'work_experience', 'research_experience', 'skills', 'projects', 'target_country', 'target_degree', 'budget', 'shortlisted_universities', mode='before')
    @classmethod
    def to_string(cls, v):
        if isinstance(v, list):
            return ", ".join(str(item) for item in v)
        return str(v) if v is not None else ""

    @field_validator('gpa', mode='before')
    @classmethod
    def gpa_to_string(cls, v):
        return str(v) if v is not None else ""
