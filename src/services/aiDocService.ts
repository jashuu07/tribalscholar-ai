import { DocumentVerificationAI, FieldMismatch } from '../types';

/**
 * AI Document Intelligence Service (Mock/Local Abstraction)
 * Simulates OCR, LayoutLM document classification, entity extraction,
 * and cross-validation against student application data.
 * Architecture is cleanly separated so real Tesseract/AWS Textract/Google Cloud Doc AI/LLMs
 * can be plugged in later by replacing the extract & crossValidate pipeline.
 */

export interface AIProcessOptions {
  docType: string;
  fileName: string;
  applicationData: Record<string, any>;
  isCorrectedUpload?: boolean;
  manualOverrideExtractedIncome?: number;
}

export function simulateAIDocumentProcessing(options: AIProcessOptions): DocumentVerificationAI {
  const { docType, fileName, applicationData, isCorrectedUpload, manualOverrideExtractedIncome } = options;
  const mismatches: FieldMismatch[] = [];
  const extractedFields: Record<string, any> = {};
  let confidence = 94 + Math.floor(Math.random() * 5); // 94-98%
  let classification = '';
  let classifiedCorrectly = true;
  let ocrSnippet = '';

  const timestamp = new Date().toISOString();

  switch (docType) {
    case 'INCOME_CERTIFICATE': {
      classification = 'Government Revenue Department Income Certificate (Tahasildar/SDM)';
      classifiedCorrectly = true;

      // Check if this is the critical demo mismatch scenario or a corrected upload
      // Demo case: application income is 180000, but uploaded doc extracted is 280000!
      let docIncome = 180000;
      if (manualOverrideExtractedIncome !== undefined) {
        docIncome = manualOverrideExtractedIncome;
      } else if (isCorrectedUpload) {
        docIncome = applicationData.annualIncome || 180000; // Corrected matches application
      } else if (applicationData.annualIncome === 180000 && !fileName.toLowerCase().includes('corrected')) {
        // Critical Demo Flag: Initial demo upload has mismatched certificate with ₹2,80,000
        docIncome = 280000;
      } else {
        docIncome = applicationData.annualIncome || 180000;
      }

      extractedFields['annualIncome'] = docIncome;
      extractedFields['certificateNo'] = 'REV/INC/2025/89201';
      extractedFields['issuingAuthority'] = 'Revenue Divisional Officer / Tahasildar';
      extractedFields['issueDate'] = '14-Jul-2025';
      extractedFields['validUpto'] = '31-Mar-2026';
      extractedFields['beneficiaryName'] = applicationData.studentName || 'Student Beneficiary';

      ocrSnippet = `GOVERNMENT OF INDIA / STATE REVENUE DEPARTMENT\nCERTIFICATE OF ANNUAL FAMILY INCOME\nCertificate No: REV/INC/2025/89201\nThis is to certify that Sri/Kumari ${applicationData.studentName || 'Candidate'} son/daughter of Sri Ramesh residing at Village/Town is certified to have total gross family annual income of Rs. ${docIncome.toLocaleString('en-IN')}/- (Rupees ${docIncome === 280000 ? 'Two Lakh Eighty Thousand Only' : 'One Lakh Eighty Thousand Only'}) from all sources.\nIssued by: Tahasildar, Revenue Dept.\nDigital Sign Verified.`;

      // Check mismatch against application annual income
      const appIncome = applicationData.annualIncome;
      if (appIncome !== undefined && appIncome !== docIncome) {
        confidence = 95;
        mismatches.push({
          field: 'annualIncome',
          fieldLabel: 'Annual Family Income',
          applicationValue: `₹${appIncome.toLocaleString('en-IN')}`,
          documentValue: `₹${docIncome.toLocaleString('en-IN')}`,
          confidence: 95,
          severity: 'HIGH',
          explanation: 'The annual income extracted from the uploaded certificate does not match the value provided in the application.',
        });
      }
      break;
    }

    case 'ST_CERTIFICATE': {
      classification = 'Scheduled Tribe Community & Domicile Certificate (Form-C)';
      classifiedCorrectly = true;
      extractedFields['certificateNumber'] = applicationData.stCertificateNumber || 'ST/JH/2023/44910';
      extractedFields['community'] = applicationData.stSubCaste || 'Santhal';
      extractedFields['issuingDistrict'] = applicationData.issuingDistrict || 'Ranchi';
      extractedFields['issuingState'] = applicationData.issuingState || 'Jharkhand';
      extractedFields['issuingOfficer'] = 'District Magistrate / Sub-Divisional Officer';
      extractedFields['constitutionalOrder'] = 'The Constitution (Scheduled Tribes) Order, 1950';

      ocrSnippet = `GOVERNMENT REVENUE JURISDICTION\nSCHEDULED TRIBE CERTIFICATE\nCertificate ID: ${extractedFields['certificateNumber']}\nThis is to certify that Shri/Smt/Kumari ${applicationData.studentName || 'Candidate'} belongs to the ${extractedFields['community']} Tribe which is recognized as a Scheduled Tribe under the Constitution (Scheduled Tribes) Order 1950.\nIssuing Authority: SDO, ${extractedFields['issuingDistrict']}.\nBarcode & Digital Signature: Valid`;

      // Cross-check community or certificate number if specified
      if (
        applicationData.stCertificateNumber &&
        extractedFields['certificateNumber'] !== applicationData.stCertificateNumber
      ) {
        mismatches.push({
          field: 'stCertificateNumber',
          fieldLabel: 'ST Certificate Number',
          applicationValue: applicationData.stCertificateNumber,
          documentValue: extractedFields['certificateNumber'],
          confidence: 92,
          severity: 'HIGH',
          explanation: 'Certificate number extracted from document does not match application input.',
        });
      }
      break;
    }

    case 'DEGREE_CERTIFICATE':
    case 'MARKS_MEMO': {
      classification = 'University Post-Graduate Degree / Marks Transcript';
      classifiedCorrectly = true;
      const marks = applicationData.degreePercentage || 68.5;
      extractedFields['degreeName'] = applicationData.degreeName || 'Master of Science';
      extractedFields['university'] = applicationData.universityName || 'Jawaharlal Nehru University';
      extractedFields['percentageOrCgpa'] = `${marks}%`;
      extractedFields['division'] = 'First Class with Distinction';
      extractedFields['passingYear'] = '2024';

      ocrSnippet = `TRANSCRIPT OF ACADEMIC RECORD\n${extractedFields['university']}\nName: ${applicationData.studentName || 'Candidate'}\nDegree Awarded: ${extractedFields['degreeName']}\nAggregate Percentage: ${marks}%\nResult: FIRST CLASS WITH DISTINCTION\nController of Examinations seal verified.`;
      break;
    }

    case 'ADMISSION_LETTER': {
      classification = 'Doctoral / Fellowship Admission Bonafide Letter';
      classifiedCorrectly = true;
      extractedFields['courseName'] = 'Ph.D. in Tribal Studies & Applied Ecology';
      extractedFields['enrollmentDate'] = '01-Aug-2025';
      extractedFields['registrationNumber'] = 'PHD/2025/TR-042';
      extractedFields['mentor'] = applicationData.mentorName || 'Prof. K. Murmu, Head of Dept.';

      ocrSnippet = `OFFICE OF THE REGISTRAR - ACADEMIC SECTION\nBONAFIDE ENROLLMENT CONFIRMATION\nThis is to certify that ${applicationData.studentName || 'Candidate'} is a full-time registered scholar in the Ph.D. programme.\nRegistration No: ${extractedFields['registrationNumber']}\nSupervisor: ${extractedFields['mentor']}.`;
      break;
    }

    case 'PASSPORT': {
      classification = 'Republic of India Passport (Machine Readable Passport - Type P)';
      classifiedCorrectly = true;
      extractedFields['passportNumber'] = 'Z6829104';
      extractedFields['nationality'] = 'INDIAN';
      extractedFields['expiryDate'] = '22-Oct-2032';

      ocrSnippet = `PASSPORT / PASSEPORT\nREPUBLIC OF INDIA\nPassport No: Z6829104\nGiven Names: ${applicationData.studentName || 'Candidate'}\nNationality: INDIAN\nDate of Expiry: 22/10/2032\nP<IND<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
      break;
    }

    default: {
      classification = 'Verified Official Government/Academic Document';
      classifiedCorrectly = true;
      extractedFields['documentTitle'] = docType;
      ocrSnippet = `DOCUMENT RECORD: ${docType}\nVerified against candidate records.\nSecurity Check: PASS`;
      break;
    }
  }

  return {
    confidence,
    classification,
    classifiedCorrectly,
    extractedFields,
    mismatches,
    ocrSnippet,
    isTamperedSuspected: false,
    verificationTimestamp: timestamp,
  };
}
