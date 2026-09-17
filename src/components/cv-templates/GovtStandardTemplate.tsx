import React from 'react';
import { CvData, CvLanguage } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

interface TemplateProps {
  data: CvData;
  language: CvLanguage;
}

export const GovtStandardTemplate: React.FC<TemplateProps> = ({ data, language }) => {
  const t = CV_LABELS[language] || CV_LABELS.bn;
  const { personalInfo, education, experience, skills, languages, references } = data;

  const toBengaliNumber = (n: number | string): string => {
    if (language !== 'bn') return String(n);
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
  };

  return (
    <div className="w-full bg-white text-[#111827] p-8 sm:p-10 font-serif leading-relaxed text-[13px] shadow-sm print:shadow-none print:p-8 min-h-[297mm]">
      {/* Centered Heading */}
      <div className="relative mb-6 pb-2 border-b border-[#111827]">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase underline underline-offset-4 text-[#111827]">
            {language === 'bn' ? 'জীবন বৃত্তান্ত' : 'CURRICULUM VITAE'}
          </h1>
          {personalInfo.designationOrTitle && (
            <p className="text-xs sm:text-sm font-sans text-[#4b5563] mt-1 font-medium">
              ({personalInfo.designationOrTitle})
            </p>
          )}
        </div>

        {/* Top-Right Passport Photo Box */}
        <div className="absolute right-0 top-0 w-28 h-32 border border-[#111827] p-1 bg-white">
          {personalInfo.photoUrl ? (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full border border-dashed border-[#9ca3af] flex items-center justify-center text-[10px] text-center text-[#6b7280] p-1 font-sans">
              <span>{language === 'bn' ? 'সত্যায়িত পাসপোর্ট সাইজ ছবি' : 'Attested Passport Photo'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Table-Based Formatted Rows (১. ২. ৩...) */}
      <div className="mb-6 border border-[#9ca3af]">
        <table className="w-full border-collapse text-xs sm:text-[13px]">
          <tbody>
            <tr className="border-b border-[#d1d5db]">
              <td className="w-12 px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(1)}.
              </td>
              <td className="w-48 px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {language === 'bn' ? 'প্রার্থীর নাম' : "Applicant's Name"}
              </td>
              <td className="px-3 py-2 font-semibold text-[#083f2a]">
                {personalInfo.fullName || '-'}
              </td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(2)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.fatherName}
              </td>
              <td className="px-3 py-2">{personalInfo.fatherName || '-'}</td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(3)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.motherName}
              </td>
              <td className="px-3 py-2">{personalInfo.motherName || '-'}</td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(4)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.dateOfBirth}
              </td>
              <td className="px-3 py-2">{personalInfo.dateOfBirth || '-'}</td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(5)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.gender} ও {t.maritalStatus}
              </td>
              <td className="px-3 py-2">
                {personalInfo.gender || '-'}, {personalInfo.maritalStatus || '-'}
              </td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(6)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.nationality} ও {t.religion}
              </td>
              <td className="px-3 py-2">
                {personalInfo.nationality || '-'}, {personalInfo.religion || '-'}
              </td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(7)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.nationalId}
              </td>
              <td className="px-3 py-2 font-mono text-xs">{personalInfo.nationalId || '-'}</td>
            </tr>

            {personalInfo.bloodGroup && (
              <tr className="border-b border-[#d1d5db]">
                <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                  {toBengaliNumber(8)}.
                </td>
                <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                  {t.bloodGroup}
                </td>
                <td className="px-3 py-2">{personalInfo.bloodGroup}</td>
              </tr>
            )}

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(9)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.presentAddress}
              </td>
              <td className="px-3 py-2">{personalInfo.presentAddress || '-'}</td>
            </tr>

            <tr className="border-b border-[#d1d5db]">
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(10)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {t.permanentAddress}
              </td>
              <td className="px-3 py-2">{personalInfo.permanentAddress || '-'}</td>
            </tr>

            <tr>
              <td className="px-3 py-2 font-bold text-center border-r border-[#d1d5db] bg-[#f9fafb]">
                {toBengaliNumber(11)}.
              </td>
              <td className="px-3 py-2 font-bold border-r border-[#d1d5db] bg-[#f9fafb]">
                {language === 'bn' ? 'যোগাযোগ নম্বর ও ইমেইল' : 'Contact No. & Email'}
              </td>
              <td className="px-3 py-2">
                <span>{personalInfo.phone || '-'}</span>
                {personalInfo.email && <span className="ml-4 text-xs font-sans">({personalInfo.email})</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ১২. Educational Qualifications Table */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-2">
            {toBengaliNumber(12)}. {t.education}:
          </h2>
          <table className="w-full border-collapse border border-[#111827] text-xs">
            <thead>
              <tr className="bg-[#f3f4f6] text-[#111827] font-bold">
                <th className="border border-[#111827] px-2 py-1.5 text-center w-12">ক্র. নং</th>
                <th className="border border-[#111827] px-2 py-1.5 text-left">{t.degree}</th>
                <th className="border border-[#111827] px-2 py-1.5 text-left">{t.institution}</th>
                <th className="border border-[#111827] px-2 py-1.5 text-left">{t.board}</th>
                <th className="border border-[#111827] px-2 py-1.5 text-center w-16">{t.passingYear}</th>
                <th className="border border-[#111827] px-2 py-1.5 text-center w-24">{t.result}</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu, idx) => (
                <tr key={edu.id || idx}>
                  <td className="border border-[#111827] px-2 py-1 text-center font-sans">{toBengaliNumber(idx + 1)}</td>
                  <td className="border border-[#111827] px-2 py-1 font-semibold">{edu.degree}</td>
                  <td className="border border-[#111827] px-2 py-1">{edu.institution}</td>
                  <td className="border border-[#111827] px-2 py-1">{edu.boardOrMajor}</td>
                  <td className="border border-[#111827] px-2 py-1 text-center">{edu.passingYear}</td>
                  <td className="border border-[#111827] px-2 py-1 text-center font-bold">{edu.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ১৩. Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-2">
            {toBengaliNumber(13)}. {t.experience}:
          </h2>
          <div className="border border-[#9ca3af] p-3 space-y-2 text-xs">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="border-b border-[#e5e7eb] last:border-b-0 pb-2 last:pb-0">
                <div className="flex justify-between font-bold text-[13px]">
                  <span>{exp.designation} — {exp.company}</span>
                  <span className="font-normal text-[#4b5563]">{exp.duration}</span>
                </div>
                {exp.responsibilities && (
                  <p className="text-[#374151] mt-1 font-sans text-xs">{exp.responsibilities}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ১৪. Skills & Languages */}
      <div className="mb-6">
        <h2 className="text-sm font-bold mb-2">
          {toBengaliNumber(14)}. {language === 'bn' ? 'অতিরিক্ত যোগ্যতা ও ভাষাগত দক্ষতা' : 'Additional Skills & Languages'}:
        </h2>
        <div className="border border-[#9ca3af] p-3 text-xs space-y-2">
          {skills && skills.length > 0 && (
            <div>
              <span className="font-bold text-[#111827]">{t.skills}: </span>
              <span className="font-sans">{skills.join(', ')}</span>
            </div>
          )}
          {languages && languages.length > 0 && (
            <div>
              <span className="font-bold text-[#111827]">{t.languages}: </span>
              <span className="font-sans">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join('; ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ১৫. References */}
      {references && references.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-2">
            {toBengaliNumber(15)}. {t.references}:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-[#9ca3af] p-3">
            {references.map((ref, idx) => (
              <div key={ref.id || idx}>
                <p className="font-bold text-[13px]">{ref.name}</p>
                <p>{ref.designation}, {ref.organization}</p>
                <p className="font-sans text-[11px]">মোবাইল: {ref.phone} {ref.email && `| ইমেইল: ${ref.email}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration & Signature */}
      <div className="pt-4 text-xs">
        <p className="text-justify leading-relaxed mb-10 text-[#374151]">
          {language === 'bn'
            ? 'আমি এই মর্মে অঙ্গীকার করছি যে, উপরে বর্ণিত যাবতীয় তথ্যাবলি সম্পূর্ণ সত্য ও নির্ভুল।'
            : 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.'}
        </p>

        <div className="flex justify-between items-end">
          <div className="text-[#4b5563]">
            <p>{language === 'bn' ? 'তারিখ:' : 'Date:'} .................................</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-[#111827] mb-1"></div>
            <p className="font-bold text-[#111827]">{t.signature}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
