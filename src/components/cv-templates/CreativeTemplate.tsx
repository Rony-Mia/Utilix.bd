import React from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Languages as LanguagesIcon,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { CvData, CvLanguage } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

interface TemplateProps {
  data: CvData;
  language: CvLanguage;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = CV_LABELS[language] || CV_LABELS.bn;
  const { personalInfo, education, experience, skills, languages, references } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm print:shadow-none">
      <div>
        {/* Creative Angled Color-Blocked Header Band */}
        <header className="relative bg-[#0f172a] text-white p-6 sm:p-8 overflow-hidden break-inside-avoid">
          {/* Subtle geometric angular accent overlay */}
          <div
            className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/20 via-amber-500/5 to-transparent pointer-events-none transform skew-x-12 translate-x-12"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex-1 text-center sm:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Curriculum Vitae</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
              </h1>

              {personalInfo.designationOrTitle && (
                <p className="text-xs sm:text-sm font-semibold text-amber-400 tracking-wider uppercase mt-1">
                  {personalInfo.designationOrTitle}
                </p>
              )}

              {/* Contact Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 mt-3.5 text-xs text-slate-300">
                {personalInfo.phone && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.email && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{personalInfo.email}</span>
                  </span>
                )}
                {personalInfo.presentAddress && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{personalInfo.presentAddress}</span>
                  </span>
                )}
                {personalInfo.linkedinOrWebsite && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{personalInfo.linkedinOrWebsite}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Circular Photo with Dual Ring Accent */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-amber-400/80 shadow-xl overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
              {personalInfo.photoUrl ? (
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-amber-300/80">
                  <User className="w-12 h-12 stroke-[1.5]" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Vibrant Accent Line between Header and Body */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Main 2-Column Creative Body */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
          {/* Left Column (~34% width): Skills (with Dot indicators), Languages, Personal Details */}
          <div className="w-full sm:w-[34%] space-y-6 shrink-0">
            {/* Skills with Visual Dot Proficiency Indicators */}
            {skills && skills.length > 0 && (
              <section>
                <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-3">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.skills}
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {skills.map((skill, idx) => {
                    // Staggered filled dots (4 or 5 out of 5) for visual craft
                    const dotCounts = [5, 4, 5, 4, 4, 5, 4];
                    const filled = dotCounts[idx % dotCounts.length];

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-800">{skill}</span>
                          {/* 5-Dot Visual Rating Indicator */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((dot) => (
                              <span
                                key={dot}
                                className={`w-2 h-2 rounded-full ${
                                  dot <= filled ? 'bg-amber-500' : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-3">
                  <LanguagesIcon className="w-4 h-4 text-amber-600 shrink-0" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.languages}
                  </h2>
                </div>

                <div className="space-y-2">
                  {languages.map((lang, idx) => (
                    <div
                      key={lang.id || idx}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200/80 text-xs"
                    >
                      <span className="font-semibold text-slate-800">{lang.name}</span>
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Personal Details in Clean Card */}
            <section>
              <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-3">
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {t.personalDetails}
                </h2>
              </div>

              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
                {personalInfo.fatherName && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500 text-[11px]">{t.fatherName}:</span>
                    <span className="font-semibold text-slate-900">{personalInfo.fatherName}</span>
                  </div>
                )}
                {personalInfo.motherName && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500 text-[11px]">{t.motherName}:</span>
                    <span className="font-semibold text-slate-900">{personalInfo.motherName}</span>
                  </div>
                )}
                {personalInfo.dateOfBirth && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500 text-[11px]">{t.dateOfBirth}:</span>
                    <span className="font-semibold text-slate-900">{personalInfo.dateOfBirth}</span>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500 text-[11px]">{t.nationality}:</span>
                    <span className="font-semibold text-slate-900">{personalInfo.nationality}</span>
                  </div>
                )}
                {personalInfo.bloodGroup && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500 text-[11px]">{t.bloodGroup}:</span>
                    <span className="font-bold text-amber-700">{personalInfo.bloodGroup}</span>
                  </div>
                )}
                {personalInfo.nationalId && (
                  <div className="flex justify-between border-b border-slate-200/60 pb-1">
                    <span className="text-slate-500 text-[11px]">{t.nationalId}:</span>
                    <span className="font-mono text-slate-900">{personalInfo.nationalId}</span>
                  </div>
                )}
                {personalInfo.permanentAddress && (
                  <div className="pt-1">
                    <span className="text-slate-500 text-[11px] block">{t.permanentAddress}:</span>
                    <span className="text-slate-800 text-[11px]">{personalInfo.permanentAddress}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (~66% width): Objective, Experience, Education, References */}
          <div className="flex-1 space-y-6">
            {/* Career Objective */}
            {personalInfo.careerObjective && (
              <section>
                <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.careerObjective}
                  </h2>
                </div>
                <p className="text-slate-700 text-xs sm:text-[13px] leading-relaxed text-justify bg-amber-50/40 p-3 rounded-lg border-l-3 border-amber-500">
                  {personalInfo.careerObjective}
                </p>
              </section>
            )}

            {/* Work Experience */}
            {experience && experience.length > 0 && (
              <section>
                <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-3">
                  <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.experience}
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs border-l-4 border-l-slate-900 hover:border-l-amber-500 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="font-bold text-slate-900 text-sm">{exp.designation}</h3>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                          {exp.duration}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{exp.company}</p>

                      {exp.responsibilities && (
                        <p className="text-slate-700 mt-2 text-xs whitespace-pre-line leading-relaxed">
                          {exp.responsibilities}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Educational Qualifications */}
            {education && education.length > 0 && (
              <section>
                <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-3">
                  <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.education}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{edu.degree}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">{edu.institution}</p>
                        {edu.boardOrMajor && (
                          <p className="text-[11px] text-slate-500">{edu.boardOrMajor}</p>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {edu.passingYear}
                        </span>
                        {edu.result && (
                          <p className="text-xs font-bold text-amber-700 mt-1">
                            {t.result}: {edu.result}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* References */}
            {references && references.length > 0 && (
              <section>
                <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-3">
                  <Users className="w-4 h-4 text-amber-600 shrink-0" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {t.references}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {references.map((ref, idx) => (
                    <div key={ref.id || idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">{ref.name}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{ref.designation}, {ref.organization}</p>
                      <p className="text-slate-500 text-[11px] font-mono mt-1">{ref.phone}</p>
                      {ref.email && <p className="text-slate-500 text-[11px] font-mono">{ref.email}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Signature & Date Footer */}
      <footer className="mt-8 p-6 sm:p-8 border-t border-slate-200 flex justify-between items-end text-xs break-inside-avoid">
        <div className="text-slate-500 text-[11px]">
          <p>{language === 'bn' ? 'তারিখ: ....................' : 'Date: ....................'}</p>
        </div>
        <div className="text-center">
          <div className="w-40 border-b border-slate-800 mb-1.5"></div>
          <p className="font-bold text-slate-800 text-[11px]">{t.signature}</p>
        </div>
      </footer>
    </div>
  );
};
