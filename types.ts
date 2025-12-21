
export enum InterestDomain {
  TECHNOLOGY = 'Technology & Computing',
  SCIENCE = 'Science & Research',
  MATH = 'Mathematics & Analytics',
  CREATIVITY = 'Creativity & Design',
  MANAGEMENT = 'Management & Leadership',
  COMMUNICATION = 'Communication & Languages',
  HEALTHCARE = 'Healthcare & Helping Professions',
  SOCIAL_SERVICE = 'Social Service & Community Work',
  ENTREPRENEURSHIP = 'Entrepreneurship & Innovation',
  SPORTS = 'Sports & Physical Activities'
}

export interface Question {
  id: string;
  text: string;
  domain: InterestDomain;
}

export type InterestScores = Record<InterestDomain, number>;

export interface RoadmapStep {
  title: string;
  description: string;
  timeframe: string;
}

export interface CareerResult {
  role: string;
  domain: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  certifications: string[];
  roadmap: RoadmapStep[];
}

export interface RecommendationResponse {
  topCareers: CareerResult[];
  profileSummary: string;
}
