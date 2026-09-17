import React from 'react';
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
    <div className="w-full bg-white text-[#111827] p-6 font-sans text-[12px] leading-tight shadow-sm print:shadow-none print:p-6 min-h-[297mm]">
      {/* Header: Centered or compact flex with inline details */}
      <div className="flex items-center justify-between border-b-2 border-[#083f2a] pb-3 mb-3">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#083f2a] tracking-tight">
            {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
          </h1>
          {personalInfo.designationOrTitle && (
            <p className="text-xs font-semibold text-[#0c5c3d] mt-0.5">
              {personalInfo.designationOrTitle}
            </p>
          )}
          {/* Inline contact metadata */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#4b5563] mt-1.5">
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
            {personalInfo.presentAddress && <span>📍 {personalInfo.presentAddress}</span>}
            {personalInfo.linkedinOrWebsite && <span>🔗 {personalInfo.linkedinOrWebsite}</span>}
          </div>
        </div>

        {/* Compact Photo */}
        {personalInfo.photoUrl && (
          <div className="w-20 h-24 border border-[#9ca3af] p-0.5 flex-shrink-0 ml-3">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Career Objective / Summary */}
      {personalInfo.careerObjective && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
            {t.careerObjective}
          </h2>
          <p className="text-justify text-[#374151] text-[11px]">
            {personalInfo.careerObjective}
          </p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
            {t.education}
          </h2>
          <table className="w-full border-collapse border border-[#d1d5db] text-[11px]">
            <thead>
              <tr className="bg-[#f9fafb] text-[#111827]">
                <th className="border border-[#d1d5db] px-2 py-1 text-left font-semibold">{t.degree}</th>
                <th className="border border-[#d1d5db] px-2 py-1 text-left font-semibold">{t.institution}</th>
                <th className="border border-[#d1d5db] px-2 py-1 text-center w-14 font-semibold">{t.passingYear}</th>
                <th className="border border-[#d1d5db] px-2 py-1 text-center w-20 font-semibold">{t.result}</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, idx) => (
                <tr key={edu.id || idx}>
                  <td className="border border-[#d1d5db] px-2 py-1 font-medium">{edu.degree}</td>
                  <td className="border border-[#d1d5db] px-2 py-1">{edu.institution} {edu.boardOrMajor && `(${edu.boardOrMajor})`}</td>
                  <td className="border border-[#d1d5db] px-2 py-1 text-center">{edu.passingYear}</td>
                  <td className="border border-[#d1d5db] px-2 py-1 text-center font-medium">{edu.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Experience (if any) */}
      {experience && experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
            {t.experience}
          </h2>
          <div className="space-y-1.5">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="text-[11px]">
                <div className="flex justify-between font-bold text-[#111827]">
                  <span>{exp.designation} — <span className="font-semibold text-[#0c5c3d]">{exp.company}</span></span>
                  <span className="text-[#6b7280] font-normal">{exp.duration}</span>
                </div>
                {exp.responsibilities && (
                  <p className="text-[#4b5563] mt-0.5">{exp.responsibilities}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Grid for Skills & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
              {t.skills}
            </h2>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#f3f4f6] px-1.5 py-0.5 border border-[#e5e7eb] font-medium"
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
              {t.languages}
            </h2>
            <div className="space-y-0.5 text-[11px]">
              {languages.map((lang, idx) => (
                <p key={lang.id || idx}>
                  <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personal Info Compact Grid */}
      <div className="mb-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
          {t.personalDetails}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-[#374151]">
          {personalInfo.fatherName && <p><span className="font-semibold text-[#111827]">{t.fatherName}:</span> {personalInfo.fatherName}</p>}
          {personalInfo.motherName && <p><span className="font-semibold text-[#111827]">{t.motherName}:</span> {personalInfo.motherName}</p>}
          {personalInfo.dateOfBirth && <p><span className="font-semibold text-[#111827]">{t.dateOfBirth}:</span> {personalInfo.dateOfBirth}</p>}
          {personalInfo.gender && <p><span className="font-semibold text-[#111827]">{t.gender}:</span> {personalInfo.gender}</p>}
          {personalInfo.maritalStatus && <p><span className="font-semibold text-[#111827]">{t.maritalStatus}:</span> {personalInfo.maritalStatus}</p>}
          {personalInfo.bloodGroup && <p><span className="font-semibold text-[#111827]">{t.bloodGroup}:</span> {personalInfo.bloodGroup}</p>}
          {personalInfo.nationality && <p><span className="font-semibold text-[#111827]">{t.nationality}:</span> {personalInfo.nationality}</p>}
          {personalInfo.religion && <p><span className="font-semibold text-[#111827]">{t.religion}:</span> {personalInfo.religion}</p>}
          {personalInfo.nationalId && <p><span className="font-semibold text-[#111827]">{t.nationalId}:</span> {personalInfo.nationalId}</p>}
          {personalInfo.permanentAddress && (
            <p className="col-span-2 sm:col-span-3">
              <span className="font-semibold text-[#111827]">{t.permanentAddress}:</span> {personalInfo.permanentAddress}
            </p>
          )}
        </div>
      </div>

      {/* References */}
      {references && references.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#e5e7eb] pb-0.5 mb-1">
            {t.references}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {references.map((ref, idx) => (
              <div key={ref.id || idx} className="border-l border-[#083f2a] pl-2">
                <p className="font-bold text-[#111827]">{ref.name}</p>
                <p className="text-[#4b5563] text-[10px]">{ref.designation}, {ref.organization}</p>
                <p className="text-[#4b5563] text-[10px]">📞 {ref.phone} {ref.email && `| ✉️ ${ref.email}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact signature */}
      <div className="pt-4 flex justify-between items-end text-[11px]">
        <span className="text-[#6b7280]">{language === 'bn' ? 'তারিখ:' : 'Date:'} ....................</span>
        <div className="text-center w-36">
          <div className="border-b border-[#374151] mb-1"></div>
          <span className="font-semibold text-[#111827]">{t.signature}</span>
        </div>
      </div>
    </div>
  );
};
