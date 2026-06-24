import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import SurveyForm from '@/components/SurveyForm';
import SurveyClosed from '@/components/SurveyClosed';
import { notFound } from 'next/navigation';

function getCsvData(filename) {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(fileContent, { header: true }).data;
}

export default async function SurveyPage({ params }) {
  const { referal } = await params;
  
  // Ambil data awardees
  const awardees = getCsvData('daftar_awardee.csv');
  const awardee = awardees.find(a => a.Referal === referal);

  if (!awardee || !awardee['Nama Awardee']) {
    return notFound();
  }

  // Batas waktu: 24 Juni 2026 23:59 WIB (UTC+7)
  const DEADLINE = new Date('2026-06-24T23:59:00+07:00');
  const isClosed = new Date() > DEADLINE;

  if (isClosed) {
    return <SurveyClosed awardee={awardee} />;
  }

  // Ambil rubrik
  const rubrics = getCsvData('rubrik_evaluasi.csv').filter(r => r['Indikator Penilaian']);

  return <SurveyForm awardee={awardee} rubrics={rubrics} />;
}

