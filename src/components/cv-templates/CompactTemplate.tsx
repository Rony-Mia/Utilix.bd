import React from 'react';
import { User, Phone, Mail, MapPin, Globe, Award, GraduationCap, Briefcase, Sparkles, BookOpen } from 'lucide-react';
import { CvData, CvLanguage } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

interface TemplateProps {
  data: CvData;
  language: CvLanguage;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = CV_LABELS[language] || CV_LABELS.bn;
  const { personalInfo, education, experience, skills, languages, references } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans leading-normal text-xs shadow-sm print:shadow-none">
      <div>
        {/* Strong Top Header Band */}
        <header className="bg-[#1e293b] text-white p-5 sm:p-6 border-b-4 border-emerald-600 break-inside-avoid">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white uppercase">
                {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
              </h1>

              {personalInfo.designationOrTitle && (
                <p className="text-xs font-semibold text-emerald-400 tracking-wide uppercase mt-0.5">
                  {personalInfo.designationOrTitle}
                </p>
              )}

              {/* Compact Contact Strip in Header */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11px] text-slate-300">
                {personalInfo.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{personalInfo.email}</span>
                  </span>
                )}
                {personalInfo.presentAddress && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{personalInfo.presentAddress}</span>
                  </span>
                )}
                {personalInfo.linkedinOrWebsite && (
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{personalInfo.linkedinOrWebsite}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Photo in Header Band with Silhouette Fallback */}
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded border-2 border-white/80 shadow-md bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
              {personalInfo.photoUrl ? (
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                  <User className="w-10 h-10 stroke-[1.5]" />
                  <span className="text-[9px] mt-1 text-slate-400">
                    {language === 'bn' ? 'ছবি' : 'Photo'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 2-Column Compact Body Layout */}
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Left Column (35% width, light tinted background) */}
          <div className="w-full sm:w-[36%] bg-slate-50/80 border-r border-slate-200 p-4 sm:p-5 space-y-4 shrink-0">
            {/* Education in Left Column */}
            {education && education.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.education}
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className="bg-white p-2 rounded border border-slate-200/80 shadow-2xs">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">{edu.passingYear}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5">{edu.institution}</p>
                      {edu.boardOrMajor && (
                        <p className="text-[10px] text-slate-500">{edu.boardOrMajor}</p>
                      )}
                      {edu.result && (
                        <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                          {t.result}: {edu.result}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills in Left Column */}
            {skills && skills.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.skills}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-slate-800 text-[11px] px-2 py-0.5 rounded border border-slate-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages in Left Column */}
            {languages && languages.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.languages}
                  </h2>
                </div>

                <div className="space-y-1 text-[11px]">
                  {languages.map((lang, idx) => (
                    <div key={lang.id || idx} className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                      <span className="font-medium text-slate-800">{lang.name}</span>
                      <span className="text-slate-600 text-[10px] font-semibold">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Details in Left Column */}
            <div>
              <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  {t.personalDetails}
                </h2>
              </div>

              <div className="space-y-1 text-[11px] text-slate-700">
                {personalInfo.fatherName && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.fatherName}:</span>
                    <span className="font-medium text-slate-900">{personalInfo.fatherName}</span>
                  </div>
                )}
                {personalInfo.motherName && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.motherName}:</span>
                    <span className="font-medium text-slate-900">{personalInfo.motherName}</span>
                  </div>
                )}
                {personalInfo.dateOfBirth && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.dateOfBirth}:</span>
                    <span className="font-medium text-slate-900">{personalInfo.dateOfBirth}</span>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.nationality}:</span>
                    <span className="font-medium text-slate-900">{personalInfo.nationality}</span>
                  </div>
                )}
                {personalInfo.bloodGroup && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.bloodGroup}:</span>
                    <span className="font-semibold text-rose-700">{personalInfo.bloodGroup}</span>
                  </div>
                )}
                {personalInfo.nationalId && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t.nationalId}:</span>
                    <span className="font-mono text-slate-900">{personalInfo.nationalId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (64% width, White Background) */}
          <div className="flex-1 p-4 sm:p-5 space-y-4">
            {/* Career Objective */}
            {personalInfo.careerObjective && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                  <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.careerObjective}
                  </h2>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed text-justify">
                  {personalInfo.careerObjective}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {experience && experience.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.experience}
                  </h2>
                </div>

                <div className="space-y-3">
                  {experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="border-l-2 border-emerald-600 pl-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-slate-900 text-xs">{exp.designation}</h3>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-700 mt-0.5">{exp.company}</p>
                      {exp.responsibilities && (
                        <p className="text-slate-600 mt-1 text-xs whitespace-pre-line leading-relaxed">
                          {exp.responsibilities}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Permanent Address */}
            {personalInfo.permanentAddress && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.permanentAddress}
                  </h2>
                </div>
                <p className="text-xs text-slate-700">{personalInfo.permanentAddress}</p>
              </div>
            )}

            {/* References */}
            {references && references.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                  <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.references}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {references.map((ref, idx) => (
                    <div key={ref.id || idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">{ref.name}</p>
                      <p className="text-slate-600 text-[10px]">{ref.designation}, {ref.organization}</p>
                      <p className="text-slate-500 text-[10px] font-mono mt-0.5">{ref.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Declaration & Signature */}
      <footer className="mt-8 p-4 sm:p-5 border-t border-slate-200 bg-white flex justify-between items-end text-xs break-inside-avoid">
        <div className="text-slate-500 text-[11px]">
          <p>{language === 'bn' ? 'তারিখ: ....................' : 'Date: ....................'}</p>
        </div>
        <div className="text-center">
          <div className="w-36 border-b border-slate-700 mb-1"></div>
          <p className="font-semibold text-slate-800 text-[11px]">{t.signature}</p>
        </div>
      </footer>
    </div>
  );
};
