import React from 'react';
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
    <div className="w-full bg-white text-[#1f2937] font-sans text-[13px] leading-relaxed shadow-sm print:shadow-none flex flex-col md:flex-row print:flex-row min-h-[297mm]">
      {/* Left Sidebar: Photo, Contact, Personal Info, Skills, Languages */}
      <div className="w-full md:w-1/3 print:w-1/3 bg-[#083f2a] text-[#f4efe4] p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Photo */}
          <div className="flex flex-col items-center">
            {personalInfo.photoUrl ? (
              <div className="w-28 h-32 rounded-sm overflow-hidden border-2 border-[#d8cfb8] shadow">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-32 rounded-sm border-2 border-dashed border-[#d8cfb8]/50 flex items-center justify-center text-xs text-[#d8cfb8] text-center p-2">
                <span>{language === 'bn' ? 'ছবি যুক্ত করুন' : 'Photo'}</span>
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8cfb8] border-b border-[#0c5c3d] pb-1 mb-2">
              {t.contact}
            </h3>
            <div className="space-y-1.5 text-xs text-[#e5e7eb]">
              {personalInfo.phone && (
                <div>
                  <span className="block text-[10px] text-[#9ca3af] uppercase">{t.phone}</span>
                  <span className="font-medium">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div>
                  <span className="block text-[10px] text-[#9ca3af] uppercase">{t.email}</span>
                  <span className="font-medium break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.presentAddress && (
                <div>
                  <span className="block text-[10px] text-[#9ca3af] uppercase">{t.presentAddress}</span>
                  <span>{personalInfo.presentAddress}</span>
                </div>
              )}
              {personalInfo.linkedinOrWebsite && (
                <div>
                  <span className="block text-[10px] text-[#9ca3af] uppercase">LinkedIn / Web</span>
                  <span className="break-all">{personalInfo.linkedinOrWebsite}</span>
                </div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8cfb8] border-b border-[#0c5c3d] pb-1 mb-2">
              {t.personalDetails}
            </h3>
            <div className="space-y-1 text-xs text-[#e5e7eb]">
              {personalInfo.fatherName && (
                <p><span className="text-[#9ca3af]">{t.fatherName}:</span> {personalInfo.fatherName}</p>
              )}
              {personalInfo.motherName && (
                <p><span className="text-[#9ca3af]">{t.motherName}:</span> {personalInfo.motherName}</p>
              )}
              {personalInfo.dateOfBirth && (
                <p><span className="text-[#9ca3af]">{t.dateOfBirth}:</span> {personalInfo.dateOfBirth}</p>
              )}
              {personalInfo.gender && (
                <p><span className="text-[#9ca3af]">{t.gender}:</span> {personalInfo.gender}</p>
              )}
              {personalInfo.maritalStatus && (
                <p><span className="text-[#9ca3af]">{t.maritalStatus}:</span> {personalInfo.maritalStatus}</p>
              )}
              {personalInfo.bloodGroup && (
                <p><span className="text-[#9ca3af]">{t.bloodGroup}:</span> {personalInfo.bloodGroup}</p>
              )}
              {personalInfo.nationality && (
                <p><span className="text-[#9ca3af]">{t.nationality}:</span> {personalInfo.nationality}</p>
              )}
              {personalInfo.religion && (
                <p><span className="text-[#9ca3af]">{t.religion}:</span> {personalInfo.religion}</p>
              )}
              {personalInfo.nationalId && (
                <p><span className="text-[#9ca3af]">{t.nationalId}:</span> {personalInfo.nationalId}</p>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8cfb8] border-b border-[#0c5c3d] pb-1 mb-2">
                {t.skills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#0c5c3d] text-[#fffdf7] text-[11px] px-2 py-0.5 rounded-sm font-medium border border-[#14532d]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d8cfb8] border-b border-[#0c5c3d] pb-1 mb-2">
                {t.languages}
              </h3>
              <div className="space-y-1 text-xs text-[#e5e7eb]">
                {languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between items-baseline">
                    <span className="font-medium text-white">{lang.name}</span>
                    <span className="text-[11px] text-[#9ca3af]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Area: Name, Objective, Experience, Education, References */}
      <div className="w-full md:w-2/3 print:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          {/* Header Name & Title */}
          <div className="border-b-2 border-[#083f2a] pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#083f2a] uppercase tracking-tight">
              {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
            </h1>
            {personalInfo.designationOrTitle && (
              <p className="text-sm font-medium text-[#0c5c3d] mt-1 tracking-wide">
                {personalInfo.designationOrTitle}
              </p>
            )}
          </div>

          {/* Career Objective */}
          {personalInfo.careerObjective && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-1 mb-2">
                {t.careerObjective}
              </h2>
              <p className="text-justify text-[#4b5563] text-xs leading-relaxed">
                {personalInfo.careerObjective}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-1 mb-3">
                {t.experience}
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative pl-3 border-l-2 border-[#0c5c3d]">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[#111827] text-sm">{exp.designation}</h3>
                      <span className="text-xs font-medium text-[#6b7280]">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#0c5c3d]">{exp.company}</p>
                    {exp.responsibilities && (
                      <p className="text-xs text-[#4b5563] mt-1 whitespace-pre-line leading-relaxed">
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
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-1 mb-3">
                {t.education}
              </h2>
              <div className="space-y-2.5">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="bg-[#f9fafb] p-2.5 border border-[#e5e7eb] rounded-sm text-xs">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[#111827]">{edu.degree}</h3>
                      <span className="font-medium text-[#083f2a]">{edu.passingYear}</span>
                    </div>
                    <p className="text-[#374151] font-medium">{edu.institution}</p>
                    <div className="flex justify-between text-[11px] text-[#6b7280] mt-1">
                      {edu.boardOrMajor && <span>{edu.boardOrMajor}</span>}
                      {edu.result && <span className="font-semibold text-[#111827]">{t.result}: {edu.result}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-1 mb-3">
                {t.references}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {references.map((ref, idx) => (
                  <div key={ref.id || idx} className="bg-[#f9fafb] p-2.5 border border-[#e5e7eb] rounded-sm">
                    <h3 className="font-bold text-[#111827]">{ref.name}</h3>
                    <p className="text-[#4b5563] text-[11px]">{ref.designation}</p>
                    <p className="text-[#4b5563] text-[11px]">{ref.organization}</p>
                    {ref.phone && <p className="text-[#374151] mt-1"><span className="font-medium">{t.phone}:</span> {ref.phone}</p>}
                    {ref.email && <p className="text-[#374151]"><span className="font-medium">{t.email}:</span> {ref.email}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Signature Line */}
        <div className="pt-8 flex justify-end">
          <div className="text-center w-40">
            <div className="border-b border-[#4b5563] mb-1"></div>
            <p className="text-xs font-semibold text-[#111827]">{t.signature}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
