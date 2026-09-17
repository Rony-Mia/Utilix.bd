import React from 'react';
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
    <div className="w-full bg-white text-[#1f2937] font-sans text-[13px] leading-relaxed shadow-sm print:shadow-none min-h-[297mm]">
      {/* Colorful Header Banner */}
      <div className="bg-gradient-to-r from-[#0c5c3d] via-[#10704b] to-[#083f2a] text-[#fffdf7] p-8 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-white">
              {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
            </h1>
            {personalInfo.designationOrTitle && (
              <p className="text-base text-[#d8cfb8] font-medium mt-1">
                {personalInfo.designationOrTitle}
              </p>
            )}

            {/* Header Contact Strip */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#f4efe4] mt-3 justify-center sm:justify-start">
              {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
              {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
              {personalInfo.presentAddress && <span>📍 {personalInfo.presentAddress}</span>}
            </div>
          </div>

          {/* Photo with clean bordered styling */}
          {personalInfo.photoUrl ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-white">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#d8cfb8]/60 flex items-center justify-center text-xs text-[#d8cfb8] text-center p-2 flex-shrink-0">
              <span>{language === 'bn' ? 'ছবি' : 'Photo'}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Career Objective */}
        {personalInfo.careerObjective && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0c5c3d]"></span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a]">
                {t.careerObjective}
              </h2>
            </div>
            <p className="text-justify text-[#4b5563] text-xs sm:text-[13px] pl-4 border-l-2 border-[#0c5c3d]/30">
              {personalInfo.careerObjective}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0c5c3d]"></span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a]">
                {t.experience}
              </h2>
            </div>
            <div className="space-y-4 pl-4">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="relative bg-[#fbf9f4] p-3.5 border border-[#e8e0cc] rounded-md">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[#111827] text-sm">{exp.designation}</h3>
                    <span className="text-xs bg-[#0c5c3d] text-white px-2 py-0.5 rounded-full font-medium">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#0c5c3d] mt-0.5">{exp.company}</p>
                  {exp.responsibilities && (
                    <p className="text-xs text-[#4b5563] mt-2 leading-relaxed whitespace-pre-line">
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
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0c5c3d]"></span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a]">
                {t.education}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="border border-[#e5e7eb] p-3 rounded-md bg-white shadow-xs">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#111827] text-xs">{edu.degree}</h3>
                    <span className="text-[11px] font-bold text-[#0c5c3d]">{edu.passingYear}</span>
                  </div>
                  <p className="text-xs text-[#4b5563] mt-1">{edu.institution}</p>
                  <div className="flex justify-between text-[11px] text-[#6b7280] mt-2 pt-2 border-t border-[#f3f4f6]">
                    <span>{edu.boardOrMajor}</span>
                    <span className="font-semibold text-[#111827]">{edu.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Languages in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-4">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0c5c3d]"></span>
                {t.skills}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-[#f4efe4] text-[#083f2a] text-xs px-2.5 py-1 rounded-full font-medium border border-[#d8cfb8]"
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0c5c3d]"></span>
                {t.languages}
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((lang, idx) => (
                  <div key={lang.id || idx} className="flex justify-between p-1.5 bg-[#f9fafb] rounded border border-[#e5e7eb]">
                    <span className="font-medium text-[#111827]">{lang.name}</span>
                    <span className="text-[#0c5c3d] font-semibold text-[11px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Personal Details in Creative Format */}
        <section className="pl-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0c5c3d]"></span>
            {t.personalDetails}
          </h2>
          <div className="bg-[#fcfaf5] p-3.5 rounded-md border border-[#e8e0cc] grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-[#374151]">
            {personalInfo.fatherName && <p><span className="font-medium text-[#111827]">{t.fatherName}:</span> {personalInfo.fatherName}</p>}
            {personalInfo.motherName && <p><span className="font-medium text-[#111827]">{t.motherName}:</span> {personalInfo.motherName}</p>}
            {personalInfo.dateOfBirth && <p><span className="font-medium text-[#111827]">{t.dateOfBirth}:</span> {personalInfo.dateOfBirth}</p>}
            {personalInfo.gender && <p><span className="font-medium text-[#111827]">{t.gender}:</span> {personalInfo.gender}</p>}
            {personalInfo.maritalStatus && <p><span className="font-medium text-[#111827]">{t.maritalStatus}:</span> {personalInfo.maritalStatus}</p>}
            {personalInfo.nationality && <p><span className="font-medium text-[#111827]">{t.nationality}:</span> {personalInfo.nationality}</p>}
            {personalInfo.religion && <p><span className="font-medium text-[#111827]">{t.religion}:</span> {personalInfo.religion}</p>}
            {personalInfo.bloodGroup && <p><span className="font-medium text-[#111827]">{t.bloodGroup}:</span> {personalInfo.bloodGroup}</p>}
            {personalInfo.nationalId && <p><span className="font-medium text-[#111827]">{t.nationalId}:</span> {personalInfo.nationalId}</p>}
            {personalInfo.permanentAddress && (
              <p className="col-span-2 sm:col-span-3">
                <span className="font-medium text-[#111827]">{t.permanentAddress}:</span> {personalInfo.permanentAddress}
              </p>
            )}
          </div>
        </section>

        {/* References */}
        {references && references.length > 0 && (
          <section className="pl-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#083f2a] mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0c5c3d]"></span>
              {t.references}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {references.map((ref, idx) => (
                <div key={ref.id || idx} className="p-3 border border-[#e5e7eb] rounded-md bg-white">
                  <p className="font-bold text-[#111827]">{ref.name}</p>
                  <p className="text-[#4b5563] text-[11px]">{ref.designation}, {ref.organization}</p>
                  <p className="text-[#0c5c3d] text-[11px] mt-1">📞 {ref.phone} {ref.email && `| ✉️ ${ref.email}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Signature */}
        <div className="pt-6 flex justify-between items-end text-xs pl-4">
          <span className="text-[#6b7280]">{language === 'bn' ? 'তারিখ:' : 'Date:'} ....................</span>
          <div className="text-center w-40">
            <div className="border-b border-[#083f2a] mb-1"></div>
            <span className="font-semibold text-[#111827]">{t.signature}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
