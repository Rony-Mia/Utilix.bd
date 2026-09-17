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
} from 'lucide-react';
import { TemplateProps } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

const toBanglaDigits = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map((d) => bnDigits[parseInt(d, 10)] || d).join('');
};

export const CreativeTemplate: React.FC<TemplateProps> = ({
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
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm relative flex flex-col justify-between overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex-1 flex flex-col">
        {/* Creative Angled Color-Blocked Header Band */}
        <header className="relative bg-[#0f172a] text-white p-7 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/20 via-amber-500/5 to-transparent pointer-events-none transform skew-x-12 translate-x-12"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Curriculum Vitae</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
                {personalInfo.fullName || (isBn ? 'প্রার্থীর নাম' : 'Full Name')}
              </h1>

              {personalInfo.designationOrTitle && (
                <p className="text-xs sm:text-sm font-semibold text-amber-400 tracking-wider uppercase mt-1">
                  {personalInfo.designationOrTitle}
                </p>
              )}

              {/* Contact Pills */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs text-slate-300">
                {personalInfo.phone && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.email && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <Mail className="w-3 h-3 text-amber-400" />
                    <span>{personalInfo.email}</span>
                  </span>
                )}
                {personalInfo.presentAddress && (
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{personalInfo.presentAddress}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Photo */}
            <div className="relative shrink-0">
              <div className="w-24 h-28 rounded-xl ring-2 ring-amber-400/80 shadow-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                {personalInfo.photoUrl ? (
                  <img
                    src={personalInfo.photoUrl}
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="w-10 h-10 text-amber-300/80" />
                    <span className="text-[9px] text-slate-400 mt-1">
                      {isBn ? 'ছবি' : 'Photo'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page 1 Body */}
        <div className="p-7 space-y-5 flex-1">
          {/* Career Objective */}
          {personalInfo.careerObjective && (
            <section>
              <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-2">
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

              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs border-l-4 border-l-slate-900"
                  >
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{exp.designation}</h3>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {exp.duration}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{exp.company}</p>

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

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-2.5">
                <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {t.education}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="bg-slate-50/70 border border-slate-200 rounded-lg p-2.5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                      <p className="text-xs text-slate-600">{edu.institution} {edu.boardOrMajor && `• ${edu.boardOrMajor}`}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {edu.passingYear}
                      </span>
                      {edu.result && (
                        <p className="text-[11px] font-bold text-amber-700 mt-0.5">
                          {t.result}: {edu.result}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Page 1 Bottom Margin & Footer */}
      <footer className="px-7 py-3.5 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
        <span>{personalInfo.fullName} • {isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}</span>
        <span className="font-mono font-medium">{formatPageNum(1, totalPages)}</span>
      </footer>
    </div>
  );

  // Render Page 2
  const renderPage2 = () => (
    <div
      id="cv-page-2"
      data-page-number="2"
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm relative flex flex-col justify-between overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex-1 flex flex-col">
        {/* Page 2 Top Header */}
        <header className="bg-[#0f172a] text-white px-7 py-4 flex justify-between items-center border-b-2 border-amber-500">
          <div>
            <h2 className="text-base font-bold text-white uppercase">{personalInfo.fullName}</h2>
            <p className="text-[11px] text-amber-400">{personalInfo.designationOrTitle || (isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae')}</p>
          </div>
          <span className="text-xs font-mono text-slate-300 font-medium">{formatPageNum(2, totalPages)}</span>
        </header>

        {/* Page 2 Body */}
        <div className="p-7 space-y-6 flex-1">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 border-b-2 border-amber-500 pb-1.5 mb-2.5">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {t.skills}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50/80 text-slate-800 text-xs px-3 py-1 rounded-full border border-amber-200/80 font-medium"
                  >
                    ✦ {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Personal Details & Languages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Personal Details */}
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
                      className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200/80 text-xs"
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
          </div>

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
                    <p className="text-slate-500 text-[11px] font-mono mt-1">{ref.phone} {ref.email && `• ${ref.email}`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Signature & Date Footer */}
      <footer className="p-7 border-t border-slate-200 flex justify-between items-end text-xs">
        <div className="text-slate-500 text-[11px]">
          <p>{isBn ? 'তারিখ: ....................' : 'Date: ....................'}</p>
        </div>
        <div className="text-center">
          <div className="w-40 border-b border-slate-800 mb-1.5"></div>
          <p className="font-bold text-slate-800 text-[11px]">{t.signature}</p>
        </div>
      </footer>
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
