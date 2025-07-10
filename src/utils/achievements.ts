import { ClimbingSession, ClimbingDiscipline } from '../types';

// --- Rank Tiers ---
export const RANKS = [
  { name: 'Beginner', minSessions: 0 },
  { name: 'Bronze', minSessions: 5 },
  { name: 'Silver', minSessions: 15 },
  { name: 'Gold', minSessions: 30 },
  { name: 'Platinum', minSessions: 50 },
  { name: 'Diamond', minSessions: 75 },
  { name: 'Master', minSessions: 100 },
  { name: 'Champion', minSessions: 150 },
  { name: 'Legend', minSessions: 200 },
];

export function getUserRank(sessions: ClimbingSession[]): string {
  const count = sessions.length;
  let currentRank = RANKS[0].name;
  for (const rank of RANKS) {
    if (count >= rank.minSessions) {
      currentRank = rank.name;
    }
  }
  return currentRank;
}

// --- Achievements ---
export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
};

const GRADE_MILESTONES = ['V3', 'V5', 'V7', 'V10', '5.10a', '5.12a'];

export function getUserAchievements(sessions: ClimbingSession[]): Achievement[] {
  const achievements: Achievement[] = [];
  const sentSessions = sessions.filter(s => s.sent);
  const disciplines = new Set(sessions.map(s => s.discipline));
  const gradesSent = new Set(sentSessions.map(s => s.grade));

  // First Session
  achievements.push({
    id: 'first-session',
    name: 'First Session',
    description: 'Log your first session',
    unlocked: sessions.length > 0,
  });

  // First Send
  achievements.push({
    id: 'first-send',
    name: 'First Send',
    description: 'Mark a session as sent',
    unlocked: sentSessions.length > 0,
  });

  // Grade Milestones
  for (const grade of GRADE_MILESTONES) {
    achievements.push({
      id: `sent-${grade}`,
      name: `Sent ${grade}`,
      description: `Send a ${grade} or harder`,
      unlocked: Array.from(gradesSent).some(g => g === grade),
    });
  }

  // Streaks (simple: 3, 7, 30 days in a row)
  const dates = Array.from(new Set(sessions.map(s => s.date.split('T')[0]))).sort();
  let maxStreak = 0, streak = 0, prevDate: Date | null = null;
  for (const dateStr of dates) {
    const date = new Date(dateStr);
    if (prevDate) {
      const diff = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    if (streak > maxStreak) maxStreak = streak;
    prevDate = date;
  }
  achievements.push({
    id: 'streak-3',
    name: '3 Day Streak',
    description: 'Climb 3 days in a row',
    unlocked: maxStreak >= 3,
  });
  achievements.push({
    id: 'streak-7',
    name: '7 Day Streak',
    description: 'Climb 7 days in a row',
    unlocked: maxStreak >= 7,
  });
  achievements.push({
    id: 'streak-30',
    name: '30 Day Streak',
    description: 'Climb 30 days in a row',
    unlocked: maxStreak >= 30,
  });

  // All Disciplines
  achievements.push({
    id: 'all-disciplines',
    name: 'All Disciplines',
    description: 'Complete at least one session in Boulder, Lead, and Top Rope',
    unlocked: [ClimbingDiscipline.BOULDER, ClimbingDiscipline.LEAD, ClimbingDiscipline.TOP_ROPE].every(d => disciplines.has(d)),
  });

  // Session Milestones
  [10, 25, 50, 100].forEach(n => {
    achievements.push({
      id: `sessions-${n}`,
      name: `${n} Sessions`,
      description: `Log ${n} sessions`,
      unlocked: sessions.length >= n,
    });
  });

  return achievements;
} 