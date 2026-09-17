import React from 'react';
import { CvData, CvLanguage } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

interface TemplateProps {
  data: CvData;
  language: CvLanguage;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = CV_LABELS[language] || CV_LABELS.bn;
  const { personalInfo, education, experience, skills, languages, references } = data;

  return (
    <div className="w-full bg-white text-[#111827] p-8 sm:p-10 font-sans leading-relaxed text-[13px] shadow-sm print:shadow-none print:p-8">
      {/* Header section: Title and Photo */}
      <div className="flex items-start justify-between border-b-2 border-[#111827] pb-4 mb-5">
        <div className="flex-1 pr-4">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#083f2a] tracking-tight uppercase">
            {personalInfo.fullName || (language === 'bn' ? 'প্রার্থীর নাম' : 'Full Name')}
          </h1>
          {personalInfo.designationOrTitle && (
            <p className="text-sm font-medium text-[#4b5563] mt-0.5">
              {personalInfo.designationOrTitle}
            </p>
          )}
          <div className="text-xs text-[#374151] mt-2 space-y-0.5">
            {personalInfo.phone && <p><span className="font-semibold">{t.phone}:</span> {personalInfo.phone}</p>}
            {personalInfo.email && <p><span className="font-semibold">{t.email}:</span> {personalInfo.email}</p>}
            {personalInfo.presentAddress && (
              <p><span className="font-semibold">{t.presentAddress}:</span> {personalInfo.presentAddress}</p>
            )}
            {personalInfo.linkedinOrWebsite && (
              <p><span className="font-semibold">Web/LinkedIn:</span> {personalInfo.linkedinOrWebsite}</p>
            )}
          </div>
        </div>

        {/* Photo corner */}
        {personalInfo.photoUrl ? (
          <div className="w-28 h-32 border border-[#9ca3af] p-1 bg-white flex-shrink-0">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-28 h-32 border border-dashed border-[#9ca3af] flex flex-col items-center justify-center text-[10px] text-[#9ca3af] flex-shrink-0 text-center p-2 bg-gray-50">
            <span>{language === 'bn' ? 'পাসপোর্ট ছবি' : 'Passport Photo'}</span>
          </div>
        )}
      </div>

      {/* Career Objective */}
      {personalInfo.careerObjective && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
            {t.careerObjective}
          </h2>
          <p className="text-justify text-[#374151] text-xs sm:text-[13px]">
            {personalInfo.careerObjective}
          </p>
        </section>
      )}

      {/* Educational Qualifications */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
            {t.education}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#9ca3af] text-xs">
              <thead>
                <tr className="bg-[#f3f4f6] text-[#111827] font-semibold">
                  <th className="border border-[#9ca3af] px-2 py-1.5 text-left">{t.degree}</th>
                  <th className="border border-[#9ca3af] px-2 py-1.5 text-left">{t.institution}</th>
                  <th className="border border-[#9ca3af] px-2 py-1.5 text-left">{t.board}</th>
                  <th className="border border-[#9ca3af] px-2 py-1.5 text-center w-16">{t.passingYear}</th>
                  <th className="border border-[#9ca3af] px-2 py-1.5 text-center w-24">{t.result}</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, idx) => (
                  <tr key={edu.id || idx} className="hover:bg-gray-50">
                    <td className="border border-[#9ca3af] px-2 py-1 font-medium">{edu.degree || '-'}</td>
                    <td className="border border-[#9ca3af] px-2 py-1">{edu.institution || '-'}</td>
                    <td className="border border-[#9ca3af] px-2 py-1">{edu.boardOrMajor || '-'}</td>
                    <td className="border border-[#9ca3af] px-2 py-1 text-center">{edu.passingYear || '-'}</td>
                    <td className="border border-[#9ca3af] px-2 py-1 text-center font-semibold">{edu.result || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
            {t.experience}
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[#111827] text-[13px]">{exp.designation}</h3>
                  <span className="text-[#6b7280] font-medium text-[11px]">{exp.duration}</span>
                </div>
                <p className="text-[#0c5c3d] font-medium">{exp.company}</p>
                {exp.responsibilities && (
                  <p className="text-[#374151] mt-1 whitespace-pre-line leading-relaxed">
                    {exp.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
            {t.skills}
          </h2>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-[#f3f4f6] text-[#1f2937] px-2 py-1 border border-[#e5e7eb] rounded-none font-medium"
              >
                • {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Personal Details Table */}
      <section className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
          {t.personalDetails}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#374151]">
          {personalInfo.fatherName && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.fatherName}:</span> {personalInfo.fatherName}</p>
          )}
          {personalInfo.motherName && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.motherName}:</span> {personalInfo.motherName}</p>
          )}
          {personalInfo.dateOfBirth && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.dateOfBirth}:</span> {personalInfo.dateOfBirth}</p>
          )}
          {personalInfo.gender && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.gender}:</span> {personalInfo.gender}</p>
          )}
          {personalInfo.maritalStatus && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.maritalStatus}:</span> {personalInfo.maritalStatus}</p>
          )}
          {personalInfo.nationality && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.nationality}:</span> {personalInfo.nationality}</p>
          )}
          {personalInfo.religion && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.religion}:</span> {personalInfo.religion}</p>
          )}
          {personalInfo.bloodGroup && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.bloodGroup}:</span> {personalInfo.bloodGroup}</p>
          )}
          {personalInfo.nationalId && (
            <p><span className="font-semibold text-[#111827] inline-block w-28">{t.nationalId}:</span> {personalInfo.nationalId}</p>
          )}
          {personalInfo.permanentAddress && (
            <p className="sm:col-span-2">
              <span className="font-semibold text-[#111827] inline-block w-28">{t.permanentAddress}:</span> {personalInfo.permanentAddress}
            </p>
          )}
        </div>
      </section>

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
            {t.languages}
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {languages.map((lang, idx) => (
              <p key={lang.id || idx}>
                <span className="font-semibold text-[#111827]">{lang.name}:</span> {lang.proficiency}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#083f2a] border-b border-[#d1d5db] pb-1 mb-2">
            {t.references}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {references.map((ref, idx) => (
              <div key={ref.id || idx} className="border-l-2 border-[#0c5c3d] pl-3 py-0.5">
                <h3 className="font-bold text-[#111827]">{ref.name}</h3>
                <p className="text-[#4b5563]">{ref.designation}</p>
                <p className="text-[#4b5563]">{ref.organization}</p>
                {ref.phone && <p className="text-[#374151] mt-0.5"><span className="font-medium">{t.phone}:</span> {ref.phone}</p>}
                {ref.email && <p className="text-[#374151]"><span className="font-medium">{t.email}:</span> {ref.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Signature Line */}
      <div className="pt-8 flex justify-between items-end text-xs">
        <div className="text-[#6b7280]">
          <p>{language === 'bn' ? 'তারিখ: ....................' : 'Date: ....................'}</p>
        </div>
        <div className="text-center">
          <div className="w-44 border-b border-[#4b5563] mb-1"></div>
          <p className="font-semibold text-[#111827]">{t.signature}</p>
        </div>
      </div>
    </div>
  );
};
