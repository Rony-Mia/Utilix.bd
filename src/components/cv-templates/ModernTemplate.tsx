import React from 'react';
import { User, Phone, Mail, MapPin, Globe, Briefcase, GraduationCap, Users } from 'lucide-react';
import { TemplateProps } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

const toBanglaDigits = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map((d) => bnDigits[parseInt(d, 10)] || d).join('');
};

export const ModernTemplate: React.FC<TemplateProps> = ({
  data,
  language,
  pageNumber,
  totalPages = 2,
}) => {
  const t = CV_LABELS[language] || CV_LABELS.bn;
  const { personalInfo, education, experience, skills, languages, references } = data;
  const isBn = language === 'bn';

  const formatPageNum = (p: number, total: number) => {
    if (isBn) {
      return `পৃষ্ঠা ${toBanglaDigits(p)} / ${toBanglaDigits(total)}`;
    }
    return `Page ${p} of ${total}`;
  };

  // Render Page 1
  const renderPage1 = () => (
    <div
      id="cv-page-1"
      data-page-number="1"
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm relative flex flex-row items-stretch overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      {/* Left Sidebar (32% width) */}
      <aside className="w-[32%] bg-[#083f2a] text-slate-100 p-7 flex flex-col justify-between shrink-0 box-border">
        <div className="space-y-6">
          {/* Circular Photo */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full ring-4 ring-emerald-600/40 shadow-lg overflow-hidden bg-emerald-950/80 flex items-center justify-center">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-2.5">
              {t.contact}
            </h2>
            <ul className="space-y-2 text-xs text-slate-200">
              {personalInfo.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.phone}</span>
                </li>
              )}
              {personalInfo.email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.email}</span>
                </li>
              )}
              {personalInfo.presentAddress && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{personalInfo.presentAddress}</span>
                </li>
              )}
              {personalInfo.linkedinOrWebsite && (
                <li className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.linkedinOrWebsite}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Skills with strength bars */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-2.5">
                {t.skills}
              </h2>
              <div className="space-y-2">
                {skills.map((skill, idx) => {
                  const widths = ['88%', '94%', '82%', '90%', '85%', '92%', '78%'];
                  const barWidth = widths[idx % widths.length];

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-200 font-medium">
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
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-emerald-800/50 text-[10px] text-emerald-400/70 font-mono flex justify-between items-center">
          <span>Utilix CV</span>
          <span>{formatPageNum(1, totalPages)}</span>
        </div>
      </aside>

      {/* Right Content Area (68% width) */}
      <main className="flex-1 p-8 flex flex-col justify-between box-border">
        <div>
          {/* Header Name & Title */}
          <div className="border-b-2 border-slate-100 pb-3 mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || (isBn ? 'প্রার্থীর নাম' : 'Full Name')}
            </h1>
            {personalInfo.designationOrTitle && (
              <p className="text-sm font-semibold text-emerald-700 tracking-wide uppercase mt-0.5">
                {personalInfo.designationOrTitle}
              </p>
            )}

            {personalInfo.careerObjective && (
              <div className="mt-2.5 bg-emerald-50/60 border-l-3 border-emerald-600 p-2.5 rounded-r text-slate-700 text-xs leading-relaxed">
                {personalInfo.careerObjective}
              </div>
            )}
          </div>

          {/* Work Experience Timeline */}
          {experience && experience.length > 0 && (
            <section className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Briefcase className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {t.experience}
                </h2>
              </div>

              <div className="border-l-2 border-emerald-200 ml-2 pl-4 space-y-3.5 relative">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 ring-4 ring-white" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{exp.designation}</h3>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600">{exp.company}</p>
                    {exp.responsibilities && (
                      <p className="text-slate-700 mt-1 text-[11px] whitespace-pre-line leading-relaxed">
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
            <section className="mb-4">
              <div className="flex items-center gap-2 mb-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {t.education}
                </h2>
              </div>

              <div className="border-l-2 border-emerald-200 ml-2 pl-4 space-y-3 relative">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 ring-4 ring-white" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                      <span className="text-[10px] font-mono text-slate-500">{edu.passingYear}</span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      {edu.institution} {edu.boardOrMajor && `• ${edu.boardOrMajor}`}
                    </p>
                    {edu.result && (
                      <p className="text-[10px] font-semibold text-emerald-700">
                        {t.result}: {edu.result}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Page 1 Right Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
          <span>{personalInfo.fullName} • {isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}</span>
          <span>{formatPageNum(1, totalPages)}</span>
        </div>
      </main>
    </div>
  );

  // Render Page 2
  const renderPage2 = () => (
    <div
      id="cv-page-2"
      data-page-number="2"
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm relative flex flex-row items-stretch overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      {/* Left Sidebar (32% width) */}
      <aside className="w-[32%] bg-[#083f2a] text-slate-100 p-7 flex flex-col justify-between shrink-0 box-border">
        <div className="space-y-6">
          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300 border-b border-emerald-700/60 pb-1 mb-2.5">
                {t.languages}
              </h2>
              <div className="space-y-2 text-xs">
                {languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-center text-slate-200">
                    <span className="font-medium text-xs">{lang.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-700/50 text-emerald-200">
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
            <div className="space-y-2 text-xs text-slate-300">
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
              {personalInfo.permanentAddress && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{t.permanentAddress}</span>
                  <span className="text-slate-200 text-[11px]">{personalInfo.permanentAddress}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-emerald-800/50 text-[10px] text-emerald-400/70 font-mono flex justify-between items-center">
          <span>Utilix CV</span>
          <span>{formatPageNum(2, totalPages)}</span>
        </div>
      </aside>

      {/* Right Content Area (68% width) */}
      <main className="flex-1 p-8 flex flex-col justify-between box-border">
        <div>
          {/* Page 2 Top Header */}
          <div className="border-b-2 border-slate-100 pb-3 mb-5 flex justify-between items-baseline">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {personalInfo.fullName} — {t.references}
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              {formatPageNum(2, totalPages)}
            </span>
          </div>

          {/* References */}
          {references && references.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                  {t.references}
                </h2>
              </div>

              <div className="space-y-3">
                {references.map((ref, idx) => (
                  <div key={ref.id || idx} className="border border-slate-200 bg-slate-50/70 p-3.5 rounded-xs border-l-4 border-l-emerald-700">
                    <p className="font-bold text-slate-900 text-xs">{ref.name}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">{ref.designation}, {ref.organization}</p>
                    <p className="text-slate-500 text-[11px] mt-1 font-mono">{ref.phone} {ref.email && `• ${ref.email}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formal Declaration */}
          <div className="mb-6 bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 leading-relaxed rounded-xs">
            <p>
              {isBn
                ? 'আমি প্রত্যয়ন করছি যে উপরে বর্ণিত সমস্ত তথ্য সত্য ও সঠিক।'
                : 'I hereby certify that all information provided above is true and accurate.'}
            </p>
          </div>
        </div>

        {/* Signature Line */}
        <div>
          <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <div className="text-slate-500 text-[11px]">
              <p>{isBn ? 'তারিখ: ....................' : 'Date: ....................'}</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-slate-700 mb-1"></div>
              <p className="font-semibold text-slate-800 text-[11px]">{t.signature}</p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
            <span>{personalInfo.fullName} • {isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}</span>
            <span>{formatPageNum(2, totalPages)}</span>
          </div>
        </div>
      </main>
    </div>
  );

  if (pageNumber === 1) {
    return renderPage1();
  }
  if (pageNumber === 2 && totalPages > 1) {
    return renderPage2();
  }

  return (
    <div className="cv-document flex flex-col gap-6 items-center">
      {renderPage1()}
      {totalPages > 1 && renderPage2()}
    </div>
  );
};
