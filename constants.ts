
import { InterestDomain, Question } from './types';

export const QUESTIONS: Question[] = [
  { id: '1', text: 'I enjoy solving complex logical puzzles and working with algorithms.', domain: InterestDomain.TECHNOLOGY },
  { id: '2', text: 'I am fascinated by how biological organisms or chemical reactions work.', domain: InterestDomain.SCIENCE },
  { id: '3', text: 'I like analyzing data to find trends and patterns.', domain: InterestDomain.MATH },
  { id: '4', text: 'I enjoy creating visual art, sketches, or digital designs.', domain: InterestDomain.CREATIVITY },
  { id: '5', text: 'I find it rewarding to organize people and lead a team toward a goal.', domain: InterestDomain.MANAGEMENT },
  { id: '6', text: 'I love learning new languages and expressing ideas through writing.', domain: InterestDomain.COMMUNICATION },
  { id: '7', text: 'I feel a deep sense of purpose when helping others with their health.', domain: InterestDomain.HEALTHCARE },
  { id: '8', text: 'I am passionate about community service and helping the underprivileged.', domain: InterestDomain.SOCIAL_SERVICE },
  { id: '9', text: 'I often think of new business ideas and how to bring them to market.', domain: InterestDomain.ENTREPRENEURSHIP },
  { id: '10', text: 'I thrive in physically active environments and enjoy sports.', domain: InterestDomain.SPORTS },
  { id: '11', text: 'Building software or web applications excites me.', domain: InterestDomain.TECHNOLOGY },
  { id: '12', text: 'Conducting experiments to discover new facts is appealing to me.', domain: InterestDomain.SCIENCE },
  { id: '13', text: 'I like working with financial models and statistics.', domain: InterestDomain.MATH },
  { id: '14', text: 'I am interested in interior design or architectural aesthetics.', domain: InterestDomain.CREATIVITY },
  { id: '15', text: 'I enjoy making strategic decisions for a company or project.', domain: InterestDomain.MANAGEMENT },
  { id: '16', text: 'Public speaking and debating are activities I enjoy.', domain: InterestDomain.COMMUNICATION },
  { id: '17', text: 'I am interested in how medical technology can save lives.', domain: InterestDomain.HEALTHCARE },
  { id: '18', text: 'I want to work in NGOs or non-profit organizations.', domain: InterestDomain.SOCIAL_SERVICE },
  { id: '19', text: 'I enjoy the risk and excitement of starting something from scratch.', domain: InterestDomain.ENTREPRENEURSHIP },
  { id: '20', text: 'Understanding human physiology and physical training interests me.', domain: InterestDomain.SPORTS },
];

export const DOMAIN_COLORS: Record<InterestDomain, string> = {
  [InterestDomain.TECHNOLOGY]: '#3b82f6',
  [InterestDomain.SCIENCE]: '#10b981',
  [InterestDomain.MATH]: '#6366f1',
  [InterestDomain.CREATIVITY]: '#ec4899',
  [InterestDomain.MANAGEMENT]: '#f59e0b',
  [InterestDomain.COMMUNICATION]: '#8b5cf6',
  [InterestDomain.HEALTHCARE]: '#ef4444',
  [InterestDomain.SOCIAL_SERVICE]: '#06b6d4',
  [InterestDomain.ENTREPRENEURSHIP]: '#f97316',
  [InterestDomain.SPORTS]: '#84cc16'
};
