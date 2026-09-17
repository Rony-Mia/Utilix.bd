import React from 'react';
import { User, Phone, Mail, MapPin, Globe, Award, GraduationCap, Briefcase, Sparkles, BookOpen } from 'lucide-react';
import { TemplateProps } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

const toBanglaDigits = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map((d) => bnDigits[parseInt(d, 10)] || d).join('');
};

export const CompactTemplate: React.FC<TemplateProps> = ({
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
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 font-sans leading-normal text-xs shadow-sm relative flex flex-col justify-between overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex-1 flex flex-col">
        {/* Strong Top Header Band */}
        <header className="bg-[#1e293b] text-white p-6 border-b-4 border-emerald-600">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase">
                {personalInfo.fullName || (isBn ? 'প্রার্থীর নাম' : 'Full Name')}
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

            {/* Photo in Header Band */}
            <div className="w-22 h-26 rounded border-2 border-white/80 shadow-md bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
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
                    {isBn ? 'ছবি' : 'Photo'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 2-Column Page 1 Body */}
        <div className="flex-1 flex flex-row items-stretch">
          {/* Left Column (36%) */}
          <div className="w-[36%] bg-slate-50/80 border-r border-slate-200 p-5 space-y-4 shrink-0">
            {/* Education */}
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

            {/* Skills */}
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
          </div>

          {/* Right Column (64%) */}
          <div className="flex-1 p-5 space-y-4">
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
          </div>
        </div>
      </div>

      {/* Page 1 Bottom Margin & Footer */}
      <footer className="p-4 border-t border-slate-200 bg-white flex justify-between items-center text-[11px] text-slate-400">
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
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-800 font-sans leading-normal text-xs shadow-sm relative flex flex-col justify-between overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex-1 flex flex-col">
        {/* Page 2 Header Band */}
        <header className="bg-[#1e293b] text-white px-6 py-4 border-b-4 border-emerald-600 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white uppercase">{personalInfo.fullName}</h2>
            <p className="text-[11px] text-emerald-400">{personalInfo.designationOrTitle || (isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae')}</p>
          </div>
          <span className="text-xs font-mono text-slate-300 font-medium">{formatPageNum(2, totalPages)}</span>
        </header>

        {/* 2-Column Page 2 Body */}
        <div className="flex-1 flex flex-row items-stretch">
          {/* Left Column (36%) */}
          <div className="w-[36%] bg-slate-50/80 border-r border-slate-200 p-5 space-y-4 shrink-0">
            {/* Languages */}
            {languages && languages.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {t.languages}
                  </h2>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  {languages.map((lang, idx) => (
                    <div key={lang.id || idx} className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                      <span className="font-medium text-slate-800">{lang.name}</span>
                      <span className="text-slate-600 text-[10px] font-semibold">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Details */}
            <div>
              <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1 mb-2">
                <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                  {t.personalDetails}
                </h2>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-700">
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

          {/* Right Column (64%) */}
          <div className="flex-1 p-5 space-y-4">
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
                    <div key={ref.id || idx} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">{ref.name}</p>
                      <p className="text-slate-600 text-[10px]">{ref.designation}, {ref.organization}</p>
                      <p className="text-slate-500 text-[10px] font-mono mt-0.5">{ref.phone} {ref.email && `• ${ref.email}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Declaration & Signature */}
      <footer className="p-5 border-t border-slate-200 bg-white flex justify-between items-end text-xs">
        <div className="text-slate-500 text-[11px]">
          <p>{isBn ? 'তারিখ: ....................' : 'Date: ....................'}</p>
        </div>
        <div className="text-center">
          <div className="w-36 border-b border-slate-700 mb-1"></div>
          <p className="font-semibold text-slate-800 text-[11px]">{t.signature}</p>
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
