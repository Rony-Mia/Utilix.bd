export type SscGrade = 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'F';

export interface SscSubject {
  id: string;
  name: string;
  marks: number | '';
  grade: SscGrade;
  point: number;
  isFourthSubject: boolean;
}

export interface SscGpaResult {
  finalGpa: number;
  letterGrade: SscGrade;
  isPassed: boolean;
  hasFailedMandatory: boolean;
  failedSubjects: string[];
  totalPoints: number;
  fourthSubjectBonus: number;
  gpaWithoutFourth: number;
  mandatoryCount: number;
}

export const SSC_GRADE_OPTIONS: Array<{ grade: SscGrade; point: number; markRange: string }> = [
  { grade: 'A+', point: 5.0, markRange: '৮০ - ১০০' },
  { grade: 'A', point: 4.0, markRange: '৭০ - ৭৯' },
  { grade: 'A-', point: 3.5, markRange: '৬০ - ৬৯' },
  { grade: 'B', point: 3.0, markRange: '৫০ - ৫৯' },
  { grade: 'C', point: 2.0, markRange: '৪০ - ৪৯' },
  { grade: 'D', point: 1.0, markRange: '৩৩ - ৩৯' },
  { grade: 'F', point: 0.0, markRange: '০ - ৩২' },
];

export const SSC_GRADE_MAP: Record<SscGrade, number> = {
  'A+': 5.0,
  A: 4.0,
  'A-': 3.5,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

/**
 * Maps marks (0-100) to standard Bangladesh Education Board letter grade & points.
 */
export function marksToSscGrade(marks: number): { grade: SscGrade; point: number } {
  const m = Math.max(0, Math.min(100, Math.round(marks)));
  if (m >= 80) return { grade: 'A+', point: 5.0 };
  if (m >= 70) return { grade: 'A', point: 4.0 };
  if (m >= 60) return { grade: 'A-', point: 3.5 };
  if (m >= 50) return { grade: 'B', point: 3.0 };
  if (m >= 40) return { grade: 'C', point: 2.0 };
  if (m >= 33) return { grade: 'D', point: 1.0 };
  return { grade: 'F', point: 0.0 };
}

/**
 * Calculates GPA on a 5.00 scale following Bangladesh Secondary & Higher Secondary Education Board rules.
 * Rule:
 * 1. If any mandatory subject has F (0.00), the overall result is Fail (GPA 0.00).
 * 2. 4th subject points above 2.00 are added to the sum of mandatory points.
 * 3. GPA = min(5.00, (Sum of mandatory points + bonus) / number of mandatory subjects).
 */
export function calculateSscGpa(subjects: SscSubject[]): SscGpaResult {
  const mandatory = subjects.filter((s) => !s.isFourthSubject);
  const fourthSubject = subjects.find((s) => s.isFourthSubject);

  const failedSubjects = mandatory.filter((s) => s.grade === 'F').map((s) => s.name || 'অজ্ঞাত বিষয়');
  const hasFailedMandatory = failedSubjects.length > 0;

  const mandatoryCount = mandatory.length;
  if (mandatoryCount === 0) {
    return {
      finalGpa: 0,
      letterGrade: 'F',
      isPassed: false,
      hasFailedMandatory: false,
      failedSubjects: [],
      totalPoints: 0,
      fourthSubjectBonus: 0,
      gpaWithoutFourth: 0,
      mandatoryCount: 0,
    };
  }

  const mandatoryPointsSum = mandatory.reduce((sum, s) => sum + s.point, 0);

  // 4th subject bonus: Grade points strictly above 2.00 are added as bonus points
  const fourthSubjectBonus = fourthSubject ? Math.max(0, fourthSubject.point - 2.0) : 0;
  const totalPoints = mandatoryPointsSum + fourthSubjectBonus;

  if (hasFailedMandatory) {
    return {
      finalGpa: 0.0,
      letterGrade: 'F',
      isPassed: false,
      hasFailedMandatory: true,
      failedSubjects,
      totalPoints,
      fourthSubjectBonus,
      gpaWithoutFourth: 0.0,
      mandatoryCount,
    };
  }

  const rawGpa = totalPoints / mandatoryCount;
  const finalGpa = Math.min(5.0, Number(rawGpa.toFixed(2)));

  const rawGpaWithoutFourth = mandatoryPointsSum / mandatoryCount;
  const gpaWithoutFourth = Math.min(5.0, Number(rawGpaWithoutFourth.toFixed(2)));

  // Derive final letter grade from computed GPA
  let letterGrade: SscGrade = 'F';
  if (finalGpa >= 5.0) letterGrade = 'A+';
  else if (finalGpa >= 4.0) letterGrade = 'A';
  else if (finalGpa >= 3.5) letterGrade = 'A-';
  else if (finalGpa >= 3.0) letterGrade = 'B';
  else if (finalGpa >= 2.0) letterGrade = 'C';
  else if (finalGpa >= 1.0) letterGrade = 'D';

  return {
    finalGpa,
    letterGrade,
    isPassed: true,
    hasFailedMandatory: false,
    failedSubjects: [],
    totalPoints,
    fourthSubjectBonus,
    gpaWithoutFourth,
    mandatoryCount,
  };
}

// ----------------------------------------------------
// University CGPA (4.00 Scale, UGC Bangladesh Standard)
// ----------------------------------------------------

export type UniversityGrade =
  | 'A+'
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'D'
  | 'F';

export interface UniversityCourse {
  id: string;
  name: string;
  credits: number | '';
  grade: UniversityGrade;
  gradePoint: number;
}

export interface UniversitySemester {
  id: string;
  name: string;
  gpa: number | '';
  credits: number | '';
}

export interface UniversityCgpaResult {
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  totalWeightedPoints: number;
  hasFailCourse: boolean;
}

export interface SemesterCgpaResult {
  overallCgpa: number;
  totalCredits: number;
  totalWeightedPoints: number;
}

export const UNIVERSITY_GRADE_OPTIONS: Array<{
  grade: UniversityGrade;
  point: number;
  marksPercent: string;
}> = [
  { grade: 'A+', point: 4.0, marksPercent: '৮০% ও তদূর্ধ্ব' },
  { grade: 'A', point: 3.75, marksPercent: '৭৫% থেকে < ৮০%' },
  { grade: 'A-', point: 3.5, marksPercent: '৭০% থেকে < ৭৫%' },
  { grade: 'B+', point: 3.25, marksPercent: '৬৫% থেকে < ৭০%' },
  { grade: 'B', point: 3.0, marksPercent: '৬০% থেকে < ৬৫%' },
  { grade: 'B-', point: 2.75, marksPercent: '৫৫% থেকে < ৬০%' },
  { grade: 'C+', point: 2.5, marksPercent: '৫০% থেকে < ৫৫%' },
  { grade: 'C', point: 2.25, marksPercent: '৪৫% থেকে < ৫০%' },
  { grade: 'D', point: 2.0, marksPercent: '৪০% থেকে < ৪৫%' },
  { grade: 'F', point: 0.0, marksPercent: '৪০% এর কম (অকৃতকার্য)' },
];

export const UNIVERSITY_GRADE_MAP: Record<UniversityGrade, number> = {
  'A+': 4.0,
  A: 3.75,
  'A-': 3.5,
  'B+': 3.25,
  B: 3.0,
  'B-': 2.75,
  'C+': 2.5,
  C: 2.25,
  D: 2.0,
  F: 0.0,
};

/**
 * Calculates semester or course-wise CGPA based on credits and grade points.
 * Formula: CGPA = Σ(Credit × Grade Point) / Total Credit Hours
 */
export function calculateCourseCgpa(courses: UniversityCourse[]): UniversityCgpaResult {
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalWeightedPoints = 0;
  let hasFailCourse = false;

  for (const c of courses) {
    const cred = typeof c.credits === 'number' && !isNaN(c.credits) && c.credits > 0 ? c.credits : 0;
    if (cred > 0) {
      totalCredits += cred;
      totalWeightedPoints += cred * c.gradePoint;
      if (c.grade !== 'F' && c.gradePoint > 0) {
        earnedCredits += cred;
      } else {
        hasFailCourse = true;
      }
    }
  }

  const cgpa = totalCredits > 0 ? Number((totalWeightedPoints / totalCredits).toFixed(2)) : 0.0;

  return {
    cgpa,
    totalCredits: Number(totalCredits.toFixed(2)),
    earnedCredits: Number(earnedCredits.toFixed(2)),
    totalWeightedPoints: Number(totalWeightedPoints.toFixed(2)),
    hasFailCourse,
  };
}

/**
 * Calculates overall CGPA across multiple semesters by weighted average of semester GPAs and credits.
 * Formula: Cumulative CGPA = Σ(Semester GPA × Semester Credits) / Total Credits
 */
export function calculateSemesterCgpa(semesters: UniversitySemester[]): SemesterCgpaResult {
  let totalCredits = 0;
  let totalWeightedPoints = 0;

  for (const s of semesters) {
    const cred = typeof s.credits === 'number' && !isNaN(s.credits) && s.credits > 0 ? s.credits : 0;
    const gpaVal = typeof s.gpa === 'number' && !isNaN(s.gpa) && s.gpa >= 0 ? s.gpa : 0;

    if (cred > 0) {
      totalCredits += cred;
      totalWeightedPoints += cred * Math.min(4.0, Math.max(0, gpaVal));
    }
  }

  const overallCgpa =
    totalCredits > 0 ? Number((totalWeightedPoints / totalCredits).toFixed(2)) : 0.0;

  return {
    overallCgpa,
    totalCredits: Number(totalCredits.toFixed(2)),
    totalWeightedPoints: Number(totalWeightedPoints.toFixed(2)),
  };
}

/**
 * Converts English digits and numbers to Bengali digits.
 */
export function toBanglaNum(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)]);
}
