import React from 'react';
import { User, Phone, Mail, MapPin, Globe, Briefcase, GraduationCap, Users } from 'lucide-react';
import { CvData, CvLanguage } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

interface TemplateProps {
  data: CvData;
  language: CvLanguage;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = CV_LABELS[language] || CV_LABELS.bn;
  const { personalInfo, education, experience, skills, languages, references } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm print:shadow-none flex flex-col md:flex-row items-stretch">
      {/* Left Sidebar (32% width) with deep forest green background */}
      <aside className="w-full md:w-[32%] bg-[#083f2a] text-slate-100 p-6 sm:p-7 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Circular Photo with subtle glow ring and silhouette fallback */}
          <div className="flex flex-col items-center break-inside-avoid">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-emerald-600/40 shadow-lg overflow-hidden bg-emerald-950/80 flex items-center justify-center">
              {personalInfo.photoUrl ? (
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950 text-emerald-300/70">
                  <User className="w-14 h-14 stroke-[1.5]" />
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-3">
              {t.contact}
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-200">
              {personalInfo.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.presentAddress && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{personalInfo.presentAddress}</span>
                </li>
              )}
              {personalInfo.linkedinOrWebsite && (
                <li className="flex items-start gap-2.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.linkedinOrWebsite}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Skills (Rendered as clean strength bars and tags) */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-3">
                {t.skills}
              </h2>
              <div className="space-y-2.5">
                {skills.map((skill, idx) => {
                  // Varied visual strength indicator width for realistic modern resume look
                  const widths = ['85%', '92%', '78%', '88%', '80%', '90%', '75%'];
                  const barWidth = widths[idx % widths.length];

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-200 font-medium">
                        <span>{skill}</span>
                      </div>
                      <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: barWidth }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-2.5">
                {t.languages}
              </h2>
              <div className="space-y-2 text-xs">
                {languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-center text-slate-200">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-700/50 text-emerald-200">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Details in Sidebar */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-2.5">
              {t.personalDetails}
            </h2>
            <div className="space-y-1.5 text-xs text-slate-300">
              {personalInfo.fatherName && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.fatherName}</span>
                  <span className="font-medium text-slate-100">{personalInfo.fatherName}</span>
                </div>
              )}
              {personalInfo.motherName && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.motherName}</span>
                  <span className="font-medium text-slate-100">{personalInfo.motherName}</span>
                </div>
              )}
              {personalInfo.dateOfBirth && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.dateOfBirth}</span>
                  <span className="font-medium text-slate-100">{personalInfo.dateOfBirth}</span>
                </div>
              )}
              {personalInfo.nationality && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.nationality}</span>
                  <span className="font-medium text-slate-100">{personalInfo.nationality}</span>
                </div>
              )}
              {personalInfo.nationalId && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.nationalId}</span>
                  <span className="font-mono text-slate-100">{personalInfo.nationalId}</span>
                </div>
              )}
              {personalInfo.bloodGroup && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.bloodGroup}</span>
                  <span className="font-semibold text-rose-300">{personalInfo.bloodGroup}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Minimal copyright/watermark footer in sidebar */}
        <div className="pt-6 border-t border-emerald-800/40 text-[10px] text-emerald-400/70 font-mono">
          <span>Utilix.bd • BioData</span>
        </div>
      </aside>

      {/* Right Content Area (68% width) */}
      <main className="flex-1 p-6 sm:p-9 flex flex-col justify-between space-y-6">
        <div>
          {/* Header Name & Title */}
          <div className="border-b-2 border-slate-100 pb-4 mb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
            </h1>
            {personalInfo.designationOrTitle && (
              <p className="text-sm font-semibold text-emerald-700 tracking-wide uppercase mt-1">
                {personalInfo.designationOrTitle}
              </p>
            )}

            {personalInfo.careerObjective && (
              <div className="mt-3 bg-emerald-50/60 border-l-3 border-emerald-600 p-3 rounded-r text-slate-700 text-xs leading-relaxed">
                {personalInfo.careerObjective}
              </div>
            )}
          </div>

          {/* Work Experience Timeline */}
          {experience && experience.length > 0 && (
            <section className="mb-6 break-inside-avoid">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {t.experience}
                </h2>
              </div>

              <div className="border-l-2 border-emerald-200 ml-2 pl-4 space-y-4 relative">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative break-inside-avoid">
                    {/* Timeline Dot Marker */}
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 ring-4 ring-white" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-[13px]">{exp.designation}</h3>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                        {exp.duration}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-600 mt-0.5">{exp.company}</p>

                    {exp.responsibilities && (
                      <p className="text-slate-700 mt-1.5 text-xs whitespace-pre-line leading-relaxed">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Educational Qualifications Timeline */}
          {education && education.length > 0 && (
            <section className="mb-6 break-inside-avoid">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {t.education}
                </h2>
              </div>

              <div className="border-l-2 border-emerald-200 ml-2 pl-4 space-y-3.5 relative">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="relative break-inside-avoid">
                    {/* Timeline Dot Marker */}
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 ring-4 ring-white" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-[13px]">{edu.degree}</h3>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">
                        {edu.passingYear}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      {edu.institution} {edu.boardOrMajor && `• ${edu.boardOrMajor}`}
                    </p>

                    {edu.result && (
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {t.result}: {edu.result}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <section className="mb-4 break-inside-avoid">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {t.references}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {references.map((ref, idx) => (
                  <div key={ref.id || idx} className="border border-slate-200 bg-slate-50/50 p-3 rounded-xs border-l-3 border-l-emerald-700 break-inside-avoid">
                    <p className="font-bold text-slate-900 text-xs">{ref.name}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{ref.designation}, {ref.organization}</p>
                    <p className="text-slate-500 text-[11px] mt-1 font-mono">{ref.phone}</p>
                    {ref.email && <p className="text-slate-500 text-[11px] font-mono">{ref.email}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Signature Line */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end text-xs break-inside-avoid">
          <div className="text-slate-500 text-[11px]">
            <p>{language === 'bn' ? 'তারিখ: ....................' : 'Date: ....................'}</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-slate-700 mb-1"></div>
            <p className="font-semibold text-slate-800 text-[11px]">{t.signature}</p>
          </div>
        </div>
      </main>
    </div>
  );
};
