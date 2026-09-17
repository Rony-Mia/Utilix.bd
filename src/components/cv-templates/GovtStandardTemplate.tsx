import React from 'react';
import { User } from 'lucide-react';
import { TemplateProps } from '../../types.ts';
import { CV_LABELS } from '../../data/cvDefaults.ts';

const toBanglaDigits = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map((d) => bnDigits[parseInt(d, 10)] || d).join('');
};

export const GovtStandardTemplate: React.FC<TemplateProps> = ({
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

  const getSerial = (n: number) => {
    return isBn ? `${toBanglaDigits(n)}.` : `${n}.`;
  };

  // Render Page 1
  const renderPage1 = () => (
    <div
      id="cv-page-1"
      data-page-number="1"
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-900 p-10 font-serif leading-normal text-xs shadow-sm relative flex flex-col justify-between overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex-1 flex flex-col">
        {/* Header & Photo Section */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-3">
          <div className="flex-1 text-center pr-4">
            <h1 className="text-xl font-bold tracking-wide uppercase text-slate-900 underline decoration-slate-400 underline-offset-4">
              {isBn ? 'জীবনবৃত্তান্ত' : 'CURRICULUM VITAE'}
            </h1>
            <p className="text-[11px] text-slate-600 font-sans mt-1">
              {isBn
                ? '(বাংলাদেশ সরকারি ও স্বায়ত্তশাসিত প্রতিষ্ঠানে চাকরির আবেদন ফরম্যাট)'
                : '(Standard Format for Bangladesh Government & Public Service Applications)'}
            </p>
          </div>

          {/* 45mm x 55mm Govt Standard Photo Frame */}
          <div className="w-24 h-28 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center shrink-0 overflow-hidden text-center p-1">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <User className="w-8 h-8 stroke-[1.5]" />
                <span className="text-[9px] font-sans mt-1 leading-tight text-slate-500">
                  {isBn ? 'পাসপোর্ট সাইজ ছবি' : 'Passport Photo'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Official Numbered Information Table: Page 1 items */}
        <table className="w-full border-collapse border border-slate-300 font-sans text-xs mb-3">
          <tbody>
            {/* 1. Name */}
            <tr>
              <td className="border border-slate-300 w-10 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(1)}
              </td>
              <td className="border border-slate-300 w-48 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.fullName}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-bold text-slate-900">
                {personalInfo.fullName || '-'}
              </td>
            </tr>

            {/* 2. Father's Name */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(2)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.fatherName}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.fatherName || '-'}
              </td>
            </tr>

            {/* 3. Mother's Name */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(3)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.motherName}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.motherName || '-'}
              </td>
            </tr>

            {/* 4. Date of Birth */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(4)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.dateOfBirth}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.dateOfBirth || '-'}
              </td>
            </tr>

            {/* 5. Gender & Marital Status */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(5)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.gender} ও {t.maritalStatus}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.gender || '-'} | {personalInfo.maritalStatus || '-'}
              </td>
            </tr>

            {/* 6. Nationality & Religion */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(6)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.nationality} ও {t.religion}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.nationality || '-'} | {personalInfo.religion || '-'}
              </td>
            </tr>

            {/* 7. National ID */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(7)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.nationalId}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-mono text-slate-900">
                {personalInfo.nationalId || '-'}
              </td>
            </tr>

            {/* 8. Blood Group */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(8)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.bloodGroup}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-bold text-slate-900">
                {personalInfo.bloodGroup || '-'}
              </td>
            </tr>

            {/* 9. Present Address */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(9)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.presentAddress}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.presentAddress || '-'}
              </td>
            </tr>

            {/* 10. Permanent Address */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(10)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.permanentAddress}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.permanentAddress || '-'}
              </td>
            </tr>

            {/* 11. Contact */}
            <tr>
              <td className="border border-slate-300 px-2 py-1 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(11)}
              </td>
              <td className="border border-slate-300 px-3 py-1 font-semibold bg-slate-50/70 text-slate-900">
                {t.phone} ও {t.email}
              </td>
              <td className="border border-slate-300 px-3 py-1 text-slate-800">
                {personalInfo.phone || '-'} {personalInfo.email && ` | ${personalInfo.email}`}
              </td>
            </tr>

            {/* 12. Educational Qualifications */}
            <tr>
              <td className="border border-slate-300 px-2 py-2 text-center font-bold bg-slate-50 text-slate-700 align-top">
                {getSerial(12)}
              </td>
              <td className="border border-slate-300 px-3 py-2 font-bold bg-slate-50/70 text-slate-900 align-top">
                {t.education}
              </td>
              <td className="border border-slate-300 p-0">
                <table className="w-full border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                      <th className="p-1.5 text-left border-r border-slate-300">{t.degree}</th>
                      <th className="p-1.5 text-left border-r border-slate-300">{t.institution}</th>
                      <th className="p-1.5 text-left border-r border-slate-300">{t.board}</th>
                      <th className="p-1.5 text-center border-r border-slate-300 w-16">{t.passingYear}</th>
                      <th className="p-1.5 text-center w-20">{t.result}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {education && education.length > 0 ? (
                      education.map((edu, idx) => (
                        <tr key={edu.id || idx} className="border-b border-slate-200 last:border-b-0">
                          <td className="p-1.5 border-r border-slate-300 font-semibold">{edu.degree}</td>
                          <td className="p-1.5 border-r border-slate-300">{edu.institution}</td>
                          <td className="p-1.5 border-r border-slate-300">{edu.boardOrMajor || '-'}</td>
                          <td className="p-1.5 border-r border-slate-300 text-center">{edu.passingYear}</td>
                          <td className="p-1.5 text-center font-semibold">{edu.result}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-2 text-center text-slate-400">
                          -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Page 1 Bottom Margin & Footer */}
      <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] font-sans text-slate-500 select-none">
        <span>{personalInfo.fullName} • {isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}</span>
        <span className="font-mono font-medium">{formatPageNum(1, totalPages)}</span>
      </div>
    </div>
  );

  // Render Page 2
  const renderPage2 = () => (
    <div
      id="cv-page-2"
      data-page-number="2"
      className="cv-page-sheet w-[794px] h-[1123px] min-h-[1123px] max-h-[1123px] bg-white text-slate-900 p-10 font-serif leading-normal text-xs shadow-sm relative flex flex-col justify-between overflow-hidden box-border"
      style={{ width: '794px', height: '1123px' }}
    >
      <div className="flex-1 flex flex-col">
        {/* Page 2 Top Header */}
        <div className="flex justify-between items-baseline border-b border-slate-300 pb-2 mb-4 font-sans">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-800">
            {personalInfo.fullName} — {isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {formatPageNum(2, totalPages)}
          </span>
        </div>

        {/* Continuation Table */}
        <table className="w-full border-collapse border border-slate-300 font-sans text-xs mb-4">
          <tbody>
            {/* 13. Experience */}
            <tr>
              <td className="border border-slate-300 w-10 px-2.5 py-1.5 text-center font-bold bg-slate-50 text-slate-700 align-top">
                {getSerial(13)}
              </td>
              <td className="border border-slate-300 w-48 px-3 py-1.5 font-semibold bg-slate-50/70 text-slate-900 align-top">
                {t.experience}
              </td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-800">
                {experience && experience.length > 0 ? (
                  <div className="space-y-2">
                    {experience.map((exp, idx) => (
                      <div key={exp.id || idx} className="border-b border-slate-200 pb-1.5 last:border-b-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900">{exp.designation}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{exp.duration}</span>
                        </div>
                        <p className="text-slate-700 text-[11px]">{exp.company}</p>
                        {exp.responsibilities && (
                          <p className="text-slate-600 text-[11px] mt-0.5 whitespace-pre-line">{exp.responsibilities}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>{isBn ? 'প্রযোজ্য নয়' : 'N/A'}</span>
                )}
              </td>
            </tr>

            {/* 14. Skills & Languages */}
            <tr>
              <td className="border border-slate-300 px-2.5 py-1.5 text-center font-bold bg-slate-50 text-slate-700">
                {getSerial(14)}
              </td>
              <td className="border border-slate-300 px-3 py-1.5 font-semibold bg-slate-50/70 text-slate-900">
                {t.skills} ও {t.languages}
              </td>
              <td className="border border-slate-300 px-3 py-1.5 text-slate-800">
                <div className="space-y-1">
                  {skills && skills.length > 0 && (
                    <p>
                      <strong className="font-semibold text-slate-900">{t.skills}:</strong>{' '}
                      {skills.join(', ')}
                    </p>
                  )}
                  {languages && languages.length > 0 && (
                    <p>
                      <strong className="font-semibold text-slate-900">{t.languages}:</strong>{' '}
                      {languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}
                    </p>
                  )}
                </div>
              </td>
            </tr>

            {/* 15. References */}
            {references && references.length > 0 && (
              <tr>
                <td className="border border-slate-300 px-2.5 py-1.5 text-center font-bold bg-slate-50 text-slate-700 align-top">
                  {getSerial(15)}
                </td>
                <td className="border border-slate-300 px-3 py-1.5 font-semibold bg-slate-50/70 text-slate-900 align-top">
                  {t.references}
                </td>
                <td className="border border-slate-300 px-3 py-1.5 text-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {references.map((ref, idx) => (
                      <div key={ref.id || idx} className="text-xs bg-slate-50/80 p-2 border border-slate-200">
                        <p className="font-bold text-slate-900">{ref.name}</p>
                        <p className="text-slate-600 text-[11px]">{ref.designation}, {ref.organization}</p>
                        <p className="text-slate-500 text-[11px] font-mono mt-0.5">{ref.phone} {ref.email && `| ${ref.email}`}</p>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Official Declaration (অঙ্গীকারনামা) */}
        <div className="mb-6 border border-slate-300 bg-slate-50/50 p-3.5 text-justify text-xs text-slate-800 leading-relaxed font-sans">
          <p>
            {isBn
              ? 'অঙ্গীকারনামা: আমি এই মর্মে দৃঢ় অঙ্গীকার করছি যে, উপরে বর্ণিত যাবতীয় তথ্যাবলি সম্পূর্ণ সত্য ও নির্ভুল। ভবিষ্যতে কোনো তথ্য ভুল বা অসত্য প্রমাণিত হলে কর্তৃপক্ষ আমার আবেদনপত্র বা নিয়োগ বাতিল করার সম্পূর্ণ অধিকার সংরক্ষণ করিবেন।'
              : 'Declaration: I hereby declare that the information provided above is true, complete and accurate to the best of my knowledge and belief. If any information is proven to be false or incorrect, the authority reserves the right to reject my application or terminate my appointment.'}
          </p>
        </div>

        {/* Date, Place & Signature Row */}
        <div className="mt-auto pt-6 flex justify-between items-end text-xs font-serif">
          <div>
            <p>{isBn ? 'স্থান: ..............................' : 'Place: ..............................'}</p>
            <p className="mt-2">{isBn ? 'তারিখ: ..............................' : 'Date: ..............................'}</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-slate-800 mb-1.5"></div>
            <p className="font-bold text-slate-900">{t.signature}</p>
          </div>
        </div>
      </div>

      {/* Page 2 Bottom Margin & Footer */}
      <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] font-sans text-slate-500 select-none">
        <span>{personalInfo.fullName} • {isBn ? 'জীবনবৃত্তান্ত' : 'Curriculum Vitae'}</span>
        <span className="font-mono font-medium">{formatPageNum(2, totalPages)}</span>
      </div>
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
