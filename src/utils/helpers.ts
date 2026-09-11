import { Organization, CorperProfile } from '../types';
import { COURSE_CATEGORIES } from '../data/nigeriaStates';

export function formatNaira(amount: number): string {
  if (amount === 0) return 'None / Voluntary';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateMatchScore(corper: CorperProfile, org: Organization): { score: number; reasons: string[] } {
  let score = 30; // base score for same state
  const reasons: string[] = [];

  // State match
  if (corper.stateOfService.toLowerCase() === org.state.toLowerCase()) {
    score += 20;
    reasons.push(`Located in your state of service (${org.state})`);
  }

  // Course matching
  const courseMeta = COURSE_CATEGORIES[corper.courseOfStudy];
  const isDirectDiscipline = org.preferredDisciplines.some(d =>
    d.toLowerCase().includes(corper.courseOfStudy.toLowerCase()) ||
    corper.courseOfStudy.toLowerCase().includes(d.toLowerCase())
  );

  if (isDirectDiscipline) {
    score += 35;
    reasons.push(`Direct discipline match for ${corper.courseOfStudy}`);
  } else if (courseMeta && courseMeta.preferredSectors.includes(org.sector)) {
    score += 25;
    reasons.push(`Strong sector fit for ${courseMeta.category} graduates`);
  }

  // Soft skills match
  const matchingSkills = corper.softSkills.filter(skill =>
    org.preferredSkills.some(ps => ps.toLowerCase() === skill.toLowerCase())
  );

  if (matchingSkills.length > 0) {
    const skillBonus = Math.min(matchingSkills.length * 10, 20);
    score += skillBonus;
    reasons.push(`Matches soft skills: ${matchingSkills.join(', ')}`);
  }

  // Accommodation preference bonus
  if (org.accommodation.includes('Provided') || org.accommodation.includes('Subsidized')) {
    score += 5;
    reasons.push(`${org.accommodation} available`);
  }

  // Cap at 99%
  const finalScore = Math.min(Math.max(score, 25), 99);
  return { score: finalScore, reasons };
}
